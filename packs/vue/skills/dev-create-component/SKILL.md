---
name: dev-create-component
description: "Use when adding a new UI component to an existing module - handles templates, props, and test scaffolding."
user-invocable: true
argument-hint: "[ComponentName]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a Vue component following `docs/ARCHITECTURE.md` section 5.

Component: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 5.

2. Determine the type:
   - **Feature component** → `src/modules/[module]/components/ComponentName.vue`
   - **Shared component** → `src/shared/components/ComponentName.vue`
   - **View (page)** → `src/modules/[module]/views/ViewName.vue`

3. Create the component with the standard template:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  // type all props
}

interface Emits {
  // type all emits
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// composables, state, computed, handlers...
</script>

<template>
  <!-- clean template, < 100 lines -->
</template>

<style scoped>
/* styles */
</style>
```

4. Checklist:
   - `<script setup lang="ts">` ✅
   - Type-based props ✅
   - Type-based emits ✅
   - < 200 lines ✅
   - PascalCase.vue ✅

5. Validate: `npx tsc --noEmit`
