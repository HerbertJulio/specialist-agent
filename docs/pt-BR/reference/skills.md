# Referencia de Skills

24 workflows repetíveis. Cada skill é um comando slash que guia seu assistente de IA por um processo estruturado.

## Planejamento

| Skill | O que faz | Exemplo |
|-------|-----------|---------|
| `/brainstorm` | Brainstorming socrático antes de planejar | `/brainstorm implementar chat em tempo real` |
| `/plan` | Planejamento adaptativo que escala com a complexidade | `/plan adicionar autenticação com JWT` |
| `/discovery` | Análise de viabilidade com decisão GO/NO-GO | `/discovery migrar de REST para GraphQL` |
| `/estimate` | Estimar custo e uso de tokens antes da execução | `/estimate construir o sistema de notificações` |

## Desenvolvimento

| Skill | O que faz | Exemplo |
|-------|-----------|---------|
| `/tdd` | Test-Driven Development com Red-Green-Refactor | `/tdd criar o validador de pagamento` |
| `/debug` | Debugging sistemático com teste de hipóteses | `/debug o problema de timeout no checkout` |
| `/autofix` | Triagem automática de erros do Sentry/logs, prioriza e cria PRs de correção | `/autofix --timeframe=24h` |
| `/lint` | Lint e correção automática de problemas no código | `/lint src/modules/auth/` |
| `/commit` | Commits convencionais inteligentes com detecção de escopo | `/commit` |

## Qualidade

| Skill | O que faz | Exemplo |
|-------|-----------|---------|
| `/verify` | Verificar com evidência antes de marcar como concluído | `/verify` |
| `/codereview` | Code review paralelo com múltiplos revisores | `/codereview src/modules/checkout/` |
| `/audit` | Auditoria multi-domínio (segurança, performance, arquitetura) | `/audit src/` |
| `/health` | Score de saúde do projeto em múltiplas dimensões | `/health` |

## Workflow

| Skill | O que faz | Exemplo |
|-------|-----------|---------|
| `/checkpoint` | Salvar/restaurar progresso em tarefas longas | `/checkpoint save` |
| `/finish` | Finalizar branch com testes, lint, commit | `/finish` |
| `/worktree` | Isolamento com git worktree para trabalho paralelo | `/worktree create feature/auth` |
| `/learn` | Aprender padrões enquanto constrói | `/learn como esse fluxo de auth funciona` |

## Migração

| Skill | O que faz | Exemplo |
|-------|-----------|---------|
| `/migrate-framework` | Migrar entre frameworks (Vue para React, etc.) | `/migrate-framework from vue to react` |
| `/migrate-architecture` | Migrar entre padrões de arquitetura | `/migrate-architecture to hexagonal` |

## Conhecimento

| Skill | O que faz | Exemplo |
|-------|-----------|---------|
| `/remember` | Salvar decisões e contexto para sessões futuras | `/remember sempre usar Zustand para estado` |
| `/recall` | Relembrar decisões e contexto salvos | `/recall gerenciamento de estado` |
| `/onboard` | Onboarding de codebase para novos membros do time | `/onboard` |
| `/tutorial` | Tutorial interativo para aprender o projeto | `/tutorial` |
| `/write-skill` | Criar ou melhorar skills customizadas | `/write-skill deploy` |
