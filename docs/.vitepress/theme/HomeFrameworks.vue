<template>
  <section class="home-section">
    <h2 class="home-section-title">Framework Packs</h2>
    <p class="home-section-subtitle">Agents and patterns tailored to your stack.</p>
    <div class="framework-grid">
      <div v-for="fw in frameworks" :key="fw.name" class="fw-card" :style="{ '--fw-color': fw.color }">
        <span class="fw-name">{{ fw.name }}</span>
        <span class="fw-detail">{{ fw.detail }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const frameworks = [
  { name: 'Next.js', color: '#999', detail: 'App Router, Server Components' },
  { name: 'React', color: '#61DAFB', detail: 'Hooks, React Query, Zustand' },
  { name: 'Vue 3', color: '#42b883', detail: 'Composition API, Pinia' },
  { name: 'SvelteKit', color: '#FF3E00', detail: 'Stores, load functions' },
  { name: 'Angular', color: '#DD0031', detail: 'Signals, Standalone' },
  { name: 'Astro', color: '#FF5D01', detail: 'Islands, Content Collections' },
  { name: 'Nuxt', color: '#00DC82', detail: 'Auto-imports, Nitro' },
]
</script>

<style scoped>
.framework-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 720px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .framework-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 960px) {
  .framework-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}

.fw-card {
  padding: 16px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.fw-card:hover {
  border-color: var(--fw-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.dark .fw-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.fw-name {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--fw-color);
  margin-bottom: 4px;
}

.fw-detail {
  display: block;
  font-size: 11px;
  color: var(--vp-c-text-3);
  line-height: 1.3;
}
</style>
