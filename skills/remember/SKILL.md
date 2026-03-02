---
name: remember
description: "Use when making a decision, choosing a convention, or learning a lesson that should persist across sessions."
user-invocable: true
argument-hint: "[what to remember]"
allowed-tools: Read, Write
---

# /remember - Save to Session Memory

Save decisions, preferences, and lessons that persist across sessions.

**Input:** $ARGUMENTS

## Workflow

### Step 1: Parse Input

Detect type of memory:
- **Decision**: "Use X instead of Y because Z"
- **Preference**: "Always use single quotes"
- **Pattern avoid**: "Never use any types"
- **Pattern prefer**: "Prefer composition over inheritance"
- **Lesson**: "API changed and broke app. Solution: version contracts"

### Step 2: Load Existing Memory

```javascript
const memoryFile = '.claude/session-memory.json';
let memory = {};

if (exists(memoryFile)) {
  memory = JSON.parse(read(memoryFile));
} else {
  memory = {
    version: "1.0",
    projectId: getProjectName(),
    created: new Date().toISOString(),
    decisions: [],
    preferences: {},
    context: {},
    patterns: { avoided: [], preferred: [] },
    lessons: []
  };
}
```

### Step 3: Add to Memory

#### For Decisions:
```json
{
  "id": "d001",
  "date": "2024-01-15",
  "topic": "[extracted topic]",
  "decision": "[what was decided]",
  "reason": "[why]",
  "agent": "[current agent or 'user']"
}
```

#### For Preferences:
```json
{
  "preferences": {
    "[category]": {
      "[key]": "[value]"
    }
  }
}
```

#### For Patterns:
```json
{
  "patterns": {
    "avoided": ["[pattern]"],
    "preferred": ["[pattern]"]
  }
}
```

#### For Lessons:
```json
{
  "lessons": [{
    "date": "2024-01-15",
    "issue": "[what happened]",
    "solution": "[how to fix]",
    "preventionRule": "[how to prevent]"
  }]
}
```

### Step 4: Save Memory

```javascript
memory.updated = new Date().toISOString();
write(memoryFile, JSON.stringify(memory, null, 2));
```

## Output

```
──── /remember ────

✓ Saved to session memory

Type: [Decision | Preference | Pattern | Lesson]
Topic: [topic]
Content: [what was saved]

This will be recalled in future sessions.

Memory file: .claude/session-memory.json
Total memories: [N] decisions, [N] preferences, [N] patterns, [N] lessons
```

## Examples

### Remember a Decision
```
/remember Use Zustand for state management because it's simpler than Redux
```

Output:
```
✓ Saved to session memory

Type: Decision
Topic: State Management
Content: Use Zustand instead of Redux
Reason: Simpler

This will be recalled in future sessions.
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

1. **Extract key info** - Don't store raw text
2. **Categorize correctly** - Decision vs preference vs pattern
3. **No duplicates** - Update existing if same topic
4. **No secrets** - Never store credentials
