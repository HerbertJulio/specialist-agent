---
name: codereview
description: "Use when you need a comprehensive code review combining architecture, security, and test perspectives - especially before merging, releasing, or after major changes."
user-invocable: true
argument-hint: "[path, module, or PR]"
allowed-tools: Read, Bash, Glob, Grep
---

# /codereview - Multi-Reviewer Parallel Code Review

Run a comprehensive code review that dispatches 3 specialized perspectives concurrently - architecture, security, and testing - then consolidates into a single actionable verdict.

**Target:** $ARGUMENTS

## Why 3 Perspectives, Not 6

Most multi-reviewer systems use 5-7 overlapping perspectives that waste tokens and produce redundant findings. `/codereview` uses exactly 3 orthogonal perspectives - each covers a distinct failure mode with zero overlap:

```
┌──────────────────────────────────────────────────────────────┐
│              PARALLEL REVIEW DISPATCH                        │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ @reviewer   │  │ @security   │  │ @tester     │          │
│  │ Architecture│  │ OWASP/Auth  │  │ Coverage    │          │
│  │ + Quality   │  │ + Data      │  │ + Edge Cases│          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│                  ┌──────────────┐                             │
│                  │ CONSOLIDATE  │                             │
│                  │ Deduplicate  │                             │
│                  │ Assign Sev.  │                             │
│                  │ Verdict      │                             │
│                  └──────────────┘                             │
└──────────────────────────────────────────────────────────────┘
```

## When to Use

- Before merging a pull request
- Before a production release
- After major refactors that touch multiple modules
- After new contributor PRs (unfamiliar with codebase conventions)
- When a change touches auth, payments, or data handling
- NOT for: quick single-file fixes (use `@reviewer` directly)
- NOT for: security-only audit (use `@security` directly)
- NOT for: test strategy design (use `@tester` directly)

## Workflow

### Step 1: Scope Detection

Determine the review target:

```
IF $ARGUMENTS is a file/directory path → review that path
IF $ARGUMENTS is a module name → find and review the module
IF $ARGUMENTS is a PR number/URL → extract changed files from PR diff
IF $ARGUMENTS is empty → review staged/uncommitted changes
```

Gather scope metrics:

```bash
# Count files and lines in scope
find $TARGET -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" \) | head -200 | xargs wc -l 2>/dev/null || true

# If PR, get the diff
gh pr diff $PR_NUMBER 2>/dev/null || git diff main...HEAD 2>/dev/null || true
```

Read the project's `docs/ARCHITECTURE.md` if it exists - this is the source of truth for architecture review.

### Step 2: Parallel Review Dispatch

Dispatch 3 concurrent review perspectives. Each reviewer gets the full file context but applies a different lens.

---

**Perspective 1: Architecture Review** (`@reviewer` focus)

Review the code for structural integrity and quality:

| Check | What to Look For |
|-------|------------------|
| Layer separation | Services don't import from components, no cross-module imports |
| Naming conventions | Files, functions, variables follow project conventions |
| Design patterns | DRY, SOLID, composition over inheritance |
| API contracts | DTOs/schemas at boundaries, typed inputs and outputs |
| Dependency direction | Layers depend inward, not outward |
| Code smells | Long methods (>40 lines), deep nesting (>3 levels), god objects |
| Type safety | No `any` abuse, strict mode, proper generics |
| Error handling | Try/catch at boundaries, custom error types, no swallowed errors |
| Import hygiene | No circular dependencies, barrel file discipline |

```bash
# Architecture checks
grep -rn ": any\|as any" $TARGET --include="*.ts" --include="*.tsx" 2>/dev/null | head -20
grep -rn "console\.\|debugger" $TARGET --include="*.ts" --include="*.tsx" --include="*.vue" 2>/dev/null | head -20
```

---

**Perspective 2: Security Review** (`@security` focus)

Review the code for vulnerabilities and data safety:

| Check | What to Look For |
|-------|------------------|
| Injection | SQL/NoSQL injection, command injection, template injection |
| XSS | Unsanitized output, `dangerouslySetInnerHTML`, `v-html`, raw HTML |
| Auth/AuthZ | Missing auth checks, broken access control, IDOR vulnerabilities |
| Input validation | Missing or insufficient validation, type coercion issues |
| Secrets | Hardcoded API keys, tokens, passwords, connection strings |
| Data exposure | Sensitive data in logs, error messages, API responses, URLs |
| CSRF | Missing CSRF tokens on state-changing operations |
| Cryptography | Weak algorithms, predictable tokens, missing encryption |
| Headers | Missing security headers (CSP, HSTS, X-Frame-Options) |
| Dependencies | Known CVEs in packages |

```bash
# Security checks
npm audit --json 2>/dev/null | head -50 || true
grep -rn "password\|secret\|token\|api_key\|apikey" $TARGET --include="*.ts" --include="*.tsx" --include="*.env*" 2>/dev/null | head -20
grep -rn "v-html\|dangerouslySetInnerHTML\|innerHTML" $TARGET --include="*.ts" --include="*.tsx" --include="*.vue" 2>/dev/null | head -20
grep -rn "eval(\|new Function(" $TARGET --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null | head -20
```

---

**Perspective 3: Test Review** (`@tester` focus)

Review the code for test quality and coverage:

| Check | What to Look For |
|-------|------------------|
| Coverage gaps | Business logic without corresponding tests |
| Missing edge cases | Null, empty, boundary values, error paths not tested |
| Test quality | Tests that test implementation vs behavior |
| Mocking correctness | Over-mocking, mocking what you own, leaking mocks |
| Assertion strength | Weak assertions (`toBeTruthy` vs `toEqual`), missing assertions |
| Test isolation | Shared mutable state, order-dependent tests |
| Naming clarity | Descriptive `it('should...')` vs vague test names |
| Test types | Right balance of unit/integration/e2e for the change |
| Regression risk | Changed code without updated tests |
| Flakiness signals | Timing dependencies, network calls in unit tests |

```bash
# Test checks
find $TARGET -name "*.spec.ts" -o -name "*.test.ts" -o -name "*.spec.tsx" -o -name "*.test.tsx" 2>/dev/null | wc -l
npx vitest run --passWithNoTests --reporter=json 2>/dev/null || npx jest --json --passWithNoTests 2>/dev/null || true
```

### Step 3: Consolidation

Merge findings from all 3 perspectives:

1. **Deduplicate** - Remove findings flagged by multiple perspectives (keep highest severity)
2. **Cross-reference** - A security finding that also lacks tests is escalated one severity level
3. **Assign severity** - Every finding gets a severity level (see table below)
4. **Sort** - CRITICAL first, then HIGH, MEDIUM, LOW
5. **Group** - By file, then by severity within each file

### Step 4: Verdict

Apply verdict rules based on the consolidated findings. The verdict is final and non-negotiable - it follows the rules mechanically.

## Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| CRITICAL | Security vulnerability, data loss risk, auth bypass | Block merge. Fix immediately. |
| HIGH | Architecture violation, missing validation, untested critical path | Request changes. Fix before merge. |
| MEDIUM | Code quality issue, weak test, minor vulnerability | Approve with notes. Fix in next sprint. |
| LOW | Style issue, minor improvement, optional optimization | Approve. Fix when convenient. |

## Verdict Rules

| Condition | Verdict | Meaning |
|-----------|---------|---------|
| Any CRITICAL finding | **BLOCK** | Do not merge under any circumstances |
| Any HIGH finding (no CRITICAL) | **REQUEST_CHANGES** | Fix HIGH findings, then re-review |
| MEDIUM findings only | **APPROVE WITH NOTES** | Safe to merge, but address MEDIUM items soon |
| LOW findings only (or none) | **APPROVE** | Clean to merge |

**Escalation rules:**
- A security finding without a corresponding test → severity +1 level
- A finding that recurs from a previous review → severity +1 level
- A finding in auth, payments, or PII handling → minimum severity HIGH

## Verification Protocol

**Before claiming the review is complete:**

1. All 3 perspectives were executed (architecture, security, tests)
2. Every finding has a severity level assigned
3. Every CRITICAL or HIGH finding includes a specific file:line reference
4. Every CRITICAL or HIGH finding includes a concrete remediation suggestion
5. Automated checks were run where available (`npm audit`, `tsc`, linting, test suite)
6. The verdict follows the Verdict Rules mechanically - no exceptions
7. Cross-referencing was performed (security findings checked for test coverage)

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "No security issues found" | Did you check all OWASP categories? Absence of evidence is not evidence of absence. |
| "Tests look fine" | Did you check edge cases, error paths, and assertion strength? Or just that tests exist? |
| "Architecture is clean" | Did you trace actual imports and dependency direction? Or just scan filenames? |
| "It's just a small change" | Small changes cause production outages. Review scope does not reduce rigor. |
| "The CI passed" | CI checks syntax, not logic. A green build is not a security audit. |
| "Previous review approved this pattern" | Patterns can be wrong. Evaluate independently every time. |
| "Too many files to review thoroughly" | Scope down to critical paths (auth, data, business logic). Never skip security. |
| "The author is senior, they know what they're doing" | Seniority does not prevent bugs. Review the code, not the author. |

## Rules

1. **All 3 perspectives are mandatory** - Skipping one defeats the purpose of multi-reviewer review
2. **Read-only** - Never modify files during a review
3. **Evidence required** - Every finding needs a file:line reference and explanation
4. **Remediation required** - Findings without fix suggestions are useless
5. **Verdict is mechanical** - Follow the Verdict Rules table, no subjective overrides
6. **No sycophancy** - Never say "LGTM", "looks good", or "great job" without evidence
7. **Cross-reference findings** - A security issue without tests is worse than either alone
8. **Severity must be justified** - Every rating needs a specific technical reason
9. **Run automated tools** - Never skip `npm audit`, linting, or type checking if available
10. **Fresh context per perspective** - Each reviewer perspective starts from the code, not from another reviewer's output

## Output

```
──── /codereview ────
Target: [path or PR]
Scope: [X files, Y lines]

Architecture: [N findings] - @reviewer
Security:     [N findings] - @security
Tests:        [N findings] - @tester

Severity:
  CRITICAL: N
  HIGH: N
  MEDIUM: N
  LOW: N

Top Findings:
1. [CRITICAL] [description] - [file:line]
2. [HIGH] [description] - [file:line]
3. [HIGH] [description] - [file:line]

Verdict: [APPROVE | APPROVE WITH NOTES | REQUEST_CHANGES | BLOCK]
Reason: [1-line justification]
```
