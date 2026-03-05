# Padroes de Componentes

Componentes sao a camada de UI. Eles compoem outros componentes, consomem dados da camada logica e lidam com interacoes do usuario. Estes padroes se aplicam a todos os frameworks.

## Principios Universais

- **Props entrada, eventos saida** — componentes recebem dados via props e comunicam via eventos/callbacks
- **Composicao sobre heranca** — construa UIs complexas compondo componentes pequenos
- **Componentes pequenos** — mantenha abaixo de 200 linhas; decomponha quando maior
- **Trate todos os estados** — loading, error e empty devem ser cobertos
- **Sem logica de negocio pesada** — delegue para a camada logica (hooks, composables, services)

## Evite Prop Drilling

Quando dados precisam passar por multiplos niveis de componentes, evite passar props por intermediarios.

Cada framework tem sua propria solucao:

| Framework | Composicao | Contexto compartilhado |
|-----------|------------|------------------------|
| Vue | Slots | provide / inject |
| React | Children / render props | Context API |
| Next.js | Children / render props | Context API |
| SvelteKit | Slots / snippets | Context (getContext / setContext) |
| Angular | Content projection | Dependency injection |
| Nuxt | Slots | provide / inject |

**O principio e o mesmo em todos os frameworks:**

1. **Composicao** — deixe componentes pai injetar conteudo nos slots de layout dos filhos
2. **Contexto** — compartilhe estado atraves de um provider com escopo em vez de passar props

## Hierarquia de Componentes

```text
Views (Paginas)       → Composicao, orquestracao, fornecer contexto
  └── Layout          → Estrutura visual (slots / children)
      └── Features    → Logica de funcionalidade (hooks, composables, stores)
          └── Shared  → Apresentacao pura (props entrada, eventos saida)
```

| Tipo | Responsabilidade | Pode ter logica? | Pode ter estado? |
|------|-----------------|------------------|------------------|
| **Views** | Compor componentes, fornecer contexto | Via camada logica | Sim (camada logica) |
| **Componentes de Feature** | UI + logica de funcionalidade | Via camada logica | Sim (camada logica) |
| **Componentes Compartilhados** | UI generica e reutilizavel | Minima (apenas UI) | Minimo (local) |

## Limites de Tamanho

- Total do componente: **< 200 linhas**
- Template / JSX: **< 100 linhas**
- Se maior → decomponha em sub-componentes

## Checklist

- [ ] TypeScript com tipos estritos
- [ ] Props tipadas
- [ ] Eventos / outputs tipados
- [ ] Sem prop drilling (use composicao ou contexto)
- [ ] Estados de loading / error / vazio tratados
- [ ] Sem logica de negocio no template / JSX
- [ ] Sem injecao de HTML bruto sem sanitizacao
