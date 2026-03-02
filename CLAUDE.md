# CLAUDE.md - Specialist Agent

## About

Your AI development team. 27+ specialized agents that build, review, debug, and ship production code.

**Available packs:** Vue 3, React, Next.js, SvelteKit, Angular, Astro, Nuxt

## Auto-Dispatch Rules

Automatically delegate based on user intent:

| Intent | Agent |
|--------|-------|
| Create modules, components, services | `@builder` |
| Review code, check architecture | `@reviewer` |
| Investigate bugs, trace errors | `@doctor` or `@debugger` |
| Migrate legacy code | `@migrator` |
| New project from scratch | `@starter` |
| Plan features | `@planner` |
| Execute with checkpoints | `@executor` |
| Test-first development | `@tdd` |
| Pair programming | `@pair` |
| Requirements to specs | `@analyst` |
| Coordinate agents | `@orchestrator` |
| Project analysis | `@scout` |
| API design | `@api` |
| Performance optimization | `@perf` |
| Internationalization | `@i18n` |
| Generate documentation | `@docs` |
| Refactoring | `@refactor` |
| Dependency management | `@deps` |
| Payments, billing | `@finance` |
| Cloud, IaC, serverless | `@cloud` |
| Auth, security audit | `@security` |
| Design systems, accessibility | `@designer` |
| Database design | `@data` |
| Docker, K8s, CI/CD | `@devops` |
| Test strategies | `@tester` |
| Codebase exploration | `@explorer` |
| GDPR, LGPD compliance | `@legal` |
| Architecture migration, system redesign | `@architect` |
| Impact analysis of changes | `@ripple` |

## Available Agents

### Core Agents

| Agent | When to Use |
|-------|-------------|
| `@starter` | Create projects from scratch |
| `@builder` | Build modules, components, services |
| `@reviewer` | Unified 3-in-1 review |
| `@doctor` | 4-phase debugging |
| `@migrator` | Modernize legacy code |

### Workflow Agents

| Agent | When to Use |
|-------|-------------|
| `@planner` | Adaptive planning |
| `@executor` | Execute with checkpoints |
| `@tdd` | Test-Driven Development |
| `@debugger` | Systematic debugging |
| `@pair` | Pair programming |
| `@analyst` | Requirements to specs |
| `@orchestrator` | Coordinate agents |

### Specialist Agents

| Agent | When to Use |
|-------|-------------|
| `@api` | REST/GraphQL API design |
| `@perf` | Performance optimization |
| `@i18n` | Internationalization |
| `@docs` | Documentation generation |
| `@refactor` | Code refactoring |
| `@deps` | Dependency management |
| `@finance` | Payments, billing |
| `@cloud` | Cloud architecture |
| `@security` | Auth, OWASP |
| `@designer` | Design systems |
| `@data` | Database design |
| `@devops` | Docker, K8s |
| `@tester` | Test strategies |
| `@legal` | GDPR, LGPD |
| `@architect` | Full system architecture migration |
| `@ripple` | Cascading effect analysis |

### Support Agents

| Agent | When to Use |
|-------|-------------|
| `@scout` | Project analysis |
| `@explorer` | Codebase exploration |
| `@memory` | Session memory |

## Available Skills

| Skill | What it Does |
|-------|--------------|
| `/brainstorm` | Socratic brainstorming before planning |
| `/plan` | Plan a feature |
| `/tdd` | Test-driven development |
| `/debug` | Debug an issue |
| `/verify` | Verify before claiming complete |
| `/audit` | Multi-domain code audit |
| `/onboard` | Codebase onboarding |
| `/checkpoint` | Save/restore progress |
| `/estimate` | Estimate cost |
| `/finish` | Finalize branch |
| `/learn` | Learn while building |
| `/health` | Project health score |
| `/remember` | Save decisions |
| `/recall` | Recall decisions |
| `/worktree` | Git worktree isolation |
| `/write-skill` | Create or improve skills |
| `/tutorial` | Interactive tutorial |
| `/codereview` | Multi-reviewer parallel code review |
| `/commit` | Smart conventional commits |
| `/lint` | Lint and auto-fix |
| `/migrate-framework` | Migrate between frameworks |

## Security Rules

- **NEVER** include secrets in shell commands
- Use environment variables for auth
- Reference CI secrets for npm publish

## Execution Summary

After each task:

```text
──── Specialist Agent: 2 agents (@builder, @reviewer) · 1 skill (/plan)
```

## Pack Structure

```text
packs/[framework]/
├── agents/           # Full agents
├── agents-lite/      # Lite agents
├── skills/           # Skills
├── ARCHITECTURE.md   # Patterns
└── CLAUDE.md         # Config
```

## Platforms

| Platform | Installation |
|----------|--------------|
| Claude Code | `npx specialist-agent init` |
| Cursor | `.cursor-plugin/` |
| VS Code | `.vscode/extension.json` |
| Windsurf | `.windsurf/plugin.json` |
| Codex | `.codex/INSTALL.md` |
| OpenCode | `.opencode/INSTALL.md` |

## Hooks

| Hook | When |
|------|------|
| session-start | Session starts |
| before-plan | Before @planner creates a plan |
| after-task | Task completes |
| on-error | Error occurs |
| before-review | Before @reviewer starts |
| after-review | After @reviewer finishes |
| session-end | Session ends |

### Native Hooks (Claude Code)

| Hook | Event | What it Does |
|------|-------|-------------|
| Security Guard | `PreToolUse` | Blocks dangerous Bash commands |
| Auto-Dispatch | `UserPromptSubmit` | Suggests agents based on intent |
| Session Context | `SessionStart` | Injects project state |
| Auto-Format | `PostToolUse` | Formats files after Write/Edit |

Configure in `hooks/hooks.json`.

## Cross-Cutting Concerns

### SOLID & Clean Code (Mandatory)

All generated code MUST follow SOLID principles and Clean Code standards:

| Principle | Enforcement |
|-----------|-------------|
| **S** - Single Responsibility | One reason to change per class/module. Split when responsibilities diverge. |
| **O** - Open/Closed | Extend via composition, interfaces, or strategy - never modify stable code. |
| **L** - Liskov Substitution | Subtypes must be substitutable. No surprises in overrides. |
| **I** - Interface Segregation | Small, focused interfaces. No "god interfaces" with 10+ methods. |
| **D** - Dependency Inversion | Depend on abstractions (interfaces, contracts), not concrete implementations. |

**Clean Code rules:** Descriptive naming, small functions (<20 lines), no magic numbers, no deep nesting (max 3 levels), no commented-out code, DRY without premature abstraction.

### Observability & Monitoring (Mandatory)

All production code MUST include observability from day 1 - not as an afterthought:

- **Structured logging**: JSON format, consistent fields (timestamp, level, service, traceId, message)
- **Error tracking**: Capture errors with context (user, request, stack trace). Never swallow exceptions silently.
- **Health checks**: Every service exposes `/health` or equivalent endpoint
- **Metrics**: Track RED metrics (Rate, Errors, Duration) for critical operations
- **Correlation IDs**: Propagate trace/request IDs across service boundaries
- **Never log**: passwords, tokens, PII, credit card numbers, API keys

Agents that MUST enforce observability: `@builder`, `@api`, `@data`, `@cloud`, `@devops`, `@finance`.

### Verification Protocol

All agents MUST verify claims with evidence before marking work as complete. No "should work" - run the command, show the output, then claim success. See `/verify` skill.

### Anti-Rationalization

Key agents include rationalization tables that prevent shortcuts. If you catch yourself thinking "just this once" or "it's obvious" - stop and follow the process.

### Context Isolation

`@orchestrator` and `@executor` use fresh context per subagent. Each task gets a self-contained prompt - no accumulated context pollution.

### Anti-Sycophancy

`@reviewer` agents push back on bad code. No "LGTM" or "Looks good!". Technical evaluation with evidence, YAGNI checks on suggestions.

### Persuasion-Backed Enforcement

Discipline agents (`@tdd`, `@debugger`, `@planner`, `@executor`, `@pair`) use science-backed enforcement: Authority (IEEE, NASA, Kent Beck), Commitment (contract-based), Social Proof (industry practice).

### Governance

- **Anti-Rationalization tables** in all discipline agents prevent shortcuts
- **Verification Protocol** ensures claims are backed by evidence
- **Execution Summary** at end of every task tracks agent/skill usage
- **Cost estimation** via `/estimate` before expensive operations
- **Health scoring** via `/health` measures project quality over time

## Quality Validation

```bash
node tests/validate-agents.mjs           # Validate all agents and skills
node tests/validate-agents.mjs --strict  # Treat warnings as errors
node tests/validate-skills-core.mjs      # Test runtime library
node tests/test-skills.mjs               # Behavioral skill tests
node tests/test-skills.mjs --verbose     # With details
```
