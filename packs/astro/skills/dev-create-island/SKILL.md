---
name: dev-create-island
description: "Use when adding an interactive UI component that requires client-side JavaScript - creates a framework island with hydration strategy."
user-invocable: true
argument-hint: "[IslandName]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create an interactive island component following `docs/ARCHITECTURE.md` section 5.2.

Island: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 5.2.

2. Confirm interactivity is required - if the component is purely presentational, use `/dev-create-component` instead.

3. Determine the framework (based on project preference):
   - **React** -> `src/islands/IslandName.tsx`
   - **Vue** -> `src/islands/IslandName.vue`
   - **Svelte** -> `src/islands/IslandName.svelte`

4. Choose hydration strategy:
   - `client:load` - immediately visible + interactive (above the fold)
   - `client:idle` - not urgent, hydrate when browser is idle
   - `client:visible` - below the fold, hydrate when scrolled into view
   - `client:media="(max-width: 768px)"` - only on specific viewports
   - `client:only="react"` - skip SSR entirely (browser-API-dependent)

5. Create the island with typed props (React example):

```tsx
interface Props {
  // all props must be serializable (no functions, no class instances)
}

export default function IslandName({ prop1, prop2 }: Props) {
  // minimal client-side state and interactivity
  return (
    <div>
      {/* interactive UI */}
    </div>
  )
}
```

6. Usage example in .astro file:

```astro
---
import IslandName from '../islands/IslandName'
---
<IslandName client:idle prop1="value" prop2={42} />
```

7. Checklist:
   - Props are serializable (no functions, no class instances)
   - Least aggressive hydration strategy chosen
   - Island scope is minimal (non-interactive parts in .astro)
   - PascalCase filename matching framework convention

8. Validate: `npx astro check && npx astro build`
