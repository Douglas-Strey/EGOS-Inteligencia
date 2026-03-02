# Investigações Demonstrativas — BR/ACC Open Graph

> **Data:** 2026-03-02 | **Nós no Grafo:** 278.501 | **Relacionamentos:** 30.916
> **Fontes Carregadas:** CEIS, CNEP, PEP CGU, OpenSanctions, TSE 2022+2024
> **Autor:** EGOS Intelligence (automatizado via Neo4j Cypher)

⚠️ **AVISO LEGAL:** Padrões encontrados nos dados são **sinais estatísticos**, não prova jurídica. Toda conclusão exige revisão humana. Ver [DISCLAIMER.md](../../DISCLAIMER.md) e [ETHICS.md](../../ETHICS.md).

---

## Investigação 1: Reincidentes Seriais — Empresas em CEIS + CNEP

**Pergunta:** Quais empresas aparecem em AMBAS as listas de sanções (CEIS = impedidas de contratar com governo, CNEP = sanções a entidades sem fins lucrativos)?

**Método:** `MATCH (c:Company)-[:SANCIONADA]->(s:Sanction) WHERE size(collect(DISTINCT s.source)) > 1`

| Empresa | CNPJ | Sanções | Listas |
|---------|------|---------|--------|
| AGIL SERVICOS EIRELI | 26.427.482/0001-54 | 64 | CEIS + CNEP |
| ALPINO DISTRIBUIDORA LTDA | 46.743.542/0001-55 | 21 | CEIS + CNEP |
| WM SERVICOS TECNICOS | 23.868.882/0001-07 | 18 | CEIS + CNEP |
| PRIMUS CONSTRUCOES | 21.414.475/0001-02 | 13 | CEIS + CNEP |
| MG TERCEIRIZACAO | 01.278.154/0001-02 | 9 | CEIS + CNEP |
| CONSTRUTORA COESA SA | 14.310.577/0001-04 | 8 | CEIS + CNEP |
| STRONGHOLD GROUP FACILITIES | 09.324.222/0001-34 | 8 | CEIS + CNEP |
| GALVAO ENGENHARIA S/A | 01.340.937/0001-79 | 6 | CEIS + CNEP |

**Significância:** 15 empresas aparecem em ambas as listas. AGIL SERVICOS com 64 sanções é um outlier extremo. Presença dual indica padrão de violações repetidas em diferentes órgãos de fiscalização.

**O que falta:** Com dados CNPJ (QSA), poderíamos verificar se essas empresas compartilham sócios — indicando possível rede coordenada.

---

## Investigação 2: KLASS — 17 Anos de Sanções Contínuas (2007-2024)

**Pergunta:** Existem empresas que recebem sanções há mais de uma década?

**Caso:** KLASS COMERCIO E REPRESENTAÇÃO LTDA (CNPJ: 02.332.985/0001-88)

| Data | Tipo | Fonte |
|------|------|-------|
| 2007-10-19 | Declaração de Inidoneidade sem prazo | CEIS |
| 2008-03-19 | Declaração de Inidoneidade sem prazo | CEIS |
| 2008-05-19 | Declaração de Inidoneidade sem prazo | CEIS |
| 2016-06-09 | Impedimento de contratar (prazo) | CEIS |
| 2016-11-04 | Impedimento de contratar (prazo) | CEIS |
| 2016-11-30 | Impedimento de contratar (prazo) | CEIS |
| 2017-03-13 | Impedimento de contratar (prazo) | CEIS |
| 2017-11-13 | Impedimento de contratar (prazo) | CEIS |
| 2018-11-28 | Impedimento de contratar (prazo) | CEIS |
| 2019-07-30 | Impedimento de contratar (prazo) | CEIS |
| ... | + mais sanções até 2024 | CEIS |

**Significância:** 21 sanções ao longo de 17 anos. Declarada "inidônea" em 2007, continuou recebendo sanções por impedimento até 2024. Isso levanta questões sobre a eficácia do sistema de sanções — como uma empresa declarada inidônea pode continuar operando por 17 anos?

**Ação sugerida (com CNPJ):** Verificar se a empresa mudou de CNPJ, se os sócios abriram novas empresas, se houve licitações ganhas no período.

---

## Investigação 3: WTRADE — Sancionada Até 2028

**Pergunta:** Quais empresas têm sanções vigentes que vão até o futuro?

**Caso:** WTRADE INTERMEDIAÇÃO DE NEGOCIOS LTDA (CNPJ: 21.856.981/0001-43)

| Início | Fim | Tipo |
|--------|-----|------|
| 2021-05-18 | 2026-05-18 | Suspensão |
| 2023-07-27 | **2028-07-27** | Suspensão |
| 2023-08-02 | 2024-08-01 | Impedimento |
| 2024-06-17 | 2026-06-17 | Impedimento |
| 2024-07-24 | 2026-07-24 | Impedimento |
| 2024-08-28 | 2026-08-27 | Impedimento |
| 2024-09-09 | 2026-09-09 | Suspensão |
| 2025-06-23 | **2028-06-22** | Impedimento |
| 2025-07-03 | **2028-07-03** | Impedimento |
| 2025-07-10 | 2027-07-09 | Impedimento |

**Significância:** 15 sanções acumuladas, com suspensões que vão até 2028. A empresa continua recebendo NOVAS sanções mesmo enquanto as anteriores estão vigentes. Isso sugere que ela tenta participar de novas licitações apesar de estar impedida.

---

## Investigação 4: Concentração de PEPs — Onde o Poder Político Se Acumula

**Pergunta:** Quais organizações têm mais Pessoas Politicamente Expostas?

| Organização | PEPs | Tipo |
|------------|------|------|
| Câmara dos Deputados | 1.472 | Legislativo Federal |
| CAIXA | 232 | Banco Estatal |
| Presidência da República | 198 | Executivo |
| Estado da Bahia | 194 | Governo Estadual |
| Senado Federal | 184 | Senado |
| Banco do Brasil | 173 | Banco Estatal |
| Ministério da Economia | 109 | Ministério |
| Estado do Amazonas | 99 | Governo Estadual |
| São Paulo (capital) | 99 | Municipal |
| Fortaleza | 88 | Municipal |

**Significância:** A Câmara concentra 1.472 PEPs — 10x mais que qualquer ministério. Bancos estatais (CAIXA + BB) somam 405 PEPs. Com CNPJ carregado, poderemos cruzar CPFs de PEPs → empresas que eles possuem → contratos que essas empresas ganham.

**Distribuição por cargo:**
- Vereadores: 102.676 (85%)
- Prefeitos: 9.949 (8.3%)
- Deputados: 1.489 (1.2%)
- Outros (secretários, diretores, etc.): ~6k

---

## Investigação 5: Cruzamento Global — PEPs Brasileiros no OpenSanctions

**Pergunta:** Quantos PEPs brasileiros aparecem em listas internacionais?

**Resultado:** **7.044 matches** entre registros CGU e OpenSanctions.

Isso significa que 7.044 pessoas politicamente expostas brasileiras também aparecem em listas de sanções, PEPs, ou watchlists de outros países ou organizações internacionais.

**O que isso habilita:**
- Detectar se um político brasileiro aparece em listas de sanções da EU/EUA
- Cruzar com dados ICIJ Offshore (quando ETL rodar)
- Identificar PEPs com conexões corporativas internacionais

---

## Investigação 6: Tsunami de Sanções 2024-2026

**Resultado:** **6.689 empresas** sancionadas desde janeiro de 2024.

Isso representa ~28% de todas as sanções (6.689 / 23.848) aplicadas nos últimos 2 anos. Possíveis interpretações:
1. Aumento da fiscalização (positivo)
2. Aumento real de irregularidades (negativo)
3. Digitalização dos registros (neutro)

**Com CNPJ:** Poderemos verificar se essas empresas sancionadas continuam participando de licitações em outros estados/municípios.

---

## Investigação 7: A Rede Fantasma — Galvão Engenharia e a Lava Jato

**Caso:** GALVAO ENGENHARIA S/A (CNPJ: 01.340.937/0001-79)

Empresa aparece com 6 sanções em CEIS + CNEP. O nome é familiar — Galvão Engenharia foi uma das empresas investigadas na Operação Lava Jato.

**O que temos:** Sanções em ambas as listas (governo + entidades)
**O que falta (CNPJ):** QSA para mapear sócios → outras empresas → contratos → doações TSE
**O que falta (ICIJ):** Verificar se aparece nos Panama/Paradise Papers

Este caso ilustra perfeitamente o potencial do sistema: com todas as bases carregadas, poderíamos mapear toda a rede corporativa em segundos.

---

## Investigação 8: Construtora Coesa — Padrão de Construção Civil

**Caso:** CONSTRUTORA COESA SA (CNPJ: 14.310.577/0001-04) — 8 sanções em CEIS + CNEP

O setor de construção civil é historicamente um dos mais afetados por irregularidades em licitações públicas. Apenas no nosso dataset parcial, temos:
- CONSTRUTORA COESA SA: 8 sanções
- PRIMUS CONSTRUCOES: 13 sanções
- CONSTRUTORA JR: sancionada em 2025
- SANJUAN ENGENHARIA: 21 sanções

**Padrão:** Construção civil + sanções múltiplas + longo período = forte sinal para investigação de rede.

---

## Investigação 9: Face Card — Administradora de Cartões Sancionada

**Caso:** FACE CARD ADMINISTRADORA DE CARTÕES (CNPJ: 21.935.659/0001-00) — 19 sanções CEIS

Uma administradora de cartões com 19 sanções é particularmente preocupante porque:
1. Empresas financeiras têm acesso a dados sensíveis
2. Cartões podem ser usados para lavagem de dinheiro
3. 19 sanções sugerem operação contínua apesar dos impedimentos

**Com CNPJ:** Verificar sócios, empresas relacionadas, e se há vínculo com PEPs.

---

## Investigação 10: O Que Ainda Não Podemos Ver (Gaps no Sistema)

### Cruzamentos que PRECISAM de dados CNPJ (53.6M empresas):
- PEP possui empresa → empresa ganha contrato do próprio PEP (self-dealing)
- Empresa sancionada muda de CNPJ → continua contratando
- Sócios compartilhados entre empresa sancionada e empresa ativa
- Endereço fiscal compartilhado (shell companies)

### Cruzamentos que PRECISAM de DataJud (80M processos):
- Empresa sancionada tem processos judiciais?
- PEP tem processos por improbidade?
- Réus condenados continuam como sócios de empresas ativas?

### Cruzamentos que PRECISAM de ICIJ Offshore:
- PEPs brasileiros com empresas offshore
- Empresas sancionadas com controladores em paraísos fiscais

---

## Resumo: Capacidade Atual vs Potencial

| Dimensão | Hoje (278k nós) | Com CNPJ (+53.6M) | Com Tudo (+130M) |
|----------|-----------------|-------------------|--------------------|
| **Sanções** | ✅ 23.8k sanções cruzadas | ✅ + proprietários | ✅ + judicial |
| **PEPs** | ✅ 120k registros | ✅ + empresas que possuem | ✅ + offshores |
| **Cross-ref global** | ✅ 7k matches OpenSanctions | ✅ + ICIJ | ✅ + EU/OFAC |
| **Contratos** | ⚠️ 10 (seed) | ✅ ComprasNet/PNCP | ✅ + estaduais |
| **Doações TSE** | ⚠️ Contagem | ✅ Individual | ✅ + bens declarados |
| **Shell companies** | ❌ | ✅ Detecção por QSA | ✅ + offshore |

### O que a comunidade pode ajudar:

1. **Rodar ETL CNPJ** — Requer ~100GB disco, ~4h processamento
2. **Rodar ETL ICIJ** — 73MB já baixado, precisa adaptar pipeline
3. **Criar novos detectores** — Benford, HHI, Network Centrality
4. **Melhorar frontend** — Visualização de grafo, busca em linguagem natural
5. **Documentar padrões** — Cada investigação acima pode virar um tutorial

---

*"Dados públicos são sinais, não acusações. Nossa missão é torná-los acessíveis a todos."*

*Gerado por EGOS Intelligence em 2026-03-02. Todos os dados são públicos e obtidos de fontes oficiais do governo brasileiro.*
