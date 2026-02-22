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
find src/lib/modules/$ARGUMENTS -type f | head -40
find src/routes/$ARGUMENTS -type f | head -20
```

2. Summarize in quick format:

### Endpoints
List the consumed endpoints (grep in services).

### Main Components
List components and their responsibilities (1 line each).

### State
- What is in Svelte stores? (client state)
- What is in load functions? (server state)

### Data Flow
```
Service (HTTP) -> Adapter (parse) -> Load function / Store (orchestrate) -> Component (.svelte)
```

### Routes
List the SvelteKit routes and what each page does.

### Points of Attention
- Anything outside the ARCHITECTURE.md pattern?
- Components > 200 lines?
- Svelte 4 patterns not yet migrated?
- SvelteKit 1 patterns not yet migrated?

3. Output: concise summary that a new developer can understand the module in 2 minutes.
