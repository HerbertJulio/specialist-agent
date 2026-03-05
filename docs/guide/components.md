# Component Patterns

Components are the UI layer. They compose other components, consume data from the logic layer, and handle user interactions. These patterns apply across all frameworks.

## Universal Principles

- **Props in, events out** — components receive data via props and communicate via events/callbacks
- **Composition over inheritance** — build complex UIs by composing small components
- **Small components** — keep components under 200 lines; decompose when larger
- **Handle all states** — loading, error, and empty states must be covered
- **No heavy business logic** — delegate to the logic layer (hooks, composables, services)

## Avoid Prop Drilling

When data needs to pass through multiple component levels, avoid threading props through intermediaries.

Each framework has its own solution:

| Framework | Composition | Shared context |
|-----------|-------------|----------------|
| Vue | Slots | provide / inject |
| React | Children / render props | Context API |
| Next.js | Children / render props | Context API |
| SvelteKit | Slots / snippets | Context (getContext / setContext) |
| Angular | Content projection | Dependency injection |
| Nuxt | Slots | provide / inject |

**The principle is the same across all frameworks:**

1. **Composition** — let parent components inject content into child layout slots
2. **Context** — share state through a scoped provider instead of passing props down

## Component Hierarchy

```text
Views (Pages)         → Composition, orchestration, provide context
  └── Layout          → Visual structure (slots / children)
      └── Features    → Feature logic (hooks, composables, stores)
          └── Shared  → Pure presentation (props in, events out)
```

| Type | Responsibility | Can have logic? | Can have state? |
|------|---------------|-----------------|-----------------|
| **Views** | Compose components, provide context | Via logic layer | Yes (logic layer) |
| **Feature Components** | UI + feature logic | Via logic layer | Yes (logic layer) |
| **Shared Components** | Generic, reusable UI | Minimal (UI only) | Minimal (local) |

## Size Limits

- Total component file: **< 200 lines**
- Template / JSX: **< 100 lines**
- If larger → decompose into sub-components

## Checklist

- [ ] TypeScript with strict types
- [ ] Typed props / inputs
- [ ] Typed events / outputs
- [ ] No prop drilling (use composition or context)
- [ ] Loading / error / empty states handled
- [ ] No business logic in the template / JSX
- [ ] No raw HTML injection without sanitization
