# Installation

## Prerequisites

- A project with `package.json`
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed

## Install

```bash
# 1. Go to your project
cd /path/to/your-project

# 2. Run the wizard
npx specialist-agent init
```

The wizard asks:
1. **Framework** — Vue 3, React (coming soon)
2. **Mode** — Full (Sonnet/Opus) or Lite (Haiku)
3. **Starter agent** — Install @starter for project creation?

## What Gets Installed

```mermaid
graph TB
    setup["npx specialist-agent init"] --> wizard{"Setup Wizard"}

    wizard -->|"1. Framework"| pack["Vue 3 · React ..."]
    wizard -->|"2. Mode"| mode["Full · Lite"]
    wizard -->|"3. Starter?"| starter["Yes · No"]

    subgraph installed["  What Gets Installed  "]
        direction LR

        subgraph ag[" Agents "]
            direction TB
            a1["@starter"]
            a2["@builder"]
            a3["@reviewer"]
            a4["@migrator"]
            a5["@doctor"]
        end

        subgraph sk[" Skills "]
            direction TB
            s1["6 dev skills"]
            s2["3 review skills"]
            s3["2 migration skills"]
            s4["1 docs skill"]
        end

        subgraph dc[" Docs "]
            direction TB
            d1["ARCHITECTURE.md"]
            d2["CLAUDE.md"]
        end
    end

    pack --> installed
    mode --> installed
    starter --> installed

    style setup fill:#42b883,color:#fff,font-weight:bold
    style wizard fill:#35495e,color:#fff
    style installed fill:#f8f8f8,stroke:#42b883,stroke-width:2px
    style ag fill:#f0faf5,stroke:#42b883
    style sk fill:#f0faf5,stroke:#42b883
    style dc fill:#f0faf5,stroke:#42b883
    style a1 fill:#7c3aed,color:#fff
    style a2 fill:#42b883,color:#fff
    style a3 fill:#42b883,color:#fff
    style a4 fill:#35495e,color:#fff
    style a5 fill:#42b883,color:#fff
```

The installer copies these files into your project:

```text
your-project/
├── .claude/
│   ├── agents/              ← 5 AI subagents
│   │   ├── starter.md
│   │   ├── builder.md
│   │   ├── reviewer.md
│   │   ├── migrator.md
│   │   └── doctor.md
│   └── skills/              ← 12 skills
│       ├── dev-create-module/
│       ├── review-review/
│       ├── migration-migrate-module/
│       └── docs-onboard/
├── docs/
│   └── ARCHITECTURE.md      ← Source of truth for patterns
└── CLAUDE.md                 ← Project config for Claude
```

::: warning Non-destructive
The installer **never overwrites** existing `ARCHITECTURE.md` or `CLAUDE.md` files. If they already exist, they are skipped.
:::

## Lite Mode (Lower Cost)

For budget-conscious usage, install Lite agents that run on the **Haiku model**:

```bash
npx specialist-agent init    # select "Lite" in wizard
```

| Aspect | Full | Lite |
|--------|------|------|
| **Model** | Sonnet/Opus | Haiku |
| **Cost** | ~5-25k tokens | ~2-10k tokens |
| **Validation** | tsc + build + vitest | Skipped |
| **First action** | Reads ARCHITECTURE.md | Rules inline |

Same agent names, same capabilities — just cheaper per invocation.

## Verify Installation

```bash
# Open Claude Code
claude

# Check agents are loaded
/agents

# Try a quick skill
/review-check-architecture
```

You should see your installed agents listed (e.g., `@starter`, `@builder`, `@reviewer`, `@migrator`, `@doctor`, plus specialist agents if installed).

## Optional: Context7 MCP

For up-to-date library documentation when asking Claude about APIs, you can add the [Context7 MCP server](https://github.com/upstash/context7). This benefits you as a developer — agents work fully without it:

```json
// ~/.claude/mcp.json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

## Next Steps

- [Quick Start](/guide/quick-start) — Build something with the agents
- [Architecture Overview](/guide/architecture) — Understand the patterns
- [Customization](/customization/creating-agents) — Adapt the kit to your project
