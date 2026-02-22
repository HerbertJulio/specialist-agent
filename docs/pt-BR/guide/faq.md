# FAQ

Perguntas frequentes sobre o Specialist Agent.

## Geral

### Posso usar sem framework pack?

Sim. Os 9 agentes framework-agnostic (`@starter`, `@explorer`, `@finance`, `@cloud`, `@security`, `@designer`, `@data`, `@devops`, `@tester`) funcionam independentemente de qualquer pack. Eles nao requerem `ARCHITECTURE.md` ou arquivos especificos de pack.

Os agentes especificos de pack (`@builder`, `@reviewer`, `@doctor`, `@migrator`) requerem um framework pack porque dependem do `ARCHITECTURE.md` para padroes de geracao de codigo.

### Funciona com projetos existentes?

Sim. Execute `npx specialist-agent init` na raiz do seu projeto e escolha seu framework pack. O instalador apenas adiciona arquivos markdown — nao modifica seu codigo-fonte, dependencias ou configuracao.

Use `@explorer` para avaliar um codebase existente antes de fazer mudancas:

```bash
"Use @explorer to assess this project's architecture and health"
```

### Como funciona com monorepos?

Cada workspace pode ter seu proprio `ARCHITECTURE.md` e `CLAUDE.md`. Quando voce abre o Claude Code em um diretorio de workspace especifico, os agentes leem a configuracao daquele workspace.

Para padroes compartilhados entre workspaces, mantenha um `ARCHITECTURE.md` na raiz com regras comuns, e arquivos no nivel do workspace para sobrescritas.

### Funciona offline?

Nao. O Specialist Agent requer uma conexao ativa com a API do Claude. Os agentes e skills sao instrucoes em markdown que o Claude Code le e executa — a inteligencia vem do modelo Claude, nao de codigo local.

### Como atualizo o Specialist Agent?

Execute o instalador novamente:

```bash
npx specialist-agent init
```

Ele sobrescreve os arquivos de agentes e skills com as versoes mais recentes. Suas personalizacoes no `ARCHITECTURE.md` sao preservadas pois ficam em um arquivo separado.

## Agentes

### Qual a diferenca entre agentes Full e Lite?

| Aspecto | Agentes Full | Agentes Lite |
|---------|-------------|-------------|
| Modelo | Sonnet/Opus | Haiku |
| Custo | Maior por token | ~50% mais barato |
| Qualidade | Melhor para tarefas complexas | Bom para tarefas simples |
| Velocidade | Mais lento | Mais rapido |
| Ideal para | Novos modulos, revisao de PRs, migracoes | Prototipagem, scaffolds simples, iteracao |

Use agentes Lite quando velocidade importa mais que polimento. Use agentes Full quando precisao e critica (revisao de PRs, migracoes, investigacao de bugs).

### Posso criar meus proprios agentes?

Sim. Veja [Criando Agentes](/pt-BR/customization/creating-agents) para um guia passo a passo. Agentes customizados seguem o mesmo blueprint de 5 partes:

1. **Mission** — O que o agente faz
2. **Workflow** — Processo passo a passo
3. **Output** — Formato estruturado do resultado
4. **Rules** — Restricoes rigidas
5. **Handoff Protocol** — Quando sugerir outros agentes

### Como os agentes conhecem as convencoes do meu projeto?

Todos os agentes leem `docs/ARCHITECTURE.md` antes de agir. Este arquivo define suas convencoes de nomenclatura, estrutura de diretorios, regras de camada e padroes de codigo. Quando voce o edita, o comportamento de todos os agentes muda imediatamente.

### Posso usar agentes de packs diferentes?

Cada projeto deve usar um framework pack. Os agentes especificos de pack (`@builder`, `@reviewer`, `@doctor`, `@migrator`) sao adaptados para padroes de um framework especifico. Usar agentes React em um projeto Vue geraria codigo incorreto.

Os agentes framework-agnostic funcionam com qualquer pack.

## Custos

### Quanto custa usar?

Os custos dependem do modelo Claude e do numero de tokens consumidos. Veja [Uso de Tokens](/pt-BR/reference/tokens) para estimativas detalhadas por operacao, incluindo cenarios do mundo real.

**Referencia rapida:**
- Scaffold de componente unico: ~3-5k tokens
- Modulo completo com testes: ~40-60k tokens
- Migracao de modulo: ~50-120k tokens

### Como posso reduzir custos?

1. Use **agentes Lite** para iteracao rapida
2. Use **skills** em vez de agentes para tarefas focadas (mais barato)
3. Migre **incrementalmente** (um componente por vez)
4. Rode verificacoes automatizadas antes de revisoes completas

Veja [Dicas para Reduzir Uso de Tokens](/pt-BR/reference/tokens#dicas-para-reduzir-uso-de-tokens) para mais estrategias.

## Solucao de Problemas

### Agentes nao estao seguindo meu ARCHITECTURE.md

1. Verifique se o arquivo esta em `docs/ARCHITECTURE.md` (nao na raiz do projeto)
2. Confira erros de sintaxe no markdown
3. Rode `/review-check-architecture` para validar
4. Garanta que suas regras sao explicitas — agentes seguem o que esta escrito literalmente

### Skills retornam "command not found"

Skills nao sao comandos de terminal. Sao instrucoes para o Claude Code. Use-as dentro da interface de chat do Claude Code:

```bash
# Correto — dentro do Claude Code
/dev-create-component ProductCard

# Errado — em um terminal
npx specialist-agent /dev-create-component ProductCard
```

### Codigo gerado nao corresponde a minha stack

Seu `ARCHITECTURE.md` pode nao refletir sua stack real. Correcoes comuns:

1. Atualize a secao de API client se voce usa Axios em vez de fetch
2. Atualize a secao de state management se voce usa outra biblioteca de store
3. Atualize a estrutura de diretorios se seu projeto usa um layout nao padrao

Veja [Editando Padroes](/pt-BR/customization/editing-patterns) para exemplos de personalizacoes comuns.
