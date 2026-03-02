---
name: debug
description: "Use when encountering any bug, test failure, unexpected behavior, or error - before proposing fixes. Use especially when previous fix attempts have failed."
user-invocable: true
argument-hint: "[error message or bug description]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /debug - Systematic Debugging

Investigate and fix the bug using 4-phase methodology.

**Target:** $ARGUMENTS

## The 4 Phases

```
Phase 1      Phase 2       Phase 3        Phase 4
┌────────┐  ┌─────────┐  ┌───────────┐  ┌───────────┐
│ GATHER │─►│ ANALYZE │─►│ FORMULATE │─►│ IMPLEMENT │
│Evidence│  │ Patterns│  │ Hypothesis│  │  & Prove  │
└────────┘  └─────────┘  └───────────┘  └───────────┘
```

## Workflow

### Phase 1: GATHER EVIDENCE

1. **Read the error completely:**
   - Full error message
   - Stack trace
   - File and line numbers

2. **Reproduce the bug:**
   - Document exact steps
   - Confirm reproducible

3. **Check recent changes:**
   ```bash
   git log --oneline -10
   git diff HEAD~3
   ```

4. **Search for related code:**
   ```bash
   grep -r "error message" .
   ```

**Output:**
```markdown
## Evidence

Error: [full message]
Location: [file:line]
Stack trace: [trace]

Reproduction:
1. [step]
2. [step]
3. Error occurs

Recent changes:
- [commit]: [relevant change]
```

**BLOCKED** until evidence collected.

### Phase 2: ANALYZE PATTERNS

1. **Trace execution path:**
   - Entry point → Error location
   - Data flow through system

2. **Compare with working code:**
   - Find similar code that works
   - Identify differences

3. **Identify patterns:**
   - Consistent or intermittent?
   - Data-dependent?
   - Timing-dependent?

**Output:**
```markdown
## Analysis

Execution: [entry] → [fn1] → [fn2] → [error]

Working vs Broken:
| Aspect | Working | Broken |
|--------|---------|--------|
| [X]    | [value] | [value]|

Patterns:
- [pattern 1]
- [pattern 2]
```

**BLOCKED** until patterns identified.

### Phase 3: FORMULATE HYPOTHESIS

1. **Generate hypotheses:**
   - Multiple, not just one
   - Based on evidence

2. **Rank by probability:**
   - Which fits all evidence?
   - Simplest explanation?

3. **Design tests:**
   - How to prove/disprove each?

**Output:**
```markdown
## Hypotheses

H1: [most likely] (80%)
  Evidence for: [...]
  Test: [how to verify]

H2: [second option] (15%)
  Test: [how to verify]
```

**BLOCKED** until hypotheses formulated.

### Phase 4: IMPLEMENT & PROVE

1. **Test primary hypothesis:**
   - Execute minimal test
   - Capture output

2. **If confirmed:**
   - Write test that reproduces bug
   - Implement fix
   - Verify test passes

3. **If rejected:**
   - Test next hypothesis

4. **Create checkpoint:**
   ```bash
   git add -A && git commit -m "fix: [description]"
   git tag checkpoint/bugfix-[name]
   ```

**Output:**
```markdown
## Resolution

Hypothesis: H1 - CONFIRMED ✓

Root Cause:
[Clear explanation]

Fix:
```diff
- [old code]
+ [new code]
```

Verification:
- Reproduction test: PASS ✓
- Existing tests: PASS ✓
```

## Three-Strike Rule

After 3 failed hypotheses:
```
⚠️ THREE STRIKES
Re-evaluating understanding of the system.
Looking for deeper architectural issues.
```

## Output

```
──── /debug ────
Bug: [description]

Phase 1: Evidence gathered ✓
Phase 2: Patterns identified ✓
Phase 3: Hypotheses formulated ✓
Phase 4: Fix implemented ✓

──── Debug Summary ────
Root cause: [explanation]
Fix: [what changed]
Checkpoint: checkpoint/bugfix-[name]
Confidence: HIGH
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I know the fix already" | You have a hypothesis, not a fix. Follow the phases. |
| "It's obviously this line" | Obvious fixes that skip investigation create new bugs. |
| "I'll just try this quickly" | Quick fixes without understanding cause regressions. |
| "Too slow to gather evidence" | Debugging without evidence takes 3x longer. |
| "The error message tells me everything" | Error messages are symptoms, not root causes. |

## Rules

1. **Never guess** - Evidence first
2. **Never fix without understanding** - Know the root cause
3. **Never skip phases** - Each prevents blind spots
4. **Always checkpoint** - Fixes must be reversible
