# Boas Práticas

Dicas práticas para extrair o máximo do Specialist Agent e Claude Code. São padrões validados em projetos reais — não conselhos genéricos.

## Planejamento

### Sempre Comece em Modo de Planejamento

Antes de escrever código, use o modo de planejamento ou `@planner` para definir o escopo. Isso evita desperdício de tokens em abordagens erradas.

```text
"Use @planner to plan the checkout flow with payments and email notifications"
```

Para escopos incertos, use `/discovery` primeiro — ele avalia viabilidade e dá um veredicto GO/NO-GO antes de qualquer código.

```text
"/discovery — we need a referral system with rewards, tracking, and analytics"
```

### Deixe o Claude Te Entrevistar

Em vez de escrever um prompt longo, peça ao agente para te entrevistar. Isso revela requisitos que você perderia:

```text
"Use @analyst to interview me about the requirements for user onboarding"
```

O `@analyst` usa a ferramenta `AskUserQuestion` para fazer perguntas direcionadas antes de produzir especificações.

### Planos com Gates por Fase

Quebre features complexas em fases com verificação em cada gate:

```text
Fase 1: Modelo de dados + API → rodar testes → checkpoint
Fase 2: Componentes UI → rodar testes → checkpoint
Fase 3: Integração → rodar testes e2e → checkpoint
```

Use `@executor` para gerenciamento automático de checkpoints e rastreamento de custos entre fases.

## Gerenciamento de Contexto

### Compacte a 50% — Não a 90%

A qualidade do Claude Code degrada conforme o contexto enche. Não espere pelos avisos.

| Uso do Contexto | Qualidade | Ação |
|---|---|---|
| 0-50% | Ótima | Continue trabalhando |
| 50-70% | Declinando | Execute `/compact` agora |
| 70%+ | Degradada | `/compact` ou `/clear` e recomece |

::: tip Vantagem do Specialist Agent
O `@orchestrator` evita esse problema completamente — cada subagente recebe contexto limpo via **Context Isolation Protocol**. Uma orquestração de 5 agentes nunca atinge limites de contexto.
:::

### Um Agente, Uma Tarefa

Não sobrecarregue uma única conversa com tarefas não relacionadas. Em vez disso:

```text
# Ruim — poluição de contexto
"Build the auth module, then review the payments module, then debug the cart"

# Bom — agentes focados
"Use @builder to create the auth module"        # conversa 1
"Use @reviewer to review the payments module"    # conversa 2
"Use @doctor to investigate the cart bug"        # conversa 3
```

Para trabalho multi-parte em uma única sessão, use `@orchestrator` — ele cria subagentes isolados automaticamente.

### Use /rename e /resume para Projetos Longos

Nomeie sessões importantes para poder voltar a elas:

```text
/rename "auth-module-v2"
# ... dias depois ...
/resume "auth-module-v2"
```

## Seleção de Agentes

### Quando Usar Qual Agente

| Situação | Melhor Escolha | Por quê |
|---|---|---|
| Escopo incerto | `/discovery` | Avalia viabilidade antes de gastar tokens |
| Precisa de plano | `@planner` | Fases estruturadas com critérios de aceitação |
| Tarefa simples de build | `@builder` | Execução direta, sem overhead |
| 3+ tarefas paralelas | `@orchestrator` | Cria subagentes, previne conflitos |
| Execução complexa | `@executor` | Checkpoints, custo, quality gates |
| Código suspeito | `@reviewer` | Review 3-em-1 com checks automáticos |
| Algo quebrado | `@doctor` | Diagnóstico em 4 fases com evidência |
| Protótipo rápido | `@builder` (Lite) | Mais rápido, barato, suficiente para iteração |

### Full vs Lite — Matriz de Decisão

| Tarefa | Usar Full | Usar Lite |
|---|---|---|
| PR review | Sim | Não |
| Migração | Sim | Não |
| Investigação de bug | Sim | Não |
| Scaffold de componente | Não | Sim |
| Mudança rápida de texto | Não | Sim |
| Protótipo | Não | Sim |
| Copy de marketing | Não | Sim |

### Claude Code Puro vs Agentes

Para tarefas simples de um único arquivo, Claude Code puro (sem agente) costuma ser mais rápido:

```text
# Não precisa de agente — só pergunte diretamente
"Add a loading spinner to the LoginButton component"
"Fix the typo in the error message on line 42"
"Add TypeScript types to this function"
```

Use agentes quando a tarefa envolve **múltiplos arquivos**, **passos de verificação**, ou **expertise de domínio** (segurança, performance, pagamentos).

## Debugging

### Compartilhe Screenshots

Quando travar em bugs visuais, tire um screenshot e compartilhe com o Claude. Contexto visual resolve problemas mais rápido do que descrevê-los:

```text
"Here's a screenshot of the layout bug — the sidebar overlaps the main content on mobile"
```

### Use MCP para Debug no Browser

Conecte ferramentas de browser via MCP para que agentes vejam logs do console e erros de rede diretamente:

| MCP | O que dá aos Agentes |
|---|---|
| **Playwright** | Testes automatizados de browser, screenshots |
| **Chrome DevTools** | Logs do console, aba de rede, inspeção DOM |

Veja [Integrações MCP](/pt-BR/guide/mcp-integrations#ferramentas-complementares) para configuração.

### Execute Tarefas em Background para Debug ao Vivo

Peça ao Claude para rodar o dev server como tarefa em background, depois debugue contra ele:

```text
"Run the dev server in background, then test the login flow and check for errors"
```

## Otimização de Custos

### Seleção Inteligente de Modelo

O `@executor` seleciona automaticamente o modelo mais barato apropriado:

| Tipo de Tarefa | Modelo | Por quê |
|---|---|---|
| Boilerplate, CRUD, templates | Haiku | Rápido, barato, confiável para padrões simples |
| Lógica de negócio, componentes | Sonnet | Bom equilíbrio de qualidade e custo |
| Arquitetura, debug complexo | Opus | Máximo raciocínio para problemas difíceis |

### Estime Antes de Executar

Use `/estimate` antes de operações caras:

```text
"/estimate — migrate 15 Vue 2 components to Vue 3 Composition API"
```

Isso dá projeções de tokens e custo antes de se comprometer.

### Faça Checkpoints com Frequência

Checkpoints são seguro barato. Se um agente sair do caminho, `Esc Esc` ou `/rewind` te leva de volta instantaneamente em vez de refazer trabalho.

O `@executor` cria checkpoints automaticamente após cada tarefa. Para trabalho manual, faça commits frequentes — pelo menos uma vez por hora de trabalho.

## Workflows Multi-Agente

### Sempre Planeje Antes de Orquestrar

Nunca pule para `@orchestrator` sem um plano:

```text
# Ruim — orquestrador sem direção
"Use @orchestrator to build the dashboard"

# Bom — planeje primeiro, depois execute
"Use @planner to plan the dashboard feature"
# ... revise o plano ...
"Use @orchestrator to execute this plan"
```

### Use Templates de Handoff

Quando agentes passam trabalho entre si, handoffs estruturados previnem perda de contexto:

```text
@builder completa → Standard Handoff → @reviewer recebe
@reviewer encontra bugs → QA FAIL Handoff → @builder recebe com issues específicos
@reviewer aprova → QA PASS Handoff → pronto para merge
```

`@orchestrator` e `@executor` usam esses templates automaticamente. Veja [Workflows Multi-Agente](/pt-BR/scenarios/workflows) para exemplos detalhados.

### Verifique nas Fronteiras

Toda transição entre agentes é um ponto potencial de falha. Sempre verifique após:

1. `@builder` termina → rodar testes antes de enviar para `@reviewer`
2. `@reviewer` aprova → rodar build completo antes de merge
3. `@migrator` completa → rodar suite de testes original para verificar sem regressões

Use `/verify` para garantir verificação baseada em evidências.

## Configuração

### Mantenha CLAUDE.md Abaixo de 200 Linhas

Um `CLAUDE.md` inchado desperdiça contexto em toda interação. Mantenha-o focado:

- **Inclua:** Convenções específicas do projeto, estrutura de diretórios, decisões-chave
- **Não inclua:** Boas práticas genéricas, documentação de framework, regras óbvias

Para regras detalhadas, use arquivos `.claude/rules/` — eles carregam sob demanda em vez de sempre.

### Use .claude/rules/ para Instruções Detalhadas

Divida conjuntos grandes de instruções em arquivos por tópico:

```text
.claude/rules/
  testing.md        # Convenções de teste
  api-patterns.md   # Regras de design de API
  naming.md         # Convenções de nomenclatura
```

Estes carregam baseado em relevância de contexto, economizando tokens comparado a colocar tudo no `CLAUDE.md`.

### Use /permissions em Vez de --dangerously-skip-permissions

Configure permissões granulares com sintaxe wildcard em vez de desabilitar segurança:

```text
/permissions
# Permitir leitura/escrita em src/
# Permitir rodar npm test, npm run build
# Bloquear rm -rf, git push --force
```

## Workflow Diário

### Comece Sessões Direito

1. Verifique git status — working tree limpa antes de começar
2. Puxe últimas mudanças — `git pull` para evitar conflitos
3. Comece com modo de planejamento para features novas
4. Use `/onboard` ao voltar para código desconhecido

### Termine Sessões Direito

1. Commite trabalho em progresso — não perca mudanças
2. Rode testes — verifique que nada quebrou
3. `/rename` a sessão se vai continuar depois
4. Anote itens abertos para a próxima sessão

## Próximos Passos

- [Workflows Multi-Agente](/pt-BR/scenarios/workflows) — Exemplos reais de orquestração com estimativas de custo
- [Composição de Agentes](/pt-BR/guide/agent-composition) — Como agentes trabalham juntos
- [Performance e Custo](/pt-BR/guide/benchmark) — Otimização de uso de tokens
- [FAQ](/pt-BR/guide/faq) — Perguntas comuns respondidas
