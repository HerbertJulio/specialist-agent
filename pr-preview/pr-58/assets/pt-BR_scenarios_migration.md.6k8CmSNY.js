import{_ as s,o as n,c as e,a4 as p}from"./chunks/framework.BvZ_04UN.js";const g=JSON.parse('{"title":"Migração","description":"","frontmatter":{},"headers":[],"relativePath":"pt-BR/scenarios/migration.md","filePath":"pt-BR/scenarios/migration.md"}'),t={name:"pt-BR/scenarios/migration.md"};function i(r,a,l,o,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="migracao" tabindex="-1">Migração <a class="header-anchor" href="#migracao" aria-label="Permalink to &quot;Migração&quot;">​</a></h1><p>Cenários reais para migrar e modernizar código.</p><h2 id="typescript" tabindex="-1">JavaScript para TypeScript <a class="header-anchor" href="#typescript" aria-label="Permalink to &quot;JavaScript para TypeScript {#typescript}&quot;">​</a></h2><p><strong>Objetivo:</strong> Migrar um projeto JavaScript para TypeScript.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Migrate the user module from JavaScript to TypeScript</span></span></code></pre></div><p><strong>O que acontece:</strong></p><ol><li><strong>Escanear</strong> - Analisa os arquivos JS atuais e os padrões usados</li><li><strong>Planejar</strong> - Cria a ordem de migração (arquivos folha primeiro)</li><li><strong>Migrar</strong> - Converte os arquivos com tipagens adequadas</li><li><strong>Verificar</strong> - Garante que o build passa com o modo strict</li></ol><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Migration: JS → TypeScript</span></span>
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
<span class="line"><span>  npm test: 24/24 passing</span></span></code></pre></div><hr><h2 id="modernize" tabindex="-1">Padrões Legados para Modernos <a class="header-anchor" href="#modernize" aria-label="Permalink to &quot;Padrões Legados para Modernos {#modernize}&quot;">​</a></h2><p><strong>Objetivo:</strong> Modernizar padrões de código legado.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Modernize the auth module - it uses callbacks and var declarations</span></span></code></pre></div><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Migration: Legacy → Modern</span></span>
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
<span class="line"><span>  No callback patterns remaining</span></span></code></pre></div><hr><h2 id="framework" tabindex="-1">Migração de Framework <a class="header-anchor" href="#framework" aria-label="Permalink to &quot;Migração de Framework {#framework}&quot;">​</a></h2><p><strong>Objetivo:</strong> Migrar entre frameworks.</p><p><strong>Comando:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/migrate-framework from React to Vue 3</span></span></code></pre></div><p><strong>O que acontece:</strong></p><ol><li><strong>Analisar</strong> - Mapeia padrões React para equivalentes Vue</li><li><strong>Planejar</strong> - Cria a ordem de migração por dependência</li><li><strong>Converter</strong> - Transforma componentes e gerenciamento de estado</li><li><strong>Verificar</strong> - Garante que as funcionalidades foram preservadas</li></ol><p><strong>Resultado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Migration: React → Vue 3</span></span>
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
<span class="line"><span>  npm test: 15/15 passing</span></span></code></pre></div><hr><h2 id="dicas-rapidas" tabindex="-1">Dicas Rápidas <a class="header-anchor" href="#dicas-rapidas" aria-label="Permalink to &quot;Dicas Rápidas&quot;">​</a></h2><h3 id="estrategia-de-migracao" tabindex="-1">Estratégia de Migração <a class="header-anchor" href="#estrategia-de-migracao" aria-label="Permalink to &quot;Estratégia de Migração&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Especifique o que migrar</span></span>
<span class="line"><span>Migrate src/modules/auth from JavaScript to TypeScript</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Inclua restrições</span></span>
<span class="line"><span>Migrate the dashboard to Vue 3 - keep the same API contracts</span></span></code></pre></div><h3 id="migracoes-comuns" tabindex="-1">Migrações Comuns <a class="header-anchor" href="#migracoes-comuns" aria-label="Permalink to &quot;Migrações Comuns&quot;">​</a></h3><table tabindex="0"><thead><tr><th>De</th><th>Para</th><th>Agent</th></tr></thead><tbody><tr><td>JavaScript</td><td>TypeScript</td><td>@migrator</td></tr><tr><td>React</td><td>Vue 3</td><td>@migrator</td></tr><tr><td>REST</td><td>GraphQL</td><td>@api</td></tr><tr><td>Monolito</td><td>Microsserviços</td><td>@architect</td></tr><tr><td>Class components</td><td>Functional</td><td>@refactor</td></tr></tbody></table><hr><h2 id="cenarios-relacionados" tabindex="-1">Cenários Relacionados <a class="header-anchor" href="#cenarios-relacionados" aria-label="Permalink to &quot;Cenários Relacionados&quot;">​</a></h2><ul><li><a href="/pr-preview/pr-58/pt-BR/scenarios/build-feature.html">Construir Funcionalidades</a> - Construa com padrões modernos</li><li><a href="/pr-preview/pr-58/pt-BR/scenarios/code-review.html">Revisão de Código</a> - Revise o código migrado</li><li><a href="/pr-preview/pr-58/pt-BR/scenarios/infrastructure.html">Infraestrutura</a> - Atualize o deploy para o novo stack</li></ul>`,35)])])}const h=s(t,[["render",i]]);export{g as __pageData,h as default};
