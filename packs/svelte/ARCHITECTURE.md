# ARCHITECTURE.md -- Guia de Arquitetura e Padroes

> Este documento e a **source of truth** para todos os subagentes.
> Qualquer decisao arquitetural deve estar documentada aqui.

---

## 1. Visao Geral

Estamos construindo (ou migrando) projetos SvelteKit para uma arquitetura moderna, tipada e modular:

| De | Para |
|----|------|
| JavaScript | TypeScript (strict) |
| Svelte 4 (`export let`, `$:` reactive) | Svelte 5 (runes: `$state`, `$derived`, `$effect`, `$props`) |
| SvelteKit 1 (`$app/stores`, `throw redirect`) | SvelteKit 2 (`$app/state`, `redirect()` sem throw) |
| Props drilling | Component Composition + `setContext`/`getContext` |
| Fetch manual espalhado | Services + Adapters + SvelteKit load functions |
| Estado global desorganizado | Svelte stores (client state) + SvelteKit load (server state) |
| try/catch espalhados | Error handling centralizado em load functions + `+error.svelte` |
| Estrutura por tipo | Arquitetura modular por feature |
| Naming inconsistente | Convencoes rigidas documentadas |

### Migracoes Suportadas

#### Svelte 4 -> Svelte 5

| Svelte 4 (Legado) | Svelte 5 (Moderno) |
|--------------------|-------------------|
| `$: derived = x + y` | `let derived = $derived(x + y)` |
| `let count = 0` (reactive) | `let count = $state(0)` |
| `$: { sideEffect() }` | `$effect(() => { sideEffect() })` |
| `export let prop` | `let { prop }: Props = $props()` |
| `<slot>` | `{@render children()}` |
| `<slot name="header">` | `{@render header()}` com snippet |
| `createEventDispatcher()` | Callback props |
| `$$restProps` | `let { ...rest } = $props()` |
| `onMount(() => { ... })` | `$effect(() => { ... })` com cleanup return |
| `beforeUpdate` / `afterUpdate` | `$effect.pre()` / `$effect()` |

#### SvelteKit 1 -> SvelteKit 2

| SvelteKit 1 (Legado) | SvelteKit 2 (Moderno) |
|-----------------------|----------------------|
| `$app/stores` | `$app/state` |
| `throw redirect(...)` | `redirect(...)` (sem throw) |
| `throw error(...)` | `error(...)` (sem throw) |
| `/** @type {import('./$types').PageLoad} */` | Tipagem automatica com `$types` |

---

## 2. Estrutura de Diretorios (Arquitetura Modular)

```
src/
├── lib/                             # Codigo reutilizavel ($lib alias)
│   ├── modules/                     # Feature modules (bounded contexts)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.svelte
│   │   │   │   └── AuthGuard.svelte
│   │   │   ├── stores/
│   │   │   │   └── auth-store.ts
│   │   │   ├── services/
│   │   │   │   └── auth-service.ts
│   │   │   ├── adapters/
│   │   │   │   └── auth-adapter.ts
│   │   │   ├── types/
│   │   │   │   ├── auth.types.ts
│   │   │   │   └── auth.contracts.ts
│   │   │   ├── __tests__/
│   │   │   └── index.ts             # Barrel export (API publica do modulo)
│   │   │
│   │   ├── marketplace/
│   │   │   ├── components/
│   │   │   │   ├── MarketplaceList.svelte
│   │   │   │   ├── MarketplaceCard.svelte
│   │   │   │   ├── MarketplaceFilters.svelte
│   │   │   │   └── marketplace-card/
│   │   │   │       ├── MarketplaceCardHeader.svelte
│   │   │   │       └── MarketplaceCardActions.svelte
│   │   │   ├── stores/
│   │   │   │   └── marketplace-store.ts
│   │   │   ├── services/
│   │   │   │   └── marketplace-service.ts
│   │   │   ├── adapters/
│   │   │   │   └── marketplace-adapter.ts
│   │   │   ├── types/
│   │   │   │   ├── marketplace.types.ts
│   │   │   │   └── marketplace.contracts.ts
│   │   │   ├── __tests__/
│   │   │   └── index.ts
│   │   │
│   │   └── [outro-modulo]/
│   │
│   ├── shared/                      # Compartilhado entre modulos
│   │   ├── components/              # Componentes genericos (Button, Modal, Table)
│   │   ├── stores/                  # Stores compartilhados
│   │   ├── services/                # API client base, interceptors
│   │   ├── adapters/                # Adapters compartilhados
│   │   ├── types/                   # Types globais
│   │   ├── utils/                   # Funcoes puras sem side effects
│   │   ├── helpers/                 # Funcoes com side effects ou DOM
│   │   └── constants/               # Valores estaticos
│   │
│   └── assets/                      # Estaticos (imagens, fonts)
│
├── routes/                          # SvelteKit file-based routing
│   ├── +layout.svelte               # Layout raiz
│   ├── +layout.ts                   # Load function do layout
│   ├── +page.svelte                 # Home page
│   ├── +error.svelte                # Error page global
│   ├── marketplace/
│   │   ├── +page.svelte             # Page component
│   │   ├── +page.ts                 # Universal load function
│   │   ├── +page.server.ts          # Server-only load function
│   │   ├── +layout.svelte           # Layout do modulo
│   │   ├── +error.svelte            # Error page do modulo
│   │   └── [id]/
│   │       ├── +page.svelte
│   │       └── +page.ts
│   └── auth/
│       ├── login/+page.svelte
│       └── register/+page.svelte
│
├── app.html                         # HTML template
├── app.d.ts                         # TypeScript declarations
└── hooks.server.ts                  # Server hooks (auth, logging)
```

### Regras de Importacao entre Camadas
```
lib/modules/auth  <->  lib/shared/          ✅ Modulo importa de shared
lib/modules/auth  ->   lib/modules/market   ❌ Modulo NAO importa de outro modulo
lib/shared/       ->   lib/modules/auth     ❌ Shared NAO importa de modulos
routes/           ->   lib/modules/*        ✅ Routes importam modulos
routes/           ->   lib/shared/*         ✅ Routes importam shared
```

Se dois modulos precisam compartilhar algo -> mover para `lib/shared/`.

---

## 3. Nomenclatura

### Arquivos e Diretorios

| Tipo | Padrao | Exemplo |
|------|--------|---------|
| Diretorios | `kebab-case` | `user-settings/` |
| Componentes Svelte | `PascalCase.svelte` | `UserSettingsForm.svelte` |
| Paginas (routes) | `+page.svelte` | `routes/marketplace/+page.svelte` |
| Load functions | `+page.ts` / `+page.server.ts` | `routes/marketplace/+page.ts` |
| Layouts | `+layout.svelte` | `routes/marketplace/+layout.svelte` |
| Error pages | `+error.svelte` | `routes/marketplace/+error.svelte` |
| Services | `kebab-case-service.ts` | `marketplace-service.ts` |
| Adapters | `kebab-case-adapter.ts` | `marketplace-adapter.ts` |
| Stores (Svelte) | `kebab-case-store.ts` | `marketplace-store.ts` |
| Types | `kebab-case.types.ts` | `marketplace.types.ts` |
| Contracts/Schemas | `kebab-case.contracts.ts` | `marketplace.contracts.ts` |
| Utils | `kebab-case.ts` | `format-date.ts` |
| Helpers | `kebab-case.ts` | `clipboard-helper.ts` |
| Testes | `NomeOriginal.spec.ts` | `MarketplaceList.spec.ts` |
| Constants | `kebab-case.constants.ts` | `api-endpoints.constants.ts` |

### Codigo

| Tipo | Padrao | Exemplo |
|------|--------|---------|
| Variaveis / funcoes | `camelCase` | `getUserById`, `isLoading` |
| Types / Interfaces | `PascalCase` | `UserProfile`, `MarketplaceItem` |
| Enums | `PascalCase` | `UserRole.Admin` |
| Constantes | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |
| Store factories | `create` + `PascalCase` + `Store` | `createMarketplaceStore` |
| Store instances | `camelCase` + `Store` | `marketplaceStore` |
| Event handlers | `handle` + acao | `handleSubmit`, `handleDelete` |
| Boolean | `is`/`has`/`can`/`should` | `isLoading`, `hasPermission` |
| Callback props | `on` + acao | `onselect`, `ondelete` |
| Snippets (Svelte 5) | `camelCase` | `children`, `header`, `footer` |

---

## 4. Camadas de Responsabilidade

### 4.1 Services -- Requisicoes Puras

Services fazem **apenas** a request HTTP. Sem try/catch, sem transformacao, sem logica de negocio.

```typescript
// services/marketplace-service.ts
import type { MarketplaceListResponse, MarketplaceItemResponse } from '../types/marketplace.types'

const BASE_URL = '/api/marketplace'

export const marketplaceService = {
  async list(params: { page: number; pageSize: number; search?: string }) {
    const searchParams = new URLSearchParams({
      page: String(params.page),
      page_size: String(params.pageSize),
      ...(params.search && { search: params.search }),
    })
    const response = await fetch(`${BASE_URL}?${searchParams}`)
    return response.json() as Promise<MarketplaceListResponse>
  },

  async getById(id: string) {
    const response = await fetch(`${BASE_URL}/${id}`)
    return response.json() as Promise<MarketplaceItemResponse>
  },

  async create(payload: CreateMarketplacePayload) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.json() as Promise<MarketplaceItemResponse>
  },

  async delete(id: string) {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  },
}
```

**Regras de Service:**
- ❌ Sem try/catch (quem chama trata o erro)
- ❌ Sem transformacao de dados (adapter faz isso)
- ❌ Sem logica de negocio
- ❌ Sem acesso a stores
- ✅ Apenas chamadas HTTP com tipagem de request/response
- ✅ Um arquivo por dominio/recurso
- ✅ Exportar como objeto com metodos
- ✅ Usar `fetch` nativo (disponivel em server e client no SvelteKit)

### 4.2 Adapters -- Parsers de Contrato

Adapters transformam dados da API para o contrato TypeScript da aplicacao (e vice-versa). Sao **funcoes puras** sem side effects.

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
   * API response -> App contract (inbound)
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
   * App contract -> API payload (outbound)
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
- ✅ Funcoes puras (input -> output, sem side effects)
- ✅ Dois sentidos: API->App (inbound) e App->API (outbound)
- ✅ Renomear campos (snake_case API -> camelCase App)
- ✅ Converter tipos (string->Date, cents->decimal, status->boolean)
- ❌ Sem chamadas HTTP
- ❌ Sem acesso a stores
- ❌ Sem try/catch (falha = tipo errado = bug a ser corrigido)

### 4.3 Types & Contracts

```typescript
// types/marketplace.types.ts
// <- Tipos que refletem a API exatamente como ela retorna (snake_case)

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
// <- Contratos da aplicacao (camelCase, tipos corretos)

export interface MarketplaceItem {
  id: string
  name: string
  vendor: string
  category: string
  price: number          // em reais, nao centavos
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

### 4.4 Stores Svelte -- Client State

Svelte stores sao para estado que **nao vem do servidor**: UI state, filtros, preferencias.

```typescript
// stores/marketplace-store.ts
import { writable, derived } from 'svelte/store'

function createMarketplaceStore() {
  const selectedCategory = writable<string | null>(null)
  const viewMode = writable<'grid' | 'list'>('grid')
  const searchQuery = writable('')

  const hasActiveFilters = derived(
    [selectedCategory, searchQuery],
    ([$category, $search]) => !!$category || !!$search
  )

  function setCategory(category: string | null) {
    selectedCategory.set(category)
  }

  function setViewMode(mode: 'grid' | 'list') {
    viewMode.set(mode)
  }

  function clearFilters() {
    selectedCategory.set(null)
    searchQuery.set('')
  }

  return {
    // State (subscribe-only via $ syntax in components)
    selectedCategory: { subscribe: selectedCategory.subscribe },
    viewMode: { subscribe: viewMode.subscribe },
    searchQuery,  // writable se usado com bind:value
    // Derived
    hasActiveFilters,
    // Actions
    setCategory,
    setViewMode,
    clearFilters,
  }
}

export const marketplaceStore = createMarketplaceStore()
```

**Alternativa com runes (Svelte 5 class-based store):**

```typescript
// stores/marketplace-store.ts (rune-based)
export class MarketplaceStore {
  selectedCategory = $state<string | null>(null)
  viewMode = $state<'grid' | 'list'>('grid')
  searchQuery = $state('')

  get hasActiveFilters() {
    return !!this.selectedCategory || !!this.searchQuery
  }

  setCategory(category: string | null) {
    this.selectedCategory = category
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode
  }

  clearFilters() {
    this.selectedCategory = null
    this.searchQuery = ''
  }
}

export const marketplaceStore = new MarketplaceStore()
```

**Regras de Store:**
- ✅ Apenas client state (UI, filtros, preferencias, session)
- ✅ `writable()`/`readable()` ou rune-based class com `$state`
- ✅ Factory function (`createXxxStore`) ou class pattern
- ✅ Estado somente-leitura via `{ subscribe }` ou `$derived`
- ❌ Sem server state (dados da API vao em load functions)
- ❌ Sem chamadas HTTP dentro de stores
- ❌ Sem logica de negocio complexa

### 4.5 Load Functions -- Server State

SvelteKit load functions sao o mecanismo primario para server state. Substituem Vue Query/TanStack.

```typescript
// routes/marketplace/+page.ts
import type { PageLoad } from './$types'
import { marketplaceService } from '$lib/modules/marketplace/services/marketplace-service'
import { marketplaceAdapter } from '$lib/modules/marketplace/adapters/marketplace-adapter'

export const load: PageLoad = async ({ url, fetch }) => {
  const page = Number(url.searchParams.get('page') ?? '1')
  const search = url.searchParams.get('search') ?? ''

  const response = await marketplaceService.list({ page, pageSize: 20, search })
  const data = marketplaceAdapter.toMarketplaceList(response)

  return {
    marketplace: data,
    page,
    search,
  }
}
```

```typescript
// routes/marketplace/+page.server.ts (server-only, sensitive operations)
import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { marketplaceService } from '$lib/modules/marketplace/services/marketplace-service'
import { marketplaceAdapter } from '$lib/modules/marketplace/adapters/marketplace-adapter'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    redirect(303, '/auth/login')
  }

  const response = await marketplaceService.list({ page: 1, pageSize: 20 })
  return {
    marketplace: marketplaceAdapter.toMarketplaceList(response),
  }
}

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData()
    const name = formData.get('name') as string

    if (!name) {
      return fail(400, { name, missing: true })
    }

    const payload = marketplaceAdapter.toCreatePayload({
      name,
      vendor: formData.get('vendor') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
    })

    await marketplaceService.create(payload)
    redirect(303, '/marketplace')
  },
}
```

**Regras de Load Functions:**
- ✅ Orquestram: service -> adapter -> dados tipados
- ✅ Gerenciam autenticacao/autorizacao com `locals`
- ✅ Retornam dados tipados consumidos via `$page.data` ou `data` prop
- ✅ Error handling com `fail()` para form actions
- ✅ `redirect()` sem throw (SvelteKit 2)
- ❌ Sem acesso direto a DOM
- ❌ Sem logica de UI (isso e do componente)

---

## 5. Componentes Svelte -- Svelte 5 Runes Pattern

### 5.1 Padrao de Componente (.svelte)

```svelte
<script lang="ts">
  // 1. Imports
  import { getContext } from 'svelte'
  import MarketplaceCard from './MarketplaceCard.svelte'
  import { marketplaceStore } from '../stores/marketplace-store'
  import type { MarketplaceItem } from '../types/marketplace.contracts'

  // 2. Props (typed with $props rune)
  interface Props {
    items: MarketplaceItem[]
    isLoading?: boolean
    onselect?: (item: MarketplaceItem) => void
  }

  let { items, isLoading = false, onselect }: Props = $props()

  // 3. Stores
  const { searchQuery, viewMode } = marketplaceStore

  // 4. Local state (runes)
  let selectedId = $state<string | null>(null)
  let page = $state(1)

  // 5. Derived state
  let isFirstPage = $derived(page === 1)
  let isEmpty = $derived(!isLoading && items.length === 0)

  // 6. Effects
  $effect(() => {
    // runs when dependencies change
    console.log('Items updated:', items.length)
  })

  // 7. Handlers
  function handleSelect(item: MarketplaceItem) {
    selectedId = item.id
    onselect?.(item)
  }

  function handlePageChange(newPage: number) {
    page = newPage
  }
</script>

<!-- Template -->
{#if isLoading}
  <div class="loading">Loading...</div>
{:else if isEmpty}
  <div class="empty">No items found</div>
{:else}
  <div class="list" class:grid={$viewMode === 'grid'}>
    {#each items as item (item.id)}
      <MarketplaceCard
        {item}
        isSelected={selectedId === item.id}
        onselect={() => handleSelect(item)}
      />
    {/each}
  </div>
{/if}

<style>
  .loading { /* ... */ }
  .empty { /* ... */ }
  .list { /* ... */ }
  .grid { /* ... */ }
</style>
```

### 5.2 Stop Prop Drilling -- Component Composition

**❌ ERRADO -- Prop Drilling:**
```svelte
<!-- GrandParent passa props por 3 niveis -->
<Parent {user} {theme} {permissions}>
  <Child {user} {theme} {permissions}>
    <GrandChild {user} {permissions} />
  </Child>
</Parent>
```

**✅ CORRETO -- Composition com Snippets (Svelte 5):**
```svelte
<!-- MarketplacePage.svelte (Page component) -->
<script lang="ts">
  import PageLayout from '$lib/shared/components/PageLayout.svelte'
  import MarketplaceList from '../components/MarketplaceList.svelte'
  import MarketplaceFilters from '../components/MarketplaceFilters.svelte'
  import MarketplaceDetails from '../components/MarketplaceDetails.svelte'
  import EmptyState from '$lib/shared/components/EmptyState.svelte'
  import type { MarketplaceItem } from '../types/marketplace.contracts'

  let { data } = $props()
  let selectedItem = $state<MarketplaceItem | null>(null)

  function handleSelect(item: MarketplaceItem) {
    selectedItem = item
  }
</script>

<PageLayout>
  {#snippet header()}
    <MarketplaceFilters />
  {/snippet}

  {#snippet content()}
    <MarketplaceList items={data.marketplace.items} onselect={handleSelect}>
      {#snippet empty()}
        <EmptyState message="Nenhum item encontrado" />
      {/snippet}
    </MarketplaceList>
  {/snippet}

  {#snippet sidebar()}
    {#if selectedItem}
      <MarketplaceDetails item={selectedItem} />
    {/if}
  {/snippet}
</PageLayout>
```

**✅ CORRETO -- Context para estado compartilhado:**
```typescript
// Using setContext/getContext (Svelte equivalent of provide/inject)
// components/MarketplaceProvider.svelte
<script lang="ts">
  import { setContext } from 'svelte'
  import type { MarketplaceItem } from '../types/marketplace.contracts'

  interface MarketplaceContext {
    selectedItem: MarketplaceItem | null
    selectItem: (item: MarketplaceItem) => void
    clearSelection: () => void
  }

  let selectedItem = $state<MarketplaceItem | null>(null)

  function selectItem(item: MarketplaceItem) {
    selectedItem = item
  }

  function clearSelection() {
    selectedItem = null
  }

  setContext<MarketplaceContext>('marketplace', {
    get selectedItem() { return selectedItem },
    selectItem,
    clearSelection,
  })

  let { children } = $props()
</script>

{@render children()}
```

```svelte
<!-- Child component consuming context -->
<script lang="ts">
  import { getContext } from 'svelte'

  const ctx = getContext<MarketplaceContext>('marketplace')
  // Access: ctx.selectedItem, ctx.selectItem(item), ctx.clearSelection()
</script>
```

### 5.3 Hierarquia de Componentes

```
Pages (+page.svelte)    -> Composicao, orquestracao, consume load data
  └── Layout            -> Estrutura visual (snippets)
      └── Features      -> Logica de feature (stores, context)
          └── Shared    -> Apresentacao pura (props in, callbacks out)
```

| Tipo | Responsabilidade | Pode ter logica? | Pode ter estado? |
|------|-----------------|-----------------|-----------------|
| **Pages** | Compor componentes, consume load data | Via stores/context | Sim (local $state) |
| **Feature Components** | UI + logica da feature | Via stores | Sim (local $state) |
| **Shared Components** | UI generica, reutilizavel | Minima (UI only) | Minimo (local) |

### 5.4 Recebendo Load Data em Pages

```svelte
<!-- routes/marketplace/+page.svelte -->
<script lang="ts">
  import MarketplaceList from '$lib/modules/marketplace/components/MarketplaceList.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
</script>

<h1>Marketplace</h1>
<MarketplaceList items={data.marketplace.items} />
```

---

## 6. Utils vs Helpers

### Utils -- Funcoes Puras
- Sem side effects
- Input -> Output deterministico
- Testaveis sem mocks
- Sem dependencia de DOM, browser APIs, ou Svelte

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

### Helpers -- Funcoes com Side Effects ou DOM
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
  // integra com lib de toast
}
```

---

## 7. Error Handling -- Padrao Centralizado

### Em Load Functions

```typescript
// routes/marketplace/+page.ts
import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { marketplaceService } from '$lib/modules/marketplace/services/marketplace-service'
import { marketplaceAdapter } from '$lib/modules/marketplace/adapters/marketplace-adapter'

export const load: PageLoad = async ({ fetch, params }) => {
  try {
    const response = await marketplaceService.getById(params.id)
    return {
      item: marketplaceAdapter.toMarketplaceItem(response),
    }
  } catch (err) {
    error(404, { message: 'Item not found' })
  }
}
```

### Em Form Actions

```typescript
// routes/marketplace/+page.server.ts
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  delete: async ({ params, locals }) => {
    if (!locals.user) {
      return fail(401, { message: 'Not authenticated' })
    }

    try {
      await marketplaceService.delete(params.id)
    } catch {
      return fail(500, { message: 'Failed to delete item' })
    }

    redirect(303, '/marketplace')
  },
}
```

### Error Page (+error.svelte)

```svelte
<!-- routes/marketplace/+error.svelte -->
<script lang="ts">
  import { page } from '$app/state'
</script>

<div class="error-page">
  <h1>{page.status}</h1>
  <p>{page.error?.message ?? 'Something went wrong'}</p>
  <a href="/marketplace">Go back</a>
</div>
```

### Parser de Erros Centralizado

```typescript
// shared/utils/parse-api-error.ts
interface ApiErrorResponse {
  message?: string
  detail?: string
  errors?: Record<string, string[]>
}

export function parseApiError(error: unknown): string {
  if (error instanceof Response) {
    if (error.status === 403) return 'Sem permissao para esta acao'
    if (error.status === 404) return 'Recurso nao encontrado'
    if (error.status === 500) return 'Erro interno do servidor'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Erro inesperado. Tente novamente.'
}
```

### Hooks para Erros Globais

```typescript
// src/hooks.server.ts
import type { Handle, HandleServerError } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // Auth check, logging, etc.
  return resolve(event)
}

export const handleError: HandleServerError = ({ error, event }) => {
  console.error('Server error:', error)
  return {
    message: 'Internal server error',
  }
}
```

---

## 8. Barrel Exports (index.ts)

Cada modulo exporta apenas sua **API publica**:

```typescript
// lib/modules/marketplace/index.ts

// Componentes reutilizaveis por outros (raro, evitar)
export { default as MarketplaceCard } from './components/MarketplaceCard.svelte'

// Types (para quem precisa tipar)
export type { MarketplaceItem, MarketplaceList } from './types/marketplace.contracts'

// Stores (se compartilhados)
export { marketplaceStore } from './stores/marketplace-store'

// ❌ NAO exportar:
// - services (detalhe interno)
// - adapters (detalhe interno)
// - componentes internos
```

---

## 9. Regras SOLID aplicadas ao Svelte

| Principio | Aplicacao Svelte |
|-----------|-----------------|
| **S**ingle Responsibility | 1 componente = 1 responsabilidade. 1 store = 1 dominio. 1 service = 1 recurso. |
| **O**pen/Closed | Componentes extensiveis via snippets e props, nao por modificacao interna. |
| **L**iskov Substitution | Componentes shared devem funcionar em qualquer contexto sem quebrar. |
| **I**nterface Segregation | Props especificas, nao objetos genericos. `<UserAvatar src={src} alt={alt}>` nao `<UserAvatar {user}>`. |
| **D**ependency Inversion | Stores dependem de interfaces (types), nao de implementacoes. Services usados via load functions, nao importados direto no componente. |

---

## 10. Checklist de Migracao por Arquivo

### Componente .svelte (Svelte 4 -> 5)
- [ ] Runes: `$state()` em vez de `let x = 0`
- [ ] Runes: `$derived()` em vez de `$: derived = ...`
- [ ] Runes: `$effect()` em vez de `$: { sideEffect() }`
- [ ] Runes: `$props()` em vez de `export let`
- [ ] Snippets: `{@render children()}` em vez de `<slot>`
- [ ] Snippets: `{@render header()}` em vez de `<slot name="header">`
- [ ] Callback props em vez de `createEventDispatcher()`
- [ ] `let { ...rest } = $props()` em vez de `$$restProps`
- [ ] TypeScript tipado no `$props()`
- [ ] < 200 linhas total
- [ ] Template < 100 linhas
- [ ] Sem logica de negocio no template
- [ ] Loading / error / empty states
- [ ] Sem `{@html}` ou com sanitizacao

### Load Function
- [ ] Tipo correto: `PageLoad` ou `PageServerLoad`
- [ ] Usa service + adapter (nunca API direto)
- [ ] Error handling com `error()` (SvelteKit 2, sem throw)
- [ ] Redirect com `redirect()` (SvelteKit 2, sem throw)
- [ ] Retorna dados tipados

### Service
- [ ] Apenas chamadas HTTP
- [ ] Sem try/catch
- [ ] Sem transformacao de dados
- [ ] Tipagem de request e response
- [ ] Usa `fetch` nativo

### Adapter
- [ ] Funcoes puras
- [ ] Inbound (API->App) e Outbound (App->API)
- [ ] Conversao de naming (snake_case -> camelCase)
- [ ] Conversao de tipos (string->Date, etc.)

### Store Svelte
- [ ] Apenas client state
- [ ] `writable()`/`readable()` ou rune-based class
- [ ] Factory function ou class instanciada
- [ ] Estado somente-leitura via `{ subscribe }` ou getter

### Types
- [ ] `.types.ts` para tipos da API (raw response)
- [ ] `.contracts.ts` para contratos da aplicacao
- [ ] Sem `any`

### SvelteKit 1 -> 2 Migration
- [ ] `$app/stores` -> `$app/state`
- [ ] `throw redirect()` -> `redirect()` (sem throw)
- [ ] `throw error()` -> `error()` (sem throw)
- [ ] Tipagem automatica com `$types`
