# FAQ

Perguntas frequentes sobre o Specialist Agent.

## Geral

### Posso usar sem um framework pack?

Sim. Os 9 agentes framework-agnostic (`@starter`, `@explorer`, `@finance`, `@cloud`, `@security`, `@designer`, `@data`, `@devops`, `@tester`) funcionam independentemente de qualquer pack. Eles não precisam de `ARCHITECTURE.md` ou arquivos específicos de pack.

Os agentes de pack (`@builder`, `@reviewer`, `@doctor`, `@migrator`) precisam de um framework pack porque dependem do `ARCHITECTURE.md` para padrões de geração de código.

### Funciona com projetos existentes?

Sim. Execute `npx specialist-agent init` na raiz do projeto e escolha seu framework pack. O instalador apenas adiciona arquivos markdown - não modifica seu código-fonte, dependências ou configuração.

Use `@explorer` para avaliar um codebase existente antes de fazer mudanças:

```bash
"Use @explorer to assess this project's architecture and health"
```

### Como funciona com monorepos?

Cada workspace pode ter seu próprio `ARCHITECTURE.md` e `CLAUDE.md`. Quando você abre o Claude Code em um diretório de workspace específico, os agentes leem a configuração daquele workspace.

Para padrões compartilhados entre workspaces, mantenha um `ARCHITECTURE.md` na raiz com regras comuns, e arquivos no nível do workspace para overrides.

### Funciona offline?

Não. O Specialist Agent requer conexão ativa com a API do Claude. Os agentes e skills são instruções markdown que o Claude Code lê e executa - a inteligência vem do modelo Claude, não de código local.

### Como atualizo o Specialist Agent?

Execute o instalador novamente:

```bash
npx specialist-agent init
```

Ele sobrescreve os arquivos de agentes e skills com as versões mais recentes. Suas customizações do `ARCHITECTURE.md` são preservadas já que ficam em arquivo separado.

## Agentes

### Qual a diferença entre agentes Full e Lite?

| Aspecto | Agentes Full | Agentes Lite |
|---------|--------------|--------------|
| Modelo | Sonnet/Opus | Haiku |
| Custo | Maior por token | ~50% mais barato |
| Qualidade | Melhor para tarefas complexas | Bom para tarefas simples |
| Velocidade | Mais lento | Mais rápido |
| Melhor para | Novos módulos, PR reviews, migrações | Prototipagem, scaffolds simples, iteração |

Use agentes Lite quando velocidade importa mais que polimento. Use agentes Full quando precisão é crítica (PR reviews, migrações, investigação de bugs).

### Posso criar meus próprios agentes?

Sim. Veja [Criando Agentes](/pt-BR/customization/creating-agents) para um guia passo a passo. Agentes customizados seguem o mesmo blueprint de 5 partes:

1. **Mission** - O que o agente faz
2. **Workflow** - Processo passo a passo
3. **Output** - Formato estruturado de resultado
4. **Rules** - Restrições rígidas
5. **Handoff Protocol** - Quando sugerir outros agentes

### Como os agentes conhecem as convenções do meu projeto?

Todos os agentes leem `docs/ARCHITECTURE.md` antes de agir. Este arquivo define suas convenções de nomenclatura, estrutura de diretórios, regras de camadas e padrões de código. Quando você edita, o comportamento de todo agente muda imediatamente.

### Posso usar agentes de packs diferentes?

Cada projeto deve usar um framework pack. Os agentes de pack (`@builder`, `@reviewer`, `@doctor`, `@migrator`) são adaptados aos padrões de um framework específico. Usar agentes React em um projeto Vue geraria código incorreto.

Os agentes framework-agnostic funcionam com qualquer pack.

## Custos

### Quanto custa usar?

Os custos dependem do modelo Claude e do número de tokens consumidos. Veja [Uso de Tokens](/pt-BR/reference/tokens) para estimativas detalhadas por operação, incluindo cenários reais.

**Referência rápida:**
- Scaffold de componente único: ~3-5k tokens
- Módulo completo com testes: ~40-60k tokens
- Migração de módulo: ~50-120k tokens

### Como posso reduzir custos?

1. Use **agentes Lite** para iteração rápida
2. Use **skills** em vez de agentes para tarefas focadas (mais barato)
3. Migre **incrementalmente** (um componente por vez)
4. Execute verificações automatizadas antes de reviews completos

Veja [Dicas para Reduzir Uso de Tokens](/pt-BR/reference/tokens#dicas-para-reduzir-uso-de-tokens) para mais estratégias.

## Troubleshooting

### Agentes não estão seguindo meu ARCHITECTURE.md

1. Verifique se o arquivo está em `docs/ARCHITECTURE.md` (não na raiz do projeto)
2. Verifique erros de sintaxe no markdown
3. Execute `/review-check-architecture` para validar
4. Certifique-se que suas regras são explícitas - agentes seguem o que está escrito literalmente

### Skills retornam "command not found"

Skills não são comandos de shell. São instruções para o Claude Code. Use dentro da interface de chat do Claude Code:

```bash
# Correto - dentro do Claude Code
/dev-create-component ProductCard

# Errado - em um terminal
npx specialist-agent /dev-create-component ProductCard
```

### Código gerado não corresponde ao meu stack

Seu `ARCHITECTURE.md` pode não refletir seu stack real. Correções comuns:

1. Atualize a seção de API client se usa Axios em vez de fetch
2. Atualize a seção de state management se usa uma lib de store diferente
3. Atualize a estrutura de diretórios se seu projeto usa um layout não-padrão

Veja [Editando Padrões](/pt-BR/customization/editing-patterns) para exemplos de customizações comuns.
