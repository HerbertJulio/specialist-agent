---
name: plan
description: "Use when starting a new feature, refactor, or multi-step task - before writing any code. Use especially when scope is unclear or multiple files are involved."
user-invocable: true
argument-hint: "[feature description]"
allowed-tools: Read, Glob, Grep
---

# /plan - Adaptive Planning

Create an implementation plan that matches the complexity of the task.

**Target:** $ARGUMENTS

## Workflow

### Step 1: Assess Complexity

Search the codebase to understand scope:

```bash
# Find affected files
# Estimate lines of code
# Identify dependencies
```

Classify as:
- **TRIVIAL** (1-2 files, <50 lines) → Skip planning
- **SIMPLE** (3-5 files, <200 lines) → Mini-plan
- **MEDIUM** (6-15 files, complete module) → Standard plan
- **COMPLEX** (15+ files, multiple modules) → Full design doc

### Step 2: Generate Plan

#### For TRIVIAL:
```
✓ Task is trivial. Delegating to @builder.
```

#### For SIMPLE:
```markdown
## Quick Plan: [Feature]

1. [Step 1] - `file.ts`
2. [Step 2] - `file.ts`
3. [Step 3] - `file.ts`
4. Test: Run `npm test`
5. Verify: Check [criteria]

Estimated: ~X tokens
```

#### For MEDIUM:
```markdown
## Implementation Plan: [Feature]

### Overview
[2-3 sentences]

### Task Breakdown
- [ ] Task 1: [description] - `file.ts` (~N lines)
- [ ] Task 2: [description] - `file.ts` (~N lines)
- [ ] Task 3: [description] - `file.ts` (~N lines)

### Dependencies
- Task 2 depends on Task 1
- Tasks 3-4 can run in parallel

### Checkpoints
- After Task 2: Verify [condition]
- After Task 4: Run all tests

### Estimated Cost
~X tokens total
```

#### For COMPLEX:
```markdown
## Design Document: [Feature]

### Problem Statement
[What problem are we solving?]

### Requirements
- [ ] Requirement 1
- [ ] Requirement 2

### Current State
[How does the system work today?]

### Proposed Solution
[High-level architecture]

### Alternatives Considered
1. [Alternative] - Rejected: [reason]

### Task Breakdown
[Detailed tasks with estimates]

### Risks
- Risk 1: [mitigation]

### Estimated Cost
~X tokens total
```

### Step 3: Confirm

Ask user: "Approve plan and begin execution?"

If approved, delegate to @executor with the plan.

## Output

```
──── /plan ────
Feature: [name]
Complexity: [TRIVIAL | SIMPLE | MEDIUM | COMPLEX]
Files affected: ~N
Estimated tokens: ~N

[Plan content]

Next: Awaiting approval
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "It's simple enough to just start coding" | That's what every developer says before a 3-day rabbit hole. 10 minutes of planning saves hours. |
| "I already know the architecture" | Plans aren't just for you - they create alignment and a checkpoint to rollback to. |
| "Planning is waterfall" | Adaptive planning IS agile. Skipping planning is chaos, not agility. |
| "I'll refactor later if the approach is wrong" | Refactoring costs 10x more than planning. Get it right first. |

## Rules

- Never force heavy planning for simple tasks
- Always estimate token costs
- Ask clarifying questions if needed
- Read existing architecture before planning
