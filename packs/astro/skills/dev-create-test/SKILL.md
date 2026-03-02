---
name: dev-create-test
description: "Use when a module needs test coverage - creates tests for adapters, services, islands, and components."
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

### Service (medium priority - mock fetch)
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { xxxService } from '../services/xxx-service'

describe('xxxService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('should call correct endpoint', async () => {
    const mockResponse = { results: [] }
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    } as Response)

    await xxxService.list({ page: 1, pageSize: 20 })
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/xxx'))
  })
})
```

### Island (medium-low priority - framework test utils)
```typescript
// React island
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import XxxIsland from '../islands/XxxIsland'

describe('XxxIsland', () => {
  it('should render', () => {
    render(<XxxIsland prop1="test" />)
    expect(screen.getByText('test')).toBeDefined()
  })
})
```

3. Create the test in `__tests__/OriginalName.spec.ts`.

4. Run: `npx vitest run --reporter=verbose`
