# Skills

Skills sao atalhos que voce invoca com `/nome-da-skill` dentro do Claude Code. Cada skill e um diretorio com um arquivo `SKILL.md` dentro de `.claude/skills/`.

## Skills de Desenvolvimento

### /dev-create-module

Cria um scaffold completo de modulo.

```bash
/dev-create-module domains
```

Pergunta sobre endpoints e tipo de UI, depois delega para agentes especializados para criar a estrutura completa.

---

### /dev-create-component

Cria um componente Vue com o template padrao de script setup.

```bash
/dev-create-component DomainsTable
```

Determina a localizacao (modulo vs compartilhado), aplica props/emits baseados em tipo, impoe < 200 linhas.

---

### /dev-create-service

Cria a camada de dados completa para um recurso.

```bash
/dev-create-service domains
```

Cria 4 arquivos: `.types.ts` + `.contracts.ts` + `-adapter.ts` + `-service.ts`

---

### /dev-create-composable

Cria um composable com integracao Vue Query.

```bash
/dev-create-composable useDomainsList
```

Templates para queries, mutations e logica compartilhada.

---

### /dev-create-test

Cria testes para um arquivo especificado.

```bash
/dev-create-test src/modules/domains/adapters/domains-adapter.ts
```

**Prioridade de testes:**
1. Adapters (maior prioridade — funcoes puras, faceis de testar)
2. Composables (abordagem com mock de servico)
3. Componentes (@vue/test-utils)

---

### /dev-generate-types

Gera tipos, contratos e adapter a partir de um endpoint ou resposta JSON.

```bash
/dev-generate-types /v4/domains
```

Trata a conversao snake_case → camelCase e cria adapters tanto de entrada quanto de saida.

---

## Skills de Revisao

### /review-review

Revisao completa de codigo contra `ARCHITECTURE.md`.

```bash
/review-review
# Ou com escopo:
/review-review src/modules/marketplace/
```

Executa verificacoes automatizadas (`tsc`, `eslint`, `vitest`, `build`) e revisao manual. Produz um relatorio com niveis de severidade.

**Veredito:** ✅ Aprovado | ⚠️ Com ressalvas | ❌ Requer alteracoes

---

### /review-check-architecture

Executa 14 verificacoes automatizadas de conformidade:

```bash
/review-check-architecture marketplace
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
/review-fix-violations marketplace
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
/migration-migrate-module src/views/marketplace/
```

Delega para `@migrator`. Inclui pontos de aprovacao entre as fases.

---

## Skills de Documentacao

### /docs-onboard

Resumo rapido de modulo para onboarding de desenvolvedores.

```bash
/docs-onboard marketplace
```

Lista endpoints, componentes principais, mostra a separacao Pinia vs Vue Query, sinaliza padroes fora do padrao. Objetivo: entender um modulo em 2 minutos.
