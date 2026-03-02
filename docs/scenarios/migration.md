# Migration

::: info Agents: `@migrator` · Time: varies by scope
:::

Real scenarios for migrating and modernizing code.

## JavaScript to TypeScript {#typescript}

**Goal:** Migrate a JavaScript project to TypeScript.

**Command:**
```
Migrate the user module from JavaScript to TypeScript
```

**What happens:**
1. **Scan** - Analyzes current JS files and patterns
2. **Plan** - Creates migration order (leaf files first)
3. **Migrate** - Converts files with proper types
4. **Verify** - Ensures build passes with strict mode

**Result:**
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

## Legacy to Modern Patterns {#modernize}

**Goal:** Modernize legacy code patterns.

**Command:**
```
Modernize the auth module - it uses callbacks and var declarations
```

**Result:**
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

## Framework Migration {#framework}

**Goal:** Migrate between frameworks.

**Command:**
```
/migrate-framework from React to Vue 3
```

**What happens:**
1. **Analyze** - Maps React patterns to Vue equivalents
2. **Plan** - Creates migration order by dependency
3. **Convert** - Transforms components and state
4. **Verify** - Ensures functionality preserved

**Result:**
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

## Quick Tips

### Migration Strategy

```
# Specify what to migrate
Migrate src/modules/auth from JavaScript to TypeScript

# Include constraints
Migrate the dashboard to Vue 3 - keep the same API contracts
```

### Common Migrations

| From | To | Agent |
|------|----|-------|
| JavaScript | TypeScript | @migrator |
| React | Vue 3 | @migrator |
| REST | GraphQL | @api |
| Monolith | Microservices | @architect |
| Class components | Functional | @refactor |

---

## Related Scenarios

- [Build Features](/scenarios/build-feature) - Build with modern patterns
- [Code Review](/scenarios/code-review) - Review migrated code
- [Infrastructure](/scenarios/infrastructure) - Update deployment for new stack
