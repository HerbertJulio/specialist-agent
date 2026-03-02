# Cursor

## Install

```bash
cd your-project
npx specialist-agent init
```

## Configure

Add to `.cursor/rules/specialist-agent.mdc` (or `.cursorrules` for older versions):

```
When you see @agent-name, read and follow .claude/agents/agent-name.md
When you see /skill-name, execute .claude/skills/skill-name/SKILL.md
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
2. Restart Cursor

**Wrong framework?**
Create `.claude/config.json`:
```json
{ "framework": "react" }
```
