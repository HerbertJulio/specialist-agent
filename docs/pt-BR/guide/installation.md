# Instalação

## Opção 1: Marketplace (Mais Fácil)

**Claude Code:**
```
/plugin install specialist-agent
```

**Cursor:**
```
Cmd+Shift+P → Install Plugin → specialist-agent
```

---

## Opção 2: CLI

```bash
cd your-project
npx specialist-agent init
```

Funciona em qualquer plataforma.

---

## O que Acontece

1. Detecta seu framework (React, Vue, Next.js, SvelteKit)
2. Pergunta modo Full ou Lite
3. Instala agents e skills em `.claude/`
4. Opcionalmente instala native hooks do Claude Code (security guard, auto-dispatch, session context, auto-format)

```text
your-project/
├── .claude/
│   ├── agents/           # Agentes de IA
│   ├── skills/           # Slash commands
│   └── settings.json     # Config dos native hooks
├── .specialist-agent/
│   └── hooks/native/     # Scripts de hook
├── docs/
│   └── ARCHITECTURE.md   # Suas convenções
└── CLAUDE.md             # Config do projeto
```

---

## Verificar

```
"Use @scout to analyze this project"
```

---

## Modos

| Modo | Modelo | Custo |
|------|--------|-------|
| Full | Sonnet/Opus | Padrão |
| Lite | Haiku | 60-80% menos |

---

## Comandos da CLI

```bash
npx specialist-agent init              # Instalar
npx specialist-agent list              # Listar instalados
npx specialist-agent create-agent @x   # Criar agent customizado
npx specialist-agent profiles set x    # Definir perfil de equipe
```

---

## Perfis de Equipe

| Perfil | Descrição |
|--------|-----------|
| `startup-fast` | Velocidade, Haiku |
| `enterprise-strict` | Validação completa |
| `learning-mode` | Explica tudo |
| `cost-optimized` | Minimizar tokens |

---

## Guias por Plataforma

Precisa de setup manual? Veja os guias específicos:

- [Cursor](/pt-BR/guide/install-cursor)
- [VS Code](/pt-BR/guide/install-vscode)
- [Windsurf](/pt-BR/guide/install-windsurf)
- [Codex](/pt-BR/guide/install-codex)
- [OpenCode](/pt-BR/guide/install-opencode)

---

## Próximo

- [Início Rápido](/pt-BR/guide/quick-start) - Construa sua primeira feature
- [Agentes](/pt-BR/reference/agents) - Todos os 27+ agentes
