# Workflows Multi-Agente

::: info Agentes: `@orchestrator` `@executor` `@planner` · Complexidade: Media-Alta
:::

Exemplos reais de workflows mostrando como multiplos agentes coordenam para entregar funcionalidades completas.

## Sprint MVP Startup (1 semana) {#startup-mvp}

**Objetivo:** Construir um MVP SaaS com autenticacao, dashboard e faturamento.

**Agentes envolvidos:** `@planner` → `@starter` → `@orchestrator` → `@builder` × 3 → `@tester` → `@reviewer`

### Workflow

```
Dia 1: Planejamento & Setup
────────────────────────────

User: /plan Construir um MVP SaaS com auth, dashboard e billing Stripe

  @planner analisa requisitos
  → Produz plano COMPLEXO com 12 tarefas

User: Crie o projeto

  @starter cria o scaffold
  → Frontend (React/Vue) + Backend (Node.js) + Database (PostgreSQL)
  → Instala agentes e skills do Specialist Agent

Dia 2-3: Build Paralelo
─────────────────────────

User: @orchestrator Execute o plano

  @orchestrator decompoe em 3 streams paralelos:

  Stream 1: @builder (Auth)
  ├── Modelo de usuario + migration
  ├── Middleware JWT auth
  ├── Endpoints Login/Register
  └── Composable/hook de auth

  Stream 2: @builder (Dashboard)
  ├── Layout do dashboard
  ├── Service + adapter de stats
  ├── Componentes de graficos
  └── Pagina do dashboard

  Stream 3: @builder (Billing)
  ├── Service de integracao Stripe
  ├── Planos de assinatura
  ├── Fluxo de checkout
  └── Webhook handler

  Handoff: @orchestrator merge todos os streams
  → Roda testes de integracao
  → Cria checkpoint

Dia 4: Testes & Review
───────────────────────

User: @tester Criar estrategia de testes para o MVP

  @tester desenha piramide de testes:
  → 70% testes unitarios (services, adapters)
  → 20% testes de integracao (endpoints API)
  → 10% testes E2E (fluxo auth, fluxo checkout)

User: @reviewer Revisar todas as mudancas

  @reviewer executa review unificado 3-em-1:
  → Conformidade com Spec: PASS
  → Qualidade de Codigo: B+ (melhorias menores sugeridas)
  → Adequacao Arquitetural: PASS

Dia 5: Polish & Deploy
───────────────────────

User: @devops Configurar pipeline CI/CD

  @devops cria:
  → Workflow GitHub Actions
  → Docker Compose para dev local
  → Config de deploy
```

### Estimativa de Custo

```
@planner:       ~3.000 tokens
@starter:       ~8.000 tokens
@orchestrator:  ~5.000 tokens
@builder × 3:  ~45.000 tokens
@tester:       ~12.000 tokens
@reviewer:      ~8.000 tokens
@devops:        ~6.000 tokens
─────────────────────────────
Total:         ~87.000 tokens (~$1,30)
```

---

## Sprint Landing Page (1 dia) {#landing-page}

**Objetivo:** Projetar e construir uma landing page completa em um dia.

**Agentes envolvidos:** `@designer` → `@builder` × 2 → `@perf` → `@reviewer`

### Workflow

```
Manha: Design & Setup (9:00 - 11:00)
──────────────────────────────────────

User: @designer Criar um design system para nossa landing page

  @designer produz:
  → Paleta de cores, tipografia, tokens de espacamento
  → Inventario de componentes (Hero, Features, Pricing, CTA, Footer)
  → Breakpoints responsivos
  → Requisitos de acessibilidade (WCAG 2.1 AA)

Meio-dia: Build Paralelo (11:00 - 15:00)
──────────────────────────────────────────

User: @orchestrator Construir as secoes da landing page em paralelo

  @orchestrator atribui:

  @builder-1 (Acima da dobra):
  ├── Secao Hero com CTA
  ├── Prova social / logos
  └── Destaques de funcionalidades

  @builder-2 (Abaixo da dobra):
  ├── Grid detalhado de features
  ├── Tabela de precos
  ├── Accordion de FAQ
  └── Footer com links

  Handoff: Merge + verificar comportamento responsivo

Tarde: Otimizar & Entregar (15:00 - 17:00)
────────────────────────────────────────────

User: @perf Otimizar a landing page para Core Web Vitals

  @perf analisa:
  → Otimizacao de imagens (WebP, lazy loading)
  → Tamanho do bundle (code splitting, tree shaking)
  → Estrategia de carregamento de fontes (font-display: swap)
  → Correcoes de CLS (dimensoes explicitas)

User: @reviewer Review final

  @reviewer veredito: Aprovado
  → Performance: A (LCP < 2.5s)
  → Acessibilidade: A (WCAG 2.1 AA compliant)
  → SEO: Meta tags, dados estruturados, sitemap
```

---

## Investigacao & Fix de Bug (2 horas) {#bug-fix}

**Objetivo:** Investigar um bug em producao, encontrar a causa raiz, corrigir e verificar.

**Agentes envolvidos:** `@doctor` → `@debugger` → `@builder` → `@tester` → `@reviewer`

### Workflow

```
Fase 1: Diagnostico (30 min)
─────────────────────────────

User: Usuarios reportam erros "Pagamento falhou" intermitentes

  @doctor executa diagnostico em 4 fases:
  Fase 1 - Sintomas: Logs de erro mostram webhook Stripe 500s
  Fase 2 - Hipoteses:
    H1: Race condition no webhook handler
    H2: Chave de idempotencia nao definida
    H3: Timeout de transacao no banco
  Fase 3 - Evidencias:
    → Logs mostram eventos de webhook duplicados
    → Handler processa mesmo evento duas vezes
    → Segundo processamento falha em constraint unique
  Fase 4 - Causa Raiz: Verificacao de idempotencia ausente

Fase 2: Correcao (30 min)
──────────────────────────

User: @builder Corrigir o webhook handler

  @builder implementa:
  → Adicionar verificacao de chave de idempotencia
  → Adicionar wrapping de transacao no banco
  → Adicionar logging estruturado para eventos webhook
  → Adicionar logica de retry com backoff exponencial

Fase 3: Verificacao (30 min)
─────────────────────────────

User: @tester Escrever testes para a correcao

  @tester cria:
  → Teste unitario: verificacao de idempotencia
  → Teste de integracao: tratamento de webhook duplicado
  → Caso edge: processamento concorrente de webhook

User: /verify all

  /verify output:
  → Testes: 47/47 passando (3 novos)
  → TypeScript: 0 erros
  → Build: sucesso

Fase 4: Review (30 min)
────────────────────────

User: @reviewer Revisar a correcao

  @reviewer veredito: Aprovado
  → Seguranca: A (validacao de input adequada)
  → Correcao endereca causa raiz, nao sintomas
  → Observabilidade: logging estruturado adicionado
```

---

## Projeto de Migracao (1-2 semanas) {#migration}

**Objetivo:** Migrar uma app legada Vue 2 Options API para Vue 3 Composition API.

**Agentes envolvidos:** `@scout` → `@planner` → `@orchestrator` → `@migrator` × N → `@tester` → `@reviewer`

### Workflow

```
Semana 1: Analise & Planejamento
──────────────────────────────────

User: @scout Analisar o codebase atual

  @scout produz inventario:
  → 45 componentes (38 Options API, 7 ja Composition)
  → 12 mixins (precisam conversao para composables)
  → 8 modulos Vuex (precisam migracao para Pinia)
  → 6 filters (precisam conversao para funcoes)
  → Auditoria de deps: 3 pacotes precisam alternativas Vue 3

User: /plan Migrar toda a app para Vue 3 Composition API

  @planner produz plano COMPLEXO:
  → Fase 1: Infraestrutura (Vue 3, Vite, Pinia)
  → Fase 2: Codigo compartilhado (mixins → composables, filters)
  → Fase 3: Componentes (migracao em lote, 5/dia)
  → Fase 4: Testes (atualizar todos os testes)
  → Fase 5: Cleanup (remover compatibilidade Vue 2)

Semana 2: Execucao
───────────────────

User: @orchestrator Executar o plano de migracao

  @orchestrator coordena:

  Dia 1: @migrator - Migracao de infraestrutura
  Dia 2: @migrator × 2 - Mixins → Composables (paralelo)
  Dia 3-4: @migrator × 3 - Componentes (lotes de 5)
  Dia 5: @tester - Atualizar todos os testes
  Final: @reviewer - Review completo do codebase

  Template de handoff usado em cada fronteira de fase:
  → QA PASS / QA FAIL com evidencias
  → Transferencia de contexto para agente da proxima fase
```

---

## Feature Multi-Dominio (3-5 dias) {#multi-domain}

**Objetivo:** Adicionar um sistema de referral com frontend, backend, banco de dados e notificacoes.

**Agentes envolvidos:** `@analyst` → `@planner` → `@data` → `@api` → `@orchestrator` → `@builder` × 2 → `@tester` → `@security` → `@reviewer`

### Workflow

```
Dia 1: Requisitos & Design
────────────────────────────

User: @analyst Definir requisitos para um sistema de referral

  @analyst produz spec:
  → User stories (quem indica, indicado)
  → Regras de negocio (niveis de recompensa, limites)
  → Criterios de aceitacao por story
  → Casos edge (auto-referral, links expirados)

User: @data Projetar o schema do banco

  @data produz:
  → Tabela referral_codes
  → Tabela referral_events
  → Tabela reward_transactions
  → Indices e constraints
  → Script de migracao

User: @api Projetar os endpoints da API

  @api produz:
  → POST /api/referrals/generate
  → GET /api/referrals/:code
  → POST /api/referrals/redeem
  → GET /api/referrals/stats
  → Spec OpenAPI

Dia 2-3: Build
───────────────

User: @orchestrator Construir o sistema de referral

  @orchestrator atribui streams paralelos:

  @builder-1 (Backend):
  ├── Service de referral
  ├── Calculo de recompensa
  ├── Notificacoes por email
  └── Endpoints da API

  @builder-2 (Frontend):
  ├── Dashboard de referrals
  ├── Componente de compartilhar/convidar
  ├── Historico de recompensas
  └── Handler de link de referral

Dia 4: Seguranca & Testes
──────────────────────────

User: @security Auditar o sistema de referral

  @security verifica:
  → Rate limiting na geracao de codigos
  → Entropia do codigo de referral (nao adivinhavel)
  → Prevencao de abuso de recompensa
  → Validacao de input em todos os endpoints

User: @tester Criar testes abrangentes

  @tester cria:
  → Unitario: calculo de recompensa, geracao de codigo
  → Integracao: fluxo completo de referral
  → E2E: convite → cadastro → recompensa

Dia 5: Review & Entrega
─────────────────────────

User: @reviewer Revisar todo o sistema de referral

  @reviewer unificado 3-em-1:
  → Spec: Todas as user stories implementadas
  → Qualidade: A- (uma melhoria menor)
  → Arquitetura: Segue ARCHITECTURE.md
  → Veredito: Aprovado
```

## Dicas para Workflows Multi-Agente

1. **Sempre comece com `/plan`** - Mesmo que voce ache que sabe o escopo
2. **Use `@orchestrator` para 3+ agentes** - Nao coordene manualmente
3. **Checkpoints sao obrigatorios** - Cada fronteira de fase recebe um checkpoint
4. **Templates de handoff** - Use handoffs estruturados entre agentes
5. **Verifique em cada fronteira** - Execute `/verify` antes de passar para a proxima fase
6. **Rastreamento de custo** - Use `/estimate` antes de operacoes caras
