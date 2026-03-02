---
name: checkpoint
description: "Use when about to start risky changes, before major refactors, or when you need a safe rollback point during multi-step implementations."
user-invocable: true
argument-hint: "[create|restore|list|clean] [name]"
allowed-tools: Bash
---

# /checkpoint - Git Checkpoint Management

Create, restore, list, or clean git checkpoints.

**Command:** $ARGUMENTS

## When to Use

- About to start a risky refactoring
- Before deleting or restructuring modules
- During multi-step implementations (checkpoint between steps)
- Before running destructive git operations
- NOT for: every small edit (too noisy)

## Operations

### Create Checkpoint

```bash
/checkpoint create feature-auth
```

**Workflow:**
1. Stage all changes
2. Commit with checkpoint message
3. Create tag

```bash
git add -A
git commit -m "checkpoint: [name]"
git tag checkpoint/[name]
```

**Output:**
```
──── Checkpoint Created ────
Name: checkpoint/feature-auth
Commit: abc1234
Files: 5 changed
Time: 2024-01-15 14:30:22
```

### Create Restore Point

```bash
/checkpoint restore-point
```

Creates a timestamp-based restore point before major operations.

```bash
git tag restore-point/$(date +%Y%m%d-%H%M%S)
```

**Output:**
```
──── Restore Point Created ────
Tag: restore-point/20240115-143022
Use to rollback entire session if needed.
```

### List Checkpoints

```bash
/checkpoint list
```

```bash
git tag -l "checkpoint/*" | sort -V
git tag -l "restore-point/*" | sort
```

**Output:**
```
──── Checkpoints ────
Checkpoints:
  checkpoint/task-1        (2024-01-15 14:20)
  checkpoint/task-2        (2024-01-15 14:25)
  checkpoint/feature-auth  (2024-01-15 14:30)

Restore Points:
  restore-point/20240115-141500
  restore-point/20240115-143022
```

### Restore Checkpoint

```bash
/checkpoint restore feature-auth
```

**Warning:** This will discard uncommitted changes!

```bash
# Confirm with user first
git reset --hard checkpoint/[name]
```

**Output:**
```
──── Checkpoint Restored ────
Restored to: checkpoint/feature-auth
Commit: abc1234
Current state matches checkpoint.
```

### Full Rollback

```bash
/checkpoint rollback 20240115-143022
```

Rollback to a restore point (undoes all work since).

```bash
git reset --hard restore-point/[timestamp]
```

### Clean Checkpoints

```bash
/checkpoint clean
```

Remove all checkpoint tags (keeps restore points).

```bash
git tag -l "checkpoint/*" | xargs -n 1 git tag -d
```

**Output:**
```
──── Checkpoints Cleaned ────
Removed: 5 checkpoint tags
Kept: 2 restore points
```

### Clean All

```bash
/checkpoint clean-all
```

Remove ALL checkpoints and restore points.

```bash
git tag -l "checkpoint/*" | xargs -n 1 git tag -d
git tag -l "restore-point/*" | xargs -n 1 git tag -d
```

## Default Behavior

If no argument provided:
```bash
/checkpoint
```

Creates a timestamped checkpoint:
```
checkpoint/auto-20240115-143022
```

## Usage in Workflow

### Before Risky Changes
```bash
/checkpoint restore-point
# Make risky changes
# If it fails:
/checkpoint rollback [timestamp]
```

### During Feature Development
```bash
/checkpoint create step-1
# Work on step 2
/checkpoint create step-2
# If step 2 is wrong:
/checkpoint restore step-1
```

### After Session
```bash
/checkpoint clean  # Remove task checkpoints
# Keep restore points for safety
```

## Output

```
──── /checkpoint ────
Operation: [create|restore|list|clean]
[Operation details]
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I don't need a checkpoint, it's a small change" | Small changes break things too. A checkpoint takes 2 seconds, a rollback without one takes hours. |
| "Git history is enough" | Checkpoints are labeled save points - faster than hunting through `git reflog`. |
| "I'll just undo if something goes wrong" | You can't undo what you can't identify. Checkpoints mark the exact safe state. |

## Rules

1. **Always confirm before restore** - Destructive operation
2. **Create restore point before major work**
3. **Clean checkpoints after successful completion**
4. **Keep restore points until merge**
