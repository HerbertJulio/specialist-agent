<p align="center">
  <img src="docs/public/logo-animated.svg" alt="Specialist Agent" width="200" />
</p>

<h1 align="center">Specialist Agent</h1>

<p align="center">
  <b>Your AI Development Team</b><br/>
  27+ specialized agents that build, review, debug, and ship production code.
</p>

[![CI](https://github.com/HerbertJulio/specialist-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/HerbertJulio/specialist-agent/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/specialist-agent)](https://www.npmjs.com/package/specialist-agent)
[![npm downloads](https://img.shields.io/npm/dm/specialist-agent)](https://www.npmjs.com/package/specialist-agent)
[![Release](https://img.shields.io/github/v/release/HerbertJulio/specialist-agent?label=Release)](https://github.com/HerbertJulio/specialist-agent/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/Docs-VitePress-646cff.svg)](https://specialistagent.com.br/)

---

## Why Specialist Agent?

| | Specialist Agent | Others |
|---|---|---|
| **Agents** | 27+ specialized | 1-5 generic |
| **Frameworks** | Next.js, React, Vue, SvelteKit, Angular, Astro, Nuxt | Generic only |
| **Cost** | Lite mode (60-80% cheaper) | Full cost always |
| **Verification** | Proof-based (command output) | Trust-based ("it works") |
| **Memory** | Cross-session persistence | None |
| **Rollback** | Git checkpoints | None |
| **Hooks** | 11 (7 lifecycle + 4 native) | 0-1 |
| **Platforms** | 6 (Claude, Cursor, VS Code, Windsurf, Codex, OpenCode) | 1-3 |

---

## Install

**Marketplace:**
```
/plugin install specialist-agent
```

**CLI:**
```bash
npx specialist-agent init
```

Done. Start building.

---

## Agents

### Core

| Agent | What it Does |
|-------|--------------|
| `@starter` | Create projects from scratch |
| `@builder` | Build modules, components, services |
| `@reviewer` | Unified 3-in-1 review (spec + quality + architecture) |
| `@doctor` | Debug issues systematically |
| `@migrator` | Modernize legacy code |

### Workflow

| Agent | What it Does |
|-------|--------------|
| `@planner` | Plan features adaptively by complexity |
| `@executor` | Execute with checkpoints, gates, and cost tracking |
| `@tdd` | Test-Driven Development (RED-GREEN-REFACTOR) |
| `@debugger` | 4-phase systematic debugging |
| `@pair` | Real-time pair programming |
| `@analyst` | Requirements to technical specs |
| `@orchestrator` | Coordinate multiple agents |

### Specialists

| Agent | What it Does |
|-------|--------------|
| `@api` | REST/GraphQL API design |
| `@perf` | Performance optimization |
| `@security` | Auth, OWASP, encryption |
| `@finance` | Payments, billing, subscriptions |
| `@cloud` | AWS, GCP, Terraform, serverless |
| `@data` | Database design, migrations, caching |
| `@devops` | Docker, K8s, CI/CD |
| `@i18n` | Internationalization |
| `@docs` | Documentation generation |
| `@refactor` | Code refactoring |
| `@deps` | Dependency management |
| `@legal` | GDPR, LGPD, CCPA compliance |
| `@designer` | Design systems, accessibility |
| `@tester` | Test strategies |
| `@architect` | Full system architecture migration (DDD, CQRS, Hexagonal) |
| `@ripple` | Cascading effect analysis |

### Support

| Agent | What it Does |
|-------|--------------|
| `@scout` | Quick project analysis (~500 tokens) |
| `@explorer` | Deep codebase exploration |
| `@memory` | Session memory management |

---

## Skills

| Skill | What it Does |
|-------|--------------|
| `/brainstorm` | Socratic brainstorming - refine ideas before planning |
| `/plan` | Plan a feature adaptively |
| `/tdd` | Test-driven development cycle |
| `/debug` | 4-phase systematic debugging |
| `/codereview` | Multi-reviewer parallel code review (3 perspectives) |
| `/commit` | Smart conventional commits with validation |
| `/lint` | Lint and auto-fix (detects Biome/ESLint/Prettier) |
| `/audit` | Multi-domain code audit (security + perf + architecture + deps) |
| `/onboard` | Codebase onboarding for new developers |
| `/checkpoint` | Save/restore progress with git |
| `/health` | Project health score (0-100) |
| `/verify` | Verification before completion (proof-based) |
| `/remember` | Save decisions to memory |
| `/recall` | Query saved decisions |
| `/estimate` | Estimate token cost before starting |
| `/finish` | Finalize branch with metrics |
| `/learn` | Learning mode - explains while building |
| `/tutorial` | Interactive tutorial |
| `/worktree` | Git worktree isolation for parallel tasks |
| `/write-skill` | Create or improve skills with TDD |
| `/migrate-framework` | Migrate between frameworks |

---

## Framework Packs

| Pack | Stack |
|------|-------|
| **Next.js** | App Router + TypeScript + Zustand |
| **React** | React 18 + TypeScript + React Query |
| **Vue 3** | Vue 3 + TypeScript + Pinia |
| **SvelteKit** | SvelteKit 2 + TypeScript |
| **Angular** | Angular 17+ Standalone + Signals |
| **Astro** | Astro 4+ Islands + Content Collections |
| **Nuxt** | Nuxt 3 + Auto-imports + Nitro |

7 framework packs, each with 4 specialized agents, 4 lite agents, and 12 skills.

---

## Examples

```bash
# New project
"Use @starter to create an e-commerce app with Next.js + PostgreSQL"

# Build a feature
"Use @builder to create a products module with CRUD"

# Review code
"Use @reviewer to review the auth module"

# Debug
"Use @doctor to investigate the 500 error"

# Plan
/plan add user authentication

# TDD
/tdd implement calculateDiscount

# Audit
/audit src/modules/auth

# Onboard
/onboard

# Save progress
/checkpoint create before-refactor
```

---

## Verification Protocol

All agents verify claims with evidence before marking work complete:

```
CLAIM: "Tests pass"
PROOF: Must show actual test output in the same message

CLAIM: "Build succeeds"
PROOF: Must show build command output

CLAIM: "No security issues"
PROOF: Must show npm audit / lint output
```

No "should work" - run the command, show the output.

---

## Hooks

7 lifecycle hooks + 4 native Claude Code hooks:

| Hook | When |
|------|------|
| `session-start` | Session begins |
| `before-plan` | Before `@planner` creates a plan |
| `after-task` | After any task completes |
| `before-review` | Before `@reviewer` starts |
| `after-review` | After `@reviewer` finishes |
| `on-error` | When an error occurs |
| `session-end` | Session ends |

### Native Hooks (Claude Code)

| Hook | Event | What it Does |
|------|-------|-------------|
| Security Guard | `PreToolUse` | Blocks dangerous commands (`rm -rf /`, force push, `DROP TABLE`) |
| Auto-Dispatch | `UserPromptSubmit` | Suggests the best agent for your prompt |
| Session Context | `SessionStart` | Injects project state (branch, agents, memory) |
| Auto-Format | `PostToolUse` | Auto-formats files after Write/Edit |

Configure lifecycle hooks in `hooks/hooks.json`. Native hooks in `.claude/settings.json`.

---

## Security

The Security Guard hook blocks dangerous commands **before** they execute:

- **CRITICAL:** `rm -rf /`, fork bombs, disk wipe commands
- **HIGH:** Force push to main, `git reset --hard`, `DROP TABLE`, `curl | bash`
- **MEDIUM:** Reading `.env` files, inline secrets in commands

Customize rules in `.specialist-agent/hooks/native/security-config.json`.

---

## Full vs Lite Mode

| Mode | Model | Cost |
|------|-------|------|
| Full | Sonnet/Opus | Higher accuracy |
| Lite | Haiku | 60-80% cheaper |

Choose during installation. All 27+ agents have lite variants.

---

## Platforms

| Platform | Install |
|----------|---------|
| Claude Code | `npx specialist-agent init` or `/plugin install` |
| Cursor | Copy `.cursor-plugin/` |
| VS Code | `.vscode/extension.json` |
| Windsurf | `.windsurf/plugin.json` |
| Codex | `.codex/INSTALL.md` |
| OpenCode | `.opencode/INSTALL.md` |

---

## CLI

```bash
npx specialist-agent init                    # Install
npx specialist-agent create-agent @my-agent  # Create agent
npx specialist-agent list                    # List agents
npx specialist-agent profiles set startup-fast  # Set profile
npx specialist-agent community list          # Community skills
```

---

## Team Profiles

| Profile | Description |
|---------|-------------|
| `startup-fast` | Move fast, Haiku |
| `enterprise-strict` | Full validation |
| `learning-mode` | Explain everything |
| `cost-optimized` | Minimize tokens |

---

## Industry Templates

| Template | For |
|----------|-----|
| E-commerce | Online stores |
| SaaS | Subscription apps |
| Fintech | Financial apps |

---

## Session Memory

```bash
# Save a decision
/remember use Zustand for state management

# Recall later
/recall state management
```

Decisions persist across sessions.

---

## Documentation

Full docs: [specialistagent.com.br](https://specialistagent.com.br/)

```bash
npm run docs:dev
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
