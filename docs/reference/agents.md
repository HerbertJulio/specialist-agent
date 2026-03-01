# Agents Reference

27+ specialized AI agents organized by purpose.

::: tip Cross-Cutting Features
All agents include:

- **Verification Protocol** — Proof-based verification before claiming completion
- **Anti-Rationalization** — Tables preventing common shortcuts and excuses
- **Lite Mode** — Cost-optimized Haiku variants (60-80% cheaper)
- **Handoff Protocol** — Structured agent-to-agent delegation

:::

## Quick Reference

| Need | Agent |
|------|-------|
| New project | `@starter` |
| New feature | `@builder` |
| Code review | `@reviewer` |
| Fix bug | `@doctor` or `@debugger` |
| Plan feature | `@planner` |
| Write tests | `@tdd` or `@tester` |
| API design | `@api` |
| Performance | `@perf` |
| Security | `@security` |
| Payments | `@finance` |
| Infrastructure | `@cloud` or `@devops` |
| Database | `@data` |
| Translations | `@i18n` |
| Documentation | `@docs` |
| Refactoring | `@refactor` |
| Dependencies | `@deps` |
| Compliance | `@legal` |
| Impact analysis | `@ripple` |
| Explore codebase | `@explorer` or `@scout` |

---

## Core Agents

### @starter

Create projects from scratch.

```bash
"Use @starter to create an e-commerce app with Next.js + PostgreSQL"
```

**Supports:** Vue, React, Next.js, SvelteKit, Angular, Astro, Nuxt, Express, Fastify, PostgreSQL, MongoDB, and more.

---

### @builder

Build modules, components, services, and tests.

```bash
# Full module
"Use @builder to create a products module with CRUD"

# Component
"Use @builder to create a ProductCard component"

# Service
"Use @builder to create the orders service for /v2/orders"
```

**Creates:** Types, adapters, services, hooks/composables, components, tests.

---

### @reviewer

Review code before merge. Three checks in one:

1. **Spec compliance** — Does it meet requirements?
2. **Code quality** — Is it clean and tested?
3. **Architecture fit** — Does it follow patterns?

```bash
"Use @reviewer to review the auth module"
```

**Output:** Pass/Fail verdict with specific issues.

---

### @doctor

Investigate bugs by tracing through layers.

```bash
"Use @doctor to investigate the 500 error on login"
```

**Traces:** Component → State → Adapter → Service → API

Finds root cause, not symptoms.

---

### @migrator

Modernize legacy code in 6 phases.

```bash
"Use @migrator to migrate src/legacy/billing/"
```

**Phases:** Analysis → Structure → Types → Services → State → Components

Approval required between phases.

---

## Workflow Agents

### @planner

Plan features based on complexity.

| Complexity | Planning |
|------------|----------|
| Trivial | Skip |
| Simple | Quick plan |
| Medium | Detailed plan |
| Complex | Full design |

```bash
"Use @planner to plan user authentication"
```

---

### @executor

Execute plans with checkpoints and quality gates.

- Tracks progress and costs
- Creates git checkpoints
- 5 quality gates with mandatory evidence
- Supports rollback

```bash
"Use @executor to implement the auth plan"
```

---

### @tdd

Test-Driven Development.

1. **RED** — Write failing test
2. **GREEN** — Make it pass
3. **REFACTOR** — Improve code

```bash
"Use @tdd to implement calculateDiscount"
```

No code without failing test first.

---

### @debugger

4-phase systematic debugging.

1. **Gather** — Collect evidence
2. **Analyze** — Form hypothesis
3. **Test** — Verify hypothesis
4. **Implement** — Fix and validate

```bash
"Use @debugger to fix the stale data issue"
```

---

### @pair

Real-time pair programming.

- Thinks out loud
- Catches mistakes early
- Suggests improvements

```bash
"Use @pair while I work on the checkout flow"
```

---

## Specialist Agents

### @api

Design REST and GraphQL APIs.

```bash
"Use @api to design the orders API with OpenAPI spec"
```

**Creates:** OpenAPI specs, GraphQL schemas, endpoint documentation.

---

### @perf

Optimize performance.

```bash
"Use @perf to analyze and optimize the dashboard"
```

**Analyzes:** Bundle size, runtime, network, rendering.

---

### @security

Application security.

```bash
"Use @security to implement JWT auth with refresh tokens"
"Use @security to audit for OWASP vulnerabilities"
```

**Covers:** Auth, RBAC/ABAC, encryption, vulnerability scanning.

---

### @finance

Financial systems.

```bash
"Use @finance to integrate Stripe payments"
```

**Covers:** Payments, subscriptions, invoicing, reporting.

---

### @cloud

Cloud architecture.

```bash
"Use @cloud to set up AWS with Terraform"
```

**Covers:** AWS, GCP, Azure, Terraform, Pulumi, serverless.

---

### @data

Database engineering.

```bash
"Use @data to design the schema with Prisma"
```

**Covers:** Schema design, migrations, caching, query optimization.

---

### @devops

DevOps and infrastructure.

```bash
"Use @devops to create Docker and Kubernetes config"
```

**Covers:** Docker, K8s, CI/CD, monitoring, logging.

---

### @i18n

Internationalization.

```bash
"Use @i18n to add multi-language support"
```

**Covers:** Translations, locale management, RTL support.

---

### @docs

Documentation generation.

```bash
"Use @docs to generate API documentation"
```

**Creates:** README, API docs, inline documentation.

---

### @refactor

Code refactoring.

```bash
"Use @refactor to clean up the utils module"
```

**Applies:** Extract method, remove duplication, improve naming.

---

### @deps

Dependency management.

```bash
"Use @deps to audit and update dependencies"
```

**Covers:** Security audit, outdated check, unused deps.

---

### @legal

Data privacy compliance.

```bash
"Use @legal to review for GDPR compliance"
```

**Covers:** GDPR, LGPD, CCPA, consent management.

---

### @tester

Testing specialist.

```bash
"Use @tester to create tests for the orders module"
```

**Creates:** Unit tests, integration tests, E2E tests.

---

### @designer

UI/UX implementation.

```bash
"Use @designer to create a design system with dark mode"
```

**Covers:** Design tokens, responsive layouts, accessibility.

---

### @ripple

Cascading effect analysis.

```bash
"Use @ripple to analyze the impact of renaming UserService"
"Use @ripple before changing the API response shape"
```

**Analyzes:** Direct dependents, indirect dependents, test coverage, breaking changes. Produces safe change plans ordered by dependency.

---

## Support Agents

### @scout

Quick project analysis. Recommends which agents to use.

```bash
"Use @scout to analyze this project"
```

Ultra-light. ~500 tokens.

---

### @analyst

Convert business requirements to technical specs.

```bash
"Use @analyst to convert these requirements to a technical spec"
```

---

### @orchestrator

Coordinate multiple agents.

```bash
"Use @orchestrator to build the feature with parallel agents"
```

---

### @memory

Session memory management.

```bash
"Use @memory to save this decision"
"Use @memory to recall previous decisions"
```

---

### @explorer

Explore unfamiliar codebases.

```bash
"Use @explorer to map this codebase — I'm new here"
```

**Output:** Health score, structure map, recommendations.

---

## Verification Protocol

All key agents verify claims with evidence before marking work complete.

```text
CLAIM: "Tests pass"
PROOF: Must show actual test output (PASS/FAIL)

CLAIM: "Build succeeds"
PROOF: Must show build command output

CLAIM: "Bug is fixed"
PROOF: Must show test that reproduces bug now passing
```

No "should work" or "probably fine". Run the command, show the output.

See the `/verify` skill for the full verification framework.

---

## Anti-Rationalization

Key agents include rationalization prevention tables:

| Excuse | Reality |
|--------|---------|
| "It's obvious, no need to test" | Obvious to you, not to the computer. Run the test. |
| "Just this once" | "Just this once" is how every bad habit starts. |
| "It should work" | "Should" is not evidence. Prove it. |
| "I'll verify later" | Later never comes. Verify now. |

If you catch yourself thinking "just this once" — stop and follow the process.

---

## Lite Versions

All agents have lite versions using the Haiku model.

| Aspect | Full | Lite |
|--------|------|------|
| Model | Sonnet/Opus | Haiku |
| Cost | Higher | 60-80% less |
| Best for | Complex tasks | Quick tasks |

Choose mode during installation:

```bash
npx specialist-agent init  # Select "Lite"
```
