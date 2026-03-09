# Best Practices

Practical tips for getting the most out of Specialist Agent and Claude Code. These are patterns validated across real projects — not generic advice.

## Planning

### Always Start in Plan Mode

Before writing code, use plan mode or `@planner` to define scope. This prevents wasted tokens on wrong approaches.

```text
"Use @planner to plan the checkout flow with payments and email notifications"
```

For unclear scope, use `/discovery` first — it evaluates feasibility and gives a GO/NO-GO verdict before any code is written.

```text
"/discovery — we need a referral system with rewards, tracking, and analytics"
```

### Let Claude Interview You

Instead of writing a long prompt, ask the agent to interview you. This surfaces requirements you'd miss:

```text
"Use @analyst to interview me about the requirements for user onboarding"
```

The `@analyst` agent uses the `AskUserQuestion` tool to ask targeted questions before producing specs.

### Phase-Gated Plans

Break complex features into phases with verification at each gate:

```text
Phase 1: Data model + API → run tests → checkpoint
Phase 2: UI components → run tests → checkpoint
Phase 3: Integration → run e2e tests → checkpoint
```

Use `@executor` for automatic checkpoint management and cost tracking across phases.

## Context Management

### Compact at 50% — Not 90%

Claude Code's quality degrades as context fills up. Don't wait for warnings.

| Context Usage | Quality | Action |
|---|---|---|
| 0-50% | Optimal | Keep working |
| 50-70% | Declining | Run `/compact` now |
| 70%+ | Degraded | `/compact` or `/clear` and restart |

::: tip Specialist Agent Advantage
`@orchestrator` avoids this problem entirely — each subagent gets fresh context via **Context Isolation Protocol**. A 5-agent orchestration never hits context limits.
:::

### One Agent, One Task

Don't overload a single conversation with unrelated tasks. Instead:

```text
# Bad — context pollution
"Build the auth module, then review the payments module, then debug the cart"

# Good — focused agents
"Use @builder to create the auth module"        # conversation 1
"Use @reviewer to review the payments module"    # conversation 2
"Use @doctor to investigate the cart bug"        # conversation 3
```

For multi-part work in a single session, use `@orchestrator` — it spawns isolated subagents automatically.

### Use /rename and /resume for Long Projects

Name important sessions so you can return to them:

```text
/rename "auth-module-v2"
# ... days later ...
/resume "auth-module-v2"
```

## Agent Selection

### When to Use Which Agent

| Situation | Best Choice | Why |
|---|---|---|
| Scope is unclear | `/discovery` | Evaluates feasibility before committing tokens |
| Need a plan | `@planner` | Structured phases with acceptance criteria |
| Simple build task | `@builder` | Direct execution, no overhead |
| 3+ parallel tasks | `@orchestrator` | Spawns subagents, prevents conflicts |
| Complex execution | `@executor` | Checkpoints, cost tracking, quality gates |
| Code looks wrong | `@reviewer` | 3-in-1 review with automated checks |
| Something is broken | `@doctor` | 4-phase diagnosis with evidence |
| Quick prototype | `@builder` (Lite) | Faster, cheaper, good enough for iteration |

### Full vs Lite — Decision Matrix

| Task | Use Full | Use Lite |
|---|---|---|
| PR review | Yes | No |
| Migration | Yes | No |
| Bug investigation | Yes | No |
| Component scaffold | No | Yes |
| Quick copy change | No | Yes |
| Prototype | No | Yes |
| Marketing copy | No | Yes |

### Vanilla Claude Code vs Agents

For simple, single-file tasks, vanilla Claude Code (no agent) is often faster:

```text
# No agent needed — just ask directly
"Add a loading spinner to the LoginButton component"
"Fix the typo in the error message on line 42"
"Add TypeScript types to this function"
```

Use agents when the task involves **multiple files**, **verification steps**, or **domain expertise** (security, performance, payments).

## Debugging

### Share Screenshots

When stuck on visual bugs, take a screenshot and share it with Claude. Visual context resolves issues faster than describing them:

```text
"Here's a screenshot of the layout bug — the sidebar overlaps the main content on mobile"
```

### Use MCP for Browser Debugging

Connect browser tools via MCP so agents can see console logs and network errors directly:

| MCP | What It Gives Agents |
|---|---|
| **Playwright** | Automated browser testing, screenshots |
| **Chrome DevTools** | Console logs, network tab, DOM inspection |

See [MCP Integrations](/guide/mcp-integrations#complementary-tools) for setup.

### Run Background Tasks for Live Debugging

Ask Claude to run your dev server as a background task, then debug against it:

```text
"Run the dev server in background, then test the login flow and check for errors"
```

## Cost Optimization

### Smart Model Selection

`@executor` automatically selects the cheapest appropriate model:

| Task Type | Model | Why |
|---|---|---|
| Boilerplate, CRUD, templates | Haiku | Fast, cheap, reliable for simple patterns |
| Business logic, components | Sonnet | Good balance of quality and cost |
| Architecture, complex debugging | Opus | Maximum reasoning for hard problems |

### Estimate Before Executing

Use `/estimate` before expensive operations:

```text
"/estimate — migrate 15 Vue 2 components to Vue 3 Composition API"
```

This gives you token and cost projections before committing.

### Checkpoint Often

Checkpoints are cheap insurance. If an agent goes off track, `Esc Esc` or `/rewind` takes you back instantly instead of re-doing work.

`@executor` creates checkpoints automatically after every task. For manual work, commit often — at least once per hour of work.

## Multi-Agent Workflows

### Always Plan Before Orchestrating

Never jump to `@orchestrator` without a plan:

```text
# Bad — orchestrator without direction
"Use @orchestrator to build the dashboard"

# Good — plan first, then execute
"Use @planner to plan the dashboard feature"
# ... review the plan ...
"Use @orchestrator to execute this plan"
```

### Use Handoff Templates

When agents pass work to each other, structured handoffs prevent context loss:

```text
@builder completes → Standard Handoff → @reviewer receives
@reviewer finds bugs → QA FAIL Handoff → @builder receives with specific issues
@reviewer approves → QA PASS Handoff → ready for merge
```

`@orchestrator` and `@executor` use these templates automatically. See [Multi-Agent Workflows](/scenarios/workflows) for detailed examples.

### Verify at Boundaries

Every agent transition is a potential failure point. Always verify after:

1. `@builder` finishes → run tests before sending to `@reviewer`
2. `@reviewer` approves → run full build before merging
3. `@migrator` completes → run original test suite to verify no regressions

Use `/verify` to enforce evidence-based verification.

## Configuration

### Keep CLAUDE.md Under 200 Lines

A bloated `CLAUDE.md` wastes context on every interaction. Keep it focused:

- **Do include:** Project-specific conventions, directory structure, key decisions
- **Don't include:** Generic best practices, framework documentation, obvious rules

For detailed rules, use `.claude/rules/` files — they load on-demand instead of always.

### Use .claude/rules/ for Detailed Instructions

Split large instruction sets into topic-specific rule files:

```text
.claude/rules/
  testing.md        # Testing conventions
  api-patterns.md   # API design rules
  naming.md         # Naming conventions
```

These load based on context relevance, saving tokens compared to putting everything in `CLAUDE.md`.

### Use /permissions Instead of --dangerously-skip-permissions

Set granular permissions with wildcard syntax instead of disabling safety:

```text
/permissions
# Allow read/write in src/
# Allow running npm test, npm run build
# Block rm -rf, git push --force
```

## Daily Workflow

### Start Sessions Right

1. Check git status — clean working tree before starting
2. Pull latest changes — `git pull` to avoid conflicts
3. Start with plan mode for new features
4. Use `/onboard` when returning to unfamiliar code

### End Sessions Right

1. Commit work in progress — don't lose changes
2. Run tests — verify nothing is broken
3. `/rename` the session if you'll continue later
4. Note any open items for the next session

## What's Next?

- [Multi-Agent Workflows](/scenarios/workflows) — Real-world orchestration examples with cost estimates
- [Agent Composition](/guide/agent-composition) — How agents work together
- [Performance & Cost](/guide/benchmark) — Token usage optimization
- [FAQ](/guide/faq) — Common questions answered
