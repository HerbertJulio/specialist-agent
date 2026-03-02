---
name: dev-create-component
description: "Use when adding a new UI component to the project - handles templates, props, and scoped styles."
user-invocable: true
argument-hint: "[ComponentName]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create an Astro component following `docs/ARCHITECTURE.md` section 5.

Component: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 5.

2. Determine the type:
   - **Feature component** -> `src/components/ComponentName.astro`
   - **Shared component** -> `src/shared/components/ComponentName.astro`
   - **Layout** -> `src/layouts/LayoutName.astro`

3. Create the component with the standard template:

```astro
---
interface Props {
  // type all props
}

const { prop1, prop2 } = Astro.props
---

<div class="component-name">
  <!-- clean template -->
</div>

<style>
  /* scoped styles */
</style>
```

4. Checklist:
   - `Props` interface defined
   - Props destructured from `Astro.props`
   - PascalCase.astro filename
   - Scoped `<style>` tag
   - No JavaScript shipped (zero JS)
   - No event handlers (use island if needed)

5. Validate: `npx astro check`
