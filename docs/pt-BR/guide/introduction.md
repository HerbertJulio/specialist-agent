# Introducao

## O Problema

Assistentes de IA para codigo sao generalistas. Eles escrevem codigo, mas nao aplicam arquitetura, nao seguem os padroes do seu time, e nao pegam o que um engenheiro senior pegaria.

Voce acaba:

- Re-explicando as mesmas convencoes a cada sessao
- Recebendo codigo que "funciona" mas nao segue sua arquitetura
- Perdendo problemas de seguranca, performance ou compliance
- Fazendo code review manual em codigo gerado por IA

## A Solucao

Specialist Agent da ao seu assistente de IA um time de especialistas. Em vez de um generalista, voce tem:

- **@builder** que conhece os padroes de componentes do seu framework
- **@reviewer** que aplica SOLID, seguranca e regras de arquitetura
- **@security** que detecta problemas do OWASP Top 10
- **@sentry-triage** que faz triagem de erros em producao automaticamente

Cada agente carrega conhecimento, regras e fluxos de trabalho especificos. Eles nao apenas escrevem codigo — eles aplicam padroes.

## Como Funciona

Voce instala os agentes no seu projeto. Quando precisa de algo, chama o agente certo:

```
> Use @builder to create the products module with CRUD
> Use @sentry-triage to check errors from the last 24h
> Use @reviewer to review src/modules/auth/
> /plan add real-time notifications with WebSocket
```

## Categorias de Agentes

| Categoria | Agentes | Proposito |
|-----------|---------|-----------|
| **Core** | 5 | Construir, revisar, debugar, migrar |
| **Workflow** | 9 | Planejar, executar, testar, pair programming |
| **Engenharia** | 17 | API, seguranca, dados, DevOps, arquitetura |
| **Negocios** | 3 | Marketing, produto, suporte |
| **Automacao** | 1 | Triagem Sentry, correcao automatica de erros em producao |

## Skills

Skills sao workflows repetiveis que voce invoca com um comando de barra:

| Categoria | Skills |
|-----------|--------|
| Planejamento | `/brainstorm`, `/plan`, `/discovery`, `/estimate` |
| Desenvolvimento | `/tdd`, `/debug`, `/autofix`, `/lint`, `/commit` |
| Qualidade | `/verify`, `/codereview`, `/audit`, `/health` |
| Workflow | `/checkpoint`, `/finish`, `/worktree`, `/learn` |
| Migracao | `/migrate-framework`, `/migrate-architecture` |
| Conhecimento | `/remember`, `/recall`, `/onboard`, `/tutorial`, `/write-skill` |

## O que Diferencia

| Feature | IA Generica | Specialist Agent |
|---------|------------|-----------------|
| Aplicacao de arquitetura | Nao | Agentes aplicam seu ARCHITECTURE.md |
| Padroes de framework | Generico | 7 packs de framework com agentes otimizados |
| Profundidade de review | Superficial | Review 3-em-1 (qualidade + seguranca + arquitetura) |
| Ops em producao | Manual | @sentry-triage faz triagem automatica |
| Agentes de negocio | Nao | @marketing, @product, @support |
| Fluxos repetitivos | Manual | 24 skills (/plan, /tdd, /autofix, ...) |
| Multi-plataforma | Varia | 6 plataformas suportadas |

## Packs de Frameworks

Cada framework recebe agentes otimizados com padroes especificos:

**Vue 3** | **React** | **Next.js** | **SvelteKit** | **Angular** | **Astro** | **Nuxt**

## Plataformas Suportadas

Funciona em: **Claude Code**, **Cursor**, **VS Code**, **Windsurf**, **Codex**, **OpenCode**

## Para Quem

- **Devs solo** que querem review de nivel senior em cada commit
- **Times** que querem padronizar como a IA auxilia o desenvolvimento
- **Startups** que precisam ir rapido sem acumular divida tecnica
- **Enterprise** que precisa de compliance, seguranca e aplicacao de arquitetura

## Proximos Passos

- [Quick Start](/pt-BR/guide/quick-start) — Instale e use seu primeiro agente
- [Catalogo de Agentes](/pt-BR/reference/agents) — Todos os 35 agentes
- [Referencia de Skills](/pt-BR/reference/skills) — Todas as 24 skills
