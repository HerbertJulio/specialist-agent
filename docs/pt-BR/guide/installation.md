# Instalacao

## Pre-requisitos

- Um projeto com `package.json`
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) instalado

## Instalar

```bash
# 1. Va ate seu projeto
cd /path/to/your-project

# 2. Execute o assistente
npx specialist-agent init
```

O assistente ira:

1. **Framework** — Detecta automaticamente pelo `package.json` (Vue 3, React, Next.js, SvelteKit) ou pergunta
2. **Modo** — Full (Sonnet/Opus) ou Lite (Haiku)
3. **Agente starter** — Instalar @starter para criacao de projetos?
4. **Agentes especialistas** — Instalar @finance, @cloud, @security, @designer, @data, @devops, @tester, @explorer?
5. **Instalacao global** — Instalar agentes genericos em `~/.claude/agents` (disponiveis em todos os projetos)?

## O Que e Instalado

```mermaid
graph TB
    setup["npx specialist-agent init"] --> wizard{"Setup Wizard"}

    wizard -->|"1. Framework"| pack["Auto-detect ou selecionar"]
    wizard -->|"2. Mode"| mode["Full · Lite"]
    wizard -->|"3. Starter?"| starter["Yes · No"]
    wizard -->|"4. Especialistas?"| specialists["Yes · No"]
    wizard -->|"5. Global?"| global["~/.claude/agents"]

    subgraph installed["  O Que e Instalado  "]
        direction LR

        subgraph ag[" Agentes "]
            direction TB
            a1["@starter"]
            a2["@builder"]
            a3["@reviewer"]
            a4["@migrator"]
            a5["@doctor"]
            a6["@finance, @cloud, ..."]
        end

        subgraph sk[" Skills "]
            direction TB
            s1["6 skills de dev"]
            s2["3 skills de review"]
            s3["2 skills de migracao"]
            s4["1 skill de docs"]
        end

        subgraph dc[" Docs "]
            direction TB
            d1["ARCHITECTURE.md"]
            d2["CLAUDE.md"]
        end
    end

    pack --> installed
    mode --> installed
    starter --> installed
    specialists --> installed
    global --> installed

    style setup fill:#42b883,color:#fff,font-weight:bold
    style wizard fill:#35495e,color:#fff
    style installed fill:#f8f8f8,stroke:#42b883,stroke-width:2px
    style ag fill:#f0faf5,stroke:#42b883
    style sk fill:#f0faf5,stroke:#42b883
    style dc fill:#f0faf5,stroke:#42b883
    style a1 fill:#7c3aed,color:#fff
    style a2 fill:#42b883,color:#fff
    style a3 fill:#42b883,color:#fff
    style a4 fill:#35495e,color:#fff
    style a5 fill:#42b883,color:#fff
    style a6 fill:#35495e,color:#fff
```

O instalador copia estes arquivos para o seu projeto:

```text
your-project/
├── .claude/
│   ├── agents/              ← Agentes do pack + especialistas opcionais
│   │   ├── starter.md
│   │   ├── builder.md
│   │   ├── reviewer.md
│   │   ├── migrator.md
│   │   ├── doctor.md
│   │   ├── finance.md       ← especialista (se selecionado)
│   │   ├── cloud.md
│   │   └── ...
│   └── skills/              ← 12 skills
│       ├── dev-create-module/
│       ├── review-review/
│       ├── migration-migrate-module/
│       └── docs-onboard/
├── docs/
│   └── ARCHITECTURE.md      ← Fonte de verdade para padroes
└── CLAUDE.md                 ← Configuracao do projeto para o Claude
```

::: warning Nao-destrutivo
O instalador **nunca sobrescreve** arquivos `ARCHITECTURE.md` ou `CLAUDE.md` existentes. Se eles ja existirem, serao ignorados.
:::

## Modo Lite (Custo Menor)

Para uso com orcamento reduzido, instale agentes Lite que rodam no **modelo Haiku**:

```bash
npx specialist-agent init    # selecione "Lite" no assistente
```

| Aspecto | Full | Lite |
|---------|------|------|
| **Modelo** | Sonnet/Opus | Haiku |
| **Custo** | ~5-25k tokens | ~2-10k tokens |
| **Validacao** | tsc + build + vitest | Ignorada |
| **Primeira acao** | Le ARCHITECTURE.md | Regras inline |

Mesmos nomes de agentes, mesmas capacidades — apenas mais barato por invocacao.

## Verificar Instalacao

```bash
# Abra o Claude Code
claude

# Verifique se os agentes foram carregados
/agents

# Teste uma skill rapida
/review-check-architecture
```

Voce devera ver seus agentes instalados (ex: `@starter`, `@builder`, `@reviewer`, `@migrator`, `@doctor`, alem dos agentes especialistas se instalados).

## Opcional: Context7 MCP

Para documentacao atualizada de bibliotecas ao perguntar ao Claude sobre APIs, voce pode adicionar o [servidor MCP Context7](https://github.com/upstash/context7). Isso beneficia voce como desenvolvedor — os agentes funcionam completamente sem ele:

```json
// ~/.claude/mcp.json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

## Proximos Passos

- [Inicio Rapido](/pt-BR/guide/quick-start) — Construa algo com os agentes
- [Visao Geral da Arquitetura](/pt-BR/guide/architecture) — Entenda os padroes
- [Personalizacao](/pt-BR/customization/creating-agents) — Adapte o kit ao seu projeto
