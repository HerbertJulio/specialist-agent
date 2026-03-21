---
name: recall
description: "Use when you need to retrieve a past decision, preference, or convention that was saved with /remember."
user-invocable: true
argument-hint: "[topic or 'all']"
allowed-tools: Read, Glob
---

# /recall - Query Project Memory

Recall decisions, preferences, and lessons from previous sessions using Claude Code's native auto-memory system.

**Query:** $ARGUMENTS

## Workflow

### Step 1: Load Memory Index

Read `MEMORY.md` from the memory directory. This file is automatically loaded into conversation context, so it may already be available.

Memory directory: `.claude/projects/<project-hash>/memory/`

### Step 2: Process Query

#### If "all" or empty:
Show full memory summary by reading all memory files listed in MEMORY.md.

#### If specific topic:
Search memory file names, descriptions, and content for matches.

### Step 3: Read Relevant Files

For matched memories, read the full `.md` file to get details including Why and How to apply.

## Output Formats

### Full Memory (/recall all)
```
══════════════════════════════════════════════
           PROJECT MEMORY
══════════════════════════════════════════════

──────────────────────────────────────────────
           DECISIONS & CONTEXT (project)
──────────────────────────────────────────────

- [Topic]: [Decision]
  Why: [Reason]
  How to apply: [Guidance]

──────────────────────────────────────────────
           PREFERENCES & LESSONS (feedback)
──────────────────────────────────────────────

- [Rule or preference]
  Why: [Reason]
  How to apply: [When/where]

──────────────────────────────────────────────
           REFERENCES
──────────────────────────────────────────────

- [Resource]: [Where to find it]

══════════════════════════════════════════════
```

### Specific Topic (/recall state management)
```
──── /recall: state management ────

Found 2 related memories:

Decision: State Management (project)
   Use Zustand instead of Redux
   Why: Simpler API, less boilerplate
   How to apply: All new state should use Zustand

Pattern (feedback):
   Never use Redux in this project
   Why: Team consensus on simplicity
```

### No Results
```
──── /recall: [topic] ────

No memories found for "[topic]".

Suggestions:
  - Try /recall all to see all memories
  - Use /remember to add new memories
```

## Query Examples

```bash
/recall                    # Show recent memories
/recall all                # Show all memories
/recall state management   # Search for topic
/recall testing           # Search for topic
/recall decisions         # Show only project-type memories
/recall preferences       # Show only feedback-type memories
/recall references        # Show only reference-type memories
```

## Rules

1. **Fuzzy match** - "state" matches "state-management-decision"
2. **Show context** - Include Why and How to apply
3. **Suggest related** - Link to similar memories
4. **Handle empty** - Graceful message if no memory exists
