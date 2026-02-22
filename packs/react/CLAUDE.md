# CLAUDE.md -- Specialist Agent (React Pack)

## About

Development toolkit for React projects with TypeScript. Includes AI agents, skills, and architectural patterns.

**Source of truth for patterns: `docs/ARCHITECTURE.md`**

## AI Team Configuration

**Important: YOU MUST USE subagents when available for the task.**
**Important: ALWAYS read docs/ARCHITECTURE.md before creating or modifying files.**

### Stack

- React 18+ with functional components
- Zustand (client state) + TanStack React Query (server state)
- Vite + TypeScript (strict) + Zod
- React Router 6
- Vitest + React Testing Library

### Available Agents

**Day-to-Day Development:**

| Agent | When to Use |
|-------|-------------|
| `@starter` | Create a new project from scratch (frontend + backend + database) |
| `@builder` | Create modules, components, services, hooks, or tests |
| `@reviewer` | Review code, check architecture, explore modules, analyze performance |
| `@doctor` | Investigate bugs, trace errors through architecture layers |

**Architecture Migration:**

| Agent | When to Use |
|-------|-------------|
| `@migrator` | Migrate legacy code (class -> functional, Redux -> Zustand, JS -> TS) |
| `@reviewer` | Diagnose current state before migration, validate after |

### Available Skills

| Skill | What it does |
|---------|-------------|
| `/dev-create-module [name]` | Full module scaffold |
| `/dev-create-component [name]` | Create functional TSX component |
| `/dev-create-service [resource]` | Create service + adapter + types |
| `/dev-create-hook [name]` | Create custom hook with React Query |
| `/dev-create-test [file]` | Create tests for a file |
| `/dev-generate-types [endpoint]` | Generate types/contracts/adapter from endpoint |
| `/review-review [scope]` | Full code review against ARCHITECTURE.md |
| `/review-check-architecture [module]` | Validate conformance with ARCHITECTURE.md |
| `/review-fix-violations [module]` | Find and fix architecture violations |
| `/migration-migrate-component [file]` | Migrate class component to functional |
| `/migration-migrate-module [path]` | Migrate entire module |
| `/docs-onboard [module]` | Quick module overview for onboarding |

### Key Patterns (details in docs/ARCHITECTURE.md)

- **Services**: HTTP only, no try/catch, no transformation
- **Adapters**: pure functions, API <-> App, snake_case -> camelCase
- **Types**: `.types.ts` (API raw) + `.contracts.ts` (app contract)
- **Hooks**: orchestrate service -> adapter -> React Query
- **Zustand Stores**: client state only, selectors in components
- **Components**: functional TSX, typed props, < 200 lines
- **Utils**: pure functions | **Helpers**: with side effects
- **Modules**: don't import from each other
