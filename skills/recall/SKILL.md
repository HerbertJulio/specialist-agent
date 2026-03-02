---
name: recall
description: "Use when you need to retrieve a past decision, preference, or convention that was saved with /remember."
user-invocable: true
argument-hint: "[topic or 'all']"
allowed-tools: Read
---

# /recall - Query Session Memory

Recall decisions, preferences, and lessons from previous sessions.

**Query:** $ARGUMENTS

## Workflow

### Step 1: Load Memory

```javascript
const memoryFile = '.claude/session-memory.json';

if (!exists(memoryFile)) {
  return "No session memory found. Use /remember to save memories.";
}

const memory = JSON.parse(read(memoryFile));
```

### Step 2: Process Query

#### If "all" or empty:
Show full memory summary.

#### If specific topic:
Search in:
1. decisions[].topic
2. preferences keys
3. patterns.avoided
4. patterns.preferred
5. lessons[].issue

### Step 3: Format Output

## Output Formats

### Full Memory (/recall all)
```
══════════════════════════════════════════════
           📝 PROJECT MEMORY
══════════════════════════════════════════════

Project: [name]
Last updated: [date]

──────────────────────────────────────────────
           DECISIONS (N)
──────────────────────────────────────────────

• [Topic]: [Decision]
  Reason: [Why]
  Date: [When]

• [Topic]: [Decision]
  Reason: [Why]
  Date: [When]

──────────────────────────────────────────────
           PREFERENCES
──────────────────────────────────────────────

Code Style:
  • Quotes: [value]
  • Indent: [value]
  • Semicolons: [value]

Naming:
  • Components: [convention]
  • Files: [convention]

──────────────────────────────────────────────
           PATTERNS
──────────────────────────────────────────────

✓ Preferred:
  • [pattern]
  • [pattern]

✗ Avoided:
  • [pattern]
  • [pattern]

──────────────────────────────────────────────
           LESSONS LEARNED (N)
──────────────────────────────────────────────

• Issue: [what happened]
  Solution: [how to fix]
  Prevention: [rule]

══════════════════════════════════════════════
```

### Specific Topic (/recall state management)
```
──── /recall: state management ────

Found 2 related memories:

📌 Decision: State Management
   Use Zustand instead of Redux
   Reason: Simpler API, less boilerplate
   Decided: 2024-01-15

📌 Pattern (Avoid): Redux
   We avoid Redux in this project

Related:
  • See also: "React Query" decision
```

### No Results
```
──── /recall: [topic] ────

No memories found for "[topic]".

Suggestions:
  • Try /recall all to see all memories
  • Use /remember to add new memories
```

## Query Examples

```bash
/recall                    # Show recent memories
/recall all                # Show all memories
/recall state management   # Search for topic
/recall testing           # Search for topic
/recall decisions         # Show only decisions
/recall preferences       # Show only preferences
/recall patterns          # Show patterns
/recall lessons           # Show lessons learned
```

## Rules

1. **Fuzzy match** - "state" matches "State Management"
2. **Show context** - Include reason and date
3. **Suggest related** - Link to similar memories
4. **Handle empty** - Graceful message if no memory
