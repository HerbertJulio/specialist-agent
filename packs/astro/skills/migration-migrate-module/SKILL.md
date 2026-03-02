---
name: migration-migrate-module
description: "Use when a complete module needs migration to the target architecture - runs 6 phases with approval gates."
user-invocable: true
argument-hint: "[module-path]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Migrate an entire module to the Astro architecture from `docs/ARCHITECTURE.md`.

Module/Path: $ARGUMENTS

## Steps

Use `@migrator` to coordinate the full migration in phases:

1. **Phase 0 -- Analysis**: Map the module (files, framework, patterns, dependencies)
2. **Phase 1 -- Structure**: Create `src/modules/[name]/`, `src/pages/`, `src/components/`, `src/islands/`
3. **Phase 2 -- Types**: Create `.types.ts` + `.contracts.ts` + adapter
4. **Phase 3 -- Services**: Migrate to pure service (no try/catch, fetch only)
5. **Phase 4 -- Pages & Routing**: Convert SPA routes to file-based, move data fetching to frontmatter
6. **Phase 5 -- Components & Islands**: Static -> .astro (zero JS), interactive -> islands with `client:*`
7. **Phase 6 -- Review**: Validate conformance, verify JS reduction

Validate build/check/tests after each phase. Ask for approval before each phase.
