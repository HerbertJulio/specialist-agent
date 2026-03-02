# CLAUDE.md -- Specialist Agent (Svelte/SvelteKit Pack)

## About

Development toolkit for SvelteKit projects with TypeScript. Includes AI agents, skills, and architectural patterns.

**Source of truth for patterns: `docs/ARCHITECTURE.md`**

## AI Team Configuration

**Important: ALWAYS read docs/ARCHITECTURE.md before creating or modifying files.**

### Auto-Dispatch Rules

You **MUST** automatically delegate to the correct agent based on the user's intent. Do NOT ask which agent to use - detect it from the request:

| User intent | Agent |
|-------------|-------|
| Create modules, components, services, stores, tests, or any new code | `@builder` |
| Review code, check architecture, analyze performance, explore modules | `@reviewer` |
| Investigate bugs, trace errors, debug issues | `@doctor` |
| Migrate legacy code, Svelte 4 to 5, SvelteKit 1 to 2, modernize modules | `@migrator` |
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

- SvelteKit 2+ with Svelte 5 (runes)
- TypeScript (strict)
- Svelte stores (client state) + SvelteKit load functions (server state)
- SvelteKit file-based routing
- Vite + Vitest + @testing-library/svelte

### Available Agents

**Day-to-Day Development:**

| Agent | When to Use |
|-------|-------------|
| `@starter` | Create a new project from scratch (frontend + backend + database) |
| `@builder` | Create modules, components, services, stores, or tests |
| `@reviewer` | Review code, check architecture, explore modules, analyze performance |
| `@doctor` | Investigate bugs, trace errors through architecture layers |

**Architecture Migration:**

| Agent | When to Use |
|-------|-------------|
| `@migrator` | Migrate legacy code (Svelte 4 -> 5, SvelteKit 1 -> 2, module modernization) |
| `@reviewer` | Diagnose current state before migration, validate after |

### Available Skills

| Skill | What it does |
|---------|-------------|
| `/dev-create-module [name]` | Full module scaffold |
| `/dev-create-component [name]` | Create component with Svelte 5 runes template |
| `/dev-create-service [resource]` | Create service + adapter + types |
| `/dev-create-store [name]` | Create Svelte store (writable/readable or rune-based) |
| `/dev-create-test [file]` | Create tests for a file |
| `/dev-generate-types [endpoint]` | Generate types/contracts/adapter from endpoint |
| `/review-review [scope]` | Full code review against ARCHITECTURE.md |
| `/review-check-architecture [module]` | Validate conformance with ARCHITECTURE.md |
| `/review-fix-violations [module]` | Find and fix architecture violations |
| `/migration-migrate-component [file]` | Migrate component Svelte 4 -> 5 |
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

- **Services**: HTTP only, no try/catch, no transformation, use native `fetch`
- **Adapters**: pure functions, API <-> App, snake_case -> camelCase
- **Types**: `.types.ts` (API raw) + `.contracts.ts` (app contract)
- **Load functions**: orchestrate service -> adapter -> typed data
- **Svelte stores**: client state only (writable/readable or rune-based class)
- **Components**: Svelte 5 runes ($state, $derived, $effect, $props), < 200 lines
- **Utils**: pure functions | **Helpers**: with side effects
- **Modules**: don't import from each other
