---
name: dev-create-module
description: "Use when creating a new feature module with all layers - service, adapter, types, state, components, and tests."
user-invocable: true
argument-hint: "[module-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a new complete feature module following `docs/ARCHITECTURE.md`.

Module name: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` sections 2, 3, 4 and 6.

2. Create the module structure:

```text
src/modules/[kebab-case-name]/
├── components/
├── hooks/
├── services/
├── adapters/
├── stores/
├── actions/
├── types/
├── __tests__/
└── index.ts
```

3. Create the app route structure:

```text
app/[kebab-case-name]/
├── page.tsx          # Server Component (async, fetches data)
├── layout.tsx        # Server Component (shared layout)
├── loading.tsx       # Skeleton loading UI
└── error.tsx         # Error boundary ('use client' required)
```

4. Create `index.ts` with empty barrel export:

```typescript
// src/modules/[name]/index.ts
// Public API for this module
```

5. Ask the user:
   - Which API endpoints does this module consume?
   - What UI type? (list with CRUD, dashboard, form, detail)

6. Use `@builder` to create bottom-up:
   - Types + contracts + adapter + service
   - Zustand store (client state)
   - Server Actions (mutations)
   - Hooks with React Query (client-side data)
   - Components (Server + Client as needed)
   - Page (Server Component composing Client Components)

7. Add metadata export to page.tsx.

8. Validate: `npx tsc --noEmit && npx next build`
