# Agent Catalog

35 specialized agents organized by domain. Each agent is an expert in its area — call the right one for the job.

## Core Agents

The foundation. Building, reviewing, debugging, and migrating code.

| Agent | Description | Example |
|-------|-------------|---------|
| `@starter` | Create new projects from scratch | "Use @starter to create a Next.js SaaS with Stripe" |
| `@builder` | Build modules, components, services | "Use @builder to create the products module with CRUD" |
| `@reviewer` | Unified 3-in-1 code review (quality, security, architecture) | "Use @reviewer to review src/modules/auth/" |
| `@doctor` | 4-phase systematic debugging | "Use @doctor to investigate the checkout timeout" |
| `@migrator` | Modernize legacy code safely | "Use @migrator to convert class components to hooks" |

## Workflow Agents

Orchestrating how you work — planning, executing, testing, pairing.

| Agent | Description | Example |
|-------|-------------|---------|
| `@planner` | Adaptive planning that scales with complexity | "Use @planner to plan the notification system" |
| `@executor` | Execute plans with checkpoints and rollback | "Use @executor to implement the plan" |
| `@tdd` | Test-Driven Development with Red-Green-Refactor | "Use @tdd to build the payment validator" |
| `@debugger` | Systematic debugging with hypothesis testing | "Use @debugger to trace the memory leak" |
| `@pair` | AI pair programming with real-time feedback | "Use @pair to work on the search feature" |
| `@analyst` | Transform requirements into technical specs | "Use @analyst to spec the multi-tenant system" |
| `@orchestrator` | Coordinate multiple agents for complex tasks | "Use @orchestrator to build the auth module" |
| `@scout` | Analyze project structure and recommend agents | "Use @scout to analyze this project" |
| `@memory` | Persist decisions and context across sessions | "Use @memory to save the architecture decisions" |

## Engineering Agents

Deep domain expertise — from API design to cloud architecture.

| Agent | Description | Example |
|-------|-------------|---------|
| `@api` | REST/GraphQL API design with OpenAPI specs | "Use @api to design the orders endpoint" |
| `@perf` | Performance profiling and optimization | "Use @perf to optimize the dashboard load time" |
| `@i18n` | Internationalization and localization | "Use @i18n to add Spanish support" |
| `@docs` | Generate documentation from code | "Use @docs to document the auth module" |
| `@refactor` | Safe code refactoring with tests | "Use @refactor to extract the validation logic" |
| `@deps` | Dependency management and upgrades | "Use @deps to audit and update dependencies" |
| `@explorer` | Deep codebase exploration and analysis | "Use @explorer to map the data flow in checkout" |
| `@finance` | Payment systems, billing, subscriptions | "Use @finance to implement Stripe subscriptions" |
| `@cloud` | Cloud architecture, IaC, serverless | "Use @cloud to design the AWS infrastructure" |
| `@security` | Auth, OWASP, encryption, audit | "Use @security to audit the authentication flow" |
| `@designer` | Design systems, accessibility, UI patterns | "Use @designer to create the component library" |
| `@data` | Database design, migrations, optimization | "Use @data to design the multi-tenant schema" |
| `@devops` | Docker, Kubernetes, CI/CD pipelines | "Use @devops to set up the GitHub Actions pipeline" |
| `@tester` | Test strategies and coverage plans | "Use @tester to create the testing strategy" |
| `@legal` | GDPR, LGPD, compliance implementation | "Use @legal to implement LGPD consent management" |
| `@architect` | Full system architecture design and migration | "Use @architect to migrate to hexagonal architecture" |
| `@ripple` | Impact analysis of code changes | "Use @ripple to analyze the impact of removing UserService" |

## Business Agents

Strategy, growth, and user-facing operations.

| Agent | Description | Example |
|-------|-------------|---------|
| `@marketing` | Copy, SEO, growth experiments, social strategy | "Use @marketing to write landing page copy" |
| `@product` | Product roadmaps, specs, PRDs, feature prioritization | "Use @product to create the Q1 roadmap" |
| `@support` | Support docs, FAQs, runbooks, escalation paths | "Use @support to create the API troubleshooting guide" |

## Automation Agents

Automate repetitive ops — error triage, production monitoring, fix workflows.

| Agent | Description | Example |
|-------|-------------|---------|
| `@sentry-triage` | Pull Sentry errors, cross-reference PRs, prioritize by severity, auto-create fix PRs | "Use @sentry-triage to check errors from the last 24h" |

## Framework-Specific Agents

Each framework pack includes optimized versions of core agents:

| Pack | Agents Included |
|------|-----------------|
| Vue 3 | @builder, @reviewer, @doctor, @migrator |
| React | @builder, @reviewer, @doctor, @migrator |
| Next.js | @builder, @reviewer, @doctor, @migrator |
| SvelteKit | @builder, @reviewer, @doctor, @migrator |
| Angular | @builder, @reviewer, @doctor, @migrator |
| Astro | @builder, @reviewer, @doctor, @migrator |
| Nuxt | @builder, @reviewer, @doctor, @migrator |

## Agent Modes

Every agent has two modes:

| Mode | Model | Use Case |
|------|-------|----------|
| Full | Sonnet/Opus | Maximum quality, detailed output |
| Lite | Haiku | Lower cost, faster responses |

Choose during installation: `npx specialist-agent init`
