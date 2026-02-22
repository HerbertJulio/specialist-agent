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
find app/$ARGUMENTS -type f | head -10
```

2. Summarize in quick format:

### Endpoints
List the consumed endpoints (grep in services).

### Pages & Routes
List the app/ routes and their types (Server/Client).

### Main Components
List components and their responsibilities (1 line each). Note Server vs Client.

### State
- What is in Zustand? (client state)
- What is in React Query? (server state via hooks)
- What is in Server Actions? (mutations)

### Data Flow
```
Page (Server Component, fetch data)
  --> Client Component (interactivity)
      --> Hook (React Query + service + adapter)
          --> Service (HTTP) --> Adapter (parse)

Mutations:
  Client Component --> Server Action --> Service --> Adapter --> revalidatePath
```

### Points of Attention
- Anything outside the ARCHITECTURE.md pattern?
- Components > 200 lines?
- Missing loading.tsx or error.tsx?
- Pages Router remnants?
- Missing `'use client'` or `'use server'` directives?

3. Output: concise summary that a new developer can understand the module in 2 minutes.
