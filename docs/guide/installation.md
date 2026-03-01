# Installation

## Option 1: Marketplace (Easiest)

**Claude Code:**
```
/plugin install specialist-agent
```

**Cursor:**
```
Cmd+Shift+P → Install Plugin → specialist-agent
```

---

## Option 2: CLI

```bash
cd your-project
npx specialist-agent init
```

Works on any platform.

---

## What Happens

1. Detects your framework (React, Vue, Next.js, SvelteKit, Angular, Astro, Nuxt)
2. Asks Full or Lite mode
3. Installs agents and skills to `.claude/`
4. Optionally installs native Claude Code hooks (security guard, auto-dispatch, session context, auto-format)

```text
your-project/
├── .claude/
│   ├── agents/           # AI agents
│   ├── skills/           # Slash commands
│   └── settings.json     # Native hooks config
├── .specialist-agent/
│   └── hooks/native/     # Hook scripts
├── docs/
│   └── ARCHITECTURE.md   # Your conventions
└── CLAUDE.md             # Project config
```

---

## Verify

```
"Use @scout to analyze this project"
```

---

## Modes

| Mode | Model | Cost |
|------|-------|------|
| Full | Sonnet/Opus | Standard |
| Lite | Haiku | 60-80% less |

---

## CLI Commands

```bash
npx specialist-agent init              # Install
npx specialist-agent list              # List installed
npx specialist-agent create-agent @x   # Create custom agent
npx specialist-agent profiles set x    # Set team profile
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

## Platform Guides

Need manual setup? See platform-specific guides:

- [Cursor](/guide/install-cursor)
- [VS Code](/guide/install-vscode)
- [Windsurf](/guide/install-windsurf)
- [Codex](/guide/install-codex)
- [OpenCode](/guide/install-opencode)

---

## Next

- [Quick Start](/guide/quick-start) — Build your first feature
- [Agents](/reference/agents) — All 27+ agents
