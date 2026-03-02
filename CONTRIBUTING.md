# Contributing to Specialist Agent

Thanks for your interest in contributing! Specialist Agent is open to contributions of all kinds - new agents, skills, framework packs, documentation improvements, and bug fixes.

## Getting Started

```bash
git clone https://github.com/HerbertJulio/specialist-agent.git
cd specialist-agent
npm install
```

### Running the docs locally

```bash
npm run docs:dev
```

### Testing the CLI locally

```bash
cd /path/to/your-test-project
node /path/to/specialist-agent/cli/index.mjs
```

## How to Contribute

### Reporting Bugs

Open an [issue](https://github.com/HerbertJulio/specialist-agent/issues/new?template=bug_report.yml) with:
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, Claude Code version)

### Suggesting Features

Open an [issue](https://github.com/HerbertJulio/specialist-agent/issues/new?template=feature_request.yml) describing:
- The problem you're solving
- Your proposed solution
- Any alternatives you've considered

### Pull Requests

1. Fork the repo and create your branch from `main`:

```bash
git checkout -b feature/my-feature
```

2. Make your changes following the conventions below.

3. Test locally:
   - Run `npm run docs:build` to verify docs build
   - Test the CLI with `node cli/index.mjs` in a sample project

4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add React pack agents"
git commit -m "fix: correct sidebar link in pt-BR docs"
git commit -m "docs: update installation guide"
```

5. Push and open a PR against `main`.

## Creating Agents

Agents live in two places:
- `agents/` - Framework-agnostic agents (e.g., `@starter`, `@finance`)
- `packs/[framework]/agents/` - Pack-specific agents (e.g., `@builder`, `@reviewer`)

### Agent file structure

```markdown
---
name: my-agent
description: "MUST BE USED when [trigger]. Use PROACTIVELY when [condition]."
tools: Read, Write, Edit, Bash, Glob, Grep
---

# @my-agent - Title

## Mission
One sentence describing what this agent does.

## First Action
**BEFORE ANYTHING ELSE**: Read `docs/ARCHITECTURE.md` to understand the project conventions.

## Scope Detection
Analyze the request and determine the mode:
- **Mode A**: [condition] → Mode A workflow
- **Mode B**: [condition] → Mode B workflow

## Mode A - [Name]
1. Step one
2. Step two
3. Validate

## Mode B - [Name]
1. Step one
2. Step two
3. Validate

## General Rules
- Rule 1
- Rule 2
```

### Lite agents

Lite versions go in `agents/` with `-lite.md` suffix (or `packs/[framework]/agents-lite/`):

```markdown
---
name: my-agent
description: "Same description as full version."
model: haiku
tools: Read, Write, Edit, Bash, Glob, Grep
---
```

Key differences from full agents:
- Add `model: haiku` to frontmatter
- Condense instructions to ~30-50 lines
- Skip validation steps (tsc, build, vitest)
- Keep rules inline instead of reading ARCHITECTURE.md

## Creating Skills

Skills live in `packs/[framework]/skills/[skill-name]/SKILL.md`:

```markdown
---
name: my-skill
description: "What this skill does"
user-invocable: true
argument-hint: "[arguments]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Skill instructions

Target: $ARGUMENTS

## Steps
1. First step
2. Second step
```

### Naming conventions

- Development: `dev-create-[thing]`
- Review: `review-[action]`
- Migration: `migration-migrate-[scope]`
- Documentation: `docs-[action]`

## Adding a Framework Pack

To add a new framework pack (e.g., React, Angular):

1. Create the directory structure:

```text
packs/[framework]/
├── agents/           ← Full agents (Sonnet/Opus)
├── agents-lite/      ← Lite agents (Haiku)
├── skills/           ← Framework-specific skills
├── ARCHITECTURE.md   ← Architecture patterns for this framework
└── CLAUDE.md         ← Framework-specific CLAUDE.md
```

2. Create pack-specific agents: `@builder`, `@reviewer`, `@doctor`, `@migrator`
3. Create skills following existing naming conventions
4. Write `ARCHITECTURE.md` with the framework's patterns and conventions
5. Update `cli/index.mjs` to include the new pack in the framework selection

## Translating Documentation

Docs use VitePress i18n. To add a new language:

1. Create `docs/[locale]/` directory mirroring the English structure
2. Add the locale to `docs/.vitepress/config.ts` under `locales`
3. Translate all markdown files (keep code blocks and technical terms in English)

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint:

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature (agent, skill, pack) |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code change that doesn't fix a bug or add a feature |
| `perf:` | Performance improvement |
| `chore:` | Maintenance (deps, CI, tooling) |

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
