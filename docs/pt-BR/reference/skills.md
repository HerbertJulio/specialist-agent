# Skills

::: info Nota sobre Framework
As skills sao instaladas do framework pack escolhido. Os exemplos abaixo utilizam os padroes do **pack Vue 3**. Cada pack fornece skills equivalentes adaptadas ao seu ecossistema (ex: `/dev-create-hook` no React, `/dev-create-store` no SvelteKit).
:::

Skills sao atalhos que voce invoca com `/nome-da-skill` dentro do Claude Code. Cada skill e um diretorio com um arquivo `SKILL.md` dentro de `.claude/skills/`.

## Skills de Desenvolvimento

### /dev-create-module

Cria um scaffold completo de modulo.

```bash
/dev-create-module orders
```

Pergunta sobre endpoints e tipo de UI, depois delega para agentes especializados para criar a estrutura completa.

**Exemplo de saida:**

```text
src/modules/orders/
├── types/orders.types.ts
├── contracts/orders.contracts.ts
├── adapters/order-adapter.ts
├── services/order-service.ts
├── stores/useOrdersStore.ts
├── composables/useOrdersList.ts
├── composables/useOrderMutations.ts
├── components/OrderCard.vue
├── components/OrderForm.vue
├── views/OrdersView.vue
└── __tests__/order-adapter.spec.ts
```

---

### /dev-create-component

Cria um componente Vue com o template padrao de script setup.

```bash
/dev-create-component OrderCard
```

Determina a localizacao (modulo vs compartilhado), aplica props/emits baseados em tipo, impoe < 200 linhas.

---

### /dev-create-service

Cria a camada de dados completa para um recurso.

```bash
/dev-create-service orders
```

Cria 4 arquivos: `.types.ts` + `.contracts.ts` + `-adapter.ts` + `-service.ts`

---

### /dev-create-composable

Cria um composable com integracao Vue Query.

```bash
/dev-create-composable useOrdersList
```

Templates para queries, mutations e logica compartilhada.

---

### /dev-create-test

Cria testes para um arquivo especificado.

```bash
/dev-create-test src/modules/orders/adapters/order-adapter.ts
```

**Prioridade de testes:**
1. Adapters (maior prioridade — funcoes puras, faceis de testar)
2. Composables (abordagem com mock de servico)
3. Componentes (@vue/test-utils)

---

### /dev-generate-types

Gera tipos, contratos e adapter a partir de um endpoint ou resposta JSON.

```bash
/dev-generate-types /v2/orders
```

Trata a conversao snake_case → camelCase e cria adapters tanto de entrada quanto de saida.

---

## Skills de Revisao

### /review-review

Revisao completa de codigo contra `ARCHITECTURE.md`.

```bash
/review-review
# Ou com escopo:
/review-review src/modules/orders/
```

Executa verificacoes automatizadas (`tsc`, `eslint`, `vitest`, `build`) e revisao manual. Produz um relatorio com niveis de severidade.

**Exemplo de saida:**

```markdown
## Review — src/modules/orders/

### Scorecard
| Dimensao | Nota | Observacoes |
|----------|------|-------------|
| Arquitetura | A | Todas as camadas seguem ARCHITECTURE.md |
| Type Safety | B | Falta tipo de retorno em useOrdersList |
| Seguranca | A | Sem v-html, inputs sanitizados |
| Manutenibilidade | A | Arquivos pequenos, nomes claros |

### Auto: tsc ✅ | ESLint ✅ | Build ✅ | Tests ✅

### Violacoes
- order-service.ts:12 — try/catch envolvendo chamada HTTP → remover, deixar error boundary tratar

### Destaques
- order-adapter.ts:5 — Parsing bidirecional limpo com cobertura total de tipos

### Veredito: ⚠️ Com ressalvas — corrija a anotacao de tipo antes do merge
```

---

### /review-check-architecture

Executa 14 verificacoes automatizadas de conformidade:

```bash
/review-check-architecture orders
```

| # | Verificacao |
|---|------------|
| 1 | Servicos sem try/catch |
| 2 | Servicos sem transformacoes |
| 3 | Componentes com script setup |
| 4 | Componentes com TypeScript |
| 5 | Sem Options API |
| 6 | Sem Mixins |
| 7 | Sem estado de servidor no Pinia |
| 8 | Uso de storeToRefs |
| 9 | Sem tipos `any` |
| 10 | Sem imports entre modulos |
| 11 | Sem v-html |
| 12 | Sem artefatos de debug (console.log, debugger) |
| 13 | Queries possuem staleTime |
| 14 | Componentes ≤ 200 linhas |

---

### /review-fix-violations

Encontra e corrige automaticamente violacoes de arquitetura.

```bash
/review-fix-violations orders
```

Corrige por prioridade: 🔴 Critico → 🟡 Importante → 🟢 Melhorias. Valida apos cada correcao.

---

## Skills de Migracao

### /migration-migrate-component

Migra um componente de Options API para script setup.

```bash
/migration-migrate-component src/views/OldPage.vue
```

Analisa a estrutura atual, mapeia consumidores, converte para TypeScript completo, decompoe se > 200 linhas.

---

### /migration-migrate-module

Migra um modulo inteiro atraves de 6 fases.

```bash
/migration-migrate-module src/modules/legacy-orders/
```

Delega para `@migrator`. Inclui pontos de aprovacao entre as fases.

---

## Skills de Documentacao

### /docs-onboard

Resumo rapido de modulo para onboarding de desenvolvedores.

```bash
/docs-onboard orders
```

Lista endpoints, componentes principais, mostra a separacao Pinia vs Vue Query, sinaliza padroes fora do padrao. Objetivo: entender um modulo em 2 minutos.
