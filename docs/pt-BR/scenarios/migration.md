# Migração

Cenários reais para migrar e modernizar código.

## JavaScript para TypeScript {#typescript}

**Objetivo:** Migrar um projeto JavaScript para TypeScript.

**Comando:**
```
Migrate the user module from JavaScript to TypeScript
```

**O que acontece:**
1. **Escanear** - Analisa os arquivos JS atuais e os padrões usados
2. **Planejar** - Cria a ordem de migração (arquivos folha primeiro)
3. **Migrar** - Converte os arquivos com tipagens adequadas
4. **Verificar** - Garante que o build passa com o modo strict

**Resultado:**
```
Migration: JS → TypeScript

SCAN
  Files: 12 JS files in src/modules/user/
  Dependencies: express, prisma, zod
  Patterns: CommonJS requires, no JSDoc types

PLAN (leaf-first order)
  1. types/user.ts (new - shared types)
  2. user.validator.ts (no imports from module)
  3. user.repository.ts (imports validator)
  4. user.service.ts (imports repository)
  5. user.controller.ts (imports service)
  6. user.routes.ts (imports controller)
  7. index.ts (barrel export)

MIGRATE
  - Added interfaces: User, CreateUserDTO, UpdateUserDTO
  - Replaced require() with import/export
  - Added return types to all functions
  - Prisma types auto-inferred

VERIFIED
  tsc --strict: 0 errors
  npm test: 24/24 passing
```

---

## Padrões Legados para Modernos {#modernize}

**Objetivo:** Modernizar padrões de código legado.

**Comando:**
```
Modernize the auth module - it uses callbacks and var declarations
```

**Resultado:**
```
Migration: Legacy → Modern

SCAN
  Patterns found:
    - 15 callback-style functions
    - 42 var declarations
    - 8 string concatenations
    - Class-based components (React)

MIGRATE
  1. var → const/let (42 changes)
  2. Callbacks → async/await (15 functions)
  3. String concat → template literals (8 changes)
  4. Class components → functional + hooks (3 components)

  Before:
    var user = null;
    db.findUser(id, function(err, result) {
      if (err) return callback(err);
      user = result;
      callback(null, user);
    });

  After:
    const user = await db.findUser(id);
    return user;

VERIFIED
  npm test: 18/18 passing
  No var declarations remaining
  No callback patterns remaining
```

---

## Migração de Framework {#framework}

**Objetivo:** Migrar entre frameworks.

**Comando:**
```
/migrate-framework from React to Vue 3
```

**O que acontece:**
1. **Analisar** - Mapeia padrões React para equivalentes Vue
2. **Planejar** - Cria a ordem de migração por dependência
3. **Converter** - Transforma componentes e gerenciamento de estado
4. **Verificar** - Garante que as funcionalidades foram preservadas

**Resultado:**
```
Migration: React → Vue 3

MAPPING
  useState → ref/reactive
  useEffect → onMounted/watch
  useContext → provide/inject
  React.memo → computed
  JSX → SFC template

CONVERT (12 components)
  Before (React):
    const [count, setCount] = useState(0)
    useEffect(() => {
      document.title = `Count: ${count}`
    }, [count])

  After (Vue 3):
    const count = ref(0)
    watch(count, (val) => {
      document.title = `Count: ${val}`
    })

STATE MANAGEMENT
  Redux store → Pinia store
  useSelector → storeToRefs
  dispatch → direct action calls

VERIFIED
  All 12 components converted
  npm run build: success
  npm test: 15/15 passing
```

---

## Dicas Rápidas

### Estratégia de Migração

```
# Especifique o que migrar
Migrate src/modules/auth from JavaScript to TypeScript

# Inclua restrições
Migrate the dashboard to Vue 3 - keep the same API contracts
```

### Migrações Comuns

| De | Para | Agent |
|----|------|-------|
| JavaScript | TypeScript | @migrator |
| React | Vue 3 | @migrator |
| REST | GraphQL | @api |
| Monolito | Microsserviços | @architect |
| Class components | Functional | @refactor |

---

## Cenários Relacionados

- [Construir Funcionalidades](/pt-BR/scenarios/build-feature) - Construa com padrões modernos
- [Revisão de Código](/pt-BR/scenarios/code-review) - Revise o código migrado
- [Infraestrutura](/pt-BR/scenarios/infrastructure) - Atualize o deploy para o novo stack
