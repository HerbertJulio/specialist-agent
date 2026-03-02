---
name: review-review
description: "Use when code changes need review before merge - validates architecture, types, security, and test coverage."
user-invocable: true
argument-hint: "[scope]"
allowed-tools: Read, Bash, Glob, Grep
---

Perform a full code review of changed files, validating against `docs/ARCHITECTURE.md`.

Scope: $ARGUMENTS (if empty, review files changed in git)

## Steps

1. Identify changed files:
```bash
git diff --name-only HEAD~1 2>/dev/null || git diff --name-only --cached 2>/dev/null || echo "Please specify the files"
```

2. Run automated checks:
```bash
npx astro check
npx eslint --ext .ts,.astro src/ --max-warnings 0
npx astro build
npx vitest run --passWithNoTests
```

3. Check ARCHITECTURE.md patterns:
   - Services: no try/catch, no transformation, fetch only
   - Adapters: pure functions
   - Pages: data fetching in frontmatter, error handling, layout usage
   - Components: .astro for static, islands for interactive only
   - Islands: correct `client:*` directive, serializable props, minimal scope
   - Content Collections: schema validation, proper querying
   - Naming: correct conventions
   - Boundaries: no cross-module imports

4. Classify:
   - VIOLATION - ARCHITECTURE.md violation
   - ATTENTION - Recommended improvement
   - COMPLIANT - Correct
   - HIGHLIGHT - Positive highlight

5. Produce report with verdict: Approved | With caveats | Requires changes
