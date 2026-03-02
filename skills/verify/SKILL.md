---
name: verify
description: "Use when about to claim work is complete, fixed, or passing - before committing, creating PRs, or moving to next task. Requires running verification commands and confirming output before making any success claims."
user-invocable: true
argument-hint: "[test|build|lint|all]"
allowed-tools: Bash, Read, Glob, Grep
---

# /verify - Verification Before Completion

Evidence before claims. Always.

**Target:** $ARGUMENTS

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in THIS message, you cannot claim it passes.

**Violating the letter of this rule is violating the spirit of this rule.**

## When to Use

- Before committing code
- Before creating a pull request
- Before marking a task as complete
- Before moving to the next task in a plan
- After fixing a bug (prove it's actually fixed)
- NOT for: research or exploration tasks

## The Gate Function

```
BEFORE claiming any status:

1. IDENTIFY - What command proves this claim?
2. RUN - Execute the FULL command (fresh, complete, not cached)
3. READ - Full output, check exit code, count failures
4. VERIFY - Does output ACTUALLY confirm the claim?
   → If NO: State actual status with evidence
   → If YES: State claim WITH the evidence
5. ONLY THEN - Make the claim

Skip any step = lying, not verifying.
```

## Verification Matrix

| Claim | Required Command | NOT Sufficient |
|-------|-----------------|----------------|
| "Tests pass" | `npm test` output: 0 failures | Previous run, "should pass" |
| "Lint clean" | `npm run lint` output: 0 errors | "I fixed the warning" |
| "Build succeeds" | `npm run build` exit code 0 | "Lint passed so build should too" |
| "Bug fixed" | Test that reproduces bug: PASS | "Code changed, should work" |
| "Types correct" | `npx tsc --noEmit` exit code 0 | "I added the types" |
| "No regressions" | Full test suite: 0 failures | "Only changed one file" |
| "Requirements met" | Line-by-line checklist verified | "Tests pass" |

## Operations

### /verify test
```bash
npm test 2>&1
# Read FULL output
# Count: X passed, Y failed, Z skipped
# Exit code: 0 or non-zero
```

### /verify build
```bash
npm run build 2>&1
# Check: exit code 0?
# Check: no error output?
```

### /verify lint
```bash
npm run lint 2>&1
# Count: 0 errors, 0 warnings
```

### /verify types
```bash
npx tsc --noEmit 2>&1
# Count: 0 errors
```

### /verify all
Run ALL of the above in sequence. Stop at first failure.

### /verify (no args)
Auto-detect what to verify based on package.json scripts.

## Output

```
──── /verify ────
Command: npm test
Exit code: 0
Result: 42/42 tests passed, 0 failed

VERIFIED ✓ - All tests pass (evidence above)
```

Or:

```
──── /verify ────
Command: npm test
Exit code: 1
Result: 40/42 tests passed, 2 failed

FAILED ✗ - 2 tests failing:
  - src/auth.test.ts: "should validate token" - Expected true, got false
  - src/user.test.ts: "should create user" - Timeout after 5000ms

DO NOT claim completion. Fix failures first.
```

## Red Flags - STOP

If you catch yourself thinking:
- "Should work now"
- "I'm confident this is correct"
- "Just this once I can skip verification"
- "Lint passed, so build will too"
- "I only changed one line"
- "The agent said it succeeded"
- "I'll verify after committing"
- "It's obvious this works"

**ALL of these mean: RUN THE COMMAND. READ THE OUTPUT.**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence is not evidence |
| "Just this once" | No exceptions, ever |
| "Lint passed" | Lint is not build is not test |
| "Agent said success" | Verify independently |
| "I only changed a comment" | Comments can break builds (JSX, directives) |
| "Previous run passed" | State changed since then. Run again. |
| "Partial check is enough" | Partial proves nothing |
| "Too slow to run full suite" | Slow verification beats fast regression |

## Integration

This skill is a **cross-cutting concern**. It applies to:
- @builder - Before claiming module is complete
- @executor - Before marking task checkpoint
- @tdd - Before claiming GREEN phase
- @reviewer - Before giving verdict
- @debugger - Before claiming bug is fixed
- @migrator - Before claiming migration is complete

## Rules

1. **Evidence before claims** - Non-negotiable
2. **Fresh runs only** - Never cite previous runs
3. **Full output** - Don't truncate or summarize
4. **Exit codes matter** - 0 = success, anything else = failure
5. **Read warnings** - Warnings can indicate real problems
6. **One claim per verification** - Don't bundle claims
