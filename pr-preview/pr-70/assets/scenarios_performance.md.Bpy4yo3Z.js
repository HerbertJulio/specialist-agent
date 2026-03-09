import{_ as a,o as n,c as e,a3 as p}from"./chunks/framework.Bwsxejtx.js";const h=JSON.parse('{"title":"Performance Optimization","description":"","frontmatter":{},"headers":[],"relativePath":"scenarios/performance.md","filePath":"scenarios/performance.md"}'),l={name:"scenarios/performance.md"};function i(t,s,o,r,c,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="performance-optimization" tabindex="-1">Performance Optimization <a class="header-anchor" href="#performance-optimization" aria-label="Permalink to &quot;Performance Optimization&quot;">​</a></h1><div class="info custom-block"><p class="custom-block-title">Agents: <code>@perf</code> <code>@debugger</code> · Time: 5-10 min per scenario</p></div><p>Real scenarios for finding and fixing performance issues.</p><h2 id="slow-page" tabindex="-1">Slow Page Load <a class="header-anchor" href="#slow-page" aria-label="Permalink to &quot;Slow Page Load {#slow-page}&quot;">​</a></h2><p><strong>Goal:</strong> Reduce initial page load from 5s to under 1s.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optimize the dashboard page - it takes 5 seconds to load</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li><strong>Profile</strong> - Measures current metrics (LCP, FID, CLS)</li><li><strong>Analyze</strong> - Identifies bottlenecks (bundle size, API calls, renders)</li><li><strong>Optimize</strong> - Applies targeted fixes</li><li><strong>Verify</strong> - Measures improvement with evidence</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance: Dashboard Optimization</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PROFILE</span></span>
<span class="line"><span>  LCP: 4.8s (poor)</span></span>
<span class="line"><span>  FID: 320ms (needs improvement)</span></span>
<span class="line"><span>  Bundle: 2.1MB (too large)</span></span>
<span class="line"><span>  API calls on mount: 8 parallel requests</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BOTTLENECKS</span></span>
<span class="line"><span>  1. Single bundle (no code splitting)</span></span>
<span class="line"><span>  2. All 8 API calls block render</span></span>
<span class="line"><span>  3. Heavy chart library loaded eagerly</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OPTIMIZE</span></span>
<span class="line"><span>  1. Dynamic import for chart component</span></span>
<span class="line"><span>     - const Chart = lazy(() =&gt; import(&#39;./Chart&#39;))</span></span>
<span class="line"><span>  2. Parallel data fetching with Suspense</span></span>
<span class="line"><span>  3. Route-based code splitting</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  LCP: 1.1s → 0.8s (good)</span></span>
<span class="line"><span>  FID: 80ms (good)</span></span>
<span class="line"><span>  Bundle: 420KB initial (80% reduction)</span></span></code></pre></div><hr><h2 id="database" tabindex="-1">Database Query <a class="header-anchor" href="#database" aria-label="Permalink to &quot;Database Query {#database}&quot;">​</a></h2><p><strong>Goal:</strong> Fix slow API endpoint (2s response time).</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optimize the /api/products endpoint - it takes 2 seconds to respond</span></span></code></pre></div><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance: API Endpoint Optimization</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PROFILE</span></span>
<span class="line"><span>  GET /api/products: avg 2.1s</span></span>
<span class="line"><span>  Database query: 1.8s (bottleneck)</span></span>
<span class="line"><span>  Query: SELECT * FROM products JOIN categories...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ANALYZE</span></span>
<span class="line"><span>  1. Missing index on products.category_id</span></span>
<span class="line"><span>  2. SELECT * fetches 25 unused columns</span></span>
<span class="line"><span>  3. No pagination (returns all 50k rows)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OPTIMIZE</span></span>
<span class="line"><span>  1. CREATE INDEX idx_products_category ON products(category_id)</span></span>
<span class="line"><span>  2. SELECT only needed columns</span></span>
<span class="line"><span>  3. Add cursor-based pagination (limit 20)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  GET /api/products: avg 45ms (97% improvement)</span></span>
<span class="line"><span>  Query plan: Index Scan (was Seq Scan)</span></span></code></pre></div><hr><h2 id="bundle" tabindex="-1">Bundle Size <a class="header-anchor" href="#bundle" aria-label="Permalink to &quot;Bundle Size {#bundle}&quot;">​</a></h2><p><strong>Goal:</strong> Reduce JavaScript bundle size.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Analyze and reduce the bundle size - it&#39;s over 2MB</span></span></code></pre></div><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance: Bundle Optimization</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PROFILE</span></span>
<span class="line"><span>  Total: 2.3MB</span></span>
<span class="line"><span>  Largest chunks:</span></span>
<span class="line"><span>    - moment.js: 480KB (with all locales)</span></span>
<span class="line"><span>    - lodash: 320KB (full import)</span></span>
<span class="line"><span>    - chart.js: 290KB</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OPTIMIZE</span></span>
<span class="line"><span>  1. moment.js → date-fns (tree-shakeable)</span></span>
<span class="line"><span>     480KB → 12KB</span></span>
<span class="line"><span>  2. import _ from &#39;lodash&#39; → import { debounce } from &#39;lodash-es&#39;</span></span>
<span class="line"><span>     320KB → 4KB</span></span>
<span class="line"><span>  3. Dynamic import for charts (only on dashboard)</span></span>
<span class="line"><span>     290KB → 0KB initial</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  Total: 580KB (75% reduction)</span></span>
<span class="line"><span>  Lighthouse Performance: 92 (was 48)</span></span></code></pre></div><hr><h2 id="render" tabindex="-1">Render Performance <a class="header-anchor" href="#render" aria-label="Permalink to &quot;Render Performance {#render}&quot;">​</a></h2><p><strong>Goal:</strong> Fix janky scrolling in a long list.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optimize the product list - scrolling is janky with 10k items</span></span></code></pre></div><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance: List Virtualization</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PROFILE</span></span>
<span class="line"><span>  DOM nodes: 10,000 rows × 8 columns = 80,000 nodes</span></span>
<span class="line"><span>  Scroll FPS: 12 (target: 60)</span></span>
<span class="line"><span>  Layout recalculations: constant</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ANALYZE</span></span>
<span class="line"><span>  Rendering all 10k rows at once</span></span>
<span class="line"><span>  No virtualization</span></span>
<span class="line"><span>  Each row has complex child components</span></span>
<span class="line"><span></span></span>
<span class="line"><span>OPTIMIZE</span></span>
<span class="line"><span>  import { useVirtualizer } from &#39;@tanstack/react-virtual&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const virtualizer = useVirtualizer({</span></span>
<span class="line"><span>    count: products.length,</span></span>
<span class="line"><span>    getScrollElement: () =&gt; parentRef.current,</span></span>
<span class="line"><span>    estimateSize: () =&gt; 48,</span></span>
<span class="line"><span>    overscan: 5,</span></span>
<span class="line"><span>  })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // Render only visible rows (~20 instead of 10,000)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  DOM nodes: ~200 (99.7% reduction)</span></span>
<span class="line"><span>  Scroll FPS: 60 (smooth)</span></span>
<span class="line"><span>  Memory: 45MB → 12MB</span></span></code></pre></div><hr><h2 id="quick-tips" tabindex="-1">Quick Tips <a class="header-anchor" href="#quick-tips" aria-label="Permalink to &quot;Quick Tips&quot;">​</a></h2><h3 id="measure-first" tabindex="-1">Measure First <a class="header-anchor" href="#measure-first" aria-label="Permalink to &quot;Measure First&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Don&#39;t guess - measure</span></span>
<span class="line"><span>Analyze the performance of /api/orders endpoint</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Include the symptom</span></span>
<span class="line"><span>The dashboard takes 3 seconds to load after login</span></span></code></pre></div><h3 id="common-wins" tabindex="-1">Common Wins <a class="header-anchor" href="#common-wins" aria-label="Permalink to &quot;Common Wins&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Issue</th><th>Solution</th></tr></thead><tbody><tr><td>Large bundle</td><td>Code splitting + tree shaking</td></tr><tr><td>Slow queries</td><td>Indexes + pagination</td></tr><tr><td>Many re-renders</td><td>Memoization + virtualization</td></tr><tr><td>Slow API</td><td>Caching + parallel requests</td></tr></tbody></table><hr><h2 id="related-scenarios" tabindex="-1">Related Scenarios <a class="header-anchor" href="#related-scenarios" aria-label="Permalink to &quot;Related Scenarios&quot;">​</a></h2><ul><li><a href="/pr-preview/pr-70/scenarios/debug-issue.html">Debug Issues</a> - Debug performance-related bugs</li><li><a href="/pr-preview/pr-70/scenarios/infrastructure.html">Infrastructure</a> - Scale for performance</li><li><a href="/pr-preview/pr-70/scenarios/api-design.html">API Design</a> - Design efficient APIs</li></ul>`,41)])])}const g=a(l,[["render",i]]);export{h as __pageData,g as default};
