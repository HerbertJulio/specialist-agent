# 🏛️ ARCHITECTURE.md – Guia de Arquitetura e Padrões

> Este documento é a **source of truth** para todos os subagentes de migração.
> Qualquer decisão arquitetural deve estar documentada aqui.

---

## 1. Visão Geral

Estamos migrando um projeto Vue 3 legado (JavaScript, Options API, arquitetura caótica) para uma arquitetura moderna, tipada e modular:

| De | Para |
|----|------|
| JavaScript | TypeScript (strict) |
| Options API | `<script setup lang="ts">` |
| Props drilling | Component Composition + provide/inject |
| Fetch manual / Axios direto | Services + Adapters + TanStack Vue Query |
| Estado global desorganizado | Pinia (client state) + Vue Query (server state) |
| try/catch espalhados | Error handling centralizado em composables/queries |
| Estrutura por tipo | Arquitetura modular por feature |
| Naming inconsistente | Convenções rígidas documentadas |

---

## 2. Estrutura de Diretórios (Arquitetura Modular)

```
src/
├── app/                          # Shell da aplicação
│   ├── App.vue
│   ├── main.ts
│   ├── router/
│   │   ├── index.ts
│   │   └── guards/
│   └── plugins/                  # Registra Pinia, VueQuery, i18n, etc.
│
├── modules/                      # 🔑 Feature modules (bounded contexts)
│   ├── auth/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── services/
│   │   ├── adapters/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── views/
│   │   ├── __tests__/
│   │   └── index.ts              # Barrel export (API pública do módulo)
│   │
│   ├── marketplace/
│   │   ├── components/
│   │   │   ├── MarketplaceList.vue
│   │   │   ├── MarketplaceCard.vue
│   │   │   ├── MarketplaceFilters.vue
│   │   │   └── marketplace-card/          # Sub-components se necessário
│   │   │       ├── MarketplaceCardHeader.vue
│   │   │       └── MarketplaceCardActions.vue
│   │   ├── composables/
│   │   │   ├── useMarketplaceList.ts
│   │   │   └── useMarketplaceFilters.ts
│   │   ├── services/
│   │   │   └── marketplace-service.ts
│   │   ├── adapters/
│   │   │   └── marketplace-adapter.ts
│   │   ├── stores/
│   │   │   └── marketplace-store.ts       # Só client state (filtros, UI)
│   │   ├── types/
│   │   │   ├── marketplace.types.ts
│   │   │   └── marketplace.contracts.ts   # Schemas Zod
│   │   ├── views/
│   │   │   └── MarketplaceView.vue
│   │   ├── __tests__/
│   │   └── index.ts
│   │
│   └── [outro-modulo]/
│
├── shared/                       # Compartilhado entre módulos
│   ├── components/               # Componentes genéricos (Button, Modal, Table)
│   ├── composables/              # Lógica compartilhada
│   ├── services/                 # API client base, interceptors
│   ├── adapters/                 # Adapters compartilhados
│   ├── types/                    # Types globais
│   ├── utils/                    # Funções puras sem side effects
│   ├── helpers/                  # Funções com side effects ou DOM
│   ├── constants/                # Valores estáticos
│   └── plugins/                  # Vue plugins customizados
│
└── assets/                       # Estáticos (imagens, fonts, global CSS)
```

### Regras de Importação entre Camadas
```
modules/auth  ←→  shared/          ✅ Módulo importa de shared
modules/auth  →   modules/market   ❌ Módulo NÃO importa de outro módulo
shared/       →   modules/auth     ❌ Shared NÃO importa de módulos
app/          →   modules/*        ✅ App importa módulos (router, registros)
```

Se dois módulos precisam compartilhar algo → mover para `shared/`.

---

## 3. Nomenclatura

### Arquivos e Diretórios

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Diretórios | `kebab-case` | `user-settings/` |
| Componentes Vue | `PascalCase.vue` | `UserSettingsForm.vue` |
| Views (páginas) | `PascalCase + View.vue` | `MarketplaceView.vue` |
| Composables | `use + PascalCase.ts` | `useMarketplaceList.ts` |
| Services | `kebab-case-service.ts` | `marketplace-service.ts` |
| Adapters | `kebab-case-adapter.ts` | `marketplace-adapter.ts` |
| Stores Pinia | `kebab-case-store.ts` | `marketplace-store.ts` |
| Types | `kebab-case.types.ts` | `marketplace.types.ts` |
| Contracts/Schemas | `kebab-case.contracts.ts` | `marketplace.contracts.ts` |
| Utils | `kebab-case.ts` | `format-date.ts` |
| Helpers | `kebab-case.ts` | `clipboard-helper.ts` |
| Testes | `NomeOriginal.spec.ts` | `MarketplaceList.spec.ts` |
| Constants | `kebab-case.constants.ts` | `api-endpoints.constants.ts` |

### Código

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Variáveis / funções | `camelCase` | `getUserById`, `isLoading` |
| Types / Interfaces | `PascalCase` | `UserProfile`, `MarketplaceItem` |
| Enums | `PascalCase` | `UserRole.Admin` |
| Constantes | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |
| Composables | `use` + `PascalCase` | `useAuth`, `useMarketplaceList` |
| Store IDs | `kebab-case` string | `defineStore('marketplace', ...)` |
| Query Keys | `camelCase` array | `['marketplace', 'list', { page }]` |
| Event handlers | `handle` + ação | `handleSubmit`, `handleDelete` |
| Boolean | `is`/`has`/`can`/`should` | `isLoading`, `hasPermission` |

---

## 4. Camadas de Responsabilidade

### 4.1 Services - Requisições Puras

Services fazem **apenas** a request HTTP. Sem try/catch, sem transformação, sem lógica de negócio.

```typescript
// services/marketplace-service.ts
import { api } from '@/shared/services/api-client'
import type { MarketplaceListResponse, MarketplaceItemResponse } from '../types/marketplace.types'

export const marketplaceService = {
  list(params: { page: number; pageSize: number; search?: string }) {
    return api.get<MarketplaceListResponse>('/marketplace', { params })
  },

  getById(id: string) {
    return api.get<MarketplaceItemResponse>(`/marketplace/${id}`)
  },

  create(payload: CreateMarketplacePayload) {
    return api.post<MarketplaceItemResponse>('/marketplace', payload)
  },

  delete(id: string) {
    return api.delete(`/marketplace/${id}`)
  },
}
```

**Regras de Service:**
- ❌ Sem try/catch (quem chama trata o erro)
- ❌ Sem transformação de dados (adapter faz isso)
- ❌ Sem lógica de negócio
- ❌ Sem acesso a store ou composables
- ✅ Apenas chamadas HTTP com tipagem de request/response
- ✅ Um arquivo por domínio/recurso
- ✅ Exportar como objeto com métodos

### 4.2 Adapters - Parsers de Contrato

Adapters transformam dados da API para o contrato TypeScript da aplicação (e vice-versa). São **funções puras** sem side effects.

```typescript
// adapters/marketplace-adapter.ts
import type {
  MarketplaceListResponse,
  MarketplaceItemResponse,
} from '../types/marketplace.types'
import type {
  MarketplaceItem,
  MarketplaceList,
} from '../types/marketplace.contracts'

export const marketplaceAdapter = {
  /**
   * API response → App contract (inbound)
   */
  toMarketplaceItem(response: MarketplaceItemResponse): MarketplaceItem {
    return {
      id: response.uuid,
      name: response.name,
      vendor: response.vendor_name,
      category: response.category_slug,
      price: response.price_cents / 100,
      isActive: response.status === 'active',
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
    }
  },

  toMarketplaceList(response: MarketplaceListResponse): MarketplaceList {
    return {
      items: response.results.map(marketplaceAdapter.toMarketplaceItem),
      totalItems: response.count,
      totalPages: Math.ceil(response.count / response.page_size),
      currentPage: response.page,
    }
  },

  /**
   * App contract → API payload (outbound)
   */
  toCreatePayload(item: CreateMarketplaceInput): CreateMarketplacePayload {
    return {
      name: item.name,
      vendor_name: item.vendor,
      category_slug: item.category,
      price_cents: Math.round(item.price * 100),
    }
  },
}
```

**Regras de Adapter:**
- ✅ Funções puras (input → output, sem side effects)
- ✅ Dois sentidos: API→App (inbound) e App→API (outbound)
- ✅ Renomear campos (snake_case API → camelCase App)
- ✅ Converter tipos (string→Date, cents→decimal, status→boolean)
- ❌ Sem chamadas HTTP
- ❌ Sem acesso a store/composable
- ❌ Sem try/catch (falha = tipo errado = bug a ser corrigido)

### 4.3 Types & Contracts

```typescript
// types/marketplace.types.ts
// ← Tipos que refletem a API exatamente como ela retorna (snake_case)

export interface MarketplaceItemResponse {
  uuid: string
  name: string
  vendor_name: string
  category_slug: string
  price_cents: number
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  updated_at: string
}

export interface MarketplaceListResponse {
  count: number
  page: number
  page_size: number
  results: MarketplaceItemResponse[]
}

// types/marketplace.contracts.ts
// ← Contratos da aplicação (camelCase, tipos corretos)

export interface MarketplaceItem {
  id: string
  name: string
  vendor: string
  category: string
  price: number          // em reais, não centavos
  isActive: boolean      // derivado de status
  createdAt: Date
  updatedAt: Date
}

export interface MarketplaceList {
  items: MarketplaceItem[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export interface CreateMarketplaceInput {
  name: string
  vendor: string
  category: string
  price: number
}
```

### 4.4 Composables - Lógica de Negócio + Orquestração

Composables conectam tudo: chamam service, passam pelo adapter, gerenciam loading/error, e expõem dados reativos.

```typescript
// composables/useMarketplaceList.ts
import { computed, type MaybeRef } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { marketplaceService } from '../services/marketplace-service'
import { marketplaceAdapter } from '../adapters/marketplace-adapter'
import type { MarketplaceList } from '../types/marketplace.contracts'

interface UseMarketplaceListOptions {
  page: MaybeRef<number>
  pageSize?: MaybeRef<number>
  search?: MaybeRef<string>
}

export function useMarketplaceList(options: UseMarketplaceListOptions) {
  const page = computed(() => toValue(options.page))
  const pageSize = computed(() => toValue(options.pageSize) ?? 20)
  const search = computed(() => toValue(options.search) ?? '')

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: computed(() => [
      'marketplace',
      'list',
      { page: page.value, pageSize: pageSize.value, search: search.value },
    ]),
    queryFn: async () => {
      const response = await marketplaceService.list({
        page: page.value,
        pageSize: pageSize.value,
        search: search.value,
      })
      return marketplaceAdapter.toMarketplaceList(response.data)
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  const items = computed(() => data.value?.items ?? [])
  const totalPages = computed(() => data.value?.totalPages ?? 0)
  const isEmpty = computed(() => !isLoading.value && items.value.length === 0)

  return {
    // Data
    items,
    totalPages,
    // State
    isLoading,
    isFetching,
    isEmpty,
    error,
    // Actions
    refetch,
  }
}
```

**Regras de Composable:**
- ✅ Orquestra: service → adapter → dados reativos
- ✅ Gerencia loading, error, empty states
- ✅ Retorna refs/computed (nunca raw values)
- ✅ Nomear `useXxx`
- ✅ Retorno tipado e documentado
- ❌ Sem template/rendering (isso é do componente)
- ❌ Sem acesso direto à API (service faz isso)

### 4.5 Stores Pinia - Apenas Client State

Pinia é para estado que **não vem do servidor**: UI state, filtros, preferências, auth.

```typescript
// stores/marketplace-store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMarketplaceStore = defineStore('marketplace', () => {
  // State
  const selectedCategory = ref<string | null>(null)
  const viewMode = ref<'grid' | 'list'>('grid')
  const searchQuery = ref('')

  // Getters
  const hasActiveFilters = computed(() =>
    !!selectedCategory.value || !!searchQuery.value
  )

  // Actions
  function setCategory(category: string | null) {
    selectedCategory.value = category
  }

  function setViewMode(mode: 'grid' | 'list') {
    viewMode.value = mode
  }

  function clearFilters() {
    selectedCategory.value = null
    searchQuery.value = ''
  }

  return {
    // State (readonly para consumers)
    selectedCategory: readonly(selectedCategory),
    viewMode: readonly(viewMode),
    searchQuery,                    // writeable se usado com v-model
    // Getters
    hasActiveFilters,
    // Actions
    setCategory,
    setViewMode,
    clearFilters,
  }
})
```

**Regras de Store:**
- ✅ Apenas client state (UI, filtros, preferências, session)
- ✅ Setup syntax (`defineStore('id', () => { ... })`)
- ✅ State exposto como `readonly()` quando não precisa de v-model
- ✅ `storeToRefs()` obrigatório ao desestruturar em componentes
- ❌ Sem server state (dados da API vão em TanStack Vue Query)
- ❌ Sem chamadas HTTP dentro de stores
- ❌ Sem lógica de negócio complexa (composable faz isso)

---

## 5. Componentes Vue – Composition Pattern

### 5.1 Padrão de SFC

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

// 3. Stores (com storeToRefs)
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

function handlePageChange(newPage: number) {
  page.value = newPage
}
</script>

<template>
  <!-- ... -->
</template>

<style scoped>
/* ... */
</style>
```

### 5.2 Stop Prop Drilling – Component Composition

**❌ ERRADO – Prop Drilling:**
```vue
<!-- GrandParent passa props por 3 níveis -->
<Parent :user="user" :theme="theme" :permissions="permissions">
  <Child :user="user" :theme="theme" :permissions="permissions">
    <GrandChild :user="user" :permissions="permissions" />
  </Child>
</Parent>
```

**✅ CORRETO – Composition com Slots:**
```vue
<!-- MarketplaceView.vue (View/Page) -->
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
          <EmptyState message="Nenhum item encontrado" />
        </template>
      </MarketplaceList>
    </template>

    <template #sidebar>
      <MarketplaceDetails v-if="selectedItem" :item="selectedItem" />
    </template>
  </PageLayout>
</template>
```

**✅ CORRETO – Provide/Inject para contexto compartilhado:**
```typescript
// composables/useMarketplaceContext.ts
import type { InjectionKey, Ref } from 'vue'

interface MarketplaceContext {
  selectedItem: Ref<MarketplaceItem | null>
  selectItem: (item: MarketplaceItem) => void
  clearSelection: () => void
}

export const MARKETPLACE_CONTEXT: InjectionKey<MarketplaceContext> = Symbol('marketplace-context')

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

### 5.3 Hierarquia de Componentes

```
Views (Pages)         → Composição, orquestração, provide context
  └── Layout          → Estrutura visual (slots)
      └── Features    → Lógica de feature (composables, stores)
          └── Shared  → Apresentação pura (props in, events out)
```

| Tipo | Responsabilidade | Pode ter lógica? | Pode ter estado? |
|------|-----------------|-----------------|-----------------|
| **Views** | Compor componentes, provide context | Via composables | Sim (composables) |
| **Feature Components** | UI + lógica da feature | Via composables | Sim (composables) |
| **Shared Components** | UI genérica, reutilizável | Mínima (UI only) | Mínimo (local) |

---

## 6. Utils vs Helpers

### Utils - Funções Puras
- Sem side effects
- Input → Output determinístico
- Testáveis sem mocks
- Sem dependência de DOM, browser APIs, ou Vue

```typescript
// shared/utils/format-date.ts
export function formatDate(date: Date, locale = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale).format(date)
}

// shared/utils/currency.ts
export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
}

// shared/utils/string.ts
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}
```

### Helpers - Funções com Side Effects ou DOM
- Interagem com browser APIs (clipboard, localStorage, DOM)
- Podem ter side effects
- Podem precisar de mocks nos testes

```typescript
// shared/helpers/clipboard-helper.ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// shared/helpers/download-helper.ts
export function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// shared/helpers/toast-helper.ts
export function showToast(message: string, type: 'success' | 'error' = 'success') {
  // integra com lib de toast (PrimeVue Toast, etc.)
}
```

---

## 7. Error Handling - Padrão Centralizado

### Na Camada de Query (composable)
```typescript
// O try/catch fica no queryFn ou no onError da mutation
const { mutate: deleteItem } = useMutation({
  mutationFn: (id: string) => marketplaceService.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['marketplace'] })
    showToast('Item removido com sucesso')
  },
  onError: (error) => {
    showToast(parseApiError(error), 'error')
  },
})
```

### Parser de Erros Centralizado
```typescript
// shared/utils/parse-api-error.ts
import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string
  detail?: string
  errors?: Record<string, string[]>
}

export function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined
    if (data?.message) return data.message
    if (data?.detail) return data.detail
    if (error.response?.status === 403) return 'Sem permissão para esta ação'
    if (error.response?.status === 404) return 'Recurso não encontrado'
    if (error.response?.status === 500) return 'Erro interno do servidor'
  }
  return 'Erro inesperado. Tente novamente.'
}
```

### Interceptor Global (API Client)
```typescript
// shared/services/api-client.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Apenas log e redirect em 401 (session expired)
    if (error.response?.status === 401) {
      // redirect to login
    }
    // NÃO tratar outros erros aqui – deixar para quem chamou
    return Promise.reject(error)
  },
)
```

---

## 8. Barrel Exports (index.ts)

Cada módulo exporta apenas sua **API pública**:

```typescript
// modules/marketplace/index.ts

// Views (para o router)
export { default as MarketplaceView } from './views/MarketplaceView.vue'

// Componentes reutilizáveis por outros (raro, evitar)
export { default as MarketplaceCard } from './components/MarketplaceCard.vue'

// Types (para quem precisa tipar)
export type { MarketplaceItem, MarketplaceList } from './types/marketplace.contracts'

// ❌ NÃO exportar:
// - services (detalhe interno)
// - adapters (detalhe interno)
// - stores (usar via composable)
// - composables internos
```

---

## 9. Regras SOLID aplicadas ao Vue

| Princípio | Aplicação Vue |
|-----------|--------------|
| **S**ingle Responsibility | 1 componente = 1 responsabilidade. 1 composable = 1 domínio. 1 service = 1 recurso. |
| **O**pen/Closed | Componentes extensíveis via slots e props, não por modificação interna. |
| **L**iskov Substitution | Componentes shared devem funcionar em qualquer contexto sem quebrar. |
| **I**nterface Segregation | Props específicas, não objetos genéricos. `<UserAvatar :src :alt>` não `<UserAvatar :user>`. |
| **D**ependency Inversion | Composables dependem de interfaces (types), não de implementações. Services injetados via composable, não importados direto no componente. |

---

## 10. Checklist de Migração por Arquivo

### Componente .vue
- [ ] `<script setup lang="ts">`
- [ ] Props type-based (`defineProps<T>()`)
- [ ] Emits type-based (`defineEmits<T>()`)
- [ ] Sem prop drilling (usar composition/provide-inject)
- [ ] < 200 linhas total
- [ ] Template < 100 linhas
- [ ] Sem lógica de negócio no template
- [ ] Loading / error / empty states
- [ ] Sem `v-html` ou com sanitização

### Composable
- [ ] Prefixo `use`
- [ ] Return type explícito com refs/computed
- [ ] Usa service + adapter (nunca API direto)
- [ ] TanStack Vue Query para server state
- [ ] Error handling via onError da query/mutation

### Service
- [ ] Apenas chamadas HTTP
- [ ] Sem try/catch
- [ ] Sem transformação de dados
- [ ] Tipagem de request e response

### Adapter
- [ ] Funções puras
- [ ] Inbound (API→App) e Outbound (App→API)
- [ ] Conversão de naming (snake_case → camelCase)
- [ ] Conversão de tipos (string→Date, etc.)

### Store Pinia
- [ ] Apenas client state
- [ ] Setup syntax
- [ ] `readonly()` no state exposto
- [ ] `storeToRefs()` nos consumers

### Types
- [ ] `.types.ts` para tipos da API (raw response)
- [ ] `.contracts.ts` para contratos da aplicação
- [ ] Sem `any`
