# Referência de Agentes

27+ agentes de IA especializados organizados por propósito.

::: tip Features Transversais
Todos os agentes incluem:

- **Protocolo de Verificação** - Verificação baseada em prova antes de declarar conclusão
- **Anti-Racionalização** - Tabelas prevenindo atalhos e desculpas comuns
- **Modo Lite** - Variantes Haiku otimizadas em custo (60-80% mais barato)
- **Handoff Protocol** - Delegação estruturada entre agentes

:::

## Referência Rápida

| Necessidade | Agente |
|-------------|--------|
| Novo projeto | `@starter` |
| Nova feature | `@builder` |
| Revisão de código | `@reviewer` |
| Corrigir bug | `@doctor` ou `@debugger` |
| Planejar feature | `@planner` |
| Escrever testes | `@tdd` ou `@tester` |
| Design de API | `@api` |
| Performance | `@perf` |
| Segurança | `@security` |
| Pagamentos | `@finance` |
| Infraestrutura | `@cloud` ou `@devops` |
| Banco de dados | `@data` |
| Traduções | `@i18n` |
| Documentação | `@docs` |
| Refactoring | `@refactor` |
| Dependências | `@deps` |
| Compliance | `@legal` |
| Explorar codebase | `@explorer` ou `@scout` |

---

## Agentes Core

### @starter

Criar projetos do zero.

```bash
"Use @starter to create an e-commerce app with Next.js + PostgreSQL"
```

**Suporta:** Vue, React, Next.js, SvelteKit, Express, Fastify, PostgreSQL, MongoDB e mais.

---

### @builder

Construir módulos, componentes, serviços e testes.

```bash
# Módulo completo
"Use @builder to create a products module with CRUD"

# Componente
"Use @builder to create a ProductCard component"

# Serviço
"Use @builder to create the orders service for /v2/orders"
```

**Cria:** Types, adapters, services, hooks/composables, componentes, testes.

---

### @reviewer

Revisar código antes do merge. Três verificações em uma:

1. **Spec compliance** - Atende os requisitos?
2. **Qualidade de código** - Está limpo e testado?
3. **Aderência à arquitetura** - Segue os padrões?

```bash
"Use @reviewer to review the auth module"
```

**Output:** Veredito Pass/Fail com problemas específicos.

---

### @doctor

Investigar bugs rastreando pelas camadas.

```bash
"Use @doctor to investigate the 500 error on login"
```

**Rastreia:** Component → State → Adapter → Service → API

Encontra causa raiz, não sintomas.

---

### @migrator

Modernizar código legado em 6 fases.

```bash
"Use @migrator to migrate src/legacy/billing/"
```

**Fases:** Análise → Estrutura → Types → Services → State → Components

Aprovação necessária entre fases.

---

## Agentes de Workflow

### @planner

Planejar features baseado na complexidade.

| Complexidade | Planejamento |
|--------------|--------------|
| Trivial | Pular |
| Simples | Plano rápido |
| Médio | Plano detalhado |
| Complexo | Design completo |

```bash
"Use @planner to plan user authentication"
```

---

### @executor

Executar planos com checkpoints.

- Rastreia progresso e custos
- Cria checkpoints git
- Suporta rollback

```bash
"Use @executor to implement the auth plan"
```

---

### @tdd

Test-Driven Development.

1. **RED** - Escrever teste falhando
2. **GREEN** - Fazer passar
3. **REFACTOR** - Melhorar o código

```bash
"Use @tdd to implement calculateDiscount"
```

Sem código sem teste falhando primeiro.

---

### @debugger

Debugging sistemático em 4 fases.

1. **Gather** - Coletar evidências
2. **Analyze** - Formar hipótese
3. **Test** - Verificar hipótese
4. **Implement** - Corrigir e validar

```bash
"Use @debugger to fix the stale data issue"
```

---

### @pair

Pair programming em tempo real.

- Pensa em voz alta
- Captura erros cedo
- Sugere melhorias

```bash
"Use @pair while I work on the checkout flow"
```

---

## Agentes Especialistas

### @api

Projetar APIs REST e GraphQL.

```bash
"Use @api to design the orders API with OpenAPI spec"
```

**Cria:** Specs OpenAPI, schemas GraphQL, documentação de endpoints.

---

### @perf

Otimizar performance.

```bash
"Use @perf to analyze and optimize the dashboard"
```

**Analisa:** Bundle size, runtime, rede, renderização.

---

### @security

Segurança de aplicações.

```bash
"Use @security to implement JWT auth with refresh tokens"
"Use @security to audit for OWASP vulnerabilities"
```

**Cobre:** Auth, RBAC/ABAC, criptografia, scanning de vulnerabilidades.

---

### @finance

Sistemas financeiros.

```bash
"Use @finance to integrate Stripe payments"
```

**Cobre:** Pagamentos, assinaturas, faturamento, relatórios.

---

### @cloud

Arquitetura cloud.

```bash
"Use @cloud to set up AWS with Terraform"
```

**Cobre:** AWS, GCP, Azure, Terraform, Pulumi, serverless.

---

### @data

Engenharia de banco de dados.

```bash
"Use @data to design the schema with Prisma"
```

**Cobre:** Design de schema, migrações, cache, otimização de queries.

---

### @devops

DevOps e infraestrutura.

```bash
"Use @devops to create Docker and Kubernetes config"
```

**Cobre:** Docker, K8s, CI/CD, monitoramento, logging.

---

### @i18n

Internacionalização.

```bash
"Use @i18n to add multi-language support"
```

**Cobre:** Traduções, gerenciamento de locale, suporte RTL.

---

### @docs

Geração de documentação.

```bash
"Use @docs to generate API documentation"
```

**Cria:** README, docs de API, documentação inline.

---

### @refactor

Refactoring de código.

```bash
"Use @refactor to clean up the utils module"
```

**Aplica:** Extract method, remover duplicação, melhorar nomenclatura.

---

### @deps

Gerenciamento de dependências.

```bash
"Use @deps to audit and update dependencies"
```

**Cobre:** Auditoria de segurança, check de desatualizadas, deps não utilizadas.

---

### @legal

Compliance de privacidade de dados.

```bash
"Use @legal to review for GDPR compliance"
```

**Cobre:** GDPR, LGPD, CCPA, gerenciamento de consentimento.

---

### @tester

Especialista em testes.

```bash
"Use @tester to create tests for the orders module"
```

**Cria:** Testes unitários, testes de integração, testes E2E.

---

### @designer

Implementação UI/UX.

```bash
"Use @designer to create a design system with dark mode"
```

**Cobre:** Design tokens, layouts responsivos, acessibilidade.

---

## Agentes de Suporte

### @scout

Análise rápida do projeto. Recomenda quais agentes usar.

```bash
"Use @scout to analyze this project"
```

Ultra-leve. ~500 tokens.

---

### @analyst

Converter requisitos de negócio em specs técnicas.

```bash
"Use @analyst to convert these requirements to a technical spec"
```

---

### @orchestrator

Coordenar múltiplos agentes.

```bash
"Use @orchestrator to build the feature with parallel agents"
```

---

### @memory

Gerenciamento de memória de sessão.

```bash
"Use @memory to save this decision"
"Use @memory to recall previous decisions"
```

---

### @explorer

Explorar codebases desconhecidos.

```bash
"Use @explorer to map this codebase - I'm new here"
```

**Output:** Score de saúde, mapa de estrutura, recomendações.

---

## Protocolo de Verificação

Todos os agentes-chave verificam afirmações com evidência antes de marcar trabalho como completo.

```text
AFIRMAÇÃO: "Testes passam"
PROVA: Deve mostrar output real do teste (PASS/FAIL)

AFIRMAÇÃO: "Build passou"
PROVA: Deve mostrar output do comando de build

AFIRMAÇÃO: "Bug corrigido"
PROVA: Deve mostrar teste que reproduz o bug agora passando
```

Nada de "deve funcionar" ou "provavelmente tá ok". Rode o comando, mostre o output.

Veja a skill `/verify` para o framework completo de verificação.

---

## Anti-Racionalização

Agentes-chave incluem tabelas de prevenção de racionalização:

| Desculpa | Realidade |
|----------|-----------|
| "É óbvio, não precisa testar" | Óbvio pra você, não pro computador. Rode o teste. |
| "Só dessa vez" | "Só dessa vez" é como todo mau hábito começa. |
| "Deve funcionar" | "Deve" não é evidência. Prove. |
| "Verifico depois" | Depois nunca chega. Verifique agora. |

Se você se pegar pensando "só dessa vez" - pare e siga o processo.

---

## Versões Lite

Todos os agentes têm versões lite usando o modelo Haiku.

| Aspecto | Full | Lite |
|---------|------|------|
| Modelo | Sonnet/Opus | Haiku |
| Custo | Maior | 60-80% menos |
| Melhor para | Tarefas complexas | Tarefas rápidas |

Escolha o modo durante a instalação:

```bash
npx specialist-agent init  # Selecione "Lite"
```
