<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const overlay = ref(null)
const isOpen = ref(false)
const svgContent = ref('')

function handleClick(e) {
  const mermaid = e.target.closest('.mermaid')
  if (!mermaid) return
  const svg = mermaid.querySelector('svg')
  if (!svg) return
  svgContent.value = svg.outerHTML
  isOpen.value = true
}

function close() {
  isOpen.value = false
  svgContent.value = ''
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
        ref="overlay"
        class="mermaid-overlay"
        @click.self="close"
      >
        <button class="mermaid-close" @click="close" aria-label="Close">✕</button>
        <div class="mermaid-zoom-content" v-html="svgContent" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mermaid-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(10, 22, 40, 0.85);
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
  max-width: 95vw;
  max-height: 90vh;
  overflow: auto;
}

.mermaid-zoom-content :deep(svg) {
  width: auto !important;
  max-width: 95vw;
  max-height: 85vh;
  height: auto;
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
