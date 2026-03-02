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

1. **Phase 0 -- Analysis**: Map the module (files, patterns, dependencies, class vs functional, Redux, HOCs)
2. **Phase 1 -- Structure**: Create `src/modules/[name]/` and move files
3. **Phase 2 -- Types**: Create `.types.ts` + `.contracts.ts` + adapter
4. **Phase 3 -- Services**: Migrate to pure service (no try/catch)
5. **Phase 4 -- State**: Server state -> React Query, Client state -> Zustand. Remove Redux
6. **Phase 5 -- Components**: Class -> functional, typed props, hooks, useCallback/useMemo
7. **Phase 6 -- Review**: Validate conformance

Validate build/tsc/tests after each phase. Ask for approval before each phase.
