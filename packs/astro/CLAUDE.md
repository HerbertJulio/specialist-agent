# CLAUDE.md - Specialist Agent (Astro Pack)

## About

Development toolkit for Astro 4+ projects with TypeScript. Includes AI agents, skills, and architectural patterns.

**Source of truth for patterns: `docs/ARCHITECTURE.md`**

## AI Team Configuration

**Important: ALWAYS read docs/ARCHITECTURE.md before creating or modifying files.**

### Auto-Dispatch Rules

You **MUST** automatically delegate to the correct agent based on the user's intent. Do NOT ask which agent to use - detect it from the request:

| User intent | Agent |
|-------------|-------|
| Create modules, components, pages, services, islands, tests, or any new code | `@builder` |
| Review code, check architecture, analyze performance, explore modules | `@reviewer` |
| Investigate bugs, trace errors, debug issues | `@doctor` |
| Migrate legacy code, modernize modules, refactor to target architecture | `@migrator` |
| Scaffold a new project from scratch | `@starter` |
| Payments, billing, invoicing, financial reporting | `@finance` |
| Cloud infra, IaC, serverless, containers | `@cloud` |
| Auth flows, security audit, RBAC, encryption | `@security` |
| Design systems, responsive layouts, accessibility, theming | `@designer` |
| Database modeling, migrations, caching, query optimization | `@data` |
| Docker, Kubernetes, CI/CD pipelines, monitoring | `@devops` |
| Test strategies, test suites, coverage, mocking | `@tester` |
| Explore unfamiliar codebase, onboarding, technical assessment | `@explorer` |
| Data privacy (LGPD, GDPR), consent flows, compliance review | `@legal` |

If a task spans multiple agents, invoke them in sequence (e.g., @builder then @reviewer).

### Stack

- Astro 4+ (SSG/SSR hybrid, Islands Architecture)
- TypeScript (strict) + Zod
- File-based routing (`src/pages/`)
- Content Collections (type-safe content with Zod schemas)
- Islands: React/Vue/Svelte components with `client:*` directives
- Vitest + Playwright
- Zero JS by default - selective hydration

### Available Agents

**Day-to-Day Development:**

| Agent | When to Use |
|-------|-------------|
| `@starter` | Create a new project from scratch (SSG/SSR + content + API) |
| `@builder` | Create modules, pages, components, islands, services, or tests |
| `@reviewer` | Review code, check architecture, explore modules, analyze performance |
| `@doctor` | Investigate bugs, trace errors through architecture layers |

**Architecture Migration:**

| Agent | When to Use |
|-------|-------------|
| `@migrator` | Migrate SPA to Astro (React/Vue pages to .astro, interactive parts to islands) |
| `@reviewer` | Diagnose current state before migration, validate after |

### Available Skills

| Skill | What it does |
|---------|-------------|
| `/dev-create-module [name]` | Full module scaffold |
| `/dev-create-component [name]` | Create .astro component |
| `/dev-create-service [resource]` | Create service + adapter + types |
| `/dev-create-island [name]` | Create interactive island with hydration strategy |
| `/dev-create-test [file]` | Create tests for a file |
| `/dev-generate-types [endpoint]` | Generate types/contracts/adapter from endpoint |
| `/review-review [scope]` | Full code review against ARCHITECTURE.md |
| `/review-check-architecture [module]` | Validate conformance with ARCHITECTURE.md |
| `/review-fix-violations [module]` | Find and fix architecture violations |
| `/migration-migrate-component [file]` | Migrate SPA component to .astro |
| `/migration-migrate-module [path]` | Migrate entire module |
| `/docs-onboard [module]` | Quick module overview for onboarding |

### Execution Summary

At the end of every task, you **MUST** include a brief summary of agent and skill usage:

```text
──── Specialist Agent: 2 agents (@builder, @reviewer) · 1 skill (/dev-create-module)
```

Rules:

- Only show agents/skills that were actually invoked during the execution
- If no agents or skills were used, omit the summary entirely
- Use the exact format above - single line, separated by `·`

### Key Patterns (details in docs/ARCHITECTURE.md)

- **Astro components**: `.astro` files, server-rendered, zero JS shipped
- **Islands**: Framework components (React/Vue/Svelte) with `client:load`, `client:visible`, `client:idle`
- **Services**: Server-side fetch in frontmatter or API endpoints, no try/catch, no transformation
- **Adapters**: pure functions, API <-> App, snake_case -> camelCase
- **Types**: `.types.ts` (API raw) + `.contracts.ts` (app contract)
- **Content Collections**: Type-safe content with Zod schemas in `src/content/config.ts`
- **Layouts**: Reusable page templates in `src/layouts/`
- **Server endpoints**: `src/pages/api/` for API routes
- **Utils**: pure functions | **Helpers**: with side effects
- **Modules**: don't import from each other
