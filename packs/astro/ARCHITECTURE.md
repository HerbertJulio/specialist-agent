# ARCHITECTURE.md - Architecture Guide & Patterns

> This document is the **source of truth** for all agents and skills.
> Any architectural decision must be documented here.

---

## 1. Overview - Islands Architecture

Astro is a **server-first** web framework designed for content-driven websites. Key principles:

| Principle | Description |
|-----------|-------------|
| Server-first | Components render on the server - zero JS shipped by default |
| Islands Architecture | Interactive UI is opt-in via `client:*` directives |
| Content Collections | Type-safe content management with Zod schemas |
| Multi-framework | Use React, Vue, Svelte, or Solid components as islands |
| Hybrid rendering | SSG (static) + SSR (on-demand) per page |
| File-based routing | `src/pages/` maps directly to URLs |

**Zero JS by default**: An `.astro` component ships no JavaScript to the browser. Only framework components with a `client:*` directive become interactive "islands" that hydrate on the client.

---

## 2. Directory Structure

```
src/
├── pages/               # File-based routing (SSG/SSR pages + API endpoints)
│   ├── index.astro
│   ├── about.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── api/
│       └── posts.ts     # Server endpoint (GET, POST, etc.)
│
├── layouts/             # Reusable page templates
│   ├── BaseLayout.astro
│   └── BlogLayout.astro
│
├── components/          # .astro server components (zero JS)
│   ├── Header.astro
│   ├── Footer.astro
│   └── PostCard.astro
│
├── islands/             # Interactive framework components (React/Vue/Svelte)
│   ├── SearchBar.tsx    # React island
│   ├── ThemeToggle.vue  # Vue island
│   └── Counter.svelte   # Svelte island
│
├── content/             # Content collections (MDX, Markdown, JSON, YAML)
│   ├── config.ts        # Collection schemas (Zod)
│   ├── blog/
│   │   ├── first-post.mdx
│   │   └── second-post.mdx
│   └── authors/
│       └── john.json
│
├── modules/             # Feature modules (business logic)
│   ├── newsletter/
│   │   ├── services/
│   │   │   └── newsletter-service.ts
│   │   ├── adapters/
│   │   │   └── newsletter-adapter.ts
│   │   ├── types/
│   │   │   ├── newsletter.types.ts
│   │   │   └── newsletter.contracts.ts
│   │   ├── __tests__/
│   │   └── index.ts
│   │
│   └── [other-module]/
│
├── shared/              # Shared across modules
│   ├── components/      # Shared .astro components
│   ├── islands/         # Shared interactive islands
│   ├── services/        # API client base, fetch helpers
│   ├── adapters/        # Shared adapters
│   ├── types/           # Global types
│   ├── utils/           # Pure functions (no side effects)
│   ├── helpers/         # Functions with side effects or DOM
│   └── constants/       # Static values
│
├── styles/              # Global styles (CSS, SCSS)
│   └── global.css
│
└── assets/              # Static assets processed by Astro (images, fonts)
```

### Import Rules Between Layers
```
modules/newsletter  <->  shared/           OK - Module imports from shared
modules/newsletter  ->   modules/commerce  FORBIDDEN - Module does NOT import from another module
shared/             ->   modules/newsletter FORBIDDEN - Shared does NOT import from modules
pages/              ->   modules/*          OK - Pages import modules
pages/              ->   components/*       OK - Pages import components
pages/              ->   islands/*          OK - Pages import islands
```

If two modules need to share something, move it to `shared/`.

---

## 3. Naming Conventions

### Files and Directories

| Type | Pattern | Example |
|------|---------|---------|
| Directories | `kebab-case` | `user-settings/` |
| Astro components | `PascalCase.astro` | `PostCard.astro` |
| Pages | `kebab-case.astro` | `about-us.astro` |
| Dynamic pages | `[param].astro` | `[slug].astro` |
| Layouts | `PascalCase + Layout.astro` | `BlogLayout.astro` |
| Islands (React) | `PascalCase.tsx` | `SearchBar.tsx` |
| Islands (Vue) | `PascalCase.vue` | `ThemeToggle.vue` |
| Islands (Svelte) | `PascalCase.svelte` | `Counter.svelte` |
| Services | `kebab-case-service.ts` | `newsletter-service.ts` |
| Adapters | `kebab-case-adapter.ts` | `newsletter-adapter.ts` |
| Types | `kebab-case.types.ts` | `newsletter.types.ts` |
| Contracts/Schemas | `kebab-case.contracts.ts` | `newsletter.contracts.ts` |
| Content schemas | `config.ts` | `src/content/config.ts` |
| Utils | `kebab-case.ts` | `format-date.ts` |
| Helpers | `kebab-case.ts` | `clipboard-helper.ts` |
| Tests | `OriginalName.spec.ts` | `PostCard.spec.ts` |
| Constants | `kebab-case.constants.ts` | `api-endpoints.constants.ts` |
| Server endpoints | `kebab-case.ts` | `src/pages/api/posts.ts` |

### Code

| Type | Pattern | Example |
|------|---------|---------|
| Variables / functions | `camelCase` | `getUserById`, `isLoading` |
| Types / Interfaces | `PascalCase` | `BlogPost`, `NewsletterItem` |
| Enums | `PascalCase` | `PostStatus.Published` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |
| Collection names | `kebab-case` string | `defineCollection({ ... })` |
| Event handlers | `handle` + action | `handleSubmit`, `handleDelete` |
| Boolean | `is`/`has`/`can`/`should` | `isLoading`, `hasPermission` |

---

## 4. Responsibility Layers

### 4.1 Services - Pure Requests

Services make **only** the HTTP request. No try/catch, no transformation, no business logic.

```typescript
// modules/newsletter/services/newsletter-service.ts

export const newsletterService = {
  list(params: { page: number; pageSize: number }) {
    return fetch(`${import.meta.env.API_BASE_URL}/newsletter?page=${params.page}&pageSize=${params.pageSize}`)
      .then(res => res.json())
  },

  getById(id: string) {
    return fetch(`${import.meta.env.API_BASE_URL}/newsletter/${id}`)
      .then(res => res.json())
  },

  subscribe(payload: { email: string; name: string }) {
    return fetch(`${import.meta.env.API_BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(res => res.json())
  },
}
```

**Service Rules:**
- No try/catch (caller handles errors)
- No data transformation (adapter does that)
- No business logic
- No DOM or browser API access
- One file per resource
- Export as object with methods

### 4.2 Adapters - Contract Parsers

Adapters transform data from the API to the TypeScript app contract (and vice-versa). **Pure functions** with no side effects.

```typescript
// modules/newsletter/adapters/newsletter-adapter.ts
import type { NewsletterItemResponse, NewsletterListResponse } from '../types/newsletter.types'
import type { NewsletterItem, NewsletterList } from '../types/newsletter.contracts'

export const newsletterAdapter = {
  toNewsletterItem(response: NewsletterItemResponse): NewsletterItem {
    return {
      id: response.uuid,
      title: response.title,
      author: response.author_name,
      category: response.category_slug,
      isPublished: response.status === 'published',
      publishedAt: new Date(response.published_at),
      updatedAt: new Date(response.updated_at),
    }
  },

  toNewsletterList(response: NewsletterListResponse): NewsletterList {
    return {
      items: response.results.map(newsletterAdapter.toNewsletterItem),
      totalItems: response.count,
      totalPages: Math.ceil(response.count / response.page_size),
      currentPage: response.page,
    }
  },

  toSubscribePayload(input: { email: string; name: string }) {
    return {
      email_address: input.email,
      full_name: input.name,
    }
  },
}
```

**Adapter Rules:**
- Pure functions (input -> output, no side effects)
- Two directions: API->App (inbound) and App->API (outbound)
- Rename fields (snake_case API -> camelCase App)
- Convert types (string->Date, cents->decimal, status->boolean)
- No HTTP calls
- No try/catch (wrong type = bug to fix)

### 4.3 Types & Contracts

```typescript
// types/newsletter.types.ts
// Types that mirror the API exactly as it returns (snake_case)

export interface NewsletterItemResponse {
  uuid: string
  title: string
  author_name: string
  category_slug: string
  status: 'published' | 'draft' | 'archived'
  published_at: string
  updated_at: string
}

export interface NewsletterListResponse {
  count: number
  page: number
  page_size: number
  results: NewsletterItemResponse[]
}

// types/newsletter.contracts.ts
// App contracts (camelCase, correct types)

export interface NewsletterItem {
  id: string
  title: string
  author: string
  category: string
  isPublished: boolean
  publishedAt: Date
  updatedAt: Date
}

export interface NewsletterList {
  items: NewsletterItem[]
  totalItems: number
  totalPages: number
  currentPage: number
}
```

### 4.4 Data Fetching - Frontmatter & Endpoints

In Astro, data is fetched **at build time (SSG) or request time (SSR)** in the component frontmatter or in server endpoints. There are no client-side composables or Vue Query - data flows server-side.

```astro
---
// src/pages/newsletter/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro'
import PostCard from '../../components/PostCard.astro'
import { newsletterService } from '../../modules/newsletter/services/newsletter-service'
import { newsletterAdapter } from '../../modules/newsletter/adapters/newsletter-adapter'

const response = await newsletterService.list({ page: 1, pageSize: 20 })
const { items, totalPages } = newsletterAdapter.toNewsletterList(response)
---

<BaseLayout title="Newsletter">
  <h1>Newsletter</h1>
  <div class="grid">
    {items.map(item => <PostCard item={item} />)}
  </div>
</BaseLayout>
```

**Server Endpoint:**

```typescript
// src/pages/api/newsletter/subscribe.ts
import type { APIRoute } from 'astro'
import { newsletterService } from '../../../modules/newsletter/services/newsletter-service'
import { newsletterAdapter } from '../../../modules/newsletter/adapters/newsletter-adapter'

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()
  const payload = newsletterAdapter.toSubscribePayload(body)
  const result = await newsletterService.subscribe(payload)

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

**Data Fetching Rules:**
- SSG pages: data fetched at build time in frontmatter
- SSR pages: data fetched on each request in frontmatter (requires adapter: `output: 'server'`)
- API endpoints: `src/pages/api/` with exported HTTP method functions
- Service -> Adapter -> Template (no client-side state management)
- Error handling: try/catch in frontmatter or endpoint, not in service

---

## 5. Component Patterns

### 5.1 Astro Components (Server, Zero JS)

```astro
---
// components/PostCard.astro
import type { NewsletterItem } from '../modules/newsletter/types/newsletter.contracts'
import { formatDate } from '../shared/utils/format-date'

interface Props {
  item: NewsletterItem
}

const { item } = Astro.props
---

<article class="post-card">
  <h2>{item.title}</h2>
  <p class="meta">
    <span>{item.author}</span>
    <time datetime={item.publishedAt.toISOString()}>
      {formatDate(item.publishedAt)}
    </time>
  </p>
  <span class:list={['badge', { published: item.isPublished }]}>
    {item.isPublished ? 'Published' : 'Draft'}
  </span>
</article>

<style>
  .post-card {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
  }
</style>
```

**Astro Component Rules:**
- Server-rendered, zero JS shipped to browser
- Props via `Astro.props` with typed `Props` interface
- No event handlers (use islands for interactivity)
- Scoped styles with `<style>` tag
- Template uses JSX-like expressions `{}`
- Class toggling with `class:list`

### 5.2 Islands (Interactive Components)

Islands are framework components (React, Vue, Svelte) that hydrate on the client. Use the appropriate `client:*` directive:

| Directive | When to Use |
|-----------|-------------|
| `client:load` | Immediately visible + interactive (nav, hero CTAs) |
| `client:idle` | Lower priority, hydrate when browser is idle (sidebar widgets) |
| `client:visible` | Below the fold, hydrate when scrolled into view (comments, carousels) |
| `client:media="(max-width: 768px)"` | Only on specific viewports (mobile menus) |
| `client:only="react"` | Client-only, skip SSR (auth-dependent, browser API) |

```tsx
// islands/SearchBar.tsx
import { useState, useEffect } from 'react'

interface Props {
  placeholder?: string
  apiUrl: string
}

export default function SearchBar({ placeholder = 'Search...', apiUrl }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (query.length < 3) return
    const controller = new AbortController()

    fetch(`${apiUrl}?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setResults(data.items))
      .catch(() => {})

    return () => controller.abort()
  }, [query, apiUrl])

  return (
    <div className="search">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      {results.length > 0 && (
        <ul className="results">
          {results.map((item: any) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

**Using an Island in an Astro page:**

```astro
---
import SearchBar from '../islands/SearchBar'
---

<SearchBar client:idle placeholder="Search posts..." apiUrl="/api/search" />
```

**Island Rules:**
- Place in `src/islands/` (or `src/shared/islands/` for shared)
- ALWAYS specify a `client:*` directive when using in `.astro` files
- Choose the LEAST aggressive hydration strategy (prefer `client:visible` or `client:idle` over `client:load`)
- Props must be serializable (no functions, no complex objects with methods)
- Keep islands small - extract non-interactive parts to `.astro` components
- Each island is an independent hydration boundary

### 5.3 Component Hierarchy

```
Pages (src/pages/)        -> Data fetching, compose layouts + components
  └── Layouts             -> Page structure (header, footer, slots)
      └── Astro Components -> Server-rendered UI (zero JS)
          └── Islands      -> Interactive UI (hydrated, framework-specific)
```

| Type | Responsibility | JavaScript shipped? |
|------|---------------|---------------------|
| **Pages** | Route, data fetching (frontmatter), compose layout | No |
| **Layouts** | Page structure, slots for content | No |
| **Astro Components** | Server-rendered UI, presentational | No |
| **Islands** | Client-side interactivity, state, events | Yes (minimal) |

---

## 6. Utils vs Helpers

### Utils - Pure Functions
- No side effects
- Input -> Output deterministic
- Testable without mocks
- No DOM, browser API, or framework dependency

```typescript
// shared/utils/format-date.ts
export function formatDate(date: Date, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale).format(date)
}

// shared/utils/slugify.ts
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}
```

### Helpers - Functions with Side Effects or DOM
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

## 7. Error Handling

### In Frontmatter (Pages)
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import { newsletterService } from '../modules/newsletter/services/newsletter-service'
import { newsletterAdapter } from '../modules/newsletter/adapters/newsletter-adapter'

let items = []
let error = null

try {
  const response = await newsletterService.list({ page: 1, pageSize: 20 })
  items = newsletterAdapter.toNewsletterList(response).items
} catch (e) {
  error = 'Failed to load newsletter items.'
}
---

<BaseLayout title="Newsletter">
  {error ? (
    <p class="error">{error}</p>
  ) : items.length === 0 ? (
    <p class="empty">No items found.</p>
  ) : (
    <div class="grid">
      {items.map(item => <PostCard item={item} />)}
    </div>
  )}
</BaseLayout>
```

### In Server Endpoints
```typescript
// src/pages/api/newsletter/subscribe.ts
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    // ... process
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
```

### Custom Error Pages
```astro
<!-- src/pages/404.astro -->
---
import BaseLayout from '../layouts/BaseLayout.astro'
---

<BaseLayout title="Not Found">
  <h1>404 - Page Not Found</h1>
  <p>The page you are looking for does not exist.</p>
  <a href="/">Go home</a>
</BaseLayout>
```

---

## 8. Content Collections

### Schema Definition
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
  }),
})

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    social: z.object({
      twitter: z.string().optional(),
      github: z.string().optional(),
    }).optional(),
  }),
})

export const collections = { blog, authors }
```

### Querying Content
```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content'
import BaseLayout from '../../layouts/BaseLayout.astro'
import PostCard from '../../components/PostCard.astro'

const posts = await getCollection('blog', ({ data }) => !data.draft)
const sortedPosts = posts.sort((a, b) =>
  b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
)
---

<BaseLayout title="Blog">
  <h1>Blog</h1>
  {sortedPosts.map(post => (
    <PostCard
      title={post.data.title}
      description={post.data.description}
      slug={post.slug}
      date={post.data.publishedAt}
    />
  ))}
</BaseLayout>
```

### Rendering Content
```astro
---
// src/pages/blog/[slug].astro
import { getCollection, type CollectionEntry } from 'astro:content'
import BlogLayout from '../../layouts/BlogLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('blog')
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

interface Props {
  post: CollectionEntry<'blog'>
}

const { post } = Astro.props
const { Content } = await post.render()
---

<BlogLayout title={post.data.title}>
  <article>
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</BlogLayout>
```

**Content Collection Rules:**
- All schemas defined in `src/content/config.ts`
- Use Zod for schema validation
- `type: 'content'` for Markdown/MDX, `type: 'data'` for JSON/YAML
- Query with `getCollection()` and `getEntry()`
- Filter at query time (e.g., exclude drafts)
- Generate static paths with `getStaticPaths()`

---

## 9. SOLID Applied to Astro

| Principle | Astro Application |
|-----------|------------------|
| **S**ingle Responsibility | 1 page = 1 route. 1 component = 1 UI piece. 1 service = 1 resource. 1 island = 1 interactive feature. |
| **O**pen/Closed | Components extensible via slots and props, not by internal modification. Layouts compose via `<slot />`. |
| **L**iskov Substitution | Shared components work in any page/layout context without breaking. |
| **I**nterface Segregation | Specific props per component, not generic objects. `<PostCard title description date>` not `<PostCard post>`. |
| **D**ependency Inversion | Pages depend on service interfaces (types), not implementations. Services injected via imports in frontmatter. |

---

## 10. Migration Checklist (SPA to Astro)

### Page Migration
- [ ] SPA route -> `src/pages/[route].astro`
- [ ] Client-side data fetching -> frontmatter `await` calls
- [ ] React/Vue page component -> `.astro` page with layout
- [ ] Client-side router -> file-based routing
- [ ] Loading spinners -> server-rendered content (no loading states for SSG)

### Component Migration
- [ ] Interactive components -> `src/islands/` with `client:*` directive
- [ ] Static/presentational components -> `src/components/` as `.astro`
- [ ] CSS-in-JS -> scoped `<style>` or CSS modules
- [ ] `useState`/`ref()` (for UI only) -> keep in island
- [ ] `useEffect`/`onMounted` (data fetching) -> move to frontmatter

### State Management
- [ ] Global state (Redux/Pinia) -> server-side data + minimal island state
- [ ] Server state (React Query/Vue Query) -> frontmatter fetch + adapter
- [ ] Client state -> keep minimal in islands, pass via props
- [ ] Shared island state -> use `nanostores` or custom events

### Content
- [ ] CMS API calls -> Content Collections (if static content)
- [ ] Dynamic content -> SSR with adapter pattern
- [ ] Markdown rendering -> MDX with Content Collections

### Performance
- [ ] SPA bundle -> zero JS by default
- [ ] Code splitting -> automatic per-island
- [ ] Lazy loading -> `client:visible` / `client:idle`
- [ ] Image optimization -> `<Image />` from `astro:assets`
