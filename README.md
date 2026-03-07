<p align="center">
  <img src="docs/public/logo-animated.svg" alt="Specialist Agent" width="200" />
</p>

<h1 align="center">Specialist Agent</h1>

<p align="center">
  <b>Your AI Development Team</b><br/>
  30 specialized agents and 23 skills that build, review, debug, and ship production code — across any framework, any stack.
</p>

[![CI](https://github.com/HerbertJulio/specialist-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/HerbertJulio/specialist-agent/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/specialist-agent)](https://www.npmjs.com/package/specialist-agent)
[![npm downloads](https://img.shields.io/npm/dm/specialist-agent)](https://www.npmjs.com/package/specialist-agent)
[![Release](https://img.shields.io/github/v/release/HerbertJulio/specialist-agent?label=Release)](https://github.com/HerbertJulio/specialist-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/Docs-VitePress-646cff.svg)](https://specialistagent.com.br/)

---

## Install

Two options — pick one:

```bash
# Option 1: CLI (recommended)
cd your-project
npx specialist-agent init

# Option 2: Claude Code Marketplace
/plugin install specialist-agent
```

The installer detects your framework, asks Full or Lite mode, and copies agents + skills to `.claude/`. No dependencies, no config files modified, no lock on any platform.

**Works with:** Claude Code, Cursor, VS Code, Windsurf, Codex, OpenCode

---

## What It Does — Real Examples

```bash
# Build a complete feature module with types, service, components, and tests
"Use @builder to create a products module with CRUD"

# Get a 3-in-1 code review: spec compliance + code quality + architecture
"Use @reviewer to review the auth module"

# Systematic 4-phase debugging — not guesswork
"Use @doctor to investigate the 500 error on login"

# Plan before coding — adaptive plan based on complexity
/plan add user authentication with JWT

# Test-Driven Development with real test output as proof
/tdd implement calculateDiscount function

# Multi-domain audit in one pass: security, performance, architecture, deps
/audit src/modules/auth

# Evaluate feasibility before committing to a feature
/discovery implement real-time notifications with WebSocket

# Scaffold a new project from scratch
"Use @starter to create a SaaS app with Next.js + PostgreSQL + Stripe"

# Migrate architecture patterns across your entire codebase
/migrate-architecture mvc to clean full project
```

---

## Why Specialist Agent?

| | Specialist Agent | Generic AI |
|---|---|---|
| **Agents** | 30 domain-specialized | 1 generic prompt |
| **Frameworks** | 7 tailored packs (Next.js, React, Vue, SvelteKit, Angular, Astro, Nuxt) | Generic only |
| **Verification** | Proof-based — runs tests, shows output | Trust-based — "it should work" |
| **Cost control** | Lite mode (60-80% cheaper) + `/estimate` | Full cost always |
| **Context** | Fresh context per task — no pollution | Degrades over conversation |
| **Memory** | Cross-session decisions persist | Starts from zero every time |
| **Rollback** | Git checkpoints per task | None |
| **Governance** | Anti-rationalization + verification protocol | None |
| **Platforms** | 6 platforms | 1-3 |

---

## All 30 Agents

### Core — Build, Review, Debug

| Agent | What it Does | Example |
|-------|--------------|---------|
| `@starter` | Scaffold projects from scratch | "Create a Next.js + Prisma app" |
| `@builder` | Build modules, components, services | "Create a products module with CRUD" |
| `@reviewer` | 3-in-1 review: spec + quality + architecture | "Review the auth module" |
| `@doctor` | Systematic 4-phase debugging | "Investigate the 500 error on login" |
| `@migrator` | Modernize legacy code | "Migrate src/legacy/ to TypeScript" |

### Workflow — Plan, Execute, Coordinate

| Agent | What it Does | Example |
|-------|--------------|---------|
| `@planner` | Adaptive planning by complexity | "Plan the checkout flow" |
| `@executor` | Execute plans with checkpoints and gates | "Execute the auth migration plan" |
| `@tdd` | Test-Driven Development (RED-GREEN-REFACTOR) | "TDD the discount calculator" |
| `@debugger` | 4-phase systematic debugging | "Debug the state sync issue" |
| `@pair` | Real-time pair programming | "Pair with me on the payment flow" |
| `@analyst` | Requirements to technical specs | "Spec out the notification system" |
| `@orchestrator` | Coordinate multiple agents on complex tasks | "Orchestrate the full checkout feature" |

### Specialists — Domain Experts

| Agent | What it Does | Example |
|-------|--------------|---------|
| `@api` | REST/GraphQL API design with OpenAPI | "Design the orders API" |
| `@perf` | Performance profiling and optimization | "Optimize the dashboard load time" |
| `@security` | Auth, OWASP Top 10, encryption | "Audit for XSS and injection" |
| `@finance` | Payments, billing, subscriptions | "Integrate Stripe checkout" |
| `@cloud` | AWS, GCP, Terraform, serverless | "Set up Lambda + API Gateway" |
| `@data` | Database design, migrations, caching | "Design the schema with Prisma" |
| `@devops` | Docker, Kubernetes, CI/CD | "Create the GitHub Actions pipeline" |
| `@i18n` | Internationalization | "Add Portuguese support" |
| `@docs` | Documentation generation | "Generate API docs from code" |
| `@refactor` | Code refactoring with safety | "Extract service layer from controllers" |
| `@deps` | Dependency management and updates | "Audit and update dependencies" |
| `@legal` | GDPR, LGPD, CCPA compliance | "Check LGPD compliance" |
| `@designer` | Design systems, accessibility | "Create the component library" |
| `@tester` | Test strategies and coverage | "Create test strategy for payments" |
| `@architect` | Architecture migration (DDD, CQRS, Hexagonal) | "Migrate to Clean Architecture" |
| `@ripple` | Cascading effect analysis | "What breaks if I change the User model?" |

### Business — Product & Growth

| Agent | What it Does | Example |
|-------|--------------|---------|
| `@marketing` | Landing pages, SEO, analytics | "Create the pricing page" |
| `@product` | Feature specs, user stories, roadmap | "Write user stories for onboarding" |
| `@support` | Help docs, error pages, FAQ | "Create the help center" |

### Support — Explore & Remember

| Agent | What it Does | Example |
|-------|--------------|---------|
| `@scout` | Quick project analysis (~500 tokens) | "Analyze this project" |
| `@explorer` | Deep codebase exploration | "Map the module dependencies" |
| `@memory` | Cross-session decision persistence | "Remember: use Zustand for state" |

---

## All 23 Skills

Skills are slash commands that trigger repeatable workflows:

| Skill | What it Does | Example |
|-------|--------------|---------|
| `/brainstorm` | Socratic brainstorming before planning | `/brainstorm notification system` |
| `/plan` | Adaptive feature planning | `/plan add user authentication` |
| `/tdd` | Test-driven development cycle | `/tdd implement calculateDiscount` |
| `/debug` | 4-phase systematic debugging | `/debug login returns 401` |
| `/discovery` | Feasibility evaluation with GO/NO-GO verdict | `/discovery real-time chat with WebSocket` |
| `/codereview` | Multi-reviewer parallel code review (3 perspectives) | `/codereview src/modules/auth` |
| `/commit` | Smart conventional commits with validation | `/commit` |
| `/lint` | Lint and auto-fix (detects Biome/ESLint/Prettier) | `/lint src/` |
| `/audit` | Multi-domain audit: security + perf + arch + deps | `/audit src/modules/auth` |
| `/onboard` | Codebase onboarding for new developers | `/onboard` |
| `/checkpoint` | Save/restore progress with git | `/checkpoint create before-refactor` |
| `/health` | Project health score (0-100) | `/health` |
| `/verify` | Proof-based verification before completion | `/verify` |
| `/remember` | Save a decision to memory | `/remember use Zustand for state` |
| `/recall` | Query saved decisions | `/recall state management` |
| `/estimate` | Estimate token cost before starting | `/estimate add payments module` |
| `/finish` | Finalize branch with metrics | `/finish` |
| `/learn` | Learning mode — explains while building | `/learn create a REST API` |
| `/tutorial` | Interactive guided tutorial | `/tutorial` |
| `/worktree` | Git worktree isolation for parallel tasks | `/worktree feature/payments` |
| `/write-skill` | Create or improve custom skills | `/write-skill deploy-preview` |
| `/migrate-framework` | Migrate between frameworks | `/migrate-framework react to vue` |
| `/migrate-architecture` | Migrate architecture patterns | `/migrate-architecture mvc to clean` |

---

## 7 Framework Packs

Each pack includes 4 specialized agents, 4 lite agents, and 12 skills — all tailored to the framework's conventions:

| Pack | Stack | What You Get |
|------|-------|--------------|
| **Next.js** | App Router + TypeScript + Zustand | Server Components, RSC patterns, route handlers |
| **React** | React 18 + TypeScript + React Query | Hooks, Suspense, code splitting |
| **Vue 3** | Vue 3 + TypeScript + Pinia | Composition API, composables, Vue Query |
| **SvelteKit** | SvelteKit 2 + TypeScript | Stores, load functions, form actions |
| **Angular** | Angular 17+ + Standalone + Signals | DI, standalone components, RxJS |
| **Astro** | Astro 4+ + Islands | Content Collections, island architecture |
| **Nuxt** | Nuxt 3 + Auto-imports + Nitro | useFetch, server routes, auto-imports |

---

## Verification Protocol

Every agent must show actual command output before claiming completion:

```
CLAIM: "Tests pass"       → PROOF: actual test output shown
CLAIM: "Build succeeds"   → PROOF: build command output shown
CLAIM: "No vulnerabilities" → PROOF: npm audit / lint output shown
```

Anti-rationalization tables prevent agents from cutting corners. No "should work" — run the command, show the output, then claim done.

---

## Native Hooks

4 Claude Code hooks that run automatically after install:

| Hook | Trigger | What it Does |
|------|---------|-------------|
| **Security Guard** | Before command execution | Blocks `rm -rf /`, `DROP TABLE`, force push to main, `curl \| bash` |
| **Auto-Dispatch** | On every prompt | Suggests the best agent for your intent |
| **Session Context** | On session start | Injects project state (branch, installed agents, memory) |
| **Auto-Format** | After file write/edit | Formats files with your project's formatter |

Plus 7 lifecycle hooks (`session-start`, `before-plan`, `after-task`, `before-review`, `after-review`, `on-error`, `session-end`) configurable in `hooks/hooks.json`.

---

## Full vs Lite Mode

| Mode | Model | Best For | Cost |
|------|-------|----------|------|
| **Full** | Sonnet/Opus | Complex features, architecture, PRs | Standard |
| **Lite** | Haiku | Scaffolding, quick fixes, rapid iteration | **60-80% less** |

Every agent has a Lite variant. Use `/estimate` to preview cost before starting.

---

## CLI Commands

```bash
npx specialist-agent init                    # Install agents + skills
npx specialist-agent detect                  # Detect framework and architecture
npx specialist-agent list                    # List installed agents
npx specialist-agent create-agent @my-agent  # Create a custom agent
npx specialist-agent profiles set startup-fast  # Apply team profile
npx specialist-agent community list          # Browse community skills
```

---

## Team Profiles

| Profile | Description |
|---------|-------------|
| `startup-fast` | Speed-first, Haiku, minimal ceremony |
| `enterprise-strict` | Full validation, all gates enforced |
| `learning-mode` | Explains every decision while building |
| `cost-optimized` | Minimizes token usage across all agents |

---

## Platforms

| Platform | Install |
|----------|---------|
| **Claude Code** | `npx specialist-agent init` or `/plugin install` |
| **Cursor** | Copy `.cursor-plugin/` |
| **VS Code** | `.vscode/extension.json` |
| **Windsurf** | `.windsurf/plugin.json` |
| **Codex** | `.codex/INSTALL.md` |
| **OpenCode** | `.opencode/INSTALL.md` |

---

## Documentation

Full docs: **[specialistagent.com.br](https://specialistagent.com.br/)**

```bash
npm run docs:dev   # Run docs locally
```

---

## Contributing

Contributions welcome.

```bash
git checkout -b feature/my-feature
git commit -m 'feat: add my feature'
git push origin feature/my-feature
```

---

## License

MIT
