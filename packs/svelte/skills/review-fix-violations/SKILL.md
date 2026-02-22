---
name: review-fix-violations
description: "Find and auto-fix ARCHITECTURE.md violations in a module"
user-invocable: true
argument-hint: "[module]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Identify and fix `docs/ARCHITECTURE.md` violations in the specified module.

Module: $ARGUMENTS

## Steps

1. Run `/review-check-architecture` to find violations.

2. For each violation found, fix in priority order:

   **Critical (fix first):**
   - try/catch in services -> remove, move error handling to load function
   - Transformation in services -> move to adapter
   - `{@html}` without sanitization -> remove or sanitize
   - Hardcoded secrets -> move to env vars
   - SvelteKit 1 patterns -> migrate to SvelteKit 2

   **Important:**
   - Svelte 4 `export let` -> migrate to `$props()` rune
   - Svelte 4 `$:` reactive -> migrate to `$derived` / `$effect`
   - Svelte 4 `createEventDispatcher` -> migrate to callback props
   - Svelte 4 `<slot>` -> migrate to `{@render}` + snippets
   - Server state in client stores -> migrate to load functions
   - `any` types -> type correctly
   - `$app/stores` -> `$app/state`
   - `throw redirect/error` -> remove throw

   **Improvements:**
   - Components > 200 lines -> decompose
   - Console.log -> remove
   - TODO/FIXME -> resolve or create issue
   - Missing `$state` rune -> add where reactive state needed

3. Validate after each fix:
```bash
npx svelte-check --tsconfig ./tsconfig.json && npx vite build && npx vitest run --passWithNoTests
```

4. Report what was fixed and what remains.
