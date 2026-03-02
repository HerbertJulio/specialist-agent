---
name: dev-create-store
description: "Use when adding state management to a module - creates Svelte store with server state integration."
user-invocable: true
argument-hint: "[store-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a Svelte store following `docs/ARCHITECTURE.md` section 4.4.

Store: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 4.4.

2. Determine the type:
   - **writable/readable store** -- for simple state (filters, toggles, preferences)
   - **Rune-based class** -- for state with derived values and multiple methods

3. Choose placement:
   - Module-specific -> `src/lib/modules/[feature]/stores/[name]-store.ts`
   - Shared -> `src/lib/shared/stores/[name]-store.ts`

4. Create the store:

### Option A: writable/readable store

```typescript
// stores/[name]-store.ts
import { writable, derived } from 'svelte/store'

function createXxxStore() {
  const someState = writable<string | null>(null)
  const isActive = writable(false)

  const hasSomeState = derived(
    [someState, isActive],
    ([$state, $active]) => !!$state && $active
  )

  function setSomeState(value: string | null) {
    someState.set(value)
  }

  function reset() {
    someState.set(null)
    isActive.set(false)
  }

  return {
    someState: { subscribe: someState.subscribe },
    isActive: { subscribe: isActive.subscribe },
    hasSomeState,
    setSomeState,
    reset,
  }
}

export const xxxStore = createXxxStore()
```

### Option B: Rune-based class

```typescript
// stores/[name]-store.ts
export class XxxStore {
  someState = $state<string | null>(null)
  isActive = $state(false)

  get hasSomeState() {
    return !!this.someState && this.isActive
  }

  setSomeState(value: string | null) {
    this.someState = value
  }

  reset() {
    this.someState = null
    this.isActive = false
  }
}

export const xxxStore = new XxxStore()
```

5. Rules:
   - Only client state (UI, filters, preferences, session)
   - NO server state (use SvelteKit load functions)
   - NO HTTP calls inside stores
   - Read-only exposure where possible

6. Validate: `npx svelte-check --tsconfig ./tsconfig.json`
