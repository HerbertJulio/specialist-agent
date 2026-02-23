# CLAUDE.md — Specialist Agent

## About

AI agents for Claude Code — any framework, any stack. Includes specialized agents, skills, and architectural patterns organized in framework packs.

**Available packs:** Vue 3, React, Next.js, SvelteKit

## AI Team Configuration

**Important: YOU MUST USE subagents when available for the task.**

### Available Agents

**Framework-Agnostic:**

| Agent       | When to Use                                                           |
|-------------|-----------------------------------------------------------------------|
| `@starter`  | Create a new project from scratch (any frontend + backend + database) |
| `@explorer` | Explore unfamiliar codebases, onboarding, technical assessments       |
| `@finance`  | Financial systems: payments, billing, invoicing, reporting            |
| `@cloud`    | Cloud architecture: IaC, serverless, containers, CI/CD               |
| `@security` | Auth flows, OWASP compliance, RBAC/ABAC, encryption                  |
| `@designer` | Design systems, responsive layouts, accessibility (WCAG), theming    |
| `@data`     | Database modeling, migrations, caching, query optimization            |
| `@devops`   | Docker, Kubernetes, CI/CD pipelines, monitoring, logging              |
| `@tester`   | Test strategies, test suites, coverage, mocking patterns              |

**Pack-Specific (installed from your chosen pack):**

| Agent       | When to Use                                                           |
|-------------|-----------------------------------------------------------------------|
| `@builder`  | Create modules, components, services, composables, or tests           |
| `@reviewer` | Review code, check architecture, explore modules, analyze performance |
| `@migrator` | Migrate legacy code to target architecture                            |
| `@doctor`   | Investigate bugs, trace errors through architecture layers            |

### Security Rules

- **NEVER** include tokens, secrets, API keys, or credentials inline in shell commands
- **NEVER** use patterns like `TOKEN=xxx command` — always use environment variables already set in the system or CI secrets
- For npm publish, always rely on the CI workflow (`secrets.NPM_TOKEN`) or pre-configured `npm config`
- If a command requires authentication, ask the user to set the env var first, then reference it as `$VAR_NAME`

### Execution Summary

At the end of every task, you **MUST** include a brief summary of agent and skill usage:

```text
──── Specialist Agent: 2 agents (@builder, @reviewer) · 1 skill (/dev-create-module)
```

Rules:

- Only show agents/skills that were actually invoked during the execution
- If no agents or skills were used, omit the summary entirely
- Use the exact format above — single line, separated by `·`

### Architecture

Each pack defines its own `docs/ARCHITECTURE.md`. All agents read this file before acting.

### Pack Structure

```text
packs/[framework]/
├── agents/           ← Full agents (Sonnet/Opus)
├── agents-lite/      ← Lite agents (Haiku, lower cost)
├── skills/           ← Skills (slash commands)
├── ARCHITECTURE.md   ← Framework patterns
└── CLAUDE.md         ← Framework-specific CLAUDE.md
```
