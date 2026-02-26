# VS Code

## Install

```bash
cd your-project
npx specialist-agent init
```

## Configure

For **GitHub Copilot**, add to `.github/copilot-instructions.md`:

```
When asked to use @agent-name, read .claude/agents/agent-name.md and follow it.
When asked to run /skill-name, execute .claude/skills/skill-name/SKILL.md.
```

For **Continue**, add custom commands in `.continue/config.json`.

## Use

```
Use @builder to create a products module

Read .claude/agents/reviewer.md and review src/components/
```

## Troubleshooting

**AI not following instructions?**

Be explicit:
```
Read .claude/agents/builder.md completely, then follow its workflow.
```
