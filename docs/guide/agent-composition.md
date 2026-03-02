# Agent Composition

Specialist Agent supports composing agents together, where one agent can invoke another to complete complex workflows.

## Composition Syntax

### INVOKE Directive

Use the `INVOKE` directive to call another agent:

```markdown
## Workflow

1. Analyze requirements
2. **INVOKE** @planner to create implementation plan
3. For each task in plan:
   - **INVOKE** @builder to implement
4. **INVOKE** @reviewer for final review
```

### DELEGATE Directive

Use `DELEGATE` when the other agent should take over completely:

```markdown
## Handoff Protocol

- If task is trivial → **DELEGATE** @builder
- If needs planning → **DELEGATE** @planner
```

### PARALLEL Directive

Use `PARALLEL` to run multiple agents simultaneously:

```markdown
## Parallel Execution

**PARALLEL**:
  - @builder: Create component
  - @tester: Write tests
  - @docs: Generate docs
**END PARALLEL**
```

## Composition Patterns

### 1. Pipeline Pattern

Agents execute in sequence, each passing output to the next:

```
@analyst → @planner → @builder → @reviewer
```

```markdown
## Workflow

1. **INVOKE** @analyst with "$ARGUMENTS"
   Store result as: requirements

2. **INVOKE** @planner with: requirements
   Store result as: plan

3. **INVOKE** @builder with: plan
   Store result as: implementation

4. **INVOKE** @reviewer with: implementation
```

### 2. Orchestrator Pattern

One agent coordinates multiple sub-agents:

```markdown
# @orchestrator

## Workflow

1. Decompose task into subtasks
2. For each subtask:
   - Determine best agent
   - **INVOKE** appropriate agent
   - Collect result
3. Merge results
4. Validate final output
```

### 3. Fallback Pattern

Try one agent, fall back to another if it fails:

```markdown
## Workflow

1. **INVOKE** @builder-lite
2. IF failed or incomplete:
   - **INVOKE** @builder (full)
```

### 4. Review Loop Pattern

Build and review in a loop until approved:

```markdown
## Workflow

LOOP:
  1. **INVOKE** @builder to implement
  2. **INVOKE** @reviewer to review
  3. IF approved: EXIT LOOP
  4. ELSE: Apply fixes, continue
```

### 5. Conditional Pattern

Choose agent based on conditions:

```markdown
## Workflow

DETECT complexity:
  - IF trivial: **DELEGATE** @builder
  - IF simple: **INVOKE** @planner, then @builder
  - IF complex: **INVOKE** @analyst, @planner, @orchestrator
```

## Built-in Compositions

### /plan Skill
```
@planner → @executor → @reviewer
```

### /tdd Skill
```
@tdd (RED) → @builder (GREEN) → @tdd (REFACTOR)
```

### /dev-create-module Skill
```
@builder (types) → @builder (service) → @builder (hook) → @builder (component) → @tester
```

## Communication Between Agents

### Passing Data

```markdown
## Output

After completing work, output:
```json
{
  "status": "complete",
  "files": ["path/to/file.ts"],
  "summary": "Created user service",
  "nextAgent": "@reviewer",
  "context": {
    "module": "users",
    "filesCreated": 3
  }
}
```
```

### Receiving Data

```markdown
## Input

Expect context from previous agent:
- files: List of files to process
- module: Module name
- requirements: Original requirements
```

## Best Practices

### 1. Clear Boundaries

Each agent should have a single responsibility:

```markdown
# Good
@analyst: Convert requirements to spec
@planner: Create implementation plan
@builder: Write code

# Bad
@do-everything: Analyze, plan, build, review, test
```

### 2. Minimal Context Passing

Pass only what's needed:

```markdown
# Good
INVOKE @builder with: { "task": "create service", "name": "users" }

# Bad
INVOKE @builder with: { entire conversation history }
```

### 3. Explicit Handoffs

Always specify what the next agent should do:

```markdown
## Handoff

Passing to @reviewer:
- Files to review: [list]
- Focus areas: [areas]
- Acceptance criteria: [criteria]
```

### 4. Error Handling

Specify what happens on failure:

```markdown
## On Error

IF @builder fails:
  1. Create checkpoint
  2. Notify user with error details
  3. Suggest @debugger for investigation
```

## Example: Full Feature Workflow

```markdown
# @feature-builder - Composed Agent

## Mission
Build complete features by coordinating specialist agents.

## Workflow

### Phase 1: Analysis
**INVOKE** @scout
- Get project context
- Identify relevant agents

### Phase 2: Requirements
**INVOKE** @analyst with: "$ARGUMENTS"
- Convert to technical spec
- Define acceptance criteria

### Phase 3: Planning
**INVOKE** @planner with: spec
- Create implementation plan
- Estimate complexity

### Phase 4: Implementation
IF complexity == trivial:
  **INVOKE** @builder
ELSE:
  **INVOKE** @orchestrator with: plan
  **PARALLEL**:
    - @builder: Core implementation
    - @tester: Write tests
  **END PARALLEL**

### Phase 5: Review
**INVOKE** @reviewer with: implementation
- 3-in-1 review
- IF issues: **INVOKE** @builder to fix

### Phase 6: Finalize
**INVOKE** /finish skill
- Validate all tests pass
- Generate metrics
- Create checkpoint
```

## Token Efficiency

Composition reduces tokens by:

1. **Specialized agents** - Each agent is smaller, focused
2. **Context isolation** - Agents don't carry full history
3. **Parallel execution** - Multiple agents work simultaneously
4. **Early termination** - Skip agents when not needed

Typical savings: 30-50% vs monolithic agents.
