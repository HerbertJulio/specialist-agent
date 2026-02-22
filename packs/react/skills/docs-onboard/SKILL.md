---
name: docs-onboard
description: "Create a quick module summary for onboarding new developers"
user-invocable: true
argument-hint: "[module-name]"
allowed-tools: Read, Bash, Glob, Grep
---

Create a quick summary of a module for onboarding.

Module: $ARGUMENTS

## Steps

1. Map the structure:
```bash
find src/modules/$ARGUMENTS -type f | head -40
```

2. Summarize in quick format:

### Endpoints
List the consumed endpoints (grep in services).

### Main Components
List components and their responsibilities (1 line each).

### State
- What is in Zustand? (client state)
- What is in React Query? (server state)

### Data Flow
```
Service (HTTP) -> Adapter (parse) -> Hook (React Query) -> Component (TSX)
```

### Points of Attention
- Anything outside the ARCHITECTURE.md pattern?
- Components > 200 lines?
- Legacy code not yet migrated? (class components, Redux, PropTypes)

3. Output: concise summary that a new developer can understand the module in 2 minutes.
