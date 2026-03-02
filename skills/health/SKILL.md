---
name: health
description: "Use when assessing overall project quality, onboarding onto a new codebase, or before major refactoring to establish a baseline."
user-invocable: true
argument-hint: "[module or 'full']"
allowed-tools: Read, Bash, Glob, Grep
---

# /health - Project Health Score

Generate a comprehensive health score for your project or a specific module.

**Scope:** $ARGUMENTS (default: full project)

## Scoring Categories

| Category | Weight | What it measures |
|----------|--------|------------------|
| Architecture | 25% | ARCHITECTURE.md conformance |
| Tests | 20% | Coverage, test presence |
| Security | 20% | OWASP compliance, secrets |
| Performance | 15% | Bundle size, caching |
| Maintainability | 20% | Code complexity, docs |

## Workflow

### Step 1: Gather Metrics

```bash
# File counts
find src -name "*.ts" -o -name "*.tsx" | wc -l
find src -name "*.test.ts" -o -name "*.spec.ts" | wc -l

# TypeScript check
npx tsc --noEmit 2>&1 | grep -c "error"

# Test coverage (if available)
npm test -- --coverage --json 2>/dev/null

# Bundle analysis
npm run build 2>&1 | grep -E "size|chunk"

# Security checks
grep -rn "dangerouslySetInnerHTML\|v-html\|eval(" src/ 2>/dev/null | wc -l
grep -rn "password\|secret\|token" src/ --include="*.ts" 2>/dev/null | wc -l
```

### Step 2: Calculate Scores

#### Architecture Score (25 points)
```
+5  ARCHITECTURE.md exists
+5  Module structure follows patterns
+5  No cross-module imports
+5  Correct layer usage (service→adapter→hook→component)
+5  Naming conventions followed
```

#### Test Score (20 points)
```
+5  Test files exist
+5  Coverage > 50%
+5  Coverage > 70%
+5  Coverage > 80%
+5  All tests passing
-2  Each failing test
```

#### Security Score (20 points)
```
+5  No hardcoded secrets
+5  No dangerous HTML methods
+5  Input validation present
+5  Auth implementation exists
+5  Secure headers configured
-5  Each critical vulnerability
```

#### Performance Score (15 points)
```
+5  Lazy loading implemented
+5  Query caching present (staleTime)
+5  Bundle < 500KB
+5  No N+1 queries detected
-3  Each performance warning
```

#### Maintainability Score (20 points)
```
+5  README.md exists
+5  Files < 200 lines (average)
+5  Low cyclomatic complexity
+5  TypeScript strict mode
+5  No 'any' types
-2  Each 'any' type found
```

### Step 3: Generate Report

## Output Format

```
═══════════════════════════════════════════════════════════════
                    PROJECT HEALTH REPORT
═══════════════════════════════════════════════════════════════

   ██████████████████████████████████████░░░░░░░░  78/100

═══════════════════════════════════════════════════════════════

CATEGORY BREAKDOWN
───────────────────────────────────────────────────────────────

Architecture    ████████████████████░░░░░  20/25
  ✓ ARCHITECTURE.md exists
  ✓ Module structure correct
  ✗ Cross-module imports found (3 violations)
  ✓ Layer usage correct
  ✓ Naming conventions followed

Tests           ████████████████░░░░░░░░░  16/20
  ✓ Test files exist (42 specs)
  ✓ Coverage: 72%
  ✗ Coverage < 80% target
  ✓ All tests passing

Security        █████████████████████████  20/20
  ✓ No hardcoded secrets
  ✓ No dangerous HTML methods
  ✓ Input validation present
  ✓ Auth implementation exists
  ✓ Secure headers configured

Performance     █████████████░░░░░░░░░░░░  10/15
  ✓ Lazy loading implemented
  ✗ Missing staleTime in 5 queries
  ✓ Bundle: 320KB
  ✗ Potential N+1 in user.service.ts

Maintainability ████████████░░░░░░░░░░░░░  12/20
  ✓ README.md exists
  ✗ 3 files > 200 lines
  ✓ Low complexity
  ✓ TypeScript strict mode
  ✗ 12 'any' types found

═══════════════════════════════════════════════════════════════

TOP ISSUES TO FIX (by impact)
───────────────────────────────────────────────────────────────

1. 🔴 [Architecture] Cross-module imports
   Files: src/modules/orders/components/UserCard.tsx
   Fix: Move shared components to src/shared/

2. 🟡 [Performance] Missing staleTime in queries
   Files: src/modules/*/hooks/use*.ts (5 files)
   Fix: Add staleTime to all useQuery calls

3. 🟡 [Maintainability] Files exceeding 200 lines
   Files: src/modules/auth/components/LoginForm.tsx (284 lines)
   Fix: Split into smaller components

4. 🟡 [Tests] Coverage below 80%
   Current: 72%
   Fix: Add tests for uncovered modules

═══════════════════════════════════════════════════════════════

TREND (if previous scans exist)
───────────────────────────────────────────────────────────────

  Previous: 71/100 (2024-01-10)
  Current:  78/100 (2024-01-20)
  Change:   +7 points ↑

═══════════════════════════════════════════════════════════════

RECOMMENDATIONS
───────────────────────────────────────────────────────────────

  @reviewer  - Run /review-fix-violations to auto-fix
  @tester    - Add tests for auth module
  @builder   - Refactor LoginForm.tsx

═══════════════════════════════════════════════════════════════
  Generated: 2024-01-20 14:30 | Scan time: 12s
═══════════════════════════════════════════════════════════════
```

## Score Interpretation

| Score | Grade | Status |
|-------|-------|--------|
| 90-100 | A | Excellent |
| 80-89 | B | Good |
| 70-79 | C | Acceptable |
| 60-69 | D | Needs Work |
| 0-59 | F | Critical |

## Save History

Save scan to `.claude/health-history.json`:

```json
{
  "scans": [
    {
      "date": "2024-01-20T14:30:00Z",
      "score": 78,
      "categories": {
        "architecture": 20,
        "tests": 16,
        "security": 20,
        "performance": 10,
        "maintainability": 12
      }
    }
  ]
}
```

## Quick Mode

For fast feedback (< 5 seconds):

```
/health quick
```

Only checks:
- TypeScript errors
- Test status
- File count

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "The score doesn't matter, the app works" | Working today doesn't mean maintainable tomorrow. The score measures long-term health. |
| "We'll improve the score after the deadline" | After the deadline there's another deadline. Measure now, fix incrementally. |
| "80% coverage is overkill" | 80% is the baseline. Below that, regressions hide in untested code. |
| "Security checks are paranoid" | One vulnerability costs more than 100 health scans. Paranoia is appropriate. |

## Rules

1. **Be objective** - Numbers, not opinions
2. **Prioritize issues** - Most impactful first
3. **Show trends** - Compare to previous scans
4. **Actionable** - Suggest specific fixes
5. **Save history** - Track progress over time
