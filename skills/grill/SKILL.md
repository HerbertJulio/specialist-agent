---
name: grill
description: "Use when you want to stress-test code by having an adversarial reviewer try to break it - finding edge cases, security holes, race conditions, and logical flaws that normal reviews miss."
user-invocable: true
argument-hint: "[path, function, or module to grill]"
allowed-tools: Read, Bash, Glob, Grep
---

# /grill - Adversarial Code Challenge

Stress-test code by systematically trying to break it - finding edge cases, security holes, race conditions, and logical flaws that normal code reviews miss. This is not a review; this is an attack.

**Target:** $ARGUMENTS

## When to Use

- Before deploying critical code (auth, payments, data handling)
- After writing complex business logic
- When code handles user input or external data
- Before security audits (find issues first)
- When you suspect a function has hidden edge cases
- After fixing a bug (verify the fix doesn't break under stress)
- NOT for: general code quality (use `/codereview`)
- NOT for: architecture assessment (use `@architect`)
- NOT for: test creation (use `/tdd` - but grilling findings feed into test cases)

## Iron Rule

```
╔══════════════════════════════════════════════════════════════╗
║  ASSUME THE CODE IS BROKEN UNTIL PROVEN OTHERWISE            ║
║  Your job is to find HOW, not to confirm it works.           ║
╚══════════════════════════════════════════════════════════════╝
```

## Workflow

### Step 1: Target Analysis

1. **Read the target code** completely
2. **Understand the contract:**
   - What are the expected inputs? (types, ranges, formats)
   - What are the expected outputs?
   - What side effects does it have? (DB writes, API calls, file I/O)
   - What invariants should always hold?
3. **Identify trust boundaries:**
   - Where does external data enter?
   - Where does the code trust input without validation?
   - Where are type assertions or casts used?

```bash
# Read the target
cat $TARGET 2>/dev/null || find . -name "$TARGET*" -not -path "*/node_modules/*" | head -5

# Find type assertions and unsafe casts
grep -rn "as any\|as unknown\|! \|!\.\|@ts-ignore\|@ts-expect-error" $TARGET --include="*.ts" --include="*.tsx" 2>/dev/null | head -15
```

**Output:**
```markdown
## Target Profile
- **Function/Module:** [name]
- **Contract:** [inputs → outputs]
- **Side effects:** [DB, API, file, state]
- **Trust boundaries:** [where external data enters]
- **Unsafe patterns:** [casts, assertions, ignores]
```

**BLOCKED** until target is fully understood.

### Step 2: Attack Vector Execution

Systematically attack across 5 categories:

---

**Category 1: Input Attacks**

Try to break the code with unexpected inputs:

| Attack | Input | Expected Failure |
|--------|-------|-----------------|
| Null/undefined | `null`, `undefined` | TypeError, crash |
| Empty values | `""`, `[]`, `{}`, `0` | Logic error, empty result |
| Type coercion | `"0"`, `"false"`, `"null"` | Truthy/falsy confusion |
| Boundary values | `Number.MAX_SAFE_INTEGER`, `-1`, `0.1 + 0.2` | Overflow, off-by-one, float precision |
| Long strings | `"a".repeat(1_000_000)` | Memory exhaustion, buffer overflow |
| Special characters | `<script>`, `'; DROP TABLE`, `../../../etc/passwd` | XSS, SQL injection, path traversal |
| Unicode edge cases | `"é"`, `"🚀"`, `"\u0000"`, RTL text | Encoding errors, display corruption |
| Nested data | Deeply nested objects (100+ levels) | Stack overflow, infinite recursion |
| Prototype pollution | `{"__proto__": {"admin": true}}` | Privilege escalation |

---

**Category 2: State Attacks**

Try to break the code through state manipulation:

| Attack | Scenario | Expected Failure |
|--------|----------|-----------------|
| Concurrent calls | Same function called simultaneously | Race condition, double write |
| Out-of-order execution | Step 3 before step 1 | Undefined behavior |
| Stale state | Use cached/old data with new logic | Inconsistency |
| State pollution | Shared mutable state across calls | Side effect leaks |
| Re-entrance | Function calls itself indirectly | Infinite loop, deadlock |

---

**Category 3: Boundary Attacks**

Try to exploit boundaries:

| Attack | Scenario | Expected Failure |
|--------|----------|-----------------|
| Off-by-one | First/last element, array[length] | IndexError, missing data |
| Empty collection | `[]`, empty Map/Set | Unexpected behavior on .map(), .reduce() |
| Single item | Array of 1, Map with 1 entry | Logic that assumes >1 items |
| Max limits | Max array size, max string length | Performance degradation |
| Pagination edges | Page 0, page -1, page past end | Error or empty result |

---

**Category 4: Logic Attacks**

Try to find logical flaws:

| Attack | Scenario | Expected Failure |
|--------|----------|-----------------|
| Contradictory inputs | `{min: 10, max: 5}` | No validation, unexpected range |
| Impossible states | Admin + banned, published + draft | State machine violation |
| Circular references | Object referencing itself | Stack overflow, infinite loop |
| Time-dependent logic | Timezone differences, DST, leap year | Wrong date calculations |
| Floating point | `0.1 + 0.2 !== 0.3` | Financial calculation errors |

---

**Category 5: Error Path Attacks**

Try to trigger every error path:

| Attack | Scenario | Expected Failure |
|--------|----------|-----------------|
| Network failure | API returns 500, timeout, DNS failure | Unhandled rejection, crash |
| Permission denied | File system, database, API auth | Silent failure, data loss |
| Resource exhaustion | Disk full, memory full, connection pool exhausted | Crash without graceful degradation |
| Partial failure | 3 of 5 batch operations fail | Inconsistent state |
| Corrupted data | Invalid JSON, truncated response, wrong encoding | Parse error, crash |

### Step 3: Exploitation Report

For each vulnerability found:

```markdown
### Vulnerability [N]: [Title]

**Category:** [Input | State | Boundary | Logic | Error Path]
**Severity:** CRITICAL | HIGH | MEDIUM | LOW
**Location:** [file:line]

**Attack:**
```
[exact input or scenario that triggers the bug]
```

**Expected behavior:** [what should happen]
**Actual behavior:** [what actually happens]
**Impact:** [data loss | crash | security breach | incorrect result | performance degradation]

**Proof:** [how to reproduce]
**Fix:** [specific code change to prevent this]
```

### Step 4: Hardening Recommendations

For each vulnerability, provide a concrete fix:

| Pattern | Fix |
|---------|-----|
| Missing null check | Add guard clause or optional chaining |
| No input validation | Add Zod/Yup schema validation at boundary |
| Race condition | Add mutex, optimistic locking, or idempotency |
| Injection vulnerability | Parameterized queries, input sanitization |
| Missing error handling | Add try/catch with specific error types |
| Unsafe type assertion | Replace `as` with runtime type guard |

### Step 5: Resilience Score

Rate the target on a 0-10 scale:

| Score | Rating | Meaning |
|-------|--------|---------|
| 9-10 | Fortress | Battle-hardened, handles all attack categories |
| 7-8 | Solid | Handles most attacks, minor edge case gaps |
| 5-6 | Average | Common attacks handled, but gaps in 1-2 categories |
| 3-4 | Fragile | Multiple attack categories succeed |
| 0-2 | Vulnerable | Critical flaws, immediate fixes needed |

**Formula:** Start at 10, subtract points per vulnerability:
- CRITICAL: -3 points
- HIGH: -2 points
- MEDIUM: -1 point
- LOW: -0.5 points (minimum score: 0)

## Verification Protocol

**Before claiming the grill is complete:**

1. All 5 attack categories were tested (input, state, boundary, logic, error path)
2. Every vulnerability has a severity level and file:line reference
3. Every vulnerability has a proof (reproducible attack)
4. Every vulnerability has a concrete fix recommendation
5. Resilience score was calculated using the formula
6. At least 10 distinct attacks were attempted across all categories
7. Type assertions and unsafe patterns were specifically targeted

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "The tests already cover edge cases" | Tests cover what you thought of. Grilling covers what you didn't. Testers think in happy paths; attackers think in failure modes. |
| "It's internal code, nobody will send bad input" | Internal code today becomes API tomorrow. Internal doesn't mean safe. One refactor exposes it. |
| "We validate at the API layer" | Defense in depth. If the API layer has a bug, what stops the attack downstream? |
| "Edge cases are rare in production" | Rare cases cause production incidents. Murphy's law is not optional. The rarer the case, the less likely you tested it. |
| "This is overkill for a simple function" | Simple functions in critical paths (auth, payments, data) deserve maximum scrutiny. Simplicity doesn't equal safety. |
| "TypeScript prevents these issues" | TypeScript prevents type errors at compile time. It doesn't prevent logic errors, race conditions, or injection attacks at runtime. |
| "Nobody would actually try this" | Automated scanners, fuzzing tools, and malicious actors try exactly these attacks. If you don't, they will. |

## Rules

1. **Assume broken** - Your job is to break the code, not validate it
2. **All 5 categories** - Never skip an attack category
3. **Proof required** - Every vulnerability needs a reproducible attack scenario
4. **Read-only** - Never modify files during a grill (fixes come after)
5. **No false positives** - Only report vulnerabilities you can prove
6. **Severity justified** - Every rating needs a specific impact description
7. **Fix included** - Every vulnerability includes a concrete remediation
8. **Target scope** - Only grill the specified target, don't drift to other files
9. **Type assertions are targets** - Every `as`, `!`, and `@ts-ignore` is suspicious until proven safe
10. **Score is mechanical** - Follow the formula, no subjective adjustments

## Output

```
──── /grill ────
Target: $ARGUMENTS
Contract: [inputs → outputs]
Trust boundaries: [N identified]

Attacks Attempted: [N]
  Input:    [N attempted] → [N succeeded]
  State:    [N attempted] → [N succeeded]
  Boundary: [N attempted] → [N succeeded]
  Logic:    [N attempted] → [N succeeded]
  Error:    [N attempted] → [N succeeded]

Vulnerabilities Found: [N]
  CRITICAL: N
  HIGH: N
  MEDIUM: N
  LOW: N

Top Vulnerabilities:
1. [CRITICAL] [description] - [file:line]
2. [HIGH] [description] - [file:line]
3. [HIGH] [description] - [file:line]

Resilience Score: [N]/10 ([rating])

──── Grill complete ────
```
