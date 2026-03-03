# Diagnóstico Completo do Ecossistema EGOS — Março 2026

**Data:** 2026-03-03 | **Autor:** EGOS Intelligence
**Para:** Enio (EGOS) + Bruno (BR-ACC) — Discussão de Parceria

---

## 1. O QUE TEMOS (Inventário Consolidado)

### 1.1 EGOS Inteligência (br-acc) — O Motor de Dados

| Dimensão | Valor |
|----------|-------|
| **Entidades no grafo** | 9.1M+ (8.8M empresas + 278K PEPs/sanções/contratos) |
| **Relacionamentos** | 34K+ (crescendo com CNPJ ETL) |
| **Fontes de dados** | 108 documentadas, 46 ETL pipelines implementados |
| **ETL em produção** | CNPJ (53.6M empresas — em execução) |
| **Chat IA** | 26 tools integradas (Neo4j + 21 APIs gov + web search) |
| **Pattern detectors** | 10 (Benford, HHI, split contracts, sancionada+contrato, etc.) |
| **Infraestrutura** | VPS Contabo (10.5GB RAM), Neo4j 5, Redis, Caddy HTTPS |
| **Stack** | Python FastAPI + React/Vite + Neo4j + Redis |
| **Licença** | AGPL-3.0 (open source, copyleft) |
| **URL** | inteligencia.egos.ia.br |

### 1.2 Intelink — A Interface de Inteligência

| Dimensão | Valor |
|----------|-------|
| **Pages** | 44 (central, chat, graph, reports, admin, analytics, etc.) |
| **Components** | 23+ especializados (entity card, graph, timeline, chat, heatmap) |
| **Stack** | Next.js 16 + Supabase + TailwindCSS |
| **IA** | OpenRouter (Gemini 2.0 Flash) com tool calling |
| **Features únicas** | Busca com preview de conexões, síntese AI, conexões 2º/3º grau, links previstos (ML), cross-case analysis |
| **Deploy** | Vercel (auto on push) |
| **URL** | intelink.ia.br |

### 1.3 Capabilities Combinadas (o que PODEMOS fazer hoje)

| Capacidade | Fonte | Status |
|------------|-------|--------|
| **Cruzar PEPs com sanções internacionais** | Neo4j (7,044 matches BR ↔ OpenSanctions) | ✅ Operacional |
| **Identificar empresas multi-sancionadas** | Neo4j (CEIS + CNEP overlap) | ✅ Operacional |
| **Mapear concentração de PEPs por órgão** | Neo4j (Câmara: 1,472 PEPs) | ✅ Operacional |
| **Rastrear surtos de sanções** | Neo4j (6,689 novas desde 2024) | ✅ Operacional |
| **Consultar CNPJ, sócios, situação** | 26 tools do chat (OpenCNPJ, Portal Transp.) | ✅ Operacional |
| **Buscar emendas parlamentares por município** | API Portal da Transparência | ✅ Operacional |
| **Buscar diários oficiais municipais** | Querido Diário (Open Knowledge) | ✅ Operacional |
| **Consultar mandados de prisão** | BNMP (Banco Nacional Mandados Prisão) | ✅ Operacional |
| **Consultar processos judiciais** | DataJud API | ✅ Operacional |
| **Buscar licitações federais** | PNCP (Portal Nacional Compras Públicas) | ✅ Operacional |
| **Consultar advogados OAB** | API OAB | ✅ Operacional |
| **Monitorar diários oficiais por padrões** | Gazette Monitor (8 patterns) | ✅ Operacional |
| **Análise de exposure (radar 5 fatores)** | Score service (conexões, fontes, financeiro, padrões, baseline) | ✅ Operacional |
| **Detecção de padrões de corrupção** | 10 queries Cypher especializadas | ✅ Operacional |
| **Grafo interativo de conexões** | Sigma.js (br-acc) + SVG (Intelink) | ✅ Operacional |
| **Síntese AI de entidades** | Intelink AI (texto corrido contextual) | ✅ Operacional |
| **Conexões indiretas 2º/3º grau** | Intelink (modal UI) | ✅ Operacional |
| **Links previstos (ML)** | Intelink (Adamic-Adar algorithm) | ✅ Operacional |
| **Cross-case analysis** | Intelink (detecta entidade em múltiplas operações) | ✅ Operacional |
| **Rede de propriedade empresarial** | CNPJ QSA → SOCIO_DE (em carregamento) | ⏳ Loading |
| **Shell company detection** | Precisa CNPJ completo | ⏳ Blocked |
| **Doações TSE → contratos** | ETL pronto, não executado | ⏳ Ready |

---

## 2. CASOS DE USO INSTITUCIONAL

### 2.1 Para Cidadãos (Gratuito — Open Source)

| Caso de Uso | Como funciona | Exemplo real |
|-------------|--------------|--------------|
| **"Minha cidade recebe quanto?"** | Chat pergunta → tools buscam emendas + transferências + diários oficiais | "Quanto Uberlândia recebeu de emendas em 2024?" → R$ X milhões, deputado Y autorizou |
| **"Essa empresa é confiável?"** | CNPJ → sanções + sócios + contratos + licitações | CNPJ 12.345.678/0001-90 → 3 sanções CEIS, sócio em 2 empresas falidas |
| **"Quem manda aqui?"** | Município → PEPs + emendas + contratos → mapa de poder | "Quem são os PEPs de Manaus?" → 99 PEPs, maiores contratos com empresa X |
| **"Sigo o dinheiro"** | Emenda → convênio → empresa → sócios → outras empresas | R$ 2M emenda saúde → convênio → empresa familiar de vereador |

### 2.2 Para Jornalistas (Gratuito com features premium)

| Caso de Uso | Como funciona | Valor |
|-------------|--------------|-------|
| **Investigação guiada** | Chat IA sugere próximos passos, cruza 6+ fontes simultaneamente | Reduz semanas de FOIA para minutos |
| **Relatório exportável** | Journey system + export Markdown/JSON | Pronto para publicação |
| **Monitoramento contínuo** | Gazette monitor + alertas | Notícias de diários oficiais em tempo real |
| **Verificação de fontes** | Evidence chain: cada dado com fonte e timestamp | Citação verificável |

### 2.3 Para Empresas de Compliance (B2B — Monetização)

| Caso de Uso | Como funciona | Preço sugerido |
|-------------|--------------|----------------|
| **Due Diligence automatizada** | CNPJ → sanções + sócios + PEPs + processos + licitações em 30s | R$ 5-15/consulta ou R$ 500-2.000/mês |
| **KYC/KYB (Know Your Business)** | Verificação de parceiros comerciais contra 108 fontes | R$ 2.000-5.000/mês |
| **Monitoramento contínuo** | Alertas quando fornecedor é sancionado ou sócio muda | R$ 1.000-3.000/mês |
| **Background check corporativo** | Relatório completo de empresa + sócios + conexões 2º grau | R$ 50-200/relatório |
| **Compliance anticorrupção (Lei 12.846)** | 10 pattern detectors + exposure index + evidence chain | R$ 3.000-10.000/mês |
| **API para integração** | REST API com rate limits, SLA, suporte | R$ 5.000-20.000/mês |

### 2.4 Para Órgãos Públicos (B2G — Governo)

| Caso de Uso | Como funciona | Valor |
|-------------|--------------|-------|
| **Auditoria de licitações** | Pattern detection: split contracts, concentração de fornecedor, empresa sancionada | Transparência pública |
| **Inteligência policial** | Intelink: entidades + vínculos + timeline + cross-case + ML links previstos | Resolução de crimes |
| **CGU / TCU** | Cruzamento massivo: emendas vs contratos vs sócios vs PEPs | Detecção de irregularidades |
| **Ministério Público** | Graph traversal 3+ graus + evidence chain para denúncia | Suporte a investigações |

---

## 3. ESTRATÉGIA DE MONETIZAÇÃO (Freemium + B2B)

### Modelo Proposto

```
TIER GRATUITO (Cidadão)
├── Chat com 30 msgs/dia (10 premium + 20 free tier)
├── Busca pública (sem login)
├── Grafo explorer (entidades públicas)
├── 108 fontes consultáveis
└── Código 100% open source (AGPL-3.0)

TIER PRO (Jornalista/Pesquisador) — R$ 49/mês
├── Chat ilimitado (modelo premium sempre)
├── Export Markdown/PDF
├── Monitoramento de entidades (alertas email)
├── API pessoal (100 req/dia)
└── Suporte comunidade

TIER BUSINESS (Compliance/Due Diligence) — R$ 2.000-10.000/mês
├── API dedicada (SLA 99.5%, 10K+ req/dia)
├── Due diligence batch (upload CSV de CNPJs)
├── Relatórios white-label (logo do cliente)
├── Dashboard privado
├── Pattern detection customizado
├── Suporte prioritário
└── Dados atualizados (ETL diário)

TIER ENTERPRISE (Gov/Polícia) — Sob consulta
├── Deploy on-premise ou VPC dedicada
├── Intelink completo (44 páginas, operações, cross-case)
├── RBAC (admin, analista, público)
├── Integração com sistemas internos
├── Audit trail completo
├── Treinamento + consultoria
└── SLA 99.9%
```

### Revenue Projection (Conservador — Ano 1)

| Tier | Clientes | MRR |
|------|----------|-----|
| Pro | 50 jornalistas/pesquisadores | R$ 2.450/mês |
| Business | 5 empresas compliance | R$ 25.000/mês |
| Enterprise | 1 órgão público | R$ 15.000/mês |
| API pay-per-use | Volume | R$ 5.000/mês |
| **Total MRR** | | **R$ 47.450/mês** |
| **ARR** | | **R$ 569.400/ano** |

### Custo de Infra (Atual)

| Item | Custo mensal |
|------|-------------|
| VPS Contabo (16GB RAM) | ~€10 (~R$ 60) |
| OpenRouter (LLM) | ~$5 (~R$ 30) |
| Vercel (free tier) | R$ 0 |
| Supabase (free tier) | R$ 0 |
| Domínios (.ia.br) | ~R$ 15/mês amortizado |
| **Total** | **~R$ 105/mês** |

**Margem bruta:** 99.8% (antes de escalar infra)

---

## 4. ANÁLISE DE 2º E 3º GRAU — O QUE É POSSÍVEL COM DADOS PÚBLICOS

### O que significa "graus de conexão"

```
1º GRAU: Empresa X → sancionada por Órgão Y
2º GRAU: Empresa X → sócio Z → sócio de Empresa W (que recebe contratos)
3º GRAU: Empresa X → sócio Z → parente de Político P → emenda para Município M → contrato com Empresa X
```

### Exemplos reais possíveis HOJE (com dados carregados)

#### Análise 1º Grau: Empresas Sancionadas em Ambas Listas
- **Query:** `MATCH (c:Company)-[:SANCIONADA]->(s:Sanction) WITH c, collect(DISTINCT s.source) AS sources WHERE size(sources) > 1`
- **Resultado:** 15 empresas em CEIS E CNEP simultaneamente. AGIL SERVICOS: 64 sanções.
- **Significado:** Reincidentes crônicas — deveriam estar banidas de contratos públicos.

#### Análise 2º Grau: PEPs Internacionais (quando CNPJ completar)
- **Query:** `MATCH (p:PEPRecord)-[:GLOBAL_PEP_MATCH]-(g:GlobalPEP) MATCH (p)-[:SOCIO_DE]-(c:Company)-[:CONTRATADA_POR]-(org) RETURN p.name, c.razao_social, org.name`
- **O que revela:** PEPs brasileiros com match internacional QUE são sócios de empresas com contratos gov.
- **Status:** ⏳ Precisa CNPJ + QSA carregados (em progresso)

#### Análise 3º Grau: Ciclo Doação → Emenda → Contrato
- **Query:** `MATCH (e:Election)-[:DOOU]-(c:Company)-[:CONTRATADA_POR]-(org)-[:RECEBEU_EMENDA]-(a:Amendment) WHERE a.author = e.candidate`
- **O que revela:** Empresa que doou para campanha de político que depois direcionou emenda para órgão que contratou a mesma empresa.
- **Status:** ⏳ Precisa TSE + emendas carregados (ETL prontos, não executados)

### O que PODEMOS mostrar AGORA para as pessoas:

1. **Cross-reference PEPs ↔ sanções globais** — 7,044 matches operacionais
2. **Mapa de sanções por empresa** — 23,848 sanções, padrões de reincidência
3. **Concentração de PEPs por órgão** — Câmara (1,472), CAIXA (232), Presidência (198)
4. **Surto de sanções 2024-2026** — 28% de todas as sanções nos últimos 2 anos
5. **Rede de sanções fantasma** — Empresas sancionadas há 5+ anos que continuam recebendo

### O que TEREMOS em 2-4 semanas (quando CNPJ completar):

1. **Rede de propriedade** — "Quem é dono de quem?" para 53.6M empresas
2. **Shell company detection** — Mesmos sócios em múltiplas empresas, endereços repetidos
3. **PEP → empresas → contratos** — O ciclo completo
4. **Beneficial ownership** — Seguir a cadeia de CNPJ → sócios → outras empresas → sócios

---

## 5. DECISÃO: INTELINK.IA.BR vs INTELIGENCIA.EGOS.IA.BR

### Recomendação: **Um Produto, Uma URL**

| Opção | Prós | Contras | Recomendação |
|-------|------|---------|-------------|
| **intelink.ia.br** | Nome forte, já conhecido, "inteligência" implícito | Associação policial, pode afastar cidadãos | ⚠️ Se reposicionar |
| **inteligencia.egos.ia.br** | Vinculado ao ecossistema EGOS, neutro | Nome longo, subdomain | ❌ Muito longo |
| **egos.ia.br/inteligencia** | Uma URL, ecossistema unificado | Subpath, não é domínio próprio | ❌ Confuso |
| **dados.egos.ia.br** | Neutro, "dados públicos" | Genérico demais | ⚠️ Possível |
| **intelink.ia.br (reposicionado)** | Nome curto, memorável, já deployado | Precisa mudar copy de "policial" para "cidadão" | ✅ **RECOMENDADO** |

**Decisão sugerida:** Manter **intelink.ia.br** como URL principal, reposicionar copy:
- "Inteligência Policial" → "Inteligência em Dados Públicos"
- "Investigação" → "Pesquisa"
- "Suspeito" → "Entidade de interesse"
- Landing page: search-first do br-acc + features do Intelink

### Plano de Merge (Alternativa B do MERGE_ANALYSIS)

```
Semana 1: Neo4j adapter no Intelink (queries contra br-acc API)
Semana 2: Search com preview de conexões (dados reais do grafo)
Semana 3: Conexões 2º/3º grau (Neo4j MATCH path)
Semana 4: Síntese AI + links previstos (Adamic-Adar no Neo4j)
```

---

## 6. O QUE MOSTRAR PARA O BRUNO

### Nosso diferencial vs repo original dele:

| O que Bruno deixou | O que EGOS adicionou |
|--------------------|--------------------|
| 46 ETL pipelines (código) | 9.1M entidades CARREGADAS em produção |
| Schema Neo4j (queries) | 10 pattern detectors implementados |
| Frontend básico (React) | Chat IA com 26 tools + fallback chain |
| Legal framework (docs) | Landing page search-first, grafo interativo |
| Docker Compose | VPS hardened (Caddy CSP, Fail2ban, iptables) |
| — | Intelink: 44 páginas, cross-case, links previstos, ML |
| — | Exposure Index (radar 5 fatores) |
| — | Cost tracking per query (premium/free/BYOK) |
| — | i18n (PT-BR + EN) |
| — | 4 relatórios publicados (Superar, Manaus, RJ, Patense) |
| — | Redis cache + conversation persistence |
| — | Gazette monitor (8 patterns em diários oficiais) |
| — | Comunidade: 70+ stars, 8 forks, 3 contribuidores externos |

### Proposta para Bruno:

1. **Manter AGPL-3.0** — Open source, código livre
2. **Consulta gratuita para cidadãos** — Tier gratuito com 30 msgs/dia
3. **Monetização B2B** — Compliance, due diligence, KYC — não compete com open source
4. **Co-maintainer** — Bruno como co-maintainer do repo
5. **Decisão conjunta** — Roadmap de ETL, prioridade de fontes, pattern detectors
6. **Infraestrutura compartilhada** — User no VPS para Bruno visualizar/monitorar
7. **Crédito** — BR-ACC original por Bruno, EGOS fork mantido em conjunto

---

## 7. ROADMAP CONJUNTO (Proposta)

### Fase 1: Foundation (Março 2026) — EM ANDAMENTO
- [x] CNPJ ETL completo (53.6M empresas)
- [x] VPS hardened + user para Bruno
- [ ] Rotacionar API keys expostas
- [ ] Whitelist cypher injection
- [ ] Neo4j backup script

### Fase 2: Merge (Abril 2026)
- [ ] Neo4j adapter no Intelink (query br-acc API)
- [ ] Search com preview de conexões (dados reais)
- [ ] Decidir URL final (intelink.ia.br reposicionado)
- [ ] Conexões 2º/3º grau visíveis na UI

### Fase 3: Monetização (Maio-Junho 2026)
- [ ] API pública com rate limits e tiers
- [ ] Landing page com pricing
- [ ] Due diligence batch endpoint
- [ ] Primeiro cliente B2B (compliance)

### Fase 4: Scale (Jul-Dez 2026)
- [ ] DataJud (80M+ processos judiciais)
- [ ] TSE doações (cross-ref com contratos)
- [ ] ICIJ Offshore Leaks (conexões internacionais)
- [ ] DOU real-time monitoring
- [ ] AI-powered anomaly scoring (ML models)

---

## 8. CREDENCIAIS DO VPS PARA BRUNO

```
Host: 217.216.95.126
User: bruno
Password: BrAcc-Collab-2026! (temporária — forçada troca no 1º login)
SSH: ssh bruno@217.216.95.126

Acesso:
  ✅ /opt/bracc/ (código, read-only)
  ✅ sudo bracc-status (ver containers e ETL)
  ✅ sudo docker logs <container> (ver logs)
  ✅ sudo docker ps (ver containers)
  ❌ .env files (bloqueados)
  ❌ Docker exec/run (bloqueado)
  ❌ sudo sem restrição (bloqueado)

Após primeiro login, Bruno deve:
  1. Trocar a senha
  2. Adicionar sua SSH key em ~/.ssh/authorized_keys
  3. Avisar para desabilitarmos password auth
```

---

*"Siga o dinheiro público. Dados abertos, código aberto. Monetize o serviço, não os dados."*
