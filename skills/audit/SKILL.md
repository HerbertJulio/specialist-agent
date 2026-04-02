---
name: audit
description: "Performs a multi-domain code audit that scans for security vulnerabilities (OWASP Top 10), identifies performance bottlenecks (N+1 queries, memory leaks, bundle size), evaluates architectural integrity (circular dependencies, layer violations), checks dependency health (CVEs, outdated, unused packages), assesses observability readiness, and generates a scored report with line-level findings. Use for code review, vulnerability scan, tech debt assessment, pre-release check, dependency audit, compliance review (SOC2, ISO 27001), or when onboarding to an unfamiliar codebase."
allowed-tools: Read, Bash(npm audit:*), Bash(npx eslint:*), Bash(npx depcheck:*), Bash(grep:*), Bash(find:*), Glob, Grep
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

Scan for OWASP Top 10 using these detection strategies:

```bash
# Injection: unsanitized user input in queries/commands
grep -rn "execute\|query\|exec(" $TARGET --include="*.ts" --include="*.js" 2>/dev/null | grep -v node_modules | head -20

# Hardcoded secrets: API keys, passwords, tokens in source
grep -rn "password\s*=\|api_key\s*=\|secret\s*=\|Bearer\s" $TARGET --include="*.ts" --include="*.js" --include="*.env*" 2>/dev/null | grep -v node_modules | head -15

# Missing auth: route handlers without auth middleware
grep -rn "app\.\(get\|post\|put\|delete\)\|router\.\(get\|post\|put\|delete\)" $TARGET --include="*.ts" --include="*.js" 2>/dev/null | grep -v "auth\|guard\|middleware\|protect" | head -15

# Dependency vulnerabilities
npm audit --json 2>/dev/null || true
npx eslint --format json $TARGET 2>/dev/null || true
```

Flag: injection paths, hardcoded credentials, unprotected routes, weak crypto (`md5`, `sha1`), debug/verbose configs, sensitive data in error responses.

### Step 3: Architecture Audit

Detect structural issues with concrete checks:

```bash
# Circular dependencies: find mutual imports between modules
grep -rn "^import.*from\s" $TARGET --include="*.ts" --include="*.js" 2>/dev/null | grep -v node_modules > /tmp/imports.txt
# Cross-reference: if A imports B and B imports A → cycle

# TypeScript `any` abuse
grep -rn ": any\b\|as any\b" $TARGET --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | wc -l

# Layer violations: components importing from services or DB layers
grep -rn "from.*repository\|from.*database\|from.*prisma" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v node_modules | head -10
```

Also check: naming consistency, error handling at boundaries (try/catch in controllers/handlers), and API contract validation (DTOs/schemas).

### Step 4: Performance Audit

Detect performance anti-patterns:

```bash
# N+1 queries: DB calls inside loops (for/forEach/map with await)
grep -rn "for\|forEach\|\.map(" $TARGET --include="*.ts" --include="*.js" -A 3 2>/dev/null | grep -E "await.*find|await.*query|await.*get" | head -10

# Memory leaks: event listeners or intervals without cleanup
grep -rn "addEventListener\|setInterval\|subscribe(" $TARGET --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "removeEventListener\|clearInterval\|unsubscribe" | grep -v node_modules | head -10

# Large imports: barrel imports that prevent tree-shaking
grep -rn "import.*from ['\"]lodash['\"]" $TARGET --include="*.ts" --include="*.js" 2>/dev/null | grep -v "lodash/" | head -5
```

Also check: missing memoization in React (`useMemo`/`useCallback`), redundant API calls, missing lazy loading for images/routes.

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
