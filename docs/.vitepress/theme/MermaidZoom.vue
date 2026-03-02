<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'

const isOpen = ref(false)
const svgContainer = ref(null)

function handleClick(e) {
  // Ignore clicks inside the overlay itself
  if (e.target.closest('.mermaid-overlay')) return

  const mermaid = e.target.closest('.mermaid')
  if (!mermaid) return
  const svg = mermaid.querySelector('svg')
  if (!svg) return

  isOpen.value = true
  nextTick(() => {
    if (svgContainer.value) {
      const clone = svg.cloneNode(true)
      // Remove mermaid's inline max-width constraint so SVG fills the overlay
      clone.removeAttribute('style')
      clone.removeAttribute('height')
      // Fill container width - viewBox preserves aspect ratio
      clone.setAttribute('width', '100%')
      svgContainer.value.innerHTML = ''
      svgContainer.value.appendChild(clone)
    }
  })
}

function close() {
  isOpen.value = false
  if (svgContainer.value) {
    svgContainer.value.innerHTML = ''
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => {
  document.addEventListener('click', handleClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="mermaid-zoom">
      <div
        v-if="isOpen"
        class="mermaid-overlay"
        @click.self="close"
      >
        <button class="mermaid-close" @click="close" aria-label="Close">&#x2715;</button>
        <div ref="svgContainer" class="mermaid-zoom-content" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mermaid-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(10, 22, 40, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
}

.mermaid-close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: 1000;
}

.mermaid-close:hover {
  opacity: 1;
}

.mermaid-zoom-content {
  width: 50vw;
  max-height: 90vh;
  overflow: auto;
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 2rem;
}

.mermaid-zoom-enter-active,
.mermaid-zoom-leave-active {
  transition: opacity 0.2s ease;
}

.mermaid-zoom-enter-from,
.mermaid-zoom-leave-to {
  opacity: 0;
}
</style>
