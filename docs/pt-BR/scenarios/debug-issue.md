# Depurando Problemas

Cenários reais para encontrar e corrigir bugs.

## Erro de API {#api-error}

**Objetivo:** Corrigir erro 500 no login.

**Comando:**
```
Debug the 500 error when users try to login
```

**O que acontece:**
1. **Coletar** - Coleta logs de erro, request/response
2. **Analisar** - Formula hipótese com base nas evidências
3. **Testar** - Verifica a hipótese
4. **Corrigir** - Implementa e valida a solução

**Resultado:**
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

**Objetivo:** Descobrir por que a memória continua crescendo.

**Comando:**
```
Debug the memory leak in the dashboard - memory grows 50MB per hour
```

**O que acontece:**
1. Identifica padrões comuns de vazamento
2. Verifica event listeners
3. Revisa subscriptions
4. Encontra referências órfãs

**Resultado:**
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

## Problemas de Estado {#state-issues}

**Objetivo:** Corrigir dados desatualizados após salvar.

**Comando:**
```
Debug why the product list shows old data after editing a product
```

**O que acontece:**
1. Rastreia o fluxo de dados
2. Verifica a invalidação de cache
3. Identifica o mecanismo de atualização
4. Corrige o problema de sincronização

**Resultado:**
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

## Problemas de Renderização {#render-issues}

**Objetivo:** Corrigir loop infinito de re-renders.

**Comando:**
```
Debug why the settings page causes infinite re-renders
```

**O que acontece:**
1. Identifica os gatilhos de render
2. Rastreia mudanças nas dependências
3. Encontra referências instáveis
4. Corrige o array de dependências

**Resultado:**
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

## Problemas de Rede {#network-issues}

**Objetivo:** Corrigir race condition na busca.

**Comando:**
```
Debug the search results showing wrong results when typing fast
```

**O que acontece:**
1. Identifica a race condition assíncrona
2. Revisa a ordenação das requisições
3. Implementa o cancelamento
4. Valida a correção

**Resultado:**
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

## Dicas Rápidas

### Forneça Contexto

```
# Vago (difícil de depurar)
Fix the bug

# Claro (fácil de depurar)
Fix the bug where clicking "Save" on the product form
shows success but the product isn't saved to the database
```

### Inclua as Mensagens de Erro

```
Debug this error:
TypeError: Cannot read property 'map' of undefined
at ProductList.tsx:25
```

### Descreva o Esperado vs. o Real

```
Expected: After login, redirect to dashboard
Actual: After login, stays on login page with no error
```

---

## Cenários Relacionados

- [Construindo Features](/pt-BR/scenarios/build-feature) - Construir corretamente para evitar bugs
- [Revisão de Código](/pt-BR/scenarios/code-review) - Capturar bugs antes de ir para produção
- [Performance](/pt-BR/scenarios/performance) - Depurar código lento
