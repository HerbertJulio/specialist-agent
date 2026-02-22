# Uso de Tokens

Cada operacao tem um custo diferente de tokens dependendo da complexidade. Use esta tabela para estimar o uso.

## Agentes Full (Sonnet/Opus)

| Operacao | Tokens | Observacoes |
|----------|--------|-------------|
| `/dev-create-component` | ~3-5k | Componente unico |
| `/dev-create-service` | ~5-8k | 4 arquivos (types + contracts + adapter + service) |
| `/dev-create-composable` | ~3-5k | Composable unico |
| `/dev-create-test` | ~3-8k | Depende da complexidade do arquivo |
| `/dev-create-module` | ~15-25k | Scaffold completo de modulo |
| `/dev-generate-types` | ~3-5k | Types + contracts + adapter |
| `/review-check-architecture` | ~5-10k | Verificacoes automatizadas |
| `/review-review` | ~8-15k | Revisao completa com automatizada + manual |
| `/review-fix-violations` | ~5-15k | Depende da quantidade de violacoes |
| `/docs-onboard` | ~3-5k | Resumo do modulo |
| `/migration-migrate-component` | ~5-10k | Migracao de componente unico |
| `/migration-migrate-module` | ~30-80k | Migracao completa de modulo (6 fases) |
| `@doctor` (bug) | ~5-15k | Depende da complexidade do bug |

## Agentes Lite (Haiku)

Agentes Lite usam `model: haiku` — significativamente mais baratos por token.

| Operacao | Tokens | Economia vs Full |
|----------|--------|-----------------|
| Scaffold de componente | ~2-3k | ~50% |
| Camada de servico | ~3-5k | ~40% |
| Revisao de codigo | ~3-5k | ~55% |
| Scaffold de modulo | ~5-10k | ~55% |
| Investigacao de bug | ~2-5k | ~50% |

::: tip Otimizacao de Custos
- Use **agentes Lite** para iteracao rapida e tarefas simples
- Use **agentes Full** para novos modulos, PRs e migracoes complexas
- Para modulos grandes, migre incrementalmente — um componente por vez com `/migration-migrate-component` em vez da migracao completa do modulo
:::
