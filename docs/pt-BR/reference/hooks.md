# Referência de Hooks

Hooks são scripts de ciclo de vida que executam em momentos-chave durante sua sessão de desenvolvimento. Eles automatizam pré-verificações, rastreiam métricas, tratam erros e geram resumos de sessão — tudo sem intervenção manual.

## Referência Rápida

| Hook | Quando | Caso de Uso |
|------|--------|-------------|
| `session-start` | Sessão inicia | Validar configuração, inicializar métricas, criar ponto de restauração |
| `before-plan` | Antes de `@planner` executar | Verificar arquitetura, detectar framework, escanear projeto |
| `after-task` | Tarefa concluída | Registrar métricas, logar progresso, rastrear tokens |
| `before-review` | Antes de `@reviewer` executar | Rodar lint, verificar tipos, identificar arquivos alterados |
| `after-review` | Após `@reviewer` finalizar | Registrar veredicto, salvar histórico de revisões, sugerir próximos passos |
| `on-error` | Agente encontra erro | Logar erro, sugerir recuperação, fornecer orientação |
| `session-end` | Sessão encerra | Gerar resumo, salvar histórico, calcular custos |

---

## Configuração

Hooks são configurados em `hooks/hooks.json` na raiz do projeto.

```json
{
  "$schema": "https://specialist-agent.dev/schemas/hooks-v1.json",
  "version": "1.0.0",
  "hooks": {
    "session-start": {
      "description": "Runs when a new Claude Code session starts",
      "scripts": ["./hooks/session-start.mjs"],
      "enabled": true
    },
    "before-plan": {
      "description": "Runs before @planner creates a plan",
      "scripts": ["./hooks/before-plan.mjs"],
      "enabled": true
    }
  }
}
```

### Opções de Configuração

Cada entrada de hook suporta:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `description` | `string` | Descrição legível por humanos |
| `scripts` | `string[]` | Array de caminhos de scripts a executar (em ordem) |
| `enabled` | `boolean` | Ativa/desativa o hook sem removê-lo |

### Rastreamento de Métricas

A seção `metrics` controla a coleta de dados em nível de sessão:

```json
{
  "metrics": {
    "enabled": true,
    "outputDir": ".claude/metrics",
    "track": {
      "tokens": true,
      "duration": true,
      "agents": true,
      "skills": true,
      "files": true,
      "checkpoints": true
    }
  }
}
```

### Notificações

Notificações externas opcionais para eventos específicos:

```json
{
  "notifications": {
    "enabled": false,
    "channels": {
      "slack": {
        "webhook": "",
        "events": ["on-error", "session-end"]
      },
      "discord": {
        "webhook": "",
        "events": ["on-error"]
      }
    }
  }
}
```

---

## Detalhes dos Hooks

### session-start

Executa quando uma nova sessão do Claude Code é iniciada.

**O que faz:**

1. **Valida a configuração do projeto** — verifica o diretório `.claude/` e o `CLAUDE.md`
2. **Inicializa métricas** — cria `.claude/metrics/current-session.json` com contadores zerados
3. **Cria ponto de restauração** — cria uma tag no commit git atual como `restore-point/session-{timestamp}`
4. **Carrega memória de sessão** — exibe decisões recentes de `.claude/session-memory.json`

**Configuração:**

```json
{
  "session-start": {
    "scripts": ["./hooks/session-start.mjs"],
    "enabled": true
  }
}
```

**Exemplo de saída:**

```
──── Session Start ────
✓ Claude directory
✓ CLAUDE.md config
✓ Metrics initialized
✓ Restore point: restore-point/session-1709312400000

──── Ready ────
Session: session-1709312400000
Started: 2/25/2026, 10:00:00 AM
```

**Casos de uso:**
- Garantir que o projeto está corretamente configurado antes de começar o trabalho
- Criar pontos de rollback automaticamente para segurança
- Retomar contexto de sessões anteriores via memória

---

### before-plan

Executa antes de `@planner` criar um plano de implementação.

**O que faz:**

1. **Verifica o arquivo de arquitetura** — procura por `ARCHITECTURE.md` em `docs/`, na raiz ou em `.claude/`
2. **Verifica o estado do git** — reporta branch atual, mudanças não commitadas e commits recentes
3. **Detecta o framework** — lê `package.json` para identificar Vue, React, Next.js, SvelteKit, Angular, Astro, Nuxt, TypeScript e test runners
4. **Escaneia o tamanho do projeto** — conta arquivos-fonte e classifica como Small/Medium/Large

**Entrada:** Aceita nome da feature via variável de ambiente `PLAN_FEATURE` ou argumento CLI.

**Configuração:**

```json
{
  "before-plan": {
    "scripts": ["./hooks/before-plan.mjs"],
    "enabled": true
  }
}
```

**Exemplo de saída:**

```
──── Pre-Plan Checks ────

  ✓ Architecture file: docs/ARCHITECTURE.md
    142 lines of architecture patterns
  Branch: feat/user-auth
  ✓ Working tree clean
  ✓ Framework: Next.js ^14.0.0
  ✓ TypeScript enabled
  ✓ Test runner: Vitest
  Source files: 87
  Scale: Medium project

──── Ready for Planning ────
```

**Casos de uso:**
- Fornecer ao `@planner` o contexto completo do projeto antes de criar um plano
- Avisar sobre mudanças não commitadas que podem gerar conflitos
- Detectar automaticamente o stack tecnológico para que os planos estejam alinhados ao projeto

---

### after-task

Executa após cada tarefa concluída (via `@executor` ou trabalho manual).

**O que faz:**

1. **Atualiza métricas de sessão** — registra a tarefa em `.claude/metrics/current-session.json`
2. **Loga resumo da tarefa** — exibe status, agente, tokens, duração e arquivos alterados
3. **Exibe totais acumulados** — mostra tarefas, tokens e custo estimado até o momento

**Entrada:** Aceita dados da tarefa via variáveis de ambiente ou argumentos CLI:

| Variável de Ambiente | Posição do Arg | Descrição |
|----------------------|----------------|-----------|
| `TASK_ID` | 2 | Identificador da tarefa |
| `TASK_DESC` | 3 | Descrição da tarefa |
| `TASK_TOKENS` | 4 | Tokens utilizados |
| `TASK_DURATION` | 5 | Tempo decorrido |
| `TASK_AGENT` | 6 | Agente que executou a tarefa |
| `TASK_STATUS` | 7 | `completed` ou `failed` |
| `FILES_CREATED` | apenas env | Lista separada por vírgulas |
| `FILES_MODIFIED` | apenas env | Lista separada por vírgulas |

**Configuração:**

```json
{
  "after-task": {
    "scripts": ["./hooks/after-task.mjs"],
    "enabled": true
  }
}
```

**Exemplo de saída:**

```
──── Task Complete: task-001 ────
Status: ✓ completed
Agent: @builder
Tokens: ~12,500
Duration: 45s
Files created: 3
Files modified: 2

──── Session Progress ────
Tasks completed: 4
Total tokens: ~48,000
Estimated cost: ~$0.72
Agents used: @planner, @builder, @tdd
```

**Casos de uso:**
- Rastrear custo e uso de tokens ao longo de uma sessão
- Monitorar quais agentes estão realizando mais trabalho
- Manter um log detalhado de todas as alterações feitas

---

### before-review

Executa antes de `@reviewer` iniciar uma revisão de código.

**O que faz:**

1. **Roda o linter** — executa `npm run lint` e reporta aprovação/falha
2. **Roda verificação TypeScript** — executa `npx tsc --noEmit` e conta os erros
3. **Identifica arquivos alterados** — lista arquivos staged, unstaged e com diff em relação à branch
4. **Verificação rápida de testes** — lista arquivos de teste disponíveis (com timeout de 10s)

**Entrada:** Aceita escopo da revisão via variável de ambiente `REVIEW_SCOPE` ou argumento CLI.

**Configuração:**

```json
{
  "before-review": {
    "scripts": ["./hooks/before-review.mjs"],
    "enabled": true
  }
}
```

**Exemplo de saída:**

```
──── Pre-Review Checks ────

Running lint...
  ✓ Lint passed
Running TypeScript check...
  ✓ TypeScript passed
Identifying changes...
  Staged files: 5
    • src/modules/orders/types.ts
    • src/modules/orders/service.ts
    • src/modules/orders/adapter.ts
    • src/modules/orders/OrderList.vue
    • src/modules/orders/__tests__/service.spec.ts
Running quick test check...
  ✓ Test suite ready (12 test files)

──── Ready for Review ────
```

**Casos de uso:**
- Capturar erros de lint e tipo antes de desperdiçar tokens na revisão
- Dar ao `@reviewer` uma visão clara do que foi alterado
- Falhar rapidamente em problemas óbvios

---

### after-review

Executa após `@reviewer` concluir uma revisão de código.

**O que faz:**

1. **Loga resumo da revisão** — exibe veredicto (Approved, Caveats, Rejected) e uma pontuação de qualidade
2. **Atualiza métricas de sessão** — adiciona dados da revisão à sessão atual
3. **Salva registro da revisão** — escreve um arquivo JSON com timestamp em `.claude/metrics/reviews/`
4. **Sugere próximas ações** — fornece orientação baseada no veredicto

**Entrada:** Aceita dados da revisão via variáveis de ambiente ou argumentos CLI:

| Variável de Ambiente | Posição do Arg | Descrição |
|----------------------|----------------|-----------|
| `REVIEW_SCOPE` | 2 | O que foi revisado |
| `REVIEW_VERDICT` | 3 | `approved`, `caveats` ou `rejected` |
| `REVIEW_VIOLATIONS` | 4 | Número de violações |
| `REVIEW_WARNINGS` | 5 | Número de avisos |
| `REVIEW_HIGHLIGHTS` | 6 | Número de destaques |

**Fórmula da pontuação de qualidade:** `100 - (violations * 15) - (warnings * 5)`, mínimo 0.

**Configuração:**

```json
{
  "after-review": {
    "scripts": ["./hooks/after-review.mjs"],
    "enabled": true
  }
}
```

**Exemplo de saída:**

```
──── Review Complete: src/modules/orders/ ────
Verdict: ⚠ Approved with Caveats
Warnings: 2
Highlights: 3
Quality score: 90/100

✓ Metrics updated

──── Suggested Actions ────
  1. Address warnings if time permits
  2. Proceed with merge (caveats are non-blocking)
```

**Casos de uso:**
- Rastrear tendências de qualidade nas revisões ao longo do tempo
- Orientar desenvolvedores automaticamente sobre os próximos passos
- Construir um histórico de revisões para o projeto

---

### on-error

Executa quando um agente encontra um erro.

**O que faz:**

1. **Loga o erro nas métricas** — registra agente, mensagem, arquivo, linha e tarefa nos dados de sessão
2. **Sugere recuperação** — lista checkpoints e restore points disponíveis para rollback
3. **Fornece orientação** — oferece sugestões específicas com base na mensagem de erro:
   - Erros TypeScript: rodar `tsc --noEmit`, verificar imports
   - Erros de teste: rodar `npm test`, verificar assertions
   - Erros de sintaxe: verificar colchetes, validar JSON/YAML
   - Erros de módulo: rodar `npm install`, verificar caminhos de import

**Entrada:** Aceita dados do erro via variáveis de ambiente ou argumentos CLI:

| Variável de Ambiente | Posição do Arg | Descrição |
|----------------------|----------------|-----------|
| `ERROR_AGENT` | 2 | Agente que falhou |
| `ERROR_MESSAGE` | 3 | Mensagem de erro |
| `ERROR_FILE` | 4 | Arquivo onde o erro ocorreu |
| `ERROR_LINE` | 5 | Número da linha |
| `ERROR_TASK` | 6 | Tarefa em execução |
| `ERROR_STACK` | apenas env | Stack trace |

**Configuração:**

```json
{
  "on-error": {
    "scripts": ["./hooks/on-error.mjs"],
    "enabled": true
  }
}
```

**Exemplo de saída:**

```
──── Error Detected ────
Agent: @builder
Message: TypeScript error in OrderService
Location: src/modules/orders/service.ts:42

✓ Error logged to session metrics

──── Recovery Options ────
Available checkpoints:
  • checkpoint/before-refactor
  • checkpoint/after-types

To rollback:
  git reset --hard checkpoint/after-types

──── Suggestions ────
• Run "npx tsc --noEmit" to see all type errors
• Check imports and type definitions

General:
• Use @debugger for systematic investigation
• Use /checkpoint restore [name] to rollback
• Check recent changes: git diff HEAD~1
```

**Casos de uso:**
- Logar automaticamente todos os erros para análise pós-sessão
- Fornecer opções de recuperação imediatas sem consulta manual
- Orientar desenvolvedores em direção à abordagem correta de debugging

---

### session-end

Executa quando uma sessão encerra (acionado manualmente ou detectado automaticamente).

**O que faz:**

1. **Gera resumo da sessão** — visão geral com duração, status e contagem de tarefas
2. **Calcula métricas finais** — tokens, custo, arquivos alterados, agentes e skills utilizados
3. **Exibe comparação de custo** — estima a economia em relação a ferramentas alternativas
4. **Salva no histórico** — escreve dados completos da sessão em `.claude/metrics/history/`
5. **Preserva o arquivo de sessão** — mantém `current-session.json` para revisão manual

**Configuração:**

```json
{
  "session-end": {
    "scripts": ["./hooks/session-end.mjs"],
    "enabled": true
  }
}
```

**Exemplo de saída:**

```
════════════════════════════════════════
           SESSION SUMMARY
════════════════════════════════════════

──── Overview ────
Session ID: session-1709312400000
Duration: 1h 23m
Status: ✓ Completed successfully

──── Tasks ────
Completed: 8
Errors: 0

──── Files ────
Created: 12
Modified: 5

──── Token Usage ────
Total tokens: ~145,000
Per task avg: ~18,125
Estimated cost: ~$2.18

──── Agents & Skills ────
Agents: @planner, @builder, @tdd, @reviewer
Skills: /plan, /checkpoint

════════════════════════════════════════
```

**Casos de uso:**
- Obter uma visão completa do que foi realizado
- Rastrear custos entre sessões para controle orçamentário
- Construir um histórico das sessões de desenvolvimento

---

## Criando Hooks Personalizados

### Formato do Arquivo de Hook

Hooks são módulos ES (arquivos `.mjs`) com uma função assíncrona `main()` padrão:

```javascript
#!/usr/bin/env node

/**
 * Meu Hook Personalizado
 */

async function main() {
  // Sua lógica de hook aqui
  console.log('Hook executed');
}

main().catch(console.error);
```

### Contexto Disponível

Hooks recebem dados através de **variáveis de ambiente** e **argumentos CLI**:

```javascript
// Variáveis de ambiente
const agent = process.env.TASK_AGENT || 'unknown';
const feature = process.env.PLAN_FEATURE || '';

// Argumentos CLI (process.argv[2] em diante)
const taskId = process.argv[2] || 'default';
```

Hooks também podem ler estado compartilhado do arquivo de métricas:

```javascript
import { readFileSync } from 'fs';

const SESSION_FILE = '.claude/metrics/current-session.json';
const session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));
```

### Executando Múltiplos Scripts

Um único hook pode acionar múltiplos scripts em sequência:

```json
{
  "before-review": {
    "scripts": [
      "./hooks/before-review.mjs",
      "./hooks/custom-lint-check.mjs"
    ],
    "enabled": true
  }
}
```

### Tratamento de Erros

Sempre envolva sua função principal com `.catch()` e trate falhas com elegância:

```javascript
async function main() {
  try {
    const result = execSync('npm run lint', { encoding: 'utf-8' });
    console.log('✓ Lint passed');
  } catch (err) {
    // Logue, mas não quebre — hooks não devem bloquear a sessão
    console.log('⚠ Lint failed, continuing anyway');
  }
}

main().catch(console.error);
```

### Boas Práticas

- **Mantenha os hooks rápidos.** Hooks de longa duração atrasam a execução dos agentes. Use timeouts para comandos externos.
- **Falhe com elegância.** Hooks devem logar avisos, não lançar erros não tratados.
- **Use variáveis de ambiente.** Passe dados via variáveis de ambiente ou argumentos CLI, não valores hardcoded.
- **Escreva em `.claude/metrics/`.** Mantenha todos os dados gerados no diretório de métricas para consistência.
- **Desative, não delete.** Defina `"enabled": false` para pular um hook sem perder a configuração.
- **Mantenha a saída concisa.** Use cabeçalhos de seção claros (`────`) e ícones de status (`✓`, `⚠`, `✗`) para legibilidade.

---

## Hooks Nativos do Claude Code

Além dos lifecycle hooks acima, o Specialist Agent oferece **4 hooks nativos** que se integram diretamente ao sistema de hooks do Claude Code. Eles executam automaticamente via `.claude/settings.json` — sem acionamento manual necessário.

### Referência Rápida

| Hook | Evento | O que Faz |
|------|--------|-----------|
| Security Guard | `PreToolUse` | Bloqueia comandos Bash perigosos antes da execução |
| Auto-Dispatch | `UserPromptSubmit` | Sugere o melhor agente com base no seu prompt |
| Session Context | `SessionStart` | Injeta o estado do projeto quando a sessão inicia |
| Auto-Format | `PostToolUse` | Formata arquivos após operações de Write/Edit |

### Instalação

Os hooks nativos são instalados durante `npx specialist-agent init`. Você pode escolher quais hooks ativar.

Eles são configurados em `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node .specialist-agent/hooks/native/security-guard.mjs", "timeout": 5 }]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{ "type": "command", "command": "node .specialist-agent/hooks/native/auto-dispatch.mjs", "timeout": 5 }]
      }
    ]
  }
}
```

---

### Security Guard

**Evento:** `PreToolUse` (matcher: `Bash`)

Avalia cada comando Bash contra regras de segurança **antes** de executá-lo. Projetado como fail-closed: se o hook travar, ele bloqueia o comando.

**Regras por severidade:**

| Severidade | Padrões | Ação |
|------------|---------|------|
| CRITICAL | `rm -rf /`, `rm -rf ~`, fork bombs, wipe de disco | Sempre bloquear |
| HIGH | `git push --force` para main/master, `git reset --hard`, `DROP TABLE`, `curl \| bash`, `chmod 777` | Bloquear com orientação |
| MEDIUM | Leitura de arquivos `.env`, secrets inline, escrita em `.env` | Bloquear com alternativas |

**Padrões seguros (permitidos):**
- `rm -rf node_modules/`, `rm -rf dist/`, `rm -rf build/`, `rm -rf .next/`
- `git push --force-with-lease` (alternativa mais segura)
- `git reset --soft`
- `cat .env.example`, `cat .env.template`

**Personalização:**

Edite `.specialist-agent/hooks/native/security-config.json` para:
- Desativar regras específicas: `"hard-reset": { "enabled": false }`
- Adicionar padrões seguros à allowlist
- Configurar branches protegidas

```json
{
  "rules": {
    "hard-reset": { "enabled": false }
  },
  "allowlist": ["rm -rf my-custom-dir"],
  "protectedBranches": ["main", "master", "staging"]
}
```

---

### Auto-Dispatch

**Evento:** `UserPromptSubmit`

Analisa seu prompt e sugere o melhor agente especialista. Nunca força — apenas fornece contexto.

**Como funciona:**
1. Tokeniza seu prompt e compara com grupos de palavras-chave de cada agente
2. Frases com múltiplas palavras pontuam mais alto (ex: "code review" pontua mais do que apenas "review")
3. Só sugere quando a confiança está acima do limiar (2+ correspondências de palavras-chave)
4. Ignora completamente se você já mencionar um `@agente` no seu prompt

**Exemplo:** Quando você digita "there's a bug in the login page, error 500", o hook adiciona contexto sugerindo `@doctor` para diagnóstico sistemático.

---

### Session Context

**Evento:** `SessionStart`

Injeta um resumo de uma linha do estado do projeto quando sua sessão inicia:

```
[Specialist Agent] Branch: feat/auth | Uncommitted files: 3 | Last commit: feat: add login | Installed: 27 agents, 21 skills | Session memory: 5 saved decisions
```

**Dados coletados (todos somente leitura):**
- Branch git e contagem de arquivos modificados
- Mensagem do último commit
- Contagem de agentes e skills instalados
- Contagem de decisões na memória de sessão
- Perfil ativo

---

### Auto-Format

**Evento:** `PostToolUse` (matcher: `Write|Edit`)

Formata automaticamente os arquivos após o Claude escrevê-los ou editá-los.

**Formatadores suportados (detectados pela configuração):**
1. Prettier (`.prettierrc`, `prettier.config.js`, etc.)
2. Biome (`biome.json`)

**Extensões suportadas:** `.ts`, `.tsx`, `.js`, `.jsx`, `.vue`, `.svelte`, `.css`, `.json`, `.md`, `.html`, `.yaml`

**Segurança:** Valida que os caminhos de arquivo estão dentro do diretório do projeto (proteção contra path traversal). Se nenhum formatter estiver configurado, não faz nada silenciosamente.

---

### Princípios de Design de Segurança

1. **Fail-closed:** O Security Guard bloqueia em caso de crash (código de saída 2)
2. **Sem eval/exec:** Hooks nunca usam `eval()` nem executam input controlado pelo usuário
3. **Sem rede:** Nenhuma requisição HTTP a partir de qualquer hook
4. **Proteção contra path traversal:** O Auto-Format valida caminhos dentro do projeto
5. **Configuração somente leitura:** `security-config.json` é lido, nunca escrito pelos hooks
6. **Timeouts curtos:** 5s (segurança, dispatch), 10s (contexto), 15s (format)
