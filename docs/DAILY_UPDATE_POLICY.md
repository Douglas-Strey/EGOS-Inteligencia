# Daily Update Policy — EGOS Inteligência

> **Version:** 1.0 | **Updated:** 2026-03-02

## Regra Principal

**1 postagem por dia** contendo TUDO que foi feito. Não postar múltiplas vezes ao dia.

## O que é "Importante" (justifica post separado)

Uma atualização é considerada **importante o suficiente para um post extra** se:

1. **Nova fonte de dados integrada** (ex: novo ETL carregou milhões de registros)
2. **Funcionalidade que muda a experiência do usuário** (ex: chatbot investigativo)
3. **Marco significativo** (ex: 500K nós, 50 tasks completas, 100★ GitHub)
4. **Incidente/fix crítico** (ex: site fora do ar → restaurado)
5. **Contribuição externa significativa** (ex: PR aceito de contribuidor)

Tudo que NÃO se encaixa acima vai no resumo diário.

## Template do Post Diário

```
📊 EGOS Inteligência — Resumo [DATA]

✅ O que fizemos:
- [feature/fix 1]
- [feature/fix 2]
- [feature/fix 3]

📈 Métricas:
- X/Y tasks | Z nós no grafo | W★ GitHub

🔗 https://inteligencia.egos.ia.br
```

## Canais

| Canal | Formato | Limite |
|-------|---------|--------|
| Telegram @ethikin | Markdown | 4096 chars |
| Discord #updates | Plain text | 2000 chars |
| Website timeline | JSON entry | Unlimited |

## Documentação para Post

Antes de postar, atualizar:
1. `frontend/public/updates/timeline.json` — entrada com date, title, description, tags, metrics
2. `TASKS.md` — métricas atualizadas
3. Commit com mensagem descritiva

## Quem Posta

O agente Cascade prepara o conteúdo. O post é feito automaticamente via API dos bots.
