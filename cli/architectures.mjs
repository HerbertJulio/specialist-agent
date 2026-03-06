/**
 * Architecture Pattern Registry
 *
 * Comprehensive catalog of software architecture patterns with:
 * - Detection heuristics (directory structure, file patterns, code patterns)
 * - Full and simplified (lite) variants
 * - Framework-specific adaptations
 * - Migration paths between patterns
 * - Team size and project size recommendations
 */

// ── Architecture Pattern Definitions ───────────────────

export const ARCHITECTURE_PATTERNS = {
  // ── Frontend Architectures ──────────────────────────

  'modular': {
    id: 'modular',
    name: 'Modular (Feature-Based)',
    category: 'frontend',
    description: 'Vertical slicing by feature/domain. Each module is a bounded context with its own components, services, types.',
    bestFor: {
      teamSize: '2-15',
      projectSize: 'medium-large',
      description: 'Teams that want clear ownership per feature, good module isolation without heavy ceremony.',
    },
    detection: {
      requiredDirs: ['modules', 'shared'],
      optionalDirs: ['app', 'assets', 'config'],
      moduleSubDirs: ['components', 'services', 'types'],
      optionalModuleSubDirs: ['adapters', 'hooks', 'composables', 'stores', 'actions', 'views', 'pages', '__tests__'],
      filePatterns: ['**/modules/*/index.ts', '**/modules/*/index.tsx'],
      antiPatterns: ['controllers', 'models', 'views', 'atoms', 'molecules', 'organisms'],
      codePatterns: [],
      minScore: 5,
    },
    migrationPaths: ['clean', 'hexagonal', 'fsd', 'ddd', 'modular-monolith'],
  },

  'fsd': {
    id: 'fsd',
    name: 'Feature-Sliced Design (FSD)',
    category: 'frontend',
    description: 'Layered architecture with strict import rules: app > pages > widgets > features > entities > shared.',
    bestFor: {
      teamSize: '5-30',
      projectSize: 'large',
      description: 'Large teams needing strict import discipline and clear layer boundaries.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['app', 'processes', 'pages', 'widgets', 'features', 'entities', 'shared'],
      moduleSubDirs: [],
      optionalModuleSubDirs: ['ui', 'model', 'api', 'lib', 'config'],
      filePatterns: [],
      antiPatterns: ['controllers', 'models'],
      codePatterns: [],
      minScore: 6,
      // Special: needs at least 3 of the FSD layers
      customRule: 'fsd-layers',
    },
    migrationPaths: ['modular', 'clean', 'hexagonal'],
  },

  'atomic': {
    id: 'atomic',
    name: 'Atomic Design',
    category: 'frontend',
    description: 'Components organized by granularity: atoms > molecules > organisms > templates > pages.',
    bestFor: {
      teamSize: '2-10',
      projectSize: 'medium',
      description: 'Design-system-heavy projects with strong designer-developer collaboration.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['atoms', 'molecules', 'organisms', 'templates', 'pages'],
      moduleSubDirs: [],
      optionalModuleSubDirs: [],
      filePatterns: ['**/atoms/**', '**/molecules/**', '**/organisms/**'],
      antiPatterns: ['modules', 'features', 'domain', 'use-cases'],
      codePatterns: [],
      minScore: 4,
      customRule: 'atomic-layers',
    },
    migrationPaths: ['modular', 'fsd'],
  },

  'mvc': {
    id: 'mvc',
    name: 'MVC / MVVM / Layered',
    category: 'fullstack',
    description: 'Horizontal slicing by technical layer: controllers, models, views/components.',
    bestFor: {
      teamSize: '1-5',
      projectSize: 'small-medium',
      description: 'Small teams familiar with server-side MVC. Simple CRUD applications.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['controllers', 'models', 'views', 'middlewares', 'middleware', 'routes', 'repositories', 'services', 'viewmodels', 'view-models', 'presenters'],
      moduleSubDirs: [],
      optionalModuleSubDirs: [],
      filePatterns: ['**/*-controller.*', '**/*-model.*', '**/*.controller.*', '**/*.model.*', '**/*.service.*'],
      antiPatterns: ['modules', 'features', 'domain', 'use-cases', 'ports', 'adapters'],
      codePatterns: [],
      minScore: 4,
    },
    migrationPaths: ['modular', 'clean', 'modular-monolith'],
  },

  'clean': {
    id: 'clean',
    name: 'Clean Architecture',
    category: 'fullstack',
    description: 'Concentric layers with dependency rule: Entities > Use Cases > Adapters > Frameworks.',
    bestFor: {
      teamSize: '5-30',
      projectSize: 'large',
      description: 'Complex business domains needing strict separation of concerns and testability.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['domain', 'entities', 'use-cases', 'usecases', 'application', 'infrastructure', 'presentation', 'interfaces', 'frameworks'],
      moduleSubDirs: [],
      optionalModuleSubDirs: ['value-objects', 'repositories', 'dtos'],
      filePatterns: ['**/use-cases/**', '**/usecases/**', '**/domain/entities/**'],
      antiPatterns: ['controllers', 'models', 'views'],
      codePatterns: [],
      minScore: 5,
    },
    migrationPaths: ['hexagonal', 'ddd', 'microservices'],
  },

  'hexagonal': {
    id: 'hexagonal',
    name: 'Hexagonal (Ports & Adapters)',
    category: 'fullstack',
    description: 'Core domain isolated by ports (interfaces) and adapters (implementations). Infrastructure swappable.',
    bestFor: {
      teamSize: '5-20',
      projectSize: 'large',
      description: 'Projects needing multiple entry points or infrastructure flexibility.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['ports', 'adapters', 'domain', 'core', 'infrastructure'],
      moduleSubDirs: [],
      optionalModuleSubDirs: ['in', 'out', 'primary', 'secondary', 'driving', 'driven'],
      filePatterns: ['**/ports/**/*Port*', '**/ports/**/*port*', '**/adapters/**/*Adapter*', '**/adapters/**/*adapter*'],
      antiPatterns: ['controllers', 'models', 'views'],
      codePatterns: ['Port', 'Adapter'],
      minScore: 5,
    },
    migrationPaths: ['ddd', 'microservices', 'clean'],
  },

  'flat': {
    id: 'flat',
    name: 'Flat / Component-Driven',
    category: 'frontend',
    description: 'Single components directory with minimal structure. Typical starting point for small projects.',
    bestFor: {
      teamSize: '1-3',
      projectSize: 'small',
      description: 'Solo developers, prototypes, small projects with < 20 components.',
    },
    detection: {
      requiredDirs: ['components'],
      optionalDirs: ['pages', 'api', 'utils', 'lib', 'hooks', 'styles'],
      moduleSubDirs: [],
      optionalModuleSubDirs: [],
      filePatterns: [],
      antiPatterns: ['modules', 'features', 'domain', 'entities', 'atoms', 'molecules', 'ports', 'adapters'],
      codePatterns: [],
      minScore: 2,
      customRule: 'flat-components',
    },
    migrationPaths: ['modular', 'atomic', 'fsd'],
  },

  'screaming': {
    id: 'screaming',
    name: 'Screaming Architecture',
    category: 'frontend',
    description: 'Top-level directories named after business domains. The structure "screams" what the app does.',
    bestFor: {
      teamSize: '3-10',
      projectSize: 'medium',
      description: 'DDD-influenced teams wanting immediate domain visibility.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: [],
      moduleSubDirs: [],
      optionalModuleSubDirs: [],
      filePatterns: [],
      antiPatterns: ['components', 'controllers', 'models', 'views', 'modules', 'features'],
      codePatterns: [],
      minScore: 3,
      customRule: 'screaming-domains',
    },
    migrationPaths: ['modular', 'ddd', 'clean'],
  },

  // ── Backend / Fullstack Architectures ──────────────

  'ddd': {
    id: 'ddd',
    name: 'Domain-Driven Design (DDD)',
    category: 'backend',
    description: 'Bounded contexts with aggregates, value objects, domain events. Business language drives structure.',
    bestFor: {
      teamSize: '10-50',
      projectSize: 'large-enterprise',
      description: 'Complex business domains with domain experts. Projects where the model IS the product.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['aggregates', 'value-objects', 'domain-events', 'bounded-contexts', 'domain', 'shared-kernel'],
      moduleSubDirs: [],
      optionalModuleSubDirs: ['aggregates', 'value-objects', 'domain-events', 'repositories', 'services'],
      filePatterns: ['**/*Aggregate*', '**/*ValueObject*', '**/*DomainEvent*', '**/aggregates/**', '**/value-objects/**'],
      antiPatterns: [],
      codePatterns: ['AggregateRoot', 'ValueObject', 'DomainEvent'],
      minScore: 5,
    },
    migrationPaths: ['cqrs', 'microservices', 'event-driven'],
  },

  'cqrs': {
    id: 'cqrs',
    name: 'CQRS (Command Query Separation)',
    category: 'backend',
    description: 'Separate command (write) and query (read) paths with dedicated models for each.',
    bestFor: {
      teamSize: '5-30',
      projectSize: 'large',
      description: 'Systems with asymmetric read/write loads, audit trail requirements.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['commands', 'queries', 'command-handlers', 'query-handlers', 'read-models', 'projections', 'write-models'],
      moduleSubDirs: [],
      optionalModuleSubDirs: ['commands', 'queries', 'handlers'],
      filePatterns: ['**/*Command*', '**/*Query*', '**/*Handler*', '**/commands/**', '**/queries/**'],
      antiPatterns: [],
      codePatterns: ['CommandHandler', 'QueryHandler', 'Command', 'Query'],
      minScore: 5,
    },
    migrationPaths: ['event-driven', 'microservices'],
  },

  'event-driven': {
    id: 'event-driven',
    name: 'Event-Driven',
    category: 'backend',
    description: 'Asynchronous communication via events. Decoupled producers and consumers.',
    bestFor: {
      teamSize: '5-30',
      projectSize: 'large',
      description: 'Asynchronous workflows, microservices communication, eventual consistency.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['events', 'handlers', 'subscribers', 'listeners', 'publishers', 'sagas', 'domain-events', 'event-handlers'],
      moduleSubDirs: [],
      optionalModuleSubDirs: [],
      filePatterns: ['**/*EventHandler*', '**/*Subscriber*', '**/*Listener*', '**/*Publisher*', '**/*Saga*'],
      antiPatterns: [],
      codePatterns: ['EventEmitter', 'EventBus', 'publish', 'subscribe', 'EventHandler'],
      minScore: 4,
    },
    migrationPaths: ['cqrs', 'microservices'],
  },

  'microservices': {
    id: 'microservices',
    name: 'Microservices',
    category: 'backend',
    description: 'Independent services with own databases, deployed separately. Communication via APIs or events.',
    bestFor: {
      teamSize: '15-100+',
      projectSize: 'enterprise',
      description: 'Large teams needing independent deployment, different scaling per domain.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['services', 'gateway', 'api-gateway', 'shared', 'proto', 'contracts'],
      moduleSubDirs: [],
      optionalModuleSubDirs: [],
      filePatterns: ['**/services/*/package.json', '**/services/*/Dockerfile', '**/apps/*/package.json'],
      antiPatterns: [],
      codePatterns: [],
      minScore: 4,
      customRule: 'microservices-check',
    },
    migrationPaths: ['serverless'],
  },

  'modular-monolith': {
    id: 'modular-monolith',
    name: 'Modular Monolith',
    category: 'fullstack',
    description: 'Single deployment with enforced module boundaries. Best of both: isolation without distributed complexity.',
    bestFor: {
      teamSize: '3-20',
      projectSize: 'medium-large',
      description: 'Projects that may become microservices later. Module isolation without distributed overhead.',
    },
    detection: {
      requiredDirs: ['modules'],
      optionalDirs: ['shared', 'infrastructure', 'core'],
      moduleSubDirs: ['domain', 'application', 'infrastructure'],
      optionalModuleSubDirs: ['ports', 'adapters', 'events'],
      filePatterns: ['**/modules/*/index.ts', '**/modules/*/module.ts'],
      antiPatterns: [],
      codePatterns: [],
      minScore: 6,
      customRule: 'modular-monolith-check',
    },
    migrationPaths: ['microservices', 'ddd', 'hexagonal'],
  },

  'serverless': {
    id: 'serverless',
    name: 'Serverless / Functions',
    category: 'backend',
    description: 'Function-based architecture with event triggers. Stateless execution units.',
    bestFor: {
      teamSize: '1-10',
      projectSize: 'small-medium',
      description: 'Event-driven workloads, variable traffic, cost-optimized for low-traffic APIs.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: ['functions', 'lambdas', 'handlers', 'api'],
      moduleSubDirs: [],
      optionalModuleSubDirs: [],
      filePatterns: ['serverless.yml', 'serverless.ts', 'netlify.toml', 'vercel.json', 'firebase.json', 'amplify.yml', 'sam-template.yaml', 'template.yaml'],
      antiPatterns: [],
      codePatterns: ['exports.handler', 'module.exports.handler'],
      minScore: 3,
    },
    migrationPaths: ['microservices', 'modular'],
  },

  'unstructured': {
    id: 'unstructured',
    name: 'Unstructured / Ad-hoc',
    category: 'any',
    description: 'No clear architecture pattern. Files organized loosely or by convenience.',
    bestFor: {
      teamSize: '1',
      projectSize: 'prototype',
      description: 'Quick prototypes, experiments. Should evolve into a proper architecture.',
    },
    detection: {
      requiredDirs: [],
      optionalDirs: [],
      moduleSubDirs: [],
      optionalModuleSubDirs: [],
      filePatterns: [],
      antiPatterns: [],
      codePatterns: [],
      minScore: 0,
      customRule: 'unstructured-fallback',
    },
    migrationPaths: ['flat', 'modular', 'mvc'],
  },
}

// ── Monorepo Pattern Definitions ──────────────────────

export const MONOREPO_PATTERNS = {
  'turborepo': {
    id: 'turborepo',
    name: 'Turborepo',
    detectFiles: ['turbo.json'],
    detectDirs: ['apps', 'packages'],
    workspaceConfig: 'turbo.json',
  },
  'nx': {
    id: 'nx',
    name: 'Nx',
    detectFiles: ['nx.json'],
    detectDirs: ['apps', 'libs'],
    workspaceConfig: 'nx.json',
    detectDeps: ['@nx/workspace', '@nrwl/workspace', 'nx'],
  },
  'lerna': {
    id: 'lerna',
    name: 'Lerna',
    detectFiles: ['lerna.json'],
    detectDirs: ['packages'],
    workspaceConfig: 'lerna.json',
  },
  'pnpm': {
    id: 'pnpm',
    name: 'pnpm Workspaces',
    detectFiles: ['pnpm-workspace.yaml'],
    detectDirs: [],
    workspaceConfig: 'pnpm-workspace.yaml',
  },
  'workspaces': {
    id: 'workspaces',
    name: 'npm/yarn Workspaces',
    detectFiles: [],
    detectDirs: [],
    workspaceConfig: 'package.json',
    customRule: 'package-json-workspaces',
  },
}

// ── Framework-Specific Architecture Adaptations ───────

export const FRAMEWORK_ADAPTATIONS = {
  // For each framework, maps architecture patterns to their specific adaptations
  nextjs: {
    routerType: null, // detected dynamically: 'app-router' | 'pages-router'
    adaptations: {
      modular: {
        srcRoot: 'src',
        routeDir: 'app',
        moduleDir: 'modules',
        sharedDir: 'shared',
        stateManagement: { client: 'zustand', server: 'tanstack-react-query' },
        layers: ['components', 'hooks', 'services', 'adapters', 'stores', 'actions', 'types', '__tests__'],
        liteLayers: ['components', 'hooks', 'services', 'types'],
        specialDirs: { actions: 'Server Actions', stores: 'Zustand stores' },
      },
      clean: {
        srcRoot: 'src',
        layers: { domain: 'domain', application: 'application', infrastructure: 'infrastructure', presentation: 'app' },
        liteLayers: { core: 'core', infra: 'infra', presentation: 'app' },
      },
      hexagonal: {
        srcRoot: 'src',
        layers: { core: { domain: true, ports: { in: true, out: true }, useCases: true }, adapters: { in: { web: 'app' }, out: { api: true, storage: true } } },
        liteLayers: { core: { domain: true, ports: true }, adapters: true },
      },
    },
  },

  react: {
    adaptations: {
      modular: {
        srcRoot: 'src',
        routeDir: 'app/router',
        moduleDir: 'modules',
        sharedDir: 'shared',
        stateManagement: { client: 'zustand', server: 'tanstack-react-query' },
        layers: ['components', 'hooks', 'services', 'adapters', 'stores', 'types', 'pages', '__tests__'],
        liteLayers: ['components', 'hooks', 'services', 'types'],
        specialDirs: { stores: 'Zustand stores', pages: 'Route pages' },
      },
      clean: {
        srcRoot: 'src',
        layers: { domain: 'domain', application: 'application', infrastructure: 'infrastructure', presentation: 'presentation' },
        liteLayers: { core: 'core', infra: 'infra', presentation: 'presentation' },
      },
      hexagonal: {
        srcRoot: 'src',
        layers: { core: { domain: true, ports: { in: true, out: true }, useCases: true }, adapters: { in: { web: 'presentation' }, out: { api: true, storage: true } } },
        liteLayers: { core: { domain: true, ports: true }, adapters: true },
      },
    },
  },

  vue: {
    adaptations: {
      modular: {
        srcRoot: 'src',
        routeDir: 'app/router',
        moduleDir: 'modules',
        sharedDir: 'shared',
        stateManagement: { client: 'pinia', server: 'tanstack-vue-query' },
        layers: ['components', 'composables', 'services', 'adapters', 'stores', 'types', 'views', '__tests__'],
        liteLayers: ['components', 'composables', 'services', 'types'],
        specialDirs: { stores: 'Pinia stores', views: 'Route views', composables: 'Vue composables' },
      },
      clean: {
        srcRoot: 'src',
        layers: { domain: 'domain', application: 'application', infrastructure: 'infrastructure', presentation: 'presentation' },
        liteLayers: { core: 'core', infra: 'infra', presentation: 'presentation' },
      },
      hexagonal: {
        srcRoot: 'src',
        layers: { core: { domain: true, ports: { in: true, out: true }, useCases: true }, adapters: { in: { web: 'presentation' }, out: { api: true, storage: true } } },
        liteLayers: { core: { domain: true, ports: true }, adapters: true },
      },
    },
  },

  nuxt: {
    adaptations: {
      modular: {
        srcRoot: '',
        routeDir: 'pages',
        moduleDir: 'modules',
        sharedDir: 'shared',
        stateManagement: { client: 'pinia', server: 'tanstack-vue-query' },
        layers: ['components', 'composables', 'services', 'adapters', 'stores', 'types', '__tests__'],
        liteLayers: ['components', 'composables', 'services', 'types'],
        specialDirs: { stores: 'Pinia stores', composables: 'Auto-imported composables' },
        nuxtDirs: ['server/api', 'server/utils', 'plugins', 'middleware', 'layouts'],
      },
      clean: {
        srcRoot: '',
        layers: { domain: 'domain', application: 'application', infrastructure: 'server', presentation: 'pages' },
        liteLayers: { core: 'core', infra: 'server', presentation: 'pages' },
      },
    },
  },

  svelte: {
    adaptations: {
      modular: {
        srcRoot: 'src',
        routeDir: 'routes',
        moduleDir: 'lib/modules',
        sharedDir: 'lib/shared',
        stateManagement: { client: 'svelte-stores', server: 'tanstack-svelte-query' },
        layers: ['components', 'stores', 'services', 'adapters', 'types', '__tests__'],
        liteLayers: ['components', 'stores', 'services', 'types'],
        specialDirs: { stores: 'Svelte stores ($lib)' },
      },
      clean: {
        srcRoot: 'src',
        layers: { domain: 'lib/domain', application: 'lib/application', infrastructure: 'lib/infrastructure', presentation: 'routes' },
        liteLayers: { core: 'lib/core', infra: 'lib/infra', presentation: 'routes' },
      },
    },
  },

  angular: {
    adaptations: {
      modular: {
        srcRoot: 'src',
        routeDir: 'app',
        moduleDir: 'app/modules',
        sharedDir: 'app/shared',
        stateManagement: { client: 'ngrx-signals', server: 'tanstack-angular-query' },
        layers: ['components', 'services', 'models', 'guards', 'pipes', 'directives', 'types', '__tests__'],
        liteLayers: ['components', 'services', 'models', 'types'],
        specialDirs: { guards: 'Route guards', pipes: 'Angular pipes' },
      },
      clean: {
        srcRoot: 'src',
        layers: { domain: 'app/domain', application: 'app/application', infrastructure: 'app/infrastructure', presentation: 'app/presentation' },
        liteLayers: { core: 'app/core', infra: 'app/infra', presentation: 'app/presentation' },
      },
    },
  },

  astro: {
    adaptations: {
      modular: {
        srcRoot: 'src',
        routeDir: 'pages',
        moduleDir: 'modules',
        sharedDir: 'shared',
        stateManagement: { client: 'nanostores', server: 'astro-data' },
        layers: ['components', 'services', 'types', 'islands', '__tests__'],
        liteLayers: ['components', 'services', 'types'],
        specialDirs: { islands: 'Interactive framework islands', content: 'Content collections' },
        astroDirs: ['content', 'layouts', 'islands'],
      },
      clean: {
        srcRoot: 'src',
        layers: { domain: 'domain', application: 'application', infrastructure: 'infrastructure', presentation: 'pages' },
        liteLayers: { core: 'core', infra: 'infra', presentation: 'pages' },
      },
    },
  },
}

// ── Migration Map ─────────────────────────────────────

export const MIGRATION_MAP = {
  // From -> To: effort + description
  'unstructured->flat': { effort: 'low', description: 'Organize files into components/pages/utils folders' },
  'unstructured->modular': { effort: 'medium', description: 'Group files by feature into modules with barrel exports' },
  'unstructured->mvc': { effort: 'low', description: 'Organize by technical layer (controllers, models, services)' },

  'flat->modular': { effort: 'medium', description: 'Group components by domain into modules, add services/types layers' },
  'flat->atomic': { effort: 'medium', description: 'Reorganize components by granularity (atoms, molecules, organisms)' },
  'flat->fsd': { effort: 'high', description: 'Restructure into FSD layers with strict import rules' },

  'mvc->modular': { effort: 'medium', description: 'Shift from horizontal to vertical slicing, group by feature' },
  'mvc->clean': { effort: 'high', description: 'Extract domain layer, define use cases, invert dependencies' },
  'mvc->modular-monolith': { effort: 'high', description: 'Extract modules with enforced boundaries, add domain layers' },

  'modular->clean': { effort: 'medium', description: 'Add domain/application/infrastructure layers inside each module' },
  'modular->hexagonal': { effort: 'medium', description: 'Define ports and adapters, isolate domain from infrastructure' },
  'modular->fsd': { effort: 'medium', description: 'Reorganize modules into FSD layers (features, entities, shared)' },
  'modular->ddd': { effort: 'high', description: 'Add aggregates, value objects, domain events within bounded contexts' },
  'modular->modular-monolith': { effort: 'low', description: 'Enforce strict module boundaries, add internal layering' },

  'atomic->modular': { effort: 'medium', description: 'Regroup by domain instead of granularity, preserve design system' },
  'atomic->fsd': { effort: 'medium', description: 'Map atoms/molecules to shared, organisms to features/entities' },

  'clean->hexagonal': { effort: 'low', description: 'Rename layers, formalize ports/adapters, same dependency direction' },
  'clean->ddd': { effort: 'medium', description: 'Add aggregates, bounded contexts, domain events' },
  'clean->microservices': { effort: 'high', description: 'Extract bounded contexts into independent services' },

  'hexagonal->ddd': { effort: 'medium', description: 'Add DDD tactical patterns (aggregates, value objects) to domain' },
  'hexagonal->microservices': { effort: 'medium', description: 'Extract adapters into standalone services' },

  'ddd->cqrs': { effort: 'medium', description: 'Separate command and query paths, add read models' },
  'ddd->microservices': { effort: 'high', description: 'Extract bounded contexts into independent deployable services' },
  'ddd->event-driven': { effort: 'medium', description: 'Add event bus, publish domain events between contexts' },

  'modular-monolith->microservices': { effort: 'high', description: 'Extract modules into independent services (Strangler Fig)' },
  'modular-monolith->ddd': { effort: 'medium', description: 'Add DDD patterns within module boundaries' },
  'modular-monolith->hexagonal': { effort: 'medium', description: 'Add ports/adapters structure within each module' },

  'fsd->modular': { effort: 'medium', description: 'Merge FSD layers into feature modules, simplify import rules' },
  'fsd->clean': { effort: 'high', description: 'Map FSD layers to Clean Architecture concentric layers' },

  'screaming->modular': { effort: 'low', description: 'Add internal structure (services, types, index.ts) to domain dirs' },
  'screaming->ddd': { effort: 'medium', description: 'Formalize domain dirs into bounded contexts with DDD patterns' },

  'event-driven->cqrs': { effort: 'medium', description: 'Separate command/query handlers, add read model projections' },
  'event-driven->microservices': { effort: 'medium', description: 'Each event consumer becomes its own service' },

  'cqrs->microservices': { effort: 'medium', description: 'Split command/query services, separate deployments' },

  'serverless->microservices': { effort: 'medium', description: 'Group functions into services, add service boundaries' },
  'serverless->modular': { effort: 'medium', description: 'Organize functions into modules with shared infrastructure' },
}

// ── Architecture Suggestion Engine ────────────────────

export function getSuggestedArchitectures(currentArch, framework, projectInfo) {
  const suggestions = []
  const pattern = ARCHITECTURE_PATTERNS[currentArch]
  if (!pattern) return suggestions

  const frameworkAdaptations = FRAMEWORK_ADAPTATIONS[framework] || {}

  for (const targetId of pattern.migrationPaths) {
    const target = ARCHITECTURE_PATTERNS[targetId]
    if (!target) continue

    const migrationKey = `${currentArch}->${targetId}`
    const migration = MIGRATION_MAP[migrationKey]
    if (!migration) continue

    // Check if framework has adaptation for this target
    const hasFrameworkSupport = frameworkAdaptations.adaptations?.[targetId] || targetId === 'modular'

    const suggestion = {
      id: targetId,
      name: target.name,
      description: target.description,
      effort: migration.effort,
      migrationDescription: migration.description,
      bestFor: target.bestFor,
      hasFrameworkSupport: !!hasFrameworkSupport,
      variants: [],
    }

    // Add Full variant
    suggestion.variants.push({
      id: 'full',
      name: `${target.name} (Full)`,
      description: `Complete implementation with all layers and patterns. ${target.bestFor.description}`,
      teamSize: target.bestFor.teamSize,
      complexity: 'high',
    })

    // Add Lite variant
    suggestion.variants.push({
      id: 'lite',
      name: `${target.name} (Simplified)`,
      description: `Streamlined version with fewer layers. Same core principles, less ceremony. Good for smaller teams.`,
      teamSize: reducedTeamSize(target.bestFor.teamSize),
      complexity: 'medium',
    })

    // Add monorepo variant if applicable
    if (projectInfo?.isMonorepo && ['modular', 'clean', 'hexagonal', 'modular-monolith', 'microservices'].includes(targetId)) {
      suggestion.variants.push({
        id: 'monorepo',
        name: `${target.name} (Monorepo)`,
        description: `Adapted for monorepo with shared packages. Each app/service follows the architecture independently.`,
        teamSize: target.bestFor.teamSize,
        complexity: 'high',
      })
    }

    suggestions.push(suggestion)
  }

  // Sort by effort (low first), then by framework support
  suggestions.sort((a, b) => {
    const effortOrder = { low: 0, medium: 1, high: 2 }
    if (a.hasFrameworkSupport !== b.hasFrameworkSupport) return a.hasFrameworkSupport ? -1 : 1
    return (effortOrder[a.effort] || 2) - (effortOrder[b.effort] || 2)
  })

  return suggestions
}

function reducedTeamSize(teamSize) {
  const match = teamSize.match(/(\d+)-(\d+)/)
  if (!match) return '1-5'
  const min = Math.max(1, Math.floor(parseInt(match[1]) / 2))
  const max = Math.max(min + 2, Math.floor(parseInt(match[2]) / 2))
  return `${min}-${max}`
}

