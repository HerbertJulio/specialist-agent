<template>
  <section class="home-section">
    <h2 class="home-section-title">Framework Packs</h2>
    <p class="home-section-subtitle">Agents and patterns tailored to your stack.</p>
    <div class="marquee-wrapper" @mouseenter="paused = true" @mouseleave="paused = false">
      <div class="marquee-track" :class="{ paused }">
        <div v-for="fw in doubled" :key="fw.key" class="fw-card" :style="{ '--fw-color': fw.color }">
          <span class="fw-name">{{ fw.name }}</span>
          <span class="fw-detail">{{ fw.detail }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const paused = ref(false)

const frameworks = [
  { name: 'Next.js', color: '#999', detail: 'App Router, Server Components' },
  { name: 'React', color: '#61DAFB', detail: 'Hooks, React Query, Zustand' },
  { name: 'Vue 3', color: '#42b883', detail: 'Composition API, Pinia' },
  { name: 'SvelteKit', color: '#FF3E00', detail: 'Stores, load functions' },
  { name: 'Angular', color: '#DD0031', detail: 'Signals, Standalone' },
  { name: 'Astro', color: '#FF5D01', detail: 'Islands, Content Collections' },
  { name: 'Nuxt', color: '#00DC82', detail: 'Auto-imports, Nitro' },
]

const doubled = computed(() => [
  ...frameworks.map((fw, i) => ({ ...fw, key: `a-${i}` })),
  ...frameworks.map((fw, i) => ({ ...fw, key: `b-${i}` })),
])
</script>

<style scoped>
.marquee-wrapper {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%);
}

.marquee-track {
  display: flex;
  gap: 16px;
  width: max-content;
  animation: marquee-scroll 25s linear infinite;
}

.marquee-track.paused {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.fw-card {
  flex-shrink: 0;
  width: 160px;
  padding: 18px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  text-align: center;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}

.fw-card:hover {
  border-color: var(--fw-color);
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

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: auto;
  }
  .marquee-wrapper {
    mask-image: none;
    -webkit-mask-image: none;
  }
}
</style>
