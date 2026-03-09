# Inicio Rapido

Comece a usar em menos de 2 minutos.

## 1. Instale

```sh
npx specialist-agent init
```

O CLI vai pedir para voce:

1. Escolher seu framework (ou "No framework" para projetos vazios)
2. Escolher o modo dos agentes (Full para Sonnet/Opus, Lite para Haiku)
3. Selecionar quais grupos de agentes instalar
4. Configurar native hooks (opcional)

## 2. Use um Agente

Abra seu assistente de IA e chame um agente:

```
Use @builder to create the products module with CRUD and validation
```

```
Use @reviewer to review src/modules/auth/
```

```
Use @sentry-triage to check Sentry errors from the last 24h
```

## 3. Use uma Skill

Skills sao fluxos de trabalho repetitivos:

```
/plan add user authentication with JWT and refresh tokens
```

```
/autofix --timeframe=24h
```

```
/tdd create the payment validation service
```

## 4. Combine Agentes + Skills

O verdadeiro poder esta em combinar:

```txt
/plan add real-time notifications
→ @builder implements
→ @reviewer reviews
→ /verify confirms
```

## Proximo Passo

- [Catalogo de Agentes](/pt-BR/reference/agents) — Todos os 35 agentes por categoria
- [Referencia de Skills](/pt-BR/reference/skills) — Todas as 24 skills
- [Boas Praticas](/pt-BR/guide/best-practices) — Tire o maximo dos seus agentes
