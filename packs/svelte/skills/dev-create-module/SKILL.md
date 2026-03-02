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

1. Read `docs/ARCHITECTURE.md` sections 2, 3 and 4.

2. Create the directory structure:

```text
src/lib/modules/[kebab-case-name]/
├── components/
├── stores/
├── services/
├── adapters/
├── types/
├── __tests__/
└── index.ts
```

3. Create route files:

```text
src/routes/[kebab-case-name]/
├── +page.svelte
├── +page.ts          # Universal load function
├── +error.svelte
└── [id]/
    ├── +page.svelte
    └── +page.ts
```

4. Create `index.ts` with empty barrel export:

```typescript
// src/lib/modules/[name]/index.ts
// Public API for this module
```

5. Ask the user:
   - Which API endpoints does this module consume?
   - What UI type? (list with CRUD, dashboard, form, detail)

6. Use `@builder` to create bottom-up:
   - Types + contracts + adapter + service
   - Svelte store for client state
   - Load functions for server state
   - Components with Svelte 5 runes

7. Validate: `npx svelte-check --tsconfig ./tsconfig.json && npx vite build`
