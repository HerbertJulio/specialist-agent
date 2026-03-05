<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isPtBr = computed(() => route.path.startsWith('/pt-BR'))

const command = 'npx specialist-agent init'
const copied = ref(false)

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    /* clipboard not available */
  }
}
</script>

<template>
  <div class="terminal-wrapper">
    <div class="terminal">
      <!-- Title bar -->
      <div class="terminal-bar">
        <div class="terminal-dots">
          <span class="dot dot-close" />
          <span class="dot dot-minimize" />
          <span class="dot dot-expand" />
        </div>
        <div class="terminal-title">terminal</div>
        <button
          class="terminal-copy"
          :title="isPtBr ? 'Copiar comando' : 'Copy command'"
          @click="copyCommand"
        >
          <svg
            v-if="!copied"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#28ca42"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

      <!-- Command line -->
      <div class="terminal-body" @click="copyCommand">
        <span class="prompt">~</span>
        <span class="chevron">❯</span>
        <span class="command">{{ command }}</span>
        <span class="cursor">▌</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 28px;
}

@media (min-width: 960px) {
  .terminal-wrapper {
    justify-content: flex-start;
  }
}

.terminal {
  width: 100%;
  max-width: 420px;
  border-radius: 10px;
  overflow: hidden;
  background: #1a1b26;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.2),
    0 1px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Title bar */
.terminal-bar {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #15161e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-close { background: #ff5f57; }
.dot-minimize { background: #ffbd2e; }
.dot-expand { background: #28ca42; }

.terminal-title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  font-family: var(--vp-font-family-base);
  letter-spacing: 0.02em;
}

.terminal-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: color 0.2s;
}

.terminal-copy:hover {
  color: rgba(255, 255, 255, 0.7);
}

/* Command line */
.terminal-body {
  padding: 14px 16px 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.6;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.terminal-body:hover {
  background: rgba(255, 255, 255, 0.02);
}

.prompt {
  color: #7aa2f7;
  user-select: none;
}

.chevron {
  color: var(--as-bronze-light, #d4943f);
  user-select: none;
  font-size: 13px;
}

.command {
  color: #c0caf5;
  white-space: nowrap;
}

.cursor {
  color: #c0caf5;
  animation: blink 1s step-end infinite;
  font-size: 13px;
  line-height: 1;
}

@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* Responsive */
@media (max-width: 639px) {
  .terminal {
    max-width: 100%;
    border-radius: 8px;
  }

  .terminal-body {
    font-size: 13px;
    padding: 12px 12px 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
    opacity: 1;
  }

  .terminal-copy {
    transition: none;
  }
}
</style>
