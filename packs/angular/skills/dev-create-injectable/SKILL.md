---
name: dev-create-injectable
description: "Use when adding a signal-based store or utility service - creates injectable with inject() and Angular Signals."
user-invocable: true
argument-hint: "[injectable-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create an Angular injectable following `docs/ARCHITECTURE.md` section 4.4.

Injectable: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 4.4.

2. Determine the type:
   - **Signal store** (client state) -> manages UI state with WritableSignal
   - **Utility service** (shared logic) -> injectable with inject() for deps
   - **Data orchestrator** (API + adapter) -> injects Service, applies adapter

3. Create the injectable in the appropriate location:

### Signal Store
```typescript
import { Injectable, signal, computed } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class MyStore {
  private readonly _state = signal<StateType>(initialValue)
  readonly state = this._state.asReadonly()
  readonly derived = computed(() => /* derive from _state */)

  updateState(value: StateType) {
    this._state.set(value)
  }
}
```

### Utility Service
```typescript
import { Injectable, inject } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class MyUtilityService {
  private readonly dep = inject(OtherService)

  doSomething(input: InputType): OutputType {
    // typed logic
  }
}
```

4. Rules:
   - @Injectable({ providedIn: 'root' }) or scoped to component
   - inject() for all dependencies - no constructor DI
   - Private WritableSignal, public asReadonly() for stores
   - No HTTP calls in stores (services handle that)

5. Validate: `npx tsc --noEmit`
