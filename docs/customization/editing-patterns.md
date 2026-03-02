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

## Before & After: How Changes Affect Agent Output

When you edit `ARCHITECTURE.md`, agents immediately change their behavior. Here's a concrete example:

### Example: Switching from fetch to Axios

**Before** - ARCHITECTURE.md says "Use fetch with typed wrappers":

```typescript
// @builder generates this service:
export async function getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
  const query = new URLSearchParams(params as Record<string, string>)
  const response = await fetch(`/v2/orders?${query}`)
  if (!response.ok) throw new Error(`GET /v2/orders failed: ${response.status}`)
  return response.json()
}
```

**After** - You change ARCHITECTURE.md to "Use Axios with `src/shared/services/api-client.ts`":

```typescript
// @builder now generates this instead:
import { apiClient } from '@/shared/services/api-client'

export async function getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
  const { data } = await apiClient.get<OrdersResponse>('/v2/orders', { params })
  return data
}
```

::: tip
The change is automatic - you don't need to tell each agent about Axios. They all read the same ARCHITECTURE.md.
:::

## Common Customizations

### Switch State Manager (Pinia to Zustand)

```markdown
## State Management
- Client state: Zustand stores in `src/modules/[name]/stores/`
- Server state: TanStack React Query in `src/modules/[name]/hooks/`
- Store naming: `use[Name]Store` (e.g., `useCartStore`)
- No global stores - each module owns its state
```

### Switch API Client (fetch to Axios)

```markdown
## API Client
We use Axios with a centralized instance at `src/shared/services/api-client.ts`.
- All services import `apiClient` from the shared module
- Interceptors handle auth tokens and error formatting
- Services must NOT create their own Axios instances
```

### Change Directory Structure (modules to features)

```markdown
## Module Structure
src/features/[name]/
├── ui/                  ← Components
├── hooks/               ← Custom hooks (React) or composables (Vue)
├── api/                 ← Services + adapters combined
├── model/               ← Types + contracts + validation
└── __tests__/           ← Unit tests
```

### Add Custom Lint Rules

```markdown
## Code Standards
- Max function length: 30 lines
- Max file length: 250 lines
- No `any` type - use `unknown` with type guards
- No barrel exports in components/ directories
- Composables must return readonly refs for state
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

1. **Be explicit** - Agents follow what's written literally
2. **Use examples** - Code examples in ARCHITECTURE.md become templates
3. **Keep it updated** - Outdated docs lead to inconsistent code
4. **Version control** - Commit ARCHITECTURE.md changes with clear messages
5. **Team alignment** - Review pattern changes with the team before committing

## Validation Checklist

After editing `ARCHITECTURE.md`, verify your changes:

1. **Run automated checks** - Catches structural violations:

   ```bash
   /review-check-architecture
   ```

2. **Generate a test component** - Verify agents use your new patterns:

   ```bash
   "Use @builder to create a test-example component"
   ```

3. **Review the output** - Check that the generated code follows your updated rules

4. **Delete the test file** - Clean up after validation

No restart needed. Agents read `ARCHITECTURE.md` fresh on every invocation. Changes take effect immediately.
