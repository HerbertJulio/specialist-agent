/**
 * Architecture Guide Generator
 *
 * Generates framework-specific ARCHITECTURE.md files for any
 * architecture pattern + framework + variant combination.
 *
 * Uses the existing pack ARCHITECTURE.md files as the base for 'modular'
 * pattern, and generates new ones for other patterns by adapting the
 * structure to the target architecture while preserving framework-specific
 * conventions (Server Components, composables, etc.)
 */

import { existsSync, readFileSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { ARCHITECTURE_PATTERNS, FRAMEWORK_ADAPTATIONS } from './architectures.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

// ── Main Generator ────────────────────────────────────

export function generateArchitectureGuide(options) {
  const {
    architecture,     // 'modular', 'clean', 'hexagonal', 'fsd', 'ddd', etc.
    framework,        // 'nextjs', 'react', 'vue', 'nuxt', 'svelte', 'angular', 'astro'
    variant = 'full', // 'full' | 'lite'
    nextjsRouter = null, // 'app-router' | 'pages-router' | null
  } = options

  // For modular architecture, use the existing pack ARCHITECTURE.md if available
  if (architecture === 'modular' && variant === 'full') {
    const packArchPath = join(ROOT, 'packs', framework, 'ARCHITECTURE.md')
    if (existsSync(packArchPath)) {
      return readFileSync(packArchPath, 'utf-8')
    }
  }

  // Generate from template
  const generator = GENERATORS[architecture]
  if (!generator) {
    return generateGenericGuide(architecture, framework, variant)
  }

  return generator(framework, variant, { nextjsRouter })
}

// ── Framework Helpers ─────────────────────────────────

function fw(framework) {
  const configs = {
    nextjs: {
      name: 'Next.js',
      lang: 'TypeScript',
      componentExt: 'tsx',
      hookDir: 'hooks',
      hookPrefix: 'use',
      stateClient: 'Zustand',
      stateServer: 'TanStack React Query',
      testLib: 'Vitest + React Testing Library',
      validation: 'Zod',
      styling: 'Tailwind CSS / CSS Modules',
      router: 'App Router (file-system)',
      componentPattern: 'React Server Components + Client Components',
    },
    react: {
      name: 'React',
      lang: 'TypeScript',
      componentExt: 'tsx',
      hookDir: 'hooks',
      hookPrefix: 'use',
      stateClient: 'Zustand',
      stateServer: 'TanStack React Query',
      testLib: 'Vitest + React Testing Library',
      validation: 'Zod',
      styling: 'Tailwind CSS / CSS Modules',
      router: 'React Router 6',
      componentPattern: 'Functional Components',
    },
    vue: {
      name: 'Vue 3',
      lang: 'TypeScript',
      componentExt: 'vue',
      hookDir: 'composables',
      hookPrefix: 'use',
      stateClient: 'Pinia',
      stateServer: 'TanStack Vue Query',
      testLib: 'Vitest + @vue/test-utils',
      validation: 'Zod',
      styling: 'Scoped CSS / Tailwind',
      router: 'Vue Router 4',
      componentPattern: '<script setup lang="ts">',
    },
    nuxt: {
      name: 'Nuxt 3',
      lang: 'TypeScript',
      componentExt: 'vue',
      hookDir: 'composables',
      hookPrefix: 'use',
      stateClient: 'Pinia',
      stateServer: 'TanStack Vue Query',
      testLib: 'Vitest + @vue/test-utils',
      validation: 'Zod',
      styling: 'Scoped CSS / Tailwind',
      router: 'File-based routing (pages/)',
      componentPattern: '<script setup lang="ts"> + auto-imports',
    },
    svelte: {
      name: 'SvelteKit',
      lang: 'TypeScript',
      componentExt: 'svelte',
      hookDir: 'stores',
      hookPrefix: '',
      stateClient: 'Svelte stores',
      stateServer: 'TanStack Svelte Query',
      testLib: 'Vitest + @testing-library/svelte',
      validation: 'Zod',
      styling: 'Scoped CSS / Tailwind',
      router: 'File-based routing (+page.svelte)',
      componentPattern: 'Svelte Components + Load Functions',
    },
    angular: {
      name: 'Angular',
      lang: 'TypeScript',
      componentExt: 'ts',
      hookDir: 'services',
      hookPrefix: '',
      stateClient: 'NgRx Signals',
      stateServer: 'TanStack Angular Query',
      testLib: 'Vitest + Angular Testing Library',
      validation: 'Zod',
      styling: 'Component styles / Tailwind',
      router: 'Angular Router (lazy-loaded)',
      componentPattern: 'Standalone Components + Signals',
    },
    astro: {
      name: 'Astro',
      lang: 'TypeScript',
      componentExt: 'astro',
      hookDir: 'utils',
      hookPrefix: '',
      stateClient: 'Nanostores',
      stateServer: 'Astro data fetching',
      testLib: 'Vitest',
      validation: 'Zod',
      styling: 'Scoped CSS / Tailwind',
      router: 'File-based routing (pages/)',
      componentPattern: 'Astro Components + Framework Islands',
    },
  }
  return configs[framework] || configs.react
}

// ── Architecture Generators ───────────────────────────

const GENERATORS = {
  modular: generateModularGuide,
  'modular-lite': generateModularLiteGuide,
  clean: generateCleanGuide,
  hexagonal: generateHexagonalGuide,
  fsd: generateFSDGuide,
  ddd: generateDDDGuide,
  'modular-monolith': generateModularMonolithGuide,
  cqrs: generateCQRSGuide,
  atomic: generateAtomicGuide,
  mvc: generateMVCGuide,
}

function generateModularGuide(framework, variant, options) {
  if (variant === 'lite') return generateModularLiteGuide(framework, variant, options)
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'

  return `# ARCHITECTURE.md -- Architecture & Patterns Guide (${f.name})

> This document is the **source of truth** for all subagents.
> Every architectural decision must be documented here.

---

## 1. Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Language | ${f.lang} (strict) |
| Architecture | Modular (Feature-Based) -- Full |
| Components | ${f.componentPattern} |
| Client state | ${f.stateClient} |
| Server state | ${f.stateServer} |
| Routing | ${f.router} |
| Testing | ${f.testLib} |
| Validation | ${f.validation} |

### Architecture Flow

\`\`\`
Service (HTTP only) --> Adapter (parse) --> ${f.hookDir === 'composables' ? 'Composable' : 'Hook'} (orchestrate) --> Component
\`\`\`

---

## 2. Directory Structure

\`\`\`
${srcPrefix}
├── modules/                      # Feature modules (bounded contexts)
│   ├── [feature]/
│   │   ├── components/
│   │   ├── ${f.hookDir}/
│   │   ├── services/
│   │   ├── adapters/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── __tests__/
│   │   └── index.ts              # Barrel export (public API)
│
├── shared/                       # Shared across modules
│   ├── components/
│   ├── ${f.hookDir}/
│   ├── services/
│   ├── types/
│   ├── utils/                    # Pure functions
│   └── helpers/                  # Functions with side effects
\`\`\`

### Import Rules

\`\`\`
modules/auth  <->  shared/          OK
modules/auth  -->  modules/market   NO (modules don't import from each other)
shared/       -->  modules/auth     NO (shared doesn't import from modules)
\`\`\`

---

## 3. Responsibility Layers

### Services -- Pure HTTP Calls
- NO try/catch, NO transformation, NO business logic
- One file per domain/resource
- Export as object with methods

### Adapters -- Contract Parsers
- Pure functions: API response <-> App contract
- Rename fields (snake_case -> camelCase)
- Convert types (string -> Date, cents -> decimal)

### ${f.hookDir === 'composables' ? 'Composables' : 'Hooks'} -- Orchestration
- Connect service -> adapter -> ${f.stateServer}
- Manage loading, error, empty states
- Prefix with \`${f.hookPrefix}\`

### Stores -- Client State Only
- ${f.stateClient} for UI state, filters, preferences
- NO server state (use ${f.stateServer} instead)
- NO HTTP calls inside stores

### Types
- \`.types.ts\` for API types (raw response, snake_case)
- \`.contracts.ts\` for app contracts (camelCase, correct types)
- NO \`any\`

---

## 4. Rules

- Components < 200 lines, typed props
- Barrel exports (index.ts) per module
- Utils = pure functions | Helpers = side effects
- Error handling: centralized in ${f.hookDir} layer
`
}

function generateModularLiteGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'

  return `# ARCHITECTURE.md -- Architecture & Patterns Guide (${f.name})

> Simplified Modular Architecture -- fewer layers, same principles.

---

## 1. Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Language | ${f.lang} (strict) |
| Architecture | Modular (Feature-Based) -- Simplified |
| Client state | ${f.stateClient} |
| Server state | ${f.stateServer} |

### Architecture Flow

\`\`\`
Service (HTTP + transform) --> ${f.hookDir === 'composables' ? 'Composable' : 'Hook'} (orchestrate) --> Component
\`\`\`

---

## 2. Directory Structure

\`\`\`
${srcPrefix}
├── modules/
│   ├── [feature]/
│   │   ├── components/
│   │   ├── ${f.hookDir}/
│   │   ├── services/         # HTTP + data transformation (no separate adapters)
│   │   ├── types/
│   │   └── index.ts
│
├── shared/
│   ├── components/
│   ├── utils/
│   └── types/
\`\`\`

### Key Differences from Full

- **No adapters/**: data transformation done in services directly
- **No stores/**: co-locate state with ${f.hookDir}
- **No helpers/**: merge into utils or ${f.hookDir}
- Same import rules: modules don't import from each other

---

## 3. Rules

- Services: HTTP calls + response transformation (combined)
- ${f.hookDir === 'composables' ? 'Composables' : 'Hooks'}: orchestrate service calls + manage state
- Types: \`.types.ts\` for API + app contracts (single file per domain)
- Components < 200 lines, typed props
- Barrel exports (index.ts) per module
`
}

function generateCleanGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'
  const isLite = variant === 'lite'

  if (isLite) {
    return `# ARCHITECTURE.md -- Clean Architecture Simplified (${f.name})

> Two-layer Clean Architecture: Core + Infrastructure.

---

## 1. Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Architecture | Clean Architecture -- Simplified |
| Dependency Rule | core/ has ZERO framework imports |

---

## 2. Directory Structure

\`\`\`
${srcPrefix}
├── core/                         # Domain + Application (merged)
│   ├── entities/                 # Business objects (pure TS)
│   ├── use-cases/                # Application logic
│   └── ports/                    # Interfaces for external deps
│
├── infra/                        # Infrastructure + Presentation (merged)
│   ├── database/                 # Repository implementations
│   ├── http/                     # API clients, REST controllers
│   ├── components/               # UI components
│   └── ${f.hookDir}/
\`\`\`

### Dependency Rule

\`\`\`
infra/ --> core/    OK (infra implements core interfaces)
core/ --> infra/    NEVER (core has no external dependencies)
\`\`\`

---

## 3. Key Rules

- **core/** has ZERO imports from framework (${f.name}), database, or HTTP libraries
- **ports/** define interfaces that **infra/** implements
- Use cases contain business logic, not components or services
- Entities are pure TypeScript objects with behavior
`
  }

  return `# ARCHITECTURE.md -- Clean Architecture (${f.name})

> Four-layer Clean Architecture with strict dependency rule.
> Dependencies point INWARD only: Frameworks -> Adapters -> Use Cases -> Entities.

---

## 1. Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Architecture | Clean Architecture -- Full |
| Client state | ${f.stateClient} |
| Server state | ${f.stateServer} |
| Dependency Rule | All dependencies point INWARD |

---

## 2. Directory Structure

\`\`\`
${srcPrefix}
├── domain/                       # Innermost: Enterprise Business Rules
│   ├── entities/                 # Business objects with behavior
│   ├── value-objects/            # Immutable, equality by value
│   ├── repositories/             # Interfaces ONLY (no implementations)
│   └── errors/                   # Domain-specific errors
│
├── application/                  # Use Cases: Application Business Rules
│   ├── use-cases/                # One class per use case
│   ├── dtos/                     # Data Transfer Objects
│   └── ports/                    # Input/Output interfaces
│
├── infrastructure/               # Outer: Frameworks & Drivers
│   ├── database/                 # Repository implementations
│   ├── http/                     # API clients, external services
│   ├── messaging/                # Message queue adapters
│   └── repositories/             # Concrete repository implementations
│
├── presentation/                 # Outer: UI Layer
│   ├── components/               # ${f.componentPattern}
│   ├── ${f.hookDir}/
│   ├── stores/                   # ${f.stateClient}
│   └── pages/
\`\`\`

### Dependency Rule (Iron Law)

\`\`\`
presentation/ --> application/    OK (uses use cases)
presentation/ --> domain/         OK (uses entities/types)
presentation/ --> infrastructure/ NEVER
infrastructure/ --> application/  OK (implements ports)
infrastructure/ --> domain/       OK (implements repositories)
application/ --> domain/          OK (uses entities)
application/ --> infrastructure/  NEVER
domain/ --> anything              NEVER (zero external deps)
\`\`\`

---

## 3. Key Layers

### Domain (entities/, value-objects/)
- Pure TypeScript, no framework imports
- Business rules live here
- Repository interfaces (not implementations)

### Application (use-cases/)
- One class/function per use case: \`CreateOrder\`, \`GetUserById\`
- Depends only on domain
- DTOs for input/output

### Infrastructure (database/, http/)
- Implements domain interfaces
- Database, HTTP clients, message queues
- Framework-specific code lives here

### Presentation (components/, ${f.hookDir}/)
- ${f.componentPattern}
- ${f.hookDir} orchestrate use cases
- ${f.stateClient} for UI state only

---

## 4. Rules

- domain/ has ZERO imports from any other layer
- application/ only imports from domain/
- Use case per file (Single Responsibility)
- Repository pattern: interface in domain/, implementation in infrastructure/
- DTOs at layer boundaries (never pass entities to presentation)
`
}

function generateHexagonalGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'
  const isLite = variant === 'lite'

  if (isLite) {
    return `# ARCHITECTURE.md -- Hexagonal Architecture Simplified (${f.name})

> Ports & Adapters with flat structure.

---

## 1. Directory Structure

\`\`\`
${srcPrefix}
├── core/                         # Domain + Use Cases
│   ├── domain/                   # Entities, value objects
│   ├── ports/                    # All interfaces (no in/out split)
│   └── use-cases/                # Application logic
│
├── adapters/                     # All implementations (no in/out split)
│   ├── web/                      # ${f.componentPattern}
│   ├── database/                 # Repository implementations
│   └── http-client/              # External API clients
\`\`\`

### Rule

\`\`\`
core/ has ZERO external dependencies
adapters/ implement core/ports/ interfaces
\`\`\`
`
  }

  return `# ARCHITECTURE.md -- Hexagonal Architecture (${f.name})

> Ports & Adapters: Core domain isolated by explicit interfaces.

---

## 1. Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Architecture | Hexagonal (Ports & Adapters) -- Full |
| Core | Domain model with zero external dependencies |
| Ports | Interfaces that define how the core communicates |
| Adapters | Implementations that connect the core to the outside world |

---

## 2. Directory Structure

\`\`\`
${srcPrefix}
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── services/             # Domain services
│   ├── ports/
│   │   ├── in/                   # Driving ports (use case interfaces)
│   │   └── out/                  # Driven ports (repository/external interfaces)
│   └── use-cases/                # Implements driving ports
│
├── adapters/
│   ├── in/                       # Driving adapters (trigger the app)
│   │   ├── web/                  # ${f.componentPattern}, controllers
│   │   └── cli/                  # CLI commands (if applicable)
│   └── out/                      # Driven adapters (called by the app)
│       ├── database/             # Repository implementations
│       ├── http-client/          # External API clients
│       └── messaging/            # Message broker adapters
\`\`\`

### Port & Adapter Flow

\`\`\`
[User/External] -> Driving Adapter -> Driving Port -> Use Case -> Driven Port -> Driven Adapter -> [DB/API/Queue]
\`\`\`

---

## 3. Key Rules

- **core/** has ZERO imports from adapters/ or any framework
- **Ports** are interfaces defined in core/
- **Adapters** implement port interfaces
- Driving adapters (in/) trigger application logic
- Driven adapters (out/) are called by application logic
- Use cases implement driving ports and consume driven ports
- To swap infrastructure (e.g., PostgreSQL -> MongoDB), only change the adapter
`
}

function generateFSDGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'
  const isLite = variant === 'lite'

  const layers = isLite
    ? `\`\`\`
${srcPrefix}
├── app/                          # App init, providers, routing
├── pages/                        # Full page compositions
├── features/                     # User interaction units
│   └── [feature]/
│       ├── ui/
│       └── model/
├── entities/                     # Business entities
│   └── [entity]/
│       ├── ui/
│       └── model/
└── shared/                       # Reusable infrastructure
    ├── ui/
    └── lib/
\`\`\``
    : `\`\`\`
${srcPrefix}
├── app/                          # App init, providers, global styles
├── processes/                    # Cross-page business flows (optional)
├── pages/                        # Full page compositions
├── widgets/                      # Composite UI blocks
├── features/                     # User interaction units
│   └── [feature]/
│       ├── ui/                   # Components
│       ├── model/                # State, types, logic
│       ├── api/                  # API calls
│       └── lib/                  # Utils
├── entities/                     # Business entities
│   └── [entity]/
│       ├── ui/
│       ├── model/
│       └── api/
└── shared/                       # Reusable infrastructure
    ├── ui/                       # Design system components
    ├── lib/                      # Utilities
    ├── api/                      # API client
    └── config/                   # App config
\`\`\``

  return `# ARCHITECTURE.md -- Feature-Sliced Design (${f.name})

> Strict layered architecture with import rules.
> Import direction: app -> pages -> widgets -> features -> entities -> shared

---

## 1. Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Architecture | Feature-Sliced Design -- ${isLite ? 'Simplified' : 'Full'} |
| Layers | ${isLite ? '5 (no processes/widgets)' : '7'} |
| Import rule | Top-down only, never upward |

---

## 2. Directory Structure

${layers}

### Import Rules (strict)

\`\`\`
app -> pages -> ${isLite ? '' : 'widgets -> '}features -> entities -> shared
\`\`\`

A layer can ONLY import from layers BELOW it. Never upward, never sideways at the same level.

---

## 3. Slice Structure

Each feature/entity is a "slice" with segments:

- **ui/**: Components specific to this slice
- **model/**: State management, types, business logic
- **api/**: Data fetching for this slice
- **lib/**: Utilities specific to this slice

Each slice has a public API via \`index.ts\`.

---

## 4. Key Rules

- NEVER import upward (features cannot import from pages)
- NEVER import sideways (feature A cannot import from feature B)
- Cross-slice communication goes through shared/ or via events
- Each slice is self-contained with its own segments
`
}

function generateDDDGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'
  const isLite = variant === 'lite'

  if (isLite) {
    return `# ARCHITECTURE.md -- Domain-Driven Design Simplified (${f.name})

> DDD with simplified tactical patterns.

---

## 1. Directory Structure

\`\`\`
${srcPrefix}
├── modules/                      # One per bounded context
│   └── [context]/
│       ├── domain/
│       │   ├── entities/         # Business objects
│       │   ├── value-objects/    # Immutable types
│       │   └── events/           # Domain events
│       ├── application/
│       │   └── handlers/         # Command/query handlers
│       ├── infrastructure/       # DB, HTTP, messaging
│       └── index.ts              # Public API
│
└── shared/                       # Shared kernel
    ├── types/
    └── events/
\`\`\`

---

## 2. Key Rules

- Each module = one bounded context
- Domain layer has ZERO external dependencies
- Communicate between contexts via events or shared kernel
- Entities encapsulate business rules (not anemic models)
`
  }

  return `# ARCHITECTURE.md -- Domain-Driven Design (${f.name})

> Full DDD with bounded contexts and tactical patterns.

---

## 1. Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Architecture | Domain-Driven Design -- Full |
| Strategic | Bounded Contexts, Context Mapping |
| Tactical | Aggregates, Value Objects, Domain Events |

---

## 2. Directory Structure

\`\`\`
${srcPrefix}
├── bounded-contexts/
│   └── [context]/
│       ├── domain/
│       │   ├── aggregates/
│       │   │   └── [aggregate]/
│       │   │       ├── AggregateRoot.ts
│       │   │       ├── Entity.ts
│       │   │       └── ValueObject.ts
│       │   ├── events/
│       │   │   └── [DomainEvent].ts
│       │   ├── repositories/     # Interfaces only
│       │   └── services/         # Domain services
│       ├── application/
│       │   ├── commands/
│       │   ├── queries/
│       │   └── handlers/
│       └── infrastructure/
│           ├── persistence/
│           └── messaging/
│
└── shared-kernel/
    ├── types/
    └── events/
\`\`\`

---

## 3. Tactical Patterns

### Aggregate Root
- Entry point for modifications to an aggregate
- Ensures consistency within the aggregate boundary
- Only aggregate roots are referenced by ID from outside

### Value Object
- Immutable, equality by value (not identity)
- Examples: Money, Email, Address, DateRange

### Domain Event
- Past tense: \`OrderPlaced\`, \`PaymentReceived\`
- Published when something important happens in the domain
- Consumed by other bounded contexts

---

## 4. Key Rules

- Domain layer has ZERO framework dependencies
- Aggregate Root is the only way to modify an aggregate
- Value Objects are immutable
- Bounded contexts communicate via events or ACL
- Ubiquitous language: use business terms, not technical ones
`
}

function generateModularMonolithGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'
  const isLite = variant === 'lite'

  if (isLite) {
    return `# ARCHITECTURE.md -- Modular Monolith Simplified (${f.name})

> Single deployment with module boundaries enforced by barrel exports.

---

## 1. Directory Structure

\`\`\`
${srcPrefix}
├── modules/
│   └── [module]/
│       ├── services/             # Business logic + data access
│       ├── types/                # Module types
│       └── index.ts              # Public API (barrel export)
│
└── shared/
    ├── database/
    └── utils/
\`\`\`

---

## 2. Key Rules

- Single package.json, single deployment
- Modules communicate ONLY through barrel exports (index.ts)
- No direct imports between module internals
- When two modules need to share: move to shared/
`
  }

  return `# ARCHITECTURE.md -- Modular Monolith (${f.name})

> Single deployment with strict module boundaries and internal layering.

---

## 1. Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Architecture | Modular Monolith -- Full |
| Deployment | Single unit |
| Boundaries | Enforced via barrel exports + internal layers |

---

## 2. Directory Structure

\`\`\`
${srcPrefix}
├── modules/
│   └── [module]/
│       ├── domain/
│       │   ├── entities/
│       │   ├── value-objects/
│       │   └── repositories/     # Interfaces
│       ├── application/
│       │   ├── use-cases/
│       │   └── dtos/
│       ├── infrastructure/
│       │   ├── persistence/
│       │   └── http/
│       └── index.ts              # Public API
│
└── shared/
    ├── database/
    ├── config/
    └── utils/
\`\`\`

---

## 3. Key Rules

- **Single deployment** but **strict module boundaries**
- Modules communicate ONLY through their public API (index.ts)
- Each module has domain/application/infrastructure layers
- domain/ has ZERO external dependencies (same as Clean Architecture)
- This IS the stepping stone to microservices: extract modules when needed
- To extract a module to a microservice: move its folder, add network boundary
`
}

function generateCQRSGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'
  const isLite = variant === 'lite'

  return `# ARCHITECTURE.md -- CQRS (${f.name})

> Command Query Responsibility Segregation${isLite ? ' -- without Event Sourcing' : ''}.

---

## 1. Directory Structure

${isLite ? `\`\`\`
${srcPrefix}
├── commands/                     # Write operations
│   └── CreateOrder.ts
├── queries/                      # Read operations
│   └── GetOrderById.ts
├── handlers/                     # Both command + query handlers
│   ├── CreateOrderHandler.ts
│   └── GetOrderByIdHandler.ts
├── models/                       # Shared model (single DB)
└── events/                       # Domain events (optional)
\`\`\`` : `\`\`\`
${srcPrefix}
├── commands/
│   └── CreateOrder.ts
├── command-handlers/
│   └── CreateOrderHandler.ts
├── queries/
│   └── GetOrderById.ts
├── query-handlers/
│   └── GetOrderByIdHandler.ts
├── write-models/                 # Write-optimized models
├── read-models/                  # Read-optimized projections
├── events/                       # Domain events
├── projections/                  # Event -> Read Model updaters
└── event-store/                  # Event persistence
\`\`\``}

---

## 2. Key Rules

- Commands change state, Queries read state (never both)
- Command handlers validate and execute writes
- Query handlers optimize for reads (denormalized if needed)
${isLite ? '- Same database for reads and writes (simplified)' : '- Separate read/write databases for optimal performance'}
${isLite ? '' : '- Event Store records all state changes as events\n- Projections build read models from events'}
`
}

function generateAtomicGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'
  const isLite = variant === 'lite'

  return `# ARCHITECTURE.md -- Atomic Design (${f.name})

> Components organized by granularity: ${isLite ? 'primitives, organisms, pages' : 'atoms, molecules, organisms, templates, pages'}.

---

## 1. Directory Structure

${isLite ? `\`\`\`
${srcPrefix}
├── components/
│   ├── primitives/               # Atoms + Molecules (merged)
│   │   ├── Button.${f.componentExt}
│   │   ├── Input.${f.componentExt}
│   │   └── SearchBar.${f.componentExt}
│   └── organisms/
│       ├── Header.${f.componentExt}
│       └── ProductCard.${f.componentExt}
├── pages/
├── services/
└── types/
\`\`\`` : `\`\`\`
${srcPrefix}
├── components/
│   ├── atoms/                    # Smallest units (Button, Input, Icon)
│   ├── molecules/                # Combinations (SearchBar, FormField)
│   ├── organisms/                # Complex blocks (Header, ProductCard)
│   └── templates/                # Page layouts (DashboardTemplate)
├── pages/
├── ${f.hookDir}/
├── services/
└── types/
\`\`\``}

---

## 2. Component Hierarchy

\`\`\`
${isLite ? 'Pages -> Organisms -> Primitives' : 'Pages -> Templates -> Organisms -> Molecules -> Atoms'}
\`\`\`

Each level can only use components from levels below it.

---

## 3. Key Rules

- ${isLite ? 'Primitives' : 'Atoms/Molecules'}: no business logic, pure presentation
- Organisms: can contain business logic, composed from smaller components
- ${isLite ? '' : 'Templates: define page structure without data\n- '}Pages: compose ${isLite ? 'organisms' : 'templates'} with data
`
}

function generateMVCGuide(framework, variant, options) {
  const f = fw(framework)
  const srcPrefix = framework === 'nuxt' ? '' : 'src/'
  const isLite = variant === 'lite'

  return `# ARCHITECTURE.md -- MVC / Layered Architecture (${f.name})

> Horizontal slicing by technical layer${isLite ? ' (simplified)' : ''}.

---

## 1. Directory Structure

${isLite ? `\`\`\`
${srcPrefix}
├── services/                     # Business logic + data access (merged)
├── models/                       # Data models
├── routes/                       # Route definitions
└── utils/
\`\`\`` : `\`\`\`
${srcPrefix}
├── controllers/                  # Request handling
├── services/                     # Business logic
├── repositories/                 # Data access
├── models/                       # Data models / entities
├── middlewares/                   # Cross-cutting concerns
├── routes/                       # Route definitions
├── config/
└── utils/
\`\`\``}

---

## 2. Layer Responsibilities

${isLite ? `- **services/**: Business logic + data access combined
- **models/**: Data structures and validation
- **routes/**: HTTP route definitions` : `- **controllers/**: Handle HTTP requests, delegate to services
- **services/**: Business logic, orchestration
- **repositories/**: Data access, database queries
- **models/**: Data structures, ORM entities
- **middlewares/**: Auth, logging, validation
- **routes/**: HTTP route mapping`}

---

## 3. Key Rules

- ${isLite ? 'Services handle both logic and data access' : 'Controllers don\'t contain business logic'}
- ${isLite ? '' : 'Services don\'t access the database directly (use repositories)\n- '}Models define data structure and validation
- Each layer only calls the layer below it
`
}

// ── Generic Fallback ──────────────────────────────────

function generateGenericGuide(architecture, framework, variant) {
  const f = fw(framework)
  const pattern = ARCHITECTURE_PATTERNS[architecture]
  const name = pattern?.name || architecture

  return `# ARCHITECTURE.md -- ${name} (${f.name})

> Architecture guide for ${name} pattern with ${f.name}.
> See docs/ for detailed patterns.

## Overview

| Concept | Implementation |
|---------|---------------|
| Framework | ${f.name} |
| Architecture | ${name} -- ${variant === 'full' ? 'Full' : 'Simplified'} |
| Language | ${f.lang} (strict) |

## Key Principles

${pattern?.description || 'Follow the architecture patterns defined in this document.'}

## Best For

${pattern?.bestFor?.description || 'See architecture documentation for guidelines.'}
`
}
