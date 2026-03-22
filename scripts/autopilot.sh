#!/usr/bin/env bash
#
# Autopilot - Iterative Autonomous Development
#
# The "true" Autopilot: kills and restarts Claude Code between iterations
# for a completely fresh context window each time. Avoids context rot.
#
# Usage:
#   ./scripts/autopilot.sh <prd-file> [options]
#
# Options:
#   --max-iterations=N              Maximum iterations (default: 10)
#   --completion-signal=STR         Text that signals completion (default: AUTOPILOT_COMPLETE)
#   --progress-file=PATH            Progress file path (default: .claude/autopilot/progress.md)
#   --model=MODEL                   Claude model (default: claude-sonnet-4-6)
#   --dangerously-skip-permissions  Pass through to Claude Code
#
# Examples:
#   ./scripts/autopilot.sh docs/PRD-auth.md
#   ./scripts/autopilot.sh docs/PRD-migration.md --max-iterations=20 --model=claude-opus-4-6
#   ./scripts/autopilot.sh docs/PRD-mvp.md --dangerously-skip-permissions
#
set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────

MAX_ITERATIONS=10
COMPLETION_SIGNAL="AUTOPILOT_COMPLETE"
PROGRESS_FILE=".claude/autopilot/progress.md"
MODEL="claude-sonnet-4-6"
CLAUDE_FLAGS=""
PRD_FILE=""

# ── Parse Arguments ───────────────────────────────────────────

for arg in "$@"; do
  case "$arg" in
    --max-iterations=*)
      MAX_ITERATIONS="${arg#*=}"
      ;;
    --completion-signal=*)
      COMPLETION_SIGNAL="${arg#*=}"
      ;;
    --progress-file=*)
      PROGRESS_FILE="${arg#*=}"
      ;;
    --model=*)
      MODEL="${arg#*=}"
      ;;
    --dangerously-skip-permissions)
      CLAUDE_FLAGS="$CLAUDE_FLAGS --dangerously-skip-permissions"
      ;;
    --help|-h)
      head -25 "$0" | tail -20
      exit 0
      ;;
    -*)
      echo "Unknown option: $arg"
      exit 1
      ;;
    *)
      if [ -z "$PRD_FILE" ]; then
        PRD_FILE="$arg"
      else
        echo "Error: Multiple PRD files specified"
        exit 1
      fi
      ;;
  esac
done

# ── Validate ──────────────────────────────────────────────────

if [ -z "$PRD_FILE" ]; then
  echo "Error: PRD file is required"
  echo "Usage: ./scripts/autopilot.sh <prd-file> [options]"
  exit 1
fi

if [ ! -f "$PRD_FILE" ]; then
  echo "Error: PRD file not found: $PRD_FILE"
  exit 1
fi

if ! command -v claude &>/dev/null; then
  echo "Error: claude CLI not found. Install Claude Code first."
  exit 1
fi

# ── Initialize ────────────────────────────────────────────────

PROGRESS_DIR="$(dirname "$PROGRESS_FILE")"
mkdir -p "$PROGRESS_DIR"

# Create progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  cat > "$PROGRESS_FILE" << PROGRESS_EOF
# Autopilot Progress

## Config
- PRD: $PRD_FILE
- Max iterations: $MAX_ITERATIONS
- Current iteration: 0
- Status: IN_PROGRESS
- Started: $(date -Iseconds 2>/dev/null || date +%Y-%m-%dT%H:%M:%S)

## Tasks
_Tasks will be extracted from PRD on first iteration._

## Iteration Log
PROGRESS_EOF
  echo "Created progress file: $PROGRESS_FILE"
fi

# Create git restore point
if git rev-parse --is-inside-work-tree &>/dev/null; then
  RESTORE_TAG="restore-point/autopilot-$(date +%Y%m%d-%H%M%S)"
  git add -A 2>/dev/null || true
  git stash --include-untracked -m "autopilot: pre-loop state" 2>/dev/null || true
  git stash pop 2>/dev/null || true
  git tag "$RESTORE_TAG" 2>/dev/null || true
  echo "Created restore point: $RESTORE_TAG"
fi

# ── Autopilot ─────────────────────────────────────────────────

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║          Autopilot - Starting                ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  PRD:        $PRD_FILE"
echo "║  Model:      $MODEL"
echo "║  Max iter:   $MAX_ITERATIONS"
echo "║  Progress:   $PROGRESS_FILE"
echo "╚══════════════════════════════════════════════╝"
echo ""

ITERATION=0
START_TIME=$(date +%s)

while [ "$ITERATION" -lt "$MAX_ITERATIONS" ]; do
  # Check completion signal
  if grep -q "$COMPLETION_SIGNAL" "$PROGRESS_FILE" 2>/dev/null; then
    echo ""
    echo "=== Autopilot: Completion signal detected ==="
    break
  fi

  ITERATION=$((ITERATION + 1))
  echo ""
  echo "=== Autopilot: Iteration $ITERATION of $MAX_ITERATIONS ==="
  echo "    $(date +%H:%M:%S)"
  echo ""

  # Read PRD and progress for the prompt
  PRD_CONTENT="$(cat "$PRD_FILE")"
  PROGRESS_CONTENT="$(cat "$PROGRESS_FILE")"

  # Build the iteration prompt
  PROMPT="You are in Autopilot iteration $ITERATION of $MAX_ITERATIONS.

## Source of Truth (PRD)
$PRD_CONTENT

## Current Progress
$PROGRESS_CONTENT

## Instructions

1. Read the PRD above carefully - it is your source of truth
2. Read the progress above to understand what has been completed
3. If the Tasks table says '_Tasks will be extracted from PRD on first iteration._', extract all implementable tasks from the PRD and update the Tasks table in $PROGRESS_FILE with proper entries (Status: PENDING)
4. Find the NEXT task with Status = PENDING
5. If no PENDING tasks remain, update Status to COMPLETE and add '$COMPLETION_SIGNAL' as the last line of $PROGRESS_FILE, then exit
6. Execute that ONE task completely:
   - Follow existing codebase patterns and conventions
   - Write clean, tested code following SOLID principles
   - Run tests if a test command exists (npm test, pytest, go test, etc.)
   - Run type checking if applicable (tsc --noEmit, mypy, etc.)
7. Update $PROGRESS_FILE:
   - Mark the task as DONE (or BLOCKED if it failed after your best effort)
   - Increment 'Current iteration' to $ITERATION
   - Add an entry to the Iteration Log section with: task number, result, files changed, notes
8. Git commit your work:
   git add -A && git commit -m 'autopilot: iteration $ITERATION - [brief task description]'
9. Exit when done with this ONE task

## Constraints
- Work on exactly ONE task per iteration
- Do NOT skip ahead or combine tasks
- If a task fails after 2 attempts, mark it BLOCKED with error notes and move to the next PENDING task
- Do NOT modify the PRD file
- Always update $PROGRESS_FILE before exiting"

  # Run Claude with the prompt (fresh process = fresh context)
  echo "$PROMPT" | claude --model "$MODEL" --print $CLAUDE_FLAGS 2>&1 || true

  echo ""
  echo "=== Autopilot: Iteration $ITERATION complete ==="

  # Brief pause to avoid rate limiting
  sleep 2
done

# ── Summary ───────────────────────────────────────────────────

END_TIME=$(date +%s)
DURATION=$(( (END_TIME - START_TIME) / 60 ))

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║          Autopilot - Complete                ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Iterations: $ITERATION/$MAX_ITERATIONS"
echo "║  Duration:   ${DURATION}m"
echo "║  Progress:   $PROGRESS_FILE"
if [ -n "${RESTORE_TAG:-}" ]; then
echo "║  Restore:    $RESTORE_TAG"
fi
echo "╚══════════════════════════════════════════════╝"
echo ""

# Show task summary from progress file
echo "── Task Summary ──"
grep -E "^\| [0-9]" "$PROGRESS_FILE" 2>/dev/null || echo "No tasks found in progress file"
echo ""

# Show git log of changes
if git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "── Git Log ──"
  git log --oneline --since="$(date -d "@$START_TIME" +%Y-%m-%dT%H:%M:%S 2>/dev/null || date -r "$START_TIME" +%Y-%m-%dT%H:%M:%S 2>/dev/null || echo '1 hour ago')" 2>/dev/null || true
fi
