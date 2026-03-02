---
name: dev-create-test
description: "Use when a module needs test coverage - creates tests for adapters, composables, and components."
user-invocable: true
argument-hint: "[file-path]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create tests for the specified file or module.

Target: $ARGUMENTS

## Steps

1. Analyze the file to understand what to test.

2. Determine the test type:

### Adapter (high priority - pure functions, easy to test)
```typescript
import { describe, it, expect } from 'vitest'
import { xxxAdapter } from '../adapters/xxx-adapter'

describe('xxxAdapter', () => {
  describe('toXxx', () => {
    it('should convert API response to app contract', () => {
      const response = { uuid: '123', field_name: 'test', created_at: '2024-01-01T00:00:00Z' }
      const result = xxxAdapter.toXxx(response)
      expect(result.id).toBe('123')
      expect(result.fieldName).toBe('test')
      expect(result.createdAt).toBeInstanceOf(Date)
    })
  })
})
```

### Composable (medium priority)
```typescript
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
// Mock service
vi.mock('../services/xxx-service')
```

### Component (medium-low priority)
```typescript
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import XxxComponent from '../components/XxxComponent.vue'

describe('XxxComponent', () => {
  it('should render', async () => {
    const wrapper = await mountSuspended(XxxComponent, { props: { /* ... */ } })
    expect(wrapper.exists()).toBe(true)
  })
})
```

3. Create the test in `__tests__/OriginalName.spec.ts`.

4. Run: `npx vitest run --reporter=verbose`
