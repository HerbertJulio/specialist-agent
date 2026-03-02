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
npx eslint --ext .ts,.vue src/ --max-warnings 0
npx vitest run --passWithNoTests
```

3. Check ARCHITECTURE.md patterns:
   - Services: no try/catch, no transformation
   - Adapters: pure functions
   - Composables: use service+adapter, staleTime defined
   - Stores: client state only, storeToRefs in consumers
   - Components: script setup, typed props/emits, < 200 lines
   - Naming: correct conventions
   - Boundaries: no cross-module imports

4. Classify:
   - 🔴 ARCHITECTURE.md violation
   - 🟡 Recommended improvement
   - 🟢 Compliant
   - ✨ Positive highlight

5. Produce report with verdict: ✅ Approved | ⚠️ With caveats | ❌ Requires changes
