import{_ as s,o as n,c as e,a4 as p}from"./chunks/framework.Oghq104N.js";const u=JSON.parse('{"title":"Otimização de Performance","description":"","frontmatter":{},"headers":[],"relativePath":"pt-BR/scenarios/performance.md","filePath":"pt-BR/scenarios/performance.md"}'),i={name:"pt-BR/scenarios/performance.md"};function l(t,a,o,r,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="otimizacao-de-performance" tabindex="-1">Otimização de Performance <a class="header-anchor" href="#otimizacao-de-performance" aria-label="Permalink to &quot;Otimização de Performance&quot;">​</a></h1><p>Cenários reais para encontrar e corrigir problemas de performance.</p><h2 id="slow-page" tabindex="-1">Carregamento Lento de Página <a class="header-anchor" href="#slow-page" aria-label="Permalink to &quot;Carregamento Lento de Página {#slow-page}&quot;">​</a></h2><p><strong>Objetivo:</strong> Reduzir o carregamento inicial da página de 5s para menos de 1s.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optimize the dashboard page - it takes 5 seconds to load</span></span></code></pre></div><p><strong>O que acontece:</strong></p><ol><li><strong>Perfilar</strong> - Mede as métricas atuais (LCP, FID, CLS)</li><li><strong>Analisar</strong> - Identifica gargalos (tamanho do bundle, chamadas de API, renders)</li><li><strong>Otimizar</strong> - Aplica correções direcionadas</li><li><strong>Verificar</strong> - Mede a melhoria com evidências</li></ol><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance: Dashboard Optimization</span></span>
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
<span class="line"><span>  Bundle: 420KB initial (80% reduction)</span></span></code></pre></div><hr><h2 id="database" tabindex="-1">Query de Banco de Dados <a class="header-anchor" href="#database" aria-label="Permalink to &quot;Query de Banco de Dados {#database}&quot;">​</a></h2><p><strong>Objetivo:</strong> Corrigir endpoint de API lento (2s de tempo de resposta).</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optimize the /api/products endpoint - it takes 2 seconds to respond</span></span></code></pre></div><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance: API Endpoint Optimization</span></span>
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
<span class="line"><span>  Query plan: Index Scan (was Seq Scan)</span></span></code></pre></div><hr><h2 id="bundle" tabindex="-1">Tamanho do Bundle <a class="header-anchor" href="#bundle" aria-label="Permalink to &quot;Tamanho do Bundle {#bundle}&quot;">​</a></h2><p><strong>Objetivo:</strong> Reduzir o tamanho do bundle JavaScript.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Analyze and reduce the bundle size - it&#39;s over 2MB</span></span></code></pre></div><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance: Bundle Optimization</span></span>
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
<span class="line"><span>  Lighthouse Performance: 92 (was 48)</span></span></code></pre></div><hr><h2 id="render" tabindex="-1">Performance de Renderização <a class="header-anchor" href="#render" aria-label="Permalink to &quot;Performance de Renderização {#render}&quot;">​</a></h2><p><strong>Objetivo:</strong> Corrigir scroll travado em uma lista longa.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Optimize the product list - scrolling is janky with 10k items</span></span></code></pre></div><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Performance: List Virtualization</span></span>
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
<span class="line"><span>  Memory: 45MB → 12MB</span></span></code></pre></div><hr><h2 id="dicas-rapidas" tabindex="-1">Dicas Rápidas <a class="header-anchor" href="#dicas-rapidas" aria-label="Permalink to &quot;Dicas Rápidas&quot;">​</a></h2><h3 id="meca-primeiro" tabindex="-1">Meça Primeiro <a class="header-anchor" href="#meca-primeiro" aria-label="Permalink to &quot;Meça Primeiro&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Não adivinhe - meça</span></span>
<span class="line"><span>Analyze the performance of /api/orders endpoint</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Inclua o sintoma</span></span>
<span class="line"><span>The dashboard takes 3 seconds to load after login</span></span></code></pre></div><h3 id="ganhos-comuns" tabindex="-1">Ganhos Comuns <a class="header-anchor" href="#ganhos-comuns" aria-label="Permalink to &quot;Ganhos Comuns&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Problema</th><th>Solução</th></tr></thead><tbody><tr><td>Bundle grande</td><td>Code splitting + tree shaking</td></tr><tr><td>Queries lentas</td><td>Indexes + paginação</td></tr><tr><td>Muitos re-renders</td><td>Memoização + virtualização</td></tr><tr><td>API lenta</td><td>Caching + requisições paralelas</td></tr></tbody></table><hr><h2 id="cenarios-relacionados" tabindex="-1">Cenários Relacionados <a class="header-anchor" href="#cenarios-relacionados" aria-label="Permalink to &quot;Cenários Relacionados&quot;">​</a></h2><ul><li><a href="/pr-preview/pr-54/pt-BR/scenarios/debug-issue.html">Depurar Problemas</a> - Depurar bugs relacionados a performance</li><li><a href="/pr-preview/pr-54/pt-BR/scenarios/infrastructure.html">Infraestrutura</a> - Escalar para melhor performance</li><li><a href="/pr-preview/pr-54/pt-BR/scenarios/api-design.html">Design de API</a> - Projetar APIs eficientes</li></ul>`,40)])])}const g=s(i,[["render",l]]);export{u as __pageData,g as default};
