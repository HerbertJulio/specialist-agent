# Component Patterns

## Standard SFC Template

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketplaceList } from '../composables/useMarketplaceList'
import { useMarketplaceStore } from '../stores/marketplace-store'
import MarketplaceCard from './MarketplaceCard.vue'
import type { MarketplaceItem } from '../types/marketplace.contracts'

// 2. Props & Emits (type-based)
interface Props {
  categoryFilter?: string
}

interface Emits {
  (e: 'select', item: MarketplaceItem): void
}

const props = withDefaults(defineProps<Props>(), {
  categoryFilter: undefined,
})

const emit = defineEmits<Emits>()

// 3. Stores (with storeToRefs)
const store = useMarketplaceStore()
const { searchQuery, viewMode } = storeToRefs(store)

// 4. Composables
const page = ref(1)
const { items, totalPages, isLoading, isEmpty } = useMarketplaceList({
  page,
  search: searchQuery,
})

// 5. Local state
const selectedId = ref<string | null>(null)

// 6. Computed
const isFirstPage = computed(() => page.value === 1)

// 7. Handlers
function handleSelect(item: MarketplaceItem) {
  selectedId.value = item.id
  emit('select', item)
}
</script>

<template>
  <!-- ... -->
</template>

<style scoped>
/* ... */
</style>
```

## Stop Prop Drilling

### Use Slots for Composition

```vue
<!-- MarketplaceView.vue -->
<template>
  <PageLayout>
    <template #header>
      <MarketplaceFilters />
    </template>

    <template #content>
      <MarketplaceList @select="handleSelect">
        <template #card="{ item }">
          <MarketplaceCard :item="item" />
        </template>

        <template #empty>
          <EmptyState message="No items found" />
        </template>
      </MarketplaceList>
    </template>

    <template #sidebar>
      <MarketplaceDetails v-if="selectedItem" :item="selectedItem" />
    </template>
  </PageLayout>
</template>
```

### Use Provide/Inject for Shared Context

```typescript
// composables/useMarketplaceContext.ts
import type { InjectionKey, Ref } from 'vue'

interface MarketplaceContext {
  selectedItem: Ref<MarketplaceItem | null>
  selectItem: (item: MarketplaceItem) => void
  clearSelection: () => void
}

export const MARKETPLACE_CONTEXT: InjectionKey<MarketplaceContext> =
  Symbol('marketplace-context')

export function provideMarketplaceContext() {
  const selectedItem = ref<MarketplaceItem | null>(null)

  function selectItem(item: MarketplaceItem) {
    selectedItem.value = item
  }

  function clearSelection() {
    selectedItem.value = null
  }

  const context: MarketplaceContext = {
    selectedItem: readonly(selectedItem),
    selectItem,
    clearSelection,
  }

  provide(MARKETPLACE_CONTEXT, context)
  return context
}

export function useMarketplaceContext() {
  const context = inject(MARKETPLACE_CONTEXT)
  if (!context) {
    throw new Error('useMarketplaceContext must be used within a MarketplaceView')
  }
  return context
}
```

## Component Hierarchy

```
Views (Pages)         → Composition, orchestration, provide context
  └── Layout          → Visual structure (slots)
      └── Features    → Feature logic (composables, stores)
          └── Shared  → Pure presentation (props in, events out)
```

| Type | Responsibility | Can have logic? | Can have state? |
|------|---------------|-----------------|-----------------|
| **Views** | Compose components, provide context | Via composables | Yes (composables) |
| **Feature Components** | UI + feature logic | Via composables | Yes (composables) |
| **Shared Components** | Generic, reusable UI | Minimal (UI only) | Minimal (local) |

## Size Limits

- Total SFC: **< 200 lines**
- Template: **< 100 lines**
- If larger → decompose into sub-components

## Checklist

- [ ] `<script setup lang="ts">`
- [ ] Type-based props (`defineProps<T>()`)
- [ ] Type-based emits (`defineEmits<T>()`)
- [ ] No prop drilling (use composition / provide-inject)
- [ ] Loading / error / empty states
- [ ] No business logic in template
- [ ] No `v-html` without sanitization
