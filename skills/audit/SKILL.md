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

### Step 5: Dependency Audit

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

### Step 6: Report Generation

Compile findings into a structured report with severity ratings.

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

1. All 4 audit domains were checked (security, architecture, performance, dependencies)
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

## Rules

1. **Check all 4 domains** - Skipping one defeats the purpose
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

Security:     [X critical, Y high, Z medium]
Architecture: [X high, Y medium]
Performance:  [X high, Y medium]
Dependencies: [X vulnerable, Y outdated, Z unused]

Overall Score: [0-100]
Risk Level: [CRITICAL | HIGH | MEDIUM | LOW]

Top Findings:
1. [CRITICAL] [description] - [file:line]
2. [HIGH] [description] - [file:line]
3. [HIGH] [description] - [file:line]

Full report: [inline below]
```
