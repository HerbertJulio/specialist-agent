import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Specialist Agent',
  description: 'Your AI development team - 26+ specialized agents',
  base: (process.env.VITEPRESS_BASE || '/specialist-agent/') as `/${string}/`,
  sitemap: {
    hostname: 'https://herbertjulio.github.io/specialist-agent',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/specialist-agent/logo.svg' }],
    ['meta', { property: 'og:title', content: 'Specialist Agent' }],
    ['meta', { property: 'og:description', content: 'Your AI development team - 26+ specialized agents' }],
    ['meta', { property: 'og:image', content: 'https://herbertjulio.github.io/specialist-agent/social-preview.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Specialist Agent' }],
    ['meta', { name: 'twitter:description', content: 'Your AI development team - 26+ specialized agents' }],
    ['meta', { name: 'twitter:image', content: 'https://herbertjulio.github.io/specialist-agent/social-preview.svg' }],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    'pt-BR': {
      label: 'Português',
      lang: 'pt-BR',
      description: 'Seu time de desenvolvimento AI - 25+ agentes especializados',
      themeConfig: {
        nav: [
          { text: 'Guia', link: '/pt-BR/guide/introduction' },
          { text: 'Cenários', link: '/pt-BR/scenarios/' },
          { text: 'Referência', link: '/pt-BR/reference/agents' },
        ],

        sidebar: {
          '/pt-BR/guide/': [
            {
              text: 'Começando',
              items: [
                { text: 'Introdução', link: '/pt-BR/guide/introduction' },
                { text: 'Instalação', link: '/pt-BR/guide/installation' },
                { text: 'Início Rápido', link: '/pt-BR/guide/quick-start' },
              ],
            },
            {
              text: 'Guias por Plataforma',
              items: [
                { text: 'Cursor', link: '/pt-BR/guide/install-cursor' },
                { text: 'VS Code', link: '/pt-BR/guide/install-vscode' },
                { text: 'Windsurf', link: '/pt-BR/guide/install-windsurf' },
                { text: 'Codex', link: '/pt-BR/guide/install-codex' },
                { text: 'OpenCode', link: '/pt-BR/guide/install-opencode' },
              ],
            },
            {
              text: 'Saiba Mais',
              items: [
                { text: 'Performance e Custo', link: '/pt-BR/guide/benchmark' },
                { text: 'Composição de Agentes', link: '/pt-BR/guide/agent-composition' },
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
          message: 'Publicado sob a Licença MIT.',
          copyright: 'Copyright © 2025-presente',
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
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Platform Guides',
          items: [
            { text: 'Cursor', link: '/guide/install-cursor' },
            { text: 'VS Code', link: '/guide/install-vscode' },
            { text: 'Windsurf', link: '/guide/install-windsurf' },
            { text: 'Codex', link: '/guide/install-codex' },
            { text: 'OpenCode', link: '/guide/install-opencode' },
          ],
        },
        {
          text: 'Learn More',
          items: [
            { text: 'Performance & Cost', link: '/guide/benchmark' },
            { text: 'Agent Composition', link: '/guide/agent-composition' },
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
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present',
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
