<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/* ── Refs ── */
const backRef = ref<HTMLCanvasElement | null>(null)
const frontRef = ref<HTMLCanvasElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card1Ref = ref<HTMLElement | null>(null)
const showUI = ref(false)
const settled = ref(false)

let animId: number | null = null
let resizeObserver: ResizeObserver | null = null
let startTime = 0
let backCtx: CanvasRenderingContext2D | null = null
let frontCtx: CanvasRenderingContext2D | null = null

/* ── Math helpers ── */
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/* ── Card config ── */
const cardDefs = [
  { baseZ: 0, opacity: 0.85, dropDelay: 0.3, breatheAmp: 6, breathePhase: 0, spreadZ: -20 },
  { baseZ: 28, opacity: 0.9, dropDelay: 1.0, breatheAmp: 10, breathePhase: 0.7, spreadZ: 0 },
  { baseZ: 56, opacity: 0.95, dropDelay: 1.7, breatheAmp: 14, breathePhase: 1.4, spreadZ: 25 },
]

function tickCards(elapsed: number) {
  const refs = [card3Ref, card2Ref, card1Ref]
  const dropDuration = 1.2

  // 30s spread cycle (first cycle at 8s, then every 30s)
  const spreadStart = 8
  const spreadDur = 2.5
  const spreadHold = 1.5
  const closeDur = 2.5
  const cyclePeriod = 30
  const spreadElapsed = Math.max(0, elapsed - spreadStart) % cyclePeriod
  let spreadFactor = 0
  if (spreadElapsed < spreadDur) {
    spreadFactor = easeInOutCubic(spreadElapsed / spreadDur)
  } else if (spreadElapsed < spreadDur + spreadHold) {
    spreadFactor = 1
  } else if (spreadElapsed < spreadDur + spreadHold + closeDur) {
    spreadFactor = 1 - easeInOutCubic((spreadElapsed - spreadDur - spreadHold) / closeDur)
  }

  let allDropped = true
  for (let i = 0; i < 3; i++) {
    const el = refs[i].value
    const c = cardDefs[i]
    if (!el) continue

    const dropProgress = clamp((elapsed - c.dropDelay) / dropDuration, 0, 1)
    const eased = easeOutCubic(dropProgress)
    if (dropProgress < 1) allDropped = false

    const breathe = dropProgress >= 1
      ? Math.sin((elapsed + c.breathePhase) * Math.PI / 3) * c.breatheAmp
      : 0
    const spread = dropProgress >= 1 ? c.spreadZ * spreadFactor : 0

    const z = lerp(250, c.baseZ, eased) + breathe + spread
    const opacity = lerp(0, c.opacity, eased)

    el.style.transform = `translateZ(${z}px)`
    el.style.opacity = `${opacity}`
  }

  if (allDropped && !showUI.value) showUI.value = true
  if (allDropped && !settled.value) settled.value = true
}

/* ── Particle types ── */
interface Dot {
  x: number; y: number; r: number
  alpha: number; speed: number; drift: number; color: string
}
interface TrailPoint { x: number; y: number; behind: boolean }
interface Orb {
  angle: number; speed: number; rx: number; ry: number
  r: number; alpha: number; color: string; trail: TrailPoint[]
}

const dots: Dot[] = []
const orbs: Orb[] = []
let W = 0, H = 0, cx = 0, cy = 0

function seed() {
  dots.length = 0
  orbs.length = 0

  for (let i = 0; i < 25; i++) {
    dots.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.25 + 0.05,
      speed: Math.random() * 0.15 + 0.05,
      drift: Math.random() * Math.PI * 2,
      color: Math.random() > 0.35 ? '#4A7FCF' : '#CD7F32',
    })
  }

  const orbDefs = [
    { rx: 120, ry: 36, r: 3.5, speed: 0.012, angle: 0, color: '#4A7FCF', alpha: 0.7 },
    { rx: 105, ry: 30, r: 2.8, speed: 0.009, angle: (Math.PI * 2) / 3, color: '#CD7F32', alpha: 0.6 },
    { rx: 135, ry: 42, r: 2.2, speed: 0.007, angle: (Math.PI * 4) / 3, color: '#6DA7F0', alpha: 0.5 },
  ]
  for (const d of orbDefs) orbs.push({ ...d, trail: [] })
}

function drawParticles(bc: CanvasRenderingContext2D, fc: CanvasRenderingContext2D) {
  bc.clearRect(0, 0, W, H)
  fc.clearRect(0, 0, W, H)

  for (const d of dots) {
    d.x += Math.cos(d.drift) * d.speed
    d.y += Math.sin(d.drift) * d.speed
    d.drift += (Math.random() - 0.5) * 0.03
    if (d.x < -5) d.x = W + 5
    if (d.x > W + 5) d.x = -5
    if (d.y < -5) d.y = H + 5
    if (d.y > H + 5) d.y = -5
    bc.globalAlpha = d.alpha
    bc.fillStyle = d.color
    bc.beginPath()
    bc.arc(d.x, d.y, d.r, 0, Math.PI * 2)
    bc.fill()
  }

  for (const o of orbs) {
    o.angle += o.speed
    const px = cx + Math.cos(o.angle) * o.rx
    const py = cy + Math.sin(o.angle) * o.ry
    const isFront = Math.sin(o.angle) > 0

    o.trail.push({ x: px, y: py, behind: !isFront })
    if (o.trail.length > 28) o.trail.shift()

    for (let i = 0; i < o.trail.length - 1; i++) {
      const t = o.trail[i]
      const frac = i / o.trail.length
      const tCtx = t.behind ? bc : fc
      tCtx.globalAlpha = frac * o.alpha * 0.35
      tCtx.fillStyle = o.color
      tCtx.beginPath()
      tCtx.arc(t.x, t.y, o.r * (0.3 + frac * 0.5), 0, Math.PI * 2)
      tCtx.fill()
    }

    const orbCtx = isFront ? fc : bc
    orbCtx.globalAlpha = o.alpha * 0.15
    orbCtx.fillStyle = o.color
    orbCtx.beginPath()
    orbCtx.arc(px, py, o.r * 3, 0, Math.PI * 2)
    orbCtx.fill()
    orbCtx.globalAlpha = o.alpha
    orbCtx.beginPath()
    orbCtx.arc(px, py, o.r, 0, Math.PI * 2)
    orbCtx.fill()
  }

  const pulse = Math.sin(Date.now() * 0.001) * 0.04 + 0.06
  const grad = bc.createRadialGradient(cx, cy, 0, cx, cy, 60)
  grad.addColorStop(0, `rgba(74, 127, 207, ${pulse})`)
  grad.addColorStop(1, 'rgba(74, 127, 207, 0)')
  bc.globalAlpha = 1
  bc.fillStyle = grad
  bc.beginPath()
  bc.arc(cx, cy, 60, 0, Math.PI * 2)
  bc.fill()

  bc.globalAlpha = 1
  fc.globalAlpha = 1
}

/* ── Main loop ── */
function tick() {
  const elapsed = (performance.now() - startTime) / 1000

  tickCards(elapsed)

  if (elapsed > 2.5 && backCtx && frontCtx) {
    drawParticles(backCtx, frontCtx)
  }

  animId = requestAnimationFrame(tick)
}

/* ── Canvas setup ── */
function initCanvas(canvas: HTMLCanvasElement, dpr: number) {
  canvas.width = W * dpr
  canvas.height = H * dpr
  canvas.style.width = `${W}px`
  canvas.style.height = `${H}px`
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

function setupCanvas() {
  const back = backRef.value
  const front = frontRef.value
  const scene = sceneRef.value
  if (!back || !front || !scene) return

  const rect = scene.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  W = rect.width
  H = rect.height
  cx = W / 2
  cy = H / 2

  backCtx = initCanvas(back, dpr)
  frontCtx = initCanvas(front, dpr)
  seed()
}

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showUI.value = true
    settled.value = true
    // Set cards to final state
    ;[card3Ref, card2Ref, card1Ref].forEach((r, i) => {
      const el = r.value
      if (el) {
        el.style.transform = `translateZ(${cardDefs[i].baseZ}px)`
        el.style.opacity = `${cardDefs[i].opacity}`
      }
    })
    return
  }

  startTime = performance.now()
  setupCanvas()

  resizeObserver = new ResizeObserver(() => setupCanvas())
  if (sceneRef.value) resizeObserver.observe(sceneRef.value)

  tick()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <div class="hero-anim-3d">
    <div ref="sceneRef" class="ha-scene">
      <!-- Canvas BACK -->
      <canvas ref="backRef" class="ha-canvas ha-canvas-back" :class="{ visible: settled }" />

      <!-- Agent satellites -->
      <div class="ha-tag ha-tag-1" :class="{ visible: showUI }"><span>@builder</span></div>
      <div class="ha-tag ha-tag-2" :class="{ visible: showUI }"><span>@reviewer</span></div>
      <div class="ha-tag ha-tag-3" :class="{ visible: showUI }"><span>@doctor</span></div>

      <!-- Connection lines -->
      <svg class="ha-lines" :class="{ visible: showUI }" viewBox="0 0 300 300" fill="none">
        <line x1="72" y1="48" x2="115" y2="105" stroke="currentColor" stroke-width="0.5" opacity="0.12" stroke-dasharray="3 4"/>
        <line x1="260" y1="168" x2="195" y2="148" stroke="currentColor" stroke-width="0.5" opacity="0.12" stroke-dasharray="3 4"/>
        <line x1="64" y1="265" x2="118" y2="200" stroke="currentColor" stroke-width="0.5" opacity="0.12" stroke-dasharray="3 4"/>
      </svg>

      <!-- 3D diamond stack -->
      <div class="ha-stack" :class="{ floating: settled }">
        <div ref="card3Ref" class="ha-card ha-card-3">
          <span class="ha-label">Hooks</span>
        </div>
        <div ref="card2Ref" class="ha-card ha-card-2">
          <span class="ha-label">Skills</span>
        </div>
        <div ref="card1Ref" class="ha-card ha-card-1">
          <span class="ha-label">Agents</span>
          <div class="ha-card-highlight"></div>
        </div>
      </div>

      <!-- Canvas FRONT -->
      <canvas ref="frontRef" class="ha-canvas ha-canvas-front" :class="{ visible: settled }" />
    </div>
  </div>
</template>

<style scoped>
.hero-anim-3d {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ha-scene {
  position: relative;
  width: 300px;
  height: 300px;
  perspective: 1200px;
  perspective-origin: 50% 35%;
}

/* ── Canvases ── */
.ha-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1s ease;
}

.ha-canvas.visible { opacity: 1; }
.ha-canvas-back { z-index: 0; }
.ha-canvas-front { z-index: 5; }

/* ── 3D Stack ── */
.ha-stack {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 2;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-45deg);
}

.ha-stack.floating {
  animation: ha-stack-float 8s ease-in-out infinite;
}

/* Cards - JS controls transform & opacity */
.ha-card {
  position: absolute;
  width: 130px;
  height: 130px;
  left: -65px;
  top: -65px;
  border-radius: 16px;
  border: 1px solid rgba(74, 127, 207, 0.15);
  opacity: 0;
  will-change: transform, opacity;
}

.ha-card-3 {
  background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%);
}

.ha-card-2 {
  background: linear-gradient(135deg, #1E3A5F 0%, #2B5EA7 100%);
  border-color: rgba(74, 127, 207, 0.2);
}

.ha-card-1 {
  background: linear-gradient(135deg, #4A7FCF 0%, #CD7F32 100%);
  border-color: rgba(205, 127, 50, 0.25);
  box-shadow:
    0 0 30px rgba(74, 127, 207, 0.15),
    0 0 60px rgba(205, 127, 50, 0.08);
  overflow: hidden;
}

.dark .ha-card-1 {
  box-shadow:
    0 0 40px rgba(74, 127, 207, 0.25),
    0 0 80px rgba(205, 127, 50, 0.12);
}

/* Highlight on top layer */
.ha-card-highlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  border-radius: 16px 0 0 16px;
}

/* ── Layer labels ── */
.ha-label {
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

.ha-card-1 .ha-label {
  color: rgba(255, 255, 255, 0.75);
}

/* ── Stack float ── */
@keyframes ha-stack-float {
  0%, 100% {
    transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-45deg) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) rotateX(55deg) rotateZ(-45deg) translateY(-8px);
  }
}

/* ── Connection lines ── */
.ha-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  color: var(--vp-c-text-3);
  opacity: 0;
  transition: opacity 0.6s ease;
}

.ha-lines.visible { opacity: 1; }

/* ── Agent satellites ── */
.ha-tag {
  position: absolute;
  z-index: 6;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.ha-tag.visible { opacity: 1; }
.ha-tag-1.visible { transition-delay: 0s; }
.ha-tag-2.visible { transition-delay: 0.15s; }
.ha-tag-3.visible { transition-delay: 0.3s; }

.ha-tag span {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 11px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--vp-c-brand-1);
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dark .ha-tag span {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.ha-tag-1 {
  top: 10%;
  left: 2%;
  animation: ha-tag-float 5s ease-in-out infinite;
}

.ha-tag-2 {
  top: 50%;
  right: 0;
  animation: ha-tag-float 5s ease-in-out infinite 1.7s;
}

.ha-tag-3 {
  bottom: 6%;
  left: 3%;
  animation: ha-tag-float 5s ease-in-out infinite 3.3s;
}

@keyframes ha-tag-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ── Mobile: smaller scene ── */
@media (max-width: 640px) {
  .hero-anim-3d {
    margin-top: 0;
  }
  .ha-scene {
    width: 220px;
    height: 220px;
  }
  .ha-card {
    width: 100px;
    height: 100px;
    left: -50px;
    top: -50px;
    border-radius: 12px;
  }
  .ha-tag span {
    font-size: 10px;
    padding: 3px 8px;
  }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .ha-tag,
  .ha-lines,
  .ha-canvas {
    opacity: 1 !important;
    transition: none !important;
  }

  .ha-canvas { display: none; }

  .ha-tag { animation: none; }
}
</style>
