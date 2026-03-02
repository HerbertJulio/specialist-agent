# How to Build a CRUD Module

::: info Framework Note
This tutorial uses the **Vue 3 pack** patterns. Each framework pack (React, Next.js, SvelteKit, Angular, Astro, Nuxt) provides equivalent patterns adapted to its ecosystem. See [Framework Packs](/guide/introduction#how-packs-work) for details.
:::

This tutorial walks you through building a complete **Orders** module for an e-commerce app - from zero to a fully working feature with listing, creation, editing, and deletion.

## What You'll Build

```mermaid
graph LR
    T["Types & Contracts"] --> Ad["Adapter"]
    Ad --> S["Service"]
    S --> Co["Composables"]
    Co --> St["Store"]
    St --> C["Components"]
    C --> V["View"]
    V --> R["Route"]

    style T fill:#35495e,color:#fff
    style Ad fill:#42b883,color:#fff
    style S fill:#35495e,color:#fff
    style Co fill:#42b883,color:#fff
    style St fill:#35495e,color:#fff
    style C fill:#42b883,color:#fff
    style V fill:#35495e,color:#fff
    style R fill:#42b883,color:#fff
```

## Step 1 - Create the Module Structure

```bash
mkdir -p src/modules/orders/{types,adapters,services,composables,stores,components,views,__tests__}
touch src/modules/orders/index.ts
```

```text
src/modules/orders/
├── types/
├── adapters/
├── services/
├── composables/
├── stores/
├── components/
├── views/
├── __tests__/
└── index.ts
```

## Step 2 - Define Types (API Response)

This is the **exact shape** the API returns. Keep it 1:1 with the JSON.

```typescript
// src/modules/orders/types/orders.types.ts

export interface OrderItemResponse {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total_cents: number
  currency: string
  items_count: number
  shipping_address: {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
  }
  notes: string | null
  created_at: string   // ISO 8601
  updated_at: string   // ISO 8601
}

export interface OrderListResponse {
  data: OrderItemResponse[]
  meta: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}

export interface CreateOrderPayload {
  customer_name: string
  customer_email: string
  items: Array<{ product_id: number; quantity: number }>
  shipping_address: {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
  }
  notes?: string
}
```

::: tip Why snake_case?
The types file mirrors the API exactly. Most REST APIs use `snake_case`. Your app code will use `camelCase` - the adapter handles the conversion.
:::

## Step 3 - Define Contracts (App Interface)

This is what your **components actually use**. Clean, typed, camelCase.

```typescript
// src/modules/orders/types/orders.contracts.ts

export interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  status: OrderStatus
  total: number              // in currency, not cents
  currency: string
  itemsCount: number
  shippingAddress: Address
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface CreateOrderInput {
  customerName: string
  customerEmail: string
  items: Array<{ productId: number; quantity: number }>
  shippingAddress: Address
  notes?: string
}

export interface OrderListResult {
  items: Order[]
  currentPage: number
  totalPages: number
  totalCount: number
}
```

## Step 4 - Build the Adapter

The adapter is a **pure function** - no HTTP, no side effects. It converts between the two formats.

```typescript
// src/modules/orders/adapters/orders-adapter.ts

import type { OrderItemResponse, OrderListResponse, CreateOrderPayload } from '../types/orders.types'
import type { Order, OrderListResult, CreateOrderInput } from '../types/orders.contracts'

export const ordersAdapter = {
  /** API → App */
  toOrder(response: OrderItemResponse): Order {
    return {
      id: response.id,
      orderNumber: response.order_number,
      customerName: response.customer_name,
      customerEmail: response.customer_email,
      status: response.status,
      total: response.total_cents / 100,
      currency: response.currency,
      itemsCount: response.items_count,
      shippingAddress: {
        street: response.shipping_address.street,
        city: response.shipping_address.city,
        state: response.shipping_address.state,
        zipCode: response.shipping_address.zip_code,
        country: response.shipping_address.country,
      },
      notes: response.notes,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
    }
  },

  /** API list → App list */
  toOrderList(response: OrderListResponse): OrderListResult {
    return {
      items: response.data.map(ordersAdapter.toOrder),
      currentPage: response.meta.current_page,
      totalPages: response.meta.total_pages,
      totalCount: response.meta.total_count,
    }
  },

  /** App → API (for creating) */
  toCreatePayload(input: CreateOrderInput): CreateOrderPayload {
    return {
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      items: input.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      shipping_address: {
        street: input.shippingAddress.street,
        city: input.shippingAddress.city,
        state: input.shippingAddress.state,
        zip_code: input.shippingAddress.zipCode,
        country: input.shippingAddress.country,
      },
      notes: input.notes,
    }
  },
}
```

::: warning Bidirectional
Always create both directions: **inbound** (API → App) for reads and **outbound** (App → API) for writes. This keeps the adapter as the single conversion point.
:::

## Step 5 - Build the Service

The service makes HTTP calls. **Nothing else.** No try/catch, no transformation.

```typescript
// src/modules/orders/services/orders-service.ts

import { api } from '@/shared/services/api-client'
import type { OrderItemResponse, OrderListResponse, CreateOrderPayload } from '../types/orders.types'

export const ordersService = {
  list(params: { page: number; perPage?: number; status?: string }) {
    return api.get<OrderListResponse>('/v2/orders', { params })
  },

  getById(id: number) {
    return api.get<OrderItemResponse>(`/v2/orders/${id}`)
  },

  create(payload: CreateOrderPayload) {
    return api.post<OrderItemResponse>('/v2/orders', payload)
  },

  update(id: number, payload: Partial<CreateOrderPayload>) {
    return api.patch<OrderItemResponse>(`/v2/orders/${id}`, payload)
  },

  cancel(id: number) {
    return api.post<OrderItemResponse>(`/v2/orders/${id}/cancel`)
  },
}
```

## Step 6 - Build the Composables

### List composable (query)

```typescript
// src/modules/orders/composables/useOrdersList.ts

import { computed, type MaybeRef, toValue } from 'vue'
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { ordersService } from '../services/orders-service'
import { ordersAdapter } from '../adapters/orders-adapter'

export function useOrdersList(options: {
  page: MaybeRef<number>
  perPage?: MaybeRef<number>
  status?: MaybeRef<string | undefined>
}) {
  const page = computed(() => toValue(options.page))
  const perPage = computed(() => toValue(options.perPage) ?? 20)
  const status = computed(() => toValue(options.status))

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: computed(() => ['orders', 'list', {
      page: page.value,
      perPage: perPage.value,
      status: status.value,
    }]),
    queryFn: async () => {
      const response = await ordersService.list({
        page: page.value,
        perPage: perPage.value,
        status: status.value,
      })
      return ordersAdapter.toOrderList(response.data)
    },
    staleTime: 2 * 60 * 1000,        // 2 minutes
    placeholderData: keepPreviousData, // smooth pagination
  })

  const items = computed(() => data.value?.items ?? [])
  const totalPages = computed(() => data.value?.totalPages ?? 0)
  const totalCount = computed(() => data.value?.totalCount ?? 0)
  const isEmpty = computed(() => !isLoading.value && items.value.length === 0)

  return {
    items, totalPages, totalCount, isEmpty,
    isLoading, isFetching, error, refetch,
  }
}
```

### Create composable (mutation)

```typescript
// src/modules/orders/composables/useCreateOrder.ts

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ordersService } from '../services/orders-service'
import { ordersAdapter } from '../adapters/orders-adapter'
import type { CreateOrderInput } from '../types/orders.contracts'

export function useCreateOrder() {
  const queryClient = useQueryClient()

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: (input: CreateOrderInput) => {
      const payload = ordersAdapter.toCreatePayload(input)
      return ordersService.create(payload)
    },
    onSuccess: () => {
      // Invalidate the list so it refetches with the new order
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  return { createOrder: mutate, isPending, error, isSuccess }
}
```

### Cancel composable (mutation)

```typescript
// src/modules/orders/composables/useCancelOrder.ts

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ordersService } from '../services/orders-service'

export function useCancelOrder() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (orderId: number) => ordersService.cancel(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  return { cancelOrder: mutate, isCancelling: isPending }
}
```

## Step 7 - Build the Store (Client State)

The store holds **UI state only** - not server data.

```typescript
// src/modules/orders/stores/orders-store.ts

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { OrderStatus } from '../types/orders.contracts'

export const useOrdersStore = defineStore('orders', () => {
  const currentPage = ref(1)
  const statusFilter = ref<OrderStatus | undefined>(undefined)
  const selectedOrderIds = ref<Set<number>>(new Set())

  const hasActiveFilters = computed(() => !!statusFilter.value)
  const selectedCount = computed(() => selectedOrderIds.value.size)

  function setPage(page: number) {
    currentPage.value = page
  }

  function setStatusFilter(status: OrderStatus | undefined) {
    statusFilter.value = status
    currentPage.value = 1  // reset to page 1 when filter changes
  }

  function toggleSelection(id: number) {
    if (selectedOrderIds.value.has(id)) {
      selectedOrderIds.value.delete(id)
    } else {
      selectedOrderIds.value.add(id)
    }
  }

  function clearSelection() {
    selectedOrderIds.value.clear()
  }

  return {
    currentPage: readonly(currentPage),
    statusFilter: readonly(statusFilter),
    selectedOrderIds: readonly(selectedOrderIds),
    hasActiveFilters,
    selectedCount,
    setPage,
    setStatusFilter,
    toggleSelection,
    clearSelection,
  }
})
```

## Step 8 - Build the Components

### OrdersTable.vue

```vue
<!-- src/modules/orders/components/OrdersTable.vue -->
<script setup lang="ts">
import type { Order } from '../types/orders.contracts'

const props = defineProps<{
  orders: Order[]
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [order: Order]
  cancel: [orderId: number]
}>()

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}
</script>

<template>
  <div v-if="loading" class="loading">Loading orders...</div>

  <table v-else-if="orders.length > 0">
    <thead>
      <tr>
        <th>Order</th>
        <th>Customer</th>
        <th>Status</th>
        <th>Total</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.orderNumber }}</td>
        <td>{{ order.customerName }}</td>
        <td>
          <span :class="['badge', `badge--${order.status}`]">
            {{ order.status }}
          </span>
        </td>
        <td>{{ formatCurrency(order.total, order.currency) }}</td>
        <td>{{ formatDate(order.createdAt) }}</td>
        <td>
          <button @click="emit('select', order)">View</button>
          <button
            v-if="order.status === 'pending'"
            @click="emit('cancel', order.id)"
          >
            Cancel
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-else class="empty">No orders found.</div>
</template>
```

### OrderStatusFilter.vue

```vue
<!-- src/modules/orders/components/OrderStatusFilter.vue -->
<script setup lang="ts">
import type { OrderStatus } from '../types/orders.contracts'

defineProps<{
  currentStatus?: OrderStatus
}>()

const emit = defineEmits<{
  change: [status: OrderStatus | undefined]
}>()

const statuses: Array<{ value: OrderStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]
</script>

<template>
  <div class="filter-bar">
    <button
      :class="{ active: !currentStatus }"
      @click="emit('change', undefined)"
    >
      All
    </button>
    <button
      v-for="s in statuses"
      :key="s.value"
      :class="{ active: currentStatus === s.value }"
      @click="emit('change', s.value)"
    >
      {{ s.label }}
    </button>
  </div>
</template>
```

## Step 9 - Build the View

The view **composes** components and connects them to composables and stores.

```vue
<!-- src/modules/orders/views/OrdersView.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useOrdersStore } from '../stores/orders-store'
import { useOrdersList } from '../composables/useOrdersList'
import { useCancelOrder } from '../composables/useCancelOrder'
import OrdersTable from '../components/OrdersTable.vue'
import OrderStatusFilter from '../components/OrderStatusFilter.vue'

const store = useOrdersStore()
const { currentPage, statusFilter } = storeToRefs(store)

const { items, totalPages, isLoading, isEmpty } = useOrdersList({
  page: currentPage,
  status: statusFilter,
})

const { cancelOrder, isCancelling } = useCancelOrder()
</script>

<template>
  <div class="orders-view">
    <h1>Orders</h1>

    <OrderStatusFilter
      :current-status="statusFilter"
      @change="store.setStatusFilter"
    />

    <OrdersTable
      :orders="items"
      :loading="isLoading || isCancelling"
      @cancel="cancelOrder"
    />

    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="currentPage <= 1" @click="store.setPage(currentPage - 1)">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="store.setPage(currentPage + 1)">
        Next
      </button>
    </div>
  </div>
</template>
```

## Step 10 - Register the Route

```typescript
// src/router/index.ts (add to routes array)
{
  path: '/orders',
  name: 'orders',
  component: () => import('@/modules/orders/views/OrdersView.vue'),
  meta: { title: 'Orders' },
}
```

::: tip Lazy loading
Always use `() => import(...)` for route components. This creates separate chunks and reduces the initial bundle size.
:::

## Step 11 - Create the Barrel Export

```typescript
// src/modules/orders/index.ts

// Public API - only export what other parts of the app need
export type { Order, OrderStatus, Address } from './types/orders.contracts'
export { useOrdersList } from './composables/useOrdersList'
export { useCreateOrder } from './composables/useCreateOrder'
```

## Complete Data Flow

```mermaid
sequenceDiagram
    participant User
    participant View as OrdersView
    participant Store as Pinia Store
    participant Composable as useOrdersList
    participant Service as ordersService
    participant API as REST API
    participant Adapter as ordersAdapter

    User->>View: Navigate to /orders
    View->>Store: storeToRefs(currentPage, statusFilter)
    View->>Composable: useOrdersList({ page, status })
    Composable->>Service: ordersService.list({ page: 1 })
    Service->>API: GET /v2/orders?page=1
    API-->>Service: { data: [...], meta: { total_pages: 5 } }
    Service-->>Composable: raw response
    Composable->>Adapter: ordersAdapter.toOrderList(response)
    Adapter-->>Composable: { items: Order[], totalPages: 5 }
    Composable-->>View: { items, isLoading: false, totalPages }
    View-->>User: Rendered orders table

    User->>View: Click "Shipped" filter
    View->>Store: setStatusFilter('shipped')
    Note over Composable: queryKey changed → auto-refetch
    Composable->>Service: ordersService.list({ page: 1, status: 'shipped' })
    Service->>API: GET /v2/orders?page=1&status=shipped
    API-->>Composable: filtered results
    Composable-->>View: updated items
```

## Using the Agent Instead

You can build all of this automatically:

```bash
"Use @builder to create an orders module with CRUD for GET/POST/PATCH /v2/orders"
```

The agent follows the same steps in this tutorial, reading your `ARCHITECTURE.md` conventions.

## Next Steps

- [Service Layer Tutorial](/tutorials/service-layer) - Deep dive into types + adapter + service
- [Forms Tutorial](/tutorials/forms) - Build a creation form with Zod validation
- [Pagination + Filters](/tutorials/pagination-filters) - Advanced list patterns
