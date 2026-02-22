# Editing Patterns

All agents read `docs/ARCHITECTURE.md` before acting. By editing this file, you change the behavior of every agent and command.

## What You Can Customize

### Stack and Dependencies

If your project uses different libraries, update the relevant sections:

```markdown
<!-- Example: Using Axios instead of fetch -->
## API Client
We use Axios with a centralized client at `src/shared/services/api-client.ts`.

<!-- Example: Using a different UI library -->
## UI Components
We use PrimeVue for base components. Shared components wrap PrimeVue.
```

### Naming Conventions

Update section 3 of `ARCHITECTURE.md` to match your team's conventions:

```markdown
| Type | Pattern | Example |
|------|---------|---------|
| Components | `PascalCase.vue` | `UserProfile.vue` |
| Services | `kebab-case.service.ts` | `user.service.ts` |
```

### Directory Structure

If your module structure is different, update section 2:

```markdown
src/features/[name]/    ← instead of src/modules/[name]/
├── ui/                 ← instead of components/
├── hooks/              ← instead of composables/
└── api/                ← instead of services/ + adapters/
```

### Layer Rules

Modify section 4 to add or change layer responsibilities:

```markdown
### Service Rules
- ✅ HTTP calls with typed request/response
- ✅ Can include retry logic       ← added
- ❌ No try/catch
```

### Component Size Limits

```markdown
## Component Rules
- Total SFC: < 300 lines    ← changed from 200
- Template: < 150 lines     ← changed from 100
```

## CLAUDE.md Configuration

The `CLAUDE.md` file at the project root configures Claude's behavior. Key sections:

### Agent List

Add or remove agents from the table to control what Claude can delegate to:

```markdown
### Available Agents
| Agent | When to Use |
|-------|-------------|
| `@my-custom-agent` | Description of when to use |
```

### Key Patterns

Update the quick-reference patterns:

```markdown
### Key Patterns (details in docs/ARCHITECTURE.md)
- **Services**: HTTP only, no try/catch
- **Custom Rule**: description
```

## Best Practices

1. **Be explicit** — Agents follow what's written literally
2. **Use examples** — Code examples in ARCHITECTURE.md become templates
3. **Keep it updated** — Outdated docs lead to inconsistent code
4. **Version control** — Commit ARCHITECTURE.md changes with clear messages
5. **Team alignment** — Review pattern changes with the team before committing

## After Editing

No restart needed. Agents read `ARCHITECTURE.md` fresh on every invocation. Changes take effect immediately.

To validate your changes:

```bash
/review-check-architecture
```

This runs the 14 automated checks against the current codebase using your updated rules.
