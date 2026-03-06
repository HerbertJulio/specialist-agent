# Specialist Agent for OpenCode

AI agents for any framework — Vue 3, React, Next.js, SvelteKit, Angular, Astro, Nuxt.

## Quick Install

### Option 1: CLI + OpenCode Config

```bash
cd /path/to/your-project
npx specialist-agent init
```

Then copy the OpenCode config to your project root:

```bash
cp node_modules/specialist-agent/.opencode/opencode.json ./opencode.json
```

Or manually add `opencode.json` (see template in this directory).

### Option 2: Native OpenCode Agents

OpenCode reads agents from `.opencode/agents/`. Install directly:

```bash
git clone https://github.com/HerbertJulio/specialist-agent.git /tmp/sa

# Copy agents to OpenCode directory
mkdir -p .opencode/agents
cp /tmp/sa/agents/*.md .opencode/agents/

# Copy framework-specific agents (pick your framework)
cp /tmp/sa/packs/react/agents/*.md .opencode/agents/
# Options: react, vue, nextjs, svelte, angular, astro, nuxt

# Copy opencode.json and CLAUDE.md
cp /tmp/sa/.opencode/opencode.json ./opencode.json
cp /tmp/sa/packs/{your-framework}/CLAUDE.md ./CLAUDE.md

rm -rf /tmp/sa
```

### Option 3: opencode.json Only

If you already have agents in `.claude/agents/` from the CLI, just add the `opencode.json` to your project root. OpenCode will pick up the agent definitions from the config.

## Key Difference: Directory

| Platform | Agent directory | Config |
|----------|----------------|--------|
| Claude Code | `.claude/agents/` | `.claude/settings.json` |
| OpenCode | `.opencode/agents/` | `opencode.json` |

The markdown agent files are compatible across both platforms. Copy them to the directory your platform expects.

## Usage

Reference agents with `@`:

```
@builder create an orders module with CRUD for /v2/orders
@reviewer review the authentication module
@tdd implement the payment service with tests first
@planner plan the checkout flow
@doctor the login page returns 500, investigate
```

## Available Agents

### Core

| Agent | Use For |
|-------|---------|
| `@builder` | Create modules, components, services |
| `@reviewer` | Code review (spec + quality + architecture) |
| `@doctor` | Bug investigation |
| `@planner` | Feature planning |
| `@executor` | Execute plans with checkpoints |
| `@tdd` | Test-driven development |

### Specialist

| Agent | Use For |
|-------|---------|
| `@api` | REST/GraphQL API design |
| `@perf` | Performance optimization |
| `@security` | Auth, OWASP audits |
| `@finance` | Payments, billing |
| `@cloud` | Cloud architecture, IaC |
| `@data` | Database design |
| `@devops` | Docker, K8s, CI/CD |
| `@architect` | System architecture migration |
| `@designer` | Design systems, accessibility |

### Support

| Agent | Use For |
|-------|---------|
| `@scout` | Quick project analysis |
| `@explorer` | Deep codebase exploration |
| `@debugger` | Systematic debugging |
| `@pair` | Pair programming |

## Troubleshooting

**Agents not recognized?**

1. Verify `.opencode/agents/` has `.md` files, OR `opencode.json` has agent definitions
2. Reference agents with `@name` (e.g., `@builder`)

**Using both Claude Code and OpenCode?**

Run `npx specialist-agent init` for `.claude/` agents, then copy them:

```bash
cp .claude/agents/*.md .opencode/agents/
```

## Support

- Documentation: <https://specialistagent.com.br/>
- Issues: https://github.com/HerbertJulio/specialist-agent/issues

## License

MIT
