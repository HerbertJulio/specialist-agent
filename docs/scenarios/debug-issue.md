# Debug Issues

::: info Agents: `@debugger` `@doctor` `@perf` · Time: 3-5 min per scenario
:::

Real scenarios for finding and fixing bugs.

## API Error {#api-error}

**Goal:** Fix 500 error on login.

**Command:**
```
Debug the 500 error when users try to login
```

**What happens:**
1. **Gather** - Collects error logs, request/response
2. **Analyze** - Forms hypothesis based on evidence
3. **Test** - Verifies hypothesis
4. **Fix** - Implements and validates solution

**Result:**
```
Debug: Login 500 Error

GATHER
  Error: "Cannot read property 'email' of undefined"
  Location: auth-service.ts:42
  Request: POST /api/auth/login
  Payload: { username: "user@test.com", password: "***" }

ANALYZE
  The API expects { email, password }
  Frontend sends { username, password }
  Field name mismatch causes undefined access

ROOT CAUSE
  auth-adapter.ts:12 - toLoginPayload() maps to 'username'
  but API expects 'email'

FIX
  - auth-adapter.ts: Change 'username' to 'email'
  - Verified: Login now works
```

---

## Memory Leak {#memory-leak}

**Goal:** Find why memory keeps growing.

**Command:**
```
Debug the memory leak in the dashboard - memory grows 50MB per hour
```

**What happens:**
1. Identifies common leak patterns
2. Checks event listeners
3. Reviews subscriptions
4. Finds orphaned references

**Result:**
```
Debug: Memory Leak

GATHER
  Heap grows ~800KB per minute
  Most allocations: MetricsChart component

ANALYZE
  Pattern: Component creates WebSocket on mount
  Issue: WebSocket not closed on unmount

  Code:
    useEffect(() => {
      const ws = new WebSocket(url)
      ws.onmessage = handleMessage
      // Missing cleanup!
    }, [])

FIX
  useEffect(() => {
    const ws = new WebSocket(url)
    ws.onmessage = handleMessage
    return () => ws.close()  // Added cleanup
  }, [])

VERIFIED
  Memory stable after 30 minutes
  WebSocket connections properly closed
```

---

## State Issues {#state-issues}

**Goal:** Fix stale data after saving.

**Command:**
```
Debug why the product list shows old data after editing a product
```

**What happens:**
1. Traces data flow
2. Checks cache invalidation
3. Identifies update mechanism
4. Fixes sync issue

**Result:**
```
Debug: Stale Data After Edit

GATHER
  - Edit product → Save → List shows old data
  - Refresh page → Shows correct data
  - API returns correct data

ANALYZE
  Flow: Edit → useMutation → API → Success

  Missing: Cache invalidation after mutation

  Current code:
    const { mutate } = useMutation({
      mutationFn: updateProduct
      // No onSuccess
    })

FIX
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })

VERIFIED
  Edit → Save → List updates immediately
```

---

## Render Issues {#render-issues}

**Goal:** Fix infinite re-render loop.

**Command:**
```
Debug why the settings page causes infinite re-renders
```

**What happens:**
1. Identifies render triggers
2. Traces dependency changes
3. Finds unstable references
4. Fixes dependency array

**Result:**
```
Debug: Infinite Re-renders

GATHER
  React DevTools: 500+ renders per second
  Component: SettingsForm

ANALYZE
  useEffect has object in dependency array:

  useEffect(() => {
    loadSettings(options)  // options is { theme, lang }
  }, [options])  // New object every render!

  Parent creates new options object on each render

FIX (Option 1 - Memoize in parent):
  const options = useMemo(() => ({ theme, lang }), [theme, lang])

FIX (Option 2 - Use primitives):
  useEffect(() => {
    loadSettings({ theme, lang })
  }, [theme, lang])  // Primitives are stable

VERIFIED
  Renders once on mount
  Renders only when theme/lang change
```

---

## Network Issues {#network-issues}

**Goal:** Fix race condition in search.

**Command:**
```
Debug the search results showing wrong results when typing fast
```

**What happens:**
1. Identifies async race
2. Reviews request ordering
3. Implements cancellation
4. Validates fix

**Result:**
```
Debug: Search Race Condition

GATHER
  Type "abc" fast:
    Request 1: "a" → Response after 500ms
    Request 2: "ab" → Response after 200ms
    Request 3: "abc" → Response after 300ms

  Display order: "ab", "abc", "a"  // Wrong!

ANALYZE
  No request cancellation
  Slower responses overwrite faster ones

FIX
  const abortController = useRef<AbortController>()

  useEffect(() => {
    abortController.current?.abort()
    abortController.current = new AbortController()

    searchProducts(query, {
      signal: abortController.current.signal
    })

    return () => abortController.current?.abort()
  }, [query])

VERIFIED
  Only latest search result displays
  Previous requests cancelled
```

---

## Quick Tips

### Give Context

```
# Vague (hard to debug)
Fix the bug

# Clear (easy to debug)
Fix the bug where clicking "Save" on the product form
shows success but the product isn't saved to the database
```

### Include Error Messages

```
Debug this error:
TypeError: Cannot read property 'map' of undefined
at ProductList.tsx:25
```

### Describe Expected vs Actual

```
Expected: After login, redirect to dashboard
Actual: After login, stays on login page with no error
```

---

## Related Scenarios

- [Build Features](/scenarios/build-feature) - Build correctly to avoid bugs
- [Code Review](/scenarios/code-review) - Catch bugs before they ship
- [Performance](/scenarios/performance) - Debug slow code
