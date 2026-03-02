---
name: commit
description: "Use when changes are ready to commit - generates conventional commit messages with scope detection and validation."
user-invocable: true
argument-hint: "[optional message override]"
allowed-tools: Read, Bash, Glob, Grep
---

# /commit - Smart Commit

Generate and execute conventional commits with automatic scope detection and pre-commit validation.

**Override:** $ARGUMENTS

## When to Use
- After completing a feature, fix, or refactor
- When you want a well-formatted conventional commit
- To validate changes before committing
- NOT for: empty working tree (nothing to commit)

## Workflow

### Step 1: Analyze Changes
```bash
git status --porcelain
git diff --stat
git diff --cached --stat
```

Determine:
- Which files changed
- Are changes staged or unstaged?
- How many files and lines affected

### Step 2: Auto-Detect Type and Scope

**Type detection from file patterns:**

| Changed Files | Type |
|---------------|------|
| `src/components/*`, `src/pages/*` | feat or fix |
| `tests/*`, `*.test.*`, `*.spec.*` | test |
| `docs/*`, `*.md` | docs |
| `.github/*`, `docker*`, `*.yml` | ci or chore |
| `*.config.*`, `tsconfig*`, `package.json` | chore |
| Rename/move only | refactor |
| Delete only | chore |

**Scope detection from paths:**
- `src/modules/auth/*` -> scope: `auth`
- `src/components/Button/*` -> scope: `button`
- `src/services/*` -> scope: `services`
- Multiple directories -> no scope (too broad)

**Type from diff content:**
- New file created -> `feat`
- Existing file modified (bug context) -> `fix`
- Restructuring without behavior change -> `refactor`
- Performance improvement -> `perf`

### Step 3: Generate Commit Message

Format: `type(scope): description`

Rules:
- Type: lowercase (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`, `style`)
- Scope: optional, lowercase, max 15 chars
- Description: imperative mood, lowercase start, no period, max 72 chars
- Body: optional, for complex changes - wrap at 72 chars

If $ARGUMENTS provided, use it as description override but still validate format.

### Step 4: Pre-Commit Validation

```bash
# Check for secrets/sensitive files
git diff --cached --name-only | grep -E '\.(env|pem|key)$'

# Check for debug artifacts
git diff --cached | grep -E '(console\.log|debugger|TODO.*HACK)'

# Check for large files
git diff --cached --stat | awk '{print $NF}' | head -5
```

Warn if:
- `.env` or credential files staged
- `console.log` / `debugger` statements in diff
- Files > 1MB staged

### Step 5: Execute Commit

```bash
# Stage if not staged
git add [relevant files]

# Commit
git commit -m "type(scope): description"
```

If commit message needs body:
```bash
git commit -m "type(scope): description" -m "body with more details"
```

## Output

```
──── /commit ────
Type: feat
Scope: auth
Message: feat(auth): add JWT refresh token rotation

Files: 4 changed (+120 / -15)
Warnings: none

✓ Committed: abc1234
```

## Validation Warnings Output

```
──── /commit ────
⚠ WARNINGS:
  - console.log found in src/service.ts:42
  - .env.local is staged (contains secrets?)

Proceed anyway? Showing commit preview:
  fix(api): handle timeout in payment service

Files: 2 changed (+8 / -3)
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I'll write a proper message later" | You won't. The context is fresh NOW. A bad commit message is permanent. |
| "It's just a small fix, message doesn't matter" | `git log` is the project's history book. Every entry matters. |
| "I'll squash before merging anyway" | Squash doesn't fix the habit. Good messages help during review too. |
| "Validation slows me down" | A leaked secret or committed console.log slows the whole team down. |

## Rules

1. **Always validate before committing** - Check for secrets and debug code
2. **Follow conventional commits** - type(scope): description
3. **Imperative mood** - "add feature" not "added feature"
4. **Never commit .env files** - Block and warn
5. **Max 72 chars** - Subject line must fit in git log
6. **One logical change per commit** - Don't mix features
