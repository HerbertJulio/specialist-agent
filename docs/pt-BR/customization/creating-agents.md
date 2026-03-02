# Criando Agentes

Voce pode estender o Specialist Agent criando seus proprios agentes adaptados as necessidades do seu projeto.

## O Padrao Blueprint

Todo agente segue um **blueprint de 5 partes**: Mission, Workflow, Output, Rules e Handoff. Essa estrutura garante que os agentes se comportem de forma previsivel - eles sabem o que fazer, como fazer, o que produzir, quais restricoes respeitar e quando delegar para outro agente. Seguir esse padrao torna os agentes composiveis e confiaveis em qualquer projeto.

## Estrutura do Arquivo de Agente

Crie um arquivo em `.claude/agents/nome-do-agente.md`:

```markdown
---
name: my-agent
description: "MUST BE USED to [do X] when [trigger]. Use PROACTIVELY when [condition]."
tools: Read, Write, Edit, Bash, Glob, Grep
---

# Agent Title

## Mission
One sentence describing what this agent does.

## Context
Read the following files before starting:
- `docs/ARCHITECTURE.md`

## Workflow
1. Step one
2. Step two
3. ...

## Output
After completing work, provide:

- What was done (files created/modified)
- Key decisions and rationale
- Validation results
- Recommendations for next steps

## Rules
- Rule one
- Rule two

## Handoff Protocol
- If [condition A] → suggest @agent-x
- If [condition B] → suggest @agent-y
```

## Campos Principais

### Frontmatter

| Campo | Obrigatorio | Descricao |
|-------|-------------|-----------|
| `name` | Sim | Identificador do agente (usado com `@nome`) |
| `description` | Sim | Quando o Claude deve delegar para este agente |
| `tools` | Sim | Ferramentas que o agente pode usar |
| `model` | Nao | Override de modelo (`haiku` para menor custo) |

::: tip A Descricao Importa
O campo `description` determina **quando o Claude delega automaticamente** para o seu agente. Use linguagem forte como "MUST BE USED" para garantir a delegacao.
:::

::: tip Override de Modelo
Adicione `model: haiku` ao frontmatter para executar o agente no modelo Haiku - significativamente mais barato por token. Use isto para tarefas mais simples que nao precisam das capacidades completas do Sonnet/Opus.
:::

### Ferramentas Disponiveis

| Ferramenta | Finalidade |
|------------|-----------|
| `Read` | Ler arquivos |
| `Write` | Criar novos arquivos |
| `Edit` | Editar arquivos existentes |
| `Bash` | Executar comandos no shell |
| `Glob` | Encontrar arquivos por padrao |
| `Grep` | Pesquisar conteudo de arquivos |

## Exemplos

### Agente de Testes

```markdown
---
name: test-writer
description: "MUST BE USED to create tests whenever the user asks for tests or testing."
tools: Read, Write, Edit, Bash, Glob, Grep
---

# Test Writer

## Mission
Create comprehensive tests following project conventions.

## Context
- Read `docs/ARCHITECTURE.md` section 10 (checklists)
- Read existing tests in `__tests__/` for patterns

## Workflow
1. Read the target file
2. Identify what needs testing
3. Create test file in `__tests__/`
4. Run tests with `vitest run [file]`
5. Fix any failures

## Rules
- Adapters: test all transformations (highest priority)
- Composables: mock services, test reactive behavior
- Components: use @vue/test-utils, test user interactions
- Name: `[OriginalName].spec.ts`

## Output
Provide: test file created (with path), test results (pass/fail), coverage summary, and recommendations.

## Handoff Protocol
- Security-sensitive code needs testing → suggest @security
- Component needs accessibility testing → suggest @designer
```

### Agente de Deploy

```markdown
---
name: deploy-checker
description: "MUST BE USED to validate before deployment whenever the user mentions deploy or release."
tools: Read, Bash, Glob, Grep
---

# Deploy Checker

## Mission
Validate the project is ready for deployment.

## Workflow
1. Run `npm run type-check`
2. Run `npm run lint`
3. Run `npm run test -- --run`
4. Run `npm run build`
5. Check for console.log / debugger statements
6. Report results

## Output
✅ Ready to deploy or ❌ Issues found (with details)

## Handoff Protocol
- Security concerns found → suggest @security
- Test failures detected → suggest @tester
- Infrastructure or CI issues → suggest @devops
```

### Agente Lite (Haiku)

```markdown
---
name: quick-scaffold
description: "MUST BE USED for quick component scaffolding."
model: haiku
tools: Read, Write, Edit, Glob, Grep
---

# Quick Scaffold

## Mission
Quickly scaffold components with minimal token usage.

## Rules (inline - no ARCHITECTURE.md read)
- `<script setup lang="ts">`
- defineProps<T>() and defineEmits<T>()
- < 200 lines

## Workflow
1. Create component at the right location
2. Apply script setup template
```

## Dicas

- Mantenha os agentes focados em **uma responsabilidade**
- Sempre referencie `ARCHITECTURE.md` para consistencia
- Use `Bash` com moderacao - prefira `Read`/`Write`/`Edit`
- Use `model: haiku` para tarefas mais simples para economizar tokens
- Teste seu agente pedindo ao Claude para usa-lo: `"Use @my-agent to..."`
