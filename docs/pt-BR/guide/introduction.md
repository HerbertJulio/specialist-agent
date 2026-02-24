# Introducao

## O que e o Specialist Agent?

Specialist Agent e uma colecao open-source de **agentes**, **skills** e **convencoes arquiteturais** projetada para o [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

Uma vez instalado no seu projeto, o Claude segue automaticamente as regras da sua arquitetura, gera codigo consistente, revisa PRs, migra codigo legado e muito mais.

**Nao e uma biblioteca ou framework** — e um conjunto de instrucoes em markdown que fazem o Claude Code trabalhar como um desenvolvedor senior que conhece as convencoes do seu codebase.

## Framework Packs

O Specialist Agent organiza agentes e padroes em **framework packs**. Cada pack fornece agentes, skills e padroes de arquitetura especificos para a stack:

| Pack | Stack |
|------|-------|
| **Vue 3** | Vue 3 + TypeScript + Pinia + TanStack Vue Query |
| **React** | React 18 + TypeScript + Zustand + TanStack React Query |
| **Next.js** | Next.js 14+ (App Router) + TypeScript + Zustand + Server Components |
| **SvelteKit** | SvelteKit 2 + TypeScript + Svelte stores + load functions |

## O Que Voce Recebe

| Recurso | Quantidade | Descricao |
|---------|------------|-----------|
| Agentes de IA | 13 | Starter, explorer, builder, reviewer, migrator, doctor + 7 especialistas |
| Agentes Lite | 13 | Mesmos agentes rodando no modelo Haiku (custo menor) |
| Skills | 12 | Atalhos para gerar e validar codigo |
| Guia de Arquitetura | 1 | Fonte de verdade abrangente para todos os padroes |

## Seu Time de IA

O Specialist Agent possui **13 agentes** organizados por cenario:

```mermaid
graph TB
    Claude{"O que voce precisa?"} -->|"novo projeto"| setup
    Claude -->|"construir & revisar"| daily
    Claude -->|"modernizar"| migration
    Claude -->|"expertise de dominio"| specialists

    subgraph setup["Criacao de Projeto"]
        Starter["@starter<br/><i>Criar projetos do zero</i>"]
        Explorer["@explorer<br/><i>Avaliar codebases</i>"]
    end

    subgraph daily["Desenvolvimento Dia a Dia"]
        Builder["@builder<br/><i>Construir features, componentes</i>"]
        Reviewer["@reviewer<br/><i>Revisar codigo, performance</i>"]
        Doctor["@doctor<br/><i>Investigar bugs, rastrear erros</i>"]
    end

    subgraph migration["Migracao de Arquitetura"]
        Migrator["@migrator<br/><i>Modernizar codigo legado</i>"]
    end

    subgraph specialists["Agentes Especialistas"]
        Finance["@finance<br/><i>Pagamentos, billing</i>"]
        Cloud["@cloud<br/><i>IaC, serverless</i>"]
        Security["@security<br/><i>Auth, OWASP</i>"]
        Designer["@designer<br/><i>Design systems</i>"]
        Data["@data<br/><i>Modelagem de dados</i>"]
        DevOps["@devops<br/><i>Docker, K8s</i>"]
        Tester["@tester<br/><i>Estrategia de testes</i>"]
        Finance ~~~ Designer
        Cloud ~~~ Data
        Security ~~~ DevOps
        Designer ~~~ Tester
    end

    style Claude fill:#35495e,color:#fff
    style setup fill:#f5f0fa,stroke:#7c3aed
    style daily fill:#f0faf5,stroke:#42b883
    style migration fill:#f0f4fa,stroke:#35495e
    style specialists fill:#faf5f0,stroke:#e67e22
    style Starter fill:#7c3aed,color:#fff
    style Explorer fill:#7c3aed,color:#fff
    style Finance fill:#e67e22,color:#fff
    style Cloud fill:#e67e22,color:#fff
    style Security fill:#e67e22,color:#fff
    style Designer fill:#e67e22,color:#fff
    style Data fill:#e67e22,color:#fff
    style DevOps fill:#e67e22,color:#fff
    style Tester fill:#e67e22,color:#fff
    style Builder fill:#42b883,color:#fff
    style Reviewer fill:#42b883,color:#fff
    style Doctor fill:#42b883,color:#fff
    style Migrator fill:#35495e,color:#fff
```

| Cenario | Agentes | Quando |
|---------|---------|--------|
| **Criacao de Projeto** | `@starter` `@explorer` | Iniciando um novo projeto ou avaliando um codebase existente |
| **Dia a Dia** | `@builder` `@reviewer` `@doctor` | Construindo funcionalidades, revisando codigo, corrigindo bugs |
| **Migracao** | `@migrator` `@reviewer` | Modernizando projetos legados para a arquitetura alvo |
| **Especialistas** | `@finance` `@cloud` `@security` `@designer` `@data` `@devops` `@tester` | Expertise especifica de dominio em qualquer framework |

## Stack Alvo (Vue Pack)

O Vue pack e projetado para projetos que utilizam:

- Vue 3 + `<script setup lang="ts">`
- Pinia (estado do cliente) + TanStack Vue Query (estado do servidor)
- Vite + TypeScript (strict) + Zod
- Vue Router 4
- Vitest + @vue/test-utils

::: tip Flexivel
Voce pode adaptar os padroes para sua propria stack editando `docs/ARCHITECTURE.md`. Todos os agentes leem este arquivo antes de agir.
:::

## Como Funciona

1. **Instale** o Specialist Agent no seu projeto (copia arquivos markdown)
2. **Abra o Claude Code** no seu projeto
3. **Use agentes e skills** — o Claude delega automaticamente para o especialista certo

```mermaid
sequenceDiagram
    participant You
    participant Claude as Claude Code
    participant Agent as @builder
    participant Arch as ARCHITECTURE.md

    You->>Claude: "Create a products module with CRUD"
    Claude->>Agent: Delegates to @builder
    Agent->>Arch: Reads architecture conventions
    Agent->>Agent: Scaffolds types → adapter → service → composable → components
    Agent-->>You: Complete module ready ✅
```

## Proximos Passos

- [Instalacao](/pt-BR/guide/installation) — Configure o Specialist Agent no seu projeto
- [Inicio Rapido](/pt-BR/guide/quick-start) — Construa uma funcionalidade real passo a passo
- [Visao Geral da Arquitetura](/pt-BR/guide/architecture) — Entenda os padroes

## Tutoriais

### Desenvolvimento Dia a Dia

Use `@builder`, `@reviewer` e `@doctor` para o trabalho cotidiano:

- [Construir um Modulo CRUD](/pt-BR/tutorials/crud-module) — Modulo completo de Pedidos do zero
- [Criar uma Camada de Servico](/pt-BR/tutorials/service-layer) — Integrar um novo endpoint de API
- [Construir Formularios com Validacao](/pt-BR/tutorials/forms) — Zod + useMutation + tratamento de erros
- [Paginacao + Filtros](/pt-BR/tutorials/pagination-filters) — Listas com busca, filtros e paginacao

### Migracao de Arquitetura

Use `@migrator` e `@reviewer` para modernizar projetos legados:

- [Migre Seu Projeto](/pt-BR/tutorials/migrate-project) — Guia de 6 fases de legado para a arquitetura alvo
