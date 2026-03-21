# Autopilot

::: info Agents: `@autopilot` · Complexity: Medium-High
:::

Autonomous iterative development using a PRD as source of truth and progress tracking between iterations.

## MVP from PRD (Overnight Build) {#mvp-overnight}

**Goal:** Build an entire MVP overnight from a PRD, unattended.

**Agents involved:** `/prd` → `@autopilot` (10 iterations) → `/verify`

### Workflow

```
Evening: Setup (15 min)
──────────────────────

User: /prd Task management app with Kanban board, drag-and-drop, and user auth

  /prd generates:
  → docs/PRD-task-manager.md
  → 8 user stories with Gherkin acceptance criteria
  → Issue breakdown: 7 tasks (S-M sized)

User reviews PRD, adjusts if needed.

User: /autopilot docs/PRD-task-manager.md --max-iterations=10

  @autopilot initializes:
  → Creates .claude/autopilot/progress.md
  → Extracts 7 tasks from PRD
  → Creates git restore point

  Iteration 1: Data models
  → Creates Prisma schema (User, Board, Column, Task)
  → Runs prisma generate
  → ✓ DONE — commits, updates progress.md

  Iteration 2: API endpoints
  → Creates REST CRUD for boards, columns, tasks
  → Adds validation with Zod
  → Runs tsc --noEmit
  → ✓ DONE

  Iteration 3: Authentication
  → JWT login/register endpoints
  → Auth middleware
  → ✓ DONE

  Iteration 4: Frontend layout
  → Kanban board component
  → Column and task card components
  → ✓ DONE

  Iteration 5: Drag and drop
  → Integrates dnd-kit / sortable
  → Updates task position via API
  → ✓ DONE

  Iteration 6: User dashboard
  → Board list, create board flow
  → Protected routes
  → ✓ DONE

  Iteration 7: Tests
  → Unit tests for services
  → Integration tests for API
  → ✓ DONE

  All tasks DONE → writes AUTOPILOT_COMPLETE to progress.md

Next morning: User checks progress.md and git log.

User: /verify

  /verify confirms:
  → tsc: 0 errors
  → Tests: 24/24 passing
  → Build: success
```

---

## Database Migration (PostgreSQL to MySQL) {#db-migration}

**Goal:** Migrate an existing project from PostgreSQL to MySQL.

**Command:**
```
/autopilot docs/PRD-db-migration.md --max-iterations=15 --model=claude-opus-4-6
```

**What happens:**
1. `@autopilot` reads PRD with migration requirements
2. Each iteration handles one migration task:

```
Iteration 1: Update Prisma provider
  → Change provider from "postgresql" to "mysql"
  → Adjust data types (TEXT → LONGTEXT, JSONB → JSON)
  → ✓ DONE

Iteration 2: Fix schema incompatibilities
  → PostgreSQL arrays → JSON columns
  → Enum handling differences
  → ✓ DONE

Iteration 3: Update seed scripts
  → Adjust SQL syntax for MySQL
  → Date format changes
  → ✓ DONE

Iteration 4: Update queries
  → Replace PostgreSQL-specific operators
  → ILIKE → LOWER() + LIKE
  → ✓ DONE

Iteration 5: Update Docker Compose
  → Replace postgres image with mysql
  → Update env vars (DATABASE_URL)
  → ✓ DONE

Iteration 6: Run and fix tests
  → Fix 3 failing tests (date comparison)
  → ✓ DONE

Iteration 7: Integration testing
  → Full CRUD test against MySQL
  → ✓ DONE

All tasks DONE → AUTOPILOT_COMPLETE
```

---

## Feature Build with Script Mode (DevContainer) {#devcontainer}

**Goal:** Build a notification system using script mode for maximum quality.

**Agents involved:** `/prd` → `scripts/autopilot.sh` (in DevContainer)

### Workflow

```
Setup: DevContainer (5 min)
───────────────────────────

# Copy devcontainer config
cp templates/autopilot/devcontainer.json .devcontainer/devcontainer.json

# Open in VS Code → "Reopen in Container"

# Inside container terminal:
claude
> /prd Real-time notification system with WebSocket, in-app and email
> exit

# Run autopilot (script mode — true context reset)
./scripts/autopilot.sh docs/PRD-notifications.md \
  --max-iterations=12 \
  --model=claude-opus-4-6 \
  --dangerously-skip-permissions

Execution: Unattended (2-3 hours)
──────────────────────────────────

Each iteration:
  1. Claude starts fresh (zero context)
  2. Reads PRD + progress.md
  3. Finds next PENDING task
  4. Implements it fully
  5. Updates progress.md
  6. Commits and exits
  7. Script kills process, starts next iteration

  === Autopilot: Iteration 1 of 12 ===
  Task: WebSocket server setup
  → ✓ DONE

  === Autopilot: Iteration 2 of 12 ===
  Task: Notification data models
  → ✓ DONE

  ...

  === Autopilot: Iteration 8 of 12 ===
  Task: Email integration (SendGrid)
  → BLOCKED (missing API key in .env)

  === Autopilot: Iteration 9 of 12 ===
  Task: Frontend notification bell
  → ✓ DONE

  ...

Result: Check progress
──────────────────────

cat .claude/autopilot/progress.md

  Tasks: 9 DONE, 1 BLOCKED, 0 PENDING
  Iterations used: 11/12

# Fix BLOCKED task manually, then resume:
./scripts/autopilot.sh docs/PRD-notifications.md
```

---

## Parallel Features with Git Worktrees {#parallel-worktrees}

**Goal:** Build two independent features simultaneously overnight.

### Workflow

```
Setup: Create worktrees
───────────────────────

git worktree add ../project-auth -b feature/auth
git worktree add ../project-billing -b feature/billing

# Terminal 1:
cd ../project-auth
./scripts/autopilot.sh docs/PRD-auth.md \
  --max-iterations=10 --dangerously-skip-permissions

# Terminal 2:
cd ../project-billing
./scripts/autopilot.sh docs/PRD-billing.md \
  --max-iterations=10 --dangerously-skip-permissions

# Both run in parallel, each with isolated state

Result: Next morning
────────────────────

# Check auth progress
cat ../project-auth/.claude/autopilot/progress.md
  → 6/6 tasks DONE

# Check billing progress
cat ../project-billing/.claude/autopilot/progress.md
  → 7/8 tasks DONE, 1 BLOCKED

# Merge results
cd ../project-auth && git checkout main && git merge feature/auth
cd ../project-billing && git checkout main && git merge feature/billing
```

---

## Quick Tips

### When to Use Plugin Mode vs Script Mode

```
Plugin mode (/autopilot):
  ✓ Quick features (< 5 tasks)
  ✓ Attended sessions
  ✓ When you want to monitor progress live

Script mode (scripts/autopilot.sh):
  ✓ Complex features (10+ tasks)
  ✓ Overnight unattended runs
  ✓ Migrations and large refactors
  ✓ When quality degrades in long sessions
```

### Writing Good PRDs for Autopilot

```
✓ DO: Include clear acceptance criteria per feature
✓ DO: Break work into small, independent tasks
✓ DO: Specify test requirements
✓ DO: Define the tech stack and patterns to follow

✗ DON'T: Leave requirements vague ("make it fast")
✗ DON'T: Include subjective design decisions
✗ DON'T: Combine unrelated features in one PRD
✗ DON'T: Skip the issue breakdown section
```

---

## Related Scenarios

- [Planning](/scenarios/planning) - Create the plan before autopilot
- [Workflows](/scenarios/workflows) - Manual multi-agent coordination
- [Migration](/scenarios/migration) - Migration-specific scenarios
