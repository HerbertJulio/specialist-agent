# Specialist Agent for Codex

AI agents for any framework — Vue 3, React, Next.js, SvelteKit, Angular, Astro, Nuxt.

## Quick Install

### Option 1: CLI (Recommended)

```bash
cd /path/to/your-project
npx specialist-agent init
```

The wizard will:
1. Auto-detect your framework from `package.json`
2. Let you choose Full or Lite mode
3. Install agents and skills to `.claude/`

### Option 2: Manual Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HerbertJulio/specialist-agent.git
   ```

2. **Copy your framework pack:**
   ```bash
   # For React projects
   cp -r specialist-agent/packs/react/* your-project/.claude/

   # For Vue projects
   cp -r specialist-agent/packs/vue/* your-project/.claude/

   # For Next.js projects
   cp -r specialist-agent/packs/nextjs/* your-project/.claude/

   # For SvelteKit projects
   cp -r specialist-agent/packs/svelte/* your-project/.claude/

   # For Angular projects
   cp -r specialist-agent/packs/angular/* your-project/.claude/

   # For Astro projects
   cp -r specialist-agent/packs/astro/* your-project/.claude/

   # For Nuxt projects
   cp -r specialist-agent/packs/nuxt/* your-project/.claude/
   ```

3. **Copy CLAUDE.md to your project root:**
   ```bash
   cp specialist-agent/packs/{your-framework}/CLAUDE.md your-project/CLAUDE.md
   ```

4. **Copy framework-agnostic agents (optional):**
   ```bash
   cp -r specialist-agent/agents/* your-project/.claude/agents/
   ```

## Usage in Codex

Once installed, use agents by mentioning them:

```
@builder create an orders module with CRUD for /v2/orders
@reviewer review the authentication module
@tdd implement the payment service with tests first
@planner plan the user dashboard feature
```

## Available Agents

### Framework-Agnostic
- `@starter` - Create new projects from scratch
- `@explorer` - Explore unfamiliar codebases
- `@planner` - Adaptive task planning
- `@executor` - Cost-aware task execution
- `@tdd` - Test-Driven Development enforcer
- `@debugger` - Systematic 4-phase debugging
- `@finance` - Payment and billing systems
- `@cloud` - Cloud architecture and IaC
- `@security` - Authentication and security
- `@designer` - UI/UX and design systems
- `@data` - Database and caching
- `@devops` - Docker, K8s, CI/CD
- `@tester` - Test strategies and coverage

### Pack-Specific
- `@builder` - Create modules, components, services
- `@reviewer` - Unified 3-in-1 code review
- `@doctor` - Bug investigation
- `@migrator` - Legacy code migration

## Skills

Quick shortcuts for common tasks:

```
/plan [feature]           - Create adaptive implementation plan
/tdd [module]             - TDD workflow: RED → GREEN → REFACTOR
/debug [error]            - Systematic debugging
/checkpoint [name]        - Create git checkpoint
/estimate [feature]       - Estimate token cost
/dev-create-module [name] - Scaffold complete module
```

## Mode Selection

| Mode | Model | Cost | Best For |
|------|-------|------|----------|
| Full | Sonnet/Opus | Higher | Complex features, architecture |
| Lite | Haiku | Lower | Simple tasks, quick fixes |

## Support

- Documentation: <https://specialistagent.com.br/>
- Issues: https://github.com/HerbertJulio/specialist-agent/issues
- Discussions: https://github.com/HerbertJulio/specialist-agent/discussions

## License

MIT - Use freely.
