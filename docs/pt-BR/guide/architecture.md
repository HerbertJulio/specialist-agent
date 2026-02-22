# Visao Geral da Arquitetura

O `docs/ARCHITECTURE.md` no seu projeto e a **fonte de verdade** que todos os agentes seguem. Esta pagina resume os padroes principais.

## Estrutura Modular

Cada funcionalidade e um modulo autocontido:

```text
src/modules/[feature]/
├── components/     ← UI
├── composables/    ← Logica (service → adapter → query)
├── services/       ← HTTP puro (sem try/catch)
├── adapters/       ← Parsers (API ↔ App)
├── stores/         ← Apenas estado do cliente (Pinia)
├── types/          ← .types.ts (API) + .contracts.ts (App)
├── views/          ← Paginas
├── __tests__/      ← Testes
└── index.ts        ← Barrel export (API publica)
```

## Regras de Importacao

```mermaid
graph LR
    App["app/"] -->|"✅ imports"| ModA["modules/auth"]
    App -->|"✅ imports"| ModB["modules/market"]
    ModA -->|"✅ imports"| Shared["shared/"]
    ModB -->|"✅ imports"| Shared
    ModA -.->|"❌ never"| ModB

    style App fill:#42b883,color:#fff
    style ModA fill:#35495e,color:#fff
    style ModB fill:#35495e,color:#fff
    style Shared fill:#42b883,color:#fff
```

- **Modules → Shared**: ✅ Permitido
- **Modules → Modules**: ❌ Nunca (mova o codigo compartilhado para `shared/`)
- **App → Modules**: ✅ Apenas router e registro

## Arquitetura de Quatro Camadas

```mermaid
graph LR
    S["🌐 Service<br/><i>HTTP only</i>"] --> A["🔄 Adapter<br/><i>Parse & Transform</i>"]
    A --> C["⚙️ Composable<br/><i>Orchestrate + Vue Query</i>"]
    C --> UI["🖼️ Component<br/><i>UI + Template</i>"]

    style S fill:#35495e,color:#fff
    style A fill:#42b883,color:#fff
    style C fill:#35495e,color:#fff
    style UI fill:#42b883,color:#fff
```

| Camada | Faz | NAO Faz |
|--------|-----|---------|
| **Service** | Chamadas HTTP | try/catch, transformacao, logica |
| **Adapter** | Parsear API ↔ App (snake_case → camelCase) | HTTP, efeitos colaterais |
| **Composable** | Orquestrar service + adapter + Vue Query | Renderizar UI |
| **Pinia Store** | Estado do cliente (UI, filtros, preferencias) | Estado do servidor, HTTP |
| **Component** | UI + composicao | Logica de negocio pesada |

## Exemplo de Fluxo de Dados

Veja o que acontece quando um usuario visita a pagina de Produtos:

```mermaid
sequenceDiagram
    participant User
    participant Component as ProductsView.vue
    participant Composable as useProductsList
    participant Service as products-service
    participant API as REST API
    participant Adapter as products-adapter

    User->>Component: Navigate to /products
    Component->>Composable: useProductsList({ page: 1 })
    Composable->>Service: marketplaceService.list({ page: 1 })
    Service->>API: GET /v2/products?page=1
    API-->>Service: { data: [...], total_pages: 5 }
    Service-->>Composable: raw API response
    Composable->>Adapter: toProductList(response)
    Adapter-->>Composable: { items: Product[], totalPages: 5 }
    Composable-->>Component: { items, isLoading, totalPages }
    Component-->>User: Rendered product table
```

::: tip Separacao de Gerenciamento de Estado
**Pinia** = Estado do cliente (UI, filtros, preferencias)
**Vue Query** = Estado do servidor (dados da API, cache, atualizacao em segundo plano)
:::

## Convencoes de Nomenclatura

### Arquivos

| Tipo | Padrao | Exemplo |
|------|--------|---------|
| Diretorios | `kebab-case` | `user-settings/` |
| Componentes | `PascalCase.vue` | `UserSettingsForm.vue` |
| Views | `PascalCase + View.vue` | `MarketplaceView.vue` |
| Composables | `use + PascalCase.ts` | `useMarketplaceList.ts` |
| Services | `kebab-case-service.ts` | `marketplace-service.ts` |
| Adapters | `kebab-case-adapter.ts` | `marketplace-adapter.ts` |
| Stores | `kebab-case-store.ts` | `marketplace-store.ts` |
| Types | `kebab-case.types.ts` | `marketplace.types.ts` |
| Contracts | `kebab-case.contracts.ts` | `marketplace.contracts.ts` |

### Codigo

| Tipo | Padrao | Exemplo |
|------|--------|---------|
| Variaveis / funcoes | `camelCase` | `getUserById`, `isLoading` |
| Types / Interfaces | `PascalCase` | `UserProfile`, `MarketplaceItem` |
| Constantes | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |
| Composables | `use` + `PascalCase` | `useAuth`, `useMarketplaceList` |
| Booleanos | `is`/`has`/`can`/`should` | `isLoading`, `hasPermission` |
| Event handlers | `handle` + acao | `handleSubmit`, `handleDelete` |

## Padroes Principais

- **Pare o Prop Drilling**: Use slots + provide/inject + composables diretos
- **Utils vs Helpers**: Utils = funcoes puras, Helpers = funcoes com efeitos colaterais
- **Tratamento de Erros**: Centralizado nos composables (Vue Query `onError`)
- **SOLID no Vue**: Cada arquivo = 1 responsabilidade

## Mergulho Profundo

- [Camadas](/pt-BR/guide/layers) — Exemplos detalhados de cada camada
- [Componentes](/guide/components) — Padroes e composicao de componentes
- Referencia completa: `docs/ARCHITECTURE.md` no seu projeto
