# Introduction

::: tip Just want to try it?
Skip ahead to the [Quick Start](/guide/quick-start) to get up and running in under 2 minutes.
:::

Specialist Agent is a collection of **30 specialized AI agents** and **23 skills** that build, review, debug, and ship production code - across any framework and any stack.

## Prerequisites

- **Node.js** 18+ (for CLI installation)
- An AI coding platform: [Claude Code](/guide/installation), [Cursor](/guide/install-cursor), [VS Code](/guide/install-vscode), [Windsurf](/guide/install-windsurf), [Codex](/guide/install-codex), or [OpenCode](/guide/install-opencode)

## How It Works

1. You describe what you need in plain language
2. The right specialized agent handles it
3. You get production-ready, verified code

```
"Create a products module with CRUD"
→ @builder creates types, service, components, tests

"Review the auth module"
→ @reviewer checks quality, architecture, security

"Debug the login error"
→ @debugger traces through layers to find root cause
```

## Install

::: code-group

```bash [Claude Code]
npx specialist-agent init
```

```bash [Cursor / VS Code / Windsurf]
cd your-project
npx specialist-agent init
```

```bash [Marketplace]
/plugin install specialist-agent
```

:::

::: info Works everywhere
Specialist Agent supports Claude Code, Cursor, VS Code, Windsurf, Codex, and OpenCode. See [Platform Guides](/guide/install-cursor) for platform-specific setup.
:::

## Choose Your Scenario

### I want to...

| Goal | Agent | Example |
|------|-------|---------|
| Build a new feature | `@builder` | "Create user registration" |
| Review code | `@reviewer` | "Review the auth module" |
| Debug an issue | `@debugger` | "Fix the 500 error on login" |
| Design an API | `@api` | "Design REST API for orders" |
| Add payments | `@finance` | "Integrate Stripe checkout" |
| Add authentication | `@security` | "Implement JWT auth" |
| Optimize performance | `@perf` | "Optimize the dashboard" |
| Add translations | `@i18n` | "Add Portuguese support" |
| Modernize legacy code | `@migrator` | "Migrate to TypeScript" |
| Plan a complex feature | `@planner` | "Plan the checkout flow" |
| Audit code before release | `/audit` | "/audit src/modules/auth" |
| Onboard to new codebase | `/onboard` | "/onboard" |

## Framework Support

| Framework | What You Get |
|-----------|--------------|
| **Next.js** | App Router patterns, Server Components |
| **React** | Hooks, React Query, Zustand |
| **Vue 3** | Composition API, Pinia, Vue Query |
| **SvelteKit** | Stores, load functions |
| **Angular** | Standalone components, Signals, DI |
| **Astro** | Islands architecture, Content Collections |
| **Nuxt** | Auto-imports, Nitro server, useFetch |

Each framework has specific patterns for services, state, and components. See [Architecture](/guide/architecture) for details.

## How Specialist Agent Maps to Claude Code

Specialist Agent builds on top of Claude Code's native concepts. Here's how they connect:

| Claude Code Concept | Location | How Specialist Agent Uses It |
|---|---|---|
| **Sub-Agents** | `.claude/agents/*.md` | 30 specialized agents with missions, workflows, and handoff protocols |
| **Skills** | `.claude/skills/*/SKILL.md` | 23 repeatable workflows (`/plan`, `/tdd`, `/audit`, `/discovery`) |
| **Commands** | `.claude/commands/*.md` | Orchestration entry points |
| **CLAUDE.md** | Project root | Auto-dispatch rules, agent catalog, cross-cutting concerns |
| **Rules** | `.claude/rules/*.md` | Framework-specific patterns, ARCHITECTURE.md conventions |
| **Hooks** | `.claude/hooks/` | Security Guard, Auto-Dispatch, Auto-Format, Session Context |
| **MCP Servers** | `.mcp.json` | Context7 (docs), Azion (edge deploy) |
| **Checkpointing** | Built-in (git) | `@executor` creates checkpoints per task with rollback support |
| **Memory** | `~/.claude/projects/` | `@memory` agent for cross-session decisions |

You don't need to understand all of these to get started — just pick an agent and go. But knowing the mapping helps when you want to [create your own agents](/customization/creating-agents) or [customize patterns](/customization/editing-patterns).

## Full vs Lite Mode

| Mode | Best For | Cost |
|------|----------|------|
| **Full** | Complex features, PRs, reviews | Standard |
| **Lite** | Quick tasks, scaffolding, fixes | 60-80% less |

Lite mode uses a smaller model for faster, cheaper results. See [Performance & Cost](/guide/benchmark) for benchmarks.

## What's Next?

- [Why Specialist Agent?](/guide/why) - The problems we solve and how
- [Quick Start](/guide/quick-start) - Get running in 2 minutes
- [Best Practices](/guide/best-practices) - Tips for maximum productivity
- [Real-World Scenarios](/scenarios/) - See agents in action
- [All Agents Reference](/reference/agents) - Full agent catalog
