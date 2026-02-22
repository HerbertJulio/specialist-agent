# Skills

Skills are shortcuts you invoke with `/skill-name` inside Claude Code. Each skill is a directory with a `SKILL.md` file inside `.claude/skills/`.

## Development Skills

### /dev-create-module

Creates a complete module scaffold.

```bash
/dev-create-module domains
```

Asks about endpoints and UI type, then delegates to specialized agents to create the full structure.

---

### /dev-create-component

Creates a Vue component with the standard script setup template.

```bash
/dev-create-component DomainsTable
```

Determines location (module vs shared), applies type-based props/emits, enforces < 200 lines.

---

### /dev-create-service

Creates the complete data layer for a resource.

```bash
/dev-create-service domains
```

Creates 4 files: `.types.ts` + `.contracts.ts` + `-adapter.ts` + `-service.ts`

---

### /dev-create-composable

Creates a composable with Vue Query integration.

```bash
/dev-create-composable useDomainsList
```

Templates for queries, mutations, and shared logic.

---

### /dev-create-test

Creates tests for a specified file.

```bash
/dev-create-test src/modules/domains/adapters/domains-adapter.ts
```

**Test priority:**
1. Adapters (highest — pure functions, easy to test)
2. Composables (mock service approach)
3. Components (@vue/test-utils)

---

### /dev-generate-types

Generates types, contracts, and adapter from an endpoint or JSON response.

```bash
/dev-generate-types /v4/domains
```

Handles snake_case → camelCase conversion and creates both inbound and outbound adapters.

---

## Review Skills

### /review-review

Full code review against `ARCHITECTURE.md`.

```bash
/review-review
# Or scoped:
/review-review src/modules/marketplace/
```

Runs automated checks (`tsc`, `eslint`, `vitest`, `build`) and manual review. Produces a report with severity levels.

**Verdict:** ✅ Approved | ⚠️ With caveats | ❌ Requires changes

---

### /review-check-architecture

Runs 14 automated conformance checks:

```bash
/review-check-architecture marketplace
```

| # | Check |
|---|-------|
| 1 | Services without try/catch |
| 2 | Services without transformations |
| 3 | Components with script setup |
| 4 | Components with TypeScript |
| 5 | No Options API |
| 6 | No Mixins |
| 7 | No server state in Pinia |
| 8 | storeToRefs usage |
| 9 | No `any` types |
| 10 | No cross-module imports |
| 11 | No v-html |
| 12 | No debug artifacts (console.log, debugger) |
| 13 | Queries have staleTime |
| 14 | Components ≤ 200 lines |

---

### /review-fix-violations

Finds and auto-fixes architecture violations.

```bash
/review-fix-violations marketplace
```

Fixes by priority: 🔴 Critical → 🟡 Important → 🟢 Improvements. Validates after each fix.

---

## Migration Skills

### /migration-migrate-component

Migrates a component from Options API to script setup.

```bash
/migration-migrate-component src/views/OldPage.vue
```

Analyzes current structure, maps consumers, converts to full TypeScript, decomposes if > 200 lines.

---

### /migration-migrate-module

Migrates an entire module through 6 phases.

```bash
/migration-migrate-module src/views/marketplace/
```

Delegates to `@migrator`. Includes approval gates between phases.

---

## Documentation Skills

### /docs-onboard

Quick module summary for developer onboarding.

```bash
/docs-onboard marketplace
```

Lists endpoints, main components, shows Pinia vs Vue Query separation, flags non-standard patterns. Target: understand a module in 2 minutes.
