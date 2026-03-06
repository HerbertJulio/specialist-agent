import{_ as a,o as n,c as e,a3 as p}from"./chunks/framework.Bhlt5MtS.js";const g=JSON.parse('{"title":"Migration","description":"","frontmatter":{},"headers":[],"relativePath":"scenarios/migration.md","filePath":"scenarios/migration.md"}'),t={name:"scenarios/migration.md"};function i(l,s,r,o,c,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="migration" tabindex="-1">Migration <a class="header-anchor" href="#migration" aria-label="Permalink to &quot;Migration&quot;">​</a></h1><div class="info custom-block"><p class="custom-block-title">Agents: <code>@migrator</code> · Time: varies by scope</p></div><p>Real scenarios for migrating and modernizing code.</p><h2 id="typescript" tabindex="-1">JavaScript to TypeScript <a class="header-anchor" href="#typescript" aria-label="Permalink to &quot;JavaScript to TypeScript {#typescript}&quot;">​</a></h2><p><strong>Goal:</strong> Migrate a JavaScript project to TypeScript.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Migrate the user module from JavaScript to TypeScript</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li><strong>Scan</strong> - Analyzes current JS files and patterns</li><li><strong>Plan</strong> - Creates migration order (leaf files first)</li><li><strong>Migrate</strong> - Converts files with proper types</li><li><strong>Verify</strong> - Ensures build passes with strict mode</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Migration: JS → TypeScript</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SCAN</span></span>
<span class="line"><span>  Files: 12 JS files in src/modules/user/</span></span>
<span class="line"><span>  Dependencies: express, prisma, zod</span></span>
<span class="line"><span>  Patterns: CommonJS requires, no JSDoc types</span></span>
<span class="line"><span></span></span>
<span class="line"><span>PLAN (leaf-first order)</span></span>
<span class="line"><span>  1. types/user.ts (new - shared types)</span></span>
<span class="line"><span>  2. user.validator.ts (no imports from module)</span></span>
<span class="line"><span>  3. user.repository.ts (imports validator)</span></span>
<span class="line"><span>  4. user.service.ts (imports repository)</span></span>
<span class="line"><span>  5. user.controller.ts (imports service)</span></span>
<span class="line"><span>  6. user.routes.ts (imports controller)</span></span>
<span class="line"><span>  7. index.ts (barrel export)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MIGRATE</span></span>
<span class="line"><span>  - Added interfaces: User, CreateUserDTO, UpdateUserDTO</span></span>
<span class="line"><span>  - Replaced require() with import/export</span></span>
<span class="line"><span>  - Added return types to all functions</span></span>
<span class="line"><span>  - Prisma types auto-inferred</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  tsc --strict: 0 errors</span></span>
<span class="line"><span>  npm test: 24/24 passing</span></span></code></pre></div><hr><h2 id="modernize" tabindex="-1">Legacy to Modern Patterns <a class="header-anchor" href="#modernize" aria-label="Permalink to &quot;Legacy to Modern Patterns {#modernize}&quot;">​</a></h2><p><strong>Goal:</strong> Modernize legacy code patterns.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Modernize the auth module - it uses callbacks and var declarations</span></span></code></pre></div><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Migration: Legacy → Modern</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SCAN</span></span>
<span class="line"><span>  Patterns found:</span></span>
<span class="line"><span>    - 15 callback-style functions</span></span>
<span class="line"><span>    - 42 var declarations</span></span>
<span class="line"><span>    - 8 string concatenations</span></span>
<span class="line"><span>    - Class-based components (React)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MIGRATE</span></span>
<span class="line"><span>  1. var → const/let (42 changes)</span></span>
<span class="line"><span>  2. Callbacks → async/await (15 functions)</span></span>
<span class="line"><span>  3. String concat → template literals (8 changes)</span></span>
<span class="line"><span>  4. Class components → functional + hooks (3 components)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  Before:</span></span>
<span class="line"><span>    var user = null;</span></span>
<span class="line"><span>    db.findUser(id, function(err, result) {</span></span>
<span class="line"><span>      if (err) return callback(err);</span></span>
<span class="line"><span>      user = result;</span></span>
<span class="line"><span>      callback(null, user);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  After:</span></span>
<span class="line"><span>    const user = await db.findUser(id);</span></span>
<span class="line"><span>    return user;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  npm test: 18/18 passing</span></span>
<span class="line"><span>  No var declarations remaining</span></span>
<span class="line"><span>  No callback patterns remaining</span></span></code></pre></div><hr><h2 id="framework" tabindex="-1">Framework Migration <a class="header-anchor" href="#framework" aria-label="Permalink to &quot;Framework Migration {#framework}&quot;">​</a></h2><p><strong>Goal:</strong> Migrate between frameworks.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/migrate-framework from React to Vue 3</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li><strong>Analyze</strong> - Maps React patterns to Vue equivalents</li><li><strong>Plan</strong> - Creates migration order by dependency</li><li><strong>Convert</strong> - Transforms components and state</li><li><strong>Verify</strong> - Ensures functionality preserved</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Migration: React → Vue 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>MAPPING</span></span>
<span class="line"><span>  useState → ref/reactive</span></span>
<span class="line"><span>  useEffect → onMounted/watch</span></span>
<span class="line"><span>  useContext → provide/inject</span></span>
<span class="line"><span>  React.memo → computed</span></span>
<span class="line"><span>  JSX → SFC template</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CONVERT (12 components)</span></span>
<span class="line"><span>  Before (React):</span></span>
<span class="line"><span>    const [count, setCount] = useState(0)</span></span>
<span class="line"><span>    useEffect(() =&gt; {</span></span>
<span class="line"><span>      document.title = \`Count: \${count}\`</span></span>
<span class="line"><span>    }, [count])</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  After (Vue 3):</span></span>
<span class="line"><span>    const count = ref(0)</span></span>
<span class="line"><span>    watch(count, (val) =&gt; {</span></span>
<span class="line"><span>      document.title = \`Count: \${val}\`</span></span>
<span class="line"><span>    })</span></span>
<span class="line"><span></span></span>
<span class="line"><span>STATE MANAGEMENT</span></span>
<span class="line"><span>  Redux store → Pinia store</span></span>
<span class="line"><span>  useSelector → storeToRefs</span></span>
<span class="line"><span>  dispatch → direct action calls</span></span>
<span class="line"><span></span></span>
<span class="line"><span>VERIFIED</span></span>
<span class="line"><span>  All 12 components converted</span></span>
<span class="line"><span>  npm run build: success</span></span>
<span class="line"><span>  npm test: 15/15 passing</span></span></code></pre></div><hr><h2 id="architecture" tabindex="-1">Architecture Migration <a class="header-anchor" href="#architecture" aria-label="Permalink to &quot;Architecture Migration {#architecture}&quot;">​</a></h2><p><strong>Goal:</strong> Migrate between architecture patterns.</p><p><strong>Command:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/migrate-architecture mvc to clean full project</span></span></code></pre></div><p><strong>What happens:</strong></p><ol><li><strong>Assess</strong> - Detects current architecture with confidence score</li><li><strong>Plan</strong> - Maps files to new locations, orders by coupling</li><li><strong>Execute</strong> - Moves files, creates layers, updates imports</li><li><strong>Validate</strong> - TypeScript check, import rules, tests</li></ol><p><strong>Result:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Architecture Migration Complete</span></span>
<span class="line"><span>From: MVC (Layered)</span></span>
<span class="line"><span>To: Clean Architecture (Full)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Files moved: 24</span></span>
<span class="line"><span>Files created: 8</span></span>
<span class="line"><span>Imports updated: 47</span></span>
<span class="line"><span>Barrel exports created: 12</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Validation:</span></span>
<span class="line"><span>  TypeScript: compiles</span></span>
<span class="line"><span>  Import rules: no violations</span></span>
<span class="line"><span>  Tests: passing</span></span>
<span class="line"><span></span></span>
<span class="line"><span>docs/ARCHITECTURE.md: generated</span></span></code></pre></div><p><strong>Supported patterns:</strong> Modular, Clean Architecture, Hexagonal, DDD, FSD, CQRS, Event-Driven, Modular Monolith, Atomic, MVC, Microservices, Serverless, and more.</p><p><strong>Variants:</strong></p><ul><li><strong>Full</strong> - Complete implementation with all layers</li><li><strong>Lite</strong> - Fewer layers, same principles (smaller teams)</li></ul><hr><h2 id="quick-tips" tabindex="-1">Quick Tips <a class="header-anchor" href="#quick-tips" aria-label="Permalink to &quot;Quick Tips&quot;">​</a></h2><h3 id="migration-strategy" tabindex="-1">Migration Strategy <a class="header-anchor" href="#migration-strategy" aria-label="Permalink to &quot;Migration Strategy&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Specify what to migrate</span></span>
<span class="line"><span>Migrate src/modules/auth from JavaScript to TypeScript</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Include constraints</span></span>
<span class="line"><span>Migrate the dashboard to Vue 3 - keep the same API contracts</span></span></code></pre></div><h3 id="common-migrations" tabindex="-1">Common Migrations <a class="header-anchor" href="#common-migrations" aria-label="Permalink to &quot;Common Migrations&quot;">​</a></h3><table tabindex="0"><thead><tr><th>From</th><th>To</th><th>Agent</th></tr></thead><tbody><tr><td>JavaScript</td><td>TypeScript</td><td>@migrator</td></tr><tr><td>React</td><td>Vue 3</td><td>@migrator</td></tr><tr><td>REST</td><td>GraphQL</td><td>@api</td></tr><tr><td>Monolith</td><td>Microservices</td><td>@architect</td></tr><tr><td>MVC</td><td>Clean Architecture</td><td>@architect</td></tr><tr><td>Flat</td><td>Modular</td><td>@architect</td></tr><tr><td>Modular</td><td>Hexagonal</td><td>@architect</td></tr><tr><td>Class components</td><td>Functional</td><td>@refactor</td></tr></tbody></table><hr><h2 id="related-scenarios" tabindex="-1">Related Scenarios <a class="header-anchor" href="#related-scenarios" aria-label="Permalink to &quot;Related Scenarios&quot;">​</a></h2><ul><li><a href="/scenarios/build-feature.html">Build Features</a> - Build with modern patterns</li><li><a href="/scenarios/code-review.html">Code Review</a> - Review migrated code</li><li><a href="/scenarios/infrastructure.html">Infrastructure</a> - Update deployment for new stack</li></ul>`,48)])])}const h=a(t,[["render",i]]);export{g as __pageData,h as default};
