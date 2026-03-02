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
   - **Page** -> `src/modules/[module]/pages/PageName.tsx`

3. Create the component with the standard template:

```tsx
import { useState, useMemo, useCallback } from 'react'

interface ComponentNameProps {
  // type all props
}

export function ComponentName({ /* destructure props */ }: ComponentNameProps) {
  // 1. Stores (selectors)
  // 2. Hooks
  // 3. Local state (useState)
  // 4. Derived state (useMemo)
  // 5. Handlers (useCallback)

  return (
    <div>
      {/* clean JSX, < 100 lines */}
    </div>
  )
}
```

4. Checklist:
   - Functional component (no class)
   - TypeScript props interface
   - Callback props typed (onSelect, onChange)
   - < 200 lines
   - PascalCase.tsx

5. Validate: `npx tsc --noEmit`
