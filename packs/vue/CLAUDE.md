# CLAUDE.md — Specialist Agent (Vue 3 Pack)

## About

Development toolkit for Vue 3 projects with TypeScript. Includes AI agents, skills, and architectural patterns.

**Source of truth for patterns: `docs/ARCHITECTURE.md`**

## AI Team Configuration

**Important: YOU MUST USE subagents when available for the task.**
**Important: ALWAYS read docs/ARCHITECTURE.md before creating or modifying files.**

### Stack

- Vue 3 + `<script setup lang="ts">`
- Pinia (client state) + TanStack Vue Query (server state)
- Vite + TypeScript (strict) + Zod
- Vue Router 4
- Vitest + @vue/test-utils

### Available Agents

**Day-to-Day Development:**

| Agent | When to Use |
|-------|-------------|
| `@starter` | Create a new project from scratch (frontend + backend + database) |
| `@builder` | Create modules, components, services, composables, or tests |
| `@reviewer` | Review code, check architecture, explore modules, analyze performance |
| `@doctor` | Investigate bugs, trace errors through architecture layers |

**Architecture Migration:**

| Agent | When to Use |
|-------|-------------|
| `@migrator` | Migrate legacy code (Options → setup, JS → TS, module modernization) |
| `@reviewer` | Diagnose current state before migration, validate after |

### Available Skills

| Skill | What it does |
|---------|-------------|
| `/dev-create-module [name]` | Full module scaffold |
| `/dev-create-component [name]` | Create component with standard template |
| `/dev-create-service [resource]` | Create service + adapter + types |
| `/dev-create-composable [name]` | Create composable with Vue Query |
| `/dev-create-test [file]` | Create tests for a file |
| `/dev-generate-types [endpoint]` | Generate types/contracts/adapter from endpoint |
| `/review-review [scope]` | Full code review against ARCHITECTURE.md |
| `/review-check-architecture [module]` | Validate conformance with ARCHITECTURE.md |
| `/review-fix-violations [module]` | Find and fix architecture violations |
| `/migration-migrate-component [file]` | Migrate component Options → setup |
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

- **Services**: HTTP only, no try/catch, no transformation
- **Adapters**: pure functions, API ↔ App, snake_case → camelCase
- **Types**: `.types.ts` (API raw) + `.contracts.ts` (app contract)
- **Composables**: orchestrate service → adapter → Vue Query
- **Pinia Stores**: client state only
- **Components**: script setup, composition pattern, < 200 lines
- **Utils**: pure functions | **Helpers**: with side effects
- **Modules**: don't import from each other
