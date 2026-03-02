---
name: brainstorm
description: "Use when starting a complex feature, exploring unclear requirements, or needing to challenge assumptions before committing to a design - before /plan."
user-invocable: true
argument-hint: "[idea or feature description]"
allowed-tools: Read, Glob, Grep
---

# /brainstorm - Socratic Brainstorming

Refine ideas through questioning before committing to a plan. Better questions lead to better designs.

**Target:** $ARGUMENTS

## When to Use

- Complex features with multiple valid approaches
- Unclear or ambiguous requirements
- Greenfield design (no existing patterns to follow)
- When stakeholders disagree on direction
- Before `/plan` for COMPLEX tasks
- NOT for: bug fixes, trivial changes, tasks with clear specs

## Workflow

### Step 1: Discovery - Understand the Problem Space

Ask open-ended questions to map what's being built:

1. **Read relevant code** - Ground the discussion in reality
2. **Ask foundational questions:**
   - "What problem does this solve for the user?"
   - "Who are the primary users? Secondary users?"
   - "What does success look like? How will we measure it?"
   - "What's explicitly out of scope?"
   - "Are there existing patterns in the codebase we should follow?"
3. **Map the domain** - Identify entities, relationships, boundaries

**Output:**
```markdown
## Discovery

Problem: [clear problem statement]
Users: [who benefits]
Success criteria: [measurable outcomes]
Scope boundaries: [what's in, what's out]
Existing patterns: [relevant code already in the project]
```

**BLOCKED** until problem space is understood.

### Step 2: Clarification - Challenge Vague Terms

Force precision on ambiguous language:

1. **Identify vague terms** - "fast", "scalable", "simple", "flexible"
2. **Ask for specifics:**
   - "When you say 'fast', what response time is acceptable?"
   - "When you say 'scalable', how many concurrent users?"
   - "What do you mean by 'simple'? Simple to use or simple to implement?"
3. **Resolve contradictions** - "You want it fast AND fully validated?"
4. **Document decisions** - Each clarification becomes a constraint

**Output:**
```markdown
## Clarifications

| Term | Clarified As |
|------|-------------|
| "fast" | < 200ms p95 response time |
| "scalable" | 10k concurrent users |
| "simple" | Minimal UI, max 3 clicks |
```

**BLOCKED** until all vague terms are defined.

### Step 3: Assumption Testing - Surface Hidden Premises

List and challenge implicit assumptions:

1. **Extract assumptions from requirements:**
   - "We're assuming users have accounts"
   - "We're assuming the API is stable"
   - "We're assuming this runs in the browser"
2. **Test each assumption:**
   - "What if this assumption is wrong?"
   - "Is there evidence supporting this?"
   - "What's the fallback if this changes?"
3. **Classify assumptions:**
   - **Validated** - Evidence exists
   - **Risky** - No evidence, high impact if wrong
   - **Safe** - Low impact even if wrong

**Output:**
```markdown
## Assumptions Tested

| # | Assumption | Status | Impact if Wrong |
|---|-----------|--------|-----------------|
| 1 | Users have accounts | Validated | HIGH |
| 2 | API response < 100ms | Risky | MEDIUM |
| 3 | Single timezone | Safe | LOW |

Risky assumptions to address: [list]
```

**BLOCKED** until at least 5 assumptions are identified and tested.

### Step 4: Alternative Generation - Explore Options

Generate multiple approaches:

1. **Produce at least 3 alternatives:**
   - **Approach A** - The obvious solution
   - **Approach B** - The simpler alternative
   - **Approach C** - The scalable/future-proof option
2. **For each approach, document:**
   - Description (2-3 sentences)
   - Pros (concrete benefits)
   - Cons (concrete drawbacks)
   - Risk level (LOW/MEDIUM/HIGH)
   - Estimated effort
3. **Compare in table format**

**Output:**
```markdown
## Alternatives

| Aspect | Approach A | Approach B | Approach C |
|--------|-----------|-----------|-----------|
| Description | [desc] | [desc] | [desc] |
| Pros | [list] | [list] | [list] |
| Cons | [list] | [list] | [list] |
| Risk | MEDIUM | LOW | HIGH |
| Effort | ~2 days | ~1 day | ~4 days |

Recommendation: Approach [X] because [rationale]
```

**BLOCKED** until 3+ alternatives with pros/cons exist.

### Step 5: Convergence - Synthesize and Validate

Present the design for approval in digestible sections:

1. **Synthesize chosen approach** into a design summary
2. **Present in sections** - Each section gets user approval:
   - Section 1: Problem & scope (approve?)
   - Section 2: Technical approach (approve?)
   - Section 3: Data model / API design (approve?)
   - Section 4: Key decisions & trade-offs (approve?)
3. **Document final design** - Ready for `/plan` handoff

**Output:**
```markdown
## Design Summary

### Section 1: Problem & Scope ✓
[approved summary]

### Section 2: Technical Approach ✓
[approved summary]

### Section 3: Data Model ✓
[approved summary]

### Section 4: Key Decisions ✓
[approved summary]
```

## Integration with @planner

```
IF @planner classifies task as COMPLEX:
  → Suggest /brainstorm before generating plan
  → Use brainstorm output as input for design doc

IF user says "skip brainstorming" or "just plan":
  → Skip directly to /plan

IF /brainstorm output exists:
  → @planner uses it as foundation (don't re-ask questions)
```

## Verification Protocol

**Before claiming brainstorm is complete:**

1. At least 3 alternatives were generated with pros/cons
2. At least 5 assumptions were identified and tested
3. All vague terms were clarified with measurable definitions
4. User explicitly approved the design direction (section by section)
5. Output is structured for direct handoff to `/plan`

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I already know the best approach" | You know ONE approach. Brainstorming reveals BETTER ones you haven't considered. |
| "The requirements are clear" | Clear to YOU is not clear to stakeholders. Test your assumptions. |
| "This is wasting time" | 10 minutes of questioning saves hours of wrong-direction implementation. |
| "Too many options will paralyze" | 3 options with clear pros/cons ENABLE informed decisions. Analysis paralysis comes from unclear options, not from having them. |
| "The user already decided" | Clarify what they DECIDED vs what they ASSUMED. Often they assumed more than they decided. |
| "Questions will frustrate the user" | Users prefer upfront questions over rework later. Frustration comes from building the wrong thing. |

## Rules

1. **Never skip assumption testing** - Hidden assumptions cause the biggest failures
2. **Always generate 3+ alternatives** - One option is not a choice
3. **Never proceed without user approval** - Design is collaborative
4. **Keep questions focused** - No irrelevant tangents or philosophical debates
5. **Ground in codebase** - Read actual files, don't hypothesize about code that exists
6. **Output must be actionable** - Ready for `/plan` handoff, not abstract musings
7. **Present in sections** - Digestible chunks, not a wall of text

## Output

```
──── /brainstorm ────
Topic: $ARGUMENTS

Phase 1: Discovery
  Questions asked: [N]
  Problem defined: ✓

Phase 2: Clarification
  Vague terms resolved: [N]

Phase 3: Assumptions
  Identified: [N]
  Validated: [N]
  Risky: [N]

Phase 4: Alternatives
  Generated: [N]
  Recommended: Approach [X]

Phase 5: Design
  Sections approved: [N/N]

──── Brainstorm Summary ────
Design direction: [1-sentence summary]
Key decisions: [N]
Ready for: /plan $ARGUMENTS
```
