# Performance e Custo

## Eficiência de Tokens

### Planejamento Adaptativo

Tarefas são planejadas com base na complexidade:

| Tipo de Tarefa | Planejamento | Tokens |
|----------------|--------------|--------|
| Corrigir typo | Pular | ~200 |
| Adicionar campo | Plano rápido | ~500 |
| Novo módulo | Plano completo | ~5.000 |

Tarefas simples pulam planejamento desnecessário.

### Review Unificado

Um agente faz três tipos de review:

1. **Spec compliance** - Atende os requisitos?
2. **Qualidade de código** - Está limpo e testado?
3. **Aderência à arquitetura** - Segue os padrões?

Passada única = menos tokens.

### Escalabilidade de Custo

| Tarefas | Tokens | Custo Est. |
|---------|--------|------------|
| 1 | ~5k | ~$0.08 |
| 2 | ~10k | ~$0.15 |
| 3 | ~15k | ~$0.23 |
| 4 | ~20k | ~$0.30 |

Escalabilidade linear. Mais tarefas não multiplicam custos.

## Modo Full vs Lite

| Modo | Modelo | Tokens | Custo |
|------|--------|--------|-------|
| Full | Sonnet/Opus | ~15-25k | Maior |
| Lite | Haiku | ~5-10k | 60-80% menos |

Modo Lite é ideal para:
- Scaffold de módulos
- Componentes rápidos
- Iterações rápidas

Modo Full é ideal para:
- Features complexas
- PR reviews
- Código de produção

## Comparação de Features

| Feature | Descrição |
|---------|-----------|
| Planejamento adaptativo | Ajusta à complexidade da tarefa |
| Review unificado | 3 verificações em 1 passada |
| Verificação TDD | Baseado em prova, não em confiança |
| Checkpoints | Git save/restore |
| Memória de sessão | Lembra decisões |
| Tracking de custo | Métricas de tokens por sessão |
| Multi-plataforma | Claude Code, Cursor, VS Code, Windsurf, Codex |
| Framework packs | Next.js, React, Vue, SvelteKit |

## Exemplo: Autenticação de Usuário

**Tarefas:**
1. Criar auth service
2. Criar auth hook
3. Criar componente de login
4. Criar testes
5. Revisar código

**Breakdown de tokens:**

| Fase | Full | Lite |
|------|------|------|
| Planejamento | ~1.500 | ~500 |
| Construção | ~8.000 | ~3.000 |
| Review | ~3.000 | ~1.000 |
| **Total** | **~12.500** | **~4.500** |

**Estimativa de custo:**
- Full (Sonnet): ~$0.19
- Lite (Haiku): ~$0.02

## Verificação

### Verificação TDD

Testes são baseados em prova:

```text
FAIL src/discount.test.ts
  Expected: 90
  Received: undefined

[Evidência da fase RED capturada]
```

Não "eu rodei o teste" - output real.

### Verificação de Review

Vereditos claros:

```text
Spec Compliance: PASS
Code Quality: PASS
Architecture: FAIL

Verdict: Requires Changes
```

## Métricas de Sessão

Após cada sessão:

```text
Session Summary
───────────────
Tasks: 5/5 complete
Tokens: 45,230 (~$0.68)
Time: 12m 34s
Commits: 7
Files: 23

Agent Breakdown:
  @planner: 8,200 tokens
  @builder: 28,400 tokens
  @reviewer: 8,630 tokens
```

Acompanhe custos enquanto trabalha.
