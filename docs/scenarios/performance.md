# Performance Optimization

::: info Agents: `@perf` `@debugger` · Time: 5-10 min per scenario
:::

Real scenarios for finding and fixing performance issues.

## Slow Page Load {#slow-page}

**Goal:** Reduce initial page load from 5s to under 1s.

**Command:**
```
Optimize the dashboard page - it takes 5 seconds to load
```

**What happens:**
1. **Profile** - Measures current metrics (LCP, FID, CLS)
2. **Analyze** - Identifies bottlenecks (bundle size, API calls, renders)
3. **Optimize** - Applies targeted fixes
4. **Verify** - Measures improvement with evidence

**Result:**
```
Performance: Dashboard Optimization

PROFILE
  LCP: 4.8s (poor)
  FID: 320ms (needs improvement)
  Bundle: 2.1MB (too large)
  API calls on mount: 8 parallel requests

BOTTLENECKS
  1. Single bundle (no code splitting)
  2. All 8 API calls block render
  3. Heavy chart library loaded eagerly

OPTIMIZE
  1. Dynamic import for chart component
     - const Chart = lazy(() => import('./Chart'))
  2. Parallel data fetching with Suspense
  3. Route-based code splitting

VERIFIED
  LCP: 1.1s → 0.8s (good)
  FID: 80ms (good)
  Bundle: 420KB initial (80% reduction)
```

---

## Database Query {#database}

**Goal:** Fix slow API endpoint (2s response time).

**Command:**
```
Optimize the /api/products endpoint - it takes 2 seconds to respond
```

**Result:**
```
Performance: API Endpoint Optimization

PROFILE
  GET /api/products: avg 2.1s
  Database query: 1.8s (bottleneck)
  Query: SELECT * FROM products JOIN categories...

ANALYZE
  1. Missing index on products.category_id
  2. SELECT * fetches 25 unused columns
  3. No pagination (returns all 50k rows)

OPTIMIZE
  1. CREATE INDEX idx_products_category ON products(category_id)
  2. SELECT only needed columns
  3. Add cursor-based pagination (limit 20)

VERIFIED
  GET /api/products: avg 45ms (97% improvement)
  Query plan: Index Scan (was Seq Scan)
```

---

## Bundle Size {#bundle}

**Goal:** Reduce JavaScript bundle size.

**Command:**
```
Analyze and reduce the bundle size - it's over 2MB
```

**Result:**
```
Performance: Bundle Optimization

PROFILE
  Total: 2.3MB
  Largest chunks:
    - moment.js: 480KB (with all locales)
    - lodash: 320KB (full import)
    - chart.js: 290KB

OPTIMIZE
  1. moment.js → date-fns (tree-shakeable)
     480KB → 12KB
  2. import _ from 'lodash' → import { debounce } from 'lodash-es'
     320KB → 4KB
  3. Dynamic import for charts (only on dashboard)
     290KB → 0KB initial

VERIFIED
  Total: 580KB (75% reduction)
  Lighthouse Performance: 92 (was 48)
```

---

## Render Performance {#render}

**Goal:** Fix janky scrolling in a long list.

**Command:**
```
Optimize the product list - scrolling is janky with 10k items
```

**Result:**
```
Performance: List Virtualization

PROFILE
  DOM nodes: 10,000 rows × 8 columns = 80,000 nodes
  Scroll FPS: 12 (target: 60)
  Layout recalculations: constant

ANALYZE
  Rendering all 10k rows at once
  No virtualization
  Each row has complex child components

OPTIMIZE
  import { useVirtualizer } from '@tanstack/react-virtual'

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  })

  // Render only visible rows (~20 instead of 10,000)

VERIFIED
  DOM nodes: ~200 (99.7% reduction)
  Scroll FPS: 60 (smooth)
  Memory: 45MB → 12MB
```

---

## Quick Tips

### Measure First

```
# Don't guess - measure
Analyze the performance of /api/orders endpoint

# Include the symptom
The dashboard takes 3 seconds to load after login
```

### Common Wins

| Issue | Solution |
|-------|----------|
| Large bundle | Code splitting + tree shaking |
| Slow queries | Indexes + pagination |
| Many re-renders | Memoization + virtualization |
| Slow API | Caching + parallel requests |

---

## Related Scenarios

- [Debug Issues](/scenarios/debug-issue) - Debug performance-related bugs
- [Infrastructure](/scenarios/infrastructure) - Scale for performance
- [API Design](/scenarios/api-design) - Design efficient APIs
