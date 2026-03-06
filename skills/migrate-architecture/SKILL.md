---
name: migrate-architecture
description: "Use when transforming a project's architecture pattern - e.g., Flat to Modular, MVC to Clean Architecture, Monolith to Modular Monolith."
user-invocable: true
argument-hint: "[current-architecture] to [target-architecture] [variant: full|lite] [scope: file|module|project]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /migrate-architecture - Architecture Pattern Migration

Migrate a project's architecture from one pattern to another while preserving all functionality.

**Arguments:** $ARGUMENTS (e.g., "flat to modular full project", "mvc to clean lite src/modules/auth")

## Supported Architecture Patterns

### Frontend

| Pattern | Description |
|---------|-------------|
| Flat / Component-Driven | Single components/ dir, minimal structure |
| Modular (Feature-Based) | Vertical slicing by feature with services/adapters/types |
| Feature-Sliced Design (FSD) | Strict layered: app > pages > features > entities > shared |
| Atomic Design | Components by granularity: atoms > molecules > organisms |
| Clean Architecture | Domain > Use Cases > Adapters > Frameworks |
| Hexagonal (Ports & Adapters) | Core with ports, infrastructure in adapters |

### Backend / Fullstack

| Pattern | Description |
|---------|-------------|
| MVC / Layered | Horizontal: controllers, services, repositories |
| Modular Monolith | Single deployment, strict module boundaries |
| Clean Architecture | Concentric layers, dependency rule inward |
| Hexagonal | Ports & Adapters, domain isolated |
| DDD | Bounded contexts, aggregates, domain events |
| CQRS | Separate command/query paths |
| Event-Driven | Async communication via events |
| Microservices | Independent services, own databases |

### Variants

| Variant | Description |
|---------|-------------|
| **Full** | Complete implementation with all layers and patterns |
| **Lite (Simplified)** | Fewer layers, same principles. For smaller teams |

## Workflow

### Phase 1: Assessment

1. **Read** `docs/ARCHITECTURE.md` if it exists
2. **Scan** the project structure:
   - List all directories under `src/` (or root if no `src/`)
   - Identify current architecture pattern by matching directory names
   - Count modules/features/components
   - Check for barrel exports (index.ts)
   - Check import patterns between directories
3. **Identify** the current architecture pattern and confidence level
4. **Report** findings:

```text
── Architecture Assessment ──
Current: [detected pattern] (confidence: high/medium/low)
Target: [requested pattern] ([variant])
Scope: [project | specific module/path]
Estimated files to move: X
Estimated files to create: X
Risk: low/medium/high
```

5. **Ask** for confirmation before proceeding

### Phase 2: Planning

1. **Generate** the target directory structure based on:
   - Target architecture pattern
   - Detected framework (React, Vue, Next.js, etc.)
   - Chosen variant (Full or Lite)
2. **Map** existing files to their new locations:
   - Components → appropriate layer/module
   - Services → service layer or domain layer
   - Types → types layer
   - Tests → co-located __tests__/
   - Utils/Helpers → shared/
3. **Identify** new files to create:
   - Barrel exports (index.ts) per module
   - Adapter layer (if Full variant)
   - Type separation (.types.ts + .contracts.ts for Full)
4. **Create** migration plan with ordered steps:
   - Phase 2a: Create target directory structure
   - Phase 2b: Move files (least coupled first)
   - Phase 2c: Create new files (barrel exports, adapters)
   - Phase 2d: Update imports
   - Phase 2e: Validate

### Phase 3: Execution

Execute the migration plan step by step:

1. **Create** target directory structure (mkdir -p)
2. **Move** files one module at a time:
   - Start with the LEAST coupled module
   - Move component files
   - Move service files
   - Move type files
   - Move test files
3. **Create** new architectural files:
   - Barrel exports (index.ts) for each module
   - Adapter files (if migrating to Modular Full, Clean, or Hexagonal)
   - Type separation files (.types.ts + .contracts.ts)
4. **Update** all import paths:
   - Use Grep to find all imports referencing moved files
   - Update each import to the new path
   - Use barrel exports where possible
5. **Generate** or update `docs/ARCHITECTURE.md` for the target pattern

### Phase 4: Validation

1. **Check** directory structure matches target pattern
2. **Verify** no broken imports:
   ```bash
   npx tsc --noEmit 2>&1 | head -50
   ```
3. **Validate** import rules:
   - Modules don't import from each other (Modular)
   - Dependencies point inward (Clean/Hexagonal)
   - FSD layers import top-down only
4. **Run** tests if they exist:
   ```bash
   npm test 2>&1 | tail -20
   ```
5. **Report** results:

```text
── Architecture Migration Complete ──
From: [source pattern]
To: [target pattern] ([variant])

Files moved: X
Files created: X
Imports updated: X
Barrel exports created: X

Validation:
  TypeScript: ✓ compiles
  Import rules: ✓ no violations
  Tests: ✓ passing (or N/A)

docs/ARCHITECTURE.md: ✓ generated
```

## Migration Strategies by Pattern

### Flat → Modular

1. Group components by domain/feature
2. Create `modules/[feature]/components/` for each group
3. Move related services, types into module
4. Create index.ts for each module
5. Move shared components to `shared/components/`

### MVC → Modular

1. For each controller+service pair, create a module
2. Move controller logic to module's hooks/composables
3. Move models to module's types/
4. Create service layer in each module
5. Move shared middleware to shared/

### MVC → Clean Architecture

1. Extract domain entities (pure business objects, no framework deps)
2. Create use-case classes for each business operation
3. Define port interfaces for external dependencies
4. Move database/HTTP code to infrastructure/ as adapter implementations
5. Wire use cases to ports in the composition root

### Modular → Clean Architecture

1. For each module, add domain/ and application/ sub-layers
2. Extract entities from services into domain/entities/
3. Create use-cases from service methods
4. Define port interfaces for external deps
5. Move HTTP/DB code to infrastructure/

### Modular → Hexagonal

1. Create core/ with domain/ and ports/
2. Extract entities to core/domain/
3. Define driving ports (use case interfaces) in core/ports/in/
4. Define driven ports (repository interfaces) in core/ports/out/
5. Move components to adapters/in/web/
6. Move HTTP/DB to adapters/out/

### Modular → Feature-Sliced Design

1. Map modules to FSD layers:
   - Shared components → shared/ui/
   - Feature-specific → features/[feature]/
   - Business entities → entities/[entity]/
   - Page compositions → pages/
2. Enforce top-down import rules
3. Split cross-cutting features into widgets/

### Modular → DDD

1. Identify bounded contexts from modules
2. Add aggregates/ with aggregate roots
3. Extract value objects from entity properties
4. Create domain events for state changes
5. Add command/query handlers in application layer

### Any → Modular Monolith

1. Start with Modular structure
2. Add domain/application/infrastructure layers per module
3. Enforce module boundaries with barrel exports
4. Validate no cross-module internal imports
5. Each module = potential future microservice

## Anti-Patterns to Avoid

| Mistake | Correct Approach |
|---------|-----------------|
| Moving files without updating imports | Use TypeScript compiler to verify after each move |
| Creating empty architectural layers | Only create layers with actual content |
| Migrating everything at once | One module at a time, least coupled first |
| Skipping barrel exports | Always create index.ts - it enforces boundaries |
| Copying patterns blindly | Adapt to the project's actual needs (Full vs Lite) |
| Ignoring existing tests | Move tests alongside their source files |

## Rules

1. ALWAYS assess before migrating - understand current state first
2. NEVER migrate without user confirmation
3. ONE module at a time - never parallel moves
4. VALIDATE after each module migration (TypeScript + imports)
5. PRESERVE all existing tests (move them, don't delete)
6. CREATE docs/ARCHITECTURE.md for the target pattern
7. USE the appropriate variant (Full for established teams, Lite for small teams)
8. If TypeScript errors appear, FIX them before continuing
