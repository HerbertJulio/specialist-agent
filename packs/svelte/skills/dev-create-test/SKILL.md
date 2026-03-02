---
name: dev-create-test
description: "Use when a module needs test coverage - creates tests for adapters, hooks/composables/stores, and components."
user-invocable: true
argument-hint: "[file-path]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create tests for the specified file or module.

Target: $ARGUMENTS

## Steps

1. Analyze the file to understand what to test.

2. Determine the test type:

### Adapter (high priority -- pure functions, easy to test)
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

  describe('toCreatePayload', () => {
    it('should convert app input to API payload', () => {
      const input = { name: 'Test', price: 10.50 }
      const result = xxxAdapter.toCreatePayload(input)
      expect(result.price_cents).toBe(1050)
    })
  })
})
```

### Store (medium priority)
```typescript
import { describe, it, expect } from 'vitest'
import { get } from 'svelte/store'
import { xxxStore } from '../stores/xxx-store'

describe('xxxStore', () => {
  it('should update state via actions', () => {
    xxxStore.setSomeValue('test')
    expect(get(xxxStore.someValue)).toBe('test')
  })

  it('should derive computed values', () => {
    xxxStore.setSomeValue('test')
    expect(get(xxxStore.hasValue)).toBe(true)
  })

  it('should reset state', () => {
    xxxStore.reset()
    expect(get(xxxStore.someValue)).toBeNull()
  })
})
```

### Component (medium-low priority)
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import XxxComponent from '../components/XxxComponent.svelte'

describe('XxxComponent', () => {
  it('should render with props', () => {
    render(XxxComponent, { props: { items: [], isLoading: false } })
    expect(screen.getByText('No items found')).toBeDefined()
  })

  it('should show loading state', () => {
    render(XxxComponent, { props: { items: [], isLoading: true } })
    expect(screen.getByText('Loading...')).toBeDefined()
  })

  it('should call callback on interaction', async () => {
    const onselect = vi.fn()
    const items = [{ id: '1', name: 'Item 1' }]
    render(XxxComponent, { props: { items, onselect } })
    await fireEvent.click(screen.getByText('Item 1'))
    expect(onselect).toHaveBeenCalledWith(items[0])
  })
})
```

3. Create the test in `__tests__/OriginalName.spec.ts`.

4. Run: `npx vitest run --reporter=verbose`
