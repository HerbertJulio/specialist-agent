# CLAUDE.md -- Specialist Agent (Next.js Pack)

## About

Development toolkit for Next.js 14+ projects with TypeScript. Includes AI agents, skills, and architectural patterns.

**Source of truth for patterns: `docs/ARCHITECTURE.md`**

## AI Team Configuration

**Important: ALWAYS read docs/ARCHITECTURE.md before creating or modifying files.**

### Auto-Dispatch Rules

You **MUST** automatically delegate to the correct agent based on the user's intent. Do NOT ask which agent to use - detect it from the request:

| User intent | Agent |
|-------------|-------|
| Create modules, components (Server/Client), services, hooks, pages, tests, or any new code | `@builder` |
| Review code, check architecture, analyze performance, explore modules | `@reviewer` |
| Investigate bugs, trace errors, debug issues | `@doctor` |
| Migrate legacy code, Pages Router to App Router, modernize modules | `@migrator` |
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

- Next.js 14+ (App Router)
- React Server Components (default) + Client Components (`'use client'`)
- Server Actions (`'use server'`) for mutations
- Zustand (client state) + TanStack React Query (server state)
- TypeScript (strict) + Zod
- Vitest + React Testing Library

### Available Agents

**Day-to-Day Development:**

| Agent | When to Use |
|-------|-------------|
| `@starter` | Create a new project from scratch (frontend + backend + database) |
| `@builder` | Create modules, components (Server/Client), services, hooks, pages, or tests |
| `@reviewer` | Review code, check architecture, explore modules, analyze performance |
| `@doctor` | Investigate bugs, trace errors through architecture layers |

**Architecture Migration:**

| Agent | When to Use |
|-------|-------------|
| `@migrator` | Migrate legacy code (Pages Router -> App Router, JS -> TS, module modernization) |
| `@reviewer` | Diagnose current state before migration, validate after |

### Available Skills

| Skill | What it does |
|---------|-------------|
| `/dev-create-module [name]` | Full module scaffold with app/ route + src/modules/ structure |
| `/dev-create-component [name]` | Create Server or Client component (auto-detect) |
| `/dev-create-service [resource]` | Create service + adapter + types |
| `/dev-create-hook [name]` | Create custom hook with React Query (client only) |
| `/dev-create-test [file]` | Create tests with React Testing Library + Vitest |
| `/dev-generate-types [endpoint]` | Generate types/contracts/adapter from endpoint |
| `/review-review [scope]` | Full code review (RSC + Client checks) |
| `/review-check-architecture [module]` | Validate conformance with ARCHITECTURE.md |
| `/review-fix-violations [module]` | Find and fix architecture violations |
| `/migration-migrate-component [file]` | Migrate Pages Router component to App Router |
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

- **Server Components**: Default. Async, no hooks, no browser APIs. Data fetching here.
- **Client Components**: `'use client'`. Hooks, state, events, browser APIs.
- **Server Actions**: `'use server'`. Mutations, revalidation. Replace API routes for forms.
- **Services**: HTTP only, no try/catch, no transformation
- **Adapters**: pure functions, API <-> App, snake_case -> camelCase
- **Types**: `.types.ts` (API raw) + `.contracts.ts` (app contract)
- **Hooks**: orchestrate service -> adapter -> React Query (client only)
- **Zustand Stores**: client state only
- **Components**: < 200 lines, typed props, Server by default
- **Utils**: pure functions | **Helpers**: with side effects
- **Modules**: don't import from each other
