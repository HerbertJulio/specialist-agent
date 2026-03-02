# Quick Start

::: tip Fastest path
Already installed? Jump straight to the first step below.
:::

::: code-group

```bash [Claude Code]
npx specialist-agent init
```

```bash [Marketplace]
/plugin install specialist-agent
```

:::

Then start using agents:

## 1. Analyze Your Project

```bash
"Use @scout to analyze this project"
```

Get recommendations for which agents to use.

## 2. Build a Feature

```bash
"Use @builder to create a products module with CRUD"
```

Creates: types, service, adapter, components, tests.

## 3. Review Before Merge

```bash
"Use @reviewer to review the products module"
```

Checks: spec compliance, code quality, architecture.

## 4. Debug an Issue

```bash
"Use @doctor to investigate the 500 error on login"
```

Traces through: Component → State → Adapter → Service → API

## 5. Plan a Complex Feature

```bash
/plan add user authentication with JWT
```

Creates adaptive plan based on complexity.

## 6. Test-Driven Development

```bash
/tdd implement calculateDiscount function
```

RED → GREEN → REFACTOR with proof.

## 7. Save Progress

```bash
/checkpoint create before-refactor
```

Rollback if needed.

## Common Workflows

### New Project

```bash
"Use @starter to create an app with Next.js + PostgreSQL"
```

### API Design

```bash
"Use @api to design the orders API with OpenAPI spec"
```

### Performance

```bash
"Use @perf to optimize the dashboard"
```

### Security

```bash
"Use @security to audit for vulnerabilities"
```

### Database

```bash
"Use @data to design the schema with Prisma"
```

### Payments

```bash
"Use @finance to integrate Stripe"
```

### Migrations

```bash
"Use @migrator to modernize src/legacy/"
```

## 8. Audit Before Release

```bash
/audit src/modules/auth
```

Security + performance + architecture + dependency check in one pass.

## 9. Onboard to a Codebase

```bash
/onboard
```

Maps architecture, detects conventions, generates developer guide.

## Skills

| Skill | What it Does |
|-------|--------------|
| `/brainstorm` | Socratic brainstorming |
| `/plan` | Plan a feature |
| `/tdd` | Test-driven development |
| `/debug` | Debug an issue |
| `/audit` | Multi-domain code audit |
| `/onboard` | Codebase onboarding |
| `/verify` | Verification before completion |
| `/checkpoint` | Save/restore progress |
| `/health` | Project health score |
| `/estimate` | Estimate token cost |
| `/remember` | Save a decision |
| `/recall` | Recall decisions |
| `/finish` | Finalize branch |
| `/learn` | Learn while building |
| `/worktree` | Git worktree isolation |
| `/write-skill` | Create custom skills |
| `/tutorial` | Interactive tutorial |
| `/migrate-framework` | Migrate between frameworks |

## Native Hooks

Specialist Agent includes 4 native Claude Code hooks that run automatically:

| Hook | What it Does |
|------|-------------|
| Security Guard | Blocks dangerous commands before execution |
| Auto-Dispatch | Suggests the best agent for your prompt |
| Session Context | Injects project state on session start |
| Auto-Format | Formats files after Write/Edit |

Installed during `npx specialist-agent init`. See [Hooks Reference](/reference/hooks) for details.

## What's Next?

- [All 27+ Agents](/reference/agents) - Full reference catalog
- [All Skills](/reference/skills) - Slash commands reference
- [Architecture](/guide/architecture) - Understand the patterns
- [Real-World Scenarios](/scenarios/) - See agents in action
