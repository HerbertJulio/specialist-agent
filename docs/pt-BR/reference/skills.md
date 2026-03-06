# Referência de Skills

Skills são atalhos. Digite `/skill-name` no Claude Code.

## Referência Rápida

| Skill | O que faz |
|-------|-----------|
| `/brainstorm` | Brainstorming socrático antes de planejar |
| `/plan` | Planejar uma feature |
| `/tdd` | Test-driven development |
| `/debug` | Debugar um problema |
| `/checkpoint` | Salvar/restaurar progresso |
| `/estimate` | Estimar custo em tokens |
| `/finish` | Finalizar branch |
| `/health` | Score de saúde do projeto |
| `/remember` | Salvar uma decisão |
| `/recall` | Relembrar decisões |
| `/learn` | Aprender enquanto constrói |
| `/tutorial` | Tutorial interativo |
| `/migrate-framework` | Migrar entre frameworks |
| `/migrate-architecture` | Migrar entre padrões de arquitetura |
| `/verify` | Verificação antes de concluir (baseada em prova) |
| `/write-skill` | Criar ou melhorar skills com TDD |
| `/audit` | Auditoria multi-domínio de código |
| `/onboard` | Onboarding de codebase para novos devs |
| `/worktree` | Isolamento com git worktree para tarefas paralelas |

---

## Skills de Workflow

### /brainstorm

Brainstorming socrático antes de planejar.

```bash
/brainstorm add real-time notifications
```

Refina ideias em 5 fases: Descoberta, Esclarecimento, Teste de Premissas, Geração de Alternativas e Convergência. Apresenta o design em seções para aprovação do usuário.

**Output:** Documento de design com premissas testadas, 3+ alternativas comparadas e direção aprovada pronta para `/plan`.

---

### /plan

Planejar uma feature de forma adaptativa.

```bash
/plan add user authentication
```

**Output:** Lista de tarefas com avaliação de complexidade.

---

### /tdd

Workflow de Test-Driven Development.

```bash
/tdd implement calculateDiscount
```

**Processo:**
1. RED - Escrever teste falhando
2. GREEN - Fazer passar
3. REFACTOR - Melhorar o código

Sem código sem teste falhando primeiro.

---

### /debug

Debugging sistemático em 4 fases.

```bash
/debug the login shows 500 error
```

**Fases:** Gather → Analyze → Test → Fix

---

### /checkpoint

Gerenciamento de checkpoints git.

```bash
/checkpoint create before-refactor
/checkpoint list
/checkpoint restore before-refactor
```

Nunca perca trabalho.

---

### /estimate

Estimar custo em tokens antes de começar.

```bash
/estimate add payment integration
```

Saiba o custo antes de começar.

---

### /finish

Finalizar branch com métricas.

```bash
/finish feature/auth
```

**Output:** Uso de tokens, arquivos alterados, status dos testes.

---

### /learn

Modo de aprendizado - explica enquanto constrói.

```bash
/learn create a products module
```

Ótimo para onboarding.

---

### /verify

Verificação antes de declarar trabalho como completo.

```bash
/verify
```

Força verificação baseada em prova - requer output de comando, não só "funciona". Use após completar qualquer tarefa para garantir corretude com evidência.

**Output:** Relatório de verificação com artefatos de prova (resultados de teste, output de build, checks de runtime).

---

### /write-skill

Criar ou melhorar skills usando metodologia TDD.

```bash
/write-skill my-new-skill
```

**Processo:**

1. RED - Definir o que a skill deve fazer (spec falhando)
2. GREEN - Escrever a skill para atender a spec
3. REFACTOR - Melhorar clareza e estrutura

RED-GREEN-REFACTOR aplicado a documentação e design de skills.

---

## Skills de Projeto

### /health

Score de saúde do projeto (0-100).

```bash
/health
/health quick
/health detailed
```

**Verifica:** Arquitetura, testes, types, segurança, performance.

---

### /remember

Salvar uma decisão na memória de sessão.

```bash
/remember use Zustand for state management
```

Persiste entre sessões.

---

### /recall

Consultar memória de sessão.

```bash
/recall state management
/recall all
```

---

### /tutorial

Tutorial interativo.

```bash
/tutorial beginner
/tutorial intermediate
/tutorial advanced
```

---

### /onboard

Onboarding de codebase para novos desenvolvedores.

```bash
/onboard
```

Mapeia arquitetura, detecta convenções e analisa módulos-chave. Gera um guia para desenvolvedores com instruções de início.

**Output:** Guia de onboarding com mapa de arquitetura, convenções e instruções de setup.

---

### /worktree

Isolamento com git worktree para tarefas paralelas.

```bash
/worktree auth-refactor
```

Cria workspaces isolados para trabalhar em múltiplas features simultaneamente. Sem troca de branch, sem stash, sem conflitos.

**Comandos:**

- `/worktree [name]` - Criar workspace isolado
- `git worktree list` - Listar worktrees ativos
- `git worktree remove [path]` - Remover worktree

**Output:** Worktree criado com dependências instaladas e testes baseline passando.

---

## Skills de Migração

### /migrate-framework

Migrar entre frameworks.

```bash
/migrate-framework react to vue src/components/Button.tsx
```

**Suporta:**
- React → Vue
- React → Svelte
- Vue → React
- Vue → Svelte
- Vue 2 → Vue 3

---

### /migrate-architecture

Migrar entre padrões de arquitetura.

```bash
/migrate-architecture flat to modular full project
/migrate-architecture mvc to clean lite src/modules/auth
```

**Suporta:** 15 padrões incluindo Modular, Clean Architecture,
Hexagonal, DDD, FSD, CQRS, Event-Driven, Modular Monolith,
e mais. Cada um com variantes Full e Lite.

**Processo:**
1. **Assessment** - Detecta o padrão de arquitetura atual
2. **Planning** - Gera plano de migração com mapeamento
3. **Execution** - Move arquivos, atualiza imports, cria camadas
4. **Validation** - Check TypeScript, regras de import, testes

**Output:** Codebase migrado com `ARCHITECTURE.md` atualizado.

---

## Skills de Desenvolvimento

### /dev-create-module

Scaffold completo de módulo.

```bash
/dev-create-module orders
```

Cria: types, service, adapter, componentes, testes.

---

### /dev-create-component

Criar um componente.

```bash
/dev-create-component OrderCard
```

---

### /dev-create-service

Criar camada de serviço.

```bash
/dev-create-service orders
```

Cria: types, contracts, adapter, service.

---

### /dev-create-hook

Criar um hook (React/Next.js).

```bash
/dev-create-hook useOrders
```

---

### /dev-create-composable

Criar um composable (Vue).

```bash
/dev-create-composable useOrdersList
```

---

### /dev-create-test

Criar testes para um arquivo.

```bash
/dev-create-test src/modules/orders/adapters/order-adapter.ts
```

---

### /dev-generate-types

Gerar types a partir de endpoint ou JSON.

```bash
/dev-generate-types /v2/orders
```

---

## Skills de Review

### /review-review

Revisão de código com veredito.

```bash
/review-review src/modules/orders/
```

**Verifica:** Spec compliance, qualidade de código, arquitetura.

---

### /review-check-architecture

Verificações de conformidade arquitetural.

```bash
/review-check-architecture orders
```

14 verificações automatizadas.

---

### /review-fix-violations

Auto-corrigir violações.

```bash
/review-fix-violations orders
```

---

### /audit

Auditoria multi-domínio de código em uma passada.

```bash
/audit src/modules/auth
```

**Cobre:** Segurança (OWASP), performance, arquitetura, dependências. Gera findings com severidade e passos de remediação.

**Output:** Relatório de auditoria com findings categorizados, níveis de severidade e remediação acionável.

---

## Skills de Documentação

### /docs-onboard

Resumo rápido de módulo.

```bash
/docs-onboard orders
```

Entenda qualquer módulo em 2 minutos.
