<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vitepress'
import DemoTerminal from './DemoTerminal.vue'

const route = useRoute()
const isPtBr = computed(() => route.path.startsWith('/pt-BR'))

const activeCard = ref(0)
const sweepingCard = ref(-1)
const demoRef = ref<InstanceType<typeof DemoTerminal> | null>(null)
const terminalFlip = ref(false)

const links = [
  '/guide/quick-start',
  '/reference/agents',
  '/reference/skills',
  '/guide/architecture',
  '/guide/installation',
  '/reference/hooks',
]

const features = computed(() => {
  const prefix = isPtBr.value ? '/pt-BR' : ''
  const items = isPtBr.value ? [
    { icon: '\u26A1', title: 'Setup em um comando', details: 'npx specialist-agent init \u2014 detecta seu framework, instala os agentes, pronto.', linkText: 'Saiba mais' },
    { icon: '\uD83D\uDC65', title: '35 Agentes Especializados', details: 'Do @builder ao @sentry-triage. Core, workflow, engenharia, neg\u00F3cio e automa\u00E7\u00E3o.', linkText: 'Saiba mais' },
    { icon: '\uD83D\uDD27', title: '24 Skills Repet\u00EDveis', details: 'Do /plan ao /autofix. Planejamento, desenvolvimento, qualidade, migra\u00E7\u00E3o e conhecimento.', linkText: 'Saiba mais' },
    { icon: '\uD83D\uDCE6', title: '7 Packs de Framework', details: 'Vue, React, Next.js, SvelteKit, Angular, Astro, Nuxt \u2014 cada um com agentes otimizados.', linkText: 'Saiba mais' },
    { icon: '\uD83D\uDDA5\uFE0F', title: '6 Plataformas', details: 'Claude Code, Cursor, VS Code, Windsurf, Codex, OpenCode.', linkText: 'Saiba mais' },
    { icon: '\u2699\uFE0F', title: 'Automa\u00E7\u00E3o', details: 'Sentry triage, autofix, smart commits \u2014 automatize as partes chatas.', linkText: 'Saiba mais' },
  ] : [
    { icon: '\u26A1', title: 'One command setup', details: 'npx specialist-agent init \u2014 picks your framework, installs agents, done.', linkText: 'Learn more' },
    { icon: '\uD83D\uDC65', title: '35 Specialized Agents', details: 'From @builder to @sentry-triage. Core, workflow, engineering, business, and automation agents.', linkText: 'Learn more' },
    { icon: '\uD83D\uDD27', title: '24 Repeatable Skills', details: 'From /plan to /autofix. Planning, development, quality, migration, and knowledge skills.', linkText: 'Learn more' },
    { icon: '\uD83D\uDCE6', title: '7 Framework Packs', details: 'Vue, React, Next.js, SvelteKit, Angular, Astro, Nuxt \u2014 each with optimized agents.', linkText: 'Learn more' },
    { icon: '\uD83D\uDDA5\uFE0F', title: '6 Platforms', details: 'Claude Code, Cursor, VS Code, Windsurf, Codex, OpenCode.', linkText: 'Learn more' },
    { icon: '\u2699\uFE0F', title: 'Automation', details: 'Sentry triage, autofix, smart commits \u2014 automate the boring parts.', linkText: 'Learn more' },
  ]
  return items.map((item, i) => ({ ...item, href: prefix + links[i] }))
})

function triggerFlip() {
  terminalFlip.value = true
  setTimeout(() => { terminalFlip.value = false }, 500)
}

function triggerSweep(index: number) {
  sweepingCard.value = -1
  // Force re-trigger even if same card
  requestAnimationFrame(() => {
    sweepingCard.value = index
    setTimeout(() => { sweepingCard.value = -1 }, 600)
  })
}

function onCardClick(index: number) {
  if (index === activeCard.value) return
  activeCard.value = index
  triggerFlip()
  triggerSweep(index)
}

let lastAutoGroup = -1
function onGroupChange(index: number) {
  if (index !== lastAutoGroup) {
    lastAutoGroup = index
    activeCard.value = index
    triggerFlip()
    triggerSweep(index)
  }
}
</script>

<template>
  <section class="hfd">
    <div class="hfd-container">
      <!-- Left: Feature cards (compact sidebar) -->
      <div class="hfd-features">
        <div
          v-for="(f, i) in features"
          :key="i"
          class="hfd-card"
          :class="{ active: activeCard === i, sweeping: sweepingCard === i }"
          @click="onCardClick(i)"
        >
          <div class="hfd-shine" />
          <div class="hfd-icon">{{ f.icon }}</div>
          <div class="hfd-content">
            <h3 class="hfd-title">{{ f.title }}</h3>
            <p v-if="activeCard === i" class="hfd-details">
              {{ f.details }}
              <a :href="f.href" class="hfd-link" @click.stop>{{ f.linkText }} &rarr;</a>
            </p>
          </div>
          <div v-if="activeCard === i" class="hfd-active-bar" />
        </div>
      </div>

      <!-- Right: Demo terminal with flip -->
      <div class="hfd-demo" :class="{ flipping: terminalFlip }">
        <DemoTerminal
          ref="demoRef"
          :group-index="activeCard"
          @group-change="onGroupChange"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hfd {
  padding: 32px 24px;
}

.hfd-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}

/* ── Feature cards (compact sidebar) ── */
.hfd-features {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hfd-card {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s;
  overflow: hidden;
}

.hfd-card:hover {
  border-color: var(--vp-c-divider);
}

.hfd-card.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

/* ── Prism shine ── */
.hfd-shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s;
  background: linear-gradient(
    105deg,
    transparent 25%,
    rgba(74, 127, 207, 0.05) 40%,
    rgba(205, 127, 50, 0.04) 50%,
    rgba(109, 167, 240, 0.03) 60%,
    transparent 75%
  );
}

.hfd-card:hover .hfd-shine {
  opacity: 1;
}

.hfd-card.active .hfd-shine {
  opacity: 1;
  background: linear-gradient(
    105deg,
    transparent 15%,
    rgba(74, 127, 207, 0.07) 35%,
    rgba(205, 127, 50, 0.05) 50%,
    rgba(109, 167, 240, 0.04) 65%,
    transparent 85%
  );
}

/* Sweep animation on click/activate */
.hfd-card.sweeping .hfd-shine {
  opacity: 1;
  animation: prism-sweep 0.6s ease-out;
}

@keyframes prism-sweep {
  0% {
    opacity: 0;
    background-position: -100% 0;
    background-size: 200% 100%;
    background-image: linear-gradient(
      105deg,
      transparent 10%,
      rgba(74, 127, 207, 0.12) 30%,
      rgba(205, 127, 50, 0.1) 45%,
      rgba(109, 167, 240, 0.08) 55%,
      transparent 70%
    );
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    background-position: 100% 0;
    background-size: 200% 100%;
    background-image: linear-gradient(
      105deg,
      transparent 15%,
      rgba(74, 127, 207, 0.07) 35%,
      rgba(205, 127, 50, 0.05) 50%,
      rgba(109, 167, 240, 0.04) 65%,
      transparent 85%
    );
  }
}

/* ── Active indicator ── */
.hfd-active-bar {
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--vp-c-brand-1);
  animation: bar-in 0.25s ease-out;
}

@keyframes bar-in {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

/* ── Icon & content ── */
.hfd-icon {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hfd-content {
  min-width: 0;
}

.hfd-title {
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1);
}

.hfd-details {
  font-size: 12px;
  line-height: 1.4;
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
}

.hfd-link {
  display: inline-block;
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s;
}

.hfd-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

/* ── Demo terminal with flip ── */
.hfd-demo {
  perspective: 1200px;
}

.hfd-demo.flipping :deep(.demo-terminal) {
  animation: terminal-flip 0.5s ease;
}

@keyframes terminal-flip {
  0% {
    transform: rotateY(0deg) scale(1);
    opacity: 1;
  }
  30% {
    transform: rotateY(-8deg) scale(0.97);
    opacity: 0.7;
  }
  60% {
    transform: rotateY(4deg) scale(0.99);
    opacity: 0.9;
  }
  100% {
    transform: rotateY(0deg) scale(1);
    opacity: 1;
  }
}

/* ── Tablet ── */
@media (max-width: 860px) {
  .hfd-container {
    grid-template-columns: 1fr;
    max-width: 640px;
    gap: 16px;
  }

  .hfd-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .hfd-details {
    display: none;
  }
}

/* ── Mobile ── */
@media (max-width: 639px) {
  .hfd {
    padding: 24px 16px;
  }

  .hfd-features {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .hfd-container {
    gap: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hfd-demo.flipping :deep(.demo-terminal) {
    animation: none;
  }
  .hfd-active-bar {
    animation: none;
  }
}
</style>
