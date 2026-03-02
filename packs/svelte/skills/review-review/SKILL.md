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
npx svelte-check --tsconfig ./tsconfig.json
npx eslint src/ --max-warnings 0
npx vitest run --passWithNoTests
```

3. Check ARCHITECTURE.md patterns:
   - Services: no try/catch, no transformation, native fetch
   - Adapters: pure functions
   - Load functions: service -> adapter -> typed return, error()/redirect() without throw
   - Stores: client state only
   - Components: Svelte 5 runes ($state, $derived, $props), typed props, < 200 lines
   - No Svelte 4 patterns: `export let`, `$:` reactive, `createEventDispatcher`, `<slot>`
   - No SvelteKit 1 patterns: `$app/stores`, `throw redirect`, `throw error`
   - Naming: correct conventions
   - Boundaries: no cross-module imports

4. Classify:
   - VIOLATION -- ARCHITECTURE.md violation
   - ATTENTION -- Recommended improvement
   - COMPLIANT -- Correct
   - HIGHLIGHT -- Positive highlight

5. Produce report with verdict: Approved | With caveats | Requires changes
