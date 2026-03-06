---
description: Session finalization with handoff
---

# /end — Session Finalization (v2.1)

## 1. Collect Session Work

```bash
git log --oneline --since="8 hours ago"
```

## 2. Update TASKS.md

- Mark completed tasks as ✅ with date
- Add file references
- Update task counter in header

## 3. Commit Pending Changes

```bash
git add -A
git status --short
# Commit with conventional message
git commit -m "chore: session N handoff — [summary]"
```

## 4. GitHub Sync (NEW in v2.0)

// turbo
- Close completed issues: `gh issue list --state open --limit 20` — cross-reference with completed tasks
// turbo
- Check for new PRs: `gh pr list --state open --limit 5`
// turbo  
- Check upstream: `git fetch upstream --quiet 2>/dev/null && echo "Behind upstream by $(git rev-list HEAD..upstream/main --count) commits"`

For each completed task that has a matching open issue, close it:
```bash
gh issue close <NUMBER> -c "Completed in session N, commit <HASH>"
```

## 5. Push + VPS Sync

```bash
git push origin main
ssh root@217.216.95.126 "cd /opt/bracc && git pull origin main && cd infra && docker compose restart api"
```

If frontend files changed:
```bash
ssh root@217.216.95.126 "cd /opt/bracc/infra && docker compose build frontend && docker compose up -d frontend"
```

## 6. Verify Deployment

// turbo
- API health: `curl -sL --max-time 10 https://inteligencia.egos.ia.br/api/v1/meta/stats | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'API OK: {d[\"total_nodes\"]:,} nodes')" 2>/dev/null || echo 'API VERIFY FAILED — INVESTIGATE'`

## 7. Handoff Summary

Output to user:

- **Session:** Number and duration
- **Completed:** List of tasks done
- **In Progress:** What's still running
- **Blocked:** What needs user input
- **GitHub:** Issues closed, PRs reviewed, upstream delta
- **Next:** Recommended priorities for next session

## 8. Codex Cleanup (MANDATORY)

// turbo
- Check pending Codex cloud tasks: `codex cloud list 2>/dev/null | head -10 || echo "No Codex tasks"`
// turbo
- Check local review capability: `codex review --help >/dev/null 2>&1 && echo "codex review ready" || echo "codex review unavailable"`

Before ending the session:
- If there are uncommitted changes, run a final second opinion in a **parallel terminal**: `codex review --uncommitted`
- For cloud tasks, inspect before applying: `codex cloud diff <TASK_ID>`
- Apply only approved diffs: `codex cloud apply <TASK_ID>`
- If a cloud task is stale/irrelevant, note it explicitly in the handoff as `Codex task <TASK_ID> abandoned`
- If cloud execution is needed for the next session, record that current CLI requires `codex cloud exec --env <ENV_ID> ...`

## 9. Persist Knowledge

Use `create_memory` to save important discoveries from this session.
