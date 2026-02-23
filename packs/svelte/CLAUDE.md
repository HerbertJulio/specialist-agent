# CLAUDE.md -- Specialist Agent (Svelte/SvelteKit Pack)

## About

Development toolkit for SvelteKit projects with TypeScript. Includes AI agents, skills, and architectural patterns.

**Source of truth for patterns: `docs/ARCHITECTURE.md`**

## AI Team Configuration

**Important: YOU MUST USE subagents when available for the task.**
**Important: ALWAYS read docs/ARCHITECTURE.md before creating or modifying files.**

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
- Use the exact format above — single line, separated by `·`

### Key Patterns (details in docs/ARCHITECTURE.md)

- **Services**: HTTP only, no try/catch, no transformation, use native `fetch`
- **Adapters**: pure functions, API <-> App, snake_case -> camelCase
- **Types**: `.types.ts` (API raw) + `.contracts.ts` (app contract)
- **Load functions**: orchestrate service -> adapter -> typed data
- **Svelte stores**: client state only (writable/readable or rune-based class)
- **Components**: Svelte 5 runes ($state, $derived, $effect, $props), < 200 lines
- **Utils**: pure functions | **Helpers**: with side effects
- **Modules**: don't import from each other
