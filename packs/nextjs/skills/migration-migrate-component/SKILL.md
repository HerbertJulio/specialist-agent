---
name: migration-migrate-component
description: "Use when a component needs migration to the target architecture or framework version."
user-invocable: true
argument-hint: "[component-file]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Migrate a Pages Router component/page to App Router following `docs/ARCHITECTURE.md` sections 5 and 6.

Component: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` sections 5 and 6.

2. Analyze the component/page:
   - Count lines (JSX, logic)
   - List: props, state, effects, data fetching methods
   - Check for `getServerSideProps`, `getStaticProps`, `getStaticPaths`
   - Check for `useRouter` from `next/router`
   - Check for `Head` component usage
   - Map who imports this component

3. Convert routing:
   - `pages/xxx.tsx` -> `app/xxx/page.tsx`
   - `pages/xxx/[id].tsx` -> `app/xxx/[id]/page.tsx`
   - `pages/api/xxx.ts` -> `app/api/xxx/route.ts` (or Server Action)

4. Convert data fetching:
   - `getServerSideProps` -> async Server Component (service + adapter)
   - `getStaticProps` -> async Server Component + revalidate
   - `getStaticPaths` -> `generateStaticParams()`
   - Client-side `useEffect` + fetch -> React Query hook

5. Determine Server vs Client:
   - Data fetching only? -> Server Component
   - Has hooks, events, browser APIs? -> Client Component
   - Mixed? -> Split into Server page + Client component

6. Convert imports:
   - `useRouter` from `next/router` -> `useRouter` + `usePathname` + `useSearchParams` from `next/navigation`
   - `Head` -> `metadata` export or `generateMetadata()`

7. Create siblings:
   - `loading.tsx` -- skeleton matching page structure
   - `error.tsx` -- error boundary (`'use client'` required)

8. Type all props.

9. Decompose if > 200 lines.

10. Validate:
```bash
npx tsc --noEmit
npx next build
npx vitest run --passWithNoTests
```
