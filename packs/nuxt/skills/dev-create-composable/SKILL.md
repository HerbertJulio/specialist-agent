---
name: dev-create-composable
description: "Use when adding server state management or shared logic - creates an auto-imported composable with useFetch/useAsyncData."
user-invocable: true
argument-hint: "[composable-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create an auto-imported composable following `docs/ARCHITECTURE.md` section 4.4.

Composable: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 4.4.

2. Determine the type:
   - **Query** (data reading) -> `useAsyncData` + service + adapter
   - **Mutation** (write/delete) -> function + service + refreshNuxtData
   - **Pure logic** (no API) -> refs + computed + lifecycle
   - **Shared state** (SSR-safe) -> `useState` for simple, Pinia for complex

3. Create the composable in `composables/use[Name].ts` (auto-imported) or `modules/[feature]/composables/use[Name].ts`:
   - Required `use` prefix
   - Parameters with `Ref<T>` for reactivity
   - Reactive key for useAsyncData
   - `watch` option for auto-refetch
   - Adapter in `transform` option
   - Return type with refs/computed

4. Connect the layers: service -> adapter -> useAsyncData

5. Validate: `nuxi typecheck`
