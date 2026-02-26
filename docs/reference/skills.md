# Skills Reference

Skills are shortcuts. Type `/skill-name` in Claude Code.

## Quick Reference

| Skill | What it Does |
|-------|--------------|
| `/plan` | Plan a feature |
| `/tdd` | Test-driven development |
| `/debug` | Debug an issue |
| `/checkpoint` | Save/restore progress |
| `/estimate` | Estimate token cost |
| `/finish` | Finalize branch |
| `/health` | Project health score |
| `/remember` | Save a decision |
| `/recall` | Recall decisions |
| `/learn` | Learn while building |
| `/tutorial` | Interactive tutorial |
| `/migrate-framework` | Migrate between frameworks |
| `/verify` | Verification before completion (proof-based) |
| `/write-skill` | Create or improve skills with TDD |
| `/audit` | Multi-domain code audit |
| `/onboard` | Codebase onboarding for new developers |
| `/worktree` | Git worktree isolation for parallel tasks |

---

## Workflow Skills

### /plan

Plan a feature adaptively.

```bash
/plan add user authentication
```

**Output:** Task list with complexity assessment.

---

### /tdd

Test-Driven Development workflow.

```bash
/tdd implement calculateDiscount
```

**Process:**
1. RED — Write failing test
2. GREEN — Make it pass
3. REFACTOR — Improve code

No code without failing test first.

---

### /debug

4-phase systematic debugging.

```bash
/debug the login shows 500 error
```

**Phases:** Gather → Analyze → Test → Fix

---

### /checkpoint

Git checkpoint management.

```bash
/checkpoint create before-refactor
/checkpoint list
/checkpoint restore before-refactor
```

Never lose work.

---

### /estimate

Estimate token cost before starting.

```bash
/estimate add payment integration
```

Know the cost upfront.

---

### /finish

Finalize branch with metrics.

```bash
/finish feature/auth
```

**Output:** Token usage, files changed, tests status.

---

### /learn

Learning mode — explains while building.

```bash
/learn create a products module
```

Great for onboarding.

---

### /verify

Verification before claiming work is complete.

```bash
/verify
```

Forces proof-based verification — requires command output, not just "it works." Use after completing any task to ensure correctness with evidence.

**Output:** Verification report with proof artifacts (test results, build output, runtime checks).

---

### /write-skill

Create or improve skills using TDD methodology.

```bash
/write-skill my-new-skill
```

**Process:**

1. RED — Define what the skill should do (failing spec)
2. GREEN — Write the skill to meet the spec
3. REFACTOR — Improve clarity and structure

RED-GREEN-REFACTOR applied to documentation and skill design.

---

## Project Skills

### /health

Project health score (0-100).

```bash
/health
/health quick
/health detailed
```

**Checks:** Architecture, tests, types, security, performance.

---

### /remember

Save a decision to session memory.

```bash
/remember use Zustand for state management
```

Persists across sessions.

---

### /recall

Query session memory.

```bash
/recall state management
/recall all
```

---

### /tutorial

Interactive tutorial.

```bash
/tutorial beginner
/tutorial intermediate
/tutorial advanced
```

---

### /onboard

Codebase onboarding for new developers.

```bash
/onboard
```

Maps architecture, detects conventions, and analyzes key modules. Generates a developer guide with getting-started instructions.

**Output:** Developer onboarding guide with architecture map, conventions, and setup instructions.

---

### /worktree

Git worktree isolation for parallel tasks.

```bash
/worktree auth-refactor
```

Creates isolated workspaces so you can work on multiple features simultaneously. No branch switching, no stashing, no conflicts.

**Commands:**

- `/worktree [name]` — Create isolated workspace
- `git worktree list` — List active worktrees
- `git worktree remove [path]` — Remove worktree

**Output:** Worktree created with dependencies installed and baseline tests passing.

---

## Migration Skills

### /migrate-framework

Migrate between frameworks.

```bash
/migrate-framework react to vue src/components/Button.tsx
```

**Supports:**
- React → Vue
- React → Svelte
- Vue → React
- Vue → Svelte
- Vue 2 → Vue 3

---

## Development Skills

### /dev-create-module

Full module scaffold.

```bash
/dev-create-module orders
```

Creates: types, service, adapter, components, tests.

---

### /dev-create-component

Create a component.

```bash
/dev-create-component OrderCard
```

---

### /dev-create-service

Create service layer.

```bash
/dev-create-service orders
```

Creates: types, contracts, adapter, service.

---

### /dev-create-hook

Create a hook (React/Next.js).

```bash
/dev-create-hook useOrders
```

---

### /dev-create-composable

Create a composable (Vue).

```bash
/dev-create-composable useOrdersList
```

---

### /dev-create-test

Create tests for a file.

```bash
/dev-create-test src/modules/orders/adapters/order-adapter.ts
```

---

### /dev-generate-types

Generate types from endpoint or JSON.

```bash
/dev-generate-types /v2/orders
```

---

## Review Skills

### /review-review

Code review with verdict.

```bash
/review-review src/modules/orders/
```

**Checks:** Spec compliance, code quality, architecture.

---

### /review-check-architecture

Architecture conformance checks.

```bash
/review-check-architecture orders
```

14 automated checks.

---

### /review-fix-violations

Auto-fix violations.

```bash
/review-fix-violations orders
```

---

### /audit

Multi-domain code audit in one pass.

```bash
/audit src/modules/auth
```

**Covers:** Security (OWASP), performance, architecture, dependencies. Outputs severity-rated findings with remediation steps.

**Output:** Audit report with categorized findings, severity levels, and actionable remediation.

---

## Documentation Skills

### /docs-onboard

Quick module summary.

```bash
/docs-onboard orders
```

Understand any module in 2 minutes.
