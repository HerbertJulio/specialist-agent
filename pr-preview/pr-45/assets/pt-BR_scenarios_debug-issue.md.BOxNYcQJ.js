import{_ as a,o as n,c as e,a4 as p}from"./chunks/framework.DJn0YgWS.js";const g=JSON.parse('{"title":"Depurando Problemas","description":"","frontmatter":{},"headers":[],"relativePath":"pt-BR/scenarios/debug-issue.md","filePath":"pt-BR/scenarios/debug-issue.md"}'),l={name:"pt-BR/scenarios/debug-issue.md"};function i(t,s,o,r,c,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="depurando-problemas" tabindex="-1">Depurando Problemas <a class="header-anchor" href="#depurando-problemas" aria-label="Permalink to &quot;Depurando Problemas&quot;">​</a></h1><p>Cenários reais para encontrar e corrigir bugs.</p><h2 id="api-error" tabindex="-1">Erro de API <a class="header-anchor" href="#api-error" aria-label="Permalink to &quot;Erro de API {#api-error}&quot;">​</a></h2><p><strong>Objetivo:</strong> Corrigir erro 500 no login.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug the 500 error when users try to login</span></span></code></pre></div><p><strong>O que acontece:</strong></p><ol><li><strong>Coletar</strong> — Coleta logs de erro, request/response</li><li><strong>Analisar</strong> — Formula hipótese com base nas evidências</li><li><strong>Testar</strong> — Verifica a hipótese</li><li><strong>Corrigir</strong> — Implementa e valida a solução</li></ol><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Login 500 Error</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GATHER</span></span>
<span class="line"><span>  Error: &quot;Cannot read property &#39;email&#39; of undefined&quot;</span></span>
<span class="line"><span>  Location: auth-service.ts:42</span></span>
<span class="line"><span>  Request: POST /api/auth/login</span></span>
<span class="line"><span>  Payload: { username: &quot;user@test.com&quot;, password: &quot;***&quot; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ANALYZE</span></span>
<span class="line"><span>  The API expects { email, password }</span></span>
<span class="line"><span>  Frontend sends { username, password }</span></span>
<span class="line"><span>  Field name mismatch causes undefined access</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ROOT CAUSE</span></span>
<span class="line"><span>  auth-adapter.ts:12 — toLoginPayload() maps to &#39;username&#39;</span></span>
<span class="line"><span>  but API expects &#39;email&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FIX</span></span>
<span class="line"><span>  - auth-adapter.ts: Change &#39;username&#39; to &#39;email&#39;</span></span>
<span class="line"><span>  - Verified: Login now works</span></span></code></pre></div><hr><h2 id="memory-leak" tabindex="-1">Memory Leak <a class="header-anchor" href="#memory-leak" aria-label="Permalink to &quot;Memory Leak {#memory-leak}&quot;">​</a></h2><p><strong>Objetivo:</strong> Descobrir por que a memória continua crescendo.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug the memory leak in the dashboard — memory grows 50MB per hour</span></span></code></pre></div><p><strong>O que acontece:</strong></p><ol><li>Identifica padrões comuns de vazamento</li><li>Verifica event listeners</li><li>Revisa subscriptions</li><li>Encontra referências órfãs</li></ol><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Memory Leak</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GATHER</span></span>
<span class="line"><span>  Heap grows ~800KB per minute</span></span>
<span class="line"><span>  Most allocations: MetricsChart component</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ANALYZE</span></span>
<span class="line"><span>  Pattern: Component creates WebSocket on mount</span></span>
<span class="line"><span>  Issue: WebSocket not closed on unmount</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Code:</span></span>
<span class="line"><span>    useEffect(() =&gt; {</span></span>
<span class="line"><span>      const ws = new WebSocket(url)</span></span>
<span class="line"><span>      ws.onmessage = handleMessage</span></span>
<span class="line"><span>      // Missing cleanup!</span></span>
<span class="line"><span>    }, [])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FIX</span></span>
<span class="line"><span>  useEffect(() =&gt; {</span></span>
<span class="line"><span>    const ws = new WebSocket(url)</span></span>
<span class="line"><span>    ws.onmessage = handleMessage</span></span>
<span class="line"><span>    return () =&gt; ws.close()  // Added cleanup</span></span>
<span class="line"><span>  }, [])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  Memory stable after 30 minutes</span></span>
<span class="line"><span>  WebSocket connections properly closed</span></span></code></pre></div><hr><h2 id="state-issues" tabindex="-1">Problemas de Estado <a class="header-anchor" href="#state-issues" aria-label="Permalink to &quot;Problemas de Estado {#state-issues}&quot;">​</a></h2><p><strong>Objetivo:</strong> Corrigir dados desatualizados após salvar.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug why the product list shows old data after editing a product</span></span></code></pre></div><p><strong>O que acontece:</strong></p><ol><li>Rastreia o fluxo de dados</li><li>Verifica a invalidação de cache</li><li>Identifica o mecanismo de atualização</li><li>Corrige o problema de sincronização</li></ol><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Stale Data After Edit</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GATHER</span></span>
<span class="line"><span>  - Edit product → Save → List shows old data</span></span>
<span class="line"><span>  - Refresh page → Shows correct data</span></span>
<span class="line"><span>  - API returns correct data</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ANALYZE</span></span>
<span class="line"><span>  Flow: Edit → useMutation → API → Success</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Missing: Cache invalidation after mutation</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Current code:</span></span>
<span class="line"><span>    const { mutate } = useMutation({</span></span>
<span class="line"><span>      mutationFn: updateProduct</span></span>
<span class="line"><span>      // No onSuccess</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FIX</span></span>
<span class="line"><span>  const queryClient = useQueryClient()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const { mutate } = useMutation({</span></span>
<span class="line"><span>    mutationFn: updateProduct,</span></span>
<span class="line"><span>    onSuccess: () =&gt; {</span></span>
<span class="line"><span>      queryClient.invalidateQueries([&#39;products&#39;])</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  Edit → Save → List updates immediately</span></span></code></pre></div><hr><h2 id="render-issues" tabindex="-1">Problemas de Renderização <a class="header-anchor" href="#render-issues" aria-label="Permalink to &quot;Problemas de Renderização {#render-issues}&quot;">​</a></h2><p><strong>Objetivo:</strong> Corrigir loop infinito de re-renders.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug why the settings page causes infinite re-renders</span></span></code></pre></div><p><strong>O que acontece:</strong></p><ol><li>Identifica os gatilhos de render</li><li>Rastreia mudanças nas dependências</li><li>Encontra referências instáveis</li><li>Corrige o array de dependências</li></ol><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Infinite Re-renders</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GATHER</span></span>
<span class="line"><span>  React DevTools: 500+ renders per second</span></span>
<span class="line"><span>  Component: SettingsForm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ANALYZE</span></span>
<span class="line"><span>  useEffect has object in dependency array:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  useEffect(() =&gt; {</span></span>
<span class="line"><span>    loadSettings(options)  // options is { theme, lang }</span></span>
<span class="line"><span>  }, [options])  // New object every render!</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Parent creates new options object on each render</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FIX (Option 1 — Memoize in parent):</span></span>
<span class="line"><span>  const options = useMemo(() =&gt; ({ theme, lang }), [theme, lang])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FIX (Option 2 — Use primitives):</span></span>
<span class="line"><span>  useEffect(() =&gt; {</span></span>
<span class="line"><span>    loadSettings({ theme, lang })</span></span>
<span class="line"><span>  }, [theme, lang])  // Primitives are stable</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  Renders once on mount</span></span>
<span class="line"><span>  Renders only when theme/lang change</span></span></code></pre></div><hr><h2 id="network-issues" tabindex="-1">Problemas de Rede <a class="header-anchor" href="#network-issues" aria-label="Permalink to &quot;Problemas de Rede {#network-issues}&quot;">​</a></h2><p><strong>Objetivo:</strong> Corrigir race condition na busca.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug the search results showing wrong results when typing fast</span></span></code></pre></div><p><strong>O que acontece:</strong></p><ol><li>Identifica a race condition assíncrona</li><li>Revisa a ordenação das requisições</li><li>Implementa o cancelamento</li><li>Valida a correção</li></ol><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Search Race Condition</span></span>
<span class="line"><span></span></span>
<span class="line"><span>GATHER</span></span>
<span class="line"><span>  Type &quot;abc&quot; fast:</span></span>
<span class="line"><span>    Request 1: &quot;a&quot; → Response after 500ms</span></span>
<span class="line"><span>    Request 2: &quot;ab&quot; → Response after 200ms</span></span>
<span class="line"><span>    Request 3: &quot;abc&quot; → Response after 300ms</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Display order: &quot;ab&quot;, &quot;abc&quot;, &quot;a&quot;  // Wrong!</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ANALYZE</span></span>
<span class="line"><span>  No request cancellation</span></span>
<span class="line"><span>  Slower responses overwrite faster ones</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FIX</span></span>
<span class="line"><span>  const abortController = useRef&lt;AbortController&gt;()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  useEffect(() =&gt; {</span></span>
<span class="line"><span>    abortController.current?.abort()</span></span>
<span class="line"><span>    abortController.current = new AbortController()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    searchProducts(query, {</span></span>
<span class="line"><span>      signal: abortController.current.signal</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return () =&gt; abortController.current?.abort()</span></span>
<span class="line"><span>  }, [query])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  Only latest search result displays</span></span>
<span class="line"><span>  Previous requests cancelled</span></span></code></pre></div><hr><h2 id="dicas-rapidas" tabindex="-1">Dicas Rápidas <a class="header-anchor" href="#dicas-rapidas" aria-label="Permalink to &quot;Dicas Rápidas&quot;">​</a></h2><h3 id="forneca-contexto" tabindex="-1">Forneça Contexto <a class="header-anchor" href="#forneca-contexto" aria-label="Permalink to &quot;Forneça Contexto&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Vago (difícil de depurar)</span></span>
<span class="line"><span>Fix the bug</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Claro (fácil de depurar)</span></span>
<span class="line"><span>Fix the bug where clicking &quot;Save&quot; on the product form</span></span>
<span class="line"><span>shows success but the product isn&#39;t saved to the database</span></span></code></pre></div><h3 id="inclua-as-mensagens-de-erro" tabindex="-1">Inclua as Mensagens de Erro <a class="header-anchor" href="#inclua-as-mensagens-de-erro" aria-label="Permalink to &quot;Inclua as Mensagens de Erro&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug this error:</span></span>
<span class="line"><span>TypeError: Cannot read property &#39;map&#39; of undefined</span></span>
<span class="line"><span>at ProductList.tsx:25</span></span></code></pre></div><h3 id="descreva-o-esperado-vs-o-real" tabindex="-1">Descreva o Esperado vs. o Real <a class="header-anchor" href="#descreva-o-esperado-vs-o-real" aria-label="Permalink to &quot;Descreva o Esperado vs. o Real&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Expected: After login, redirect to dashboard</span></span>
<span class="line"><span>Actual: After login, stays on login page with no error</span></span></code></pre></div><hr><h2 id="cenarios-relacionados" tabindex="-1">Cenários Relacionados <a class="header-anchor" href="#cenarios-relacionados" aria-label="Permalink to &quot;Cenários Relacionados&quot;">​</a></h2><ul><li><a href="/specialist-agent/pr-preview/pr-45/pt-BR/scenarios/build-feature.html">Construindo Features</a> — Construir corretamente para evitar bugs</li><li><a href="/specialist-agent/pr-preview/pr-45/pt-BR/scenarios/code-review.html">Revisão de Código</a> — Capturar bugs antes de ir para produção</li><li><a href="/specialist-agent/pr-preview/pr-45/pt-BR/scenarios/performance.html">Performance</a> — Depurar código lento</li></ul>`,57)])])}const h=a(l,[["render",i]]);export{g as __pageData,h as default};
