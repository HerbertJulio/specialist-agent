---
name: migrate-framework
description: "Use when switching a project or component between frameworks - React to Vue, Vue to Svelte, or any supported framework pair."
user-invocable: true
argument-hint: "[source-framework] to [target-framework] [file-or-directory]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /migrate-framework - Cross-Framework Migration

Migrate code from one framework to another while preserving functionality.

**Arguments:** $ARGUMENTS (e.g., "react to vue src/components/Button.tsx")

## Supported Migrations

| From | To | Status |
|------|----|--------|
| React | Vue 3 | Full |
| React | Svelte | Full |
| Vue 2 | Vue 3 | Full |
| Vue 3 | React | Full |
| Vue 3 | Svelte | Full |
| Angular | React | Partial |
| Angular | Vue 3 | Partial |

## Workflow

### Phase 1: Analysis

1. Parse source framework code
2. Identify:
   - Component structure
   - Props and state
   - Lifecycle hooks
   - Event handlers
   - Computed values
   - Side effects

### Phase 2: Mapping

#### React → Vue 3

| React | Vue 3 |
|-------|-------|
| `useState` | `ref()` / `reactive()` |
| `useEffect` | `onMounted`, `watch` |
| `useMemo` | `computed()` |
| `useCallback` | Regular function |
| `useContext` | `provide/inject` |
| `props` | `defineProps()` |
| `children` | `<slot />` |
| `className` | `class` |
| `onClick` | `@click` |

```typescript
// React
function Button({ label, onClick }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('mounted')
  }, [])

  return (
    <button className="btn" onClick={() => setCount(c => c + 1)}>
      {label}: {count}
    </button>
  )
}

// Vue 3
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ label: string }>()
const emit = defineEmits<{ click: [] }>()

const count = ref(0)

onMounted(() => {
  console.log('mounted')
})
</script>

<template>
  <button class="btn" @click="count++">
    {{ label }}: {{ count }}
  </button>
</template>
```

#### Vue 3 → React

| Vue 3 | React |
|-------|-------|
| `ref()` | `useState` |
| `reactive()` | `useState` with object |
| `computed()` | `useMemo` |
| `watch` | `useEffect` |
| `onMounted` | `useEffect(fn, [])` |
| `provide/inject` | `useContext` |
| `<slot />` | `children` |
| `v-if` | `{condition && ...}` |
| `v-for` | `.map()` |
| `@click` | `onClick` |

#### React → Svelte

| React | Svelte |
|-------|--------|
| `useState` | `let variable` |
| `useEffect` | `onMount`, `$:` |
| `useMemo` | `$: derived` |
| `props` | `export let` |
| `children` | `<slot />` |
| `className` | `class` |
| `onClick` | `on:click` |

### Phase 3: Migration

1. Create target file structure
2. Convert component syntax
3. Migrate state management
4. Update imports
5. Convert templates/JSX
6. Adapt styling approach

### Phase 4: Validation

1. Check TypeScript types
2. Verify props match
3. Test component renders
4. Compare behavior

## Output

```text
──── Migration Complete ────

Source: React (src/components/Button.tsx)
Target: Vue 3 (src/components/Button.vue)

Conversions:
  ✓ useState → ref (2 instances)
  ✓ useEffect → onMounted (1 instance)
  ✓ Props interface → defineProps
  ✓ JSX → Vue template
  ✓ className → class

Manual review needed:
  - Line 15: Complex useEffect dependency array
  - Line 23: Custom hook needs separate migration

Files created:
  - src/components/Button.vue
```

## Rules

1. **Preserve behavior** - Functionality must match
2. **Type safety** - Maintain TypeScript types
3. **Idiomatic code** - Use target framework patterns
4. **Flag manual work** - Mark complex conversions
5. **Keep original** - Don't delete source files

## Limitations

- Custom hooks require separate migration
- Third-party component libraries may not have equivalents
- Some patterns don't translate directly
- CSS-in-JS needs manual adaptation
