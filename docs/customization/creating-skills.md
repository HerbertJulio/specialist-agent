# Creating Skills

Skills are shortcuts that users invoke with `/skill-name` inside Claude Code. Each skill is a directory containing a `SKILL.md` file with YAML frontmatter.

## Skill File Structure

Create a directory at `.claude/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: "What this skill does and when to use it"
user-invocable: true
argument-hint: "[arguments]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Instructions for what to do.

Target: $ARGUMENTS

## Steps
1. First step
2. Second step
3. ...

## Rules
- Rule one
- Rule two
```

The `$ARGUMENTS` placeholder is replaced with whatever the user types after the skill name.

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | No | Display name (default: directory name) |
| `description` | Yes | When Claude should use this skill |
| `user-invocable` | No | Show in `/` menu (default: true) |
| `argument-hint` | No | Hint shown in autocomplete (e.g. `[module-name]`) |
| `allowed-tools` | No | Tools available without asking permission |
| `model` | No | Model override (`haiku` for lower cost) |
| `disable-model-invocation` | No | Prevent Claude from auto-loading (default: false) |

## Examples

### Scaffold Skill

```markdown
---
name: create-util
description: "Create a utility or helper function following project conventions"
user-invocable: true
argument-hint: "[util-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a new utility function following project conventions.

Target: $ARGUMENTS

## Steps
1. Read `docs/ARCHITECTURE.md` section 6 (Utils vs Helpers)
2. Determine if this is a util (pure function) or helper (side effects)
3. Create the file in the appropriate directory:
   - Utils: `src/shared/utils/[name].ts`
   - Helpers: `src/shared/helpers/[name]-helper.ts`
4. Add proper TypeScript types
5. Create test file in `src/shared/__tests__/`
6. Run `tsc --noEmit` to validate

## Rules
- Utils must be pure functions (no side effects)
- Helpers can have side effects (DOM, localStorage, etc.)
- Export individual functions, not default exports
- Include JSDoc for public functions
```

### Validation Skill

```markdown
---
name: pr-ready
description: "Check if the current branch is ready for a pull request"
user-invocable: true
allowed-tools: Read, Bash, Glob, Grep
---

Check if the current branch is ready for a pull request.

## Steps
1. Run `tsc --noEmit` - check for type errors
2. Run `eslint .` - check for lint issues
3. Run `vitest run` - run all tests
4. Run `npm run build` - verify build succeeds
5. Search for `console.log` and `debugger` statements
6. Check for files > 200 lines in changed files
7. Produce a summary report

## Output Format
### PR Readiness Report
- ✅ Types: OK / ❌ Types: N errors
- ✅ Lint: OK / ❌ Lint: N warnings
- ✅ Tests: OK / ❌ Tests: N failures
- ✅ Build: OK / ❌ Build: Failed
- ✅ Clean: OK / ❌ Debug artifacts found
```

### Documentation Skill

```markdown
---
name: generate-docs
description: "Generate API documentation for a module"
user-invocable: true
argument-hint: "[module-name]"
allowed-tools: Read, Glob, Grep
---

Generate API documentation for a module.

Module: $ARGUMENTS

## Steps
1. Find the module at `src/modules/$ARGUMENTS/`
2. Read all files in the module
3. Document:
   - Public API (from index.ts)
   - Available composables and their return types
   - Service endpoints
   - Contract types
4. Output as markdown

## Rules
- Only document the public API
- Include usage examples for composables
- List all query keys for cache management
```

## Organization

Each skill is a directory with a `SKILL.md` file:

```
.claude/skills/
├── dev-create-module/        ← /dev-create-module
│   └── SKILL.md
├── review-review/            ← /review-review
│   └── SKILL.md
├── migration-migrate-module/ ← /migration-migrate-module
│   └── SKILL.md
└── docs-onboard/             ← /docs-onboard
    └── SKILL.md
```

## How Skills Become Slash Commands

The directory name determines the skill name:

```
.claude/skills/dev-create-module/SKILL.md    → /dev-create-module
.claude/skills/review-check-arch/SKILL.md    → /review-check-arch
.claude/skills/docs-onboard/SKILL.md         → /docs-onboard
```

## Tips

- Keep skills **focused** - one action per skill
- Use `$ARGUMENTS` for user input
- Reference `ARCHITECTURE.md` for consistency
- Use `allowed-tools` to restrict permissions (e.g. read-only skills)
- Use `disable-model-invocation: true` for manual-only skills
- For complex multi-step workflows, consider creating an agent instead
