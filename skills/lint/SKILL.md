---
name: lint
description: "Use when you need to lint the codebase and auto-fix issues - detects linter, runs it, and fixes what it can."
user-invocable: true
argument-hint: "[path or --fix]"
allowed-tools: Read, Bash, Glob, Grep
---

# /lint - Lint & Auto-Fix

Detect the project's linter, run it, auto-fix what's possible, and report remaining issues.

**Target:** $ARGUMENTS

## When to Use
- Before committing changes
- After generating code with AI
- When CI fails on lint
- During code cleanup
- NOT for: type checking (use `tsc` directly)

## Workflow

### Step 1: Detect Linter

Check for installed linters in order of priority:

| Check | Linter |
|-------|--------|
| `biome.json` or `biome.jsonc` exists | Biome |
| `.eslintrc.*` or `eslint.config.*` exists | ESLint |
| `deno.json` with `lint` config | Deno lint |
| `package.json` has `lint` script | npm run lint |

```bash
# Check for config files
ls biome.json biome.jsonc .eslintrc.* eslint.config.* 2>/dev/null
# Check package.json scripts
cat package.json | grep -A5 '"scripts"' | grep lint
```

### Step 2: Detect Formatter

| Check | Formatter |
|-------|-----------|
| `.prettierrc*` or `prettier.config.*` exists | Prettier |
| `biome.json` exists (has built-in formatter) | Biome |
| `deno.json` with `fmt` config | Deno fmt |
| `package.json` has `format` script | npm run format |

### Step 3: Run Lint

```bash
# Based on detected linter:
# Biome
npx biome check $TARGET --write 2>&1

# ESLint
npx eslint $TARGET --fix 2>&1

# npm script
npm run lint -- --fix 2>&1

# Deno
deno lint --fix $TARGET 2>&1
```

### Step 4: Run Formatter (if separate from linter)

```bash
# Prettier
npx prettier --write $TARGET 2>&1

# npm script
npm run format 2>&1
```

### Step 5: Report

Count fixed vs remaining issues.

## Output

```
──── /lint ────
Linter: ESLint
Formatter: Prettier
Target: src/

Fixed automatically:
  - 12 formatting issues (Prettier)
  - 5 unused imports (ESLint --fix)
  - 3 missing semicolons (ESLint --fix)

Remaining (manual fix needed):
  - src/auth.ts:42 - no-explicit-any: Unexpected any
  - src/api.ts:18 - no-unused-vars: 'result' is defined but never used

Summary: 20 fixed, 2 remaining
```

### Clean Output (no issues):
```
──── /lint ────
Linter: Biome
Target: src/

✓ No issues found
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "It's just a style warning, not a real issue" | Style inconsistency makes code harder to read for every future developer. Fix it. |
| "I'll fix lint errors when I have time" | Lint errors accumulate. 5 today become 50 next week. Fix them now. |
| "Auto-fix might change behavior" | Lint auto-fixes (formatting, imports) are safe. If unsure, review the diff. |
| "My code works, lint doesn't matter" | Lint catches bugs too (unused vars, implicit any, unreachable code). It matters. |

## Rules

1. **Always auto-fix first** - Run with --fix/--write before reporting
2. **Detect, don't assume** - Check which linter is installed
3. **Format after lint** - Linter first, formatter second (if separate)
4. **Report remaining** - Only show issues that need manual intervention
5. **Never install linters** - Use what's already in the project
