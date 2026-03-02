---
name: finish
description: "Use when feature implementation is complete and the branch is ready for final validation, PR creation, or merge."
user-invocable: true
argument-hint: "[branch-name]"
allowed-tools: Read, Bash, Glob, Grep
---

# /finish - Finalize Branch

Complete development branch with final validation and metrics.

**Branch:** $ARGUMENTS (or current branch)

## Workflow

### Step 1: Pre-Flight Checks

```bash
# Check current branch
git branch --show-current

# Check for uncommitted changes
git status

# Check for untracked files
git status --porcelain
```

**Required:**
- [ ] All changes committed
- [ ] No untracked files (or intentionally ignored)
- [ ] Not on main/master branch

### Step 2: Run Full Validation

```bash
# TypeScript check
npx tsc --noEmit

# Lint
npm run lint

# Tests
npm test

# Build (if applicable)
npm run build
```

**Output:**
```
──── Validation ────
TypeScript: PASS ✓
Lint: PASS ✓
Tests: PASS ✓ (42/42)
Build: PASS ✓
```

### Step 3: Generate Diff Summary

```bash
# Files changed
git diff main --stat

# Commits in branch
git log main..HEAD --oneline
```

**Output:**
```
──── Changes ────
Files changed: 12
Insertions: +450
Deletions: -120

Commits:
  abc1234 feat: add user service
  def5678 feat: add user component
  ghi9012 test: add user tests
  jkl3456 refactor: clean up types
```

### Step 4: Session Metrics

```markdown
──── Session Metrics ────
Branch: feature/user-profile
Duration: ~45 minutes
Commits: 4

Files:
  Created: 5
  Modified: 7
  Deleted: 0

Code:
  Lines added: 450
  Lines removed: 120
  Net change: +330

Tests:
  Added: 8
  Total passing: 42/42
  Coverage: 87%

Agents used:
  @planner: 1 invocation
  @builder: 3 invocations
  @reviewer: 1 invocation

Estimated tokens: ~18,500
Estimated cost: ~$0.28
```

### Step 5: Cleanup Checkpoints

```bash
# List checkpoints
git tag -l "checkpoint/*"

# Offer to clean
"Clean up checkpoint tags? (y/n)"
```

If yes:
```bash
git tag -l "checkpoint/*" | xargs -n 1 git tag -d
```

### Step 6: Prepare for Merge

```markdown
──── Ready for Merge ────

Branch: feature/user-profile
Base: main
Status: Ready ✓

Pre-merge checklist:
- [x] All tests passing
- [x] No TypeScript errors
- [x] Code reviewed
- [x] Checkpoints cleaned

Next steps:
1. Push: git push -u origin feature/user-profile
2. Create PR: gh pr create
3. Merge: After approval
```

## Output

```
──── /finish ────
Branch: [branch-name]

Validation:
  TypeScript: PASS ✓
  Lint: PASS ✓
  Tests: PASS ✓ (N/N)
  Build: PASS ✓

Changes:
  Files: N changed
  Lines: +N / -N
  Commits: N

Metrics:
  Tokens: ~N
  Cost: ~$X.XX
  Agents: N used

Checkpoints: [cleaned/kept]

Status: READY FOR MERGE ✓

Commands:
  git push -u origin [branch]
  gh pr create --title "[title]" --body "[body]"
```

## Validation Failures

If validation fails:

```
──── /finish ────
Branch: feature/user-profile

Validation:
  TypeScript: FAIL ✗
    Error: src/user.ts:42 - Property 'name' is missing
  Lint: PASS ✓
  Tests: FAIL ✗
    2 tests failing

Status: NOT READY ✗

To fix:
1. Resolve TypeScript errors
2. Fix failing tests
3. Run /finish again
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Tests pass locally, good enough" | CI runs in a clean environment. Your local cache hides broken imports and missing deps. |
| "I'll fix the lint errors in the next PR" | Technical debt compounds. Fix now or carry it forever. |
| "The build takes too long to run" | A broken build in production takes even longer to fix. Run it. |
| "I already reviewed the code mentally" | Mental review misses what automated checks catch. Run the full suite. |

## Rules

1. **Never skip validation** - All checks must pass
2. **Always show metrics** - Transparency in cost
3. **Offer cleanup** - Keep repo clean
4. **Don't auto-merge** - Human decision
