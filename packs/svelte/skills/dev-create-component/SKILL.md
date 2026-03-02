---
name: dev-create-component
description: "Use when adding a new UI component to an existing module - handles templates, props, and test scaffolding."
user-invocable: true
argument-hint: "[ComponentName]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a Svelte component following `docs/ARCHITECTURE.md` section 5.

Component: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 5.

2. Determine the type:
   - **Feature component** -> `src/lib/modules/[module]/components/ComponentName.svelte`
   - **Shared component** -> `src/lib/shared/components/ComponentName.svelte`
   - **Page** -> `src/routes/[feature]/+page.svelte`

3. Create the component with the Svelte 5 runes template:

```svelte
<script lang="ts">
  // Imports
  import type { SomeType } from '../types/some.contracts'

  // Props (typed with $props rune)
  interface Props {
    // type all props
    items: SomeType[]
    isLoading?: boolean
    onselect?: (item: SomeType) => void
  }

  let { items, isLoading = false, onselect }: Props = $props()

  // Local state ($state rune)
  let selectedId = $state<string | null>(null)

  // Derived state ($derived rune)
  let isEmpty = $derived(!isLoading && items.length === 0)

  // Handlers
  function handleSelect(item: SomeType) {
    selectedId = item.id
    onselect?.(item)
  }
</script>

<!-- Template with loading/error/empty states -->
{#if isLoading}
  <div>Loading...</div>
{:else if isEmpty}
  <div>No items found</div>
{:else}
  {#each items as item (item.id)}
    <div onclick={() => handleSelect(item)}>{item.name}</div>
  {/each}
{/if}

<style>
  /* scoped styles */
</style>
```

4. Checklist:
   - `<script lang="ts">` with runes
   - Typed `$props()` with interface
   - Callback props (not event dispatchers)
   - `$state` for local reactive state
   - `$derived` for computed values
   - < 200 lines
   - PascalCase.svelte

5. Validate: `npx svelte-check --tsconfig ./tsconfig.json`
