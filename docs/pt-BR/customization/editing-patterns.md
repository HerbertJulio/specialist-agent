# Editando Padroes

Todos os agentes leem `docs/ARCHITECTURE.md` antes de agir. Ao editar este arquivo, voce altera o comportamento de todos os agentes e comandos.

## O Que Voce Pode Personalizar

### Stack e Dependencias

Se o seu projeto usa bibliotecas diferentes, atualize as secoes relevantes:

```markdown
<!-- Exemplo: Usando Axios em vez de fetch -->
## API Client
We use Axios with a centralized client at `src/shared/services/api-client.ts`.

<!-- Exemplo: Usando uma biblioteca de UI diferente -->
## UI Components
We use PrimeVue for base components. Shared components wrap PrimeVue.
```

### Convencoes de Nomenclatura

Atualize a secao 3 do `ARCHITECTURE.md` para corresponder as convencoes da sua equipe:

```markdown
| Type | Pattern | Example |
|------|---------|---------|
| Components | `PascalCase.vue` | `UserProfile.vue` |
| Services | `kebab-case.service.ts` | `user.service.ts` |
```

### Estrutura de Diretorios

Se a estrutura do seu modulo e diferente, atualize a secao 2:

```markdown
src/features/[name]/    ← em vez de src/modules/[name]/
├── ui/                 ← em vez de components/
├── hooks/              ← em vez de composables/
└── api/                ← em vez de services/ + adapters/
```

### Regras de Camada

Modifique a secao 4 para adicionar ou alterar responsabilidades de camada:

```markdown
### Service Rules
- ✅ HTTP calls with typed request/response
- ✅ Can include retry logic       ← adicionado
- ❌ No try/catch
```

### Limites de Tamanho de Componentes

```markdown
## Component Rules
- Total SFC: < 300 lines    ← alterado de 200
- Template: < 150 lines     ← alterado de 100
```

## Antes e Depois: Como Mudancas Afetam o Output dos Agentes

Quando voce edita o `ARCHITECTURE.md`, os agentes mudam imediatamente o comportamento. Aqui esta um exemplo concreto:

### Exemplo: Trocando de fetch para Axios

**Antes** - ARCHITECTURE.md diz "Use fetch with typed wrappers":

```typescript
// @builder gera este service:
export async function getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
  const query = new URLSearchParams(params as Record<string, string>)
  const response = await fetch(`/v2/orders?${query}`)
  if (!response.ok) throw new Error(`GET /v2/orders failed: ${response.status}`)
  return response.json()
}
```

**Depois** - Voce muda o ARCHITECTURE.md para "Use Axios with `src/shared/services/api-client.ts`":

```typescript
// @builder agora gera isto:
import { apiClient } from '@/shared/services/api-client'

export async function getOrders(params: GetOrdersParams): Promise<OrdersResponse> {
  const { data } = await apiClient.get<OrdersResponse>('/v2/orders', { params })
  return data
}
```

::: tip
A mudanca e automatica - voce nao precisa avisar cada agente sobre o Axios. Todos leem o mesmo ARCHITECTURE.md.
:::

## Personalizacoes Comuns

### Trocar State Manager (Pinia para Zustand)

```markdown
## State Management
- Client state: Zustand stores in `src/modules/[name]/stores/`
- Server state: TanStack React Query in `src/modules/[name]/hooks/`
- Store naming: `use[Name]Store` (e.g., `useCartStore`)
- No global stores - each module owns its state
```

### Trocar API Client (fetch para Axios)

```markdown
## API Client
We use Axios with a centralized instance at `src/shared/services/api-client.ts`.
- All services import `apiClient` from the shared module
- Interceptors handle auth tokens and error formatting
- Services must NOT create their own Axios instances
```

### Mudar Estrutura de Diretorios (modules para features)

```markdown
## Module Structure
src/features/[name]/
├── ui/                  ← Components
├── hooks/               ← Custom hooks (React) or composables (Vue)
├── api/                 ← Services + adapters combined
├── model/               ← Types + contracts + validation
└── __tests__/           ← Unit tests
```

### Adicionar Regras de Lint Customizadas

```markdown
## Code Standards
- Max function length: 30 lines
- Max file length: 250 lines
- No `any` type - use `unknown` with type guards
- No barrel exports in components/ directories
- Composables must return readonly refs for state
```

## Configuracao do CLAUDE.md

O arquivo `CLAUDE.md` na raiz do projeto configura o comportamento do Claude. Secoes principais:

### Lista de Agentes

Adicione ou remova agentes da tabela para controlar para quem o Claude pode delegar:

```markdown
### Available Agents
| Agent | When to Use |
|-------|-------------|
| `@my-custom-agent` | Description of when to use |
```

### Padroes Principais

Atualize os padroes de referencia rapida:

```markdown
### Key Patterns (details in docs/ARCHITECTURE.md)
- **Services**: HTTP only, no try/catch
- **Custom Rule**: description
```

## Boas Praticas

1. **Seja explicito** - Os agentes seguem o que esta escrito literalmente
2. **Use exemplos** - Exemplos de codigo no ARCHITECTURE.md se tornam templates
3. **Mantenha atualizado** - Documentacao desatualizada leva a codigo inconsistente
4. **Controle de versao** - Faca commit das alteracoes no ARCHITECTURE.md com mensagens claras
5. **Alinhamento da equipe** - Revise as alteracoes de padroes com a equipe antes de fazer commit

## Checklist de Validacao

Apos editar o `ARCHITECTURE.md`, verifique suas mudancas:

1. **Rode as verificacoes automatizadas** - Captura violacoes estruturais:

   ```bash
   /review-check-architecture
   ```

2. **Gere um componente de teste** - Verifique se os agentes usam seus novos padroes:

   ```bash
   "Use @builder to create a test-example component"
   ```

3. **Revise o output** - Confira se o codigo gerado segue suas regras atualizadas

4. **Delete o arquivo de teste** - Limpe apos a validacao

Nenhum reinicio necessario. Os agentes leem `ARCHITECTURE.md` novamente a cada invocacao. As alteracoes entram em vigor imediatamente.
