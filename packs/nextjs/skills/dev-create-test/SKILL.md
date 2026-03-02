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
})
```

### Hook (medium priority -- mock service)
```typescript
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useXxxList } from '../hooks/useXxxList'

vi.mock('../services/xxx-service')

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useXxxList', () => {
  it('should fetch and transform data', async () => {
    const { result } = renderHook(() => useXxxList({ page: 1 }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.items).toBeDefined()
  })
})
```

### Component (medium-low priority -- React Testing Library)
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { XxxComponent } from '../components/XxxComponent'

describe('XxxComponent', () => {
  it('should render items', () => {
    render(<XxxComponent items={mockItems} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('should call onSelect when item is clicked', async () => {
    const onSelect = vi.fn()
    render(<XxxComponent items={mockItems} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Item 1'))
    expect(onSelect).toHaveBeenCalledWith(mockItems[0])
  })
})
```

### Server Action (low priority)
```typescript
import { describe, it, expect, vi } from 'vitest'
import { createXxx } from '../actions/xxx-actions'

vi.mock('../services/xxx-service')
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

describe('createXxx', () => {
  it('should create item and return success', async () => {
    const result = await createXxx({ name: 'Test' })
    expect(result.success).toBe(true)
  })
})
```

3. Create the test in `__tests__/OriginalName.spec.ts(x)`.

4. Run: `npx vitest run --reporter=verbose`
