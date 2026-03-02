# Camadas de Responsabilidade

::: info Nota sobre Framework
Os exemplos abaixo utilizam os padroes do **pack Vue 3**. Cada framework pack (React, Next.js, SvelteKit) fornece padroes equivalentes adaptados ao seu ecossistema. Veja [Framework Packs](/pt-BR/guide/introduction#como-os-packs-funcionam) para detalhes.
:::

Cada camada na arquitetura tem uma responsabilidade unica e bem definida.

## Fluxo Completo de Requisicao

```mermaid
sequenceDiagram
    participant V as View / Component
    participant Co as Composable
    participant S as Service
    participant API as REST API
    participant Ad as Adapter
    participant St as Pinia Store

    Note over V,St: User clicks "Load Products"
    V->>Co: useProductsList({ page, search })
    Co->>S: productsService.list({ page, search })
    S->>API: GET /v2/products?page=1&search=shoes
    API-->>S: 200 { data: [...], total_pages: 5 }
    S-->>Co: raw response (snake_case)
    Co->>Ad: productsAdapter.toProductList(response)
    Ad-->>Co: { items: Product[], totalPages: 5 }
    Note over Co: Vue Query caches result (staleTime: 5min)
    Co-->>V: { items, isLoading: false, totalPages }

    Note over V,St: User changes filter
    V->>St: store.setCategory('shoes')
    St-->>V: selectedCategory updated
    Note over V: queryKey changes → auto-refetch
```

## Service - HTTP Puro

Services fazem a requisicao HTTP. Nada mais.

```typescript
// services/products-service.ts
import { api } from '@/shared/services/api-client'
import type {
  ProductListResponse,
  ProductItemResponse,
  CreateProductPayload,
} from '../types/products.types'

export const productsService = {
  list(params: { page: number; pageSize: number; search?: string }) {
    return api.get<ProductListResponse>('/v2/products', { params })
  },

  getById(id: string) {
    return api.get<ProductItemResponse>(`/v2/products/${id}`)
  },

  create(payload: CreateProductPayload) {
    return api.post<ProductItemResponse>('/v2/products', payload)
  },

  update(id: string, payload: Partial<CreateProductPayload>) {
    return api.patch<ProductItemResponse>(`/v2/products/${id}`, payload)
  },

  delete(id: string) {
    return api.delete(`/v2/products/${id}`)
  },
}
```

**Regras:**

- ✅ Chamadas HTTP com request/response tipados
- ✅ Um arquivo por dominio/recurso
- ✅ Exportar como objeto com metodos
- ❌ Sem try/catch (o chamador trata os erros)
- ❌ Sem transformacao de dados (o adapter faz isso)
- ❌ Sem logica de negocio
- ❌ Sem acesso a store/composable

::: warning Erro comum
Nao adicione `try/catch` nos services. O tratamento de erros pertence a camada de composable via `onError` do Vue Query.
:::

## Adapter - Parsers de Contrato

Adapters transformam dados entre o formato da API e o formato do app. Sao **funcoes puras** sem efeitos colaterais.

```mermaid
graph LR
    API["API Response<br/><i>snake_case, string dates, cents</i>"] -->|"toProduct()"| App["App Contract<br/><i>camelCase, Date objects, currency</i>"]
    App -->|"toCreatePayload()"| API2["API Payload<br/><i>snake_case, ISO strings, cents</i>"]

    style API fill:#35495e,color:#fff
    style App fill:#42b883,color:#fff
    style API2 fill:#35495e,color:#fff
```

```typescript
// adapters/products-adapter.ts
import type { ProductItemResponse } from '../types/products.types'
import type { Product } from '../types/products.contracts'

export const productsAdapter = {
  // Inbound: API → App
  toProduct(response: ProductItemResponse): Product {
    return {
      id: response.uuid,
      name: response.name,
      description: response.description,
      vendor: response.vendor_name,
      category: response.category_slug,
      price: response.price_cents / 100,
      isActive: response.status === 'active',
      imageUrl: response.image_url,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
    }
  },

  // Outbound: App → API
  toCreatePayload(input: CreateProductInput): CreateProductPayload {
    return {
      name: input.name,
      description: input.description,
      vendor_name: input.vendor,
      category_slug: input.category,
      price_cents: Math.round(input.price * 100),
      image_url: input.imageUrl,
    }
  },
}
```

**Regras:**

- ✅ Funcoes puras (entrada → saida)
- ✅ Bidirecional: API → App (entrada) e App → API (saida)
- ✅ Renomear campos (snake_case → camelCase)
- ✅ Converter tipos (string → Date, centavos → decimal, status → booleano)
- ❌ Sem chamadas HTTP
- ❌ Sem acesso a store/composable

## Types e Contracts

Dois arquivos separados para o mesmo recurso:

```typescript
// types/products.types.ts - Resposta exata da API (snake_case)
export interface ProductItemResponse {
  uuid: string
  name: string
  description: string
  vendor_name: string
  category_slug: string
  price_cents: number
  status: 'active' | 'inactive' | 'pending'
  image_url: string | null
  created_at: string       // ISO 8601
  updated_at: string       // ISO 8601
}

export interface ProductListResponse {
  data: ProductItemResponse[]
  total_pages: number
  current_page: number
}
```

```typescript
// types/products.contracts.ts - Contrato do app (camelCase)
export interface Product {
  id: string
  name: string
  description: string
  vendor: string
  category: string
  price: number            // em moeda, nao centavos
  isActive: boolean        // derivado do status
  imageUrl: string | null
  createdAt: Date          // Objeto Date, nao string
  updatedAt: Date
}
```

::: tip Por que dois arquivos?
- `.types.ts` espelha a API exatamente - se a API mudar, apenas este arquivo muda
- `.contracts.ts` e o que seus componentes realmente usam - interface estavel do app
- O adapter faz a ponte entre eles
:::

## Composable - Orquestracao

Composables conectam tudo: chamam o service, passam pelo adapter, gerenciam loading/error, expoe dados reativos.

```typescript
// composables/useProductsList.ts
import { computed, type MaybeRef, toValue } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { productsService } from '../services/products-service'
import { productsAdapter } from '../adapters/products-adapter'

export function useProductsList(options: {
  page: MaybeRef<number>
  pageSize?: MaybeRef<number>
  search?: MaybeRef<string>
}) {
  const page = computed(() => toValue(options.page))
  const pageSize = computed(() => toValue(options.pageSize) ?? 20)
  const search = computed(() => toValue(options.search) ?? '')

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: computed(() => [
      'products', 'list',
      { page: page.value, pageSize: pageSize.value, search: search.value },
    ]),
    queryFn: async () => {
      const response = await productsService.list({
        page: page.value,
        pageSize: pageSize.value,
        search: search.value,
      })
      return {
        items: response.data.data.map(productsAdapter.toProduct),
        totalPages: response.data.total_pages,
      }
    },
    staleTime: 5 * 60 * 1000,     // 5 minutes
    placeholderData: keepPreviousData,
  })

  const items = computed(() => data.value?.items ?? [])
  const totalPages = computed(() => data.value?.totalPages ?? 0)
  const isEmpty = computed(() => !isLoading.value && items.value.length === 0)

  return { items, totalPages, isLoading, isFetching, isEmpty, error, refetch }
}
```

**Exemplo de mutation:**

```typescript
// composables/useCreateProduct.ts
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { productsService } from '../services/products-service'
import { productsAdapter } from '../adapters/products-adapter'
import type { CreateProductInput } from '../types/products.contracts'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  const { mutate, isPending, error } = useMutation({
    mutationFn: (input: CreateProductInput) => {
      const payload = productsAdapter.toCreatePayload(input)
      return productsService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return { createProduct: mutate, isPending, error }
}
```

**Regras:**

- ✅ Orquestrar: service → adapter → dados reativos
- ✅ Gerenciar estados de loading, error e vazio
- ✅ Retornar refs/computed (nunca valores brutos)
- ✅ Nomeados `useXxx`
- ❌ Sem template/renderizacao
- ❌ Sem acesso direto a API

## Pinia Store - Apenas Estado do Cliente

Pinia e para estado que **nao vem do servidor**: estado da UI, filtros, preferencias.

```mermaid
graph TB
    subgraph "Server State (Vue Query)"
        Q["useProductsList()"]
        QD["products data, loading, error"]
        Q --> QD
    end

    subgraph "Client State (Pinia)"
        P["useProductsStore()"]
        PD["filters, viewMode, selectedIds"]
        P --> PD
    end

    QD -->|"displayed in"| Comp["ProductsView.vue"]
    PD -->|"controls"| Comp

    style Q fill:#42b883,color:#fff
    style P fill:#35495e,color:#fff
    style Comp fill:#42b883,color:#fff
```

```typescript
// stores/products-store.ts
import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useProductsStore = defineStore('products', () => {
  // State
  const selectedCategory = ref<string | null>(null)
  const viewMode = ref<'grid' | 'list'>('grid')
  const searchQuery = ref('')
  const selectedIds = ref<Set<string>>(new Set())

  // Getters
  const hasActiveFilters = computed(() =>
    !!selectedCategory.value || !!searchQuery.value
  )

  const selectedCount = computed(() => selectedIds.value.size)

  // Actions
  function setCategory(category: string | null) {
    selectedCategory.value = category
  }

  function clearFilters() {
    selectedCategory.value = null
    searchQuery.value = ''
  }

  function toggleSelection(id: string) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
  }

  return {
    // Readonly state
    selectedCategory: readonly(selectedCategory),
    viewMode: readonly(viewMode),
    searchQuery,
    selectedIds: readonly(selectedIds),
    // Getters
    hasActiveFilters,
    selectedCount,
    // Actions
    setCategory,
    clearFilters,
    toggleSelection,
  }
})
```

**Regras:**

- ✅ Apenas estado do cliente (UI, filtros, preferencias, sessao)
- ✅ Setup syntax
- ✅ `readonly()` no estado exposto
- ✅ `storeToRefs()` ao desestruturar em componentes
- ❌ Sem estado do servidor (dados da API vao no Vue Query)
- ❌ Sem chamadas HTTP
