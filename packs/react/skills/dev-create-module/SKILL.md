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
src/modules/[kebab-case-name]/
+-- components/
+-- hooks/
+-- services/
+-- adapters/
+-- stores/
+-- types/
+-- pages/
+-- __tests__/
+-- index.ts
```

3. Create `index.ts` with empty barrel export:

```typescript
// src/modules/[name]/index.ts
// Public API for this module
```

4. Ask the user:
   - Which API endpoints does this module consume?
   - What UI type? (list with CRUD, dashboard, form, detail)

5. Use `@builder` to create bottom-up:
   - Types + contracts + adapter + service
   - Hooks with React Query
   - Components with typed props
   - Page composing components

6. Register the route in the router using React.lazy() + Suspense.

7. Validate: `npx tsc --noEmit && npx vite build`
