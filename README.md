<p align="center">
  <img src="docs/public/logo-animated.svg" alt="Specialist Agent" width="180" />
</p>

<h1 align="center">Specialist Agent</h1>

<p align="center">Your AI development team. 35 agents. 24 skills. Ship faster.</p>

<p align="center">
  <a href="https://github.com/HerbertJulio/specialist-agent/actions/workflows/ci.yml"><img src="https://github.com/HerbertJulio/specialist-agent/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/specialist-agent"><img src="https://img.shields.io/npm/v/specialist-agent" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/specialist-agent"><img src="https://img.shields.io/npm/dm/specialist-agent" alt="downloads" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT" /></a>
  <a href="https://specialistagent.com.br"><img src="https://img.shields.io/badge/Docs-specialistagent.com.br-646cff.svg" alt="Docs" /></a>
</p>

---

```bash
npx specialist-agent init
```

```bash
"Use @builder to create a payments module with CRUD"
"Use @reviewer to review the auth module"
/tdd implement calculateDiscount function
```

---

## Core Agents

The foundation. Build, review, debug, migrate.

| Agent | What it does | Example |
|-------|-------------|---------|
| `@starter` | Scaffold new projects from scratch | `"Create a Next.js + Prisma + Stripe app"` |
| `@builder` | Build modules, components, services | `"Create a products module with CRUD"` |
| `@reviewer` | 3-in-1 review: spec + quality + architecture | `"Review the auth module"` |
| `@doctor` | Systematic 4-phase debugging | `"Investigate the 500 error on login"` |
| `@migrator` | Modernize legacy code | `"Migrate src/legacy/ to TypeScript"` |

## Workflow Agents

Plan, execute, coordinate, remember.

| Agent | What it does | Example |
|-------|-------------|---------|
| `@planner` | Adaptive planning by complexity | `"Plan the checkout flow"` |
| `@executor` | Execute plans with checkpoints and gates | `"Execute the auth migration plan"` |
| `@tdd` | Test-Driven Development (RED-GREEN-REFACTOR) | `"TDD the discount calculator"` |
| `@debugger` | Systematic debugging with hypotheses | `"Debug the state sync issue"` |
| `@pair` | Real-time pair programming | `"Pair with me on the payment flow"` |
| `@analyst` | Requirements to technical specs | `"Spec out the notification system"` |
| `@orchestrator` | Coordinate multiple agents on complex tasks | `"Orchestrate the full checkout feature"` |
| `@scout` | Quick project analysis | `"Analyze this project"` |
| `@memory` | Cross-session decision persistence | `"Remember: use Zustand for state"` |

## Engineering Agents

Domain specialists for every layer of your stack.

| Agent | What it does | Example |
|-------|-------------|---------|
| `@api` | REST/GraphQL API design with OpenAPI | `"Design the orders API"` |
| `@perf` | Performance profiling and optimization | `"Optimize the dashboard load time"` |
| `@i18n` | Internationalization | `"Add Portuguese support"` |
| `@docs` | Documentation generation | `"Generate API docs from code"` |
| `@refactor` | Code refactoring with safety nets | `"Extract service layer from controllers"` |
| `@deps` | Dependency management and updates | `"Audit and update dependencies"` |
| `@explorer` | Deep codebase exploration | `"Map the module dependencies"` |
| `@finance` | Payments, billing, subscriptions | `"Integrate Stripe checkout"` |
| `@cloud` | AWS, GCP, Terraform, serverless | `"Set up Lambda + API Gateway"` |
| `@security` | Auth, OWASP Top 10, encryption | `"Audit for XSS and injection"` |
| `@designer` | Design systems, accessibility | `"Create the component library"` |
| `@data` | Database design, migrations, caching | `"Design the schema with Prisma"` |
| `@devops` | Docker, Kubernetes, CI/CD | `"Create the GitHub Actions pipeline"` |
| `@tester` | Test strategies and coverage | `"Create test strategy for payments"` |
| `@legal` | GDPR, LGPD, CCPA compliance | `"Check LGPD compliance"` |
| `@architect` | Architecture migration (DDD, Clean, Hexagonal) | `"Migrate to Clean Architecture"` |
| `@ripple` | Cascading effect analysis | `"What breaks if I change the User model?"` |

## Business Agents

Product, growth, and support.

| Agent | What it does | Example |
|-------|-------------|---------|
| `@marketing` | Landing pages, copy, SEO, growth analytics | `"Create the pricing page with SEO"` |
| `@product` | Roadmaps, specs, PRDs, user stories | `"Write PRD for the onboarding flow"` |
| `@support` | Help docs, FAQs, runbooks, error pages | `"Create the help center"` |

## Automation Agents

Autonomous triage and resolution.

| Agent | What it does | Example |
|-------|-------------|---------|
| `@sentry-triage` | Pull Sentry errors, cross-reference PRs, prioritize, auto-fix | `"Triage today's Sentry errors"` |

---

## Skills

Slash commands that trigger repeatable workflows.

**Planning**

| Skill | What it does |
|-------|-------------|
| `/brainstorm` | Socratic brainstorming before planning |
| `/plan` | Adaptive feature planning |
| `/discovery` | Feasibility evaluation with GO/NO-GO verdict |
| `/estimate` | Estimate token cost before starting |

**Development**

| Skill | What it does |
|-------|-------------|
| `/tdd` | Test-driven development cycle |
| `/debug` | 4-phase systematic debugging |
| `/autofix` | Automatic error resolution |
| `/lint` | Lint and auto-fix (Biome/ESLint/Prettier) |
| `/commit` | Smart conventional commits with validation |

**Quality**

| Skill | What it does |
|-------|-------------|
| `/verify` | Proof-based verification before completion |
| `/codereview` | Multi-reviewer parallel code review |
| `/audit` | Multi-domain audit: security + perf + arch + deps |
| `/health` | Project health score (0-100) |

**Workflow**

| Skill | What it does |
|-------|-------------|
| `/checkpoint` | Save/restore progress with git |
| `/finish` | Finalize branch with metrics |
| `/worktree` | Git worktree isolation for parallel tasks |
| `/learn` | Learning mode, explains while building |

**Migration**

| Skill | What it does |
|-------|-------------|
| `/migrate-framework` | Migrate between frameworks |
| `/migrate-architecture` | Migrate architecture patterns (MVC, Clean, DDD, Hexagonal) |

**Knowledge**

| Skill | What it does |
|-------|-------------|
| `/remember` | Save a decision to memory |
| `/recall` | Query saved decisions |
| `/onboard` | Codebase onboarding for new developers |
| `/tutorial` | Interactive guided tutorial |
| `/write-skill` | Create or improve custom skills |

---

## Framework Packs

7 packs, each with specialized agents, lite agents, and skills tailored to the framework's conventions.

**Next.js** | **React** | **Vue 3** | **SvelteKit** | **Angular** | **Astro** | **Nuxt**

The installer auto-detects your framework. Each pack follows the idioms of its ecosystem: server components for Next.js, composables for Vue, stores for SvelteKit, signals for Angular, islands for Astro, auto-imports for Nuxt.

---

## How It Works

**Verification protocol** every agent must show actual command output before claiming completion. No "should work." Run the command, show the output, then claim done.

**Anti-rationalization** built-in tables prevent agents from cutting corners or skipping steps.

**Context isolation** each subtask gets fresh context. No accumulated pollution across long sessions.

**Full vs Lite** every agent has a Lite variant. Full mode for complex work, Lite for scaffolding and quick fixes at 60-80% lower cost.

---

## Platforms

Works with **Claude Code**, **Cursor**, **VS Code**, **Windsurf**, **Codex**, and **OpenCode**.

```bash
npx specialist-agent init          # Install agents + skills
npx specialist-agent detect        # Detect framework and architecture
npx specialist-agent list          # List installed agents
```

---

## Documentation

**[specialistagent.com.br](https://specialistagent.com.br)**

---

## Contributing

```bash
git checkout -b feature/my-feature
git commit -m 'feat: add my feature'
git push origin feature/my-feature
```

---

## License

[MIT](LICENSE)
