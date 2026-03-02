---
name: migration-migrate-module
description: "Use when a complete module needs migration to the target architecture - runs 6 phases with approval gates."
user-invocable: true
argument-hint: "[module-path]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Migrate an entire module to the target architecture from `docs/ARCHITECTURE.md`.

Module/Path: $ARGUMENTS

## Steps

Use `@migrator` to coordinate the full migration in phases:

1. **Phase 0 -- Analysis**: Map the module (files, Svelte 4 vs 5 patterns, JS vs TS, SvelteKit 1 vs 2 patterns, dependencies)
2. **Phase 1 -- Structure**: Create `src/lib/modules/[name]/` and route files, move existing files
3. **Phase 2 -- Types**: Create `.types.ts` + `.contracts.ts` + adapter
4. **Phase 3 -- Services**: Migrate to pure service (no try/catch, native fetch)
5. **Phase 4 -- State**: Server state -> SvelteKit load functions, Client state -> Svelte stores
6. **Phase 5 -- Components**: Svelte 4 -> 5 runes + composition (see conversion table)
7. **Phase 6 -- Review**: Validate conformance, check for remaining legacy patterns

Validate build/svelte-check/tests after each phase. Ask for approval before each phase.
