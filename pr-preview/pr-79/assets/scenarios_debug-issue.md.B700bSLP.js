import{_ as n,o as a,c as e,a3 as p}from"./chunks/framework.Df0_fMVA.js";const h=JSON.parse('{"title":"Debug Issues","description":"","frontmatter":{},"headers":[],"relativePath":"scenarios/debug-issue.md","filePath":"scenarios/debug-issue.md"}'),l={name:"scenarios/debug-issue.md"};function t(i,s,o,r,c,d){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="debug-issues" tabindex="-1">Debug Issues <a class="header-anchor" href="#debug-issues" aria-label="Permalink to &quot;Debug Issues&quot;">​</a></h1><div class="info custom-block"><p class="custom-block-title">Agents: <code>@debugger</code> <code>@doctor</code> <code>@perf</code> · Time: 3-5 min per scenario</p></div><p>Real scenarios for finding and fixing bugs.</p><h2 id="api-error" tabindex="-1">API Error <a class="header-anchor" href="#api-error" aria-label="Permalink to &quot;API Error {#api-error}&quot;">​</a></h2><p><strong>Goal:</strong> Fix 500 error on login.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug the 500 error when users try to login</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li><strong>Gather</strong> - Collects error logs, request/response</li><li><strong>Analyze</strong> - Forms hypothesis based on evidence</li><li><strong>Test</strong> - Verifies hypothesis</li><li><strong>Fix</strong> - Implements and validates solution</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Login 500 Error</span></span>
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
<span class="line"><span>  auth-adapter.ts:12 - toLoginPayload() maps to &#39;username&#39;</span></span>
<span class="line"><span>  but API expects &#39;email&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FIX</span></span>
<span class="line"><span>  - auth-adapter.ts: Change &#39;username&#39; to &#39;email&#39;</span></span>
<span class="line"><span>  - Verified: Login now works</span></span></code></pre></div><hr><h2 id="memory-leak" tabindex="-1">Memory Leak <a class="header-anchor" href="#memory-leak" aria-label="Permalink to &quot;Memory Leak {#memory-leak}&quot;">​</a></h2><p><strong>Goal:</strong> Find why memory keeps growing.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug the memory leak in the dashboard - memory grows 50MB per hour</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li>Identifies common leak patterns</li><li>Checks event listeners</li><li>Reviews subscriptions</li><li>Finds orphaned references</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Memory Leak</span></span>
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
<span class="line"><span>  WebSocket connections properly closed</span></span></code></pre></div><hr><h2 id="state-issues" tabindex="-1">State Issues <a class="header-anchor" href="#state-issues" aria-label="Permalink to &quot;State Issues {#state-issues}&quot;">​</a></h2><p><strong>Goal:</strong> Fix stale data after saving.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug why the product list shows old data after editing a product</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li>Traces data flow</li><li>Checks cache invalidation</li><li>Identifies update mechanism</li><li>Fixes sync issue</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Stale Data After Edit</span></span>
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
<span class="line"><span>  Edit → Save → List updates immediately</span></span></code></pre></div><hr><h2 id="render-issues" tabindex="-1">Render Issues <a class="header-anchor" href="#render-issues" aria-label="Permalink to &quot;Render Issues {#render-issues}&quot;">​</a></h2><p><strong>Goal:</strong> Fix infinite re-render loop.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug why the settings page causes infinite re-renders</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li>Identifies render triggers</li><li>Traces dependency changes</li><li>Finds unstable references</li><li>Fixes dependency array</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Infinite Re-renders</span></span>
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
<span class="line"><span>FIX (Option 1 - Memoize in parent):</span></span>
<span class="line"><span>  const options = useMemo(() =&gt; ({ theme, lang }), [theme, lang])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FIX (Option 2 - Use primitives):</span></span>
<span class="line"><span>  useEffect(() =&gt; {</span></span>
<span class="line"><span>    loadSettings({ theme, lang })</span></span>
<span class="line"><span>  }, [theme, lang])  // Primitives are stable</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  Renders once on mount</span></span>
<span class="line"><span>  Renders only when theme/lang change</span></span></code></pre></div><hr><h2 id="network-issues" tabindex="-1">Network Issues <a class="header-anchor" href="#network-issues" aria-label="Permalink to &quot;Network Issues {#network-issues}&quot;">​</a></h2><p><strong>Goal:</strong> Fix race condition in search.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug the search results showing wrong results when typing fast</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li>Identifies async race</li><li>Reviews request ordering</li><li>Implements cancellation</li><li>Validates fix</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug: Search Race Condition</span></span>
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
<span class="line"><span>  Previous requests cancelled</span></span></code></pre></div><hr><h2 id="quick-tips" tabindex="-1">Quick Tips <a class="header-anchor" href="#quick-tips" aria-label="Permalink to &quot;Quick Tips&quot;">​</a></h2><h3 id="give-context" tabindex="-1">Give Context <a class="header-anchor" href="#give-context" aria-label="Permalink to &quot;Give Context&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Vague (hard to debug)</span></span>
<span class="line"><span>Fix the bug</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Clear (easy to debug)</span></span>
<span class="line"><span>Fix the bug where clicking &quot;Save&quot; on the product form</span></span>
<span class="line"><span>shows success but the product isn&#39;t saved to the database</span></span></code></pre></div><h3 id="include-error-messages" tabindex="-1">Include Error Messages <a class="header-anchor" href="#include-error-messages" aria-label="Permalink to &quot;Include Error Messages&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Debug this error:</span></span>
<span class="line"><span>TypeError: Cannot read property &#39;map&#39; of undefined</span></span>
<span class="line"><span>at ProductList.tsx:25</span></span></code></pre></div><h3 id="describe-expected-vs-actual" tabindex="-1">Describe Expected vs Actual <a class="header-anchor" href="#describe-expected-vs-actual" aria-label="Permalink to &quot;Describe Expected vs Actual&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Expected: After login, redirect to dashboard</span></span>
<span class="line"><span>Actual: After login, stays on login page with no error</span></span></code></pre></div><hr><h2 id="related-scenarios" tabindex="-1">Related Scenarios <a class="header-anchor" href="#related-scenarios" aria-label="Permalink to &quot;Related Scenarios&quot;">​</a></h2><ul><li><a href="/pr-preview/pr-79/scenarios/build-feature.html">Build Features</a> - Build correctly to avoid bugs</li><li><a href="/pr-preview/pr-79/scenarios/code-review.html">Code Review</a> - Catch bugs before they ship</li><li><a href="/pr-preview/pr-79/scenarios/performance.html">Performance</a> - Debug slow code</li></ul>`,58)])])}const g=n(l,[["render",t]]);export{h as __pageData,g as default};
