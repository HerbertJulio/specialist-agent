---
name: autopilot
description: "Use when you want to iteratively build a feature using a PRD as source of truth, with progress tracking and fresh-context iterations - the Autopilot technique for autonomous development."
user-invocable: true
argument-hint: "[PRD path or description] [--max-iterations=N]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Agent, TodoWrite
---

# /autopilot - Iterative Autonomous Development

Execute complex features autonomously using the Autopilot technique: PRD as source of truth, progress file for state persistence, and fresh-context iterations to avoid context rot.

**Target:** $ARGUMENTS

## When to Use

- Features that require 5+ tasks to implement
- Overnight or unattended batch execution
- Migrations (database, framework, architecture)
- Building MVPs from a PRD
- Any task where context rot degrades quality over long sessions
- NOT for: single-file changes (use `@builder`)
- NOT for: subjective design decisions (need human feedback)
- NOT for: tasks without clear completion criteria

## Workflow

### Step 1: PRD Resolution

1. **If argument is a file path** (ends in `.md`): Read it as the PRD
2. **If argument is a description**: Delegate to `/prd` to generate `docs/PRD-[name].md`
3. **If PRD already exists** at `.claude/autopilot/progress.md` with a PRD reference: Resume from where it left off

```bash
# Check for existing progress
cat .claude/autopilot/progress.md 2>/dev/null
```

**BLOCKED** until a PRD file exists and is readable.

### Step 2: Task Extraction & Progress Initialization

1. **Parse the PRD** for implementable tasks (look for issue breakdown, task lists, or feature sections)
2. **Create progress file** at `.claude/autopilot/progress.md`:

```markdown
# Autopilot Progress

## Config
- PRD: [path/to/PRD.md]
- Max iterations: [N, default 10]
- Current iteration: 0
- Status: IN_PROGRESS
- Started: [timestamp]

## Tasks
| # | Task | Status | Iteration | Notes |
|---|------|--------|-----------|-------|
| 1 | [task from PRD] | PENDING | - | - |
| 2 | [task from PRD] | PENDING | - | - |
| 3 | [task from PRD] | PENDING | - | - |

## Iteration Log
```

3. **Create git restore point:**

```bash
git add -A 2>/dev/null
git tag restore-point/ralf-$(date +%Y%m%d-%H%M%S) 2>/dev/null
```

4. **Initialize TodoWrite** with all tasks for live progress tracking.

### Step 3: Iteration Loop

For each iteration until completion:

#### 3a. Read State
```
1. READ the PRD (source of truth - may have been updated)
2. READ .claude/autopilot/progress.md
3. IDENTIFY next task with Status = PENDING
4. If no PENDING tasks remain → go to Step 4 (Completion)
```

#### 3b. Execute Task via Fresh-Context Subagent

**Critical:** Delegate each task to a subagent using the `Agent` tool. This gives the task a fresh context window, preventing context rot.

```
Agent(
  description: "RALF iteration N - task description",
  prompt: "
    You are executing a Autopilot task.

    ## PRD (Source of Truth)
    [inline PRD content]

    ## Current Progress
    [inline progress.md content]

    ## Your Task
    Task #N: [task description]

    ## Instructions
    1. Implement this task completely
    2. Follow existing codebase patterns
    3. Run tests if available
    4. Create a git commit: git add -A && git commit -m 'autopilot: task-N - [description]'
    5. Report what you did and what files changed
  "
)
```

#### 3c. Verify Result

After the subagent returns:

```
1. CHECK git log for the commit
2. RUN tests (if test command exists in package.json)
3. RUN type check (tsc --noEmit, if TypeScript project)
4. If PASS → mark task DONE in progress.md
5. If FAIL → retry (max 2 retries per task)
6. If still FAIL after retries → mark task BLOCKED, add error notes
```

#### 3d. Update Progress

```markdown
## Update in progress.md:
- Increment "Current iteration" counter
- Update task status (DONE / BLOCKED)
- Add iteration log entry:

### Iteration [N]
- Task: #[X] [description]
- Result: DONE | BLOCKED
- Files changed: [list]
- Notes: [what happened]
```

#### 3e. Create Checkpoint

```bash
git tag checkpoint/ralf-task-[N] 2>/dev/null
```

#### 3f. Check Completion

```
- All tasks DONE or BLOCKED? → Exit loop
- Current iteration >= max iterations? → Exit loop
- Otherwise → Continue to next iteration (3a)
```

### Step 4: Completion

1. **Update progress.md** status to `COMPLETE` or `MAX_ITERATIONS_REACHED`
2. **Generate summary report**
3. **Suggest next steps** (`/verify` for validation, `/finish` for branch finalization)

## Progress File Format

The progress file at `.claude/autopilot/progress.md` is the **state persistence layer** between iterations. It MUST follow this exact format for reliable parsing:

```markdown
# Autopilot Progress

## Config
- PRD: docs/PRD-feature-name.md
- Max iterations: 10
- Current iteration: 3
- Status: IN_PROGRESS | COMPLETE | MAX_ITERATIONS_REACHED
- Started: 2026-03-16T14:30:00

## Tasks
| # | Task | Status | Iteration | Notes |
|---|------|--------|-----------|-------|
| 1 | Create data models | DONE | 1 | Created User, Task models |
| 2 | Implement API endpoints | DONE | 2 | REST endpoints for CRUD |
| 3 | Build frontend components | IN_PROGRESS | 3 | Started TaskList component |
| 4 | Add authentication | PENDING | - | - |
| 5 | Write integration tests | PENDING | - | - |

## Iteration Log

### Iteration 1
- Task: #1 Create data models
- Result: DONE
- Files: src/models/user.ts, src/models/task.ts
- Notes: Followed existing Prisma schema patterns

### Iteration 2
- Task: #2 Implement API endpoints
- Result: DONE
- Files: src/api/users.ts, src/api/tasks.ts
- Notes: RESTful CRUD with validation

### Iteration 3
- Task: #3 Build frontend components
- Result: IN_PROGRESS
- Files: src/components/TaskList.tsx
- Notes: Component created, needs styling
```

## Execution Modes

### Plugin Mode (Default)

Runs inside Claude Code using `Agent` tool for fresh-context subagents. Easier to use but doesn't fully reset the outer context window.

```
/autopilot docs/PRD-my-feature.md --max-iterations=10
```

### Script Mode (Maximum Performance)

For the true Autopilot experience with full context reset between iterations, use the bash script:

```bash
./scripts/autopilot.sh docs/PRD-my-feature.md --max-iterations=10 --model=claude-opus-4-6
```

The script kills and restarts Claude Code between iterations, giving each iteration a completely fresh context window. Best for:
- Long-running overnight builds
- Complex migrations where context rot is noticeable
- Running inside a DevContainer with `--dangerously-skip-permissions`

See `templates/autopilot/README.md` for DevContainer setup.

## Integration with Specialist Agent

| Component | How Autopilot Uses It |
|-----------|----------------------|
| `/prd` | Generates the PRD if user provides a description instead of a file |
| `/checkpoint` | Creates restore points and per-task checkpoints |
| `@executor` | Pattern reference for self-healing (max 2 retries) |
| `@builder` | Subagent for implementation tasks |
| `after-task` hook | Fires after each iteration completes |
| TodoWrite | Live progress tracking during plugin mode |

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I'll just do it in one long session" | Context rot is real. After ~50K tokens, quality degrades measurably. Fresh iterations produce better code. |
| "The PRD is too detailed, I'll wing it" | Vague PRDs produce vague code. The PRD is the contract. If it's wrong, fix the PRD first. |
| "I don't need progress tracking" | You are a goldfish with a notepad. Without progress.md, you'll redo completed work or skip critical tasks. |
| "One more retry will fix it" | After 2 retries, the approach is wrong, not the execution. Mark BLOCKED and move on. A human needs to look at it. |
| "I can combine multiple tasks per iteration" | One task per iteration. Combining tasks creates entangled commits and makes rollback impossible. |
| "Script mode is overkill" | For 3 tasks, maybe. For 10+ tasks or overnight runs, script mode's clean context pays for itself in fewer total iterations. |

## Rules

1. **One task per iteration** - Never combine tasks. Each iteration handles exactly one task.
2. **PRD is sacred** - Never modify the PRD during execution. If the PRD is wrong, stop and fix it first.
3. **Progress file is the single source of state** - All iteration state lives in progress.md. No in-memory state.
4. **Fresh context per task** - Always delegate to a subagent (plugin mode) or restart Claude (script mode).
5. **Max 2 retries per task** - After 2 failures, mark BLOCKED and continue with the next task.
6. **Always checkpoint** - Every successful task gets a git tag. No exceptions.
7. **Verify before marking DONE** - Run tests/type-check. No "should work" claims.
8. **Resume-safe** - If interrupted, running `/autopilot` again reads progress.md and continues from where it stopped.

## Output

```
──── /autopilot ────
PRD: docs/PRD-[name].md
Mode: Plugin | Script
Max Iterations: N

[1/N] Task 1: [description]... DONE (iteration 1)
[2/N] Task 2: [description]... DONE (iteration 2)
[3/N] Task 3: [description]... BLOCKED (iteration 3-5, retried 2x)
[4/N] Task 4: [description]... DONE (iteration 6)
[5/N] Task 5: [description]... PENDING

Status: IN_PROGRESS | COMPLETE | MAX_ITERATIONS_REACHED
Iterations used: X/N
Tasks: Y DONE, Z BLOCKED, W PENDING
Progress: .claude/autopilot/progress.md

──── Next: /verify or /finish ────
```
