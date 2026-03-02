---
name: tutorial
description: "Use when first using Specialist Agent, onboarding a new team member, or wanting to explore available agents and skills."
user-invocable: true
argument-hint: "[beginner|intermediate|advanced]"
allowed-tools: Read, Glob
---

# /tutorial - Interactive Tutorial

Learn Specialist Agent with hands-on exercises.

**Level:** $ARGUMENTS (default: beginner)

---

## Beginner Tutorial

### Step 1: Your First Agent

Agents are AI specialists. Each one does something specific.

**Try this:**
```
Create a Button component with label and onClick props
```

@builder will create the component following your project's patterns.

**What happened:**
- @builder read your ARCHITECTURE.md
- Created the component in the right folder
- Added TypeScript types
- Followed your naming conventions

---

### Step 2: Review Code

Now review what was created.

**Try this:**
```
Review the Button component
```

@reviewer checks:
1. Does it meet requirements?
2. Is the code clean?
3. Does it follow architecture patterns?

---

### Step 3: Use Skills

Skills are shortcuts. They start with `/`.

**Try this:**
```
/health
```

This shows your project's health score.

**Other useful skills:**
- `/plan` - Plan a feature
- `/checkpoint` - Save your progress
- `/remember` - Save a decision

---

### Step 4: Debug an Issue

When something breaks:

**Try this:**
```
Debug why the login button doesn't work
```

@debugger will:
1. Gather evidence
2. Analyze the code
3. Find the root cause
4. Suggest a fix

---

### Beginner Complete

You learned:
- How to use @builder to create code
- How to use @reviewer to check quality
- How to use skills for quick actions
- How to use @debugger to fix issues

**Next:** Try `/tutorial intermediate`

---

## Intermediate Tutorial

### Step 1: Planning Complex Features

For big features, plan first.

**Try this:**
```
/plan add user authentication with login and registration
```

@planner will:
1. Assess complexity
2. Break into tasks
3. Estimate effort
4. Ask for approval

---

### Step 2: Test-Driven Development

Write tests first with @tdd.

**Try this:**
```
/tdd implement a calculateDiscount function
```

The workflow:
1. **RED** - Write failing test
2. **GREEN** - Make it pass
3. **REFACTOR** - Clean up

No code without failing test first.

---

### Step 3: Checkpoints

Save progress before risky changes.

**Try this:**
```
/checkpoint create before-refactor
```

If something goes wrong:
```
/checkpoint restore before-refactor
```

---

### Step 4: Session Memory

Remember decisions across sessions.

**Save a decision:**
```
/remember use Zustand for state management
```

**Recall later:**
```
/recall state management
```

---

### Step 5: Specialized Agents

Use specialist agents for specific domains.

| Agent | Use Case |
|-------|----------|
| `@api` | Design REST/GraphQL APIs |
| `@security` | Add authentication |
| `@finance` | Payment integration |
| `@perf` | Performance optimization |
| `@data` | Database design |

**Try this:**
```
Use @api to design REST endpoints for products
```

---

### Intermediate Complete

You learned:
- Planning with @planner
- TDD with @tdd
- Checkpoints for safety
- Session memory
- Specialist agents

**Next:** Try `/tutorial advanced`

---

## Advanced Tutorial

### Step 1: Agent Composition

Agents can work together.

**Example workflow:**
```
1. @planner creates the plan
2. @builder implements each task
3. @reviewer validates the code
4. @tester adds tests
```

**Try this:**
```
Plan and implement a products module with tests
```

---

### Step 2: Custom Agents

Create your own agents.

**Command:**
```bash
npx specialist-agent create-agent @my-agent
```

**Agent structure:**
```markdown
---
name: my-agent
description: "What this agent does"
tools: Read, Write, Edit
---

# @my-agent

## Mission
One sentence describing the goal.

## Workflow
1. First step
2. Second step

## Rules
- Rule one
- Rule two
```

---

### Step 3: Team Profiles

Set behavior for different contexts.

**Available profiles:**
- `startup-fast` - Move fast, minimal validation
- `enterprise-strict` - Full validation, strict rules
- `learning-mode` - Explain everything
- `cost-optimized` - Minimize token usage

**Set profile:**
```bash
npx specialist-agent profiles set startup-fast
```

---

### Step 4: Cost Optimization

Reduce token usage:

1. **Use Lite mode** - 60-80% cheaper
2. **Be specific** - Less exploration needed
3. **Use @scout first** - Get recommendations
4. **Batch related tasks** - Less context switching

**Check cost:**
```
/estimate add payment integration
```

---

### Step 5: Multi-Platform

Specialist Agent works on multiple platforms:

| Platform | How |
|----------|-----|
| Claude Code | Native support |
| Cursor | `.cursor-plugin/` |
| VS Code | `.vscode/extension.json` |
| Windsurf | `.windsurf/plugin.json` |

The agents and skills work the same everywhere.

---

### Advanced Complete

You learned:
- Agent composition
- Creating custom agents
- Team profiles
- Cost optimization
- Multi-platform usage

---

## Quick Reference

### Agents

| Agent | What it Does |
|-------|--------------|
| @builder | Build code |
| @reviewer | Review code |
| @debugger | Fix bugs |
| @planner | Plan features |
| @tdd | Test-driven development |
| @api | API design |
| @security | Authentication |
| @finance | Payments |
| @perf | Performance |

### Skills

| Skill | What it Does |
|-------|--------------|
| /plan | Plan a feature |
| /tdd | TDD workflow |
| /debug | Debug an issue |
| /checkpoint | Save/restore progress |
| /health | Project health score |
| /remember | Save decisions |
| /recall | Recall decisions |
| /estimate | Estimate cost |

### Documentation

Full docs at: https://specialistagent.com.br/
