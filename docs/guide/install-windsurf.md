# Windsurf

## Install

```bash
cd your-project
npx specialist-agent init
```

## Configure

Add to `.windsurf/rules.md`:

```
When you see @agent-name, read .claude/agents/agent-name.md and follow it.
When you see /skill-name, execute .claude/skills/skill-name/SKILL.md.
```

## Use

```
@builder create a UserProfile component

@reviewer review src/components/

/plan add authentication
```

## Troubleshooting

**Agents not loading?**
1. Check `.claude/agents/` exists
2. Restart Windsurf
