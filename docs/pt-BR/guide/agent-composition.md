# Composição de Agentes

O Specialist Agent suporta compor agentes juntos, onde um agente pode invocar outro para completar fluxos complexos.

## Sintaxe de Composição

### Diretiva INVOKE

Use a diretiva `INVOKE` para chamar outro agente:

```markdown
## Workflow

1. Analisar requisitos
2. **INVOKE** @planner para criar plano de implementação
3. Para cada tarefa no plano:
   - **INVOKE** @builder para implementar
4. **INVOKE** @reviewer para review final
```

### Diretiva DELEGATE

Use `DELEGATE` quando o outro agente deve assumir completamente:

```markdown
## Handoff Protocol

- Se tarefa é trivial → **DELEGATE** @builder
- Se precisa de planejamento → **DELEGATE** @planner
```

### Diretiva PARALLEL

Use `PARALLEL` para rodar múltiplos agentes simultaneamente:

```markdown
## Parallel Execution

**PARALLEL**:
  - @builder: Criar componente
  - @tester: Escrever testes
  - @docs: Gerar documentação
**END PARALLEL**
```

## Padrões de Composição

### 1. Padrão Pipeline

Agentes executam em sequência, cada um passando output para o próximo:

```
@analyst → @planner → @builder → @reviewer
```

```markdown
## Workflow

1. **INVOKE** @analyst with "$ARGUMENTS"
   Store result as: requirements

2. **INVOKE** @planner with: requirements
   Store result as: plan

3. **INVOKE** @builder with: plan
   Store result as: implementation

4. **INVOKE** @reviewer with: implementation
```

### 2. Padrão Orchestrator

Um agente coordena múltiplos sub-agentes:

```markdown
# @orchestrator

## Workflow

1. Decompor tarefa em subtarefas
2. Para cada subtarefa:
   - Determinar melhor agente
   - **INVOKE** agente apropriado
   - Coletar resultado
3. Mesclar resultados
4. Validar output final
```

### 3. Padrão Fallback

Tenta um agente, cai para outro se falhar:

```markdown
## Workflow

1. **INVOKE** @builder-lite
2. IF failed or incomplete:
   - **INVOKE** @builder (full)
```

### 4. Padrão Review Loop

Constrói e revisa em loop até aprovação:

```markdown
## Workflow

LOOP:
  1. **INVOKE** @builder to implement
  2. **INVOKE** @reviewer to review
  3. IF approved: EXIT LOOP
  4. ELSE: Apply fixes, continue
```

### 5. Padrão Condicional

Escolhe agente baseado em condições:

```markdown
## Workflow

DETECT complexity:
  - IF trivial: **DELEGATE** @builder
  - IF simple: **INVOKE** @planner, then @builder
  - IF complex: **INVOKE** @analyst, @planner, @orchestrator
```

## Composições Nativas

### Skill /plan
```
@planner → @executor → @reviewer
```

### Skill /tdd
```
@tdd (RED) → @builder (GREEN) → @tdd (REFACTOR)
```

### Skill /dev-create-module
```
@builder (types) → @builder (service) → @builder (hook) → @builder (component) → @tester
```

## Comunicação Entre Agentes

### Passando Dados

```markdown
## Output

Após completar o trabalho, output:
```json
{
  "status": "complete",
  "files": ["path/to/file.ts"],
  "summary": "Created user service",
  "nextAgent": "@reviewer",
  "context": {
    "module": "users",
    "filesCreated": 3
  }
}
```
```

### Recebendo Dados

```markdown
## Input

Esperar contexto do agente anterior:
- files: Lista de arquivos para processar
- module: Nome do módulo
- requirements: Requisitos originais
```

## Boas Práticas

### 1. Limites Claros

Cada agente deve ter uma responsabilidade única:

```markdown
# Bom
@analyst: Converter requisitos em spec
@planner: Criar plano de implementação
@builder: Escrever código

# Ruim
@do-everything: Analisar, planejar, construir, revisar, testar
```

### 2. Contexto Mínimo

Passe apenas o necessário:

```markdown
# Bom
INVOKE @builder with: { "task": "create service", "name": "users" }

# Ruim
INVOKE @builder with: { entire conversation history }
```

### 3. Handoffs Explícitos

Sempre especifique o que o próximo agente deve fazer:

```markdown
## Handoff

Passando para @reviewer:
- Files to review: [lista]
- Focus areas: [áreas]
- Acceptance criteria: [critérios]
```

### 4. Tratamento de Erros

Especifique o que acontece em caso de falha:

```markdown
## On Error

IF @builder fails:
  1. Create checkpoint
  2. Notify user with error details
  3. Suggest @debugger for investigation
```

## Exemplo: Workflow Completo de Feature

```markdown
# @feature-builder - Agente Composto

## Mission
Construir features completas coordenando agentes especialistas.

## Workflow

### Fase 1: Análise
**INVOKE** @scout
- Obter contexto do projeto
- Identificar agentes relevantes

### Fase 2: Requisitos
**INVOKE** @analyst with: "$ARGUMENTS"
- Converter em spec técnica
- Definir critérios de aceitação

### Fase 3: Planejamento
**INVOKE** @planner with: spec
- Criar plano de implementação
- Estimar complexidade

### Fase 4: Implementação
IF complexity == trivial:
  **INVOKE** @builder
ELSE:
  **INVOKE** @orchestrator with: plan
  **PARALLEL**:
    - @builder: Implementação core
    - @tester: Escrever testes
  **END PARALLEL**

### Fase 5: Review
**INVOKE** @reviewer with: implementation
- Review 3-em-1
- IF issues: **INVOKE** @builder to fix

### Fase 6: Finalizar
**INVOKE** /finish skill
- Validar que todos os testes passam
- Gerar métricas
- Criar checkpoint
```

## Eficiência de Tokens

A composição reduz tokens por:

1. **Agentes especializados** - Cada agente é menor, focado
2. **Isolamento de contexto** - Agentes não carregam histórico completo
3. **Execução paralela** - Múltiplos agentes trabalham simultaneamente
4. **Terminação antecipada** - Pula agentes quando não necessário

Economia típica: 30-50% vs agentes monolíticos.
