# Visao Geral da Arquitetura

O arquivo `docs/ARCHITECTURE.md` e uma configuracao **opcional** que personaliza como os agentes geram e revisam codigo no seu projeto. Quando presente, todos os agentes seguem seus padroes. Quando ausente, os agentes usam boas praticas genericas para o seu framework.

::: tip Opcional
Use `specialist-agent detect` para analisar seu projeto e gerar um guia de arquitetura. Voce tambem pode criar `docs/ARCHITECTURE.md` manualmente.
:::

## Como Funciona

1. Execute `specialist-agent detect` para analisar e gerar `docs/ARCHITECTURE.md`
2. Os agentes verificam se o arquivo existe antes de cada acao
3. Se encontrado, seguem seus padroes para geracao e revisao de codigo
4. Se nao encontrado, usam boas praticas genericas
5. Edite o arquivo a qualquer momento para mudar o comportamento dos agentes — sem reiniciar

## Padrao Default

Quando `docs/ARCHITECTURE.md` e instalado, ele fornece uma arquitetura de quatro camadas como ponto de partida. Isso **nao e obrigatorio** — voce pode editar ou substituir por qualquer padrao que se encaixe no seu projeto (Clean Architecture, Hexagonal, DDD, Feature-Sliced Design, ou o seu proprio).

```mermaid
graph LR
    S["Service<br/><i>Apenas HTTP</i>"] --> A["Adapter<br/><i>Parsear & Transformar</i>"]
    A --> L["Camada Logica<br/><i>Orquestrar</i>"]
    L --> UI["Component<br/><i>UI</i>"]

    style S fill:#2d3748,color:#fff
    style A fill:#4a5568,color:#fff
    style L fill:#2d3748,color:#fff
    style UI fill:#4a5568,color:#fff
```

| Camada | Faz | NAO Faz |
|--------|-----|---------|
| **Service** | Chamadas HTTP | try/catch, transformacao, logica |
| **Adapter** | Parsear API ↔ App (snake_case → camelCase) | HTTP, efeitos colaterais |
| **Logica** | Orquestrar service + adapter + estado | Renderizar UI |
| **State Store** | Estado do cliente (UI, filtros, preferencias) | Estado do servidor, HTTP |
| **Component** | UI + composicao | Logica de negocio pesada |

### Equivalentes por Framework

Cada framework tem sua propria terminologia e ferramentas idiomaticas. A tabela abaixo mostra **escolhas comuns** — nao prescricoes. Use o que fizer sentido para o seu projeto:

| Camada | Vue | React | Next.js | SvelteKit | Angular | Astro | Nuxt |
|--------|-----|-------|---------|-----------|---------|-------|------|
| **Logica** | Composable | Hook | Hook / Server Action | Load function | Service + inject() | Endpoint | Composable / useFetch |
| **Estado cliente** | Pinia, etc. | Zustand, Redux, etc. | Zustand, etc. | Svelte stores | Signals, NgRx | — | Pinia / useState |
| **Estado servidor** | Vue Query, etc. | React Query, SWR, etc. | RSC, React Query, etc. | SvelteKit load | HttpClient, etc. | — | useFetch / useAsyncData |
| **Componente** | SFC (.vue) | JSX (.tsx) | JSX (.tsx) | .svelte | Standalone component | .astro / Islands | SFC (.vue) |

## Estrutura Modular

Cada funcionalidade e um modulo autocontido:

```text
src/modules/[feature]/
├── components/     ← UI
├── logic/          ← Orquestracao (hooks, composables, load functions)
├── services/       ← HTTP puro (sem try/catch)
├── adapters/       ← Parsers (API ↔ App)
├── stores/         ← Apenas estado do cliente
├── types/          ← .types.ts (API) + .contracts.ts (App)
├── views/          ← Paginas
├── __tests__/      ← Testes
└── index.ts        ← Barrel export (API publica)
```

## Regras de Importacao

```mermaid
graph LR
    App["app/"] -->|"importa"| ModA["modules/auth"]
    App -->|"importa"| ModB["modules/products"]
    ModA -->|"importa"| Shared["shared/"]
    ModB -->|"importa"| Shared
    ModA -.->|"nunca"| ModB

    style App fill:#2d3748,color:#fff
    style ModA fill:#4a5568,color:#fff
    style ModB fill:#4a5568,color:#fff
    style Shared fill:#2d3748,color:#fff
```

- **Modules → Shared**: Permitido
- **Modules → Modules**: Nunca (mova o codigo compartilhado para `shared/`)
- **App → Modules**: Apenas router e registro

## Convencoes de Nomenclatura

### Arquivos

| Tipo | Padrao | Exemplo |
|------|--------|---------|
| Diretorios | `kebab-case` | `user-settings/` |
| Componentes | `PascalCase` | `UserSettingsForm` |
| Views / Paginas | `PascalCase` | `MarketplaceView` |
| Logica (hooks, etc.) | `use` + `PascalCase.ts` | `useProductsList.ts` |
| Services | `kebab-case-service.ts` | `products-service.ts` |
| Adapters | `kebab-case-adapter.ts` | `products-adapter.ts` |
| Types | `kebab-case.types.ts` | `products.types.ts` |
| Contracts | `kebab-case.contracts.ts` | `products.contracts.ts` |

### Codigo

| Tipo | Padrao | Exemplo |
|------|--------|---------|
| Variaveis / funcoes | `camelCase` | `getUserById`, `isLoading` |
| Types / Interfaces | `PascalCase` | `UserProfile`, `Product` |
| Constantes | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |
| Booleanos | `is`/`has`/`can`/`should` | `isLoading`, `hasPermission` |
| Event handlers | `handle` + acao | `handleSubmit`, `handleDelete` |

## Padroes Principais

- **Evite Prop Drilling**: Use padroes de composicao nativos do seu framework
- **Utils vs Helpers**: Utils = funcoes puras, Helpers = funcoes com efeitos colaterais
- **Tratamento de Erros**: Centralizado na camada de logica
- **SOLID**: Cada arquivo = 1 responsabilidade

## Sem ARCHITECTURE.md

Quando nao ha `docs/ARCHITECTURE.md` no projeto:

- **Agentes funcionam normalmente** — usam padroes genericos para o seu framework
- **@planner** nota a ausencia e usa padroes genericos
- **@builder** gera codigo usando convencoes padroes do framework
- **@reviewer** revisa contra boas praticas gerais

Para adicionar depois:

```bash
# Copie do pack do seu framework instalado
cp node_modules/specialist-agent/packs/{framework}/ARCHITECTURE.md docs/ARCHITECTURE.md
```

## Mergulho Profundo

- [Camadas](/pt-BR/guide/layers) — Exemplos detalhados de cada camada
- [Componentes](/pt-BR/guide/components) — Padroes e composicao de componentes
- Referencia completa: `docs/ARCHITECTURE.md` no seu projeto (se instalado)
