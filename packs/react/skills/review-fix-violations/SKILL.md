---
name: review-fix-violations
description: "Use when architecture violations were found and need automated fixing by priority."
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
   - try/catch in services -> remove, move error handling to hook (onError)
   - Transformation in services -> move to adapter
   - dangerouslySetInnerHTML without sanitization -> remove or sanitize
   - Hardcoded secrets -> move to env vars

   **Important:**
   - Class components -> convert to functional (`/migration-migrate-component`)
   - PropTypes -> replace with TypeScript interface
   - Redux -> migrate to Zustand store
   - Server state in Zustand -> migrate to React Query hook
   - any types -> type correctly
   - Full Zustand destructure -> use selectors
   - Queries without staleTime -> add staleTime

   **Improvements:**
   - Components > 200 lines -> decompose
   - Console.log -> remove
   - Inline style objects -> extract to const or CSS
   - TODO/FIXME -> resolve or create issue

3. Validate after each fix:
```bash
npx tsc --noEmit && npx vite build && npx vitest run --passWithNoTests
```

4. Report what was fixed and what remains.
