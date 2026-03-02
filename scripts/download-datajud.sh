#!/bin/bash
# ═══════════════════════════════════════════════════════════
# DataJud CNJ — Bulk Download Script
# 80M+ judicial records via Elasticsearch API
# ═══════════════════════════════════════════════════════════
#
# API Key: Public (changes periodically, check wiki)
# Docs: https://datajud-wiki.cnj.jus.br/api-publica/endpoints/
# Base: https://api-publica.datajud.cnj.jus.br
#
# Usage:
#   bash scripts/download-datajud.sh [tribunal] [output_dir]
#   bash scripts/download-datajud.sh tjsp /opt/bracc/data/datajud
#   bash scripts/download-datajud.sh all /opt/bracc/data/datajud
#
# Features:
#   - Paginated scroll via search_after
#   - Resumable (saves last cursor per tribunal)
#   - JSONL output (one record per line)
#   - Rate limited (1 req/sec to be respectful)
# ═══════════════════════════════════════════════════════════

set -euo pipefail

API_KEY="cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=="
BASE_URL="https://api-publica.datajud.cnj.jus.br"
PAGE_SIZE=1000
RATE_LIMIT_SEC=1

# All available tribunals
declare -A TRIBUNAIS=(
  # Superiores
  [tst]="api_publica_tst"
  [tse]="api_publica_tse"
  [stj]="api_publica_stj"
  [stm]="api_publica_stm"
  # Federal
  [trf1]="api_publica_trf1"
  [trf2]="api_publica_trf2"
  [trf3]="api_publica_trf3"
  [trf4]="api_publica_trf4"
  [trf5]="api_publica_trf5"
  [trf6]="api_publica_trf6"
  # Trabalho
  [trt1]="api_publica_trt1"
  [trt2]="api_publica_trt2"
  [trt3]="api_publica_trt3"
  [trt4]="api_publica_trt4"
  [trt5]="api_publica_trt5"
  [trt6]="api_publica_trt6"
  [trt7]="api_publica_trt7"
  [trt8]="api_publica_trt8"
  [trt9]="api_publica_trt9"
  [trt10]="api_publica_trt10"
  [trt11]="api_publica_trt11"
  [trt12]="api_publica_trt12"
  [trt13]="api_publica_trt13"
  [trt14]="api_publica_trt14"
  [trt15]="api_publica_trt15"
  [trt16]="api_publica_trt16"
  [trt17]="api_publica_trt17"
  [trt18]="api_publica_trt18"
  [trt19]="api_publica_trt19"
  [trt20]="api_publica_trt20"
  [trt21]="api_publica_trt21"
  [trt22]="api_publica_trt22"
  [trt23]="api_publica_trt23"
  [trt24]="api_publica_trt24"
  # Estadual
  [tjac]="api_publica_tjac"
  [tjal]="api_publica_tjal"
  [tjam]="api_publica_tjam"
  [tjap]="api_publica_tjap"
  [tjba]="api_publica_tjba"
  [tjce]="api_publica_tjce"
  [tjdft]="api_publica_tjdft"
  [tjes]="api_publica_tjes"
  [tjgo]="api_publica_tjgo"
  [tjma]="api_publica_tjma"
  [tjmg]="api_publica_tjmg"
  [tjms]="api_publica_tjms"
  [tjmt]="api_publica_tjmt"
  [tjpa]="api_publica_tjpa"
  [tjpb]="api_publica_tjpb"
  [tjpe]="api_publica_tjpe"
  [tjpi]="api_publica_tjpi"
  [tjpr]="api_publica_tjpr"
  [tjrj]="api_publica_tjrj"
  [tjrn]="api_publica_tjrn"
  [tjro]="api_publica_tjro"
  [tjrr]="api_publica_tjrr"
  [tjrs]="api_publica_tjrs"
  [tjsc]="api_publica_tjsc"
  [tjse]="api_publica_tjse"
  [tjsp]="api_publica_tjsp"
  [tjto]="api_publica_tjto"
)

TRIBUNAL="${1:-list}"
OUTPUT_DIR="${2:-/opt/bracc/data/datajud}"

if [ "$TRIBUNAL" = "list" ]; then
  echo "Available tribunals:"
  for key in $(echo "${!TRIBUNAIS[@]}" | tr ' ' '\n' | sort); do
    echo "  $key -> ${TRIBUNAIS[$key]}"
  done
  echo ""
  echo "Usage: $0 <tribunal|all> [output_dir]"
  echo "Example: $0 tjsp /opt/bracc/data/datajud"
  exit 0
fi

mkdir -p "$OUTPUT_DIR"

download_tribunal() {
  local key="$1"
  local alias="${TRIBUNAIS[$key]}"
  local url="${BASE_URL}/${alias}/_search"
  local outfile="${OUTPUT_DIR}/${key}.jsonl"
  local cursorfile="${OUTPUT_DIR}/.cursor_${key}"
  local count=0

  echo "═══════════════════════════════════════════"
  echo "📥 Downloading: $key ($alias)"
  echo "   URL: $url"
  echo "   Output: $outfile"
  echo "═══════════════════════════════════════════"

  # Build initial query
  local query='{"size":'$PAGE_SIZE',"query":{"match_all":{}},"sort":[{"@timestamp":{"order":"asc"}}]}'

  # Resume from cursor if exists
  if [ -f "$cursorfile" ]; then
    local cursor
    cursor=$(cat "$cursorfile")
    query='{"size":'$PAGE_SIZE',"query":{"match_all":{}},"sort":[{"@timestamp":{"order":"asc"}}],"search_after":['$cursor']}'
    echo "   ♻️  Resuming from cursor: $cursor"
  fi

  while true; do
    local response
    response=$(curl -s -X POST "$url" \
      -H "Authorization: APIKey $API_KEY" \
      -H "Content-Type: application/json" \
      -d "$query" 2>/dev/null)

    # Check for errors
    if echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if 'hits' in d else 1)" 2>/dev/null; then
      local hits
      hits=$(echo "$response" | python3 -c "
import sys, json
d = json.load(sys.stdin)
hits = d['hits']['hits']
for h in hits:
    print(json.dumps(h['_source'], ensure_ascii=False))
if hits:
    last_sort = json.dumps(hits[-1]['sort'][0])
    print('__CURSOR__:' + last_sort, file=sys.stderr)
print(len(hits), file=sys.stderr)
" 2>"${OUTPUT_DIR}/.tmp_meta_${key}")

      local meta
      meta=$(cat "${OUTPUT_DIR}/.tmp_meta_${key}")
      local num_hits
      num_hits=$(echo "$meta" | tail -1)

      if [ "$num_hits" = "0" ]; then
        echo "   ✅ Done! Total records: $count"
        rm -f "${OUTPUT_DIR}/.tmp_meta_${key}"
        break
      fi

      echo "$hits" >> "$outfile"
      count=$((count + num_hits))

      # Save cursor for resume
      local new_cursor
      new_cursor=$(echo "$meta" | grep "__CURSOR__:" | sed 's/__CURSOR__://')
      if [ -n "$new_cursor" ]; then
        echo "$new_cursor" > "$cursorfile"
        query='{"size":'$PAGE_SIZE',"query":{"match_all":{}},"sort":[{"@timestamp":{"order":"asc"}}],"search_after":['$new_cursor']}'
      fi

      echo "   📊 $count records downloaded..."
      rm -f "${OUTPUT_DIR}/.tmp_meta_${key}"
    else
      echo "   ❌ API error. Retrying in 10s..."
      echo "$response" | head -3
      sleep 10
      continue
    fi

    sleep "$RATE_LIMIT_SEC"
  done
}

if [ "$TRIBUNAL" = "all" ]; then
  echo "🚀 Downloading ALL tribunals (${#TRIBUNAIS[@]} total)"
  for key in $(echo "${!TRIBUNAIS[@]}" | tr ' ' '\n' | sort); do
    download_tribunal "$key"
  done
  echo "🎉 ALL DONE!"
else
  if [ -z "${TRIBUNAIS[$TRIBUNAL]+x}" ]; then
    echo "❌ Unknown tribunal: $TRIBUNAL"
    echo "Run '$0 list' to see available tribunals"
    exit 1
  fi
  download_tribunal "$TRIBUNAL"
fi
