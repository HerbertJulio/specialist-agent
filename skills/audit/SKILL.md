---
name: audit
description: "Use when you need a comprehensive code audit covering security, performance, architecture, and dependencies before a release, major refactor, or compliance review."
user-invocable: true
argument-hint: "[path or module]"
allowed-tools: Read, Bash, Glob, Grep
---

# /audit - Multi-Agent Code Audit

Run a comprehensive audit that combines security, performance, architecture, and dependency analysis in one pass.

**Target:** $ARGUMENTS

## When to Use

- Before a production release
- After a major refactor
- During compliance reviews (SOC2, ISO 27001)
- When onboarding to an unfamiliar codebase
- When technical debt feels unmanageable
- NOT for: single-file reviews (use `@reviewer` instead)

## Workflow

### Step 1: Scope Definition

Determine audit scope:

```
IF $ARGUMENTS is a path → audit that path
IF $ARGUMENTS is a module name → find and audit the module
IF $ARGUMENTS is empty → audit entire project
```

Read the project structure. Identify:
- Total files and lines of code
- Primary language and framework
- Test coverage indicators
- CI/CD configuration

### Step 2: Security Audit

Check for OWASP Top 10 vulnerabilities:

| Check | What to Look For |
|-------|------------------|
| Injection | SQL/NoSQL injection, command injection, XSS |
| Auth | Hardcoded secrets, weak JWT config, missing CSRF |
| Access Control | Missing auth checks, IDOR, privilege escalation |
| Cryptography | Weak algorithms, plaintext passwords, missing encryption |
| Configuration | Debug mode in production, verbose errors, default credentials |
| Dependencies | Known CVEs in packages |
| Data Exposure | Sensitive data in logs, responses, or error messages |

Run if available:
```bash
npm audit --json 2>/dev/null || true
npx eslint --format json $TARGET 2>/dev/null || true
```

### Step 3: Architecture Audit

Check structural integrity:

| Check | Criteria |
|-------|----------|
| Layer separation | Services don't import from components |
| Circular dependencies | No import cycles |
| Naming conventions | Consistent file/function naming |
| Type safety | TypeScript strict mode, no `any` abuse |
| Error handling | Try/catch at boundaries, custom error classes |
| API contracts | DTOs/schemas at boundaries |

### Step 4: Performance Audit

Check for performance issues:

| Check | What to Look For |
|-------|------------------|
| Bundle size | Large imports, missing tree-shaking |
| N+1 queries | Database calls in loops |
| Memory leaks | Uncleaned listeners, subscriptions, timers |
| Rendering | Unnecessary re-renders, missing memoization |
| Network | Missing caching, redundant API calls |
| Assets | Unoptimized images, missing lazy loading |

### Step 5: Observability Audit

Check for production readiness observability:

| Check | What to Look For |
|-------|------------------|
| Structured logging | JSON format, consistent fields (timestamp, level, service, traceId) |
| Error tracking | Errors captured with context (user, request, stack trace) |
| Health endpoints | `/health` or equivalent exposed by every service |
| Metrics | RED metrics (Rate, Errors, Duration) for critical operations |
| Correlation IDs | Trace/request IDs propagated across service boundaries |
| Sensitive data | NO passwords, tokens, PII, credit cards in logs |

```bash
# Check for structured logging
grep -rn "console\.log\|console\.error\|console\.warn" $TARGET --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "node_modules\|test\|spec" | head -15

# Check for health endpoints
grep -rn "health\|healthcheck\|readiness\|liveness" $TARGET --include="*.ts" --include="*.tsx" 2>/dev/null | head -10

# Check for sensitive data in logs
grep -rn "console\.\|logger\.\|log\." $TARGET --include="*.ts" 2>/dev/null | grep -i "password\|token\|secret\|credit\|ssn" | head -10
```

### Step 6: Accessibility Audit (if frontend detected)

If the project contains frontend code (`.tsx`, `.vue`, `.svelte`, `.astro`), check:

| Check | Criteria |
|-------|----------|
| Alt text | All images have descriptive alt attributes |
| Form labels | All inputs have associated labels or aria-label |
| Heading hierarchy | Single H1, logical H2-H6, no skipped levels |
| Keyboard navigation | Interactive elements accessible via keyboard |
| Color contrast | Text meets WCAG AA 4.5:1 ratio |
| ARIA usage | Correct roles, states, properties |

```bash
# Detect frontend code
FRONTEND_FILES=$(find $TARGET -name "*.tsx" -o -name "*.vue" -o -name "*.svelte" -o -name "*.astro" 2>/dev/null | grep -v node_modules | head -5)
if [ -n "$FRONTEND_FILES" ]; then
  echo "Frontend detected - running accessibility checks"
  grep -rn "<img" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v "alt=" | head -10
  grep -rn "<input\|<select" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v "aria-label\|id=" | head -10
fi
```

### Step 7: Dependency Audit

Check dependency health:

| Check | What to Look For |
|-------|------------------|
| Outdated | Major versions behind |
| Vulnerable | Known CVEs |
| Unused | Installed but not imported |
| Duplicate | Multiple versions of same package |
| License | Incompatible licenses (GPL in MIT project) |

Run if available:
```bash
npx depcheck --json 2>/dev/null || true
```

### Step 8: Report Generation & Scoring

Compile findings into a structured report with severity ratings.

**Scoring formula per domain (0-100):**
- Start at 100
- CRITICAL finding: -25 points
- HIGH finding: -15 points
- MEDIUM finding: -10 points
- LOW finding: -5 points
- INFO: -0 points
- Minimum: 0

**Overall score** = average of all domain scores (weighted: Security 30%, Architecture 25%, Performance 20%, Observability 15%, Dependencies 10%).

## Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| CRITICAL | Security vulnerability or data loss risk | Fix immediately |
| HIGH | Architecture violation or major performance issue | Fix before release |
| MEDIUM | Code quality issue or minor vulnerability | Fix in next sprint |
| LOW | Style issue or minor improvement | Fix when convenient |
| INFO | Observation or recommendation | Consider for future |

## Verification Protocol

**Before claiming audit is complete:**

1. All domains were checked (security, architecture, performance, observability, dependencies, and accessibility if frontend)
2. Every finding has a severity level
3. Every CRITICAL/HIGH finding has a specific remediation step
4. Automated tools were run where available (npm audit, eslint, depcheck)
5. Report includes line-level references for each finding

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "No security issues found" | Absence of evidence is not evidence of absence. Did you check all OWASP categories? |
| "Architecture looks fine" | Did you trace actual imports, or just scan filenames? |
| "Dependencies are up to date" | Did you run `npm audit`? Check for unused deps? |
| "Performance seems okay" | Did you check for N+1 queries, memory leaks, bundle size? |
| "The codebase is too large to audit fully" | Scope down to critical paths (auth, payments, data). Never skip security. |
| "Observability is a nice-to-have" | Production without observability is flying blind. You can't fix what you can't see. |
| "Accessibility doesn't apply to us" | Internal tools have users with disabilities too. And legal requirements don't have exemptions. |

## Rules

1. **Check all domains** - Skipping one defeats the purpose (security, architecture, performance, observability, dependencies + accessibility if frontend)
2. **Run automated tools** - Never skip `npm audit` or linting if available
3. **Severity must be justified** - Every rating needs evidence
4. **Remediation is required** - Findings without fix suggestions are useless
5. **Line references are required** - Point to exact files and lines
6. **Never assume safety** - Verify, don't trust

## Output

```
──── /audit ────
Target: [path or module]
Scope: [X files, Y lines]

Security:      [score]/100 - [X critical, Y high, Z medium]
Architecture:  [score]/100 - [X high, Y medium]
Performance:   [score]/100 - [X high, Y medium]
Observability: [score]/100 - [X high, Y medium]
Dependencies:  [score]/100 - [X vulnerable, Y outdated, Z unused]
Accessibility: [score]/100 - [N findings] (if frontend)

Overall Score: [0-100] (weighted average)
Risk Level: [CRITICAL | HIGH | MEDIUM | LOW]

Top Findings:
1. [CRITICAL] [description] - [file:line]
2. [HIGH] [description] - [file:line]
3. [HIGH] [description] - [file:line]

Full report: [inline below]
```
