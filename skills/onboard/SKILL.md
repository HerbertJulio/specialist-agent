---
name: onboard
description: "Use when joining an unfamiliar codebase, starting on a new team, or needing to understand a project's architecture, conventions, and key modules quickly."
user-invocable: true
argument-hint: "[path or focus area]"
allowed-tools: Read, Bash, Glob, Grep
---

# /onboard - Codebase Onboarding

Understand any codebase in minutes. Generates a developer guide with architecture, conventions, key modules, and getting-started instructions.

**Target:** $ARGUMENTS

## When to Use

- First day on a new project or team
- Picking up an open-source project for the first time
- Reviewing a project before a technical interview
- Before contributing to an unfamiliar repo
- When documentation is missing or outdated
- NOT for: projects you already know well (use `@scout` for quick checks instead)

## Workflow

### Step 1: Project Discovery

Scan the project root:

```
Read: package.json / pyproject.toml / go.mod / Cargo.toml
Read: README.md (if exists)
Read: ARCHITECTURE.md / CLAUDE.md / CONTRIBUTING.md (if exist)
Scan: Top-level directory structure
```

Extract:
- Project name and description
- Language and framework
- Package manager and scripts
- Entry points

### Step 2: Architecture Mapping

Map the project structure:

```
Identify:
  - Source root (src/, app/, lib/)
  - Module/feature boundaries
  - Shared utilities
  - Configuration files
  - Test structure
  - CI/CD setup
```

Generate architecture diagram:

```
src/
├── modules/          → Feature modules (users, orders, products)
│   └── [module]/
│       ├── types/    → TypeScript interfaces
│       ├── services/ → Business logic
│       ├── hooks/    → State management
│       └── components/ → UI components
├── shared/           → Shared utilities
├── config/           → App configuration
└── app/              → App entry and routing
```

### Step 3: Convention Detection

Detect coding conventions by reading actual files:

| Convention | How to Detect |
|------------|---------------|
| Naming | Read 3-5 files, check function/variable naming |
| File structure | Map actual directory patterns |
| State management | Find store/state imports (Redux, Zustand, Pinia, etc.) |
| API layer | Find HTTP client usage (axios, fetch, etc.) |
| Testing | Find test files, check framework (Jest, Vitest, etc.) |
| Styling | Find CSS/styled imports (Tailwind, CSS Modules, etc.) |
| Error handling | Find try/catch patterns, error boundaries |
| Imports | Check for path aliases, barrel exports |

### Step 4: Key Module Analysis

For each major module/feature:

```
Module: [name]
├── Purpose: [what it does]
├── Files: [count]
├── Dependencies: [what it imports from]
├── Dependents: [what imports from it]
├── Entry point: [main file]
└── Tests: [yes/no, coverage estimate]
```

Focus on the 3-5 most important modules.

### Step 5: Developer Guide Generation

Compile everything into an actionable guide.

## Verification Protocol

**Before claiming onboarding is complete:**

1. Architecture diagram was generated from actual file structure (not assumed)
2. Conventions were detected from reading real code (not README claims)
3. At least 3 key modules were analyzed
4. Setup instructions were verified by checking scripts in package.json
5. If tests exist, the test command was identified

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "README explains everything" | READMEs are often outdated. Verify against actual code. |
| "Architecture is obvious" | Obvious to maintainers, not newcomers. Map it explicitly. |
| "Too many files to analyze" | Focus on top 3-5 modules. Don't skip the mapping step. |
| "No tests to analyze" | That IS the finding. Report it in the guide. |
| "Conventions aren't consistent" | Document the inconsistencies. It's useful for the developer. |

## Rules

1. **Read actual code** - Never rely solely on README or documentation
2. **Map before explaining** - Architecture diagram first, then details
3. **Focus on key modules** - 3-5 most important, not all of them
4. **Detect, don't assume** - Conventions come from reading files, not guessing
5. **Be honest about gaps** - Missing tests, docs, or conventions are findings too
6. **Actionable output** - Every section should help the developer start working

## Output

```
──── /onboard ────
Project: [name]
Stack: [language + framework + key libraries]

Architecture:
[directory tree diagram]

Conventions:
  Naming: [camelCase / snake_case / PascalCase]
  State: [Redux / Zustand / Pinia / Context]
  API: [axios / fetch / tRPC]
  Testing: [Jest / Vitest / Playwright]
  Styling: [Tailwind / CSS Modules / styled-components]

Key Modules:
  1. [module] - [purpose] ([X files])
  2. [module] - [purpose] ([X files])
  3. [module] - [purpose] ([X files])

Getting Started:
  Install: [command]
  Dev: [command]
  Test: [command]
  Build: [command]

Notes:
  - [important observations]
  - [potential gotchas]
  - [missing documentation areas]
```
