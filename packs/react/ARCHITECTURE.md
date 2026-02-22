# ARCHITECTURE.md -- Architecture & Patterns Guide

> This document is the **source of truth** for all subagents.
> Every architectural decision must be documented here.

---

## 1. Overview

We are migrating / building a React project following a modern, typed, modular architecture:

| From | To |
|------|----|
| JavaScript | TypeScript (strict) |
| Class components | Functional components |
| PropTypes | TypeScript interfaces |
| Redux / raw context | Zustand (client state) + TanStack React Query (server state) |
| Manual fetch / Axios inline | Services + Adapters + TanStack React Query |
| Scattered try/catch | Centralized error handling in hooks (queryFn / onError) |
| Structure by file type | Modular architecture by feature |
| HOCs and render props (legacy) | Custom hooks + composition |
| Inconsistent naming | Strict documented conventions |

### Core Stack

- **React 18+** with functional components
- **TypeScript** (strict mode)
- **Zustand** for client state
- **TanStack React Query** for server state
- **Vite** for build tooling
- **React Router 6** for routing
- **Vitest** + **React Testing Library** for tests

### Data Flow

```
Service (HTTP only) --> Adapter (parse) --> Hook (orchestrate with React Query) --> Component (TSX)
```

---

## 2. Directory Structure (Modular Architecture)

```
src/
+-- app/                          # Application shell
|   +-- App.tsx
|   +-- main.tsx
|   +-- router/
|   |   +-- index.tsx
|   |   +-- guards/
|   +-- providers/                # QueryClient, Zustand, theme, etc.
|
+-- modules/                      # Feature modules (bounded contexts)
|   +-- auth/
|   |   +-- components/
|   |   +-- hooks/
|   |   +-- services/
|   |   +-- adapters/
|   |   +-- stores/
|   |   +-- types/
|   |   +-- pages/
|   |   +-- __tests__/
|   |   +-- index.ts              # Barrel export (public API)
|   |
|   +-- marketplace/
|   |   +-- components/
|   |   |   +-- MarketplaceList.tsx
|   |   |   +-- MarketplaceCard.tsx
|   |   |   +-- MarketplaceFilters.tsx
|   |   |   +-- marketplace-card/          # Sub-components if needed
|   |   |       +-- MarketplaceCardHeader.tsx
|   |   |       +-- MarketplaceCardActions.tsx
|   |   +-- hooks/
|   |   |   +-- useMarketplaceList.ts
|   |   |   +-- useMarketplaceFilters.ts
|   |   +-- services/
|   |   |   +-- marketplace-service.ts
|   |   +-- adapters/
|   |   |   +-- marketplace-adapter.ts
|   |   +-- stores/
|   |   |   +-- marketplace-store.ts       # Client state only (filters, UI)
|   |   +-- types/
|   |   |   +-- marketplace.types.ts
|   |   |   +-- marketplace.contracts.ts   # Zod schemas / app contracts
|   |   +-- pages/
|   |   |   +-- MarketplacePage.tsx
|   |   +-- __tests__/
|   |   +-- index.ts
|   |
|   +-- [other-module]/
|
+-- shared/                       # Shared across modules
|   +-- components/               # Generic components (Button, Modal, Table)
|   +-- hooks/                    # Shared hooks
|   +-- services/                 # Base API client, interceptors
|   +-- adapters/                 # Shared adapters
|   +-- types/                    # Global types
|   +-- utils/                    # Pure functions, no side effects
|   +-- helpers/                  # Functions with side effects or DOM
|   +-- constants/                # Static values
|   +-- providers/                # React context providers
|
+-- assets/                       # Static assets (images, fonts, global CSS)
```

### Import Rules Between Layers

```
modules/auth  <->  shared/          OK  Module imports from shared
modules/auth  -->  modules/market   NO  Module does NOT import from another module
shared/       -->  modules/auth     NO  Shared does NOT import from modules
app/          -->  modules/*        OK  App imports modules (router, providers)
```

If two modules need to share something, move it to `shared/`.

---

## 3. Naming Conventions

### Files and Directories

| Type | Pattern | Example |
|------|---------|---------|
| Directories | `kebab-case` | `user-settings/` |
| Components | `PascalCase.tsx` | `UserSettingsForm.tsx` |
| Pages | `PascalCase + Page.tsx` | `MarketplacePage.tsx` |
| Hooks | `use + PascalCase.ts` | `useMarketplaceList.ts` |
| Services | `kebab-case-service.ts` | `marketplace-service.ts` |
| Adapters | `kebab-case-adapter.ts` | `marketplace-adapter.ts` |
| Stores | `kebab-case-store.ts` | `marketplace-store.ts` |
| Types | `kebab-case.types.ts` | `marketplace.types.ts` |
| Contracts/Schemas | `kebab-case.contracts.ts` | `marketplace.contracts.ts` |
| Utils | `kebab-case.ts` | `format-date.ts` |
| Helpers | `kebab-case.ts` | `clipboard-helper.ts` |
| Tests | `OriginalName.spec.ts(x)` | `MarketplaceList.spec.tsx` |
| Constants | `kebab-case.constants.ts` | `api-endpoints.constants.ts` |

### Code

| Type | Pattern | Example |
|------|---------|---------|
| Variables / functions | `camelCase` | `getUserById`, `isLoading` |
| Types / Interfaces | `PascalCase` | `UserProfile`, `MarketplaceItem` |
| Enums | `PascalCase` | `UserRole.Admin` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |
| Hooks | `use` + `PascalCase` | `useAuth`, `useMarketplaceList` |
| Store hooks | `use` + `PascalCase` + `Store` | `useMarketplaceStore` |
| Query Keys | `camelCase` array | `['marketplace', 'list', { page }]` |
| Event handlers | `handle` + action | `handleSubmit`, `handleDelete` |
| Callback props | `on` + action | `onSelect`, `onChange` |
| Boolean | `is`/`has`/`can`/`should` | `isLoading`, `hasPermission` |

---

## 4. Responsibility Layers

### 4.1 Services -- Pure HTTP Requests

Services make **only** the HTTP request. No try/catch, no transformation, no business logic.

```typescript
// services/marketplace-service.ts
import { api } from '@/shared/services/api-client'
import type {
  MarketplaceListResponse,
  MarketplaceItemResponse,
  CreateMarketplacePayload,
} from '../types/marketplace.types'

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

**Service Rules:**
- NO try/catch (caller handles errors)
- NO data transformation (adapter does that)
- NO business logic
- NO store or hook access
- YES HTTP calls with typed request/response
- YES one file per domain/resource
- YES export as object with methods

### 4.2 Adapters -- Contract Parsers

Adapters transform API data to the application's TypeScript contract (and vice-versa). They are **pure functions** with no side effects.

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

**Adapter Rules:**
- YES pure functions (input -> output, no side effects)
- YES two directions: API->App (inbound) and App->API (outbound)
- YES rename fields (snake_case API -> camelCase App)
- YES convert types (string->Date, cents->decimal, status->boolean)
- NO HTTP calls
- NO store/hook access
- NO try/catch (failure = wrong type = bug to fix)

### 4.3 Types & Contracts

```typescript
// types/marketplace.types.ts
// <-- Types that mirror the API exactly as it returns (snake_case)

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

export interface CreateMarketplacePayload {
  name: string
  vendor_name: string
  category_slug: string
  price_cents: number
}

// types/marketplace.contracts.ts
// <-- Application contracts (camelCase, correct types)

export interface MarketplaceItem {
  id: string
  name: string
  vendor: string
  category: string
  price: number          // in currency, not cents
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

### 4.4 Hooks -- Business Logic + Orchestration

Custom hooks connect everything: call service, pass through adapter, manage loading/error, and expose data.

```typescript
// hooks/useMarketplaceList.ts
import { useMemo } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { marketplaceService } from '../services/marketplace-service'
import { marketplaceAdapter } from '../adapters/marketplace-adapter'
import type { MarketplaceList } from '../types/marketplace.contracts'

interface UseMarketplaceListOptions {
  page: number
  pageSize?: number
  search?: string
}

export function useMarketplaceList(options: UseMarketplaceListOptions) {
  const { page, pageSize = 20, search = '' } = options

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['marketplace', 'list', { page, pageSize, search }],
    queryFn: async () => {
      const response = await marketplaceService.list({
        page,
        pageSize,
        search,
      })
      return marketplaceAdapter.toMarketplaceList(response.data)
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  const items = data?.items ?? []
  const totalPages = data?.totalPages ?? 0
  const isEmpty = !isLoading && items.length === 0

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

**Hook for Mutations:**

```typescript
// hooks/useDeleteMarketplaceItem.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { marketplaceService } from '../services/marketplace-service'

export function useDeleteMarketplaceItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => marketplaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] })
    },
    onError: (error) => {
      // handle error (toast, etc.)
      console.error('Failed to delete item:', error)
    },
  })
}
```

**Hook Rules:**
- YES orchestrate: service -> adapter -> React Query
- YES manage loading, error, empty states
- YES return derived data (useMemo for expensive computations)
- YES prefix with `use`
- YES typed return values
- NO JSX/rendering (that belongs to component)
- NO direct API access (service does that)

### 4.5 Zustand Stores -- Client State Only

Zustand is for state that **does not come from the server**: UI state, filters, preferences, auth.

```typescript
// stores/marketplace-store.ts
import { create } from 'zustand'

interface MarketplaceStoreState {
  selectedCategory: string | null
  viewMode: 'grid' | 'list'
  searchQuery: string
}

interface MarketplaceStoreActions {
  setCategory: (category: string | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
  hasActiveFilters: () => boolean
}

type MarketplaceStore = MarketplaceStoreState & MarketplaceStoreActions

export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
  // State
  selectedCategory: null,
  viewMode: 'grid',
  searchQuery: '',

  // Actions
  setCategory: (category) => set({ selectedCategory: category }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  clearFilters: () =>
    set({
      selectedCategory: null,
      searchQuery: '',
    }),

  hasActiveFilters: () => {
    const state = get()
    return !!state.selectedCategory || !!state.searchQuery
  },
}))
```

**Zustand Store with Selectors (performance):**

```typescript
// In components, use selectors to avoid unnecessary re-renders:
const searchQuery = useMarketplaceStore((state) => state.searchQuery)
const setSearchQuery = useMarketplaceStore((state) => state.setSearchQuery)

// AVOID destructuring the entire store:
// const { searchQuery, setSearchQuery } = useMarketplaceStore() // BAD: re-renders on any change
```

**Store Rules:**
- YES client state only (UI, filters, preferences, session)
- YES use Zustand `create` with typed state and actions
- YES selectors in components (avoid full store destructure)
- YES separate state interface from actions interface
- NO server state (API data goes in TanStack React Query)
- NO HTTP calls inside stores
- NO complex business logic (hooks do that)

---

## 5. React Components -- Composition Patterns

### 5.1 Functional Component Pattern

```tsx
// components/MarketplaceList.tsx
import { useState, useMemo, useCallback } from 'react'
import { useMarketplaceList } from '../hooks/useMarketplaceList'
import { useMarketplaceStore } from '../stores/marketplace-store'
import { MarketplaceCard } from './MarketplaceCard'
import type { MarketplaceItem } from '../types/marketplace.contracts'

interface MarketplaceListProps {
  categoryFilter?: string
  onSelect: (item: MarketplaceItem) => void
}

export function MarketplaceList({ categoryFilter, onSelect }: MarketplaceListProps) {
  // 1. Stores (with selectors)
  const searchQuery = useMarketplaceStore((s) => s.searchQuery)
  const viewMode = useMarketplaceStore((s) => s.viewMode)

  // 2. Hooks
  const [page, setPage] = useState(1)
  const { items, totalPages, isLoading, isEmpty } = useMarketplaceList({
    page,
    search: searchQuery,
  })

  // 3. Local state
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 4. Derived state (useMemo)
  const isFirstPage = useMemo(() => page === 1, [page])

  // 5. Handlers (useCallback for stable references)
  const handleSelect = useCallback(
    (item: MarketplaceItem) => {
      setSelectedId(item.id)
      onSelect(item)
    },
    [onSelect],
  )

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  // 6. Render
  if (isLoading) return <div>Loading...</div>
  if (isEmpty) return <div>No items found</div>

  return (
    <div>
      {items.map((item) => (
        <MarketplaceCard
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onSelect={handleSelect}
        />
      ))}
    </div>
  )
}
```

### 5.2 Stop Prop Drilling -- Component Composition

**BAD -- Prop Drilling:**
```tsx
// GrandParent passes props through 3 levels
<Parent user={user} theme={theme} permissions={permissions}>
  <Child user={user} theme={theme} permissions={permissions}>
    <GrandChild user={user} permissions={permissions} />
  </Child>
</Parent>
```

**GOOD -- Composition with children / render props:**
```tsx
// MarketplacePage.tsx (Page)
export function MarketplacePage() {
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)

  return (
    <PageLayout
      header={<MarketplaceFilters />}
      sidebar={
        selectedItem ? <MarketplaceDetails item={selectedItem} /> : null
      }
    >
      <MarketplaceList
        onSelect={setSelectedItem}
        renderCard={(item) => <MarketplaceCard item={item} />}
        renderEmpty={() => <EmptyState message="No items found" />}
      />
    </PageLayout>
  )
}
```

**GOOD -- React Context for shared state:**
```tsx
// hooks/useMarketplaceContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { MarketplaceItem } from '../types/marketplace.contracts'

interface MarketplaceContextValue {
  selectedItem: MarketplaceItem | null
  selectItem: (item: MarketplaceItem) => void
  clearSelection: () => void
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)

  const selectItem = useCallback((item: MarketplaceItem) => {
    setSelectedItem(item)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedItem(null)
  }, [])

  return (
    <MarketplaceContext.Provider value={{ selectedItem, selectItem, clearSelection }}>
      {children}
    </MarketplaceContext.Provider>
  )
}

export function useMarketplaceContext() {
  const context = useContext(MarketplaceContext)
  if (!context) {
    throw new Error('useMarketplaceContext must be used within MarketplaceProvider')
  }
  return context
}
```

### 5.3 Component Hierarchy

```
Pages                 --> Composition, orchestration, provide context
  +-- Layout          --> Visual structure (slots via props/children)
      +-- Features    --> Feature logic (hooks, stores)
          +-- Shared  --> Pure presentation (props in, callbacks out)
```

| Type | Responsibility | Can have logic? | Can have state? |
|------|---------------|-----------------|-----------------|
| **Pages** | Compose components, provide context | Via hooks | Yes (hooks) |
| **Feature Components** | UI + feature logic | Via hooks | Yes (hooks) |
| **Shared Components** | Generic, reusable UI | Minimal (UI only) | Minimal (local) |

### 5.4 Component Props Patterns

```tsx
// Typed props interface
interface UserCardProps {
  name: string
  avatarUrl: string
  role: 'admin' | 'user'
  onEdit?: () => void
}

// children prop
interface LayoutProps {
  children: ReactNode
}

// Render prop pattern
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
  renderEmpty?: () => ReactNode
}

// Forwarding refs
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...rest }, ref) => (
    <div>
      {label && <label>{label}</label>}
      <input ref={ref} {...rest} />
      {error && <span>{error}</span>}
    </div>
  ),
)
```

---

## 6. Utils vs Helpers

### Utils -- Pure Functions
- No side effects
- Deterministic input -> output
- Testable without mocks
- No dependency on DOM, browser APIs, or React

```typescript
// shared/utils/format-date.ts
export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale).format(date)
}

// shared/utils/currency.ts
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

// shared/utils/string.ts
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}
```

### Helpers -- Functions with Side Effects or DOM
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

// shared/helpers/storage-helper.ts
export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}
```

---

## 7. Error Handling -- Centralized Pattern

### In the Hook Layer (queryFn / onError)

```typescript
// Mutations handle errors via onError callback
const { mutate: deleteItem } = useMutation({
  mutationFn: (id: string) => marketplaceService.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['marketplace'] })
    toast.success('Item removed successfully')
  },
  onError: (error) => {
    toast.error(parseApiError(error))
  },
})
```

### Centralized Error Parser

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
    if (error.response?.status === 403) return 'Permission denied'
    if (error.response?.status === 404) return 'Resource not found'
    if (error.response?.status === 500) return 'Internal server error'
  }
  return 'Unexpected error. Please try again.'
}
```

### Global Interceptor (API Client)

```typescript
// shared/services/api-client.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log and redirect on 401 (session expired)
    if (error.response?.status === 401) {
      // redirect to login
    }
    // DO NOT handle other errors here -- let the caller handle them
    return Promise.reject(error)
  },
)
```

### Error Boundary (React-specific)

```tsx
// shared/components/ErrorBoundary.tsx
import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  fallback: ReactNode | ((error: Error) => ReactNode)
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      const { fallback } = this.props
      return typeof fallback === 'function'
        ? fallback(this.state.error)
        : fallback
    }
    return this.props.children
  }
}
```

---

## 8. Barrel Exports (index.ts)

Each module exports only its **public API**:

```typescript
// modules/marketplace/index.ts

// Pages (for the router)
export { MarketplacePage } from './pages/MarketplacePage'

// Components reusable by others (rare, avoid)
export { MarketplaceCard } from './components/MarketplaceCard'

// Types (for consumers that need typing)
export type { MarketplaceItem, MarketplaceList } from './types/marketplace.contracts'

// DO NOT export:
// - services (internal detail)
// - adapters (internal detail)
// - stores (use via hooks)
// - internal hooks
```

---

## 9. SOLID Principles Applied to React

| Principle | React Application |
|-----------|------------------|
| **S**ingle Responsibility | 1 component = 1 responsibility. 1 hook = 1 domain. 1 service = 1 resource. |
| **O**pen/Closed | Components extensible via children, render props, and composition -- not by internal modification. |
| **L**iskov Substitution | Shared components must work in any context without breaking. |
| **I**nterface Segregation | Specific props, not generic objects. `<UserAvatar src={src} alt={alt} />` not `<UserAvatar user={user} />`. |
| **D**ependency Inversion | Hooks depend on interfaces (types), not implementations. Services consumed via hooks, not imported directly in components. |

### SOLID Examples

**Single Responsibility:**
```tsx
// BAD: component doing too much
function UserDashboard() {
  // fetching data, filtering, rendering chart, rendering table, handling forms...
}

// GOOD: composed from focused components
function UserDashboard() {
  return (
    <DashboardLayout>
      <UserStats />
      <UserActivityChart />
      <UserTable />
    </DashboardLayout>
  )
}
```

**Open/Closed:**
```tsx
// GOOD: extensible via render props and children
interface DataTableProps<T> {
  items: T[]
  renderRow: (item: T) => ReactNode
  renderEmpty?: () => ReactNode
  renderHeader?: () => ReactNode
}

function DataTable<T>({ items, renderRow, renderEmpty, renderHeader }: DataTableProps<T>) {
  if (items.length === 0 && renderEmpty) return renderEmpty()
  return (
    <table>
      {renderHeader && <thead>{renderHeader()}</thead>}
      <tbody>{items.map(renderRow)}</tbody>
    </table>
  )
}
```

**Interface Segregation:**
```tsx
// BAD: passing entire object when only a few fields are needed
interface AvatarProps {
  user: User  // component only uses name and avatarUrl
}

// GOOD: specific props
interface AvatarProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}
```

---

## 10. Migration Checklist per File

### Component (.tsx)
- [ ] Functional component (no class)
- [ ] Props typed via interface
- [ ] Callback props typed (`onSelect`, `onChange`)
- [ ] No prop drilling (use composition / context)
- [ ] < 200 lines total
- [ ] JSX < 100 lines
- [ ] No business logic in JSX
- [ ] Loading / error / empty states
- [ ] No `dangerouslySetInnerHTML` or with sanitization
- [ ] `useCallback` for handlers passed to children
- [ ] `useMemo` for expensive derived state

### Hook
- [ ] `use` prefix
- [ ] Typed return value
- [ ] Uses service + adapter (never direct API)
- [ ] TanStack React Query for server state
- [ ] Error handling via onError in query/mutation
- [ ] staleTime set for queries

### Service
- [ ] HTTP calls only
- [ ] No try/catch
- [ ] No data transformation
- [ ] Typed request and response

### Adapter
- [ ] Pure functions
- [ ] Inbound (API->App) and Outbound (App->API)
- [ ] Naming conversion (snake_case -> camelCase)
- [ ] Type conversion (string->Date, etc.)

### Zustand Store
- [ ] Client state only
- [ ] Typed state and actions interfaces
- [ ] Selectors used in components (no full destructure)
- [ ] No HTTP calls

### Types
- [ ] `.types.ts` for API types (raw response)
- [ ] `.contracts.ts` for application contracts
- [ ] No `any`
- [ ] No PropTypes (use TypeScript interfaces)
