---
name: tdd
description: "Use when implementing any feature or bugfix where correctness matters - before writing implementation code."
user-invocable: true
argument-hint: "[feature or function to implement]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /tdd - Test-Driven Development

Implement the feature using strict TDD methodology.

**Target:** $ARGUMENTS

## Iron Law

```
╔══════════════════════════════════════════════════════════════╗
║  NO IMPLEMENTATION CODE WITHOUT A FAILING TEST FIRST         ║
╚══════════════════════════════════════════════════════════════╝
```

## Workflow

### Cycle Structure

For each behavior to implement:

```
┌───────┐      ┌───────┐      ┌──────────┐
│  RED  │ ───► │ GREEN │ ───► │ REFACTOR │
└───────┘      └───────┘      └──────────┘
```

### Step 1: RED - Write Failing Test

1. **Create/open test file**
2. **Write test for ONE behavior:**
   ```typescript
   it('should [expected behavior] when [condition]', () => {
     // Arrange
     const input = ...;

     // Act
     const result = functionUnderTest(input);

     // Assert
     expect(result).toBe(expected);
   });
   ```
3. **Run test:**
   ```bash
   npm test -- --testNamePattern="[test name]"
   ```
4. **Verify FAILS** - Capture output showing failure
5. **BLOCKED** if test passes (wrong test or code exists)

### Step 2: GREEN - Minimal Implementation

1. **Write minimum code to pass:**
   - No extra features
   - No optimization
   - Just enough to pass

2. **Run test:**
   ```bash
   npm test -- --testNamePattern="[test name]"
   ```
3. **Verify PASSES** - Capture output showing success
4. **BLOCKED** if test fails (fix before continuing)

### Step 3: REFACTOR - Improve

1. **Improve code quality:**
   - Remove duplication
   - Improve naming
   - Simplify logic

2. **Run ALL tests:**
   ```bash
   npm test
   ```
3. **Verify ALL PASS**
4. **Commit cycle:**
   ```bash
   git add -A && git commit -m "feat: [behavior] (TDD cycle N)"
   ```

### Repeat

Continue cycles until feature is complete.

## Verification Protocol

Every test run must be captured:

```
──── RED Phase ────
Test: should calculate discount for valid coupon
Running: npm test -- --testNamePattern="calculate discount"
Output:
  FAIL  src/discount.test.ts
  ✕ should calculate discount for valid coupon
    Expected: 90
    Received: undefined
Status: FAIL ✓ - Proceeding to GREEN

──── GREEN Phase ────
Running: npm test -- --testNamePattern="calculate discount"
Output:
  PASS  src/discount.test.ts
  ✓ should calculate discount for valid coupon
Status: PASS ✓ - Proceeding to REFACTOR
```

## Output

```
──── /tdd ────
Feature: [name]

Cycle #1: [behavior]
  RED:      Test written, FAIL ✓
  GREEN:    Implemented, PASS ✓
  REFACTOR: Cleaned, PASS ✓

Cycle #2: [behavior]
  RED:      Test written, FAIL ✓
  GREEN:    Implemented, PASS ✓
  REFACTOR: Cleaned, PASS ✓

──── TDD Summary ────
Cycles completed: 2
Tests added: 2
All tests passing: ✓
Coverage: [if available]
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "I know it works, no need to test first" | Write the test. If it works, RED phase takes 30 seconds. |
| "This is too simple for TDD" | Simple code has simple tests. No excuse to skip. |
| "I'll write tests after" | Tests written after implementation verify your bias, not correctness. |
| "The test framework isn't set up" | Set it up. That's part of the task. |
| "Just this once I'll skip RED" | "Just this once" is how every shortcut becomes a habit. |

## Rules

1. **Never implement before RED**
2. **Capture all test output** - Proof, not trust
3. **One behavior per test**
4. **Minimal GREEN** - Just enough to pass
5. **Always REFACTOR** - Don't skip
6. **Document each cycle**
