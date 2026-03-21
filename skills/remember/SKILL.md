---
name: remember
description: "Use when making a decision, choosing a convention, or learning a lesson that should persist across sessions."
user-invocable: true
argument-hint: "[what to remember]"
allowed-tools: Read, Write, Glob
---

# /remember - Save to Project Memory

Save decisions, preferences, and lessons that persist across sessions using Claude Code's native auto-memory system.

**Input:** $ARGUMENTS

## Workflow

### Step 1: Parse Input

Detect type of memory:
- **Decision** → type: `project` (e.g., "Use X instead of Y because Z")
- **Preference** → type: `feedback` (e.g., "Always use single quotes")
- **Pattern avoid** → type: `feedback` (e.g., "Never use any types")
- **Pattern prefer** → type: `feedback` (e.g., "Prefer composition over inheritance")
- **Lesson** → type: `feedback` (e.g., "API changed and broke app. Solution: version contracts")
- **Project context** → type: `project` (e.g., "Merge freeze starts March 5")
- **External resource** → type: `reference` (e.g., "Bugs tracked in Linear project INGEST")

### Step 2: Create Memory File

Write a markdown file to the memory directory with frontmatter:

```markdown
---
name: [kebab-case-topic-name]
description: [one-line description for relevance matching]
type: [project | feedback | reference]
---

[Memory content]

**Why:** [reason or context]
**How to apply:** [when/where this applies]
```

Memory directory: `.claude/projects/<project-hash>/memory/`

### Step 3: Update Memory Index

Add an entry to `MEMORY.md` in the memory directory. Keep it concise - just a link and brief description.

### Step 4: Check for Duplicates

Before creating a new file, check if a memory on the same topic already exists. If yes, UPDATE the existing file instead of creating a duplicate.

## Output

```
──── /remember ────

Saved to project memory

Type: [Decision | Preference | Pattern | Lesson | Context | Reference]
Topic: [topic]
Content: [what was saved]

This will be recalled in future sessions via MEMORY.md.
```

## Examples

### Remember a Decision
```
/remember Use Zustand for state management because it's simpler than Redux
```

Output:
```
Saved to project memory

Type: Decision (project)
Topic: State Management
Content: Use Zustand instead of Redux
Reason: Simpler API, less boilerplate
```

### Remember a Preference
```
/remember Always use single quotes in this project
```

### Remember to Avoid
```
/remember Never use any types in TypeScript
```

### Remember a Lesson
```
/remember The API changed format and broke parsing. Solution: Always create adapters with versioned contracts.
```

## Rules

1. **Extract key info** - Don't store raw text, structure with Why/How to apply
2. **Categorize correctly** - Use correct memory type (project, feedback, reference)
3. **No duplicates** - Update existing if same topic
4. **No secrets** - Never store credentials or PII
5. **Convert dates** - Use absolute dates, not relative ("2026-03-05" not "Thursday")
6. **Keep MEMORY.md under 200 lines** - Be concise in the index
