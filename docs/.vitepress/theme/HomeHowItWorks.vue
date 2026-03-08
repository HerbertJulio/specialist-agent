<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isPtBR = computed(() => lang.value === 'pt-BR')

interface FlowStage {
  title: string
  content: string
  detail: string
}

interface FlowScenario {
  label: string
  icon: string
  stages: FlowStage[]
}

const scenariosEN: FlowScenario[] = [
  {
    label: 'Build',
    icon: '🔨',
    stages: [
      { title: 'You', content: '"Create a products module with CRUD"', detail: '$ claude' },
      { title: 'Dispatch', content: '@orchestrator → @builder', detail: 'auto-dispatch' },
      { title: 'Building', content: 'types → service → components → tests', detail: '4 files created' },
      { title: 'Done', content: '14/14 tests passing', detail: '/verify' },
    ],
  },
  {
    label: 'Review',
    icon: '🔍',
    stages: [
      { title: 'You', content: '"Review the auth module"', detail: '$ claude' },
      { title: 'Dispatch', content: '@orchestrator → @reviewer', detail: 'auto-dispatch' },
      { title: 'Reviewing', content: 'spec → quality → architecture', detail: '3-in-1 review' },
      { title: 'Done', content: '3 issues found, 2 auto-fixed', detail: '1 manual fix' },
    ],
  },
  {
    label: 'Debug',
    icon: '🐛',
    stages: [
      { title: 'You', content: '"500 error on /api/orders"', detail: '$ claude' },
      { title: 'Dispatch', content: '@orchestrator → @doctor', detail: 'auto-dispatch' },
      { title: 'Diagnosing', content: 'reproduce → isolate → trace → fix', detail: '4-phase' },
      { title: 'Done', content: 'Root cause fixed + regression test', detail: 'CI green' },
    ],
  },
  {
    label: 'Plan',
    icon: '📋',
    stages: [
      { title: 'You', content: '"/plan real-time notifications"', detail: '$ claude' },
      { title: 'Dispatch', content: '@planner → adaptive plan', detail: 'complexity: L' },
      { title: 'Planning', content: 'tasks → deps → risks → estimate', detail: '12 tasks' },
      { title: 'Done', content: 'Plan ready → @executor', detail: 'handoff' },
    ],
  },
]

const scenariosPTBR: FlowScenario[] = [
  {
    label: 'Criar',
    icon: '🔨',
    stages: [
      { title: 'Voce', content: '"Crie um modulo de produtos com CRUD"', detail: '$ claude' },
      { title: 'Despacho', content: '@orchestrator → @builder', detail: 'auto-dispatch' },
      { title: 'Construindo', content: 'types → service → components → tests', detail: '4 arquivos' },
      { title: 'Pronto', content: '14/14 testes passando', detail: '/verify' },
    ],
  },
  {
    label: 'Review',
    icon: '🔍',
    stages: [
      { title: 'Voce', content: '"Revise o modulo de autenticacao"', detail: '$ claude' },
      { title: 'Despacho', content: '@orchestrator → @reviewer', detail: 'auto-dispatch' },
      { title: 'Revisando', content: 'spec → qualidade → arquitetura', detail: '3-em-1' },
      { title: 'Pronto', content: '3 problemas, 2 corrigidos', detail: '1 manual' },
    ],
  },
  {
    label: 'Depurar',
    icon: '🐛',
    stages: [
      { title: 'Voce', content: '"Erro 500 em /api/orders"', detail: '$ claude' },
      { title: 'Despacho', content: '@orchestrator → @doctor', detail: 'auto-dispatch' },
      { title: 'Diagnosticando', content: 'reproduzir → isolar → rastrear → corrigir', detail: '4 fases' },
      { title: 'Pronto', content: 'Causa raiz corrigida + teste regressao', detail: 'CI verde' },
    ],
  },
  {
    label: 'Planejar',
    icon: '📋',
    stages: [
      { title: 'Voce', content: '"/plan notificacoes real-time"', detail: '$ claude' },
      { title: 'Despacho', content: '@planner → plano adaptativo', detail: 'complexidade: L' },
      { title: 'Planejando', content: 'tarefas → deps → riscos → estimativa', detail: '12 tarefas' },
      { title: 'Pronto', content: 'Plano pronto → @executor', detail: 'handoff' },
    ],
  },
]

const scenarios = computed(() => isPtBR.value ? scenariosPTBR : scenariosEN)

// ── Canvas + animation state ──
const SCENARIO_DURATION = 6000
const PARTICLE_TRAVEL = 700   // ms for particles to travel between nodes

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const activeScenario = ref(0)
const activeStage = ref(-1)
const isPaused = ref(false)
const reducedMotion = ref(false)
const progressKey = ref(0)

const currentScenario = computed(() => scenarios.value[activeScenario.value])

let animId: number | null = null
let cycleTimer: ReturnType<typeof setInterval> | null = null
let stageTimers: ReturnType<typeof setTimeout>[] = []
let ctx: CanvasRenderingContext2D | null = null
let W = 0, H = 0, dpr = 1

// Node positions (computed on resize)
interface NodePos { x: number; y: number }
let nodes: NodePos[] = []

// Track when each node was activated (for burst effect)
let nodeActivatedAt: number[] = [0, 0, 0, 0]

// Particles traveling along paths
interface Particle {
  fromIdx: number
  toIdx: number
  t: number       // 0..1 progress
  speed: number
  size: number
  alpha: number
  color: string
}
let particles: Particle[] = []

// Ambient dots
interface AmbientDot {
  x: number; y: number; r: number
  alpha: number; speed: number; drift: number; color: string
}
let ambientDots: AmbientDot[] = []

// ── Colors ──
const BLUE = '#4A7FCF'
const BRONZE = '#CD7F32'
const BLUE_LIGHT = '#6DA7F0'
const SUCCESS = '#4CAF50'

function getNodePositions(): NodePos[] {
  if (!containerRef.value) return []
  const rect = containerRef.value.getBoundingClientRect()
  const isVertical = rect.width < 600

  if (isVertical) {
    // Mobile: nodes on the left, labels to the right
    const cx = 36
    const spacing = Math.min(rect.height / 4.5, 100)
    const startY = (rect.height - spacing * 3) / 2
    return [
      { x: cx, y: startY },
      { x: cx, y: startY + spacing },
      { x: cx, y: startY + spacing * 2 },
      { x: cx, y: startY + spacing * 3 },
    ]
  }

  const padding = 80
  const usableW = rect.width - padding * 2
  const cy = rect.height / 2
  return [
    { x: padding, y: cy },
    { x: padding + usableW / 3, y: cy },
    { x: padding + (usableW * 2) / 3, y: cy },
    { x: padding + usableW, y: cy },
  ]
}

function seedAmbientDots() {
  ambientDots = []
  for (let i = 0; i < 18; i++) {
    ambientDots.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.15 + 0.03,
      speed: Math.random() * 0.12 + 0.04,
      drift: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? BLUE : BRONZE,
    })
  }
}

function spawnParticle(fromIdx: number, toIdx: number) {
  const colors = [BLUE, BRONZE, BLUE_LIGHT]
  for (let i = 0; i < 3; i++) {
    particles.push({
      fromIdx,
      toIdx,
      t: -i * 0.10,
      speed: 0.020 + Math.random() * 0.005,
      size: 2.5 + Math.random() * 2,
      alpha: 0.6 + Math.random() * 0.4,
      color: colors[i % colors.length],
    })
  }
}

function getPointOnPath(from: NodePos, to: NodePos, t: number): { x: number; y: number } {
  const isVertical = Math.abs(to.y - from.y) > Math.abs(to.x - from.x)
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  // Vertical: curve bows left (away from labels on right)
  const offset = isVertical ? -20 : -25

  const cx1 = isVertical ? from.x + offset : mx
  const cy1 = isVertical ? my : from.y + offset
  const cx2 = isVertical ? to.x + offset : mx
  const cy2 = isVertical ? my : to.y + offset

  const u = 1 - t
  const x = u*u*u*from.x + 3*u*u*t*cx1 + 3*u*t*t*cx2 + t*t*t*to.x
  const y = u*u*u*from.y + 3*u*u*t*cy1 + 3*u*t*t*cy2 + t*t*t*to.y
  return { x, y }
}

function drawPath(c: CanvasRenderingContext2D, from: NodePos, to: NodePos, active: boolean) {
  const isVertical = Math.abs(to.y - from.y) > Math.abs(to.x - from.x)
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const offset = isVertical ? -20 : -25

  const cx1 = isVertical ? from.x + offset : mx
  const cy1 = isVertical ? my : from.y + offset
  const cx2 = isVertical ? to.x + offset : mx
  const cy2 = isVertical ? my : to.y + offset

  c.beginPath()
  c.moveTo(from.x, from.y)
  c.bezierCurveTo(cx1, cy1, cx2, cy2, to.x, to.y)
  c.strokeStyle = active ? BLUE : 'rgba(74, 127, 207, 0.12)'
  c.lineWidth = active ? 2 : 1
  c.globalAlpha = active ? 0.5 : 0.3
  c.stroke()
  c.globalAlpha = 1
}

function drawNode(c: CanvasRenderingContext2D, pos: NodePos, state: 'inactive' | 'active' | 'done' | 'current' | 'completed', elapsed: number) {
  const r = state === 'current' || state === 'completed' ? 28
    : state === 'done' ? 24 : 22

  // Glow
  if (state === 'current' || state === 'done' || state === 'completed') {
    const pulse = state === 'current' ? Math.sin(elapsed * 3) * 0.15 + 0.25
      : state === 'completed' ? 0.3 : 0.1
    const glowColor = state === 'completed' ? BRONZE : (state === 'current' ? BLUE : BRONZE)
    const grad = c.createRadialGradient(pos.x, pos.y, r * 0.5, pos.x, pos.y, r * 2.5)
    grad.addColorStop(0, state === 'completed'
      ? `rgba(205, 127, 50, ${pulse})`
      : state === 'current'
        ? `rgba(74, 127, 207, ${pulse})`
        : `rgba(205, 127, 50, ${pulse})`)
    grad.addColorStop(1, 'rgba(74, 127, 207, 0)')
    c.fillStyle = grad
    c.beginPath()
    c.arc(pos.x, pos.y, r * 2.5, 0, Math.PI * 2)
    c.fill()
  }

  // Outer ring
  c.beginPath()
  c.arc(pos.x, pos.y, r, 0, Math.PI * 2)
  if (state === 'completed') {
    const ringGrad = c.createLinearGradient(pos.x - r, pos.y - r, pos.x + r, pos.y + r)
    ringGrad.addColorStop(0, BRONZE)
    ringGrad.addColorStop(1, SUCCESS)
    c.strokeStyle = ringGrad
    c.lineWidth = 2.5
  } else if (state === 'current') {
    const ringGrad = c.createLinearGradient(pos.x - r, pos.y - r, pos.x + r, pos.y + r)
    ringGrad.addColorStop(0, BLUE)
    ringGrad.addColorStop(1, BRONZE)
    c.strokeStyle = ringGrad
    c.lineWidth = 2.5
  } else if (state === 'done') {
    c.strokeStyle = BLUE
    c.lineWidth = 2
  } else {
    c.strokeStyle = 'rgba(74, 127, 207, 0.2)'
    c.lineWidth = 1.5
  }
  c.stroke()

  // Inner fill
  c.beginPath()
  c.arc(pos.x, pos.y, r - 3, 0, Math.PI * 2)
  if (state === 'completed') {
    const fillGrad = c.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r)
    fillGrad.addColorStop(0, 'rgba(205, 127, 50, 0.25)')
    fillGrad.addColorStop(1, 'rgba(76, 175, 80, 0.1)')
    c.fillStyle = fillGrad
  } else if (state === 'inactive') {
    c.fillStyle = 'rgba(74, 127, 207, 0.04)'
  } else if (state === 'done') {
    c.fillStyle = 'rgba(74, 127, 207, 0.12)'
  } else {
    const fillGrad = c.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r)
    fillGrad.addColorStop(0, 'rgba(74, 127, 207, 0.15)')
    fillGrad.addColorStop(1, 'rgba(74, 127, 207, 0.04)')
    c.fillStyle = fillGrad
  }
  c.fill()

  // Orbiting dot for current node
  if (state === 'current') {
    const orbitR = r + 8
    const angle = elapsed * 2.5
    const ox = pos.x + Math.cos(angle) * orbitR
    const oy = pos.y + Math.sin(angle) * orbitR
    c.beginPath()
    c.arc(ox, oy, 2.5, 0, Math.PI * 2)
    c.fillStyle = BRONZE
    c.globalAlpha = 0.8
    c.fill()
    c.globalAlpha = 1
  }

  // Checkmark for completed
  if (state === 'completed') {
    c.strokeStyle = SUCCESS
    c.lineWidth = 2.5
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.globalAlpha = 0.9
    c.beginPath()
    c.moveTo(pos.x - 7, pos.y + 1)
    c.lineTo(pos.x - 2, pos.y + 6)
    c.lineTo(pos.x + 8, pos.y - 5)
    c.stroke()
    c.globalAlpha = 1
    c.lineCap = 'butt'
    c.lineJoin = 'miter'
  }
}

function draw() {
  if (!ctx || nodes.length < 4) return
  const now = performance.now()
  const elapsed = now / 1000

  ctx.clearRect(0, 0, W, H)

  // Ambient dots
  for (const d of ambientDots) {
    d.x += Math.cos(d.drift) * d.speed
    d.y += Math.sin(d.drift) * d.speed
    d.drift += (Math.random() - 0.5) * 0.02
    if (d.x < -5) d.x = W + 5
    if (d.x > W + 5) d.x = -5
    if (d.y < -5) d.y = H + 5
    if (d.y > H + 5) d.y = -5
    ctx.globalAlpha = d.alpha
    ctx.fillStyle = d.color
    ctx.beginPath()
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Draw paths
  for (let i = 0; i < 3; i++) {
    drawPath(ctx, nodes[i], nodes[i + 1], activeStage.value > i)
  }

  // Draw particles
  particles = particles.filter(p => {
    p.t += p.speed
    if (p.t > 1.2) return false
    if (p.t < 0) return true

    const from = nodes[p.fromIdx]
    const to = nodes[p.toIdx]
    if (!from || !to) return false

    const pos = getPointOnPath(from, to, Math.min(p.t, 1))

    // Trail
    for (let j = 1; j <= 4; j++) {
      const tt = Math.max(0, p.t - j * 0.04)
      const tp = getPointOnPath(from, to, Math.min(tt, 1))
      ctx!.globalAlpha = p.alpha * (1 - j / 5) * 0.3
      ctx!.fillStyle = p.color
      ctx!.beginPath()
      ctx!.arc(tp.x, tp.y, p.size * (1 - j * 0.15), 0, Math.PI * 2)
      ctx!.fill()
    }

    // Glow
    ctx!.globalAlpha = p.alpha * 0.15
    ctx!.fillStyle = p.color
    ctx!.beginPath()
    ctx!.arc(pos.x, pos.y, p.size * 3, 0, Math.PI * 2)
    ctx!.fill()

    // Core
    ctx!.globalAlpha = p.alpha
    ctx!.fillStyle = p.color
    ctx!.beginPath()
    ctx!.arc(pos.x, pos.y, p.size, 0, Math.PI * 2)
    ctx!.fill()
    ctx!.globalAlpha = 1

    return true
  })

  // Burst ring effect when a node activates
  for (let i = 0; i < 4; i++) {
    if (nodeActivatedAt[i] > 0) {
      const dt = (now - nodeActivatedAt[i]) / 1000
      if (dt > 0 && dt < 0.5) {
        const burstR = 28 + dt * 50
        const burstAlpha = (1 - dt / 0.5) * 0.35
        ctx.beginPath()
        ctx.arc(nodes[i].x, nodes[i].y, burstR, 0, Math.PI * 2)
        ctx.strokeStyle = i === 3 ? BRONZE : BLUE
        ctx.lineWidth = 1.5
        ctx.globalAlpha = burstAlpha
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }
  }

  // Draw nodes
  for (let i = 0; i < 4; i++) {
    let state: 'inactive' | 'active' | 'done' | 'current' | 'completed'
    if (i === 3 && activeStage.value >= 3) {
      state = 'completed'
    } else if (activeStage.value === i) {
      state = 'current'
    } else if (activeStage.value > i) {
      state = 'done'
    } else {
      state = 'inactive'
    }
    drawNode(ctx, nodes[i], state, elapsed)
  }

  animId = requestAnimationFrame(draw)
}

function setupCanvas() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const rect = container.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = rect.width
  H = rect.height

  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.width = `${W}px`
  canvas.style.height = `${H}px`

  ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  nodes = getNodePositions()
  seedAmbientDots()
}

// ── Stage timing (particle-first sync) ──
function clearStageTimers() {
  stageTimers.forEach(t => clearTimeout(t))
  stageTimers = []
}

function activateStages() {
  clearStageTimers()
  activeStage.value = -1
  particles = []
  nodeActivatedAt = [0, 0, 0, 0]

  if (reducedMotion.value) {
    activeStage.value = 3
    return
  }

  // Stage 0: activate immediately (user input node)
  stageTimers.push(setTimeout(() => {
    activeStage.value = 0
    nodeActivatedAt[0] = performance.now()
    // Spawn particles toward node 1
    spawnParticle(0, 1)
  }, 300))

  // Stage 1: particles arrive, then node activates
  stageTimers.push(setTimeout(() => {
    activeStage.value = 1
    nodeActivatedAt[1] = performance.now()
    spawnParticle(1, 2)
  }, 300 + PARTICLE_TRAVEL))

  // Stage 2
  stageTimers.push(setTimeout(() => {
    activeStage.value = 2
    nodeActivatedAt[2] = performance.now()
    spawnParticle(2, 3)
  }, 300 + PARTICLE_TRAVEL * 2))

  // Stage 3 (final — completed)
  stageTimers.push(setTimeout(() => {
    activeStage.value = 3
    nodeActivatedAt[3] = performance.now()
  }, 300 + PARTICLE_TRAVEL * 3))
}

function startCycle() {
  if (cycleTimer) clearInterval(cycleTimer)
  progressKey.value++
  activateStages()

  cycleTimer = setInterval(() => {
    if (isPaused.value) return
    activeScenario.value = (activeScenario.value + 1) % scenarios.value.length
    progressKey.value++
    nextTick(() => activateStages())
  }, SCENARIO_DURATION)
}

function selectScenario(index: number) {
  activeScenario.value = index
  if (cycleTimer) clearInterval(cycleTimer)
  progressKey.value++
  nextTick(() => {
    if (!reducedMotion.value) {
      startCycle()
    } else {
      activateStages()
    }
  })
}

// ── Lifecycle ──
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  setupCanvas()

  resizeObserver = new ResizeObserver(() => {
    setupCanvas()
  })
  if (containerRef.value) resizeObserver.observe(containerRef.value)

  if (!reducedMotion.value) {
    draw()
    startCycle()
  } else {
    activeStage.value = 3
  }
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (cycleTimer) clearInterval(cycleTimer)
  if (resizeObserver) resizeObserver.disconnect()
  clearStageTimers()
})
</script>

<template>
  <section class="home-section">
    <h2 class="home-section-title">{{ isPtBR ? 'Como Funciona' : 'How It Works' }}</h2>
    <p class="home-section-subtitle">{{ isPtBR ? 'Descreva sua intencao. O agente certo cuida do resto.' : 'Describe your intent. The right agent handles the rest.' }}</p>

    <div class="flow-tabs">
      <button
        v-for="(scenario, i) in scenarios"
        :key="scenario.label"
        class="flow-tab"
        :class="{ active: activeScenario === i }"
        @click="selectScenario(i)"
      >
        <span class="flow-tab-icon">{{ scenario.icon }}</span>
        {{ scenario.label }}
      </button>
    </div>

    <!-- Canvas + overlay container -->
    <div
      ref="containerRef"
      class="flow-canvas-wrap"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <canvas ref="canvasRef" class="flow-canvas" />

      <!-- HTML overlays for node labels -->
      <div
        v-for="(stage, i) in currentScenario.stages"
        :key="`${activeScenario}-label-${i}`"
        class="flow-node-label"
        :class="{
          active: activeStage >= i,
          current: activeStage === i,
          done: activeStage > i,
          completed: i === 3 && activeStage >= 3,
        }"
        :style="{ '--node-index': i }"
      >
        <div class="flow-node-title">{{ stage.title }}</div>
        <div class="flow-node-content">{{ stage.content }}</div>
        <div class="flow-node-detail">{{ stage.detail }}</div>
      </div>
    </div>

    <div class="flow-progress">
      <div :key="progressKey" class="flow-progress-bar" />
    </div>
  </section>
</template>

<style scoped>
/* === Tabs === */
.flow-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.flow-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.flow-tab:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
  transform: translateY(-1px);
}

.flow-tab.active {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft, rgba(43, 94, 167, 0.08));
}

.flow-tab-icon {
  font-size: 14px;
  line-height: 1;
}

/* === Canvas Container === */
.flow-canvas-wrap {
  position: relative;
  max-width: 960px;
  margin: -10px auto 0;
  height: 220px;
}

/* === Node Labels === */
.flow-node-label {
  position: absolute;
  text-align: center;
  width: 200px;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.flow-node-label.active {
  opacity: 1;
}

.flow-node-label.current {
  transform: translateX(-50%) translateY(-2px);
}

/* Horizontal layout (desktop) */
@media (min-width: 600px) {
  .flow-node-label:nth-child(2) { left: calc(80px); top: calc(50% + 40px); }
  .flow-node-label:nth-child(3) { left: calc(80px + (100% - 160px) / 3); top: calc(50% + 40px); }
  .flow-node-label:nth-child(4) { left: calc(80px + (100% - 160px) * 2 / 3); top: calc(50% + 40px); }
  .flow-node-label:nth-child(5) { left: calc(100% - 80px); top: calc(50% + 40px); }
}

/* Vertical layout (mobile) — labels to the right of nodes */
@media (max-width: 599px) {
  .flow-canvas-wrap {
    height: 420px;
  }

  .flow-node-label {
    left: 80px;
    text-align: left;
    width: calc(100% - 100px);
    transform: translateY(-50%);
  }

  .flow-node-label.current {
    transform: translateY(-50%) translateX(3px);
  }

  .flow-node-label:nth-child(2) { top: calc((100% - 300px) / 2); }
  .flow-node-label:nth-child(3) { top: calc((100% - 300px) / 2 + 100px); }
  .flow-node-label:nth-child(4) { top: calc((100% - 300px) / 2 + 200px); }
  .flow-node-label:nth-child(5) { top: calc((100% - 300px) / 2 + 300px); }
}

.flow-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.flow-node-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--vp-c-text-3);
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.flow-node-label.current .flow-node-title {
  color: var(--vp-c-brand-1);
}

.flow-node-label.done .flow-node-title {
  color: var(--vp-c-text-2);
}

.flow-node-label.completed .flow-node-title {
  color: #4CAF50;
}

.flow-node-content {
  font-size: 12px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--vp-c-text-1);
  line-height: 1.4;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  display: inline-block;
  transition: all 0.3s ease;
  word-break: break-word;
}

.flow-node-label.current .flow-node-content {
  color: var(--vp-c-brand-1);
  border-color: rgba(74, 127, 207, 0.2);
  background: var(--vp-c-bg);
}

.flow-node-label.completed .flow-node-content {
  color: #4CAF50;
  border-color: rgba(76, 175, 80, 0.25);
  background: var(--vp-c-bg);
}

.flow-node-detail {
  font-size: 10px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--vp-c-text-3);
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.4s ease 0.3s;
}

.flow-node-label.active .flow-node-detail {
  opacity: 1;
}

/* === Progress Bar === */
.flow-progress {
  max-width: 960px;
  margin: 40px auto 0;
  height: 1px;
  border-radius: 1px;
  background: var(--vp-c-divider);
  overflow: hidden;
  opacity: 0.4;
}

.flow-progress-bar {
  height: 100%;
  border-radius: 1px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--as-bronze, #CD7F32));
  animation: flow-progress 6s linear infinite;
}

@keyframes flow-progress {
  from { width: 0; }
  to { width: 100%; }
}

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {
  .flow-canvas {
    display: none;
  }
  .flow-node-label {
    opacity: 1 !important;
    transform: translateX(-50%) !important;
  }
  @media (max-width: 599px) {
    .flow-node-label {
      transform: translateY(-50%) !important;
    }
  }
  .flow-node-detail {
    opacity: 1 !important;
  }
  .flow-progress-bar {
    animation: none;
    width: 100%;
  }
}
</style>
