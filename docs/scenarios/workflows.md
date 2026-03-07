# Multi-Agent Workflows

::: info Agents: `@orchestrator` `@executor` `@planner` · Complexity: Medium-High
:::

Real-world workflow examples showing how multiple agents coordinate to deliver complete features.

## Startup MVP Sprint (1 week) {#startup-mvp}

**Goal:** Build a SaaS MVP with auth, dashboard, and billing.

**Agents involved:** `@planner` → `@starter` → `@orchestrator` → `@builder` × 3 → `@tester` → `@reviewer`

### Workflow

```
Day 1: Planning & Setup
──────────────────────

User: /plan Build a SaaS MVP with user auth, dashboard, and Stripe billing

  @planner analyzes requirements
  → Produces COMPLEX plan with 12 tasks

User: Create the project

  @starter scaffolds project
  → Frontend (React/Vue) + Backend (Node.js) + Database (PostgreSQL)
  → Installs Specialist Agent agents and skills

Day 2-3: Parallel Build
────────────────────────

User: @orchestrator Execute the plan

  @orchestrator decomposes into 3 parallel streams:

  Stream 1: @builder (Auth)
  ├── User model + migration
  ├── JWT auth middleware
  ├── Login/Register endpoints
  └── Auth composable/hook

  Stream 2: @builder (Dashboard)
  ├── Dashboard layout
  ├── Stats service + adapter
  ├── Chart components
  └── Dashboard page

  Stream 3: @builder (Billing)
  ├── Stripe integration service
  ├── Subscription plans
  ├── Checkout flow
  └── Webhook handler

  Handoff: @orchestrator merges all streams
  → Runs integration tests
  → Creates checkpoint

Day 4: Testing & Review
───────────────────────

User: @tester Create test strategy for the MVP

  @tester designs testing pyramid:
  → 70% unit tests (services, adapters)
  → 20% integration tests (API endpoints)
  → 10% E2E tests (auth flow, checkout flow)

User: @reviewer Review all changes

  @reviewer runs unified 3-in-1 review:
  → Spec Compliance: PASS
  → Code Quality: B+ (minor improvements suggested)
  → Architecture Fit: PASS

Day 5: Polish & Deploy
──────────────────────

User: @devops Set up CI/CD pipeline

  @devops creates:
  → GitHub Actions workflow
  → Docker Compose for local dev
  → Deployment config
```

### Cost Estimate

```
@planner:       ~3,000 tokens
@starter:       ~8,000 tokens
@orchestrator:  ~5,000 tokens
@builder × 3:  ~45,000 tokens
@tester:       ~12,000 tokens
@reviewer:      ~8,000 tokens
@devops:        ~6,000 tokens
─────────────────────────────
Total:         ~87,000 tokens (~$1.30)
```

---

## Landing Page Sprint (1 day) {#landing-page}

**Goal:** Design and build a complete landing page in one day.

**Agents involved:** `@designer` → `@builder` × 2 → `@perf` → `@reviewer`

### Workflow

```
Morning: Design & Setup (9:00 - 11:00)
───────────────────────────────────────

User: @designer Create a design system for our landing page

  @designer produces:
  → Color palette, typography, spacing tokens
  → Component inventory (Hero, Features, Pricing, CTA, Footer)
  → Responsive breakpoints
  → Accessibility requirements (WCAG 2.1 AA)

Midday: Parallel Build (11:00 - 15:00)
──────────────────────────────────────

User: @orchestrator Build the landing page sections in parallel

  @orchestrator assigns:

  @builder-1 (Above the fold):
  ├── Hero section with CTA
  ├── Social proof / logos
  └── Feature highlights

  @builder-2 (Below the fold):
  ├── Detailed features grid
  ├── Pricing table
  ├── FAQ accordion
  └── Footer with links

  Handoff: Merge + verify responsive behavior

Afternoon: Optimize & Ship (15:00 - 17:00)
──────────────────────────────────────────

User: @perf Optimize the landing page for Core Web Vitals

  @perf analyzes:
  → Image optimization (WebP, lazy loading)
  → Bundle size (code splitting, tree shaking)
  → Font loading strategy (font-display: swap)
  → CLS fixes (explicit dimensions)

User: @reviewer Final review

  @reviewer verdict: Approved
  → Performance: A (LCP < 2.5s)
  → Accessibility: A (WCAG 2.1 AA compliant)
  → SEO: Meta tags, structured data, sitemap
```

---

## Bug Investigation & Fix (2 hours) {#bug-fix}

**Goal:** Investigate a production bug, find root cause, fix, and verify.

**Agents involved:** `@doctor` → `@debugger` → `@builder` → `@tester` → `@reviewer`

### Workflow

```
Phase 1: Diagnosis (30 min)
───────────────────────────

User: Users report "Payment failed" errors intermittently

  @doctor runs 4-phase diagnosis:
  Phase 1 - Symptoms: Error logs show Stripe webhook 500s
  Phase 2 - Hypotheses:
    H1: Race condition in webhook handler
    H2: Idempotency key not set
    H3: Database transaction timeout
  Phase 3 - Evidence:
    → Logs show duplicate webhook events
    → Handler processes same event twice
    → Second processing fails on unique constraint
  Phase 4 - Root Cause: Missing idempotency check

Phase 2: Fix (30 min)
─────────────────────

User: @builder Fix the webhook handler

  @builder implements:
  → Add idempotency key check
  → Add database transaction wrapping
  → Add structured logging for webhook events
  → Add retry logic with exponential backoff

Phase 3: Verify (30 min)
────────────────────────

User: @tester Write tests for the fix

  @tester creates:
  → Unit test: idempotency check
  → Integration test: duplicate webhook handling
  → Edge case: concurrent webhook processing

User: /verify all

  /verify output:
  → Tests: 47/47 passing (3 new)
  → TypeScript: 0 errors
  → Build: success

Phase 4: Review (30 min)
────────────────────────

User: @reviewer Review the fix

  @reviewer verdict: Approved
  → Security: A (proper input validation)
  → Fix addresses root cause, not symptoms
  → Observability: structured logging added
```

---

## Migration Project (1-2 weeks) {#migration}

**Goal:** Migrate a legacy Vue 2 Options API app to Vue 3 Composition API.

**Agents involved:** `@scout` → `@planner` → `@orchestrator` → `@migrator` × N → `@tester` → `@reviewer`

### Workflow

```
Week 1: Analysis & Planning
────────────────────────────

User: @scout Analyze the current codebase

  @scout produces inventory:
  → 45 components (38 Options API, 7 already Composition)
  → 12 mixins (need conversion to composables)
  → 8 Vuex modules (need migration to Pinia)
  → 6 filters (need conversion to functions)
  → Dependency audit: 3 packages need Vue 3 alternatives

User: /plan Migrate the entire app to Vue 3 Composition API

  @planner produces COMPLEX plan:
  → Phase 1: Infrastructure (Vue 3, Vite, Pinia)
  → Phase 2: Shared code (mixins → composables, filters)
  → Phase 3: Components (batch migration, 5/day)
  → Phase 4: Testing (update all tests)
  → Phase 5: Cleanup (remove Vue 2 compatibility)

Week 2: Execution
──────────────────

User: @orchestrator Execute the migration plan

  @orchestrator coordinates:

  Day 1: @migrator - Infrastructure migration
  Day 2: @migrator × 2 - Mixins → Composables (parallel)
  Day 3-4: @migrator × 3 - Components (batches of 5)
  Day 5: @tester - Update all tests
  Final: @reviewer - Full codebase review

  Handoff template used at each phase boundary:
  → QA PASS / QA FAIL with evidence
  → Context transfer to next phase agent
```

---

## Multi-Domain Feature (3-5 days) {#multi-domain}

**Goal:** Add a referral system with frontend, backend, database, and notifications.

**Agents involved:** `@analyst` → `@planner` → `@data` → `@api` → `@orchestrator` → `@builder` × 2 → `@tester` → `@security` → `@reviewer`

### Workflow

```
Day 1: Requirements & Design
─────────────────────────────

User: @analyst Define requirements for a referral system

  @analyst produces spec:
  → User stories (referrer, referee)
  → Business rules (reward tiers, limits)
  → Acceptance criteria per story
  → Edge cases (self-referral, expired links)

User: @data Design the database schema

  @data produces:
  → referral_codes table
  → referral_events table
  → reward_transactions table
  → Indexes and constraints
  → Migration script

User: @api Design the API endpoints

  @api produces:
  → POST /api/referrals/generate
  → GET /api/referrals/:code
  → POST /api/referrals/redeem
  → GET /api/referrals/stats
  → OpenAPI spec

Day 2-3: Build
───────────────

User: @orchestrator Build the referral system

  @orchestrator assigns parallel streams:

  @builder-1 (Backend):
  ├── Referral service
  ├── Reward calculation
  ├── Email notifications
  └── API endpoints

  @builder-2 (Frontend):
  ├── Referral dashboard
  ├── Share/invite component
  ├── Reward history
  └── Referral link handler

Day 4: Security & Testing
──────────────────────────

User: @security Audit the referral system

  @security checks:
  → Rate limiting on code generation
  → Referral code entropy (not guessable)
  → Reward abuse prevention
  → Input validation on all endpoints

User: @tester Create comprehensive tests

  @tester creates:
  → Unit: reward calculation, code generation
  → Integration: full referral flow
  → E2E: invite → signup → reward

Day 5: Review & Ship
─────────────────────

User: @reviewer Review the entire referral system

  @reviewer unified 3-in-1:
  → Spec: All user stories implemented
  → Quality: A- (one minor improvement)
  → Architecture: Follows ARCHITECTURE.md
  → Verdict: Approved
```

## Tips for Multi-Agent Workflows

1. **Always start with `/plan`** - Even if you think you know the scope
2. **Use `@orchestrator` for 3+ agents** - Don't manually coordinate
3. **Checkpoints are mandatory** - Every phase boundary gets a checkpoint
4. **Handoff templates** - Use structured handoffs between agents
5. **Verify at each boundary** - Run `/verify` before moving to next phase
6. **Cost tracking** - Use `/estimate` before expensive operations
