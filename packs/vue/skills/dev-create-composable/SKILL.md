---
name: dev-create-composable
description: "Use when adding server state management to a module - creates Vue Query composable with caching and error handling."
user-invocable: true
argument-hint: "[composable-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a composable following `docs/ARCHITECTURE.md` §4.4.

Composable: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 4.4.

2. Determine the type:
   - **Query** (data reading) → `useQuery` + service + adapter
   - **Mutation** (write/delete) → `useMutation` + query invalidation
   - **Pure logic** (no API) → refs + computed + lifecycle

3. Create the composable in `composables/use[Name].ts`:
   - Required `use` prefix
   - Parameters with `MaybeRef<T>` for reactivity
   - Reactive queryKey (`computed`)
   - Explicit `staleTime`
   - Return type with refs/computed

4. Connect the layers: service → adapter → Vue Query

5. Validate: `npx tsc --noEmit`
