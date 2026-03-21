# Autopilot - Iteration {{ITERATION}} of {{MAX_ITERATIONS}}

## Source of Truth (PRD)

{{PRD_CONTENT}}

## Current Progress

{{PROGRESS_CONTENT}}

## Instructions

1. Read the PRD above carefully - it is your source of truth
2. Read the progress above to understand what has been completed
3. If the Tasks table is empty, extract all implementable tasks from the PRD and update the Tasks table in `{{PROGRESS_FILE}}` with proper entries (Status: PENDING)
4. Find the NEXT task with Status = PENDING
5. If no PENDING tasks remain, update Status to COMPLETE and add `{{COMPLETION_SIGNAL}}` as the last line of `{{PROGRESS_FILE}}`, then exit
6. Execute that ONE task completely:
   - Follow existing codebase patterns and conventions
   - Write clean, tested code following SOLID principles
   - Run tests if a test command exists
   - Run type checking if applicable
7. Update `{{PROGRESS_FILE}}`:
   - Mark the task as DONE (or BLOCKED if it failed after your best effort)
   - Increment "Current iteration" to {{ITERATION}}
   - Add an entry to the Iteration Log with: task number, result, files changed, notes
8. Git commit your work:
   ```bash
   git add -A && git commit -m "autopilot: iteration {{ITERATION}} - [brief task description]"
   ```
9. Exit when done with this ONE task

## Constraints

- Work on exactly ONE task per iteration
- Do NOT skip ahead or combine tasks
- If a task fails after 2 attempts, mark it BLOCKED with error notes and move to the next PENDING task
- Do NOT modify the PRD file
- Always update `{{PROGRESS_FILE}}` before exiting
