# Hooks Reference

Hooks are lifecycle scripts that run at key moments during your development session. They automate pre-checks, track metrics, handle errors, and generate session summaries - all without manual intervention.

## Quick Reference

| Hook | When | Use Case |
|------|------|----------|
| `session-start` | Session begins | Validate setup, initialize metrics, create restore point |
| `before-plan` | Before `@planner` runs | Check architecture, detect framework, scan project |
| `after-task` | Task completes | Record metrics, log progress, track tokens |
| `before-review` | Before `@reviewer` runs | Run lint, type-check, identify changed files |
| `after-review` | After `@reviewer` finishes | Record verdict, save review history, suggest next steps |
| `on-error` | Agent encounters error | Log error, suggest recovery, provide guidance |
| `session-end` | Session ends | Generate summary, save history, calculate costs |

---

## Configuration

Hooks are configured in `hooks/hooks.json` at the project root.

```json
{
  "$schema": "https://specialist-agent.dev/schemas/hooks-v1.json",
  "version": "1.0.0",
  "hooks": {
    "session-start": {
      "description": "Runs when a new Claude Code session starts",
      "scripts": ["./hooks/session-start.mjs"],
      "enabled": true
    },
    "before-plan": {
      "description": "Runs before @planner creates a plan",
      "scripts": ["./hooks/before-plan.mjs"],
      "enabled": true
    }
  }
}
```

### Configuration Options

Each hook entry supports:

| Field | Type | Description |
|-------|------|-------------|
| `description` | `string` | Human-readable description |
| `scripts` | `string[]` | Array of script paths to execute (in order) |
| `enabled` | `boolean` | Toggle hook on/off without removing it |

### Metrics Tracking

The `metrics` section controls session-level data collection:

```json
{
  "metrics": {
    "enabled": true,
    "outputDir": ".claude/metrics",
    "track": {
      "tokens": true,
      "duration": true,
      "agents": true,
      "skills": true,
      "files": true,
      "checkpoints": true
    }
  }
}
```

### Notifications

Optional external notifications for specific events:

```json
{
  "notifications": {
    "enabled": false,
    "channels": {
      "slack": {
        "webhook": "",
        "events": ["on-error", "session-end"]
      },
      "discord": {
        "webhook": "",
        "events": ["on-error"]
      }
    }
  }
}
```

---

## Hook Details

### session-start

Runs when a new Claude Code session starts.

**What it does:**

1. **Validates project setup** - checks for `.claude/` directory and `CLAUDE.md`
2. **Initializes metrics** - creates `.claude/metrics/current-session.json` with empty counters
3. **Creates restore point** - tags current git commit as `restore-point/session-{timestamp}`
4. **Loads session memory** - displays recent decisions from `.claude/session-memory.json`

**Configuration:**

```json
{
  "session-start": {
    "scripts": ["./hooks/session-start.mjs"],
    "enabled": true
  }
}
```

**Example output:**

```
──── Session Start ────
✓ Claude directory
✓ CLAUDE.md config
✓ Metrics initialized
✓ Restore point: restore-point/session-1709312400000

──── Ready ────
Session: session-1709312400000
Started: 2/25/2026, 10:00:00 AM
```

**Use cases:**
- Ensure project is properly configured before work begins
- Automatically create rollback points for safety
- Resume context from previous sessions via memory

---

### before-plan

Runs before `@planner` creates an implementation plan.

**What it does:**

1. **Checks architecture file** - looks for `ARCHITECTURE.md` in `docs/`, root, or `.claude/`
2. **Checks git state** - reports current branch, uncommitted changes, and recent commits
3. **Detects framework** - reads `package.json` to identify Vue, React, Next.js, SvelteKit, Angular, Astro, Nuxt, TypeScript, and test runners
4. **Scans project size** - counts source files and classifies as Small/Medium/Large

**Input:** Accepts feature name via `PLAN_FEATURE` env var or CLI argument.

**Configuration:**

```json
{
  "before-plan": {
    "scripts": ["./hooks/before-plan.mjs"],
    "enabled": true
  }
}
```

**Example output:**

```
──── Pre-Plan Checks ────

  ✓ Architecture file: docs/ARCHITECTURE.md
    142 lines of architecture patterns
  Branch: feat/user-auth
  ✓ Working tree clean
  ✓ Framework: Next.js ^14.0.0
  ✓ TypeScript enabled
  ✓ Test runner: Vitest
  Source files: 87
  Scale: Medium project

──── Ready for Planning ────
```

**Use cases:**
- Give `@planner` full project context before creating a plan
- Warn about uncommitted changes that could conflict
- Auto-detect tech stack so plans match the project

---

### after-task

Runs after each task completes (from `@executor` or manual work).

**What it does:**

1. **Updates session metrics** - records task in `.claude/metrics/current-session.json`
2. **Logs task summary** - shows status, agent, tokens, duration, and file changes
3. **Shows running totals** - displays cumulative tasks, tokens, and estimated cost

**Input:** Accepts task data via environment variables or CLI arguments:

| Env Var | Arg Position | Description |
|---------|-------------|-------------|
| `TASK_ID` | 2 | Task identifier |
| `TASK_DESC` | 3 | Task description |
| `TASK_TOKENS` | 4 | Tokens used |
| `TASK_DURATION` | 5 | Time taken |
| `TASK_AGENT` | 6 | Agent that ran the task |
| `TASK_STATUS` | 7 | `completed` or `failed` |
| `FILES_CREATED` | env only | Comma-separated list |
| `FILES_MODIFIED` | env only | Comma-separated list |

**Configuration:**

```json
{
  "after-task": {
    "scripts": ["./hooks/after-task.mjs"],
    "enabled": true
  }
}
```

**Example output:**

```
──── Task Complete: task-001 ────
Status: ✓ completed
Agent: @builder
Tokens: ~12,500
Duration: 45s
Files created: 3
Files modified: 2

──── Session Progress ────
Tasks completed: 4
Total tokens: ~48,000
Estimated cost: ~$0.72
Agents used: @planner, @builder, @tdd
```

**Use cases:**
- Track cost and token usage across a session
- Monitor which agents are doing the most work
- Keep a detailed log of all changes made

---

### before-review

Runs before `@reviewer` starts a code review.

**What it does:**

1. **Runs linter** - executes `npm run lint` and reports pass/fail
2. **Runs TypeScript check** - executes `npx tsc --noEmit` and counts errors
3. **Identifies changed files** - lists staged, unstaged, and branch-diff files
4. **Quick test check** - lists available test files (with 10s timeout)

**Input:** Accepts review scope via `REVIEW_SCOPE` env var or CLI argument.

**Configuration:**

```json
{
  "before-review": {
    "scripts": ["./hooks/before-review.mjs"],
    "enabled": true
  }
}
```

**Example output:**

```
──── Pre-Review Checks ────

Running lint...
  ✓ Lint passed
Running TypeScript check...
  ✓ TypeScript passed
Identifying changes...
  Staged files: 5
    • src/modules/orders/types.ts
    • src/modules/orders/service.ts
    • src/modules/orders/adapter.ts
    • src/modules/orders/OrderList.vue
    • src/modules/orders/__tests__/service.spec.ts
Running quick test check...
  ✓ Test suite ready (12 test files)

──── Ready for Review ────
```

**Use cases:**
- Catch lint and type errors before wasting tokens on review
- Give `@reviewer` a clear picture of what changed
- Fail fast on obvious issues

---

### after-review

Runs after `@reviewer` completes a code review.

**What it does:**

1. **Logs review summary** - shows verdict (Approved, Caveats, Rejected) and a quality score
2. **Updates session metrics** - adds review data to the current session
3. **Saves review record** - writes a timestamped JSON file to `.claude/metrics/reviews/`
4. **Suggests next actions** - provides guidance based on the verdict

**Input:** Accepts review data via environment variables or CLI arguments:

| Env Var | Arg Position | Description |
|---------|-------------|-------------|
| `REVIEW_SCOPE` | 2 | What was reviewed |
| `REVIEW_VERDICT` | 3 | `approved`, `caveats`, or `rejected` |
| `REVIEW_VIOLATIONS` | 4 | Number of violations |
| `REVIEW_WARNINGS` | 5 | Number of warnings |
| `REVIEW_HIGHLIGHTS` | 6 | Number of highlights |

**Quality score formula:** `100 - (violations * 15) - (warnings * 5)`, minimum 0.

**Configuration:**

```json
{
  "after-review": {
    "scripts": ["./hooks/after-review.mjs"],
    "enabled": true
  }
}
```

**Example output:**

```
──── Review Complete: src/modules/orders/ ────
Verdict: ⚠ Approved with Caveats
Warnings: 2
Highlights: 3
Quality score: 90/100

✓ Metrics updated

──── Suggested Actions ────
  1. Address warnings if time permits
  2. Proceed with merge (caveats are non-blocking)
```

**Use cases:**
- Track review quality trends over time
- Automatically guide developers on next steps
- Build a review history for the project

---

### on-error

Runs when an agent encounters an error.

**What it does:**

1. **Logs error to metrics** - records agent, message, file, line, and task in session data
2. **Suggests recovery** - lists available checkpoints and restore points for rollback
3. **Provides guidance** - gives error-specific suggestions based on the error message:
   - TypeScript errors: run `tsc --noEmit`, check imports
   - Test errors: run `npm test`, check assertions
   - Syntax errors: check brackets, validate JSON/YAML
   - Module errors: run `npm install`, check import paths

**Input:** Accepts error data via environment variables or CLI arguments:

| Env Var | Arg Position | Description |
|---------|-------------|-------------|
| `ERROR_AGENT` | 2 | Agent that failed |
| `ERROR_MESSAGE` | 3 | Error message |
| `ERROR_FILE` | 4 | File where error occurred |
| `ERROR_LINE` | 5 | Line number |
| `ERROR_TASK` | 6 | Task being executed |
| `ERROR_STACK` | env only | Stack trace |

**Configuration:**

```json
{
  "on-error": {
    "scripts": ["./hooks/on-error.mjs"],
    "enabled": true
  }
}
```

**Example output:**

```
──── Error Detected ────
Agent: @builder
Message: TypeScript error in OrderService
Location: src/modules/orders/service.ts:42

✓ Error logged to session metrics

──── Recovery Options ────
Available checkpoints:
  • checkpoint/before-refactor
  • checkpoint/after-types

To rollback:
  git reset --hard checkpoint/after-types

──── Suggestions ────
• Run "npx tsc --noEmit" to see all type errors
• Check imports and type definitions

General:
• Use @debugger for systematic investigation
• Use /checkpoint restore [name] to rollback
• Check recent changes: git diff HEAD~1
```

**Use cases:**
- Automatically log all errors for post-session analysis
- Provide instant recovery options without manual lookup
- Guide developers toward the right debugging approach

---

### session-end

Runs when a session ends (manually triggered or detected).

**What it does:**

1. **Generates session summary** - overview with duration, status, and task counts
2. **Calculates final metrics** - tokens, cost, files changed, agents and skills used
3. **Displays cost comparison** - estimates savings vs alternative tooling
4. **Saves to history** - writes full session data to `.claude/metrics/history/`
5. **Preserves session file** - keeps `current-session.json` for manual review

**Configuration:**

```json
{
  "session-end": {
    "scripts": ["./hooks/session-end.mjs"],
    "enabled": true
  }
}
```

**Example output:**

```
════════════════════════════════════════
           SESSION SUMMARY
════════════════════════════════════════

──── Overview ────
Session ID: session-1709312400000
Duration: 1h 23m
Status: ✓ Completed successfully

──── Tasks ────
Completed: 8
Errors: 0

──── Files ────
Created: 12
Modified: 5

──── Token Usage ────
Total tokens: ~145,000
Per task avg: ~18,125
Estimated cost: ~$2.18

──── Agents & Skills ────
Agents: @planner, @builder, @tdd, @reviewer
Skills: /plan, /checkpoint

════════════════════════════════════════
```

**Use cases:**
- Get a complete picture of what was accomplished
- Track costs across sessions for budgeting
- Build a history of development sessions

---

## Creating Custom Hooks

### Hook File Format

Hooks are ES modules (`.mjs` files) with a default async `main()` function:

```javascript
#!/usr/bin/env node

/**
 * My Custom Hook
 */

async function main() {
  // Your hook logic here
  console.log('Hook executed');
}

main().catch(console.error);
```

### Available Context

Hooks receive data through **environment variables** and **CLI arguments**:

```javascript
// Environment variables
const agent = process.env.TASK_AGENT || 'unknown';
const feature = process.env.PLAN_FEATURE || '';

// CLI arguments (process.argv[2] and beyond)
const taskId = process.argv[2] || 'default';
```

Hooks can also read shared state from the metrics file:

```javascript
import { readFileSync } from 'fs';

const SESSION_FILE = '.claude/metrics/current-session.json';
const session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));
```

### Running Multiple Scripts

A single hook can trigger multiple scripts in sequence:

```json
{
  "before-review": {
    "scripts": [
      "./hooks/before-review.mjs",
      "./hooks/custom-lint-check.mjs"
    ],
    "enabled": true
  }
}
```

### Error Handling

Always wrap your main function with `.catch()` and handle failures gracefully:

```javascript
async function main() {
  try {
    const result = execSync('npm run lint', { encoding: 'utf-8' });
    console.log('✓ Lint passed');
  } catch (err) {
    // Log but don't crash - hooks should not block the session
    console.log('⚠ Lint failed, continuing anyway');
  }
}

main().catch(console.error);
```

### Best Practices

- **Keep hooks fast.** Long-running hooks delay agent execution. Use timeouts for external commands.
- **Fail gracefully.** Hooks should log warnings, not throw unhandled errors.
- **Use environment variables.** Pass data via env vars or CLI args, not hardcoded values.
- **Write to `.claude/metrics/`.** Keep all generated data in the metrics directory for consistency.
- **Disable, don't delete.** Set `"enabled": false` to skip a hook without losing the configuration.
- **Keep output concise.** Use clear section headers (`────`) and status icons (`✓`, `⚠`, `✗`) for readability.

---

## Native Claude Code Hooks

In addition to the lifecycle hooks above, Specialist Agent provides **4 native hooks** that integrate directly with Claude Code's hook system. These execute automatically via `.claude/settings.json` - no manual triggering needed.

### Quick Reference

| Hook | Event | What it Does |
|------|-------|-------------|
| Security Guard | `PreToolUse` | Blocks dangerous Bash commands before execution |
| Auto-Dispatch | `UserPromptSubmit` | Suggests the best agent based on your prompt |
| Session Context | `SessionStart` | Injects project state when session starts |
| Auto-Format | `PostToolUse` | Formats files after Write/Edit operations |

### Installation

Native hooks are installed during `npx specialist-agent init`. You can choose which hooks to enable.

They are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node .specialist-agent/hooks/native/security-guard.mjs", "timeout": 5 }]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{ "type": "command", "command": "node .specialist-agent/hooks/native/auto-dispatch.mjs", "timeout": 5 }]
      }
    ]
  }
}
```

---

### Security Guard

**Event:** `PreToolUse` (matcher: `Bash`)

Evaluates every Bash command against security rules **before** it executes. Designed fail-closed: if the hook crashes, it blocks the command.

**Rules by severity:**

| Severity | Patterns | Action |
|----------|----------|--------|
| CRITICAL | `rm -rf /`, `rm -rf ~`, fork bombs, disk wipe | Always block |
| HIGH | `git push --force` to main/master, `git reset --hard`, `DROP TABLE`, `curl \| bash`, `chmod 777` | Block with guidance |
| MEDIUM | Reading `.env` files, inline secrets, writing to `.env` | Block with alternatives |

**Safe patterns (allowed):**
- `rm -rf node_modules/`, `rm -rf dist/`, `rm -rf build/`, `rm -rf .next/`
- `git push --force-with-lease` (safer alternative)
- `git reset --soft`
- `cat .env.example`, `cat .env.template`

**Customization:**

Edit `.specialist-agent/hooks/native/security-config.json` to:
- Disable specific rules: `"hard-reset": { "enabled": false }`
- Add safe patterns to allowlist
- Configure protected branches

```json
{
  "rules": {
    "hard-reset": { "enabled": false }
  },
  "allowlist": ["rm -rf my-custom-dir"],
  "protectedBranches": ["main", "master", "staging"]
}
```

---

### Auto-Dispatch

**Event:** `UserPromptSubmit`

Analyzes your prompt and suggests the best specialist agent. Never forces - only provides context.

**How it works:**
1. Tokenizes your prompt and matches against keyword groups for each agent
2. Multi-word phrases score higher (e.g., "code review" scores more than just "review")
3. Only suggests when confidence is above threshold (2+ keyword matches)
4. Skips entirely if you already mention an `@agent` in your prompt

**Example:** When you type "there's a bug in the login page, error 500", the hook adds context suggesting `@doctor` for systematic diagnosis.

---

### Session Context

**Event:** `SessionStart`

Injects a one-line project state summary when your session starts:

```
[Specialist Agent] Branch: feat/auth | Uncommitted files: 3 | Last commit: feat: add login | Installed: 27 agents, 21 skills | Session memory: 5 saved decisions
```

**Data collected (all read-only):**
- Git branch and dirty file count
- Last commit message
- Installed agents and skills count
- Session memory decisions count
- Active profile

---

### Auto-Format

**Event:** `PostToolUse` (matcher: `Write|Edit`)

Automatically formats files after Claude writes or edits them.

**Supported formatters (detected by config):**
1. Prettier (`.prettierrc`, `prettier.config.js`, etc.)
2. Biome (`biome.json`)

**Supported extensions:** `.ts`, `.tsx`, `.js`, `.jsx`, `.vue`, `.svelte`, `.css`, `.json`, `.md`, `.html`, `.yaml`

**Security:** Validates file paths are within the project directory (anti-path-traversal). If no formatter is configured, silently does nothing.

---

### Security Design Principles

1. **Fail-closed:** Security Guard blocks on crash (exit code 2)
2. **No eval/exec:** Hooks never use `eval()` or execute user-controlled input
3. **No network:** No HTTP requests from any hook
4. **Path traversal protection:** Auto-Format validates paths within project
5. **Read-only config:** `security-config.json` is read, never written by hooks
6. **Short timeouts:** 5s (security, dispatch), 10s (context), 15s (format)
