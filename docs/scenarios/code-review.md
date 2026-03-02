# Code Review

::: info Agents: `@reviewer` `@refactor` · Time: 1-5 min per scenario
:::

Real scenarios for reviewing and improving code.

## PR Review {#pr-review}

**Goal:** Review changes before merging.

**Command:**
```
Review the changes in src/modules/auth/
```

**What happens:**
1. Analyzes all changed files
2. Checks spec compliance
3. Checks code quality
4. Checks architecture patterns
5. Provides verdict

**Result:**
```
Review: src/modules/auth/

Spec Compliance: PASS
  ✓ Login functionality works
  ✓ Token refresh implemented
  ✓ Logout clears state

Code Quality: PASS
  ✓ No TypeScript errors
  ✓ Tests pass
  ✓ No console.logs

Architecture: WARN
  ⚠ auth-service.ts:15 - Try/catch should be at boundary, not in service
  ⚠ useAuth.ts:42 - Missing error handling for refresh failure

Verdict: APPROVED WITH NOTES
  Fix the 2 warnings before deploying to production.
```

---

## Architecture Check {#architecture}

**Goal:** Verify code follows architecture patterns.

**Command:**
```
Check architecture of the orders module
```

**What happens:**
1. Reads ARCHITECTURE.md
2. Verifies folder structure
3. Checks layer separation
4. Validates imports

**Result:**
```
Architecture Check: orders module

Structure: PASS
  ✓ types/ contains only type definitions
  ✓ services/ contains only HTTP calls
  ✓ adapters/ contains only transformations

Layer Separation: PASS
  ✓ Components don't import services directly
  ✓ Services don't contain business logic
  ✓ No circular dependencies

Violations: 1 found
  ✗ OrderList.tsx imports ordersService directly
    Should use useOrders hook instead

Overall: 95% compliant
```

---

## Refactor Code {#refactor}

**Goal:** Clean up messy or duplicated code.

**Command:**
```
Refactor src/utils/helpers.ts - it has too many responsibilities
```

**What happens:**
1. Analyzes the file
2. Identifies code smells
3. Suggests refactoring plan
4. Applies changes

**Result:**
```
Analysis: helpers.ts (450 lines)

Issues Found:
  - 15 unrelated functions in one file
  - 3 functions duplicated with slight variations
  - 2 functions over 50 lines

Refactoring Plan:
  1. Extract date functions → utils/date.ts
  2. Extract format functions → utils/format.ts
  3. Extract validation → utils/validation.ts
  4. Merge duplicates
  5. Split long functions

After:
  utils/
  ├── date.ts (45 lines)
  ├── format.ts (60 lines)
  ├── validation.ts (80 lines)
  └── index.ts (re-exports)
```

---

## Security Review {#security-review}

**Goal:** Check for security issues.

**Command:**
```
Review the checkout flow for security issues
```

**What happens:**
1. Checks for OWASP top 10
2. Reviews auth/authz
3. Checks data handling
4. Reviews API security

**Result:**
```
Security Review: Checkout Flow

CRITICAL (fix immediately):
  ✗ checkout-service.ts:25 - Credit card number logged
  ✗ payment-form.tsx:18 - Card data in component state

HIGH:
  ✗ No rate limiting on payment attempts
  ✗ Missing CSRF token on form submission

MEDIUM:
  ⚠ PCI compliance: Card data should never touch your servers
    Use Stripe.js or similar to tokenize client-side

Recommendations:
  1. Remove all card logging
  2. Use payment provider's hosted fields
  3. Add rate limiting (3 attempts per minute)
  4. Add CSRF protection
```

---

## Performance Review {#performance-review}

**Goal:** Find performance bottlenecks.

**Command:**
```
Review the dashboard for performance issues
```

**What happens:**
1. Analyzes component renders
2. Checks data fetching
3. Reviews bundle impact
4. Identifies optimizations

**Result:**
```
Performance Review: Dashboard

Render Issues:
  ⚠ MetricsCard re-renders 12x on data load
    Fix: Wrap with memo, stabilize props

  ⚠ ChartWidget creates new function on every render
    Fix: Use useCallback for event handlers

Data Fetching:
  ⚠ 8 separate API calls on mount
    Fix: Combine into single dashboard endpoint or use parallel queries

  ⚠ No staleTime set - refetches on every focus
    Fix: Add staleTime: 5 * 60 * 1000 (5 min)

Bundle:
  ⚠ chart.js adds 180KB
    Fix: Dynamic import, load only when needed

Estimated Impact:
  - Initial load: 2.4s → 1.1s (-54%)
  - Time to interactive: 3.8s → 2.2s (-42%)
```

---

## Quick Tips

### Scope Your Review

```
# Review everything (slow, expensive)
Review the entire codebase

# Review specific area (fast, focused)
Review src/modules/payments/

# Review recent changes only
Review the files I changed today
```

### Ask Specific Questions

```
# General (less useful)
Review this code

# Specific (more useful)
Review this code for:
- SQL injection vulnerabilities
- Missing error handling
- N+1 query problems
```

### Follow Up

After review:
```
Fix the security issues found in the review
```

---

## Related Scenarios

- [Build Features](/scenarios/build-feature) - Build code to review
- [Debug Issues](/scenarios/debug-issue) - When review finds bugs
- [Security](/scenarios/security) - Deep security audit
