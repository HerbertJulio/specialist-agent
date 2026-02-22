# Padroes de Componentes

## Template SFC Padrao

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketplaceList } from '../composables/useMarketplaceList'
import { useMarketplaceStore } from '../stores/marketplace-store'
import MarketplaceCard from './MarketplaceCard.vue'
import type { MarketplaceItem } from '../types/marketplace.contracts'

// 2. Props & Emits (baseados em tipo)
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

// 3. Stores (com storeToRefs)
const store = useMarketplaceStore()
const { searchQuery, viewMode } = storeToRefs(store)

// 4. Composables
const page = ref(1)
const { items, totalPages, isLoading, isEmpty } = useMarketplaceList({
  page,
  search: searchQuery,
})

// 5. Estado local
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

## Evite Prop Drilling

### Use Slots para Composicao

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

### Use Provide/Inject para Contexto Compartilhado

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

## Hierarquia de Componentes

```
Views (Paginas)       → Composicao, orquestracao, fornecer contexto
  └── Layout          → Estrutura visual (slots)
      └── Features    → Logica de funcionalidade (composables, stores)
          └── Shared  → Apresentacao pura (props entrada, eventos saida)
```

| Tipo | Responsabilidade | Pode ter logica? | Pode ter estado? |
|------|-----------------|------------------|------------------|
| **Views** | Compor componentes, fornecer contexto | Via composables | Sim (composables) |
| **Componentes de Feature** | UI + logica de funcionalidade | Via composables | Sim (composables) |
| **Componentes Compartilhados** | UI generica e reutilizavel | Minima (apenas UI) | Minimo (local) |

## Limites de Tamanho

- Total do SFC: **< 200 linhas**
- Template: **< 100 linhas**
- Se maior → decomponha em sub-componentes

## Checklist

- [ ] `<script setup lang="ts">`
- [ ] Props baseados em tipo (`defineProps<T>()`)
- [ ] Emits baseados em tipo (`defineEmits<T>()`)
- [ ] Sem prop drilling (use composicao / provide-inject)
- [ ] Estados de carregamento / erro / vazio
- [ ] Sem logica de negocio no template
- [ ] Sem `v-html` sem sanitizacao
