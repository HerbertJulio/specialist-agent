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
npx tsc --noEmit
ng lint
ng test --watch=false
```

3. Check ARCHITECTURE.md patterns:
   - Services: HttpClient only, no try/catch, no transformation, inject(HttpClient)
   - Adapters: pure functions
   - Stores: signal-based, private WritableSignal, public asReadonly()
   - Components: standalone, input()/output() signals, OnPush, < 200 lines
   - Naming: kebab-case files, PascalCase classes
   - Boundaries: no cross-module imports
   - DI: inject() everywhere, no constructor DI

4. Classify:
   - VIOLATION - breaks ARCHITECTURE.md
   - ATTENTION - recommended improvement
   - COMPLIANT - correct
   - HIGHLIGHT - positive highlight

5. Produce report with verdict: Approved | With caveats | Requires changes
