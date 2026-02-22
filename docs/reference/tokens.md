# Token Usage

Each operation has a different token cost depending on complexity. Use this table to estimate usage.

## Full Agents (Sonnet/Opus)

| Operation | Tokens | Notes |
|-----------|--------|-------|
| `/dev-create-component` | ~3-5k | Single component |
| `/dev-create-service` | ~5-8k | 4 files (types + contracts + adapter + service) |
| `/dev-create-composable` | ~3-5k | Single composable |
| `/dev-create-test` | ~3-8k | Depends on file complexity |
| `/dev-create-module` | ~15-25k | Full module scaffold |
| `/dev-generate-types` | ~3-5k | Types + contracts + adapter |
| `/review-check-architecture` | ~5-10k | Automated checks |
| `/review-review` | ~8-15k | Full review with automated + manual |
| `/review-fix-violations` | ~5-15k | Depends on violation count |
| `/docs-onboard` | ~3-5k | Module summary |
| `/migration-migrate-component` | ~5-10k | Single component migration |
| `/migration-migrate-module` | ~30-80k | Full module migration (6 phases) |
| `@doctor` (bug) | ~5-15k | Depends on bug complexity |

## Lite Agents (Haiku)

Lite agents use `model: haiku` — significantly cheaper per token.

| Operation | Tokens | Savings vs Full |
|-----------|--------|-----------------|
| Component scaffold | ~2-3k | ~50% |
| Service layer | ~3-5k | ~40% |
| Code review | ~3-5k | ~55% |
| Module scaffold | ~5-10k | ~55% |
| Bug investigation | ~2-5k | ~50% |

::: tip Cost Optimization
- Use **Lite agents** for rapid iteration and simple tasks
- Use **Full agents** for new modules, PRs, and complex migrations
- For large modules, migrate incrementally — one component at a time with `/migration-migrate-component` instead of the full module migration
:::
