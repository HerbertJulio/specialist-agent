# Introduction

## The Problem

AI coding assistants are generalists. They write code, but they don't enforce architecture, they don't follow your team's patterns, and they don't catch what a senior engineer would.

You end up:

- Re-explaining the same conventions every session
- Getting "it works" code that doesn't match your architecture
- Missing security issues, performance problems, or compliance gaps
- Doing manual code review on AI-generated code

## The Solution

Specialist Agent gives your AI assistant a team of domain experts. Instead of one generalist, you get:

- **@builder** that knows your framework's component patterns
- **@reviewer** that enforces SOLID, security, and architecture rules
- **@security** that catches OWASP Top 10 issues
- **@sentry-triage** that triages production errors automatically

Each agent carries specific knowledge, rules, and workflows. They don't just write code — they enforce standards.

## How It Works

You install agents into your project. When you need something done, you call the right agent:

```
> Use @builder to create the products module with CRUD
> Use @sentry-triage to check errors from the last 24h
> Use @reviewer to review src/modules/auth/
> /plan add real-time notifications with WebSocket
```

## Agent Categories

| Category | Agents | Purpose |
|----------|--------|---------|
| **Core** | 5 | Build, review, debug, migrate |
| **Workflow** | 9 | Plan, execute, test, pair program |
| **Engineering** | 17 | API, security, data, DevOps, architecture |
| **Business** | 3 | Marketing, product, support |
| **Automation** | 1 | Sentry triage, auto-fix production errors |

## Skills

Skills are repeatable workflows you invoke with a slash command:

| Category | Skills |
|----------|--------|
| Planning | `/brainstorm`, `/plan`, `/discovery`, `/estimate` |
| Development | `/tdd`, `/debug`, `/autofix`, `/lint`, `/commit` |
| Quality | `/verify`, `/codereview`, `/audit`, `/health` |
| Workflow | `/checkpoint`, `/finish`, `/worktree`, `/learn` |
| Migration | `/migrate-framework`, `/migrate-architecture` |
| Knowledge | `/remember`, `/recall`, `/onboard`, `/tutorial`, `/write-skill` |

## What Makes It Different

| Feature | Generic AI | Specialist Agent |
|---------|-----------|-----------------|
| Architecture enforcement | No | Agents enforce your ARCHITECTURE.md |
| Framework-specific patterns | Generic | 7 framework packs with optimized agents |
| Code review depth | Surface-level | 3-in-1 review (quality + security + architecture) |
| Production ops | Manual | @sentry-triage auto-triages errors |
| Business agents | No | @marketing, @product, @support |
| Repeatable workflows | Manual | 24 skills (/plan, /tdd, /autofix, ...) |
| Multi-platform | Varies | 6 platforms supported |

## Framework Packs

Each framework gets optimized agents with framework-specific patterns:

**Vue 3** | **React** | **Next.js** | **SvelteKit** | **Angular** | **Astro** | **Nuxt**

## Platform Support

Works on: **Claude Code**, **Cursor**, **VS Code**, **Windsurf**, **Codex**, **OpenCode**

## Who It's For

- **Solo developers** who want senior-level review on every commit
- **Teams** who want to standardize how AI assists development
- **Startups** who need to move fast without accumulating tech debt
- **Enterprise** teams who need compliance, security, and architecture enforcement

## What's Next

- [Quick Start](/guide/quick-start) — Install and use your first agent
- [Agent Catalog](/reference/agents) — Browse all 35 agents
- [Skills Reference](/reference/skills) — All 24 skills
