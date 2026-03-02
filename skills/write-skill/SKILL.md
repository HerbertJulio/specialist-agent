---
name: write-skill
description: "Use when creating a new skill, editing an existing skill, or verifying a skill works before deployment."
user-invocable: true
argument-hint: "[skill-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /write-skill - Create or Improve Skills with TDD

Writing skills IS Test-Driven Development applied to process documentation.

**Target:** $ARGUMENTS

## The Iron Law

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

If you didn't verify an agent fails without the skill, you don't know if the skill teaches the right thing.

**Violating the letter of this rule is violating the spirit of this rule.**

## Skill Structure

```
skills/
  my-skill/
    SKILL.md              # Main skill file (required)
    supporting-file.*     # Only if needed (heavy reference, tools)
```

### SKILL.md Template

```markdown
---
name: my-skill
description: "Use when [specific triggering conditions and symptoms]"
user-invocable: true
argument-hint: "[arguments]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /my-skill - Title

[Core principle in 1-2 sentences.]

**Target:** $ARGUMENTS

## When to Use

- [Symptom or situation 1]
- [Symptom or situation 2]
- NOT for: [when not to use]

## Workflow

### Step 1: [Action]
[Instructions]

### Step 2: [Action]
[Instructions]

## Verification Protocol

**Before claiming skill execution is complete:**
[What commands to run as proof]

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "[common excuse]" | [why it's wrong] |

## Rules

1. [Rule 1]
2. [Rule 2]

## Output

[Expected output format]
```

## CSO (Claude Search Optimization)

**Critical for discovery.** Future Claude reads the description to decide if it should load the skill.

### Description Rules

1. **Start with "Use when..."** - Focus on triggering conditions
2. **NEVER summarize the workflow** - Claude will follow the summary and skip the content
3. **Include symptoms** - Error messages, situations, contexts
4. **Third person** - Descriptions are injected into system prompts
5. **Under 500 characters** - Be concise

```yaml
# BAD: Summarizes workflow - Claude may follow this instead of reading skill
description: "Debug issues using 4-phase methodology: gather, analyze, hypothesize, fix"

# GOOD: Just triggering conditions
description: "Use when encountering any bug, test failure, or unexpected behavior - before proposing fixes"
```

### Name Rules

- Use only lowercase letters, numbers, and hyphens
- Use verb-first, active voice: `write-skill` not `skill-writing`
- Be descriptive: `condition-based-waiting` not `async-helpers`

## TDD Cycle for Skills

### RED: Write Failing Test (Baseline)

Before writing the skill, test what happens WITHOUT it:

```markdown
1. Create a scenario that the skill should handle
2. Ask an agent to handle it WITHOUT the skill loaded
3. Document EXACTLY what the agent does wrong:
   - What choices did it make?
   - What rationalizations did it use?
   - Where did it deviate from best practice?
4. This is your "failing test" - the baseline behavior
```

### GREEN: Write Minimal Skill

Write a skill that addresses the specific failures from RED:

```markdown
1. Create skills/[name]/SKILL.md
2. Address ONLY the failures observed in baseline
3. Don't add hypothetical cases
4. Test again WITH the skill loaded
5. Verify the agent now behaves correctly
```

### REFACTOR: Close Loopholes

```markdown
1. Look for NEW rationalizations the agent uses
2. Add explicit counters for each rationalization
3. Build the Anti-Rationalization table
4. Add Red Flags list
5. Re-test until the skill is bulletproof
```

## Validation Checklist

Before deploying the skill:

```markdown
### Structure
- [ ] YAML frontmatter with name and description
- [ ] Description starts with "Use when..."
- [ ] Description does NOT summarize workflow
- [ ] Name uses only lowercase, numbers, hyphens

### Content
- [ ] Clear overview with core principle
- [ ] Workflow with numbered steps
- [ ] Verification Protocol section
- [ ] Anti-Rationalization table
- [ ] Rules section
- [ ] Output format section

### Quality
- [ ] One excellent example (not multi-language)
- [ ] No narrative storytelling
- [ ] Concise (< 500 words for frequently-loaded skills)
- [ ] Keywords for search throughout

### Testing
- [ ] Baseline tested WITHOUT skill (RED)
- [ ] Agent complies WITH skill (GREEN)
- [ ] Rationalizations addressed (REFACTOR)
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Skill is obviously clear" | Clear to you is not clear to other agents. Test it. |
| "It's just a reference" | References can have gaps. Test retrieval. |
| "Testing is overkill" | Untested skills always have issues. 15 min testing saves hours. |
| "I'll test if problems emerge" | Test BEFORE deploying, not after. |
| "Too tedious to test" | Testing is less tedious than debugging a bad skill in production. |
| "No time to test" | Deploying untested skill wastes more time fixing it later. |

## Output

```
──── /write-skill ────
Skill: [name]
Status: [created | updated]

Structure: ✓ Valid
CSO: ✓ Description starts with "Use when..."
Testing: [RED ✓ | GREEN ✓ | REFACTOR ✓]

File: skills/[name]/SKILL.md
```

## Rules

1. **No skill without failing test first** - TDD applies to documentation too
2. **CSO-optimize descriptions** - "Use when..." not "What it does"
3. **Never summarize workflow in description** - Claude will skip the content
4. **Address every rationalization** - Build the table from real test failures
5. **One excellent example** - Beats five mediocre ones
6. **Verify before deploying** - Run the validation checklist
