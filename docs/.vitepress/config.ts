import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Specialist Agent',
  description: 'Your AI development team - 25+ specialized agents',
  base: '/specialist-agent/',
  sitemap: {
    hostname: 'https://herbertjulio.github.io/specialist-agent',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/specialist-agent/logo.svg' }],
    ['meta', { property: 'og:title', content: 'Specialist Agent' }],
    ['meta', { property: 'og:description', content: 'Your AI development team - 25+ specialized agents' }],
    ['meta', { property: 'og:image', content: 'https://herbertjulio.github.io/specialist-agent/social-preview.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Specialist Agent' }],
    ['meta', { name: 'twitter:description', content: 'Your AI development team - 25+ specialized agents' }],
    ['meta', { name: 'twitter:image', content: 'https://herbertjulio.github.io/specialist-agent/social-preview.svg' }],
  ],

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
