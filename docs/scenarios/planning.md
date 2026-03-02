# Planning

::: info Agents: `@planner` `@analyst` · Time: 5-10 min per scenario
:::

Real scenarios for planning features and projects.

## Plan a Feature {#feature}

**Goal:** Plan a user authentication feature.

**Command:**
```
/plan add user authentication with JWT and social login
```

**What happens:**
1. **Assess** - Evaluates complexity (S/M/L/XL)
2. **Decompose** - Breaks into phases and tasks
3. **Estimate** - Token cost per phase
4. **Output** - Structured plan with checkpoints

**Result:**
```
Plan: User Authentication

COMPLEXITY: L (multi-module, external integrations)

PHASE 1 - Core Auth (estimated: ~5k tokens)
  ☐ User model with password hashing
  ☐ JWT token generation and validation
  ☐ Login / Register endpoints
  ☐ Auth middleware
  CHECKPOINT: Basic auth working

PHASE 2 - Social Login (estimated: ~3k tokens)
  ☐ OAuth2 flow (Google, GitHub)
  ☐ Account linking
  ☐ Profile sync
  CHECKPOINT: Social login working

PHASE 3 - Security Hardening (estimated: ~2k tokens)
  ☐ Rate limiting on auth endpoints
  ☐ Refresh token rotation
  ☐ Password reset flow
  ☐ Session management
  CHECKPOINT: Security audit pass

TOTAL: ~10k tokens across 3 phases
```

---

## Plan a Refactor {#refactor}

**Goal:** Plan a large-scale refactoring.

**Command:**
```
/plan refactor the payments module to use the strategy pattern
```

**Result:**
```
Plan: Payments Refactor

COMPLEXITY: M (single module, pattern change)

CURRENT STATE
  - 800-line PaymentService with if/else chains
  - 4 payment providers mixed in one file
  - No interface abstraction

TARGET STATE
  - PaymentStrategy interface
  - StripeStrategy, PayPalStrategy, etc.
  - PaymentService delegates to strategy
  - Easy to add new providers

PHASE 1 - Extract Interface (estimated: ~2k tokens)
  ☐ Define PaymentStrategy interface
  ☐ Create StripeStrategy
  ☐ Create PayPalStrategy
  CHECKPOINT: Strategies compile

PHASE 2 - Refactor Service (estimated: ~2k tokens)
  ☐ PaymentService uses strategy map
  ☐ Remove if/else chains
  ☐ Factory for strategy selection
  CHECKPOINT: All tests pass

PHASE 3 - Verify (estimated: ~1k tokens)
  ☐ Run existing tests (no behavior change)
  ☐ Add tests for new strategies
  ☐ Code review with @reviewer
  CHECKPOINT: Review approved

TOTAL: ~5k tokens across 3 phases
```

---

## Plan a Migration {#migration}

**Goal:** Plan a framework migration.

**Command:**
```
/plan migrate the frontend from React to Vue 3
```

**Result:**
```
Plan: React → Vue 3 Migration

COMPLEXITY: XL (full frontend rewrite)

PHASE 1 - Setup (estimated: ~1k tokens)
  ☐ Vue 3 project setup alongside React
  ☐ Shared API layer (framework-agnostic)
  ☐ Pinia stores matching Redux state
  CHECKPOINT: Vue app boots

PHASE 2 - Core Pages (estimated: ~8k tokens)
  ☐ Layout components (header, sidebar, footer)
  ☐ Dashboard page
  ☐ Login / Register pages
  ☐ Router setup with guards
  CHECKPOINT: Core navigation working

PHASE 3 - Feature Pages (estimated: ~10k tokens)
  ☐ Product listing + detail
  ☐ Cart + checkout
  ☐ User profile + settings
  ☐ Admin panel
  CHECKPOINT: Feature parity

PHASE 4 - Polish (estimated: ~3k tokens)
  ☐ E2E tests with Playwright
  ☐ Performance audit with @perf
  ☐ Accessibility check
  ☐ Remove React dependencies
  CHECKPOINT: Production ready

TOTAL: ~22k tokens across 4 phases
RECOMMENDATION: Execute phase by phase with /checkpoint between each
```

---

## Quick Tips

### Be Specific

```
# Vague (generic plan)
/plan add authentication

# Specific (detailed plan)
/plan add JWT authentication with Google OAuth,
refresh token rotation, and rate limiting
```

### Plan Before Building

```
# 1. Plan
/plan add payment processing with Stripe

# 2. Review the plan, adjust if needed

# 3. Execute
Use @executor to implement the payment plan
```

---

## Related Scenarios

- [Build Features](/scenarios/build-feature) - Execute the plan
- [Code Review](/scenarios/code-review) - Review planned changes
- [Migration](/scenarios/migration) - Plan large migrations
