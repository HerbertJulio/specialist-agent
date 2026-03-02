# Introdução

Specialist Agent é uma coleção de agentes de IA que ajudam você a desenvolver software mais rápido.

## Como Funciona

1. Você descreve o que precisa
2. O agente certo cuida disso
3. Você recebe código pronto para produção

```
"Crie um módulo de produtos com CRUD"
→ @builder cria types, service, componentes, testes

"Revise o módulo de auth"
→ @reviewer verifica qualidade, arquitetura, segurança

"Debug o erro de login"
→ @debugger rastreia as camadas para encontrar a causa raiz
```

## Instalação

**Marketplace:**
```
/plugin install specialist-agent
```

**CLI:**
```bash
npx specialist-agent init
```

Funciona com Claude Code, Cursor, VS Code, Windsurf e Codex.

## Escolha Seu Cenário

### Eu quero...

| Objetivo | Agente | Exemplo |
|----------|--------|---------|
| Construir uma feature nova | `@builder` | "Criar registro de usuários" |
| Revisar código | `@reviewer` | "Revisar o módulo de auth" |
| Debugar um problema | `@debugger` | "Corrigir o erro 500 no login" |
| Projetar uma API | `@api` | "Projetar API REST para pedidos" |
| Adicionar pagamentos | `@finance` | "Integrar Stripe checkout" |
| Adicionar autenticação | `@security` | "Implementar JWT auth" |
| Otimizar performance | `@perf` | "Otimizar o dashboard" |
| Adicionar traduções | `@i18n` | "Adicionar suporte a português" |
| Modernizar código legado | `@migrator` | "Migrar para TypeScript" |
| Planejar uma feature complexa | `@planner` | "Planejar o fluxo de checkout" |
| Auditar antes do release | `/audit` | "/audit src/modules/auth" |
| Onboarding em codebase novo | `/onboard` | "/onboard" |

## Suporte a Frameworks

| Framework | O que Você Recebe |
|-----------|-------------------|
| Next.js | Padrões App Router, Server Components |
| React | Hooks, React Query, Zustand |
| Vue 3 | Composition API, Pinia, Vue Query |
| SvelteKit | Stores, load functions |

Cada framework tem padrões específicos para services, state e componentes.

## Modo Full vs Lite

| Modo | Melhor Para | Custo |
|------|-------------|-------|
| Full | Features complexas, PRs | Padrão |
| Lite | Tarefas rápidas, scaffolding | 60-80% menos |

O modo Lite usa um modelo menor para resultados mais rápidos e baratos.

## Próximos Passos

1. [Ver cenários reais](/pt-BR/scenarios/) - Como desenvolvedores usam cada agente
2. [Comece a construir](/pt-BR/scenarios/build-feature) - Crie sua primeira feature
3. [Ver todos os agentes](/pt-BR/reference/agents) - Referência completa
