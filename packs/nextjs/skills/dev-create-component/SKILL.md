---
name: dev-create-component
description: "Use when adding a new UI component to an existing module - handles templates, props, and test scaffolding."
user-invocable: true
argument-hint: "[ComponentName]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a React component following `docs/ARCHITECTURE.md` section 5.

Component: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 5.

2. Determine the type:
   - **Feature component** -> `src/modules/[module]/components/ComponentName.tsx`
   - **Shared component** -> `src/shared/components/ComponentName.tsx`

3. Determine Server vs Client using the decision tree:
   - Needs hooks (useState, useEffect, useQuery, useStore)? -> Client
   - Needs event handlers (onClick, onChange)? -> Client
   - Needs browser APIs? -> Client
   - Only renders data? -> Server
   - Only composes other components? -> Server

4. **Server Component template:**

```tsx
import type { XxxItem } from '../types/xxx.contracts'

interface XxxComponentProps {
  item: XxxItem
}

export function XxxComponent({ item }: XxxComponentProps) {
  return (
    <div>
      {/* clean JSX, < 100 lines */}
    </div>
  )
}
```

5. **Client Component template:**

```tsx
'use client'

import { useState } from 'react'
import type { XxxItem } from '../types/xxx.contracts'

interface XxxComponentProps {
  items: XxxItem[]
  onSelect?: (item: XxxItem) => void
}

export function XxxComponent({ items, onSelect }: XxxComponentProps) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(item: XxxItem) {
    setSelected(item.id)
    onSelect?.(item)
  }

  return (
    <div>
      {/* clean JSX, < 100 lines */}
    </div>
  )
}
```

6. Checklist:
   - `'use client'` if needed (hooks, events, browser APIs)
   - Typed props interface
   - < 200 lines total
   - PascalCase.tsx
   - Loading / error / empty states handled

7. Validate: `npx tsc --noEmit`
