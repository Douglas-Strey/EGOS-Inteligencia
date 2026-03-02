# FAQ — Perguntas Frequentes

> **EGOS Inteligência** — Plataforma open-source de investigação em dados públicos brasileiros.
> https://inteligencia.egos.ia.br

---

## O que é o EGOS Inteligência?

É uma plataforma gratuita e de código aberto que cruza dados públicos brasileiros para investigar empresas, contratos, sanções, emendas parlamentares e conexões políticas. Funciona como um "Google dos dados públicos" — você digita um CNPJ, nome de empresa ou cidade e a plataforma busca em mais de 100 fontes oficiais.

## É legal usar esses dados?

**Sim.** Todos os dados vêm de fontes públicas oficiais do governo brasileiro, protegidos pela Lei de Acesso à Informação (LAI — Lei 12.527/2011) e pela Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018). Dados de empresas (CNPJ, contratos, sanções) são de natureza pública. A plataforma não coleta nem exibe dados pessoais sensíveis.

## Os dados são confiáveis?

Os dados são extraídos diretamente de APIs e portais oficiais do governo:

| Fonte | Órgão | Tipo de Dados |
|-------|-------|---------------|
| Portal da Transparência | CGU | Contratos, convênios, sanções, CEAP |
| DataJud | CNJ | Processos judiciais |
| Querido Diário | Comunidade | Diários Oficiais municipais |
| Receita Federal | CNPJ | Dados cadastrais de empresas |
| DOU (Diário Oficial da União) | Imprensa Nacional | Atos oficiais federais |

A plataforma mostra a **cadeia de evidência** de cada resultado — você sempre sabe de onde veio a informação.

> **Importante:** Os dados refletem o que está publicado nas fontes oficiais. A plataforma não garante que os dados estejam atualizados em tempo real — cada fonte tem seu próprio ciclo de atualização.

## Preciso saber programar para usar?

**Não.** A plataforma tem interface web acessível pelo navegador. Você pode:

- **Buscar** por CNPJ, nome de empresa ou cidade
- **Conversar** com o agente de IA em linguagem natural (ex: "quais empresas sancionadas têm contratos ativos?")
- **Explorar** o grafo de conexões visualmente
- **Ler** relatórios de investigação já publicados

Para desenvolvedores, também existe uma API REST documentada.

## Quanto custa usar?

**Gratuito.** A plataforma é 100% open-source e de acesso livre.

Para quem quiser rodar uma instância própria, o custo de infraestrutura é aproximadamente:

| Item | Custo mensal |
|------|-------------|
| Servidor (VPS 48GB RAM) | ~R$ 300 |
| APIs com chave (Transparência, DataJud) | Gratuito |
| IA (Gemini Flash) | ~R$ 200 |
| Domínio + DNS | ~R$ 30 |
| **Total** | **~R$ 530/mês** |

## Posso usar para jornalismo investigativo?

**Sim.** A plataforma foi projetada para isso. Ela permite:

1. **Cruzar dados** — encontrar conexões entre empresas, políticos e contratos
2. **Detectar anomalias** — 10 padrões de inteligência automáticos (Benford, HHI, concentração, etc.)
3. **Documentar evidências** — cadeia de proveniência em cada consulta
4. **Exportar resultados** — para uso em reportagens

> **Atenção:** A plataforma fornece **sinais** e **indicadores**, não provas definitivas. Todo sinal deve ser verificado por investigação jornalística adicional antes de publicação.

## Qual a diferença entre "sinal" e "prova"?

| Conceito | Significado |
|----------|-------------|
| **Sinal** | Indicador estatístico que sugere anomalia (ex: distribuição de valores não segue Lei de Benford) |
| **Prova** | Evidência concreta que confirma irregularidade após investigação aprofundada |

A plataforma gera **sinais**. Cabe ao investigador, jornalista ou órgão de controle transformar sinais em provas através de verificação adicional.

## Como os dados são atualizados?

- **ETL automatizado** — pipelines de extração, transformação e carga processam dados das fontes oficiais
- **Grafo de conhecimento** — os dados são armazenados em um banco Neo4j com 317 mil+ entidades e 34 mil+ conexões (e crescendo)
- **Fontes em tempo real** — algumas APIs (Transparência, DataJud) são consultadas em tempo real durante buscas

## Como reportar uso indevido?

Se você identificar uso indevido da plataforma ou dados incorretos:

1. **GitHub Issues** — [Abrir issue](https://github.com/enioxt/EGOS-Inteligencia/issues)
2. **Email** — Contato via perfil do GitHub (@enioxt)

## Como contribuir?

A plataforma é open-source e aceita contribuições:

- **Código** — PRs no [GitHub](https://github.com/enioxt/EGOS-Inteligencia)
- **Dados** — sugerir novas fontes de dados públicos
- **Reportar bugs** — abrir issues no GitHub
- **Tradução** — ajudar a traduzir documentação
- **Investigações** — compartilhar relatórios produzidos com a plataforma

> **Primeiro PR da comunidade:** @mrncstt contribuiu os padrões Benford's Law e HHI em março de 2026.

## Posso rodar minha própria instância?

**Sim.** O código é 100% open-source (licença MIT). Instruções:

```bash
git clone https://github.com/enioxt/EGOS-Inteligencia.git
cd EGOS-Inteligencia
docker compose up -d
```

Requisitos mínimos: servidor com 16GB RAM, 100GB disco, Docker instalado.

---

*"Siga o dinheiro público. Dados abertos, código aberto."*
