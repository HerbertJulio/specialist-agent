---
name: worktree
description: "Use when you need workspace isolation for parallel tasks, risky changes, or multi-feature development without branch switching."
user-invocable: true
argument-hint: "[task-name]"
allowed-tools: Read, Bash, Glob, Grep
---

# /worktree - Git Worktree Isolation

Create isolated workspaces for parallel development. Each task gets its own directory - no branch switching, no stashing, no conflicts.

**Target:** $ARGUMENTS

## When to Use

- Working on multiple features simultaneously
- Risky refactoring that might break things
- Long-running tasks that shouldn't block other work
- Testing a fix while keeping current work intact
- Running parallel agents on different tasks
- NOT for: simple single-file changes (just use a branch)

## Workflow

### Step 1: Directory Selection

Choose where to create worktrees:

```
Priority order:
1. Existing worktrees directory (if configured)
2. .claude/worktrees/ (default for Specialist Agent)
3. ../project-worktrees/ (sibling directory)
4. Ask user
```

### Step 2: Create Worktree

```bash
# Create new branch and worktree
git worktree add .claude/worktrees/$ARGUMENTS -b worktree/$ARGUMENTS

# Verify creation
git worktree list
```

### Step 3: Setup Workspace

```bash
# Enter worktree
cd .claude/worktrees/$ARGUMENTS

# Install dependencies (auto-detect)
if [ -f "package-lock.json" ]; then npm ci
elif [ -f "yarn.lock" ]; then yarn install --frozen-lockfile
elif [ -f "pnpm-lock.yaml" ]; then pnpm install --frozen-lockfile
elif [ -f "bun.lockb" ]; then bun install
fi

# Verify clean baseline
git status
```

### Step 4: Work in Isolation

```
The worktree is a full copy of the repo.
- Changes here do NOT affect the main worktree
- You can run tests, builds, anything
- Commits go to the worktree/$ARGUMENTS branch
```

### Step 5: Merge or Discard

When done:

```bash
# Option 1: Merge back
cd /path/to/main/repo
git merge worktree/$ARGUMENTS

# Option 2: Create PR from worktree branch
gh pr create --base main --head worktree/$ARGUMENTS

# Option 3: Discard
git worktree remove .claude/worktrees/$ARGUMENTS
git branch -D worktree/$ARGUMENTS
```

## Worktree Management

### List Active Worktrees
```bash
git worktree list
```

### Remove a Worktree
```bash
git worktree remove .claude/worktrees/$NAME
git branch -D worktree/$NAME
```

### Clean All Worktrees
```bash
git worktree prune
```

## Integration with @orchestrator

When `@orchestrator` dispatches parallel agents:

```
@orchestrator
├── Worktree: feature-a → @builder (component)
├── Worktree: feature-b → @builder (service)
└── Worktree: feature-c → @tester (tests)

Each agent works in its own worktree.
No file conflicts possible.
Merge when all complete.
```

## Verification Protocol

**Before claiming worktree is ready:**

1. `git worktree list` shows the new worktree
2. Working directory is clean (`git status` shows no untracked files from setup)
3. Dependencies are installed (if applicable)
4. Tests pass in the worktree (baseline)

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Just stash and switch branches" | Stashing loses context and is error-prone. Worktrees keep everything intact. |
| "I'll remember what I was working on" | You won't. Worktrees preserve state explicitly. |
| "Too much disk space" | Worktrees share .git objects. Overhead is minimal. |
| "Merging will be hard" | Merging is the same as any branch. Worktrees don't add merge complexity. |
| "I'll just do tasks sequentially" | Sequential is slower. Parallel worktrees = parallel development. |

## Rules

1. **Always name worktrees descriptively** - `worktree/auth-refactor` not `worktree/temp`
2. **Install dependencies after creation** - Auto-detect package manager
3. **Verify baseline before working** - Tests must pass in fresh worktree
4. **Clean up when done** - Remove worktrees and branches after merge
5. **Never work in .git/** - Worktrees are directories, not git internals
6. **Gitignore the worktrees directory** - Add `.claude/worktrees/` to `.gitignore`

## Output

```
──── /worktree ────
Action: [create | list | remove | merge]
Name: $ARGUMENTS
Path: .claude/worktrees/$ARGUMENTS
Branch: worktree/$ARGUMENTS

Status: Ready
Dependencies: Installed
Baseline tests: Passing

Active worktrees:
  1. /main/repo (main branch)
  2. .claude/worktrees/$ARGUMENTS (worktree/$ARGUMENTS)
```
