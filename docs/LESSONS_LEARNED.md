# EGOS Inteligência — Lessons Learned & Rules

> Rules born from real errors. Each rule prevents a specific class of mistakes.

## Docker & Containers

1. **`pgrep` unavailable in containers** — Never use `pgrep`/`ps` inside Docker to check host processes. Use `os.stat(file).st_mtime` to detect if a process is active by checking log freshness.
2. **DNS flaky during Docker builds** — `docker compose build` may fail transiently due to DNS. Workaround: `docker cp` the fixed file into running container + `docker compose restart`. Rebuild later when DNS stable.
3. **Volume mounts for data files** — If the API needs host files (CSVs, logs), mount them via `docker-compose.yml` volumes + env vars. Don't assume files are inside the container.

## Bot Operations

4. **NEVER send error messages to group chats** — Errors go to: console (always), user DM (if possible), silent fail in groups. Group members should never see stack traces or error details.
5. **PM2 status parsing** — Use `pm2 describe <name> | grep status | awk '{print $4}'` to extract status. Never rely on `pm2 jlist` with Python JSON parsing (empty output on some PM2 versions causes false restarts).
6. **Reset PM2 counters after fixes** — After fixing a crash-loop, run `pm2 reset all` to clear restart counters and avoid confusing metrics.

## ETL & Data Processing

7. **ETL detection threshold must match file processing time** — If each CSV takes ~2h, set the "running" threshold to 3h (10800s), not 10min (600s).
8. **ETL is CPU-bound, not I/O-bound** — 32GB files already downloaded to disk. Bottleneck is single-threaded Python parsing + Neo4j writes. Internet speed is irrelevant.
9. **Bruin not applicable for graph DBs** — Bruin (getbruin.com) targets SQL warehouses (Postgres, DuckDB, BigQuery). No Neo4j connector. Consider for future DuckDB analytics layer only.

## Frontend & UI

10. **Paginate large lists** — Never show 100+ items at once. Default to 10 per page with prev/next controls.
11. **Show 5 most recent, expand for all** — For timelines and changelogs, show latest 5 entries by default with "show all N" button.

## Git & Workflow

12. **Commit every 30-60min** — Use conventional commits (feat:/fix:/chore:/docs:). Never accumulate >2h of uncommitted work.
13. **Sync local ↔ server before commit** — When editing files on remote server (Contabo), always `scp`/`cat` them back to local repo before committing.
14. **Pre-commit hooks catch secrets** — Check for hardcoded passwords, API keys, tokens in staged files. Block commit if found.

## Social & Outreach

15. **Star repos before opening issues** — When doing Gem Hunter outreach, star the repo first, then leave a thoughtful collaboration issue. Never spam.
16. **Platform-specific formatting** — Telegram: full Markdown (4096 chars). Discord: Markdown (2000 chars). X.com: plain text (280 chars + link).

---

*Updated: 2026-03-02 | Session 6*
