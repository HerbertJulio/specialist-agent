# Skills Reference

24 repeatable workflows. Each skill is a slash command that guides your AI assistant through a structured process.

## Planning

| Skill | What it does | Example |
|-------|-------------|---------|
| `/brainstorm` | Socratic brainstorming before planning | `/brainstorm implement real-time chat` |
| `/plan` | Adaptive planning that scales with task complexity | `/plan add user authentication with JWT` |
| `/discovery` | Feasibility analysis with GO/NO-GO decision | `/discovery migrate from REST to GraphQL` |
| `/estimate` | Estimate cost and token usage before execution | `/estimate build the notification system` |

## Development

| Skill | What it does | Example |
|-------|-------------|---------|
| `/tdd` | Test-Driven Development with Red-Green-Refactor | `/tdd create the payment validator` |
| `/debug` | Systematic debugging with hypothesis testing | `/debug the checkout timeout issue` |
| `/autofix` | Auto-triage errors from Sentry/logs, prioritize, create fix PRs | `/autofix --timeframe=24h` |
| `/lint` | Lint and auto-fix code issues | `/lint src/modules/auth/` |
| `/commit` | Smart conventional commits with scope detection | `/commit` |

## Quality

| Skill | What it does | Example |
|-------|-------------|---------|
| `/verify` | Verify claims with evidence before marking complete | `/verify` |
| `/codereview` | Multi-reviewer parallel code review | `/codereview src/modules/checkout/` |
| `/audit` | Multi-domain code audit (security, performance, architecture) | `/audit src/` |
| `/health` | Project health score across multiple dimensions | `/health` |

## Workflow

| Skill | What it does | Example |
|-------|-------------|---------|
| `/checkpoint` | Save/restore progress for long tasks | `/checkpoint save` |
| `/finish` | Finalize branch with tests, lint, commit | `/finish` |
| `/worktree` | Git worktree isolation for parallel work | `/worktree create feature/auth` |
| `/learn` | Learn patterns while building | `/learn how this auth flow works` |

## Migration

| Skill | What it does | Example |
|-------|-------------|---------|
| `/migrate-framework` | Migrate between frameworks (Vue to React, etc.) | `/migrate-framework from vue to react` |
| `/migrate-architecture` | Migrate between architecture patterns | `/migrate-architecture to hexagonal` |

## Knowledge

| Skill | What it does | Example |
|-------|-------------|---------|
| `/remember` | Save decisions and context for future sessions | `/remember always use Zustand for state` |
| `/recall` | Recall saved decisions and context | `/recall state management` |
| `/onboard` | Codebase onboarding for new team members | `/onboard` |
| `/tutorial` | Interactive tutorial for learning the project | `/tutorial` |
| `/write-skill` | Create or improve custom skills | `/write-skill deploy` |
