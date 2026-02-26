# Introduction

Specialist Agent is a collection of AI agents that help you build software faster.

## How It Works

1. You describe what you need
2. The right agent handles it
3. You get production-ready code

```
"Create a products module with CRUD"
→ @builder creates types, service, components, tests

"Review the auth module"
→ @reviewer checks quality, architecture, security

"Debug the login error"
→ @debugger traces through layers to find root cause
```

## Install

**Marketplace:**
```
/plugin install specialist-agent
```

**CLI:**
```bash
npx specialist-agent init
```

Works with Claude Code, Cursor, VS Code, Windsurf, and Codex.

## Choose Your Scenario

### I want to...

| Goal | Agent | Example |
|------|-------|---------|
| Build a new feature | `@builder` | "Create user registration" |
| Review code | `@reviewer` | "Review the auth module" |
| Debug an issue | `@debugger` | "Fix the 500 error on login" |
| Design an API | `@api` | "Design REST API for orders" |
| Add payments | `@finance` | "Integrate Stripe checkout" |
| Add authentication | `@security` | "Implement JWT auth" |
| Optimize performance | `@perf` | "Optimize the dashboard" |
| Add translations | `@i18n` | "Add Portuguese support" |
| Modernize legacy code | `@migrator` | "Migrate to TypeScript" |
| Plan a complex feature | `@planner` | "Plan the checkout flow" |
| Audit code before release | `/audit` | "/audit src/modules/auth" |
| Onboard to new codebase | `/onboard` | "/onboard" |

## Framework Support

| Framework | What You Get |
|-----------|--------------|
| Next.js | App Router patterns, Server Components |
| React | Hooks, React Query, Zustand |
| Vue 3 | Composition API, Pinia, Vue Query |
| SvelteKit | Stores, load functions |

Each framework has specific patterns for services, state, and components.

## Full vs Lite Mode

| Mode | Best For | Cost |
|------|----------|------|
| Full | Complex features, PRs | Standard |
| Lite | Quick tasks, scaffolding | 60-80% less |

Lite mode uses a smaller model for faster, cheaper results.

## Next Steps

1. [See real scenarios](/scenarios/) — How developers use each agent
2. [Start building](/scenarios/build-feature) — Create your first feature
3. [Browse all agents](/reference/agents) — Full reference
