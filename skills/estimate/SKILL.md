---
name: estimate
description: "Use when planning a feature and need to understand token cost, time estimate, or complexity before committing to implementation."
user-invocable: true
argument-hint: "[feature description]"
allowed-tools: Read, Glob, Grep
---

# /estimate - Cost Estimation

Estimate token usage and cost before implementing a feature.

**Target:** $ARGUMENTS

## Workflow

### Step 1: Analyze Scope

Search codebase to understand scope:

```bash
# Find affected files
# Count existing lines
# Identify patterns
```

### Step 2: Classify Complexity

| Level | Files | Lines | Tokens (est.) | Cost (est.) |
|-------|-------|-------|---------------|-------------|
| TRIVIAL | 1-2 | <50 | ~2,000 | ~$0.03 |
| SIMPLE | 3-5 | <200 | ~5,000 | ~$0.08 |
| MEDIUM | 6-15 | <1,000 | ~15,000 | ~$0.23 |
| COMPLEX | 15+ | 1,000+ | ~40,000 | ~$0.60 |

### Step 3: Break Down Costs

```markdown
## Cost Breakdown

### Planning
- @planner: ~2,000 tokens
- Design doc (if complex): ~3,000 tokens

### Implementation
- File 1 (service.ts): ~1,500 tokens
- File 2 (adapter.ts): ~1,000 tokens
- File 3 (component.tsx): ~2,500 tokens
- File 4 (tests): ~1,500 tokens

### Review
- @reviewer: ~2,000 tokens

### Total
- Estimated: ~13,500 tokens
- Cost: ~$0.20
```

### Step 4: Compare Models

| Model | Tokens | Cost | Best For |
|-------|--------|------|----------|
| Haiku | ~13,500 | ~$0.01 | Simple tasks |
| Sonnet | ~13,500 | ~$0.20 | Standard work |
| Opus | ~13,500 | ~$0.60 | Complex logic |

### Step 5: Provide Recommendations

```markdown
## Recommendations

**Full Mode (Sonnet):**
- Total: ~$0.20
- Best for: Production code, complex features

**Lite Mode (Haiku):**
- Total: ~$0.01
- Best for: Prototyping, simple changes

**Hybrid Approach:**
- Use Haiku for boilerplate (~$0.005)
- Use Sonnet for logic (~$0.10)
- Total: ~$0.105 (47% savings)
```

## Output

```
──── /estimate ────
Feature: [name]
Complexity: [TRIVIAL | SIMPLE | MEDIUM | COMPLEX]

Scope:
- Files: ~N
- Lines: ~N
- New code: ~N lines
- Modified: ~N lines

Token Estimate:
- Planning: ~N tokens
- Implementation: ~N tokens
- Review: ~N tokens
- Total: ~N tokens

Cost Estimate:
| Mode | Cost |
|------|------|
| Lite (Haiku) | ~$X.XX |
| Full (Sonnet) | ~$X.XX |
| Hybrid | ~$X.XX |

Recommendation: [which mode to use]

Comparison:
- Superpowers estimate for similar task: ~$X.XX
- Specialist Agent estimate: ~$X.XX
- Savings: ~X%
```

## Cost Reference

### Per 1M Tokens (Approximate)

| Model | Input | Output |
|-------|-------|--------|
| Haiku | $0.25 | $1.25 |
| Sonnet | $3.00 | $15.00 |
| Opus | $15.00 | $75.00 |

### Typical Tasks

| Task | Tokens | Sonnet Cost |
|------|--------|-------------|
| Fix typo | ~500 | ~$0.01 |
| Add field | ~2,000 | ~$0.03 |
| New component | ~5,000 | ~$0.08 |
| New module | ~15,000 | ~$0.23 |
| Full feature | ~40,000 | ~$0.60 |

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Estimating wastes time, just start building" | Building without estimates wastes 10x more when you pick the wrong model or approach. |
| "I can eyeball the complexity" | Eyeballing misses hidden dependencies. A structured estimate catches them. |
| "Cost doesn't matter for this task" | Every token has a cost. Knowing the cost helps choose Haiku vs Sonnet vs Opus. |
| "Estimates are always wrong anyway" | Rough estimates beat no estimates. Even ±50% accuracy saves money. |

## Rules

1. **Always estimate before complex work**
2. **Show comparison with competitors**
3. **Recommend appropriate model**
4. **Include hybrid options when beneficial**
