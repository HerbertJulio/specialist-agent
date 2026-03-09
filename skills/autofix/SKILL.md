---
name: autofix
description: "Use when you want to automatically triage errors from Sentry (or error logs), cross-reference them against the codebase and open PRs, prioritize by severity, and optionally create fix PRs."
user-invocable: true
argument-hint: "[sentry|logs|--timeframe=24h|--auto-pr]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /autofix - Automated Error Triage & Fix

Pull production errors, check if they're already fixed, prioritize what matters, and ship fixes — all in one command.

**Target:** $ARGUMENTS

## Workflow

### Step 1: Detect Error Source

**If using Sentry**, first inform the user and verify the Sentry CLI is installed:
> "This workflow requires the Sentry CLI. Checking if `sentry-cli` is available..."

```bash
sentry-cli --version
```

If not installed, stop and instruct: `npm install -g @sentry/cli` or see https://docs.sentry.io/cli/installation/

Then check which error source is available:

```bash
# Check for Sentry
echo $SENTRY_AUTH_TOKEN | head -c 4

# Check for error log files
ls logs/ error.log *.log 2>/dev/null
```

| Source | Detection |
|--------|-----------|
| **Sentry** | `$SENTRY_AUTH_TOKEN` + `$SENTRY_ORG` + `$SENTRY_PROJECT` set |
| **Log files** | `logs/` directory or `*.log` files present |
| **Manual** | User provides error text or screenshot |

If no source detected, ask user:
> "No error source detected. Set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` for Sentry, or provide error logs."

### Step 2: Fetch Errors

**Sentry mode:**
```bash
curl -s -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/issues/?query=is:unresolved&statsPeriod=${TIMEFRAME:-24h}&sort=freq"
```

**Log mode:**
```bash
# Extract unique errors from logs
grep -E "(Error|Exception|FATAL|CRITICAL)" logs/*.log | sort -u
```

Parse each error: message, stack trace, frequency, timestamp.

### Step 3: Cross-Reference

For each error, run three checks in parallel:

1. **Git history** — `git log --since="${TIMEFRAME:-24 hours ago}" --all -- {file}` for recent fixes
2. **Open PRs** — `gh pr list --state open --search "{error-keyword}"` for in-progress fixes
3. **Codebase** — `Grep` for the exact error location to verify it still exists

Classify:
- `FIXED` — Recent commit addresses the error
- `PR_OPEN` — Open PR targets the file/error
- `NEEDS_FIX` — No existing fix

### Step 4: Prioritize into 3 Tiers

| Tier | Criteria | Recommended Action |
|------|----------|-------------------|
| **P0 Critical** | >100 events OR >50 users OR security/data-loss | Fix now, create PR immediately |
| **P1 Important** | >10 events OR >5 users OR broken UX flow | Fix this sprint |
| **P2 Low** | <10 events AND edge-case/cosmetic | Add to backlog |

For log-based errors without event counts, use recency and frequency in log file.

### Step 5: Present Report

Display the triage to the user:

```
## Autofix Report — {date}

Period: Last {timeframe}
Source: {sentry|logs}

ALREADY FIXED (3):
  - "Connection timeout" → fixed in abc1234
  - "Null ref in CartService" → PR #42 open

P0 CRITICAL (1):
  1. TypeError in src/api/users.ts:45 — 342 events, 89 users
     Root cause: Missing null check on user.profile

P1 IMPORTANT (2):
  2. UnhandledRejection in src/services/payment.ts:112 — 28 events
  3. RangeError in src/utils/date.ts:67 — 15 events

P2 LOW (4):
  4-7. [listed with brief descriptions]

Select issues to fix: [1,2,3] or "all-p0" or "all"
```

### Step 6: Auto-Fix Selected Issues

For each selected issue:

1. Create branch: `fix/autofix-{id}-{short-desc}`
2. Analyze stack trace + surrounding code (read 50 lines above/below)
3. Implement fix with proper error handling
4. Run tests: `npm test` or detected test runner
5. If `--auto-pr` flag set, create PR automatically:
   ```bash
   gh pr create --title "fix: {error-title}" --body "..."
   ```
6. Otherwise, show diff and ask user to confirm

## Output

```markdown
## /autofix Results

**Source:** {sentry|logs}
**Period:** {timeframe}
**Triaged:** {n} issues

| Tier | Count | Fixed | PR Created |
|------|-------|-------|------------|
| P0   | {n}   | {n}   | {n}        |
| P1   | {n}   | {n}   | {n}        |
| P2   | {n}   | {n}   | {n}        |

### PRs Created
- `fix/autofix-123-null-check` → PR #45
- `fix/autofix-456-timeout-handler` → PR #46
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I'll check Sentry later" | Later never comes. Errors compound. Triage now takes 2 minutes. |
| "Low event count = not important" | Low count can mean high severity for specific users. Check `userCount`. |
| "The fix might break something" | A tested fix in a PR is safer than an unhandled production error. |
| "It's already been reported" | Reported != fixed. Check the PR status. |

## Rules

1. Never store auth tokens in files — environment variables only
2. Never auto-merge — all PRs require human review
3. Never resolve/dismiss Sentry issues — only create fixes
4. Always run the existing test suite before creating a PR
5. Always include the error source link (Sentry URL or log reference) in PRs
6. Respect `--timeframe` flag (default: 24h)
7. If `--auto-pr` is not set, always ask before creating PRs
8. Group related errors (same root cause) into a single fix when possible
