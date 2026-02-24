# Introduction

## What is Specialist Agent?

Specialist Agent is an open-source collection of **agents**, **skills**, and **architectural conventions** designed for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

Once installed in your project, Claude automatically follows your architecture rules, generates consistent code, reviews PRs, migrates legacy code, and more.

**It's not a library or framework** — it's a set of markdown instructions that make Claude Code work like a senior developer who knows your codebase conventions.

## Framework Packs

Specialist Agent organizes agents and patterns into **framework packs**. Each pack provides stack-specific agents, skills, and architecture patterns:

| Pack | Stack |
|------|-------|
| **Next.js** | Next.js 14+ (App Router) + TypeScript + Zustand + Server Components |
| **React** | React 18 + TypeScript + Zustand + TanStack React Query |
| **SvelteKit** | SvelteKit 2 + TypeScript + Svelte stores + load functions |
| **Vue 3** | Vue 3 + TypeScript + Pinia + TanStack Vue Query |

## What You Get

| Feature | Count | Description |
|---------|-------|-------------|
| AI Agents | 13 | Starter, explorer, builder, reviewer, migrator, doctor + 7 specialists |
| Lite Agents | 13 | Same agents running on Haiku model (lower cost) |
| Skills | 12 | Shortcuts to scaffold and validate code |
| Architecture Guide | 1 | Comprehensive source of truth for all patterns |

## Your AI Team

Specialist Agent has **13 agents** organized by scenario:

```mermaid
graph TB
    Claude{"What do you need?"} -->|"new project"| setup
    Claude -->|"build & review"| daily
    Claude -->|"modernize"| migration
    Claude -->|"domain expertise"| specialists

    subgraph setup["Project Setup"]
        Starter["@starter<br/><i>Create projects from scratch</i>"]
        Explorer["@explorer<br/><i>Assess codebases, health score</i>"]
    end

    subgraph daily["Day-to-Day Development"]
        Builder["@builder<br/><i>Build features, components</i>"]
        Reviewer["@reviewer<br/><i>Review code, performance</i>"]
        Doctor["@doctor<br/><i>Investigate bugs, trace errors</i>"]
    end

    subgraph migration["Architecture Migration"]
        Migrator["@migrator<br/><i>Modernize legacy code</i>"]
    end

    subgraph specialists["Specialist Agents"]
        Finance["@finance<br/><i>Payments, billing</i>"]
        Cloud["@cloud<br/><i>IaC, serverless</i>"]
        Security["@security<br/><i>Auth, OWASP</i>"]
        Designer["@designer<br/><i>Design systems</i>"]
        Data["@data<br/><i>DB modeling</i>"]
        DevOps["@devops<br/><i>Docker, K8s</i>"]
        Tester["@tester<br/><i>Test strategy</i>"]
        Finance ~~~ Designer
        Cloud ~~~ Data
        Security ~~~ DevOps
        Designer ~~~ Tester
    end

    style Claude fill:#35495e,color:#fff
    style setup fill:#f5f0fa,stroke:#7c3aed
    style daily fill:#f0faf5,stroke:#42b883
    style migration fill:#f0f4fa,stroke:#35495e
    style specialists fill:#faf5f0,stroke:#e67e22
    style Starter fill:#7c3aed,color:#fff
    style Explorer fill:#7c3aed,color:#fff
    style Finance fill:#e67e22,color:#fff
    style Cloud fill:#e67e22,color:#fff
    style Security fill:#e67e22,color:#fff
    style Designer fill:#e67e22,color:#fff
    style Data fill:#e67e22,color:#fff
    style DevOps fill:#e67e22,color:#fff
    style Tester fill:#e67e22,color:#fff
    style Builder fill:#42b883,color:#fff
    style Reviewer fill:#42b883,color:#fff
    style Doctor fill:#42b883,color:#fff
    style Migrator fill:#35495e,color:#fff
```

| Scenario | Agents | When |
|----------|--------|------|
| **Project Creation** | `@starter` `@explorer` | Starting a new project or assessing an existing codebase |
| **Day-to-Day** | `@builder` `@reviewer` `@doctor` | Building features, reviewing code, fixing bugs |
| **Migration** | `@migrator` `@reviewer` | Modernizing legacy projects to the target architecture |
| **Specialists** | `@finance` `@cloud` `@security` `@designer` `@data` `@devops` `@tester` | Domain-specific expertise across any framework |

## How Packs Work

Each pack defines its own **orchestration layer** adapted to the framework:

| Pack | Orchestration | Client State |
| ---- | ------------- | ------------ |
| Next.js | Hooks + Server Actions | Zustand |
| React | Hooks + React Query | Zustand |
| SvelteKit | Stores + load functions | Svelte stores |
| Vue 3 | Composables + Vue Query | Pinia |

::: tip Flexible
You can adapt the patterns to your own stack by editing `docs/ARCHITECTURE.md`. All agents read this file before acting.
:::

## How It Works

1. **Install** Specialist Agent into your project (copies markdown files)
2. **Open Claude Code** in your project
3. **Use agents and skills** — Claude automatically delegates to the right specialist

```mermaid
sequenceDiagram
    participant You
    participant Claude as Claude Code
    participant Agent as @builder
    participant Arch as ARCHITECTURE.md

    You->>Claude: "Create a products module with CRUD"
    Claude->>Agent: Delegates to @builder
    Agent->>Arch: Reads architecture conventions
    Agent->>Agent: Scaffolds types → adapter → service → orchestration → components
    Agent-->>You: Complete module ready ✅
```

## Next Steps

- [Installation](/guide/installation) — Set up Specialist Agent in your project
- [Quick Start](/guide/quick-start) — Build a real feature step by step
- [Architecture Overview](/guide/architecture) — Understand the patterns

## Tutorials

### Day-to-Day Development

Use `@builder`, `@reviewer`, and `@doctor` for everyday work:

- [Build a CRUD Module](/tutorials/crud-module) — Complete Orders module from scratch
- [Create a Service Layer](/tutorials/service-layer) — Integrate a new API endpoint
- [Build Forms with Validation](/tutorials/forms) — Zod + useMutation + error handling
- [Pagination + Filters](/tutorials/pagination-filters) — Lists with search, filters, and pagination

### Architecture Migration

Use `@migrator` and `@reviewer` to modernize legacy projects:

- [Migrate Your Project](/tutorials/migrate-project) — 6-phase guide from legacy to target architecture
