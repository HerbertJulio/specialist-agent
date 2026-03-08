# Catalogo de Agentes

35 agentes especializados organizados por dominio. Cada agente e um especialista na sua area — chame o certo para o trabalho.

## Agentes Core

A base. Construir, revisar, depurar e migrar codigo.

| Agente | Descricao | Exemplo |
|--------|-----------|---------|
| `@starter` | Criar novos projetos do zero | "Use @starter para criar um SaaS Next.js com Stripe" |
| `@builder` | Construir modulos, componentes, servicos | "Use @builder para criar o modulo de produtos com CRUD" |
| `@reviewer` | Revisao de codigo unificada 3-em-1 (qualidade, seguranca, arquitetura) | "Use @reviewer para revisar src/modules/auth/" |
| `@doctor` | Debugging sistematico em 4 fases | "Use @doctor para investigar o timeout do checkout" |
| `@migrator` | Modernizar codigo legado com seguranca | "Use @migrator para converter class components para hooks" |

## Agentes de Workflow

Orquestrando como voce trabalha — planejando, executando, testando, pareando.

| Agente | Descricao | Exemplo |
|--------|-----------|---------|
| `@planner` | Planejamento adaptativo que escala com a complexidade | "Use @planner para planejar o sistema de notificacoes" |
| `@executor` | Executar planos com checkpoints e rollback | "Use @executor para implementar o plano" |
| `@tdd` | Test-Driven Development com Red-Green-Refactor | "Use @tdd para construir o validador de pagamento" |
| `@debugger` | Debugging sistematico com teste de hipoteses | "Use @debugger para rastrear o memory leak" |
| `@pair` | Pair programming com IA e feedback em tempo real | "Use @pair para trabalhar na feature de busca" |
| `@analyst` | Transformar requisitos em specs tecnicas | "Use @analyst para especificar o sistema multi-tenant" |
| `@orchestrator` | Coordenar multiplos agentes para tarefas complexas | "Use @orchestrator para construir o modulo de auth" |
| `@scout` | Analisar estrutura do projeto e recomendar agentes | "Use @scout para analisar este projeto" |
| `@memory` | Persistir decisoes e contexto entre sessoes | "Use @memory para salvar as decisoes de arquitetura" |

## Agentes de Engenharia

Expertise profunda em dominios — de design de API a arquitetura cloud.

| Agente | Descricao | Exemplo |
|--------|-----------|---------|
| `@api` | Design de API REST/GraphQL com specs OpenAPI | "Use @api para projetar o endpoint de pedidos" |
| `@perf` | Profiling e otimizacao de performance | "Use @perf para otimizar o tempo de carga do dashboard" |
| `@i18n` | Internacionalizacao e localizacao | "Use @i18n para adicionar suporte a espanhol" |
| `@docs` | Gerar documentacao a partir do codigo | "Use @docs para documentar o modulo de auth" |
| `@refactor` | Refactoring seguro de codigo com testes | "Use @refactor para extrair a logica de validacao" |
| `@deps` | Gerenciamento e atualizacao de dependencias | "Use @deps para auditar e atualizar dependencias" |
| `@explorer` | Exploracao e analise profunda do codebase | "Use @explorer para mapear o fluxo de dados no checkout" |
| `@finance` | Sistemas de pagamento, cobranca, assinaturas | "Use @finance para implementar assinaturas Stripe" |
| `@cloud` | Arquitetura cloud, IaC, serverless | "Use @cloud para projetar a infraestrutura AWS" |
| `@security` | Auth, OWASP, criptografia, auditoria | "Use @security para auditar o fluxo de autenticacao" |
| `@designer` | Design systems, acessibilidade, padroes de UI | "Use @designer para criar a biblioteca de componentes" |
| `@data` | Design de banco de dados, migracoes, otimizacao | "Use @data para projetar o schema multi-tenant" |
| `@devops` | Docker, Kubernetes, pipelines CI/CD | "Use @devops para configurar o pipeline do GitHub Actions" |
| `@tester` | Estrategias de teste e planos de cobertura | "Use @tester para criar a estrategia de testes" |
| `@legal` | GDPR, LGPD, implementacao de compliance | "Use @legal para implementar gerenciamento de consentimento LGPD" |
| `@architect` | Design e migracao completa de arquitetura de sistema | "Use @architect para migrar para arquitetura hexagonal" |
| `@ripple` | Analise de impacto de mudancas no codigo | "Use @ripple para analisar o impacto de remover UserService" |

## Agentes de Negocios

Estrategia, crescimento e operacoes voltadas ao usuario.

| Agente | Descricao | Exemplo |
|--------|-----------|---------|
| `@marketing` | Copy, SEO, experimentos de crescimento, estrategia social | "Use @marketing para escrever copy da landing page" |
| `@product` | Roadmaps de produto, specs, PRDs, priorizacao de features | "Use @product para criar o roadmap do Q1" |
| `@support` | Docs de suporte, FAQs, runbooks, caminhos de escalacao | "Use @support para criar o guia de troubleshooting da API" |

## Agentes de Automacao

Automatizar operacoes repetitivas — triagem de erros, monitoramento de producao, workflows de correcao.

| Agente | Descricao | Exemplo |
|--------|-----------|---------|
| `@sentry-triage` | Buscar erros do Sentry, cruzar com PRs, priorizar por severidade, criar PRs de correcao automaticamente | "Use @sentry-triage para verificar erros das ultimas 24h" |

## Agentes Especificos de Framework

Cada pack de framework inclui versoes otimizadas dos agentes core:

| Pack | Agentes Incluidos |
|------|-------------------|
| Vue 3 | @builder, @reviewer, @doctor, @migrator |
| React | @builder, @reviewer, @doctor, @migrator |
| Next.js | @builder, @reviewer, @doctor, @migrator |
| SvelteKit | @builder, @reviewer, @doctor, @migrator |
| Angular | @builder, @reviewer, @doctor, @migrator |
| Astro | @builder, @reviewer, @doctor, @migrator |
| Nuxt | @builder, @reviewer, @doctor, @migrator |

## Modos de Agente

Todo agente tem dois modos:

| Modo | Modelo | Caso de Uso |
|------|--------|-------------|
| Full | Sonnet/Opus | Qualidade maxima, output detalhado |
| Lite | Haiku | Menor custo, respostas mais rapidas |

Escolha durante a instalacao: `npx specialist-agent init`
