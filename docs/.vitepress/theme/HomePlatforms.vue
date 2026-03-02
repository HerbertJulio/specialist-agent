<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isPtBR = computed(() => lang.value === 'pt-BR')

const platforms = [
  {
    name: 'Claude Code',
    link: '/guide/installation',
    // Claude starburst logo (official from Bootstrap Icons)
    svg: '<svg viewBox="0 0 16 16" fill="currentColor" width="32" height="32"><path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z"/></svg>',
    color: '#D4A574',
  },
  {
    name: 'Cursor',
    link: '/guide/install-cursor',
    // Cursor logo
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M3.192 2.54 21.077 11.1a.497.497 0 0 1 .007.878l-7.834 4.222a.5.5 0 0 0-.247.3l-1.862 6.876a.497.497 0 0 1-.93.075L3.07 3.39a.497.497 0 0 1 .122-.85z"/></svg>',
    color: '#000',
  },
  {
    name: 'VS Code',
    link: '/guide/install-vscode',
    // VS Code logo
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M23.15 2.587 18.21.21a1.166 1.166 0 0 0-1.33.231l-8.59 7.84-3.78-2.87a.78.78 0 0 0-.996.044l-1.04.96a.78.78 0 0 0-.002 1.135l3.29 3a .14.14 0 0 1 0 .208l-3.29 3a.78.78 0 0 0 .003 1.136l1.04.96a.78.78 0 0 0 .995.044l3.78-2.87 8.59 7.84a1.166 1.166 0 0 0 1.33.23l4.94-2.377A1.166 1.166 0 0 0 24 18.37V5.63a1.166 1.166 0 0 0-.85-1.043zM17.66 17.32l-5.94-5.32 5.94-5.32z"/></svg>',
    color: '#007ACC',
  },
  {
    name: 'Windsurf',
    link: '/guide/install-windsurf',
    // Windsurf / Codeium official logo (wave W shape)
    svg: '<svg viewBox="0 0 512 512" fill="currentColor" width="32" height="32"><path fill-rule="evenodd" clip-rule="evenodd" d="M507.307 106.752h-4.864a46.653 46.653 0 00-43.025 28.969 46.66 46.66 0 00-3.482 17.879v104.789c0 20.907-17.152 37.867-37.547 37.867a38.785 38.785 0 01-31.402-16.491l-106.07-152.832a46.865 46.865 0 00-38.613-20.266c-24.192 0-45.952 20.736-45.952 46.357v105.387c0 20.906-17.003 37.866-37.547 37.866-12.16 0-24.234-6.165-31.402-16.49L8.704 108.757C6.016 104.917 0 106.816 0 111.531v91.392c0 4.608 1.408 9.088 4.01 12.885l116.801 168.299c6.912 9.941 17.066 17.322 28.821 20.01 29.376 6.742 56.427-16.085 56.427-45.162V253.653c0-20.906 16.789-37.866 37.546-37.866h.043c12.501 0 24.213 6.144 31.403 16.49L381.12 385.088a45.872 45.872 0 0038.613 20.267c24.704 0 45.888-20.758 45.888-46.358V253.632c0-20.907 16.79-37.867 37.547-37.867h4.139c2.602 0 4.693-2.133 4.693-4.736v-99.562a4.7 4.7 0 00-1.366-3.34 4.705 4.705 0 00-3.327-1.396v.021z"/></svg>',
    color: '#09B6A2',
  },
  {
    name: 'Codex',
    link: '/guide/install-codex',
    // OpenAI logo (simplified hexagon)
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>',
    color: '#000',
  },
  {
    name: 'OpenCode',
    link: '/guide/install-opencode',
    // Terminal/CLI icon
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v16h16V4H4zm3.5 4.7 1.4-1.4 4.3 4.3a.5.5 0 0 1 0 .7l-4.3 4.3-1.4-1.4L11.1 12 7.5 8.7zm5 7.8h5v1.5h-5v-1.5z"/></svg>',
    color: '#4A7FCF',
  },
]
</script>

<template>
  <section class="home-section">
    <h2 class="home-section-title">{{ isPtBR ? 'Funciona Onde Você Programa' : 'Works Everywhere You Code' }}</h2>
    <p class="home-section-subtitle">{{ isPtBR ? 'Instale uma vez, use nos seus editores e plataformas de IA favoritos.' : 'Install once, use across your favorite editors and AI platforms.' }}</p>
    <div class="platform-grid">
      <a
        v-for="p in platforms"
        :key="p.name"
        :href="p.link"
        class="platform-card"
        :style="{ '--platform-color': p.color }"
      >
        <span class="platform-icon" v-html="p.svg" />
        <span class="platform-name">{{ p.name }}</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 640px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .platform-grid {
    grid-template-columns: repeat(6, 1fr);
    max-width: 800px;
  }
}

.platform-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.platform-card:hover {
  border-color: var(--platform-color);
  transform: translateY(-4px) scale(1.03);
  box-shadow:
    0 4px 12px rgba(43, 94, 167, 0.1),
    0 12px 28px rgba(0, 0, 0, 0.08);
}

.dark .platform-card:hover {
  box-shadow:
    0 4px 12px rgba(74, 127, 207, 0.12),
    0 12px 28px rgba(0, 0, 0, 0.3);
}

.platform-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  transition: transform 0.3s ease, color 0.3s ease;
}

.platform-card:hover .platform-icon {
  transform: scale(1.15);
  color: var(--platform-color);
}

.platform-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.platform-card:hover .platform-name {
  color: var(--platform-color);
}

@media (max-width: 640px) {
  .platform-grid {
    gap: 10px;
  }
  .platform-card {
    padding: 14px 8px;
    gap: 6px;
    border-radius: 10px;
  }
  .platform-icon :deep(svg) {
    width: 24px;
    height: 24px;
  }
  .platform-name {
    font-size: 11px;
  }
}
</style>
