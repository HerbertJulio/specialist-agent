import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const GA_ID = process.env.VITEPRESS_GA_ID || ''

const gaHead: Array<[string, Record<string, string>] | [string, Record<string, string>, string]> = GA_ID
  ? [
      ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}` }],
      ['script', {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}')`],
    ]
  : []

export default withMermaid(defineConfig({
  title: 'Specialist Agent',
  description: 'Your AI development team - 27+ specialized agents',
  base: (process.env.VITEPRESS_BASE || '/') as `/${string}/`,
  sitemap: {
    hostname: 'https://specialistagent.com.br',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],

    // Open Graph - Facebook, LinkedIn, WhatsApp
    ['meta', { property: 'og:title', content: 'Specialist Agent - Your AI Development Team' }],
    ['meta', { property: 'og:description', content: '27+ specialized AI agents and 21 skills that build, review, debug, and ship production code. Works with Claude Code, Cursor, VS Code, Windsurf, Codex, and OpenCode across 7 framework packs.' }],
    ['meta', { property: 'og:image', content: 'https://specialistagent.com.br/social-preview.svg' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:type', content: 'image/svg+xml' }],
    ['meta', { property: 'og:image:alt', content: 'Specialist Agent - AI agents for any framework, any stack' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://specialistagent.com.br' }],
    ['meta', { property: 'og:site_name', content: 'Specialist Agent' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:locale:alternate', content: 'pt_BR' }],

    // Twitter / X
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Specialist Agent - Your AI Development Team' }],
    ['meta', { name: 'twitter:description', content: '27+ AI agents and 21 skills that build, review, debug, and ship production code. Any framework, any stack.' }],
    ['meta', { name: 'twitter:image', content: 'https://specialistagent.com.br/social-preview-twitter.svg' }],
    ['meta', { name: 'twitter:image:alt', content: 'Specialist Agent - AI agents for any framework, any stack' }],

    // SEO
    ['meta', { name: 'description', content: '27+ specialized AI agents and 21 skills that build, review, debug, and ship production code. Works with Claude Code, Cursor, VS Code, Windsurf, Codex, and OpenCode. Supports Vue, React, Next.js, SvelteKit, Angular, Astro, and Nuxt.' }],
    ['meta', { name: 'keywords', content: 'ai agents, claude code, specialist agent, code review, debugging, development tools, ai coding assistant, cursor ai, vscode ai, windsurf, codex, opencode, vue, react, nextjs, sveltekit, angular, astro, nuxt, tdd, pair programming, code generation' }],
    ['meta', { name: 'author', content: 'Herbert Julio' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['link', { rel: 'canonical', href: 'https://specialistagent.com.br' }],
    ...gaHead,
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    'pt-BR': {
      label: 'Português',
      lang: 'pt-BR',
      description: 'Seu time de desenvolvimento AI - 27+ agentes especializados',
      themeConfig: {
        nav: [
          { text: 'Guia', link: '/pt-BR/guide/introduction' },
          { text: 'Cenários', link: '/pt-BR/scenarios/' },
          { text: 'Referência', link: '/pt-BR/reference/agents' },
          {
            text: 'Ecossistema',
            items: [
              {
                text: 'Plataformas',
                items: [
                  { text: 'Claude Code', link: '/pt-BR/guide/installation' },
                  { text: 'Cursor', link: '/pt-BR/guide/install-cursor' },
                  { text: 'VS Code', link: '/pt-BR/guide/install-vscode' },
                  { text: 'Windsurf', link: '/pt-BR/guide/install-windsurf' },
                  { text: 'Codex', link: '/pt-BR/guide/install-codex' },
                  { text: 'OpenCode', link: '/pt-BR/guide/install-opencode' },
                ],
              },
              {
                text: 'Integrações',
                items: [
                  { text: 'Servidores MCP', link: '/pt-BR/guide/mcp-integrations' },
                  { text: 'Framework Packs', link: '/pt-BR/guide/architecture' },
                ],
              },
              {
                text: 'Comunidade',
                items: [
                  { text: 'GitHub', link: 'https://github.com/HerbertJulio/specialist-agent' },
                  { text: 'npm', link: 'https://www.npmjs.com/package/specialist-agent' },
                  { text: 'Sponsor', link: 'https://github.com/sponsors/HerbertJulio' },
                ],
              },
            ],
          },
        ],

        sidebar: {
          '/pt-BR/guide/': [
            {
              text: 'Começando',
              items: [
                { text: 'Por que Specialist Agent', link: '/pt-BR/guide/why' },
                { text: 'Introdução', link: '/pt-BR/guide/introduction' },
                { text: 'Instalação', link: '/pt-BR/guide/installation' },
                { text: 'Início Rápido', link: '/pt-BR/guide/quick-start' },
              ],
            },
            {
              text: 'Conceitos',
              items: [
                { text: 'Arquitetura', link: '/pt-BR/guide/architecture' },
                { text: 'Camadas', link: '/pt-BR/guide/layers' },
                { text: 'Componentes', link: '/pt-BR/guide/components' },
                { text: 'Composição de Agentes', link: '/pt-BR/guide/agent-composition' },
              ],
            },
            {
              text: 'Guias por Plataforma',
              collapsed: true,
              items: [
                { text: 'Cursor', link: '/pt-BR/guide/install-cursor' },
                { text: 'VS Code', link: '/pt-BR/guide/install-vscode' },
                { text: 'Windsurf', link: '/pt-BR/guide/install-windsurf' },
                { text: 'Codex', link: '/pt-BR/guide/install-codex' },
                { text: 'OpenCode', link: '/pt-BR/guide/install-opencode' },
              ],
            },
            {
              text: 'Avançado',
              items: [
                { text: 'Integrações MCP', link: '/pt-BR/guide/mcp-integrations' },
                { text: 'Performance e Custo', link: '/pt-BR/guide/benchmark' },
                { text: 'FAQ', link: '/pt-BR/guide/faq' },
              ],
            },
          ],
          '/pt-BR/scenarios/': [
            {
              text: 'Cenários Reais',
              items: [
                { text: 'Visão Geral', link: '/pt-BR/scenarios/' },
              ],
            },
            {
              text: 'Construindo',
              items: [
                { text: 'Construir Features', link: '/pt-BR/scenarios/build-feature' },
                { text: 'Design de API', link: '/pt-BR/scenarios/api-design' },
              ],
            },
            {
              text: 'Qualidade',
              items: [
                { text: 'Revisão de Código', link: '/pt-BR/scenarios/code-review' },
                { text: 'Debugar Problemas', link: '/pt-BR/scenarios/debug-issue' },
                { text: 'Performance', link: '/pt-BR/scenarios/performance' },
              ],
            },
            {
              text: 'Workflow',
              items: [
                { text: 'Planejamento', link: '/pt-BR/scenarios/planning' },
                { text: 'Migração', link: '/pt-BR/scenarios/migration' },
              ],
            },
            {
              text: 'Especializado',
              items: [
                { text: 'Segurança', link: '/pt-BR/scenarios/security' },
                { text: 'Pagamentos', link: '/pt-BR/scenarios/payments' },
                { text: 'Infraestrutura', link: '/pt-BR/scenarios/infrastructure' },
              ],
            },
          ],
          '/pt-BR/reference/': [
            {
              text: 'Referência',
              items: [
                { text: 'Agentes', link: '/pt-BR/reference/agents' },
                { text: 'Skills', link: '/pt-BR/reference/skills' },
                { text: 'Hooks', link: '/pt-BR/reference/hooks' },
                { text: 'Tokens', link: '/pt-BR/reference/tokens' },
              ],
            },
          ],
          '/pt-BR/tutorials/': [
            {
              text: 'Tutoriais',
              items: [
                { text: 'Módulo CRUD', link: '/pt-BR/tutorials/crud-module' },
                { text: 'Camada de Serviço', link: '/pt-BR/tutorials/service-layer' },
                { text: 'Formulários', link: '/pt-BR/tutorials/forms' },
                { text: 'Paginação', link: '/pt-BR/tutorials/pagination-filters' },
                { text: 'Migração', link: '/pt-BR/tutorials/migrate-project' },
              ],
            },
          ],
          '/pt-BR/customization/': [
            {
              text: 'Personalização',
              items: [
                { text: 'Criar Agentes', link: '/pt-BR/customization/creating-agents' },
                { text: 'Criar Skills', link: '/pt-BR/customization/creating-skills' },
                { text: 'Editar Padrões', link: '/pt-BR/customization/editing-patterns' },
              ],
            },
          ],
        },

        editLink: {
          pattern: 'https://github.com/HerbertJulio/specialist-agent/edit/main/docs/:path',
          text: 'Editar esta página no GitHub',
        },

        footer: {
          message: 'Publicado sob a <a href="https://github.com/HerbertJulio/specialist-agent/blob/main/LICENSE" target="_blank">Licença MIT</a>.',
          copyright: 'Copyright © 2025-presente <a href="https://github.com/HerbertJulio" target="_blank">Herbert Julio</a>',
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Specialist Agent',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Scenarios', link: '/scenarios/' },
      { text: 'Reference', link: '/reference/agents' },
      {
        text: 'Ecosystem',
        items: [
          {
            text: 'Platforms',
            items: [
              { text: 'Claude Code', link: '/guide/installation' },
              { text: 'Cursor', link: '/guide/install-cursor' },
              { text: 'VS Code', link: '/guide/install-vscode' },
              { text: 'Windsurf', link: '/guide/install-windsurf' },
              { text: 'Codex', link: '/guide/install-codex' },
              { text: 'OpenCode', link: '/guide/install-opencode' },
            ],
          },
          {
            text: 'Integrations',
            items: [
              { text: 'MCP Servers', link: '/guide/mcp-integrations' },
              { text: 'Framework Packs', link: '/guide/architecture' },
            ],
          },
          {
            text: 'Community',
            items: [
              { text: 'GitHub', link: 'https://github.com/HerbertJulio/specialist-agent' },
              { text: 'npm', link: 'https://www.npmjs.com/package/specialist-agent' },
              { text: 'Sponsor', link: 'https://github.com/sponsors/HerbertJulio' },
            ],
          },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Why Specialist Agent', link: '/guide/why' },
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Layers', link: '/guide/layers' },
            { text: 'Components', link: '/guide/components' },
            { text: 'Agent Composition', link: '/guide/agent-composition' },
          ],
        },
        {
          text: 'Platform Guides',
          collapsed: true,
          items: [
            { text: 'Cursor', link: '/guide/install-cursor' },
            { text: 'VS Code', link: '/guide/install-vscode' },
            { text: 'Windsurf', link: '/guide/install-windsurf' },
            { text: 'Codex', link: '/guide/install-codex' },
            { text: 'OpenCode', link: '/guide/install-opencode' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'MCP Integrations', link: '/guide/mcp-integrations' },
            { text: 'Performance & Cost', link: '/guide/benchmark' },
            { text: 'FAQ', link: '/guide/faq' },
          ],
        },
      ],
      '/scenarios/': [
        {
          text: 'Real-World Scenarios',
          items: [
            { text: 'Overview', link: '/scenarios/' },
          ],
        },
        {
          text: 'Building',
          items: [
            { text: 'Build Features', link: '/scenarios/build-feature' },
            { text: 'API Design', link: '/scenarios/api-design' },
          ],
        },
        {
          text: 'Quality',
          items: [
            { text: 'Code Review', link: '/scenarios/code-review' },
            { text: 'Debug Issues', link: '/scenarios/debug-issue' },
            { text: 'Performance', link: '/scenarios/performance' },
          ],
        },
        {
          text: 'Workflow',
          items: [
            { text: 'Planning', link: '/scenarios/planning' },
            { text: 'Migration', link: '/scenarios/migration' },
          ],
        },
        {
          text: 'Specialized',
          items: [
            { text: 'Security', link: '/scenarios/security' },
            { text: 'Payments', link: '/scenarios/payments' },
            { text: 'Infrastructure', link: '/scenarios/infrastructure' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Agents', link: '/reference/agents' },
            { text: 'Skills', link: '/reference/skills' },
            { text: 'Hooks', link: '/reference/hooks' },
            { text: 'Tokens', link: '/reference/tokens' },
          ],
        },
      ],
      '/customization/': [
        {
          text: 'Customization',
          items: [
            { text: 'Creating Agents', link: '/customization/creating-agents' },
            { text: 'Creating Skills', link: '/customization/creating-skills' },
            { text: 'Editing Patterns', link: '/customization/editing-patterns' },
          ],
        },
      ],
      '/tutorials/': [
        {
          text: 'Framework Tutorials',
          items: [
            { text: 'CRUD Module', link: '/tutorials/crud-module' },
            { text: 'Service Layer', link: '/tutorials/service-layer' },
            { text: 'Forms', link: '/tutorials/forms' },
            { text: 'Pagination', link: '/tutorials/pagination-filters' },
            { text: 'Migration', link: '/tutorials/migrate-project' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/HerbertJulio/specialist-agent' },
    ],

    editLink: {
      pattern: 'https://github.com/HerbertJulio/specialist-agent/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the <a href="https://github.com/HerbertJulio/specialist-agent/blob/main/LICENSE" target="_blank">MIT License</a>.',
      copyright: 'Copyright © 2025-present <a href="https://github.com/HerbertJulio" target="_blank">Herbert Julio</a>',
    },

    search: {
      provider: 'local',
    },
  },

  mermaid: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#2B5EA7',
      primaryTextColor: '#0A1628',
      primaryBorderColor: '#2B5EA7',
      lineColor: '#4A7FCF',
      secondaryColor: '#CD7F32',
      tertiaryColor: '#F5F0E8',
      fontSize: '14px',
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      wrappingWidth: 200,
    },
    sequence: {
      useMaxWidth: true,
    },
  },
}))
