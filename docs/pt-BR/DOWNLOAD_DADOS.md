# Guia de Download Manual dos Dados

> Os portais do governo brasileiro protegem downloads com captcha/JavaScript.
> Por isso, alguns datasets precisam ser baixados manualmente via navegador.
> Depois de baixar, basta enviar para o servidor com `scp`.

## Datasets Prioritários (por tamanho)

### 1. CEIS + CNEP — Sanções (≈ 50 MB)

**O que é:** Cadastro de empresas e pessoas sancionadas pelo governo federal.

**Link de download:**
1. Acesse: https://portaldatransparencia.gov.br/download-de-dados/ceis
2. Selecione o mês mais recente
3. Clique em "Baixar" → vai baixar um `.zip`
4. Repita para CNEP: https://portaldatransparencia.gov.br/download-de-dados/cnep

**Após baixar:**
```bash
# Descompacte
unzip ceis_*.zip -d ~/bracc-data/sanctions/
unzip cnep_*.zip -d ~/bracc-data/sanctions/

# Envie para o servidor
scp ~/bracc-data/sanctions/*.csv root@217.216.95.126:/opt/bracc/data/sanctions/
```

---

### 2. CNPJ — Empresas da Receita Federal (≈ 25 GB compactado, 90 GB descompactado)

**O que é:** Todas as 53,6 milhões de empresas do Brasil com sócios, CNAEs, endereços.

**Link de download:**
1. Acesse: https://dados.gov.br/dados/conjuntos-dados/cadastro-nacional-da-pessoa-juridica---cnpj
2. Ou direto: https://dadosabertos.rfb.gov.br/CNPJ/
3. Baixe todos os arquivos `.zip` (são ~37 arquivos)

**Arquivos importantes:**
- `Empresas*.zip` — Dados cadastrais
- `Socios*.zip` — Quadro societário
- `Estabelecimentos*.zip` — Filiais e endereços
- `Simples*.zip` — Optantes pelo Simples Nacional

**Após baixar:**
```bash
# Crie a pasta no servidor
ssh root@217.216.95.126 'mkdir -p /opt/bracc/data/cnpj'

# Envie todos os zips (pode demorar horas dependendo da conexão)
scp ~/Downloads/CNPJ/*.zip root@217.216.95.126:/opt/bracc/data/cnpj/

# No servidor, descompacte
ssh root@217.216.95.126 'cd /opt/bracc/data/cnpj && for f in *.zip; do unzip -o "$f"; done'
```

> **Atenção:** Este dataset precisa de ~100GB de espaço no servidor.
> O VPS Contabo tem 250GB NVMe, então cabe tranquilo.

---

### 3. TSE — Dados Eleitorais (≈ 8 GB)

**O que é:** Candidatos, doações, patrimônio declarado, filiações partidárias (2002-2024).

**Links de download:**
1. **Candidatos + Bens:** https://dadosabertos.tse.jus.br/dataset/candidatos-2024
2. **Prestação de Contas:** https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2024
3. **Filiados:** https://dadosabertos.tse.jus.br/dataset/filiados

**Após baixar:**
```bash
ssh root@217.216.95.126 'mkdir -p /opt/bracc/data/tse /opt/bracc/data/tse_bens /opt/bracc/data/tse_filiados'
scp ~/Downloads/TSE/candidatos*.zip root@217.216.95.126:/opt/bracc/data/tse/
scp ~/Downloads/TSE/bens*.zip root@217.216.95.126:/opt/bracc/data/tse_bens/
scp ~/Downloads/TSE/filiados*.zip root@217.216.95.126:/opt/bracc/data/tse_filiados/
```

---

### 4. TCU — Contas Julgadas Irregulares (≈ 200 MB)

**O que é:** Responsáveis por contas julgadas irregulares pelo Tribunal de Contas da União.

**Link:** https://portal.tcu.gov.br/contas/contas-julgadas-irregulares/

```bash
ssh root@217.216.95.126 'mkdir -p /opt/bracc/data/tcu'
scp ~/Downloads/tcu*.csv root@217.216.95.126:/opt/bracc/data/tcu/
```

---

### 5. PGFN — Dívidas com a União (≈ 3 GB)

**O que é:** Lista de devedores inscritos na dívida ativa da União.

**Link:** https://www.gov.br/pgfn/pt-br/assuntos/divida-ativa-da-uniao/lista-de-devedores

```bash
ssh root@217.216.95.126 'mkdir -p /opt/bracc/data/pgfn'
scp ~/Downloads/pgfn*.csv root@217.216.95.126:/opt/bracc/data/pgfn/
```

---

## Rodando o ETL Após Upload

Depois de enviar os dados para o servidor:

```bash
# Conecte ao servidor
ssh root@217.216.95.126

# Ative o ambiente Python
cd /opt/bracc/etl
source .venv/bin/activate

# Rode o pipeline específico (exemplo: sanctions)
python -c "
from neo4j import GraphDatabase
from bracc_etl.pipelines.sanctions import SanctionsPipeline

driver = GraphDatabase.driver('bolt://localhost:7687', auth=('neo4j', 'BrAcc2026EgosNeo4j!'))
p = SanctionsPipeline(driver=driver, data_dir='/opt/bracc/data')
p.run()
driver.close()
print('Sanctions loaded!')
"

# Para CNPJ (MUITO demorado — horas):
python -c "
from neo4j import GraphDatabase
from bracc_etl.pipelines.cnpj import CnpjPipeline

driver = GraphDatabase.driver('bolt://localhost:7687', auth=('neo4j', 'BrAcc2026EgosNeo4j!'))
p = CnpjPipeline(driver=driver, data_dir='/opt/bracc/data')
p.run()
driver.close()
"
```

## Resumo de Tamanhos

| Dataset | Compactado | Descompactado | Prioridade |
|---|---|---|---|
| CEIS/CNEP (sanções) | ~50 MB | ~200 MB | ⭐⭐⭐ Alta |
| TCU (contas irregulares) | ~200 MB | ~500 MB | ⭐⭐⭐ Alta |
| TSE (eleições) | ~8 GB | ~30 GB | ⭐⭐ Média |
| PGFN (dívidas) | ~3 GB | ~10 GB | ⭐⭐ Média |
| CNPJ (empresas) | ~25 GB | ~90 GB | ⭐ Baixa (maior) |

**Total estimado: ~37 GB para baixar, ~130 GB descompactado.**

O servidor Contabo tem 250 GB NVMe — cabe tudo com folga.

---

*Dúvidas? Abra uma issue: https://github.com/enioxt/br-acc/issues*
