---
name: migration-migrate-component
description: "Use when a component needs migration to the target architecture or framework version."
user-invocable: true
argument-hint: "[component-file]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Migrate a Svelte component from Svelte 4 patterns to Svelte 5 runes following `docs/ARCHITECTURE.md` section 5.

Component: $ARGUMENTS

## Steps

1. Read `docs/ARCHITECTURE.md` section 5.

2. Analyze the component:
   - Count lines (template, script, style)
   - List: props (export let), reactive ($:), event dispatchers, slots, lifecycle hooks
   - Map who imports this component

3. Convert to Svelte 5 runes:
   - `export let prop` -> `let { prop }: Props = $props()` with typed interface
   - `export let prop = default` -> `let { prop = default }: Props = $props()`
   - `$$restProps` -> `let { ...rest } = $props()`
   - `let x = 0` (reactive) -> `let x = $state(0)`
   - `$: derived = expr` -> `let derived = $derived(expr)`
   - `$: { sideEffect() }` -> `$effect(() => { sideEffect() })`
   - `createEventDispatcher()` -> callback props (`onxxx?: (data) => void`)
   - `dispatch('event', data)` -> `onxxx?.(data)`
   - `<slot>` -> `{@render children()}`
   - `<slot name="header">` -> `{@render header()}`
   - `on:click={handler}` -> `onclick={handler}`
   - `on:click|preventDefault` -> `onclick={(e) => { e.preventDefault(); handler(e) }}`
   - `onMount(() => {...})` -> `$effect(() => {...})` with cleanup return

4. Also check for SvelteKit 1 patterns:
   - `$app/stores` -> `$app/state`
   - `throw redirect()` -> `redirect()` (no throw)
   - `throw error()` -> `error()` (no throw)

5. Apply composition pattern if there is prop drilling.

6. Decompose if > 200 lines.

7. Validate:
```bash
npx svelte-check --tsconfig ./tsconfig.json
npx vite build
npx vitest run --passWithNoTests
```
