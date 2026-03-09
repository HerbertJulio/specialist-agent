# Installation

## Claude Code (Primary)

```sh
npx specialist-agent init
```

Interactive CLI that:
- Detects your framework or lets you start with an empty project
- Installs 35 agents (Full or Lite mode)
- Configures 24 skills
- Sets up native hooks (security guard, auto-dispatch, auto-format)

## Cursor

Copy the `.cursor-plugin/` directory to your project, or install via Cursor's plugin marketplace.

## VS Code

Install via the VS Code extension marketplace or copy `.vscode/extension.json`.

## Windsurf

Copy the `.windsurf/plugin.json` to your project root.

## Codex

See [Codex installation guide](/guide/install-codex).

## OpenCode

See [OpenCode installation guide](/guide/install-opencode).

## Global vs Project Install

| Scope | Location | Use case |
|-------|----------|----------|
| Project | `.claude/agents/` | Framework-specific agents per project |
| Global | `~/.claude/agents/` | Shared agents across all projects |

## Framework Packs

Each pack includes optimized versions of @builder, @reviewer, @doctor, @migrator:

| Pack | Framework |
|------|-----------|
| `vue` | Vue 3 + Composition API |
| `react` | React 18+ with hooks |
| `nextjs` | Next.js App Router / Pages |
| `svelte` | SvelteKit |
| `angular` | Angular 17+ |
| `astro` | Astro |
| `nuxt` | Nuxt 3 |

Empty projects get all agents with React defaults. Re-run `npx specialist-agent init` when you choose a framework.

## Updating

```sh
npx specialist-agent init --force
```
