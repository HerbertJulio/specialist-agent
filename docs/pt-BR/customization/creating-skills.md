# Criando Skills

Skills sao atalhos que os usuarios invocam com `/nome-da-skill` dentro do Claude Code. Cada skill e um diretorio contendo um arquivo `SKILL.md` com frontmatter YAML.

## Estrutura do Arquivo de Skill

Crie um diretorio em `.claude/skills/minha-skill/SKILL.md`:

```markdown
---
name: my-skill
description: "What this skill does and when to use it"
user-invocable: true
argument-hint: "[arguments]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Instructions for what to do.

Target: $ARGUMENTS

## Steps
1. First step
2. Second step
3. ...

## Rules
- Rule one
- Rule two
```

O placeholder `$ARGUMENTS` e substituido pelo que o usuario digitar apos o nome da skill.

## Campos do Frontmatter

| Campo | Obrigatorio | Descricao |
|-------|-------------|-----------|
| `name` | Nao | Nome de exibicao (padrao: nome do diretorio) |
| `description` | Sim | Quando o Claude deve usar esta skill |
| `user-invocable` | Nao | Exibir no menu `/` (padrao: true) |
| `argument-hint` | Nao | Dica exibida no autocomplete (ex: `[module-name]`) |
| `allowed-tools` | Nao | Ferramentas disponiveis sem pedir permissao |
| `model` | Nao | Override de modelo (`haiku` para menor custo) |
| `disable-model-invocation` | Nao | Impedir que o Claude carregue automaticamente (padrao: false) |

## Exemplos

### Skill de Scaffold

```markdown
---
name: create-util
description: "Create a utility or helper function following project conventions"
user-invocable: true
argument-hint: "[util-name]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

Create a new utility function following project conventions.

Target: $ARGUMENTS

## Steps
1. Read `docs/ARCHITECTURE.md` section 6 (Utils vs Helpers)
2. Determine if this is a util (pure function) or helper (side effects)
3. Create the file in the appropriate directory:
   - Utils: `src/shared/utils/[name].ts`
   - Helpers: `src/shared/helpers/[name]-helper.ts`
4. Add proper TypeScript types
5. Create test file in `src/shared/__tests__/`
6. Run `tsc --noEmit` to validate

## Rules
- Utils must be pure functions (no side effects)
- Helpers can have side effects (DOM, localStorage, etc.)
- Export individual functions, not default exports
- Include JSDoc for public functions
```

### Skill de Validacao

```markdown
---
name: pr-ready
description: "Check if the current branch is ready for a pull request"
user-invocable: true
allowed-tools: Read, Bash, Glob, Grep
---

Check if the current branch is ready for a pull request.

## Steps
1. Run `tsc --noEmit` - check for type errors
2. Run `eslint .` - check for lint issues
3. Run `vitest run` - run all tests
4. Run `npm run build` - verify build succeeds
5. Search for `console.log` and `debugger` statements
6. Check for files > 200 lines in changed files
7. Produce a summary report

## Output Format
### PR Readiness Report
- ✅ Types: OK / ❌ Types: N errors
- ✅ Lint: OK / ❌ Lint: N warnings
- ✅ Tests: OK / ❌ Tests: N failures
- ✅ Build: OK / ❌ Build: Failed
- ✅ Clean: OK / ❌ Debug artifacts found
```

### Skill de Documentacao

```markdown
---
name: generate-docs
description: "Generate API documentation for a module"
user-invocable: true
argument-hint: "[module-name]"
allowed-tools: Read, Glob, Grep
---

Generate API documentation for a module.

Module: $ARGUMENTS

## Steps
1. Find the module at `src/modules/$ARGUMENTS/`
2. Read all files in the module
3. Document:
   - Public API (from index.ts)
   - Available composables and their return types
   - Service endpoints
   - Contract types
4. Output as markdown

## Rules
- Only document the public API
- Include usage examples for composables
- List all query keys for cache management
```

## Organizacao

Cada skill e um diretorio com um arquivo `SKILL.md`:

```
.claude/skills/
├── dev-create-module/        ← /dev-create-module
│   └── SKILL.md
├── review-review/            ← /review-review
│   └── SKILL.md
├── migration-migrate-module/ ← /migration-migrate-module
│   └── SKILL.md
└── docs-onboard/             ← /docs-onboard
    └── SKILL.md
```

## Como Skills se Tornam Slash Commands

O nome do diretorio determina o nome da skill:

```
.claude/skills/dev-create-module/SKILL.md    → /dev-create-module
.claude/skills/review-check-arch/SKILL.md    → /review-check-arch
.claude/skills/docs-onboard/SKILL.md         → /docs-onboard
```

## Dicas

- Mantenha as skills **focadas** - uma acao por skill
- Use `$ARGUMENTS` para entrada do usuario
- Referencie `ARCHITECTURE.md` para consistencia
- Use `allowed-tools` para restringir permissoes (ex: skills somente leitura)
- Use `disable-model-invocation: true` para skills apenas manuais
- Para fluxos de trabalho complexos com multiplas etapas, considere criar um agente em vez disso
