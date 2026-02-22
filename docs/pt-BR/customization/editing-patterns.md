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

1. **Seja explicito** — Os agentes seguem o que esta escrito literalmente
2. **Use exemplos** — Exemplos de codigo no ARCHITECTURE.md se tornam templates
3. **Mantenha atualizado** — Documentacao desatualizada leva a codigo inconsistente
4. **Controle de versao** — Faca commit das alteracoes no ARCHITECTURE.md com mensagens claras
5. **Alinhamento da equipe** — Revise as alteracoes de padroes com a equipe antes de fazer commit

## Apos Editar

Nenhum reinicio necessario. Os agentes leem `ARCHITECTURE.md` novamente a cada invocacao. As alteracoes entram em vigor imediatamente.

Para validar suas alteracoes:

```bash
/review-check-architecture
```

Isso executa as 14 verificacoes automatizadas contra a base de codigo atual usando suas regras atualizadas.
