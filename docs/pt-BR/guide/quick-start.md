# Início Rápido

Instale primeiro:

```
/plugin install specialist-agent
```

Ou via CLI: `npx specialist-agent init`

Depois comece a usar os agentes:

## 1. Analise Seu Projeto

```bash
"Use @scout to analyze this project"
```

Receba recomendações de quais agentes usar.

## 2. Construa uma Feature

```bash
"Use @builder to create a products module with CRUD"
```

Cria: types, service, adapter, componentes, testes.

## 3. Revise Antes do Merge

```bash
"Use @reviewer to review the products module"
```

Verifica: spec compliance, qualidade de código, arquitetura.

## 4. Debug um Problema

```bash
"Use @doctor to investigate the 500 error on login"
```

Rastreia: Component → State → Adapter → Service → API

## 5. Planeje uma Feature Complexa

```bash
/plan add user authentication with JWT
```

Cria plano adaptativo baseado na complexidade.

## 6. Test-Driven Development

```bash
/tdd implement calculateDiscount function
```

RED → GREEN → REFACTOR com evidência.

## 7. Salve o Progresso

```bash
/checkpoint create before-refactor
```

Rollback se necessário.

## Fluxos Comuns

### Novo Projeto

```bash
"Use @starter to create an app with Next.js + PostgreSQL"
```

### Design de API

```bash
"Use @api to design the orders API with OpenAPI spec"
```

### Performance

```bash
"Use @perf to optimize the dashboard"
```

### Segurança

```bash
"Use @security to audit for vulnerabilities"
```

### Banco de Dados

```bash
"Use @data to design the schema with Prisma"
```

### Pagamentos

```bash
"Use @finance to integrate Stripe"
```

### Migrações

```bash
"Use @migrator to modernize src/legacy/"
```

## 8. Auditoria Antes do Release

```bash
/audit src/modules/auth
```

Segurança + performance + arquitetura + dependências em uma única passada.

## 9. Onboarding em um Codebase

```bash
/onboard
```

Mapeia arquitetura, detecta convenções, gera guia para desenvolvedores.

## Skills

| Skill | O que faz |
|-------|-----------|
| `/brainstorm` | Brainstorming socrático |
| `/plan` | Planejar uma feature |
| `/tdd` | Test-driven development |
| `/debug` | Debugar um problema |
| `/audit` | Auditoria multi-domínio |
| `/onboard` | Onboarding de codebase |
| `/verify` | Verificação antes de concluir |
| `/checkpoint` | Salvar/restaurar progresso |
| `/health` | Score de saúde do projeto |
| `/estimate` | Estimar custo em tokens |
| `/remember` | Salvar uma decisão |
| `/recall` | Relembrar decisões |
| `/finish` | Finalizar branch |
| `/learn` | Aprender enquanto constrói |
| `/worktree` | Isolamento com git worktree |
| `/write-skill` | Criar skills customizadas |
| `/tutorial` | Tutorial interativo |
| `/migrate-framework` | Migrar entre frameworks |

## Native Hooks

O Specialist Agent inclui 4 native hooks do Claude Code que rodam automaticamente:

| Hook | O que faz |
|------|-----------|
| Security Guard | Bloqueia comandos perigosos antes da execução |
| Auto-Dispatch | Sugere o melhor agente para seu prompt |
| Session Context | Injeta estado do projeto no início da sessão |
| Auto-Format | Formata arquivos após Write/Edit |

Instalados durante `npx specialist-agent init`. Veja [Referência de Hooks](/pt-BR/reference/hooks) para detalhes.

## Próximo

- [Agentes](/pt-BR/reference/agents) — Todos os 27+ agentes
- [Skills](/pt-BR/reference/skills) — Todas as skills
