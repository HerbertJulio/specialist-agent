# FAQ

Common questions about Specialist Agent.

::: tip Can't find your answer?
Open an issue on [GitHub](https://github.com/HerbertJulio/specialist-agent/issues) - we're happy to help.
:::

## General

### Can I use it without a framework pack?

Yes. The 9 framework-agnostic agents (`@starter`, `@explorer`, `@finance`, `@cloud`, `@security`, `@designer`, `@data`, `@devops`, `@tester`) work independently of any pack. They don't require `ARCHITECTURE.md` or pack-specific files.

The pack-specific agents (`@builder`, `@reviewer`, `@doctor`, `@migrator`) require a framework pack because they rely on `ARCHITECTURE.md` for code generation patterns.

### Does it work with existing projects?

Yes. Run `npx specialist-agent init` in your project root and choose your framework pack. The installer only adds markdown files - it doesn't modify your source code, dependencies, or configuration.

Use `@explorer` to assess an existing codebase before making changes:

```bash
"Use @explorer to assess this project's architecture and health"
```

### How does it work with monorepos?

Each workspace can have its own `ARCHITECTURE.md` and `CLAUDE.md`. When you open Claude Code in a specific workspace directory, agents read that workspace's configuration.

For shared patterns across workspaces, keep a root-level `ARCHITECTURE.md` with common rules, and workspace-level files for overrides.

### Does it work offline?

No. Specialist Agent requires an active connection to the Claude API. The agents and skills are markdown instructions that Claude Code reads and executes - the intelligence comes from the Claude model, not from local code.

### How do I update Specialist Agent?

Run the installer again:

```bash
npx specialist-agent init
```

It overwrites the agent and skill files with the latest versions. Your `ARCHITECTURE.md` customizations are preserved since they live in a separate file.

## Agents

### What's the difference between Full and Lite agents?

| Aspect | Full Agents | Lite Agents |
|--------|-------------|-------------|
| Model | Sonnet/Opus | Haiku |
| Cost | Higher per token | ~50% cheaper |
| Quality | Better for complex tasks | Good for simple tasks |
| Speed | Slower | Faster |
| Best for | New modules, PR reviews, migrations | Prototyping, simple scaffolds, iteration |

Use Lite agents when speed matters more than polish. Use Full agents when accuracy is critical (PR reviews, migrations, bug investigations).

### Can I create my own agents?

Yes. See [Creating Agents](/customization/creating-agents) for a step-by-step guide. Custom agents follow the same 5-part blueprint:

1. **Mission** - What the agent does
2. **Workflow** - Step-by-step process
3. **Output** - Structured result format
4. **Rules** - Hard constraints
5. **Handoff Protocol** - When to suggest other agents

### How do agents know my project's conventions?

All agents read `docs/ARCHITECTURE.md` before acting. This file defines your naming conventions, directory structure, layer rules, and code patterns. When you edit it, every agent's behavior changes immediately.

### Can I use agents from different packs?

Each project should use one framework pack. The pack-specific agents (`@builder`, `@reviewer`, `@doctor`, `@migrator`) are tailored to a specific framework's patterns. Using React agents in a Vue project would generate incorrect code.

The framework-agnostic agents work with any pack.

## Costs

### How much does it cost to use?

Costs depend on the Claude model and number of tokens consumed. See [Token Usage](/reference/tokens) for detailed estimates per operation, including real-world scenarios.

**Quick reference:**
- Single component scaffold: ~3-5k tokens
- Full module with tests: ~40-60k tokens
- Module migration: ~50-120k tokens

### How can I reduce costs?

1. Use **Lite agents** for rapid iteration
2. Use **skills** instead of agents for focused tasks (cheaper)
3. Migrate **incrementally** (one component at a time)
4. Run automated checks before full reviews

See [Tips to Reduce Token Usage](/reference/tokens#tips-to-reduce-token-usage) for more strategies.

## Strategy & Workflow

### When should I use a command vs agent vs skill?

| Concept | When to Use | Example |
|---------|-------------|---------|
| **Agent** | Complex tasks requiring expertise, multi-step workflows, domain knowledge | `@builder`, `@reviewer`, `@security` |
| **Skill** | Focused, repeatable operations with a specific output format | `/plan`, `/tdd`, `/audit`, `/discovery` |
| **Vanilla prompt** | Simple, single-file tasks that don't need specialized knowledge | "Fix the typo on line 42" |

**Rule of thumb:** If the task touches multiple files or needs verification steps, use an agent. If it's a repeatable process with a defined output, use a skill. If it's trivial, just ask directly.

### Should I use plan mode or `@planner`?

Both work, but they serve different purposes:

- **Plan mode** (built-in): Quick, lightweight planning inside your current conversation. Good for small features.
- **`@planner`**: Structured, phase-gated planning with acceptance criteria, cost estimates, and agent recommendations. Good for features that will involve multiple agents.

For anything that will use `@orchestrator` or `@executor`, start with `@planner` — its output format is designed to feed directly into those agents.

### What should I put in CLAUDE.md?

Keep `CLAUDE.md` under 200 lines. Include:

- Project-specific conventions (naming, directory structure)
- Key architectural decisions ("we use React Query, not SWR")
- Auto-dispatch rules (which agent for which intent)
- Hard constraints ("never use any in TypeScript")

Don't include generic best practices, framework documentation, or rules that are already enforced by your linter/compiler. For detailed rules, use `.claude/rules/` files instead — they load on-demand.

### Why does Claude sometimes ignore CLAUDE.md instructions?

Common causes:

1. **Context overflow** — The file is too long and gets truncated or deprioritized. Keep it under 200 lines.
2. **Conflicting instructions** — Two rules contradict each other. Be explicit about priority.
3. **Vague language** — "Try to use..." is weaker than "MUST always use...". Use strong directives for hard rules.
4. **Context pollution** — Long conversations dilute the impact of instructions. Use `/compact` at 50% context or start fresh sessions.

### How often should I update my agents and CLAUDE.md?

Update when something changes in your project's conventions or when you notice agents repeatedly making the same mistakes. Don't update for every model improvement — Specialist Agent's agents are designed to work across model versions.

### Can I convert an existing codebase into specs, delete it, and regenerate?

This is risky. Instead, use incremental approaches:

1. Use `@scout` to analyze the existing codebase
2. Use `@analyst` to extract requirements from existing code
3. Use `@migrator` to modernize incrementally
4. Use `@refactor` for structural improvements

Regenerating from scratch loses edge cases, bug fixes, and implicit knowledge baked into existing code.

## Troubleshooting

### Agents are not following my ARCHITECTURE.md

1. Verify the file is at `docs/ARCHITECTURE.md` (not the project root)
2. Check for syntax errors in the markdown
3. Run `/review-check-architecture` to validate
4. Ensure your rules are explicit - agents follow what's written literally

### Skills return "command not found"

Skills are not shell commands. They're instructions for Claude Code. Use them inside Claude Code's chat interface:

```bash
# Correct - inside Claude Code
/dev-create-component ProductCard

# Wrong - in a terminal
npx specialist-agent /dev-create-component ProductCard
```

### Generated code doesn't match my stack

Your `ARCHITECTURE.md` may not reflect your actual stack. Common fixes:

1. Update the API client section if you use Axios instead of fetch
2. Update the state management section if you use a different store library
3. Update the directory structure if your project uses a non-standard layout

See [Editing Patterns](/customization/editing-patterns) for examples of common customizations.

## What's Next?

- [Best Practices](/guide/best-practices) - Tips for getting the most out of Specialist Agent
- [Quick Start](/guide/quick-start) - Get up and running
- [Performance & Cost](/guide/benchmark) - Understand token usage
- [All Agents](/reference/agents) - Full reference catalog
