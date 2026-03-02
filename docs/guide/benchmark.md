# Performance & Cost

## Token Efficiency

### Adaptive Planning

Tasks are planned based on complexity:

| Task Type | Planning | Tokens |
|-----------|----------|--------|
| Fix typo | Skip | ~200 |
| Add field | Quick plan | ~500 |
| New module | Full plan | ~5,000 |

Simple tasks skip unnecessary planning.

### Unified Review

One agent handles three review types:

1. **Spec compliance** - Does it meet requirements?
2. **Code quality** - Is it clean and tested?
3. **Architecture fit** - Does it follow patterns?

Single pass = fewer tokens.

### Cost Scaling

| Tasks | Tokens | Est. Cost |
|-------|--------|-----------|
| 1 | ~5k | ~$0.08 |
| 2 | ~10k | ~$0.15 |
| 3 | ~15k | ~$0.23 |
| 4 | ~20k | ~$0.30 |

Linear scaling. More tasks don't multiply costs.

## Full vs Lite Mode

| Mode | Model | Tokens | Cost |
|------|-------|--------|------|
| Full | Sonnet/Opus | ~15-25k | Higher |
| Lite | Haiku | ~5-10k | 60-80% less |

Lite mode is ideal for:
- Module scaffolding
- Quick components
- Rapid iterations

Full mode is ideal for:
- Complex features
- PR reviews
- Production code

## Feature Comparison

| Feature | Description |
|---------|-------------|
| Adaptive planning | Adjusts to task complexity |
| Unified review | 3 checks in 1 pass |
| TDD verification | Proof-based, not trust-based |
| Checkpoints | Git save/restore |
| Session memory | Remembers decisions |
| Cost tracking | Token metrics per session |
| Multi-platform | Claude Code, Cursor, VS Code, Windsurf, Codex |
| Framework packs | Next.js, React, Vue, SvelteKit, Angular, Astro, Nuxt |

## Example: User Authentication

**Tasks:**
1. Create auth service
2. Create auth hook
3. Create login component
4. Create tests
5. Review code

**Token breakdown:**

| Phase | Full | Lite |
|-------|------|------|
| Planning | ~1,500 | ~500 |
| Building | ~8,000 | ~3,000 |
| Review | ~3,000 | ~1,000 |
| **Total** | **~12,500** | **~4,500** |

**Cost estimate:**
- Full (Sonnet): ~$0.19
- Lite (Haiku): ~$0.02

## Verification

### TDD Verification

Tests are proof-based:

```text
FAIL src/discount.test.ts
  Expected: 90
  Received: undefined

[Evidence of RED phase captured]
```

Not "I ran the test" - actual output.

### Review Verification

Clear verdicts:

```text
Spec Compliance: PASS
Code Quality: PASS
Architecture: FAIL

Verdict: Requires Changes
```

## Session Metrics

After each session:

```text
Session Summary
───────────────
Tasks: 5/5 complete
Tokens: 45,230 (~$0.68)
Time: 12m 34s
Commits: 7
Files: 23

Agent Breakdown:
  @planner: 8,200 tokens
  @builder: 28,400 tokens
  @reviewer: 8,630 tokens
```

Track costs as you work.

## What's Next?

- [FAQ](/guide/faq) - Common questions answered
- [All Agents](/reference/agents) - Browse the full catalog
- [Token Reference](/reference/tokens) - Detailed token estimates
