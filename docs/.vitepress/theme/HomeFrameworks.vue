<template>
  <section class="home-section">
    <h2 class="home-section-title">Framework Packs</h2>
    <p class="home-section-subtitle">Agents and patterns tailored to your stack.</p>
    <div
      ref="wrapperRef"
      class="marquee-wrapper"
      @mouseenter="paused = true"
      @mouseleave="onMouseLeave"
      @mousedown="onDragStart"
      @touchstart.passive="onDragStart"
    >
      <div class="marquee-track" :class="{ paused, dragging }">
        <div v-for="fw in doubled" :key="fw.key" class="fw-card" :style="{ '--fw-color': fw.color }">
          <span class="fw-name">{{ fw.name }}</span>
          <span class="fw-detail">{{ fw.detail }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const paused = ref(false)
const dragging = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

let startX = 0
let scrollLeft = 0

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

function onDragStart(e: MouseEvent | TouchEvent) {
  dragging.value = true
  const wrapper = wrapperRef.value
  if (!wrapper) return

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  startX = clientX - wrapper.offsetLeft
  scrollLeft = wrapper.scrollLeft

  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
  document.addEventListener('touchmove', onDragMove, { passive: true })
  document.addEventListener('touchend', onDragEnd)
}

function onDragMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value || !wrapperRef.value) return
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const x = clientX - wrapperRef.value.offsetLeft
  const walk = (x - startX) * 2
  wrapperRef.value.scrollLeft = scrollLeft - walk
}

function onDragEnd() {
  dragging.value = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
}

function onMouseLeave() {
  paused.value = false
  if (dragging.value) onDragEnd()
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
})
</script>

<style scoped>
.marquee-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  mask-image: linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%);
  scrollbar-width: none;
  cursor: grab;
  -webkit-user-select: none;
  user-select: none;
}

.marquee-wrapper::-webkit-scrollbar {
  display: none;
}

.marquee-track {
  display: flex;
  gap: 16px;
  width: max-content;
  padding: 4px 0;
  animation: marquee-scroll 25s linear infinite;
}

.marquee-track.paused {
  animation-play-state: paused;
}

.marquee-track.dragging {
  animation-play-state: paused;
  cursor: grabbing;
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
  pointer-events: none;
}

.marquee-track:not(.dragging) .fw-card {
  pointer-events: auto;
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
    cursor: auto;
  }
}
</style>
