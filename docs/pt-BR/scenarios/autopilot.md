# Autopilot

::: info Agentes: `@autopilot` · Complexidade: Média-Alta
:::

Desenvolvimento autônomo iterativo usando um PRD como fonte da verdade e rastreamento de progresso entre iterações.

## MVP a partir de PRD (Build Noturno) {#mvp-overnight}

**Objetivo:** Construir um MVP inteiro durante a noite, sem supervisão.

**Agentes envolvidos:** `/prd` → `@autopilot` (10 iterações) → `/verify`

### Workflow

```
Noite: Setup (15 min)
─────────────────────

User: /prd App de gerenciamento de tarefas com Kanban, drag-and-drop e auth

  /prd gera:
  → docs/PRD-task-manager.md
  → 8 user stories com critérios de aceitação Gherkin
  → Decomposição em issues: 7 tasks (tamanho S-M)

Usuário revisa o PRD, ajusta se necessário.

User: /autopilot docs/PRD-task-manager.md --max-iterations=10

  @autopilot inicializa:
  → Cria .claude/autopilot/progress.md
  → Extrai 7 tasks do PRD
  → Cria restore point no git

  Iteração 1: Modelos de dados
  → Cria schema Prisma (User, Board, Column, Task)
  → Roda prisma generate
  → ✓ DONE — comita, atualiza progress.md

  Iteração 2: Endpoints da API
  → Cria REST CRUD para boards, columns, tasks
  → Adiciona validação com Zod
  → Roda tsc --noEmit
  → ✓ DONE

  Iteração 3: Autenticação
  → Endpoints JWT login/register
  → Middleware de auth
  → ✓ DONE

  Iteração 4: Layout do frontend
  → Componente Kanban board
  → Componentes de coluna e card
  → ✓ DONE

  Iteração 5: Drag and drop
  → Integra dnd-kit / sortable
  → Atualiza posição da task via API
  → ✓ DONE

  Iteração 6: Dashboard do usuário
  → Lista de boards, fluxo de criação
  → Rotas protegidas
  → ✓ DONE

  Iteração 7: Testes
  → Testes unitários para serviços
  → Testes de integração para API
  → ✓ DONE

  Todas as tasks DONE → escreve AUTOPILOT_COMPLETE no progress.md

Manhã seguinte: Usuário verifica progress.md e git log.

User: /verify

  /verify confirma:
  → tsc: 0 erros
  → Testes: 24/24 passando
  → Build: sucesso
```

---

## Migração de Banco de Dados (PostgreSQL para MySQL) {#db-migration}

**Objetivo:** Migrar um projeto existente de PostgreSQL para MySQL.

**Comando:**
```
/autopilot docs/PRD-db-migration.md --max-iterations=15 --model=claude-opus-4-6
```

**O que acontece:**
1. `@autopilot` lê o PRD com os requisitos da migração
2. Cada iteração trata de uma task:

```
Iteração 1: Atualizar provider do Prisma
  → Muda provider de "postgresql" para "mysql"
  → Ajusta tipos de dados (TEXT → LONGTEXT, JSONB → JSON)
  → ✓ DONE

Iteração 2: Corrigir incompatibilidades do schema
  → Arrays do PostgreSQL → colunas JSON
  → Diferenças no tratamento de enums
  → ✓ DONE

Iteração 3: Atualizar scripts de seed
  → Ajusta sintaxe SQL para MySQL
  → Mudanças no formato de data
  → ✓ DONE

Iteração 4: Atualizar queries
  → Substitui operadores específicos do PostgreSQL
  → ILIKE → LOWER() + LIKE
  → ✓ DONE

Iteração 5: Atualizar Docker Compose
  → Substitui imagem postgres por mysql
  → Atualiza env vars (DATABASE_URL)
  → ✓ DONE

Iteração 6: Rodar e corrigir testes
  → Corrige 3 testes falhando (comparação de datas)
  → ✓ DONE

Iteração 7: Teste de integração
  → CRUD completo contra MySQL
  → ✓ DONE

Todas as tasks DONE → AUTOPILOT_COMPLETE
```

---

## Feature com Script Mode (DevContainer) {#devcontainer}

**Objetivo:** Construir um sistema de notificações usando script mode para máxima qualidade.

**Agentes envolvidos:** `/prd` → `scripts/autopilot.sh` (em DevContainer)

### Workflow

```
Setup: DevContainer (5 min)
───────────────────────────

# Copiar config do devcontainer
cp templates/autopilot/devcontainer.json .devcontainer/devcontainer.json

# Abrir no VS Code → "Reopen in Container"

# No terminal do container:
claude
> /prd Sistema de notificações em tempo real com WebSocket, in-app e email
> exit

# Rodar autopilot (script mode — reset total de contexto)
./scripts/autopilot.sh docs/PRD-notifications.md \
  --max-iterations=12 \
  --model=claude-opus-4-6 \
  --dangerously-skip-permissions

Execução: Sem supervisão (2-3 horas)
─────────────────────────────────────

Cada iteração:
  1. Claude inicia do zero (contexto limpo)
  2. Lê PRD + progress.md
  3. Encontra próxima task PENDING
  4. Implementa completamente
  5. Atualiza progress.md
  6. Comita e sai
  7. Script mata o processo, inicia próxima iteração

  === Autopilot: Iteração 1 de 12 ===
  Task: Setup do servidor WebSocket
  → ✓ DONE

  === Autopilot: Iteração 2 de 12 ===
  Task: Modelos de dados de notificação
  → ✓ DONE

  ...

  === Autopilot: Iteração 8 de 12 ===
  Task: Integração email (SendGrid)
  → BLOCKED (API key faltando no .env)

  === Autopilot: Iteração 9 de 12 ===
  Task: Sino de notificação no frontend
  → ✓ DONE

  ...

Resultado: Verificar progresso
──────────────────────────────

cat .claude/autopilot/progress.md

  Tasks: 9 DONE, 1 BLOCKED, 0 PENDING
  Iterações usadas: 11/12

# Corrigir task BLOCKED manualmente, depois continuar:
./scripts/autopilot.sh docs/PRD-notifications.md
```

---

## Features Paralelas com Git Worktrees {#parallel-worktrees}

**Objetivo:** Construir duas features independentes simultaneamente durante a noite.

### Workflow

```
Setup: Criar worktrees
──────────────────────

git worktree add ../project-auth -b feature/auth
git worktree add ../project-billing -b feature/billing

# Terminal 1:
cd ../project-auth
./scripts/autopilot.sh docs/PRD-auth.md \
  --max-iterations=10 --dangerously-skip-permissions

# Terminal 2:
cd ../project-billing
./scripts/autopilot.sh docs/PRD-billing.md \
  --max-iterations=10 --dangerously-skip-permissions

# Ambos rodam em paralelo, cada um com estado isolado

Resultado: Manhã seguinte
─────────────────────────

# Verificar progresso de auth
cat ../project-auth/.claude/autopilot/progress.md
  → 6/6 tasks DONE

# Verificar progresso de billing
cat ../project-billing/.claude/autopilot/progress.md
  → 7/8 tasks DONE, 1 BLOCKED

# Fazer merge dos resultados
cd ../project-auth && git checkout main && git merge feature/auth
cd ../project-billing && git checkout main && git merge feature/billing
```

---

## Dicas Rápidas

### Quando Usar Plugin Mode vs Script Mode

```
Plugin mode (/autopilot):
  ✓ Features rápidas (< 5 tasks)
  ✓ Sessões acompanhadas
  ✓ Quando quer monitorar progresso ao vivo

Script mode (scripts/autopilot.sh):
  ✓ Features complexas (10+ tasks)
  ✓ Execuções noturnas sem supervisão
  ✓ Migrações e refatorações grandes
  ✓ Quando qualidade degrada em sessões longas
```

### Escrevendo Bons PRDs para Autopilot

```
✓ FAÇA: Inclua critérios de aceitação claros por feature
✓ FAÇA: Quebre o trabalho em tasks pequenas e independentes
✓ FAÇA: Especifique requisitos de testes
✓ FAÇA: Defina a stack e padrões a seguir

✗ NÃO: Deixe requisitos vagos ("faça rápido")
✗ NÃO: Inclua decisões de design subjetivas
✗ NÃO: Combine features não relacionadas em um PRD
✗ NÃO: Pule a seção de decomposição em issues
```

---

## Cenários Relacionados

- [Planejamento](/pt-BR/scenarios/planning) - Criar o plano antes do autopilot
- [Workflows](/pt-BR/scenarios/workflows) - Coordenação manual multi-agente
- [Migração](/pt-BR/scenarios/migration) - Cenários específicos de migração
