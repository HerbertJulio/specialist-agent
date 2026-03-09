# Instalação

## Claude Code (Principal)

```sh
npx specialist-agent init
```

CLI interativa que:
- Detecta seu framework ou permite começar com um projeto vazio
- Instala 35 agentes (modo Full ou Lite)
- Configura 24 skills
- Configura hooks nativos (security guard, auto-dispatch, auto-format)

## Cursor

Copie o diretório `.cursor-plugin/` para seu projeto, ou instale pelo marketplace de plugins do Cursor.

## VS Code

Instale pelo marketplace de extensões do VS Code ou copie `.vscode/extension.json`.

## Windsurf

Copie o `.windsurf/plugin.json` para a raiz do seu projeto.

## Codex

Veja o [guia de instalação do Codex](/pt-BR/guide/install-codex).

## OpenCode

Veja o [guia de instalação do OpenCode](/pt-BR/guide/install-opencode).

## Instalação Global vs Projeto

| Escopo | Local | Caso de uso |
|--------|-------|-------------|
| Projeto | `.claude/agents/` | Agentes específicos por projeto |
| Global | `~/.claude/agents/` | Agentes compartilhados entre projetos |

## Packs de Framework

Cada pack inclui versões otimizadas do @builder, @reviewer, @doctor, @migrator:

| Pack | Framework |
|------|-----------|
| `vue` | Vue 3 + Composition API |
| `react` | React 18+ com hooks |
| `nextjs` | Next.js App Router / Pages |
| `svelte` | SvelteKit |
| `angular` | Angular 17+ |
| `astro` | Astro |
| `nuxt` | Nuxt 3 |

Projetos vazios recebem todos os agentes com padrões React. Re-execute `npx specialist-agent init` quando escolher um framework.

## Atualização

```sh
npx specialist-agent init --force
```
