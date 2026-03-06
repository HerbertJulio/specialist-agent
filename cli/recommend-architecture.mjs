/**
 * Architecture Recommendation Engine
 *
 * Provides opinionated, best-practice recommendations for both frontend
 * and backend architectures based on:
 * - Current detected architecture
 * - Framework
 * - Project size and complexity indicators
 * - Team size (asked interactively)
 * - Whether it's a monorepo
 * - Whether the project has backend code
 *
 * Philosophy: Always recommend the BEST architecture for the context,
 * not just the easiest migration. Provide Full and Lite variants so
 * teams of any size can adopt best practices.
 */

import { ARCHITECTURE_PATTERNS, MIGRATION_MAP, FRAMEWORK_ADAPTATIONS } from './architectures.mjs'

// ── Recommendation Profiles ───────────────────────────

/**
 * For each project context, these are the recommended architectures
 * ranked by preference. Based on industry best practices from:
 * - Martin Fowler, Robert C. Martin, Eric Evans, Sam Newman
 * - Netflix, Shopify, Amazon, GitHub migration case studies
 * - Feature-Sliced Design methodology (Yandex)
 * - Clean Architecture (Uncle Bob)
 */
const RECOMMENDATIONS = {
  // ── Frontend-Only Projects ──────────────────────────

  frontend: {
    small: {
      // 1-3 devs, < 20 components, prototype/MVP
      primary: 'modular',
      alternatives: ['flat'],
      reason: 'Modular architecture scales well from day one. Even small projects benefit from feature isolation. Use the Lite variant to keep it lightweight.',
    },
    medium: {
      // 3-10 devs, 20-100 components
      primary: 'modular',
      alternatives: ['fsd', 'atomic'],
      reason: 'Modular architecture with services/adapters/types layers gives clear boundaries and excellent testability. Feature-Sliced Design is a strong alternative for teams that want stricter import rules.',
    },
    large: {
      // 10+ devs, 100+ components
      primary: 'fsd',
      alternatives: ['modular', 'clean'],
      reason: 'Feature-Sliced Design enforces strict layer dependencies preventing architectural decay. Modular (Full) is equally strong with more framework flexibility. Clean Architecture adds explicit domain separation for complex business logic.',
    },
  },

  // ── Fullstack Projects ──────────────────────────────

  fullstack: {
    small: {
      // 1-3 devs, simple CRUD
      primary: 'modular',
      alternatives: ['mvc'],
      backendRecommendation: 'modular-monolith',
      reason: 'Modular architecture works for both frontend and backend modules. Start as a modular monolith - you get isolation without distributed complexity.',
    },
    medium: {
      // 3-10 devs, moderate business logic
      primary: 'modular',
      alternatives: ['clean', 'hexagonal'],
      backendRecommendation: 'modular-monolith',
      reason: 'Modular architecture with Clean Architecture principles inside each module. Backend as Modular Monolith with domain/application/infrastructure layers. Extract to microservices only when needed.',
    },
    large: {
      // 10+ devs, complex domain
      primary: 'clean',
      alternatives: ['hexagonal', 'ddd'],
      backendRecommendation: 'hexagonal',
      reason: 'Clean Architecture or Hexagonal for both frontend and backend. Domain logic isolated from framework. Backend with DDD patterns (aggregates, value objects) for complex domains. Consider CQRS for read-heavy scenarios.',
    },
    enterprise: {
      // 20+ devs, multiple teams
      primary: 'ddd',
      alternatives: ['hexagonal', 'clean'],
      backendRecommendation: 'ddd',
      reason: 'Domain-Driven Design with bounded contexts, each team owns a context. Start as Modular Monolith with DDD, extract to microservices per bounded context when teams need independent deployment.',
    },
  },

  // ── Backend-Only Projects ───────────────────────────

  backend: {
    small: {
      primary: 'modular-monolith',
      alternatives: ['mvc'],
      reason: 'Even small APIs benefit from modular structure. Modular Monolith (Lite) gives you feature isolation with minimal overhead.',
    },
    medium: {
      primary: 'modular-monolith',
      alternatives: ['hexagonal', 'clean'],
      reason: 'Modular Monolith with domain layers inside each module. Hexagonal architecture if you need infrastructure flexibility (multiple databases, message brokers).',
    },
    large: {
      primary: 'hexagonal',
      alternatives: ['clean', 'ddd'],
      reason: 'Hexagonal architecture isolates your domain from infrastructure. Add DDD tactical patterns (aggregates, domain events) for complex business rules.',
    },
    enterprise: {
      primary: 'ddd',
      alternatives: ['hexagonal', 'cqrs'],
      reason: 'Full DDD with bounded contexts. CQRS for domains with asymmetric read/write patterns. Event-driven communication between contexts. Start as Modular Monolith, extract services as needed.',
    },
  },

  // ── Monorepo Projects ──────────────────────────────

  monorepo: {
    small: {
      primary: 'modular',
      alternatives: ['flat'],
      reason: 'Each app in the monorepo uses Modular architecture. Shared packages in packages/ follow the same module conventions.',
    },
    medium: {
      primary: 'modular',
      alternatives: ['clean', 'hexagonal'],
      reason: 'Modular architecture per app. Shared domain logic in packages/. Consider Clean Architecture for apps with complex business logic.',
    },
    large: {
      primary: 'clean',
      alternatives: ['hexagonal', 'ddd'],
      reason: 'Clean Architecture per app with shared domain packages. Backend services use Hexagonal or DDD. Each bounded context can be its own package.',
    },
  },
}

// ── Framework-Specific Recommendations ────────────────

const FRAMEWORK_RECOMMENDATIONS = {
  nextjs: {
    extraNotes: [
      'Server Components as default - data fetching in pages/layouts',
      'Client Components only when interactivity needed',
      'Server Actions for mutations (replace API routes for forms)',
      'Route groups (feature)/ for organizing related routes',
    ],
    preferredStateManagement: 'Zustand (client) + TanStack React Query (server)',
    routerNote: {
      'app-router': 'App Router detected - use Server Components, Server Actions, and route groups',
      'pages-router': 'Pages Router detected - consider migrating to App Router for better performance and DX',
      'hybrid': 'Both routers detected - migrate Pages Router routes to App Router incrementally',
    },
  },
  react: {
    extraNotes: [
      'React Router 6 with lazy-loaded routes',
      'Error boundaries at route level',
      'Suspense for data loading states',
    ],
    preferredStateManagement: 'Zustand (client) + TanStack React Query (server)',
  },
  vue: {
    extraNotes: [
      '<script setup lang="ts"> for all components',
      'Composition API exclusively (no Options API)',
      'provide/inject for cross-component state',
    ],
    preferredStateManagement: 'Pinia (client) + TanStack Vue Query (server)',
  },
  nuxt: {
    extraNotes: [
      'Auto-imports for composables and components',
      'server/api/ for API routes (Nitro)',
      'File-based routing in pages/',
      'Modules in modules/ alongside Nuxt conventions',
    ],
    preferredStateManagement: 'Pinia (client) + TanStack Vue Query (server)',
  },
  svelte: {
    extraNotes: [
      '$lib alias for module imports',
      '+page.server.ts for server-side data loading',
      'Form actions for mutations',
      'Stores in lib/modules/ organized by feature',
    ],
    preferredStateManagement: 'Svelte stores (client) + TanStack Svelte Query (server)',
  },
  angular: {
    extraNotes: [
      'Standalone components (no NgModules)',
      'Signals for reactive state',
      'inject() function-based DI',
      'Lazy-loaded feature routes',
    ],
    preferredStateManagement: 'NgRx Signals (client) + TanStack Angular Query (server)',
  },
  astro: {
    extraNotes: [
      'Static by default, interactive islands for dynamic UI',
      'Content Collections for structured content',
      'Framework islands (React, Vue, Svelte) for interactive components',
      'Zero JS by default - opt into client-side interactivity',
    ],
    preferredStateManagement: 'Nanostores (client)',
  },
}

// ── Main Recommendation Function ──────────────────────

export function getRecommendations(detectionResult, options = {}) {
  const { teamSize = 'medium', projectType = 'auto' } = options

  // Determine project type if auto
  let resolvedType = projectType
  if (resolvedType === 'auto') {
    resolvedType = inferProjectType(detectionResult)
  }

  // Determine size category
  const sizeCategory = resolveTeamSizeCategory(teamSize, resolvedType)

  // Get base recommendations
  let recKey = resolvedType
  if (detectionResult.monorepo) recKey = 'monorepo'

  const recs = RECOMMENDATIONS[recKey]?.[sizeCategory] || RECOMMENDATIONS.frontend.medium

  // Build recommendation list
  const recommendations = []

  // Primary recommendation
  const primary = buildRecommendation(recs.primary, detectionResult, 'recommended', sizeCategory)
  if (primary) recommendations.push(primary)

  // Backend recommendation (for fullstack)
  if (recs.backendRecommendation && resolvedType === 'fullstack') {
    const backend = buildRecommendation(recs.backendRecommendation, detectionResult, 'backend-recommended', sizeCategory)
    if (backend) recommendations.push(backend)
  }

  // Alternative recommendations
  for (const altId of recs.alternatives) {
    const alt = buildRecommendation(altId, detectionResult, 'alternative', sizeCategory)
    if (alt) recommendations.push(alt)
  }

  // Framework-specific notes
  const frameworkNotes = FRAMEWORK_RECOMMENDATIONS[detectionResult.framework] || null

  return {
    projectType: resolvedType,
    sizeCategory,
    reason: recs.reason,
    currentArchitecture: detectionResult.architecture,
    recommendations,
    frameworkNotes,
    monorepoNote: detectionResult.monorepo
      ? `Monorepo detected (${detectionResult.monorepo.name}). Each app/package should follow the recommended architecture independently. Shared domain logic goes in packages/.`
      : null,
  }
}

function buildRecommendation(archId, detectionResult, tag, sizeCategory) {
  const pattern = ARCHITECTURE_PATTERNS[archId]
  if (!pattern) return null

  const currentArch = detectionResult.architecture
  const migrationKey = `${currentArch}->${archId}`
  const migration = MIGRATION_MAP[migrationKey]

  // Check if it's the same architecture
  const isSameArch = currentArch === archId

  const recommendation = {
    id: archId,
    name: pattern.name,
    tag, // 'recommended', 'backend-recommended', 'alternative'
    description: pattern.description,
    bestFor: pattern.bestFor,
    category: pattern.category,
    isSameArch,
    variants: [],
  }

  if (!isSameArch && migration) {
    recommendation.migration = {
      effort: migration.effort,
      description: migration.description,
      agents: getMigrationAgents(archId),
    }
  }

  // Full variant
  recommendation.variants.push({
    id: 'full',
    name: 'Full',
    description: getFullVariantDescription(archId, pattern),
    teamSize: pattern.bestFor.teamSize,
    layers: getArchitectureLayers(archId, detectionResult.framework, 'full'),
    directoryStructure: generateDirectoryPreview(archId, detectionResult.framework, 'full'),
  })

  // Lite variant
  recommendation.variants.push({
    id: 'lite',
    name: 'Simplified',
    description: getLiteVariantDescription(archId, pattern),
    teamSize: reducedTeamSize(pattern.bestFor.teamSize),
    layers: getArchitectureLayers(archId, detectionResult.framework, 'lite'),
    directoryStructure: generateDirectoryPreview(archId, detectionResult.framework, 'lite'),
  })

  return recommendation
}

// ── Variant Descriptions ──────────────────────────────

function getFullVariantDescription(archId, pattern) {
  const descriptions = {
    'modular': 'All layers: components, services, adapters, types/contracts, stores, hooks/composables, __tests__. Each module has barrel exports (index.ts). Strict import rules between modules.',
    'fsd': 'All 7 FSD layers: app, processes, pages, widgets, features, entities, shared. Each slice with segments: ui, model, api, lib. Strict top-down import rules.',
    'atomic': 'All Atomic levels: atoms, molecules, organisms, templates, pages. Separate design system from feature logic.',
    'mvc': 'Classic layers: controllers, models/entities, services, repositories, middleware, routes. Separation of concerns by technical role.',
    'clean': 'Four concentric layers: domain (entities, value objects), application (use cases, DTOs), infrastructure (database, HTTP, messaging), presentation (controllers/components). Strict dependency rule: inward only.',
    'hexagonal': 'Core with domain + use cases. Ports (in/out interfaces). Adapters (in: REST/GraphQL/CLI, out: database/external APIs/messaging). Domain has zero external dependencies.',
    'ddd': 'Bounded contexts with: aggregates, entities, value objects, domain events, domain services. Application layer with command/query handlers. Anti-Corruption Layer between contexts.',
    'cqrs': 'Separate command and query pipelines. Command handlers + write model + event store. Query handlers + read models + projections. Event-driven synchronization.',
    'event-driven': 'Event bus/broker (RabbitMQ/Kafka). Event publishers, subscribers, handlers. Sagas for cross-service workflows. Eventual consistency patterns.',
    'microservices': 'Independent services, each with own database. API Gateway. Service discovery. Inter-service communication via REST/gRPC/events. Independent CI/CD per service.',
    'modular-monolith': 'Single deployment with strict module boundaries. Each module has domain/application/infrastructure layers. Communication via interfaces only. Barrel exports enforce encapsulation.',
    'serverless': 'Function handlers organized by domain. Shared middleware and utilities. Event triggers (HTTP, queue, schedule). Infrastructure as Code (SAM/CDK/Serverless Framework).',
    'flat': 'Simple components/, pages/, utils/ structure. Direct imports. Good for prototypes and very small projects.',
    'screaming': 'Top-level directories named after business domains. Each domain is self-contained. The folder structure "screams" what the application does.',
  }
  return descriptions[archId] || pattern.description
}

function getLiteVariantDescription(archId, pattern) {
  const descriptions = {
    'modular': 'Core layers only: components, services, types. No adapters (inline transforms in services). No separate stores (co-locate state with hooks/composables). Simplified but still modular.',
    'fsd': 'Reduced to 5 layers: app, pages, features, entities, shared. No processes or widgets layers. Simpler segments (ui, model only).',
    'atomic': 'Three levels: primitives (atoms+molecules), organisms, pages. No templates layer. Simpler component categorization.',
    'mvc': 'Two layers: services (merged controllers+repositories) and models. Middleware as simple functions. Minimal ceremony.',
    'clean': 'Two layers: core (domain+application merged) and infra (infrastructure+presentation merged). Same dependency rule, fewer directories.',
    'hexagonal': 'Flat ports/ and adapters/ (no in/out subdivision). Single core/ directory for domain+use cases. Same isolation, less ceremony.',
    'ddd': 'Single bounded context. Domain with entities and value objects (no formal aggregates). Application layer with handlers. Simplified events.',
    'cqrs': 'CQRS without Event Sourcing. Separate command/query handlers sharing the same database. No projections or event store.',
    'event-driven': 'In-process event bus (no external broker). Simple publish/subscribe. Domain events for decoupling within the application.',
    'microservices': '2-3 services only. Shared infrastructure (database can be shared initially). Single CI pipeline. Simple API gateway.',
    'modular-monolith': 'Modules with services + types + index.ts only. No internal domain/application/infrastructure layering. Boundary enforcement via barrel exports.',
    'serverless': 'Functions organized by domain folder. Shared utils. No formal middleware layer.',
    'flat': 'Minimal: components/, pages/, api/, utils/. The simplest possible structure.',
    'screaming': 'Domain directories with flat internal structure (services, types, components co-located).',
  }
  return descriptions[archId] || `Simplified version of ${pattern.name}. Same core principles, fewer layers.`
}

// ── Directory Structure Preview ───────────────────────

function generateDirectoryPreview(archId, framework, variant) {
  const fw = FRAMEWORK_ADAPTATIONS[framework]
  const adaptation = fw?.adaptations?.[archId]

  // Framework-specific module layer names
  const hookDir = ['vue', 'nuxt'].includes(framework) ? 'composables' : 'hooks'
  const storeLib = ['vue', 'nuxt'].includes(framework) ? 'pinia' : ['angular'].includes(framework) ? 'ngrx-signals' : 'zustand'
  const viewDir = ['vue', 'nuxt'].includes(framework) ? 'views' : 'pages'
  const srcPrefix = ['nuxt'].includes(framework) ? '' : 'src/'

  switch (archId) {
    case 'modular':
      if (variant === 'full') {
        return [
          `${srcPrefix}modules/`,
          `  [feature]/`,
          `    components/`,
          `    ${hookDir}/`,
          `    services/`,
          `    adapters/`,
          `    stores/          # ${storeLib}`,
          framework === 'nextjs' ? `    actions/          # Server Actions` : null,
          `    types/`,
          `    ${viewDir}/`,
          `    __tests__/`,
          `    index.ts         # barrel export`,
          `${srcPrefix}shared/`,
          `  components/`,
          `  ${hookDir}/`,
          `  services/`,
          `  types/`,
          `  utils/`,
          `  helpers/`,
        ].filter(Boolean)
      }
      return [
        `${srcPrefix}modules/`,
        `  [feature]/`,
        `    components/`,
        `    ${hookDir}/`,
        `    services/`,
        `    types/`,
        `    index.ts`,
        `${srcPrefix}shared/`,
        `  components/`,
        `  utils/`,
        `  types/`,
      ]

    case 'clean':
      if (variant === 'full') {
        return [
          `${srcPrefix}domain/`,
          `  entities/`,
          `  value-objects/`,
          `  repositories/    # interfaces only`,
          `  errors/`,
          `${srcPrefix}application/`,
          `  use-cases/`,
          `  dtos/`,
          `  ports/`,
          `${srcPrefix}infrastructure/`,
          `  database/`,
          `  http/`,
          `  messaging/`,
          `  repositories/    # implementations`,
          `${srcPrefix}presentation/`,
          `  components/`,
          `  ${viewDir}/`,
          `  ${hookDir}/`,
        ]
      }
      return [
        `${srcPrefix}core/              # domain + application`,
        `  entities/`,
        `  use-cases/`,
        `  ports/`,
        `${srcPrefix}infra/             # infrastructure + presentation`,
        `  database/`,
        `  http/`,
        `  components/`,
        `  ${viewDir}/`,
      ]

    case 'hexagonal':
      if (variant === 'full') {
        return [
          `${srcPrefix}core/`,
          `  domain/`,
          `    entities/`,
          `    value-objects/`,
          `    services/`,
          `  ports/`,
          `    in/             # driving ports (use case interfaces)`,
          `    out/            # driven ports (repository interfaces)`,
          `  use-cases/`,
          `${srcPrefix}adapters/`,
          `  in/               # driving adapters`,
          `    web/            # REST controllers / components`,
          `    cli/`,
          `  out/              # driven adapters`,
          `    database/`,
          `    http-client/`,
          `    messaging/`,
        ]
      }
      return [
        `${srcPrefix}core/`,
        `  domain/`,
        `  ports/`,
        `  use-cases/`,
        `${srcPrefix}adapters/`,
        `  web/`,
        `  database/`,
        `  http-client/`,
      ]

    case 'fsd':
      if (variant === 'full') {
        return [
          `${srcPrefix}app/               # app init, providers, routing`,
          `${srcPrefix}processes/         # cross-page business flows`,
          `${srcPrefix}pages/             # full page compositions`,
          `${srcPrefix}widgets/           # composite UI blocks`,
          `${srcPrefix}features/          # user interaction features`,
          `  [feature]/`,
          `    ui/`,
          `    model/`,
          `    api/`,
          `    lib/`,
          `${srcPrefix}entities/          # business entities`,
          `  [entity]/`,
          `    ui/`,
          `    model/`,
          `    api/`,
          `${srcPrefix}shared/            # reusable infra`,
          `  ui/`,
          `  lib/`,
          `  api/`,
          `  config/`,
        ]
      }
      return [
        `${srcPrefix}app/`,
        `${srcPrefix}pages/`,
        `${srcPrefix}features/`,
        `  [feature]/`,
        `    ui/`,
        `    model/`,
        `${srcPrefix}entities/`,
        `${srcPrefix}shared/`,
        `  ui/`,
        `  lib/`,
      ]

    case 'ddd':
      if (variant === 'full') {
        return [
          `${srcPrefix}bounded-contexts/`,
          `  [context]/`,
          `    domain/`,
          `      aggregates/`,
          `        [aggregate]/`,
          `          AggregateRoot.ts`,
          `          Entity.ts`,
          `          ValueObject.ts`,
          `      events/`,
          `      repositories/    # interfaces`,
          `      services/`,
          `    application/`,
          `      commands/`,
          `      queries/`,
          `      handlers/`,
          `    infrastructure/`,
          `      persistence/`,
          `      messaging/`,
          `${srcPrefix}shared-kernel/`,
          `  types/`,
          `  events/`,
        ]
      }
      return [
        `${srcPrefix}modules/`,
        `  [context]/`,
        `    domain/`,
        `      entities/`,
        `      value-objects/`,
        `      events/`,
        `    application/`,
        `      handlers/`,
        `    infrastructure/`,
        `    index.ts`,
        `${srcPrefix}shared/`,
      ]

    case 'modular-monolith':
      if (variant === 'full') {
        return [
          `${srcPrefix}modules/`,
          `  [module]/`,
          `    domain/`,
          `      entities/`,
          `      value-objects/`,
          `      repositories/  # interfaces`,
          `    application/`,
          `      use-cases/`,
          `      dtos/`,
          `    infrastructure/`,
          `      persistence/`,
          `      http/`,
          `    index.ts          # public API`,
          `${srcPrefix}shared/`,
          `  database/`,
          `  config/`,
          `  utils/`,
        ]
      }
      return [
        `${srcPrefix}modules/`,
        `  [module]/`,
        `    services/`,
        `    types/`,
        `    index.ts`,
        `${srcPrefix}shared/`,
        `  database/`,
        `  utils/`,
      ]

    case 'cqrs':
      if (variant === 'full') {
        return [
          `${srcPrefix}commands/`,
          `  CreateOrder.ts`,
          `${srcPrefix}command-handlers/`,
          `  CreateOrderHandler.ts`,
          `${srcPrefix}queries/`,
          `  GetOrderById.ts`,
          `${srcPrefix}query-handlers/`,
          `  GetOrderByIdHandler.ts`,
          `${srcPrefix}read-models/`,
          `  OrderReadModel.ts`,
          `${srcPrefix}write-models/`,
          `  Order.ts`,
          `${srcPrefix}events/`,
          `  OrderCreated.ts`,
          `${srcPrefix}projections/`,
        ]
      }
      return [
        `${srcPrefix}commands/`,
        `${srcPrefix}queries/`,
        `${srcPrefix}handlers/`,
        `${srcPrefix}models/`,
        `${srcPrefix}events/`,
      ]

    case 'event-driven':
      if (variant === 'full') {
        return [
          `${srcPrefix}events/`,
          `  OrderPlaced.ts`,
          `${srcPrefix}handlers/`,
          `  OnOrderPlaced.ts`,
          `${srcPrefix}publishers/`,
          `${srcPrefix}subscribers/`,
          `${srcPrefix}sagas/`,
          `${srcPrefix}config/`,
          `  rabbitmq.config.ts`,
        ]
      }
      return [
        `${srcPrefix}events/`,
        `${srcPrefix}handlers/`,
        `${srcPrefix}config/`,
      ]

    case 'microservices':
      if (variant === 'full') {
        return [
          `services/`,
          `  orders/`,
          `    src/`,
          `    package.json`,
          `    Dockerfile`,
          `    prisma/`,
          `  payments/`,
          `    src/`,
          `    package.json`,
          `    Dockerfile`,
          `gateway/`,
          `  src/`,
          `  package.json`,
          `shared/`,
          `  proto/`,
          `  events/`,
          `docker-compose.yml`,
        ]
      }
      return [
        `services/`,
        `  [service]/`,
        `    src/`,
        `    package.json`,
        `    Dockerfile`,
        `gateway/`,
        `shared/`,
        `docker-compose.yml`,
      ]

    case 'atomic':
      if (variant === 'full') {
        return [
          `${srcPrefix}components/`,
          `  atoms/`,
          `    Button.${framework === 'vue' ? 'vue' : 'tsx'}`,
          `    Input.${framework === 'vue' ? 'vue' : 'tsx'}`,
          `  molecules/`,
          `    SearchBar.${framework === 'vue' ? 'vue' : 'tsx'}`,
          `  organisms/`,
          `    Header.${framework === 'vue' ? 'vue' : 'tsx'}`,
          `    ProductCard.${framework === 'vue' ? 'vue' : 'tsx'}`,
          `  templates/`,
          `    PageLayout.${framework === 'vue' ? 'vue' : 'tsx'}`,
          `${srcPrefix}pages/`,
          `${srcPrefix}${hookDir}/`,
          `${srcPrefix}services/`,
          `${srcPrefix}types/`,
        ]
      }
      return [
        `${srcPrefix}components/`,
        `  primitives/        # atoms + molecules`,
        `  organisms/`,
        `${srcPrefix}pages/`,
        `${srcPrefix}services/`,
        `${srcPrefix}types/`,
      ]

    case 'mvc':
      if (variant === 'full') {
        return [
          `${srcPrefix}controllers/`,
          `${srcPrefix}services/`,
          `${srcPrefix}repositories/`,
          `${srcPrefix}models/`,
          `${srcPrefix}middlewares/`,
          `${srcPrefix}routes/`,
          `${srcPrefix}config/`,
          `${srcPrefix}utils/`,
        ]
      }
      return [
        `${srcPrefix}services/       # controllers + services merged`,
        `${srcPrefix}models/`,
        `${srcPrefix}routes/`,
        `${srcPrefix}utils/`,
      ]

    default:
      return [`${srcPrefix}# See docs/ARCHITECTURE.md for structure`]
  }
}

// ── Helper Functions ──────────────────────────────────

function inferProjectType(detectionResult) {
  const fw = detectionResult.framework

  // Check if the project has backend indicators
  const hasBackend = checkHasBackend(detectionResult)

  // Next.js/Nuxt are inherently fullstack
  if (['nextjs', 'nuxt'].includes(fw)) return 'fullstack'

  // If backend indicators found
  if (hasBackend) return 'fullstack'

  // Check if it's a backend-only project (no frontend framework)
  if (!fw) return 'backend'

  return 'frontend'
}

function checkHasBackend(detectionResult) {
  // Look for backend indicators in the detected architecture scores
  const scores = detectionResult.scores || {}
  const backendPatterns = ['mvc', 'clean', 'hexagonal', 'ddd', 'cqrs', 'event-driven', 'microservices', 'modular-monolith']
  for (const pattern of backendPatterns) {
    if (scores[pattern] && !scores[pattern].belowThreshold && scores[pattern].score > 3) {
      return true
    }
  }
  return false
}

function resolveTeamSizeCategory(teamSize, projectType) {
  if (typeof teamSize === 'number') {
    if (teamSize <= 3) return 'small'
    if (teamSize <= 10) return 'medium'
    if (teamSize <= 20) return 'large'
    return 'enterprise'
  }
  // String categories
  if (['small', 'medium', 'large', 'enterprise'].includes(teamSize)) {
    // Validate that the category exists for the project type
    const recs = RECOMMENDATIONS[projectType]
    if (recs?.[teamSize]) return teamSize
    // Fallback: enterprise -> large for frontend/backend
    if (teamSize === 'enterprise' && !recs?.enterprise) return 'large'
    return 'medium'
  }
  return 'medium'
}

function getArchitectureLayers(archId, framework, variant) {
  const fw = FRAMEWORK_ADAPTATIONS[framework]
  const adaptation = fw?.adaptations?.[archId]

  if (adaptation) {
    return variant === 'full'
      ? (adaptation.layers || adaptation.liteLayers)
      : (adaptation.liteLayers || adaptation.layers)
  }

  // Generic layers
  const pattern = ARCHITECTURE_PATTERNS[archId]
  return variant === 'full'
    ? pattern?.detection?.moduleSubDirs || []
    : (pattern?.detection?.moduleSubDirs?.slice(0, 3) || [])
}

function getMigrationAgents(targetArchId) {
  const agentMap = {
    'modular': ['@architect', '@refactor'],
    'fsd': ['@architect', '@refactor', '@migrator'],
    'atomic': ['@architect', '@designer'],
    'clean': ['@architect', '@refactor'],
    'hexagonal': ['@architect', '@refactor'],
    'ddd': ['@architect', '@data'],
    'cqrs': ['@architect', '@data', '@api'],
    'event-driven': ['@architect', '@api'],
    'microservices': ['@architect', '@devops', '@api'],
    'modular-monolith': ['@architect', '@refactor'],
    'mvc': ['@architect'],
    'serverless': ['@architect', '@cloud'],
  }
  return agentMap[targetArchId] || ['@architect']
}

function reducedTeamSize(teamSize) {
  const match = teamSize.match(/(\d+)-(\d+)/)
  if (!match) return '1-5'
  const min = Math.max(1, Math.floor(parseInt(match[1]) / 2))
  const max = Math.max(min + 2, Math.floor(parseInt(match[2]) / 2))
  return `${min}-${max}`
}

// ── Format Report for CLI Display ─────────────────────

export function formatRecommendationsForCLI(recs) {
  const lines = []

  // Current state
  const currentPattern = ARCHITECTURE_PATTERNS[recs.currentArchitecture]
  if (currentPattern) {
    lines.push(`Current: ${currentPattern.name}`)
    lines.push('')
  }

  // Reason
  lines.push(recs.reason)
  lines.push('')

  // Monorepo note
  if (recs.monorepoNote) {
    lines.push(recs.monorepoNote)
    lines.push('')
  }

  // Recommendations
  for (const rec of recs.recommendations) {
    const tagLabel = rec.tag === 'recommended' ? 'RECOMMENDED'
      : rec.tag === 'backend-recommended' ? 'BACKEND'
      : 'ALTERNATIVE'
    const sameNote = rec.isSameArch ? ' (current)' : ''

    lines.push(`[${tagLabel}] ${rec.name}${sameNote}`)
    lines.push(`  ${rec.description}`)

    if (rec.migration) {
      lines.push(`  Migration effort: ${rec.migration.effort}`)
      lines.push(`  ${rec.migration.description}`)
      lines.push(`  Agents: ${rec.migration.agents.join(', ')}`)
    }

    lines.push(`  Variants:`)
    for (const v of rec.variants) {
      lines.push(`    ${v.name}: ${v.description.slice(0, 80)}...`)
    }
    lines.push('')
  }

  // Framework notes
  if (recs.frameworkNotes) {
    lines.push('Framework-specific notes:')
    for (const note of recs.frameworkNotes.extraNotes) {
      lines.push(`  - ${note}`)
    }
    if (recs.frameworkNotes.preferredStateManagement) {
      lines.push(`  State: ${recs.frameworkNotes.preferredStateManagement}`)
    }
  }

  return lines.join('\n')
}
