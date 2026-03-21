# Autopilot - Iterative Autonomous Development

The Autopilot (Ralph Wiggum Loop) is an iterative AI development
technique where Claude Code executes tasks from a PRD in a loop,
resetting context between iterations to avoid quality degradation.

## How It Works

```
PRD (source of truth) + progress.md (state)
         ↓
    ┌─────────┐
    │ Read PRD │
    │ + progress│
    └────┬────┘
         ↓
    ┌─────────┐
    │ Execute  │
    │ next task│
    └────┬────┘
         ↓
    ┌─────────┐
    │ Update   │
    │ progress │
    └────┬────┘
         ↓
    ┌─────────┐
    │ Reset    │←── Fresh context (no context rot)
    │ context  │
    └────┬────┘
         ↓
    Loop until done
```

Each iteration Claude "wakes up" with no memory of previous
iterations. It reads the PRD to know what to build and
progress.md to know what's been done. Like the movie Memento.

## Two Execution Modes

### Plugin Mode (`/autopilot`)

Runs inside Claude Code. Each task is delegated to a subagent
with fresh context via the Agent tool.

```
/autopilot docs/PRD-my-feature.md --max-iterations=10
```

**Pros:** Easy to use, no terminal setup needed.
**Cons:** Outer context still accumulates (partial reset).

### Script Mode (`scripts/autopilot.sh`)

Bash loop that kills and restarts Claude between iterations.
Full context reset every time.

```bash
./scripts/autopilot.sh docs/PRD-my-feature.md \
  --max-iterations=10 \
  --model=claude-opus-4-6
```

**Pros:** True fresh context, best quality over many iterations.
**Cons:** Requires terminal, slightly more setup.

## When to Use

| Scenario | Recommended |
|----------|-------------|
| Small feature (< 5 tasks) | Plugin mode or `@executor` |
| Medium feature (5-10 tasks) | Plugin mode |
| Large feature (10+ tasks) | Script mode |
| Overnight unattended build | Script mode + DevContainer |
| Database migration | Script mode |
| Framework migration | Script mode + DevContainer |
| MVP from scratch | Script mode + DevContainer |

## When NOT to Use

- Tasks requiring subjective design decisions
- Debugging production issues (use `@doctor`)
- Tasks without clear completion criteria
- Single-file changes (use `@builder`)

## Quick Start

### 1. Create a PRD

```
/prd "Task management app with Kanban board"
```

This generates `docs/PRD-task-management.md` with user stories,
acceptance criteria, and issue breakdown.

### 2. Review the PRD

The PRD is the source of truth. Everything in it will be built.
Read it carefully and edit if needed before starting the loop.

### 3. Run the Loop

**Plugin mode:**
```
/autopilot docs/PRD-task-management.md
```

**Script mode:**
```bash
./scripts/autopilot.sh docs/PRD-task-management.md
```

### 4. Check Progress

```bash
cat .claude/autopilot/progress.md
```

## Progress File

The progress file at `.claude/autopilot/progress.md` persists
state between iterations:

```markdown
# Autopilot Progress

## Config
- PRD: docs/PRD-task-management.md
- Max iterations: 10
- Current iteration: 3
- Status: IN_PROGRESS

## Tasks
| # | Task | Status | Iteration | Notes |
|---|------|--------|-----------|-------|
| 1 | Data models | DONE | 1 | Prisma schema |
| 2 | API endpoints | DONE | 2 | REST CRUD |
| 3 | Frontend | IN_PROGRESS | 3 | Started |
| 4 | Auth | PENDING | - | - |

## Iteration Log
### Iteration 1
- Task: #1 Data models
- Result: DONE
- Files: prisma/schema.prisma
```

## Safe Execution with DevContainer

For unattended runs with `--dangerously-skip-permissions`,
use a DevContainer to isolate Claude from your host system.

See [templates/autopilot/README.md](https://github.com/HerbertJulio/specialist-agent/blob/main/templates/autopilot/README.md)
for setup instructions.

## Integration with Specialist Agent

The Autopilot integrates with existing tools:

| Tool | Integration |
|------|-------------|
| `/prd` | Generates the PRD that drives the loop |
| `/checkpoint` | Creates restore points per task |
| `@executor` | Self-healing pattern (max 2 retries) |
| `@looper` | Coordination agent for the full lifecycle |
| `after-iteration` hook | Extension point for notifications |

## Advanced Patterns

### Multi-Phase Autopilots

Chain multiple loops for phased development:

```bash
# Phase 1: Backend
./scripts/autopilot.sh docs/PRD-backend.md --max-iterations=15

# Phase 2: Frontend (depends on backend)
./scripts/autopilot.sh docs/PRD-frontend.md --max-iterations=15

# Phase 3: Integration tests
./scripts/autopilot.sh docs/PRD-tests.md --max-iterations=5
```

### Parallel Autopilots with Git Worktrees

Run independent features simultaneously:

```bash
git worktree add ../project-auth -b feature/auth
git worktree add ../project-api -b feature/api

# Terminal 1
cd ../project-auth
./scripts/autopilot.sh docs/PRD-auth.md

# Terminal 2
cd ../project-api
./scripts/autopilot.sh docs/PRD-api.md
```

### Resuming After Failure

If the loop is interrupted, just run it again. The script reads
progress.md and picks up from the next PENDING task.

```bash
# Same command - automatically resumes
./scripts/autopilot.sh docs/PRD-my-feature.md
```

## Troubleshooting

**Tasks keep getting BLOCKED:**
The PRD may be too vague. Improve task descriptions with
specific acceptance criteria.

**Quality degrades in later iterations (plugin mode):**
Switch to script mode for full context reset.

**Too many iterations for simple tasks:**
Reduce max-iterations or break the PRD into smaller PRDs.

**Claude modifies the PRD:**
This violates the Autopilot contract. The PRD is read-only
during execution. If it needs changes, stop the loop first.
