---
name: dev-create-test
description: "Use when a module needs test coverage - creates tests for adapters, services, and components."
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
import { xxxAdapter } from '../adapters/xxx.adapter'

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

### Service (medium priority -- mock HttpClient)
```typescript
import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { XxxService } from '../services/xxx.service'

describe('XxxService', () => {
  let service: XxxService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
    service = TestBed.inject(XxxService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  it('should fetch list', () => {
    service.list({ page: 1, pageSize: 20 }).subscribe((data) => {
      expect(data).toBeTruthy()
    })
    const req = httpMock.expectOne('/api/xxx?page=1&pageSize=20')
    expect(req.request.method).toBe('GET')
  })
})
```

### Component (medium-low priority)
```typescript
import { render, screen } from '@testing-library/angular'
import { XxxComponent } from '../components/xxx.component'

describe('XxxComponent', () => {
  it('should render', async () => {
    await render(XxxComponent, { inputs: { /* ... */ } })
    expect(screen.getByText('expected text')).toBeTruthy()
  })
})
```

3. Create the test in `__tests__/original-name.spec.ts`.

4. Run: `ng test --watch=false` or `npx vitest run`
