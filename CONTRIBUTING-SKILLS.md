# Contributing Skills to Specialist Agent

Community skills extend the platform with new capabilities.

## Skill Structure

Every skill lives in `skills/{name}/SKILL.md`:

```yaml
---
name: my-skill
description: "Use when [specific trigger condition]"
user-invocable: true
argument-hint: "[arguments]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /my-skill - Title

## When to Use
## Workflow
## Verification Protocol
## Anti-Rationalization
## Rules
## Output
```

See `templates/skill-template/SKILL.md` for a full starter template.

## CSO Requirements (Claude Search Optimization)

- Description **MUST** start with `"Use when..."`
- Description must **NOT** summarize the workflow
- Under 500 characters
- Name: lowercase, numbers, hyphens only

## Quality Checklist

- [ ] YAML frontmatter with `name` and `description`
- [ ] Description starts with "Use when..."
- [ ] `## Workflow` with numbered steps
- [ ] `## Verification Protocol` section
- [ ] `## Anti-Rationalization` table (5+ entries)
- [ ] `## Rules` section (numbered list)
- [ ] `## Output` section with example format
- [ ] Content is substantial (200+ characters)

## Testing Your Skill

```bash
# Validate structure
node tests/validate-agents.mjs

# Run behavioral tests
node tests/test-skills.mjs your-skill-name

# Run with verbose output
node tests/test-skills.mjs your-skill-name --verbose
```

## Adding Behavioral Tests

Edit `tests/test-skills.mjs` and add a case in the `testBehavior()` function:

```javascript
case 'your-skill':
  assert(containsPhrase(content, 'key-concept'),
    'Checks key concept');
  break;
```

## Submission Process

1. Fork the repository
2. Create your skill in `skills/{name}/SKILL.md`
3. Add behavioral tests in `tests/test-skills.mjs`
4. Run all validations (must pass with 0 errors)
5. Submit a PR with description of what the skill does

## Community Skill Discovery

Community skills installed to `~/.claude/community-skills/` are automatically discovered by the runtime. They follow the same resolution order:

1. **Project** skills (`.claude/skills/`) - highest priority
2. **Pack** skills (framework-specific)
3. **Community** skills (`~/.claude/community-skills/`)
4. **Global** skills (`~/.claude/skills/`) - lowest priority

Project skills can shadow community skills with the same name.

## Examples of Well-Written Skills

- `/tdd` - Strict RED-GREEN-REFACTOR with proof
- `/debug` - 4-phase systematic debugging
- `/verify` - Evidence-based verification
- `/audit` - Multi-domain code audit

Read these for patterns to follow.
