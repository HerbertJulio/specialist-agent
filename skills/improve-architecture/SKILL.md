---
name: improve-architecture
description: "Use when the codebase has architectural issues like high coupling, circular dependencies, or unclear boundaries - but a full migration is not needed."
user-invocable: true
argument-hint: "[module, path, or 'full']"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /improve-architecture - Incremental Architecture Improvement

Fix architectural issues incrementally - circular dependencies, high coupling, unclear boundaries, god files - without a full migration. Measure before, fix, measure after.

**Target:** $ARGUMENTS

## When to Use

- Circular dependencies causing build issues or test instability
- God files (>500 lines) that are hard to maintain
- Cross-module imports violating layer boundaries
- High coupling making changes ripple unpredictably
- Unclear module boundaries after organic growth
- Before adding a major feature to a messy area
- NOT for: full architecture pattern migration (use `/migrate-architecture`)
- NOT for: code-level refactoring without structural issues (use `@refactor`)
- NOT for: greenfield architecture design (use `@architect`)

## Workflow

### Step 1: Architecture Scan

1. **Map current structure:**

```bash
# Directory structure overview
find $TARGET -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" \) | head -100

# Count lines per file (find god files >500 lines)
find $TARGET -type f \( -name "*.ts" -o -name "*.tsx" \) -exec wc -l {} + 2>/dev/null | sort -rn | head -20

# Find circular dependency candidates (mutual imports)
for f in $(find $TARGET -name "*.ts" -not -path "*/node_modules/*" | head -50); do
  imports=$(grep -oP "from ['\"]\..*?['\"]" "$f" 2>/dev/null | sed "s/from ['\"]//;s/['\"]//")
  for imp in $imports; do
    target_file=$(realpath --relative-to=. "$(dirname $f)/$imp" 2>/dev/null)
    if [ -f "${target_file}.ts" ] && grep -q "$(basename $f .ts)" "${target_file}.ts" 2>/dev/null; then
      echo "CIRCULAR: $f <-> ${target_file}.ts"
    fi
  done
done 2>/dev/null | head -20
```

2. **Read `docs/ARCHITECTURE.md`** if it exists - compare actual vs intended structure
3. **Identify pain points** with metrics

**Output:**
```markdown
## Architecture Scan

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| God files (>500 lines) | N | 0 | [OK/WARN/FAIL] |
| Circular dependencies | N | 0 | [OK/WARN/FAIL] |
| Cross-boundary imports | N | 0 | [OK/WARN/FAIL] |
| Max file size (lines) | N | 500 | [OK/WARN/FAIL] |
| Avg module cohesion | [H/M/L] | HIGH | [OK/WARN/FAIL] |
```

**BLOCKED** until scan produces metrics.

### Step 2: Issue Classification

Classify every issue found:

| Category | Description | Examples |
|----------|-------------|---------|
| **Circular Dependency** | Module A imports B, B imports A | Service ↔ Utility cycles |
| **Boundary Violation** | Import crosses architectural layer | Component importing from data layer |
| **God File** | Single file with too many responsibilities | 800-line service doing auth + validation + logging |
| **Naming Inconsistency** | Files/modules don't follow project conventions | Mix of camelCase and kebab-case |
| **Missing Abstraction** | Duplicated logic that should be extracted | Same validation in 3 services |
| **Dead Code** | Unreferenced exports, unused files | Old API endpoints, deprecated utils |

For each issue:
```markdown
### Issue [N]: [Title]
- **Category:** [from table above]
- **Location:** [file:line]
- **Impact:** HIGH/MEDIUM/LOW
- **Fix:** [targeted fix description]
```

**BLOCKED** until all issues are classified with impact levels.

### Step 3: Improvement Plan

For each issue, define a **targeted fix** (not a rewrite):

| Issue Type | Fix Strategy |
|-----------|-------------|
| Circular dependency | Extract shared code to a new module, or invert dependency direction |
| Boundary violation | Move import to correct layer, or create a facade |
| God file | Extract responsibilities into separate files with single purpose |
| Naming inconsistency | Rename files/exports to follow established convention |
| Missing abstraction | Extract shared logic into a utility or service |
| Dead code | Remove unreferenced exports and files |

**Order fixes by dependency** - Fix circular dependencies first (they block other fixes).

### Step 4: Incremental Execution

Execute fixes **one at a time**, verifying between each:

```
FOR each fix in improvement plan (ordered by dependency):
  1. Apply the fix (edit files)
  2. Verify TypeScript compiles:
     tsc --noEmit 2>&1 | head -20
  3. Run tests:
     npm test 2>&1 | tail -20
  4. IF compile or tests fail → REVERT and re-evaluate
  5. IF pass → Mark fix as complete, proceed to next
```

**BLOCKED** after each fix until compilation and tests pass.

### Step 5: Before/After Metrics

Generate a comparison report:

```bash
# Re-run the same scans from Step 1
# Compare metrics before and after
```

**Output:**
```markdown
## Before/After

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| God files | N | N | -N |
| Circular deps | N | N | -N |
| Cross-boundary imports | N | N | -N |
| Max file size | N | N | -N lines |
| Files changed | - | N | - |
| Tests passing | ✓ | ✓ | - |
```

## Verification Protocol

**Before claiming improvements are complete:**

1. Before/after metrics exist with concrete numbers
2. TypeScript compiles without errors after every fix
3. All tests pass after every fix
4. No new circular dependencies were introduced
5. Each fix addresses exactly one issue (not bundled changes)
6. Files were not just renamed - structural improvements were made
7. `docs/ARCHITECTURE.md` was updated if module boundaries changed

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "The architecture is fine, it works" | Working code with high coupling breaks when you add the next feature. Measure coupling. |
| "We need a full rewrite" | 90% of architecture issues can be fixed incrementally. Rewrites fail 70% of the time (IEEE study). |
| "Circular dependencies are harmless" | They cause build failures, test instability, and make modules impossible to extract or test independently. |
| "Refactoring is not a feature" | Technical debt compounds at ~23% per year (Gartner). Every sprint you delay costs more next sprint. |
| "We'll improve it in a dedicated sprint" | Dedicated refactoring sprints never get prioritized. Improve incrementally, every sprint. |
| "Splitting files just creates more files" | More small files with clear names > fewer god files. File count is not complexity. |
| "The tests still pass so it's fine" | Tests passing means behavior is preserved, not that architecture is healthy. Tests don't catch coupling. |

## Rules

1. **Measure before fixing** - No improvements without baseline metrics
2. **One fix at a time** - Never bundle multiple structural changes
3. **Verify after each fix** - TypeScript + tests must pass before proceeding
4. **Revert on failure** - If a fix breaks something, undo it and re-evaluate
5. **No feature changes** - Only structural improvements, never change behavior
6. **Update docs** - If boundaries change, update ARCHITECTURE.md
7. **Incremental only** - This skill improves, not migrates. Use `/migrate-architecture` for pattern changes
8. **Dependency order** - Fix circular dependencies before other issues

## Output

```
──── /improve-architecture ────
Target: $ARGUMENTS

Scan Results:
  God files:         N → N (-N)
  Circular deps:     N → N (-N)
  Boundary violations: N → N (-N)
  Max file size:     N → N lines

Fixes Applied: N/N
  ✓ [Fix 1 description]
  ✓ [Fix 2 description]
  ✓ [Fix 3 description]

Compilation: ✓ passing
Tests: ✓ passing ([N] tests)

──── Architecture improved incrementally ────
```
