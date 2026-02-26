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

   **🔴 Critical (fix first):**
   - try/catch in services → remove, move error handling to composable
   - Transformation in services → move to adapter
   - v-html without sanitization → remove or sanitize
   - Hardcoded secrets → move to env vars

   **🟡 Important:**
   - Options API → migrate to script setup (`/migration-migrate-component`)
   - Server state in Pinia → migrate to Vue Query
   - any types → type correctly
   - Missing storeToRefs → add
   - Queries without staleTime → add

   **🟢 Improvements:**
   - Components > 200 lines → decompose
   - Console.log → remove
   - TODO/FIXME → resolve or create issue

3. Validate after each fix:
```bash
npx tsc --noEmit && npx vite build && npx vitest run --passWithNoTests
```

4. Report what was fixed and what remains.
