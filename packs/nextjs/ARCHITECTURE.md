# ARCHITECTURE.md -- Architecture & Patterns Guide (Next.js)

> This document is the **source of truth** for all subagents.
> Every architectural decision must be documented here.

---

## 1. Overview

Architecture for Next.js 14+ projects using the App Router, TypeScript strict mode, and a modular feature-based structure:

| Concept | Implementation |
|---------|---------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| Server rendering | React Server Components (default) |
| Client interactivity | Client Components (`'use client'`) |
| Mutations | Server Actions (`'use server'`) |
| Client state | Zustand |
| Server state (client-side) | TanStack React Query |
| Data fetching (server) | async Server Components / Server Actions |
| Routing | App Router file-system conventions |
| Testing | Vitest + React Testing Library |
| Validation | Zod |

### Architecture Flow

```
Service (HTTP only) --> Adapter (parse) --> Hook / Server Action (orchestrate) --> Component / Page / Layout (RSC + Client)
```

---

## 2. Directory Structure (Modular Architecture)

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (RSC)
│   ├── page.tsx                      # Home page
│   ├── loading.tsx                   # Root loading UI
│   ├── error.tsx                     # Root error boundary ('use client')
│   ├── not-found.tsx                 # 404 page
│   ├── providers.tsx                 # Client providers (QueryClient, Zustand, Theme)
│   ├── globals.css
│   │
│   ├── [feature]/                    # Feature route group
│   │   ├── page.tsx                  # Feature page (RSC)
│   │   ├── layout.tsx                # Feature layout (RSC)
│   │   ├── loading.tsx               # Feature loading skeleton
│   │   ├── error.tsx                 # Feature error boundary ('use client')
│   │   └── not-found.tsx             # Feature 404
│   │
│   └── api/                          # Route Handlers (external API endpoints)
│       └── [resource]/
│           └── route.ts              # GET, POST, PUT, DELETE handlers
│
├── modules/                          # Feature modules (bounded contexts)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── adapters/
│   │   ├── stores/
│   │   ├── actions/
│   │   ├── types/
│   │   ├── __tests__/
│   │   └── index.ts                  # Barrel export (public API)
│   │
│   ├── marketplace/
│   │   ├── components/
│   │   │   ├── MarketplaceList.tsx
│   │   │   ├── MarketplaceCard.tsx
│   │   │   ├── MarketplaceFilters.tsx
│   │   │   └── marketplace-card/     # Sub-components if needed
│   │   │       ├── MarketplaceCardHeader.tsx
│   │   │       └── MarketplaceCardActions.tsx
│   │   ├── hooks/
│   │   │   ├── useMarketplaceList.ts
│   │   │   └── useMarketplaceFilters.ts
│   │   ├── services/
│   │   │   └── marketplace-service.ts
│   │   ├── adapters/
│   │   │   └── marketplace-adapter.ts
│   │   ├── stores/
│   │   │   └── marketplace-store.ts  # Client state only (filters, UI)
│   │   ├── actions/
│   │   │   └── marketplace-actions.ts  # Server Actions ('use server')
│   │   ├── types/
│   │   │   ├── marketplace.types.ts
│   │   │   └── marketplace.contracts.ts  # Zod schemas
│   │   ├── __tests__/
│   │   └── index.ts
│   │
│   └── [other-module]/
│
├── shared/                           # Shared across modules
│   ├── components/                   # Generic components (Button, Modal, Table)
│   ├── hooks/                        # Shared hooks
│   ├── services/                     # Base API client, interceptors
│   ├── adapters/                     # Shared adapters
│   ├── types/                        # Global types
│   ├── utils/                        # Pure functions, no side effects
│   ├── helpers/                      # Functions with side effects or DOM
│   ├── constants/                    # Static values
│   └── providers/                    # React context providers
│
└── assets/                           # Static files (images, fonts, global CSS)
```

### Import Rules Between Layers

```
modules/auth  <->  shared/          OK  Module imports from shared
modules/auth  -->  modules/market   NO  Module MUST NOT import from another module
shared/       -->  modules/auth     NO  Shared MUST NOT import from modules
app/          -->  modules/*        OK  App imports modules (pages, layouts)
```

If two modules need to share something, move it to `shared/`.

---

## 3. Naming Conventions

### Files & Directories

| Type | Pattern | Example |
|------|---------|---------|
| Directories | `kebab-case` | `user-settings/` |
| Components (TSX) | `PascalCase.tsx` | `UserSettingsForm.tsx` |
| Pages | `page.tsx` (App Router) | `app/marketplace/page.tsx` |
| Layouts | `layout.tsx` (App Router) | `app/marketplace/layout.tsx` |
| Hooks | `use` + `PascalCase.ts` | `useMarketplaceList.ts` |
| Services | `kebab-case-service.ts` | `marketplace-service.ts` |
| Adapters | `kebab-case-adapter.ts` | `marketplace-adapter.ts` |
| Stores (Zustand) | `kebab-case-store.ts` | `marketplace-store.ts` |
| Actions | `kebab-case-actions.ts` | `marketplace-actions.ts` |
| Types | `kebab-case.types.ts` | `marketplace.types.ts` |
| Contracts/Schemas | `kebab-case.contracts.ts` | `marketplace.contracts.ts` |
| Utils | `kebab-case.ts` | `format-date.ts` |
| Helpers | `kebab-case.ts` | `clipboard-helper.ts` |
| Tests | `OriginalName.spec.ts(x)` | `MarketplaceList.spec.tsx` |
| Constants | `kebab-case.constants.ts` | `api-endpoints.constants.ts` |
| Route Handlers | `route.ts` | `app/api/marketplace/route.ts` |

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
| Server Actions | `camelCase` + verb | `createMarketplaceItem`, `deleteItem` |
| Boolean | `is`/`has`/`can`/`should` | `isLoading`, `hasPermission` |

---

## 4. Responsibility Layers

### 4.1 Services -- Pure HTTP Calls

Services make **only** the HTTP request. No try/catch, no transformation, no business logic.

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

**Service Rules:**
- NO try/catch (caller handles errors)
- NO data transformation (adapter does that)
- NO business logic
- NO access to stores or hooks
- YES typed request/response
- YES one file per domain/resource
- YES export as object with methods
- Usable in both Server Components and Client Components

### 4.2 Adapters -- Contract Parsers

Adapters transform API data to the application TypeScript contract (and vice-versa). They are **pure functions** with no side effects.

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
- YES bidirectional: API->App (inbound) and App->API (outbound)
- YES rename fields (snake_case API -> camelCase App)
- YES convert types (string->Date, cents->decimal, status->boolean)
- NO HTTP calls
- NO access to stores/hooks
- NO try/catch (failure = wrong type = bug to fix)

### 4.3 Types & Contracts

```typescript
// types/marketplace.types.ts
// Types that mirror the API response exactly (snake_case)

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
// Application contracts (camelCase, correct types)

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

### 4.4 Hooks -- Business Logic + Orchestration (Client Only)

Hooks connect everything: call service, pass through adapter, manage loading/error, and expose reactive state. **Hooks can only be used in Client Components.**

```typescript
// hooks/useMarketplaceList.ts
'use client'

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

  const query = useQuery({
    queryKey: ['marketplace', 'list', { page, pageSize, search }],
    queryFn: async (): Promise<MarketplaceList> => {
      const response = await marketplaceService.list({ page, pageSize, search })
      return marketplaceAdapter.toMarketplaceList(response.data)
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  return {
    // Data
    items: query.data?.items ?? [],
    totalPages: query.data?.totalPages ?? 0,
    // State
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isEmpty: !query.isLoading && (query.data?.items.length ?? 0) === 0,
    error: query.error,
    // Actions
    refetch: query.refetch,
  }
}
```

**Hook Rules:**
- YES orchestrate: service -> adapter -> React Query
- YES manage loading, error, empty states
- YES prefix `use`
- YES typed return values
- YES `'use client'` if using React hooks (useState, useEffect, useQuery)
- NO rendering (that is the component's job)
- NO direct API access (service does that)

### 4.5 Zustand Stores -- Client State Only

Zustand is for state that **does not come from the server**: UI state, filters, preferences, auth tokens.

```typescript
// stores/marketplace-store.ts
import { create } from 'zustand'

interface MarketplaceState {
  // State
  selectedCategory: string | null
  viewMode: 'grid' | 'list'
  searchQuery: string
  // Derived
  hasActiveFilters: boolean
  // Actions
  setCategory: (category: string | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setSearchQuery: (query: string) => void
  clearFilters: () => void
}

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  // State
  selectedCategory: null,
  viewMode: 'grid',
  searchQuery: '',

  // Derived (computed via get())
  get hasActiveFilters() {
    const state = get()
    return !!state.selectedCategory || !!state.searchQuery
  },

  // Actions
  setCategory: (category) => set({ selectedCategory: category }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () => set({ selectedCategory: null, searchQuery: '' }),
}))
```

**Store Rules:**
- YES client state only (UI, filters, preferences, session)
- YES `create<T>()` from Zustand
- YES selectors for granular subscriptions in components
- YES actions co-located with state
- NO server state (API data goes in TanStack React Query)
- NO HTTP calls inside stores
- NO complex business logic (hook does that)

### 4.6 Server Actions -- Server-Side Mutations

Server Actions handle mutations that run on the server. They replace API routes for form submissions and data mutations.

```typescript
// actions/marketplace-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { marketplaceService } from '../services/marketplace-service'
import { marketplaceAdapter } from '../adapters/marketplace-adapter'
import type { CreateMarketplaceInput } from '../types/marketplace.contracts'

export async function createMarketplaceItem(input: CreateMarketplaceInput) {
  const payload = marketplaceAdapter.toCreatePayload(input)
  const response = await marketplaceService.create(payload)
  const item = marketplaceAdapter.toMarketplaceItem(response.data)

  revalidatePath('/marketplace')
  return item
}

export async function deleteMarketplaceItem(id: string) {
  await marketplaceService.delete(id)
  revalidatePath('/marketplace')
}
```

**Server Action Rules:**
- YES `'use server'` directive at the top of the file
- YES use service + adapter (same as hooks)
- YES `revalidatePath()` or `revalidateTag()` after mutations
- YES can be called from Client Components via forms or event handlers
- YES can be called from Server Components via forms
- NO direct database access (use service layer)
- NO returning non-serializable data (no Date objects, no functions)

### 4.7 Route Handlers -- External API Endpoints

Route Handlers are for external API endpoints (webhooks, third-party integrations, public APIs).

```typescript
// app/api/marketplace/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { marketplaceService } from '@/modules/marketplace/services/marketplace-service'
import { marketplaceAdapter } from '@/modules/marketplace/adapters/marketplace-adapter'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('pageSize') ?? 20)

  const response = await marketplaceService.list({ page, pageSize })
  const data = marketplaceAdapter.toMarketplaceList(response.data)

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const response = await marketplaceService.create(body)
  const item = marketplaceAdapter.toMarketplaceItem(response.data)

  return NextResponse.json(item, { status: 201 })
}
```

**Route Handler Rules:**
- YES use for external APIs, webhooks, third-party callbacks
- YES use service + adapter layers
- YES proper HTTP status codes
- NO use for internal app mutations (use Server Actions instead)
- NO business logic (service/adapter handle that)

---

## 5. Server Components vs Client Components

### 5.1 Decision Tree

```
Does the component need...
├── useState, useEffect, useRef, event handlers (onClick, onChange)?
│   └── YES -> Client Component ('use client')
│
├── React Query (useQuery, useMutation)?
│   └── YES -> Client Component ('use client')
│
├── Zustand store (useXxxStore)?
│   └── YES -> Client Component ('use client')
│
├── Browser APIs (window, document, localStorage)?
│   └── YES -> Client Component ('use client')
│
├── Only fetching data and rendering?
│   └── YES -> Server Component (default, no directive)
│
└── Only composing other components with no interactivity?
    └── YES -> Server Component (default, no directive)
```

### 5.2 Server Component Pattern (Default)

Server Components are the default in Next.js App Router. They run only on the server and can be async.

```tsx
// app/marketplace/page.tsx (Server Component -- NO directive needed)
import { marketplaceService } from '@/modules/marketplace/services/marketplace-service'
import { marketplaceAdapter } from '@/modules/marketplace/adapters/marketplace-adapter'
import { MarketplaceList } from '@/modules/marketplace/components/MarketplaceList'

export default async function MarketplacePage() {
  const response = await marketplaceService.list({ page: 1, pageSize: 20 })
  const data = marketplaceAdapter.toMarketplaceList(response.data)

  return (
    <main>
      <h1>Marketplace</h1>
      <MarketplaceList initialData={data} />
    </main>
  )
}
```

**Server Component Rules:**
- NO `'use client'` directive
- NO hooks (useState, useEffect, useRef, useContext)
- NO event handlers (onClick, onChange, onSubmit)
- NO browser APIs (window, document, localStorage)
- YES async/await directly in the component
- YES direct service calls for data fetching
- YES importing Client Components (they render on client)
- YES passing serializable props to Client Components

### 5.3 Client Component Pattern

Client Components opt into client-side rendering with the `'use client'` directive.

```tsx
// components/MarketplaceList.tsx
'use client'

import { useState } from 'react'
import { useMarketplaceList } from '../hooks/useMarketplaceList'
import { useMarketplaceStore } from '../stores/marketplace-store'
import { MarketplaceCard } from './MarketplaceCard'
import type { MarketplaceItem } from '../types/marketplace.contracts'

interface MarketplaceListProps {
  initialData?: MarketplaceItem[]
}

export function MarketplaceList({ initialData }: MarketplaceListProps) {
  const [page, setPage] = useState(1)
  const { searchQuery } = useMarketplaceStore()
  const { items, totalPages, isLoading, isEmpty } = useMarketplaceList({
    page,
    search: searchQuery,
  })

  const displayItems = items.length > 0 ? items : (initialData ?? [])

  if (isLoading) return <div>Loading...</div>
  if (isEmpty) return <div>No items found</div>

  return (
    <div>
      {displayItems.map((item) => (
        <MarketplaceCard key={item.id} item={item} />
      ))}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
```

**Client Component Rules:**
- YES `'use client'` directive at the top of the file
- YES hooks (useState, useEffect, useRef, custom hooks)
- YES event handlers (onClick, onChange, onSubmit)
- YES browser APIs
- NO async component functions
- NO direct service calls for initial data (use hooks or receive via props)

### 5.4 Composition Pattern -- Server + Client

```tsx
// app/marketplace/page.tsx (Server Component)
import { marketplaceService } from '@/modules/marketplace/services/marketplace-service'
import { marketplaceAdapter } from '@/modules/marketplace/adapters/marketplace-adapter'
import { MarketplaceFilters } from '@/modules/marketplace/components/MarketplaceFilters'
import { MarketplaceList } from '@/modules/marketplace/components/MarketplaceList'

export default async function MarketplacePage() {
  // Server-side data fetching
  const response = await marketplaceService.list({ page: 1, pageSize: 20 })
  const data = marketplaceAdapter.toMarketplaceList(response.data)

  return (
    <main>
      <h1>Marketplace</h1>
      {/* Client Component for interactivity */}
      <MarketplaceFilters />
      {/* Client Component with server-fetched initial data */}
      <MarketplaceList initialData={data.items} />
    </main>
  )
}
```

### 5.5 Component Hierarchy

```
Pages (Server Components)     -> Data fetching, composition, metadata
  |-- Layouts (Server)        -> Shared structure, navigation
      |-- Feature Components  -> Business logic (Client or Server)
          |-- Shared          -> Presentation (props in, callbacks out)
```

| Type | Responsibility | Server or Client? | Can have hooks? |
|------|---------------|-------------------|-----------------|
| **Pages** | Fetch data, compose components, metadata | Server (default) | No |
| **Layouts** | Shared structure, providers | Server (default) | No |
| **Feature Components** | Business logic + UI | Client (usually) | Yes |
| **Shared Components** | Generic, reusable UI | Either | If Client |

---

## 6. App Router Conventions

### 6.1 File Conventions

| File | Purpose | Server/Client |
|------|---------|---------------|
| `page.tsx` | Route UI | Server (default) |
| `layout.tsx` | Shared layout (persists across navigations) | Server (default) |
| `loading.tsx` | Loading skeleton (Suspense boundary) | Server |
| `error.tsx` | Error boundary | Client (`'use client'` required) |
| `not-found.tsx` | 404 page | Server |
| `route.ts` | API route handler | Server |
| `template.tsx` | Re-rendered layout (no state persistence) | Server |
| `default.tsx` | Parallel route fallback | Server |

### 6.2 Metadata

```tsx
// Static metadata
export const metadata = {
  title: 'Marketplace',
  description: 'Browse our marketplace',
}

// Dynamic metadata
export async function generateMetadata({ params }: Props) {
  const item = await getItem(params.id)
  return {
    title: item.name,
    description: item.description,
  }
}
```

### 6.3 Loading & Error Patterns

```tsx
// app/marketplace/loading.tsx (Server Component)
export default function MarketplaceLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  )
}

// app/marketplace/error.tsx (Client Component -- REQUIRED)
'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MarketplaceError({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### 6.4 Dynamic Routes

```tsx
// app/marketplace/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MarketplaceDetailPage({ params }: PageProps) {
  const { id } = await params
  const response = await marketplaceService.getById(id)
  const item = marketplaceAdapter.toMarketplaceItem(response.data)

  return <MarketplaceDetail item={item} />
}

// Generate static params for SSG
export async function generateStaticParams() {
  const response = await marketplaceService.list({ page: 1, pageSize: 100 })
  return response.data.results.map((item) => ({
    id: item.uuid,
  }))
}
```

---

## 7. Utils vs Helpers

### Utils -- Pure Functions
- No side effects
- Input -> Output deterministic
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

// shared/helpers/storage-helper.ts
export function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
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
```

---

## 8. Error Handling -- Centralized Pattern

### In the Hook Layer (React Query)

```typescript
// Error handling stays in onError of mutations
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

### In Server Actions

```typescript
// actions/marketplace-actions.ts
'use server'

import { parseApiError } from '@/shared/utils/parse-api-error'

export async function createMarketplaceItem(input: CreateMarketplaceInput) {
  try {
    const payload = marketplaceAdapter.toCreatePayload(input)
    const response = await marketplaceService.create(payload)
    const item = marketplaceAdapter.toMarketplaceItem(response.data)
    revalidatePath('/marketplace')
    return { success: true, data: item }
  } catch (error) {
    return { success: false, error: parseApiError(error) }
  }
}
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

### Global Error Boundary (App Router)

```tsx
// app/error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### API Client with Interceptor

```typescript
// shared/services/api-client.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log and redirect on 401 (session expired)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    // DO NOT handle other errors here -- let the caller handle them
    return Promise.reject(error)
  },
)
```

---

## 9. Barrel Exports (index.ts)

Each module exports only its **public API**:

```typescript
// modules/marketplace/index.ts

// Components (for use in pages)
export { MarketplaceList } from './components/MarketplaceList'
export { MarketplaceCard } from './components/MarketplaceCard'

// Hooks (for client-side usage)
export { useMarketplaceList } from './hooks/useMarketplaceList'

// Actions (for server-side mutations)
export { createMarketplaceItem, deleteMarketplaceItem } from './actions/marketplace-actions'

// Types (for consumers that need typing)
export type { MarketplaceItem, MarketplaceList as MarketplaceListType } from './types/marketplace.contracts'

// DO NOT export:
// - services (internal detail)
// - adapters (internal detail)
// - stores (use via hooks)
// - internal hooks
```

---

## 10. SOLID Principles Applied to Next.js

| Principle | Application in Next.js |
|-----------|----------------------|
| **S**ingle Responsibility | 1 component = 1 responsibility. 1 hook = 1 domain. 1 service = 1 resource. Server Components fetch, Client Components interact. |
| **O**pen/Closed | Components extensible via props and children, not by internal modification. Use composition over inheritance. |
| **L**iskov Substitution | Shared components must work in any context without breaking. Server and Client components interchangeable where directives allow. |
| **I**nterface Segregation | Specific props, not generic objects. `<UserAvatar src={src} alt={alt} />` not `<UserAvatar user={user} />`. |
| **D**ependency Inversion | Hooks depend on interfaces (types), not implementations. Services injected via hooks/actions, not imported directly in components. |

---

## 11. Migration Checklist Per File

### Page / Layout (App Router)
- [ ] Server Component by default (no `'use client'`)
- [ ] Async if fetching data
- [ ] `metadata` or `generateMetadata()` for SEO
- [ ] Proper `loading.tsx` sibling
- [ ] Proper `error.tsx` sibling (`'use client'`)
- [ ] Uses service + adapter for data fetching
- [ ] Passes serializable props to Client Components

### Client Component (.tsx)
- [ ] `'use client'` directive at the top
- [ ] Typed props interface
- [ ] < 200 lines total
- [ ] JSX < 100 lines
- [ ] No business logic in JSX
- [ ] Loading / error / empty states handled
- [ ] No `dangerouslySetInnerHTML` or with sanitization

### Hook
- [ ] Prefix `use`
- [ ] Typed return value
- [ ] Uses service + adapter (never direct API)
- [ ] TanStack React Query for server state
- [ ] Error handling via onError in query/mutation
- [ ] `staleTime` always set

### Server Action
- [ ] `'use server'` directive
- [ ] Uses service + adapter
- [ ] `revalidatePath()` or `revalidateTag()` after mutations
- [ ] Returns serializable data (no Date, no functions)
- [ ] Error handling with try/catch returning `{ success, error }`

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
- [ ] `create<T>()` syntax
- [ ] Selectors for granular subscriptions
- [ ] Actions co-located with state

### Types
- [ ] `.types.ts` for API types (raw response)
- [ ] `.contracts.ts` for application contracts
- [ ] No `any`
