# ARCHITECTURE.md - Architecture Guide and Patterns

> This document is the **source of truth** for all agents and skills.
> Any architectural decision must be documented here.

---

## 1. Overview

Nuxt 3 is a full-stack Vue 3 framework with auto-imports, file-based routing, and a built-in Nitro server engine. This architecture leverages Nuxt's conventions for a modern, typed, and modular codebase:

| Feature | Approach |
|---------|----------|
| Language | TypeScript (strict) |
| Components | `<script setup lang="ts">` with auto-imports |
| Server state | `useFetch` / `useAsyncData` (built-in caching) |
| Client state (simple) | `useState` (SSR-safe) |
| Client state (complex) | Pinia (setup syntax) |
| Routing | File-based (`pages/` directory) |
| Server API | Nitro (`server/api/` directory) |
| Rendering | Hybrid (SSR, SSG, SPA per route) |
| Validation | Zod schemas |
| Testing | Vitest + `@nuxt/test-utils` |
| Naming | kebab-case files, PascalCase components |

---

## 2. Directory Structure (Modular Architecture)

```
├── app/                          # App shell
│   ├── app.vue                   # Root component
│   └── error.vue                 # Global error page
│
├── pages/                        # File-based routing
│   ├── index.vue                 # /
│   ├── login.vue                 # /login
│   └── marketplace/
│       ├── index.vue             # /marketplace
│       └── [id].vue              # /marketplace/:id
│
├── layouts/                      # Layout components
│   ├── default.vue
│   └── auth.vue
│
├── components/                   # Auto-imported shared components
│   ├── AppButton.vue
│   ├── AppModal.vue
│   └── AppTable.vue
│
├── composables/                  # Auto-imported shared composables
│   ├── useAuth.ts
│   └── useToast.ts
│
├── modules/                      # Feature modules (bounded contexts)
│   └── marketplace/
│       ├── components/
│       │   ├── MarketplaceList.vue
│       │   ├── MarketplaceCard.vue
│       │   └── MarketplaceFilters.vue
│       ├── composables/
│       │   ├── useMarketplaceList.ts
│       │   └── useMarketplaceFilters.ts
│       ├── services/
│       │   └── marketplace-service.ts
│       ├── adapters/
│       │   └── marketplace-adapter.ts
│       ├── types/
│       │   ├── marketplace.types.ts
│       │   └── marketplace.contracts.ts
│       ├── __tests__/
│       └── index.ts              # Barrel export (public API)
│
├── server/                       # Nitro server engine
│   ├── api/                      # API routes
│   │   ├── marketplace/
│   │   │   ├── index.get.ts      # GET /api/marketplace
│   │   │   ├── index.post.ts     # POST /api/marketplace
│   │   │   └── [id].get.ts       # GET /api/marketplace/:id
│   │   └── auth/
│   │       └── login.post.ts
│   ├── middleware/                # Server middleware
│   │   └── auth.ts
│   └── utils/                    # Server-side utilities
│       ├── db.ts
│       └── validate.ts
│
├── middleware/                    # Route middleware (client-side)
│   ├── auth.ts
│   └── guest.ts
│
├── plugins/                      # Nuxt plugins (app initialization)
│   └── error-handler.ts
│
├── shared/                       # Shared utilities
│   ├── utils/                    # Pure functions
│   ├── helpers/                  # Functions with side effects
│   ├── types/                    # Global types
│   └── constants/                # Static values
│
├── assets/                       # Static assets (processed by Vite)
│
└── public/                       # Public static files (served as-is)
```

### Import Rules Between Layers
```
modules/auth  <->  shared/          OK - Module imports from shared
modules/auth  ->   modules/market   PROHIBITED - Module imports from another module
shared/       ->   modules/auth     PROHIBITED - Shared imports from module
pages/        ->   modules/*        OK - Pages import module components/composables
composables/  <->  shared/          OK - Shared composables use shared utils
server/       ->   shared/types     OK - Server uses shared types
```

If two modules need to share something, move it to `shared/` or `composables/`.

---

## 3. Naming Conventions

### Files and Directories

| Type | Pattern | Example |
|------|---------|---------|
| Directories | `kebab-case` | `user-settings/` |
| Vue Components | `PascalCase.vue` | `MarketplaceCard.vue` |
| Pages | `kebab-case.vue` | `marketplace/index.vue` |
| Composables | `use` + `PascalCase.ts` | `useMarketplaceList.ts` |
| Services | `kebab-case-service.ts` | `marketplace-service.ts` |
| Adapters | `kebab-case-adapter.ts` | `marketplace-adapter.ts` |
| Server API routes | `kebab-case.[method].ts` | `index.get.ts`, `[id].delete.ts` |
| Types | `kebab-case.types.ts` | `marketplace.types.ts` |
| Contracts/Schemas | `kebab-case.contracts.ts` | `marketplace.contracts.ts` |
| Utils | `kebab-case.ts` | `format-date.ts` |
| Helpers | `kebab-case.ts` | `clipboard-helper.ts` |
| Tests | `OriginalName.spec.ts` | `MarketplaceList.spec.ts` |
| Middleware | `kebab-case.ts` | `auth.ts` |
| Plugins | `kebab-case.ts` | `error-handler.ts` |

### Code

| Type | Pattern | Example |
|------|---------|---------|
| Variables / functions | `camelCase` | `getUserById`, `isLoading` |
| Types / Interfaces | `PascalCase` | `UserProfile`, `MarketplaceItem` |
| Enums | `PascalCase` | `UserRole.Admin` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |
| Composables | `use` + `PascalCase` | `useAuth`, `useMarketplaceList` |
| Event handlers | `handle` + action | `handleSubmit`, `handleDelete` |
| Boolean | `is`/`has`/`can`/`should` | `isLoading`, `hasPermission` |

---

## 4. Responsibility Layers

### 4.1 Services - Pure HTTP Requests

Services perform **only** the HTTP request. No try/catch, no transformation, no business logic.

```typescript
// modules/marketplace/services/marketplace-service.ts
import type { MarketplaceListResponse, MarketplaceItemResponse } from '../types/marketplace.types'

export const marketplaceService = {
  list(params: { page: number; pageSize: number; search?: string }) {
    return $fetch<MarketplaceListResponse>('/api/marketplace', { params })
  },

  getById(id: string) {
    return $fetch<MarketplaceItemResponse>(`/api/marketplace/${id}`)
  },

  create(payload: CreateMarketplacePayload) {
    return $fetch<MarketplaceItemResponse>('/api/marketplace', {
      method: 'POST',
      body: payload,
    })
  },

  delete(id: string) {
    return $fetch(`/api/marketplace/${id}`, { method: 'DELETE' })
  },
}
```

**Service rules:**
- NO try/catch (caller handles errors)
- NO data transformation (adapter does that)
- NO business logic
- NO access to stores or composables
- YES typed request/response
- YES one file per domain/resource
- YES export as object with methods
- Use `$fetch` (Nuxt built-in) instead of axios

### 4.2 Adapters - Contract Parsers

Adapters transform data from the API to the TypeScript app contract (and vice-versa). They are **pure functions** without side effects.

```typescript
// modules/marketplace/adapters/marketplace-adapter.ts
import type {
  MarketplaceListResponse,
  MarketplaceItemResponse,
} from '../types/marketplace.types'
import type {
  MarketplaceItem,
  MarketplaceList,
} from '../types/marketplace.contracts'

export const marketplaceAdapter = {
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

**Adapter rules:**
- Pure functions (input -> output, no side effects)
- Two directions: API->App (inbound) and App->API (outbound)
- Rename fields (snake_case API -> camelCase App)
- Convert types (string->Date, cents->decimal, status->boolean)
- NO HTTP calls
- NO access to store/composable
- NO try/catch (failure = wrong type = bug to fix)

### 4.3 Types & Contracts

```typescript
// types/marketplace.types.ts
// Types that mirror the API exactly as it returns (snake_case)

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
// App contracts (camelCase, correct types)

export interface MarketplaceItem {
  id: string
  name: string
  vendor: string
  category: string
  price: number          // in currency units, not cents
  isActive: boolean      // derived from status
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

### 4.4 Composables - Business Logic + Orchestration

Composables connect everything: call service, pass through adapter, manage loading/error, and expose reactive data. In Nuxt, composables in the `composables/` directory are **auto-imported**.

```typescript
// modules/marketplace/composables/useMarketplaceList.ts
import { marketplaceService } from '../services/marketplace-service'
import { marketplaceAdapter } from '../adapters/marketplace-adapter'
import type { MarketplaceList } from '../types/marketplace.contracts'

interface UseMarketplaceListOptions {
  page: Ref<number>
  pageSize?: Ref<number>
  search?: Ref<string>
}

export function useMarketplaceList(options: UseMarketplaceListOptions) {
  const page = computed(() => toValue(options.page))
  const pageSize = computed(() => toValue(options.pageSize) ?? 20)
  const search = computed(() => toValue(options.search) ?? '')

  const { data, status, error, refresh } = useAsyncData(
    () => `marketplace-list-${page.value}-${pageSize.value}-${search.value}`,
    () => marketplaceService.list({
      page: page.value,
      pageSize: pageSize.value,
      search: search.value,
    }),
    {
      transform: (response) => marketplaceAdapter.toMarketplaceList(response),
      watch: [page, pageSize, search],
    },
  )

  const items = computed(() => data.value?.items ?? [])
  const totalPages = computed(() => data.value?.totalPages ?? 0)
  const isLoading = computed(() => status.value === 'pending')
  const isEmpty = computed(() => !isLoading.value && items.value.length === 0)

  return {
    // Data
    items,
    totalPages,
    // State
    isLoading,
    isEmpty,
    error,
    // Actions
    refresh,
  }
}
```

**Composable rules:**
- Orchestrate: service -> adapter -> reactive data
- Manage loading, error, empty states
- Return refs/computed (never raw values)
- Name with `use` prefix
- Typed return values
- NO template/rendering (component does that)
- NO direct API access (service does that)
- Use `useAsyncData` or `useFetch` for server state (not TanStack Query)

### 4.5 useState - SSR-Safe Shared State

`useState` is Nuxt's built-in SSR-friendly state. Use it for simple shared state that needs to survive SSR hydration.

```typescript
// composables/useMarketplaceFilters.ts
export function useMarketplaceFilters() {
  const selectedCategory = useState<string | null>('marketplace-category', () => null)
  const viewMode = useState<'grid' | 'list'>('marketplace-view-mode', () => 'grid')
  const searchQuery = useState<string>('marketplace-search', () => '')

  const hasActiveFilters = computed(() =>
    !!selectedCategory.value || !!searchQuery.value
  )

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
    selectedCategory: readonly(selectedCategory),
    viewMode: readonly(viewMode),
    searchQuery,
    hasActiveFilters,
    setCategory,
    setViewMode,
    clearFilters,
  }
}
```

### 4.6 Pinia Stores - Complex Client State Only

Use Pinia only when `useState` is not enough (complex state, devtools, plugin ecosystem).

```typescript
// modules/marketplace/stores/marketplace-store.ts
import { defineStore } from 'pinia'

export const useMarketplaceStore = defineStore('marketplace', () => {
  // State
  const cart = ref<CartItem[]>([])
  const recentlyViewed = ref<string[]>([])

  // Getters
  const cartTotal = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const cartCount = computed(() =>
    cart.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Actions
  function addToCart(item: CartItem) {
    const existing = cart.value.find(i => i.id === item.id)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      cart.value.push(item)
    }
  }

  function removeFromCart(id: string) {
    cart.value = cart.value.filter(i => i.id !== id)
  }

  return {
    cart: readonly(cart),
    recentlyViewed: readonly(recentlyViewed),
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
  }
})
```

**State management rules:**
- `useState` for simple shared state (filters, UI mode, preferences)
- Pinia for complex client state (cart, multi-step forms, computed chains)
- `useFetch` / `useAsyncData` for server state - NEVER in Pinia
- Pinia: setup syntax, readonly() on state, storeToRefs() in consumers
- NO HTTP calls inside stores

### 4.7 Server Routes (Nitro)

```typescript
// server/api/marketplace/index.get.ts
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  // Fetch from database or external API
  const items = await fetchMarketplaceItems(query)

  return items
})

// server/api/marketplace/index.post.ts
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(1).max(255),
  vendor_name: z.string().min(1),
  category_slug: z.string().min(1),
  price_cents: z.number().int().positive(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse)

  const item = await createMarketplaceItem(body)

  return item
})
```

---

## 5. Components - Composition Pattern

### 5.1 SFC Pattern (with auto-imports)

```vue
<script setup lang="ts">
// In Nuxt, composables, components, and Vue APIs are auto-imported
// NO import statements needed for: ref, computed, watch, useRoute, etc.

// 1. Props & Emits (type-based)
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

// 2. Composables (auto-imported if in composables/ dir)
const page = ref(1)
const { items, totalPages, isLoading, isEmpty } = useMarketplaceList({
  page,
})

// 3. Local state
const selectedId = ref<string | null>(null)

// 4. Computed
const isFirstPage = computed(() => page.value === 1)

// 5. Handlers
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

### 5.2 Stop Prop Drilling - Component Composition

**WRONG - Prop Drilling:**
```vue
<Parent :user="user" :theme="theme" :permissions="permissions">
  <Child :user="user" :theme="theme" :permissions="permissions">
    <GrandChild :user="user" :permissions="permissions" />
  </Child>
</Parent>
```

**CORRECT - Composition with Slots:**
```vue
<!-- pages/marketplace/index.vue -->
<template>
  <NuxtLayout>
    <MarketplaceFilters />

    <MarketplaceList @select="handleSelect">
      <template #card="{ item }">
        <MarketplaceCard :item="item" />
      </template>

      <template #empty>
        <EmptyState message="No items found" />
      </template>
    </MarketplaceList>

    <MarketplaceDetails v-if="selectedItem" :item="selectedItem" />
  </NuxtLayout>
</template>
```

**CORRECT - Provide/Inject for shared context:**
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
    throw new Error('useMarketplaceContext must be used within a provider')
  }
  return context
}
```

### 5.3 Component Hierarchy

```
Pages (pages/)        -> Composition, orchestration, provide context
  └── Layout          -> Visual structure (slots)
      └── Features    -> Feature logic (composables)
          └── Shared  -> Pure presentation (props in, events out)
```

| Type | Responsibility | Can have logic? | Can have state? |
|------|---------------|----------------|----------------|
| **Pages** | Compose components, provide context | Via composables | Yes (composables) |
| **Feature Components** | UI + feature logic | Via composables | Yes (composables) |
| **Shared Components** | Generic, reusable UI | Minimal (UI only) | Minimal (local) |

---

## 6. Utils vs Helpers

### Utils - Pure Functions
- No side effects
- Input -> Output deterministic
- Testable without mocks
- No dependency on DOM, browser APIs, or Vue

```typescript
// shared/utils/format-date.ts
export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale).format(date)
}

// shared/utils/currency.ts
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}
```

### Helpers - Functions with Side Effects
- Interact with browser APIs (clipboard, localStorage, DOM)
- May have side effects
- May need mocks in tests

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
```

---

## 7. Error Handling - Centralized Pattern

### In Composables (useFetch / useAsyncData)
```typescript
const { data, error } = await useFetch('/api/marketplace', {
  onResponseError({ response }) {
    showError({
      statusCode: response.status,
      statusMessage: response.statusText,
    })
  },
})
```

### Global Error Page (error.vue)
```vue
<!-- app/error.vue -->
<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message: string
  }
}>()

function handleClearError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <button @click="handleClearError">Go home</button>
  </div>
</template>
```

### Server Error Handling (Nitro)
```typescript
// server/api/marketplace/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const item = await findMarketplaceItem(id)
  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Item not found',
    })
  }

  return item
})
```

### Error Utilities
- `useError()` - access current error in components
- `showError()` - trigger the error page
- `clearError()` - clear error and optionally redirect
- `createError()` - create an error in server routes

---

## 8. Barrel Exports (index.ts)

Due to auto-imports, barrel exports are less critical in Nuxt. However, for `modules/` (which are NOT auto-imported), each module exports its **public API**:

```typescript
// modules/marketplace/index.ts

// Components (for use in pages)
export { default as MarketplaceList } from './components/MarketplaceList.vue'
export { default as MarketplaceCard } from './components/MarketplaceCard.vue'

// Types (for typing)
export type { MarketplaceItem, MarketplaceList } from './types/marketplace.contracts'

// DO NOT export:
// - services (internal detail)
// - adapters (internal detail)
// - stores (use via composable)
// - internal composables
```

---

## 9. SOLID Applied to Nuxt

| Principle | Application in Nuxt |
|-----------|---------------------|
| **S**ingle Responsibility | 1 component = 1 responsibility. 1 composable = 1 domain. 1 server route = 1 operation. |
| **O**pen/Closed | Components extensible via slots and props, not internal modification. |
| **L**iskov Substitution | Shared components must work in any context without breaking. |
| **I**nterface Segregation | Specific props, not generic objects. `<UserAvatar :src :alt>` not `<UserAvatar :user>`. |
| **D**ependency Inversion | Composables depend on interfaces (types), not implementations. Services injected via composable. |

---

## 10. Migration Checklist (Nuxt 2 -> Nuxt 3)

### Nuxt Configuration
- [ ] `nuxt.config.js` -> `nuxt.config.ts`
- [ ] `buildModules` -> `modules` (no distinction in Nuxt 3)
- [ ] `@nuxtjs/` modules -> Nuxt 3 compatible alternatives

### Data Fetching
- [ ] `asyncData()` -> `useAsyncData()`
- [ ] `fetch()` -> `useFetch()`
- [ ] `$axios` / `@nuxtjs/axios` -> `$fetch` (built-in)

### State Management
- [ ] `store/` (Vuex) -> `composables/` + `useState` or Pinia
- [ ] Vuex modules -> Pinia stores (setup syntax)

### Components
- [ ] Options API -> `<script setup lang="ts">`
- [ ] `this.$route` -> `useRoute()`
- [ ] `this.$router` -> `useRouter()`
- [ ] `this.$store` -> composables / Pinia
- [ ] `this.$refs` -> `useTemplateRef()`

### Plugins
- [ ] `plugins/*.js` -> `plugins/*.ts`
- [ ] `inject()` pattern -> `provide()` + composables
- [ ] `context` parameter -> `useNuxtApp()`, `useRuntimeConfig()`

### Middleware
- [ ] `middleware/*.js` -> `middleware/*.ts`
- [ ] `context` parameter -> `navigateTo()`, `abortNavigation()`

### File Structure
- [ ] `static/` -> `public/`
- [ ] `store/` -> composables or Pinia
- [ ] Manual imports -> auto-imports (composables/, components/, utils/)
