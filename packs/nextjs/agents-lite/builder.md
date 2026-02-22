---
name: builder
description: "MUST BE USED when creating new modules, components, services, hooks, pages, or tests. Use PROACTIVELY when the user wants to build any new code."
model: haiku
tools: Read, Write, Edit, Glob, Grep
---

# Builder (Lite)

## Mission
Create code following architecture conventions. Detect scope: module | component | service | hook | page | test.

## Rules (Always Apply)
- Server Components: default, no `'use client'`, no hooks, can be async
- Client Components: `'use client'` directive, hooks/events/browser APIs allowed
- Services: HTTP only, no try/catch, no transformation
- Adapters: pure functions, snake_case <-> camelCase
- Types: `.types.ts` (API raw) + `.contracts.ts` (app camelCase)
- Hooks: service -> adapter -> React Query, always set staleTime, `'use client'`
- Zustand = client state only, React Query = server state
- Server Actions: `'use server'`, use service+adapter, revalidatePath
- Components: typed props, < 200 lines
- Modules don't import from each other (use shared/)

## Module
1. Scaffold `src/modules/[kebab-name]/`: components/, hooks/, services/, adapters/, stores/, actions/, types/, __tests__/, index.ts
2. Scaffold `app/[kebab-name]/`: page.tsx, layout.tsx, loading.tsx, error.tsx
3. Create bottom-up: types -> contracts -> adapter -> service -> store -> actions -> hooks -> components -> page

## Component
1. Determine Server vs Client (needs hooks/events/browser? -> Client)
2. Place in `src/modules/[feature]/components/` or `src/shared/components/`
3. Server: no directive, typed props, can be async
4. Client: `'use client'`, typed props, hooks at top level
5. Handle loading/error/empty states

## Service
Create 4 files: `.types.ts` (API snake_case) -> `.contracts.ts` (app camelCase) -> `-adapter.ts` (pure parse) -> `-service.ts` (HTTP only)

## Hook
- Query: `useQuery` with queryKey, staleTime, adapter in queryFn, `'use client'`
- Mutation: `useMutation` with invalidateQueries, adapter for payload
- Shared: useState/useEffect, prefix `use`, `'use client'`

## Page/Layout
- Page: Server Component (async), service+adapter for data, metadata export
- Layout: Server Component wrapping `{children}`
- Always create loading.tsx + error.tsx siblings

## Test
Priority: adapters (pure) > hooks (mock service) > components (React Testing Library). Place in `__tests__/[Name].spec.ts(x)`.
