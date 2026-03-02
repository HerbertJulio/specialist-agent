---
name: dev-create-module
description: "Use when creating a new feature module with all layers - service, adapter, types, pages, components, and tests."
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
├── services/
├── adapters/
├── types/
├── __tests__/
└── index.ts
```

3. Create `index.ts` with empty barrel export:

```typescript
// src/modules/[name]/index.ts
// Public API for this module
```

4. Ask the user:
   - Which API endpoints does this module consume?
   - What UI type? (list with CRUD, blog, dashboard, form, detail)
   - Does it need interactive islands? (forms, search, filters)

5. Use `@builder` to create bottom-up:
   - Types + contracts + adapter + service
   - Pages in `src/pages/` with frontmatter data fetching
   - .astro components for presentational UI
   - Islands for interactive parts (if needed)
   - API endpoints in `src/pages/api/` (if mutations needed)

6. Create layout if module needs a specific page template.

7. Validate: `npx astro check && npx astro build`
