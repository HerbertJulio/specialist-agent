# Codex

## Install

```bash
cd your-project
npx specialist-agent init
```

## Use

Reference agents in prompts:

```
Using @builder:
Create a UserProfile component with avatar and bio fields.

Using @tdd:
Implement calculateTax following TDD.

Using @planner:
Plan the checkout flow implementation.
```

## Available Agents

| Agent | Use For |
|-------|---------|
| `@builder` | Create modules, components |
| `@reviewer` | Code review |
| `@doctor` | Debug issues |
| `@planner` | Plan features |
| `@tdd` | Test-driven development |
| `@api` | API design |
| `@security` | Authentication |
| `@finance` | Payments |

## Troubleshooting

**Agents not found?**
1. Check `.claude/agents/` exists
2. Reference the full path: `.claude/agents/builder.md`
