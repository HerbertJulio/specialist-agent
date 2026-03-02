# CLAUDE.md - Specialist Agent (Nuxt Pack)

## About

Development toolkit for Nuxt 3+ projects with TypeScript. Includes AI agents, skills, and architectural patterns.

**Source of truth for patterns: `docs/ARCHITECTURE.md`**

## AI Team Configuration

**Important: ALWAYS read docs/ARCHITECTURE.md before creating or modifying files.**

### Auto-Dispatch Rules

You **MUST** automatically delegate to the correct agent based on the user's intent. Do NOT ask which agent to use - detect it from the request:

| User intent | Agent |
|-------------|-------|
| Create modules, components, services, composables, pages, tests, or any new code | `@builder` |
| Review code, check architecture, analyze performance, explore modules | `@reviewer` |
| Investigate bugs, trace errors, debug issues | `@doctor` |
| Migrate legacy code, Nuxt 2 to Nuxt 3, modernize modules | `@migrator` |
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

- Nuxt 3+ with Vue 3 Composition API
- Auto-imports (composables, components, utils - no explicit imports needed)
- Nitro server engine (server/ directory)
- useFetch / useAsyncData (built-in server state with caching)
- useState (SSR-safe shared client state) + Pinia (complex client state)
- File-based routing (pages/ directory)
- TypeScript (strict) + Zod
- Vitest + @nuxt/test-utils

### Available Agents

**Day-to-Day Development:**

| Agent | When to Use |
|-------|-------------|
| `@starter` | Create a new project from scratch (frontend + backend + database) |
| `@builder` | Create modules, components, composables, server API routes, or tests |
| `@reviewer` | Review code, check architecture, explore modules, analyze performance |
| `@doctor` | Investigate bugs, trace errors through architecture layers |

**Architecture Migration:**

| Agent | When to Use |
|-------|-------------|
| `@migrator` | Migrate legacy code (Nuxt 2 -> 3, Options -> Composition, @nuxtjs/ modules -> Nuxt 3 modules) |
| `@reviewer` | Diagnose current state before migration, validate after |

### Available Skills

| Skill | What it does |
|---------|-------------|
| `/dev-create-module [name]` | Full module scaffold |
| `/dev-create-component [name]` | Create auto-imported component |
| `/dev-create-service [resource]` | Create server API route + adapter + types |
| `/dev-create-composable [name]` | Create auto-imported composable with useFetch/useAsyncData |
| `/dev-create-test [file]` | Create tests for a file |
| `/dev-generate-types [endpoint]` | Generate types/contracts/adapter from endpoint |
| `/review-review [scope]` | Full code review against ARCHITECTURE.md |
| `/review-check-architecture [module]` | Validate conformance with ARCHITECTURE.md |
| `/review-fix-violations [module]` | Find and fix architecture violations |
| `/migration-migrate-component [file]` | Migrate Nuxt 2 component to Nuxt 3 |
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

- **Auto-imports**: composables/, components/, utils/ are auto-imported - no explicit import statements needed
- **useFetch/useAsyncData**: Built-in server state management with caching, replaces TanStack Query
- **useState**: SSR-safe shared client state (replaces simple Pinia use cases)
- **Pinia**: Complex client state only (when useState is not enough)
- **Server routes**: server/api/ for backend endpoints (Nitro engine)
- **Middleware**: middleware/ for route guards (client-side)
- **Plugins**: plugins/ for app initialization
- **Composables**: composables/ - auto-imported, orchestrate useFetch -> adapter -> typed data
- **Services**: server/utils/ for server-side logic, modules/*/services/ for client-side
- **Adapters**: pure functions, API <-> App, snake_case -> camelCase
- **Types**: `.types.ts` (API raw) + `.contracts.ts` (app contract)
- **Components**: `<script setup lang="ts">`, auto-imported, < 200 lines
- **Utils**: pure functions | **Helpers**: with side effects
- **Modules**: don't import from each other
