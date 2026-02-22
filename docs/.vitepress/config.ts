import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Specialist Agent',
  description: 'AI agents for Claude Code — any framework, any stack',
  base: '/specialist-agent/',
  sitemap: {
    hostname: 'https://herbertjulio.github.io/specialist-agent',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/specialist-agent/logo.svg' }],
    ['meta', { property: 'og:title', content: 'Specialist Agent' }],
    ['meta', { property: 'og:description', content: 'AI agents for Claude Code — any framework, any stack' }],
    ['meta', { property: 'og:image', content: 'https://herbertjulio.github.io/specialist-agent/social-preview.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Specialist Agent' }],
    ['meta', { name: 'twitter:description', content: 'AI agents for Claude Code — any framework, any stack' }],
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
      description: 'Agentes de IA para Claude Code — qualquer framework, qualquer stack',
      themeConfig: {
        nav: [
          { text: 'Guia', link: '/pt-BR/guide/introduction' },
          {
            text: 'Tutoriais',
            items: [
              { text: 'Dia a Dia', link: '/pt-BR/tutorials/crud-module' },
              { text: 'Migração', link: '/pt-BR/tutorials/migrate-project' },
            ],
          },
          { text: 'Referência', link: '/pt-BR/reference/agents' },
          { text: 'Personalização', link: '/pt-BR/customization/creating-agents' },
        ],

        sidebar: {
          '/pt-BR/guide/': [
            {
              text: 'Primeiros Passos',
              items: [
                { text: 'Introdução', link: '/pt-BR/guide/introduction' },
                { text: 'Instalação', link: '/pt-BR/guide/installation' },
                { text: 'Início Rápido', link: '/pt-BR/guide/quick-start' },
              ],
            },
            {
              text: 'Arquitetura',
              items: [
                { text: 'Visão Geral', link: '/pt-BR/guide/architecture' },
                { text: 'Camadas', link: '/pt-BR/guide/layers' },
                { text: 'Componentes', link: '/pt-BR/guide/components' },
              ],
            },
          ],
          '/pt-BR/tutorials/': [
            {
              text: 'Desenvolvimento Dia a Dia',
              collapsed: false,
              items: [
                { text: 'Módulo CRUD', link: '/pt-BR/tutorials/crud-module' },
                { text: 'Camada de Serviço', link: '/pt-BR/tutorials/service-layer' },
                { text: 'Formulários com Validação', link: '/pt-BR/tutorials/forms' },
                { text: 'Paginação + Filtros', link: '/pt-BR/tutorials/pagination-filters' },
              ],
            },
            {
              text: 'Migração de Arquitetura',
              collapsed: false,
              items: [
                { text: 'Migrar seu Projeto', link: '/pt-BR/tutorials/migrate-project' },
              ],
            },
          ],
          '/pt-BR/reference/': [
            {
              text: 'Referência',
              items: [
                { text: 'Agentes', link: '/pt-BR/reference/agents' },
                { text: 'Skills', link: '/pt-BR/reference/skills' },
                { text: 'Uso de Tokens', link: '/pt-BR/reference/tokens' },
              ],
            },
          ],
          '/pt-BR/customization/': [
            {
              text: 'Personalização',
              items: [
                { text: 'Criando Agentes', link: '/pt-BR/customization/creating-agents' },
                { text: 'Criando Skills', link: '/pt-BR/customization/creating-skills' },
                { text: 'Editando Padrões', link: '/pt-BR/customization/editing-patterns' },
              ],
            },
          ],
        },

        editLink: {
          pattern: 'https://github.com/HerbertJulio/specialist-agent/edit/main/docs/:path',
          text: 'Editar esta página no GitHub',
        },

        footer: {
          message: 'Distribuído sob a licença MIT.',
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
      {
        text: 'Tutorials',
        items: [
          { text: 'Day-to-Day', link: '/tutorials/crud-module' },
          { text: 'Migration', link: '/tutorials/migrate-project' },
        ],
      },
      { text: 'Reference', link: '/reference/agents' },
      { text: 'Customization', link: '/customization/creating-agents' },
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
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/guide/architecture' },
            { text: 'Layers', link: '/guide/layers' },
            { text: 'Components', link: '/guide/components' },
          ],
        },
      ],
      '/tutorials/': [
        {
          text: 'Day-to-Day Development',
          collapsed: false,
          items: [
            { text: 'Build a CRUD Module', link: '/tutorials/crud-module' },
            { text: 'Create a Service Layer', link: '/tutorials/service-layer' },
            { text: 'Build Forms with Validation', link: '/tutorials/forms' },
            { text: 'Pagination + Filters', link: '/tutorials/pagination-filters' },
          ],
        },
        {
          text: 'Architecture Migration',
          collapsed: false,
          items: [
            { text: 'Migrate Your Project', link: '/tutorials/migrate-project' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Agents', link: '/reference/agents' },
            { text: 'Skills', link: '/reference/skills' },
            { text: 'Token Usage', link: '/reference/tokens' },
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
      options: {
        locales: {
          'pt-BR': {
            translations: {
              button: {
                buttonText: 'Buscar',
                buttonAriaLabel: 'Buscar',
              },
              modal: {
                displayDetails: 'Exibir lista detalhada',
                resetButtonTitle: 'Limpar busca',
                backButtonTitle: 'Fechar busca',
                noResultsText: 'Nenhum resultado encontrado',
                footer: {
                  selectText: 'Selecionar',
                  navigateText: 'Navegar',
                  closeText: 'Fechar',
                },
              },
            },
          },
        },
      },
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
    },
  },
}))
