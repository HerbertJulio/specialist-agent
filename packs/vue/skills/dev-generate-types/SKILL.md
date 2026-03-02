---
name: dev-generate-types
description: "Use when integrating with an API endpoint and need TypeScript types, contracts, and adapters generated automatically."
user-invocable: true
argument-hint: "[endpoint-or-json]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Generate types, contracts and adapter for an API endpoint following `docs/ARCHITECTURE.md` §4.2-4.3.

Endpoint or example JSON: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` sections 4.2 and 4.3.

2. If the user provided an example JSON, use it. If they provided an endpoint:
   - Search existing code for calls to that endpoint
   - Ask the user for an example response JSON

3. From the JSON, create:

   a. **`[resource].types.ts`** - types that mirror the API exactly:
      - snake_case, string dates, IDs as string
      - Include request payloads and list response (with pagination)

   b. **`[resource].contracts.ts`** - clean app contracts:
      - camelCase, Date objects, derived booleans
      - No internal API fields (tokens, metadata)

   c. **`[resource]-adapter.ts`** - pure functions:
      - `toXxx(response)` - inbound (API → App)
      - `toXxxList(response)` - inbound for list
      - `toCreatePayload(input)` - outbound (App → API)
      - Conversions: snake→camel, string→Date, cents→decimal

4. Validate: `npx tsc --noEmit`
