<script setup lang="ts">
const platforms = [
  { name: 'Claude Code', icon: '🤖', link: '/guide/installation' },
  { name: 'Cursor', icon: '⌨️', link: '/guide/install-cursor' },
  { name: 'VS Code', icon: '💻', link: '/guide/install-vscode' },
  { name: 'Windsurf', icon: '🏄', link: '/guide/install-windsurf' },
  { name: 'Codex', icon: '📟', link: '/guide/install-codex' },
  { name: 'OpenCode', icon: '🔓', link: '/guide/install-opencode' },
]
</script>

<template>
  <section class="home-section">
    <h2 class="home-section-title">Works Everywhere You Code</h2>
    <p class="home-section-subtitle">Install once, use across your favorite editors and AI platforms.</p>
    <div class="platform-grid">
      <a
        v-for="p in platforms"
        :key="p.name"
        :href="p.link"
        class="platform-card"
      >
        <span class="platform-icon">{{ p.icon }}</span>
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
  transition: all 0.3s ease;
}

.platform-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.dark .platform-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.platform-icon {
  font-size: 28px;
}

.platform-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.2;
}

.platform-card:hover .platform-name {
  color: var(--vp-c-brand-1);
}
</style>
