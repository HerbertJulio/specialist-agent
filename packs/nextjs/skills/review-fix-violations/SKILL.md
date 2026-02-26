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
   - try/catch in services -> remove, move error handling to hook or Server Action
   - Transformation in services -> move to adapter
   - Hooks in Server Components -> add `'use client'` or move hooks to Client Component
   - Missing `'use client'` in components with hooks -> add directive
   - Missing `'use server'` in actions -> add directive
   - error.tsx without `'use client'` -> add directive
   - dangerouslySetInnerHTML without sanitization -> remove or sanitize
   - Hardcoded secrets -> move to env vars

   **Important:**
   - Server state in Zustand -> migrate to React Query hooks
   - any types -> type correctly
   - Missing staleTime in queries -> add
   - Missing loading.tsx / error.tsx -> create
   - Pages Router remnants -> convert to App Router
   - `<img>` tags -> convert to `next/image`
   - Missing metadata in pages -> add metadata export

   **Improvements:**
   - Components > 200 lines -> decompose
   - Console.log -> remove
   - TODO/FIXME -> resolve or create issue

3. Validate after each fix:
```bash
npx tsc --noEmit && npx next build && npx vitest run --passWithNoTests
```

4. Report what was fixed and what remains.
