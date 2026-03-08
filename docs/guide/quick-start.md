# Quick Start

Get running in under 2 minutes.

## 1. Install

```sh
npx specialist-agent init
```

The CLI will ask you to:

1. Pick your framework (or "No framework" for empty projects)
2. Choose agent mode (Full for Sonnet/Opus, Lite for Haiku)
3. Select which agent groups to install
4. Configure native hooks (optional)

## 2. Use an Agent

Open your AI assistant and call an agent:

```txt
Use @builder to create the products module with CRUD and validation
```

```txt
Use @reviewer to review src/modules/auth/
```

```txt
Use @sentry-triage to check Sentry errors from the last 24h
```

## 3. Use a Skill

Skills are repeatable workflows:

```txt
/plan add user authentication with JWT and refresh tokens
```

```txt
/autofix --timeframe=24h
```

```txt
/tdd create the payment validation service
```

## 4. Combine Agents + Skills

The real power is combining them:

```txt
/plan add real-time notifications
→ @builder implements
→ @reviewer reviews
→ /verify confirms
```

## What's Next

- [Agent Catalog](/reference/agents) — All 35 agents by category
- [Skills Reference](/reference/skills) — All 24 skills
- [Best Practices](/guide/best-practices) — Get the most out of your agents
