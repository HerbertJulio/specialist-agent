---
name: dev-create-service
description: "Use when adding API integration to a module - creates types, contracts, adapter, and service layer."
user-invocable: true
argument-hint: "[resource-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create the complete data layer for a resource following `docs/ARCHITECTURE.md` sections 4.1-4.3.

Resource: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` sections 4.1 (Services), 4.2 (Adapters), 4.3 (Types).

2. Ask the user:
   - What is the endpoint base URL? (e.g. `/api/newsletter`)
   - What is the response JSON format? (ask for an example or describe the fields)
   - Which operations? (GET list, GET by ID, POST, PATCH, DELETE)

3. Create in order:

   a. `types/[resource].types.ts` - mirrors API exactly (snake_case)
   b. `types/[resource].contracts.ts` - app contract (camelCase, correct types)
   c. `adapters/[resource]-adapter.ts` - inbound (API->App) + outbound (App->API)
   d. `services/[resource]-service.ts` - fetch only, no try/catch, no transformation

4. Required rules:
   - Service: **NO try/catch**, **NO .map()/.filter()/new Date()**
   - Adapter: **pure functions**, no side effects
   - Types separated: .types.ts (API) != .contracts.ts (App)

5. Validate: `npx astro check`
