<p align="center">
  <img src="docs/public/social-preview-banner.svg" alt="Specialist Agent — AI agents for Claude Code" />
</p>

<p align="center">
  <b>Supercharge <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a> with specialized AI agents for any framework.</b><br/>
  Scaffold projects, build features, review architecture, migrate legacy code, and hunt bugs — all following your project's conventions automatically.
</p>

[![CI](https://github.com/HerbertJulio/specialist-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/HerbertJulio/specialist-agent/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/HerbertJulio/specialist-agent?label=Release)](https://github.com/HerbertJulio/specialist-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/Docs-VitePress-646cff.svg)](https://herbertjulio.github.io/specialist-agent/)
[![GitHub stars](https://img.shields.io/github/stars/HerbertJulio/specialist-agent?style=flat&logo=github&label=Stars)](https://github.com/HerbertJulio/specialist-agent/stargazers)

---

## 💡 What is Specialist Agent?

Specialist Agent is a collection of **AI agents**, **skills**, and **architectural conventions** for Claude Code. It's not a library — it's a set of markdown instructions that make Claude Code work like a senior developer who knows your codebase.

**Framework packs** provide stack-specific agents, skills, and architecture patterns:

| Pack | Stack |
|------|-------|
| **Vue 3** | Vue 3 + TypeScript + Pinia + TanStack Vue Query |
| **React** | React 18 + TypeScript + Zustand + TanStack React Query |
| **Next.js** | Next.js 14+ (App Router) + TypeScript + Zustand + Server Components |
| **SvelteKit** | SvelteKit 2 + TypeScript + Svelte stores + load functions |

---

## 🪙 Token Consumption Notice

Agents consume tokens proportional to their complexity. Specialist Agent ships with **Lite agents** that use `model: haiku` — significantly cheaper per token.

| Mode | Model | Module scaffold | Code review | Bug investigation |
|------|-------|-----------------|-------------|-------------------|
| **Full** | Sonnet/Opus | ~15-25k tokens | ~8-15k tokens | ~5-10k tokens |
| **Lite** | Haiku | ~5-10k tokens | ~3-5k tokens | ~2-5k tokens |

---

## 🚀 Quick Start

**1. Install into your project**

```bash
cd /path/to/your-project
npx specialist-agent init
```

The wizard asks:
1. Which framework? (Vue 3, React...)
2. Full or Lite mode?
3. Install @starter agent?

**2. Start using**

```bash
claude

# Create a new project from scratch
"Use @starter to create a task-manager app with Vue + Express + PostgreSQL"

# Build a feature inside an existing project
"Use @builder to create an orders module with CRUD for GET/POST/PATCH/DELETE /v2/orders"
```

---

## 🤖 Meet Your AI Team

### Framework-Agnostic

| Agent | What it does |
|-------|--------------|
| **@starter** | Create a new project from scratch — any frontend + backend + database |
| **@explorer** | Explore unfamiliar codebases — onboarding, technical assessments, health score |

### Specialist Agents

| Agent | What it does |
|-------|--------------|
| **@finance** | Payment integration, billing, invoicing, tax calculation, financial reporting |
| **@cloud** | Cloud architecture, IaC (Terraform/Pulumi), serverless, containers, CI/CD |
| **@security** | Auth flows (OAuth/JWT), OWASP compliance, RBAC/ABAC, encryption |
| **@designer** | Design systems, responsive layouts, accessibility (WCAG), theming |
| **@data** | Database modeling, migrations, caching strategies, query optimization |
| **@devops** | Docker, Kubernetes, CI/CD pipelines, monitoring, logging |
| **@tester** | Test strategies, test suites, coverage analysis, mocking patterns |

### Day-to-Day Development

| Agent | What it does |
|-------|--------------|
| **@builder** | Create modules, components, services, hooks/composables, and tests |
| **@reviewer** | Review PRs, explore modules, check performance |
| **@doctor** | Investigate bugs by tracing through architecture layers |

### Architecture Migration

| Agent | What it does |
|-------|--------------|
| **@migrator** | Migrate legacy code to modern patterns (per framework pack) |
| **@reviewer** | Diagnose current state before migration, validate after |

```bash
# Start a new full-stack project
"Use @starter to create an e-commerce app with Vue + Fastify + PostgreSQL"

# Explore an unfamiliar codebase
"Use @explorer to assess this project — I just joined the team"

# Build features
"Use @builder to create the orders module with CRUD for /v2/orders"

# Review before merging
"Use @reviewer to review the changes in the payments module"

# Debug issues
"Use @doctor to investigate the 500 error on login"

# Migrate legacy code (6 phases with approval gates)
"Use @migrator to migrate the billing module from Options API to script setup"
```

---

## ⚡ Skills

Quick shortcuts you invoke with `/skill-name` in Claude Code.

### Development

| Skill | What it does |
|-------|--------------|
| `/dev-create-module [name]` | Full module scaffold (delegates to agents) |
| `/dev-create-component [name]` | Component with script setup template |
| `/dev-create-service [resource]` | Types + contracts + adapter + service |
| `/dev-create-composable [name]` | Composable with server state integration |
| `/dev-create-test [file]` | Tests for adapter, composable, or component |
| `/dev-generate-types [endpoint]` | Types + contracts + adapter from endpoint/JSON |

### Quality

| Skill | What it does |
|-------|--------------|
| `/review-review [scope]` | Full code review (automated + manual) |
| `/review-check-architecture [module]` | Automated conformance checks |
| `/review-fix-violations [module]` | Auto-fix violations by priority |

### Migration

| Skill | What it does |
|-------|--------------|
| `/migration-migrate-component [file]` | Options API → script setup |
| `/migration-migrate-module [path]` | Full module migration (6 phases) |

### Documentation

| Skill | What it does |
|-------|--------------|
| `/docs-onboard [module]` | 2-minute module overview for onboarding |

---

## 🏛️ Architecture

All agents enforce the four-layer architecture defined in each pack:

```text
Service (HTTP only) → Adapter (parse) → Orchestration → Component (UI)
```

Each pack adapts the orchestration layer:

| Pack | Orchestration | Client State | File Extension |
|------|---------------|--------------|----------------|
| Vue 3 | Composables + Vue Query | Pinia | `.vue` |
| React | Hooks + React Query | Zustand | `.tsx` |
| Next.js | Hooks + Server Actions | Zustand | `.tsx` |
| SvelteKit | Stores + load functions | Svelte stores | `.svelte` |

> Full guide: `docs/ARCHITECTURE.md` — the source of truth that all agents read.

---

## 🪶 Lite Mode — Lower Token Usage

For cost-conscious usage or simpler tasks:

```bash
npx specialist-agent init    # select "Lite" mode in wizard
```

| Aspect | Full | Lite |
|--------|------|------|
| **Model** | Sonnet/Opus (default) | Haiku |
| **First action** | Reads ARCHITECTURE.md | Rules inline |
| **Validation** | tsc, build, vitest | Skipped |
| **Size** | ~80-120 lines | ~30-50 lines |
| **Cost** | ~5-25k tokens | ~2-10k tokens |

---

## 📁 Project Structure

```text
specialist-agent/
├── packs/
│   ├── vue/                  ← Vue 3 pack
│   ├── react/                ← React pack
│   ├── nextjs/               ← Next.js pack
│   └── svelte/               ← SvelteKit pack
│       ├── agents/           ← Full agents (4)
│       ├── agents-lite/      ← Lite agents (4)
│       ├── skills/           ← Skills (12)
│       ├── ARCHITECTURE.md   ← Architecture patterns
│       └── CLAUDE.md         ← Pack-specific config
│
├── agents/                   ← Framework-agnostic agents (9 + 9 lite)
│
├── cli/                      ← CLI installer
│   └── index.mjs             ← npx specialist-agent init
│
├── docs/                     ← VitePress documentation
└── package.json
```

---

## 🔌 Optional: Context7 MCP

For enhanced documentation access, add the [Context7 MCP server](https://github.com/upstash/context7). It gives Claude real-time access to up-to-date docs for Vue 3, Pinia, TanStack Query, and other libraries.

### Setup

Add to your Claude Code MCP config (`~/.claude/mcp.json`):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

---

## 🔧 Customization

### Add an Agent

Create `.claude/agents/my-agent.md` following the **5-part blueprint** (Mission, Workflow, Output, Rules, Handoff):

```markdown
---
name: my-agent
description: "MUST BE USED to [do X] when [trigger]. Use PROACTIVELY when [condition]."
tools: Read, Write, Edit, Bash, Glob, Grep
---

# Title

## Mission
One sentence describing what this agent does.

## Workflow
1. Step one
2. Step two

## Output
After completing work, provide:
- What was done (files created/modified)
- Key decisions and rationale
- Validation results
- Recommendations for next steps

## Rules
- Rule one
- Rule two

## Handoff Protocol
- If [condition] → suggest @agent-name
```

### Add a Skill

Create `.claude/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: "What this skill does and when to use it"
user-invocable: true
argument-hint: "[arguments]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Instructions for the skill.

Target: $ARGUMENTS

## Steps
1. ...
```

### Edit Architecture Patterns

Edit `docs/ARCHITECTURE.md` — all agents read this file before acting. Changes take effect immediately.

---

## 📚 Documentation

Full docs are available via VitePress:

```bash
cd specialist-agent
npm install && npm run docs:dev
```

- [Introduction](docs/guide/introduction.md)
- [Installation](docs/guide/installation.md)
- [Quick Start](docs/guide/quick-start.md)
- [Architecture Guide](docs/guide/architecture.md)
- [Agents Reference](docs/reference/agents.md)
- [Skills Reference](docs/reference/skills.md)

---

## 📫 Contributing

Contributions are welcome!

- Star this repo if you find it useful
- **Issues** — Report bugs or suggest improvements
- **Pull Requests** — New packs, agents, skills, or pattern improvements
- **Discussions** — Share how you've customized Specialist Agent

```bash
git checkout -b feature/my-feature
git commit -m 'feat: add my feature'
git push origin feature/my-feature
# Open a Pull Request
```

---

## 📝 License

MIT — Use freely. See [LICENSE](LICENSE).

---

<p align="center">
  <b>Built for developers who use Claude Code every day.</b><br/>
  <a href="https://github.com/HerbertJulio/specialist-agent">GitHub</a> · <a href="docs/guide/introduction.md">Docs</a> · <a href="https://github.com/HerbertJulio/specialist-agent/issues">Issues</a>
</p>
