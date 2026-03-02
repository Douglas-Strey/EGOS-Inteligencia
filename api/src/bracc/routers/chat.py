"""Chat endpoint — conversational interface for EGOS Inteligência.

Phase 1: Direct Neo4j search with structured responses (no LLM).
Phase 2: LLM integration for natural language understanding.
"""

import re
from typing import Annotated, Any

from fastapi import APIRouter, Depends
from neo4j import AsyncSession
from pydantic import BaseModel, Field
from starlette.requests import Request

from bracc.dependencies import get_session
from bracc.middleware.rate_limit import limiter
from bracc.models.entity import SourceAttribution
from bracc.services.neo4j_service import execute_query, sanitize_props
from bracc.services.public_guard import (
    has_person_labels,
    infer_exposure_tier,
    sanitize_public_properties,
    should_hide_person_entities,
)

router = APIRouter(prefix="/api/v1", tags=["chat"])

_CNPJ_RE = re.compile(r"\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}")
_LUCENE_SPECIAL = re.compile(r'([+\-&|!(){}\[\]^"~*?:\\/])')


class ChatMessage(BaseModel):
    message: str = Field(min_length=1, max_length=500)


class EntityCard(BaseModel):
    id: str
    type: str
    name: str
    properties: dict[str, Any] = {}
    connections: int = 0
    sources: list[str] = []


class ChatResponse(BaseModel):
    reply: str
    entities: list[EntityCard] = []
    suggestions: list[str] = []


def _detect_intent(message: str) -> tuple[str, str]:
    """Detect user intent and extract the search term."""
    msg = message.strip()

    cnpj_match = _CNPJ_RE.search(msg)
    if cnpj_match:
        return "cnpj_lookup", cnpj_match.group()

    # Remove common Portuguese stopwords to extract meaningful terms
    cleaned = re.sub(
        r"\b(quem|qual|quais|onde|como|sobre|me|fale|busque|pesquise|procure|"
        r"encontre|mostre|o que|é|são|do|da|de|dos|das|no|na|nos|nas|"
        r"um|uma|uns|umas|para|por|com|em|a|e|ou|os|as|ao|à|"
        r"tem|ter|foi|ser|está|estão|pode|podem)\b",
        "",
        msg.lower(),
    )
    cleaned = re.sub(r"\s+", " ", cleaned).strip()

    if len(cleaned) < 2:
        return "greeting", ""

    return "search", cleaned


def _build_search_query(raw: str) -> str:
    """Build Lucene query with wildcards for partial matching."""
    raw = raw.strip()
    if any(c in raw for c in ['"', "*", "~", "AND", "OR"]):
        return raw
    escaped = _LUCENE_SPECIAL.sub(r"\\\1", raw)
    terms = escaped.split()
    parts: list[str] = []
    for term in terms:
        if len(term) >= 2:
            parts.append(f"{term}*")
            parts.append(f"{term}~0.8")
        else:
            parts.append(term)
    return " ".join(parts)


def _extract_name(node: Any, labels: list[str]) -> str:
    props = dict(node)
    etype = labels[0].lower() if labels else ""
    if etype == "company":
        return str(props.get("razao_social", props.get("name", props.get("nome_fantasia", ""))))
    if etype in ("contract", "amendment", "convenio"):
        return str(props.get("object", props.get("function", props.get("name", ""))))
    if etype == "embargo":
        return str(props.get("infraction", props.get("name", "")))
    if etype == "publicoffice":
        return str(props.get("org", props.get("name", "")))
    return str(props.get("name", ""))


def _format_type_pt(etype: str) -> str:
    """Return Portuguese label for entity type."""
    labels = {
        "company": "Empresa",
        "person": "Pessoa",
        "contract": "Contrato",
        "sanction": "Sanção",
        "publicoffice": "Cargo Público",
        "embargo": "Embargo",
        "convenio": "Convênio",
        "election": "Eleição",
        "finance": "Financeiro",
        "partner": "Sócio",
    }
    return labels.get(etype, etype.capitalize())


GREETING_RESPONSE = ChatResponse(
    reply=(
        "Olá! Sou o assistente do **EGOS Inteligência**.\n\n"
        "Posso ajudar você a pesquisar empresas, contratos, sanções e conexões "
        "em dados públicos brasileiros.\n\n"
        "Experimente:\n"
        "• Nome de uma empresa\n"
        "• Um CNPJ (ex: 12.345.678/0001-90)\n"
        "• \"Sanções contra empresa X\"\n"
        "• \"Contratos em São Paulo\""
    ),
    suggestions=[
        "Pesquisar empresa por CNPJ",
        "Buscar sanções recentes",
        "Ver estatísticas do grafo",
        "Ver relatório Patense",
    ],
)


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("30/minute")
async def chat(
    request: Request,
    body: ChatMessage,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> ChatResponse:
    """Conversational search interface for EGOS Inteligência."""

    intent, term = _detect_intent(body.message)

    if intent == "greeting":
        return GREETING_RESPONSE

    # Build search query
    if intent == "cnpj_lookup":
        cnpj_clean = re.sub(r"[.\-/]", "", term)
        search_query = f'"{cnpj_clean}"'
    else:
        search_query = _build_search_query(term)

    # Execute search against Neo4j
    try:
        records = await execute_query(
            session,
            "search",
            {
                "query": search_query,
                "entity_type": None,
                "skip": 0,
                "limit": 5,
            },
        )
    except Exception:
        return ChatResponse(
            reply="Desculpe, houve um erro ao consultar o banco de dados. Tente novamente em instantes.",
            suggestions=["Tentar novamente", "Buscar por CNPJ"],
        )

    # Process results
    entities: list[EntityCard] = []
    for record in records:
        node = record["node"]
        props = dict(node)
        labels = record["node_labels"]

        if should_hide_person_entities() and has_person_labels(labels):
            continue

        source_val = props.pop("source", None)
        sources: list[str] = []
        if isinstance(source_val, str):
            sources = [source_val]
        elif isinstance(source_val, list):
            sources = [str(s) for s in source_val]

        etype = labels[0].lower() if labels else "unknown"
        clean_props = sanitize_public_properties(sanitize_props(props))

        entities.append(EntityCard(
            id=record["node_id"],
            type=etype,
            name=_extract_name(node, labels),
            properties=clean_props,
            connections=0,
            sources=sources,
        ))

    # Build reply
    if not entities:
        reply = f'Não encontrei resultados para **"{term}"**.\n\nTente:\n• Verificar a ortografia\n• Usar o CNPJ completo\n• Buscar por razão social'
        suggestions = ["Buscar por CNPJ", "Ver estatísticas", "Ver relatório Patense"]
    elif len(entities) == 1:
        e = entities[0]
        reply = f"Encontrei **{_format_type_pt(e.type)}**: **{e.name}**"
        if e.sources:
            reply += f"\n\n📊 Fonte: {', '.join(e.sources)}"
        suggestions = [f"Ver conexões de {e.name[:30]}", "Buscar outro", "Ver estatísticas"]
    else:
        reply = f"Encontrei **{len(entities)} resultados** para \"{term}\":\n\n"
        for i, e in enumerate(entities, 1):
            reply += f"{i}. **{e.name}** ({_format_type_pt(e.type)})\n"
        suggestions = ["Refinar busca", "Buscar por CNPJ", "Ver estatísticas"]

    return ChatResponse(
        reply=reply,
        entities=entities,
        suggestions=suggestions,
    )
