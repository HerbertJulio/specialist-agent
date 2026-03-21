---
name: prd
description: "Use when translating a product idea, feature request, or stakeholder requirement into a structured PRD with user stories, acceptance criteria, and GitHub issues."
user-invocable: true
argument-hint: "[feature or product idea]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /prd - Product Requirements Document

Transform product ideas into structured, implementable PRDs with user stories, acceptance criteria, and issue decomposition - bridging the gap between stakeholder intent and developer action.

**Target:** $ARGUMENTS

## When to Use

- Translating a vague feature request into actionable requirements
- Starting a new feature that needs stakeholder alignment
- Converting user feedback into development tasks
- When `@product` or `@analyst` needs a structured output format
- Before `/plan` for features that need formal requirements
- NOT for: bug fixes (use `/debug`)
- NOT for: technical tasks with clear specs (use `/plan` directly)
- NOT for: exploratory ideation (use `/brainstorm` first)

## Workflow

### Step 1: Problem & Scope Definition

1. **Identify the problem statement** - What pain point does this solve?
2. **Define target users** - Primary and secondary personas
3. **Establish success criteria** - Measurable outcomes (not vague goals)
4. **Set scope boundaries** - Explicit in-scope and out-of-scope items
5. **Scan existing codebase** for related features:

```bash
# Find related modules, components, services
grep -rl "$KEYWORD" src/ --include="*.ts" --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null | head -20
```

**Output:**
```markdown
## 1. Problem & Scope

**Problem:** [Clear problem statement with evidence]
**Users:** [Primary: ..., Secondary: ...]
**Success Criteria:**
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
**In Scope:** [what's included]
**Out of Scope:** [what's explicitly excluded]
**Existing Code:** [related modules found in codebase]
```

**BLOCKED** until problem statement is clear and measurable.

### Step 2: User Stories & Acceptance Criteria

1. **Write user stories** in standard format with Gherkin acceptance criteria
2. **Cover all personas** identified in Step 1
3. **Include edge cases** - What happens when things go wrong?
4. **Prioritize stories** using MoSCoW (Must/Should/Could/Won't)

For each story:
```markdown
### US-[N]: [Story Title]

**As a** [persona],
**I want** [action],
**So that** [benefit].

**Priority:** Must Have | Should Have | Could Have | Won't Have

**Acceptance Criteria:**
```gherkin
GIVEN [precondition]
WHEN [action]
THEN [expected result]

GIVEN [precondition]
WHEN [error condition]
THEN [error handling]
```
```

**BLOCKED** until at least 3 user stories with Gherkin criteria exist.

### Step 3: Requirements Matrix

1. **Functional requirements** - What the system must do
2. **Non-functional requirements** - Performance, security, accessibility, i18n
3. **Technical constraints** - Stack, infrastructure, API compatibility
4. **Dependencies** - External services, other teams, data sources

**Output:**
```markdown
## 3. Requirements Matrix

### Functional
| ID | Requirement | Priority | Story |
|----|------------|----------|-------|
| FR-1 | [requirement] | Must | US-1 |

### Non-Functional
| ID | Requirement | Target | Measurement |
|----|------------|--------|-------------|
| NFR-1 | Response time | < 200ms p95 | Load test |
| NFR-2 | Accessibility | WCAG AA | Axe audit |

### Constraints
- [Technical constraint 1]
- [Infrastructure constraint]

### Dependencies
- [External service/team]
```

### Step 4: Technical Feasibility Scan

1. **Scan codebase** for reusable patterns:

```bash
# Identify existing patterns, services, utilities
find src/ -type f -name "*.ts" -o -name "*.tsx" | head -50
# Check for existing API routes
find src/ -path "*/api/*" -name "*.ts" 2>/dev/null | head -20
# Check for existing types/interfaces
grep -rn "interface\|type " src/types/ 2>/dev/null | head -20
```

2. **Identify integration points** - What existing code touches this feature?
3. **Estimate new infrastructure** - New tables, APIs, services, queues needed
4. **Flag risks** - Breaking changes, migration needs, data concerns

**Output:**
```markdown
## 4. Technical Feasibility

**Reusable:** [existing modules/patterns to leverage]
**New infrastructure:** [tables, APIs, services needed]
**Integration points:** [existing code that needs changes]
**Risks:** [breaking changes, migrations, data concerns]
```

### Step 5: Issue Decomposition

1. **Break PRD into implementable issues** - Each issue is a single PR
2. **Estimate size** - S (< 2h), M (2-4h), L (4-8h), XL (> 8h, split further)
3. **Map dependencies** - Which issues block others?
4. **Suggest agent assignments** - Which specialist agent handles each issue?

**Output:**
```markdown
## 5. Issue Breakdown

| # | Issue Title | Size | Depends On | Agent |
|---|------------|------|------------|-------|
| 1 | Create [model/schema] | S | - | @data |
| 2 | Implement [API endpoint] | M | #1 | @api |
| 3 | Build [UI component] | M | #2 | @builder |
| 4 | Add [tests] | M | #3 | @tester |
| 5 | Add [observability] | S | #2 | @builder |

**Critical Path:** #1 → #2 → #3 → #4
**Parallelizable:** #5 can run alongside #3-#4
```

### Step 6: PRD Document Generation

1. **Compile all sections** into a single document
2. **Write to file:** `docs/PRD-[feature-name].md`
3. **Include metadata:** date, author, version, status (Draft/Review/Approved)

### Step 7 (Optional): GitHub Issue Creation

If the user requests it, create issues:

```bash
# Create issues from the breakdown
gh issue create --title "[Issue Title]" --body "[Description with acceptance criteria]" --label "feature,[size]"
```

## Verification Protocol

**Before claiming the PRD is complete:**

1. Problem statement exists with measurable success criteria
2. At least 3 user stories with Gherkin acceptance criteria
3. Non-functional requirements have measurable targets (not "fast" but "< 200ms")
4. Codebase scan was performed - reusable code identified
5. Issue breakdown exists with size estimates and dependencies
6. Every Must Have story maps to at least one issue
7. PRD file was written to `docs/PRD-[name].md`
8. No vague terms remain - all clarified with specifics

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Requirements are in my head" | Unwritten requirements become misunderstood requirements. Write them down. Memory is not documentation. |
| "We can figure out scope during development" | Scope creep costs 3-10x more than upfront definition. Define it now. |
| "User stories are too formal" | Stories are negotiable contracts, not bureaucracy. They prevent the rework that comes from verbal specs. |
| "The PRD will be outdated immediately" | A living document beats no document. Update as you learn. Outdated > nonexistent. |
| "Just tell the developer what to build" | Developers need acceptance criteria, not verbal instructions that get lost between Slack messages. |
| "NFRs are obvious, we don't need to write them" | "Fast" means 50ms to one person and 2s to another. Write the number. |
| "We'll add acceptance criteria later" | Criteria written after implementation are just documentation, not specifications. Write them first. |

## Rules

1. **Problem before solution** - Never write user stories without a clear problem statement
2. **Measurable criteria only** - Every success metric and NFR must have a number
3. **Gherkin is mandatory** - Every user story gets GIVEN/WHEN/THEN acceptance criteria
4. **Codebase grounded** - Scan existing code before proposing new infrastructure
5. **Issues must be PR-sized** - Any XL issue must be split further
6. **MoSCoW prioritization** - Every story gets a priority, no "everything is Must Have"
7. **Dependencies explicit** - Every issue lists what it blocks and what blocks it
8. **Agent-ready** - Each issue suggests which specialist agent should handle it

## Output

```
──── /prd ────
Feature: $ARGUMENTS

Problem: [1-line problem statement]
Users: [primary persona]
Stories: [N] (Must: X, Should: Y, Could: Z)

Requirements:
  Functional: N
  Non-Functional: N
  Constraints: N

Issues: N (S: X, M: Y, L: Z)
Critical Path: [issue chain]

PRD saved: docs/PRD-[name].md
Issues created: [N] (if requested)

──── Ready for /plan ────
```
