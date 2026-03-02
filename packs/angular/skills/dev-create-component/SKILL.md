---
name: dev-create-component
description: "Use when adding a new UI component to an existing module - handles templates, inputs, and test scaffolding."
user-invocable: true
argument-hint: "[ComponentName]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create an Angular standalone component following `docs/ARCHITECTURE.md` section 5.

Component: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 5.

2. Determine the type:
   - **Feature component** -> `src/modules/[module]/components/kebab-case.component.ts`
   - **Shared component** -> `src/shared/components/kebab-case.component.ts`
   - **Page** -> `src/modules/[module]/pages/kebab-case-page.component.ts`

3. Create the component with the standard template:

```typescript
import { Component, ChangeDetectionStrategy, inject, input, output, signal, computed } from '@angular/core'

@Component({
  selector: 'app-kebab-case',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- clean template, < 100 lines -->
  `,
})
export class PascalCaseComponent {
  // Inputs / Outputs (signal-based)
  readonly myInput = input<string>()
  readonly myOutput = output<string>()

  // Injected dependencies
  private readonly service = inject(MyService)

  // Local state, computed, handlers...
}
```

4. Checklist:
   - Standalone component ✅
   - input()/output() signals ✅
   - inject() for DI ✅
   - OnPush change detection ✅
   - < 200 lines ✅
   - kebab-case.component.ts ✅

5. Validate: `npx tsc --noEmit`
