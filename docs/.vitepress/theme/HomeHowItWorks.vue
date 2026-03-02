<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isPtBR = computed(() => lang.value === 'pt-BR')

interface FlowStage {
  icon: string
  title: string
  content: string
}

interface FlowScenario {
  label: string
  stages: FlowStage[]
}

const scenariosEN: FlowScenario[] = [
  {
    label: 'Build Feature',
    stages: [
      { icon: '💬', title: 'Request', content: '"Create a products module with CRUD"' },
      { icon: '🔀', title: 'Dispatch', content: '@orchestrator → @builder' },
      { icon: '⚙️', title: 'Agent Work', content: 'types → service → components → tests' },
      { icon: '✅', title: 'Verified', content: '14/14 tests passing' },
    ],
  },
  {
    label: 'Code Review',
    stages: [
      { icon: '💬', title: 'Request', content: '"Review the auth module"' },
      { icon: '🔀', title: 'Dispatch', content: '@orchestrator → @reviewer' },
      { icon: '⚙️', title: 'Agent Work', content: 'spec compliance → quality → architecture' },
      { icon: '✅', title: 'Verified', content: '3 issues found, 2 auto-fixed' },
    ],
  },
  {
    label: 'Debug Issue',
    stages: [
      { icon: '💬', title: 'Request', content: '"Users report 500 on /api/orders"' },
      { icon: '🔀', title: 'Dispatch', content: '@orchestrator → @doctor' },
      { icon: '⚙️', title: 'Agent Work', content: 'reproduce → isolate → trace → fix' },
      { icon: '✅', title: 'Verified', content: 'Root cause fixed, regression test added' },
    ],
  },
]

const scenariosPTBR: FlowScenario[] = [
  {
    label: 'Criar Feature',
    stages: [
      { icon: '💬', title: 'Pedido', content: '"Crie um módulo de produtos com CRUD"' },
      { icon: '🔀', title: 'Despacho', content: '@orchestrator → @builder' },
      { icon: '⚙️', title: 'Agente', content: 'types → service → components → tests' },
      { icon: '✅', title: 'Verificado', content: '14/14 testes passando' },
    ],
  },
  {
    label: 'Code Review',
    stages: [
      { icon: '💬', title: 'Pedido', content: '"Revise o módulo de autenticação"' },
      { icon: '🔀', title: 'Despacho', content: '@orchestrator → @reviewer' },
      { icon: '⚙️', title: 'Agente', content: 'spec → qualidade → arquitetura' },
      { icon: '✅', title: 'Verificado', content: '3 problemas encontrados, 2 corrigidos' },
    ],
  },
  {
    label: 'Depurar Problema',
    stages: [
      { icon: '💬', title: 'Pedido', content: '"Usuários reportam 500 em /api/orders"' },
      { icon: '🔀', title: 'Despacho', content: '@orchestrator → @doctor' },
      { icon: '⚙️', title: 'Agente', content: 'reproduzir → isolar → rastrear → corrigir' },
      { icon: '✅', title: 'Verificado', content: 'Causa raiz corrigida, teste de regressão adicionado' },
    ],
  },
]

const scenarios = computed(() => isPtBR.value ? scenariosPTBR : scenariosEN)

const SCENARIO_DURATION = 8000
const STAGE_DELAY = 1000

const activeScenario = ref(0)
const activeStage = ref(-1)
const isPaused = ref(false)
const reducedMotion = ref(false)
const progressKey = ref(0)

let cycleTimer: ReturnType<typeof setInterval> | null = null
let stageTimers: ReturnType<typeof setTimeout>[] = []

const currentScenario = computed(() => scenarios.value[activeScenario.value])

function clearStageTimers() {
  stageTimers.forEach(t => clearTimeout(t))
  stageTimers = []
}

function activateStages() {
  clearStageTimers()
  activeStage.value = -1

  if (reducedMotion.value) {
    activeStage.value = 3
    return
  }

  for (let i = 0; i < 4; i++) {
    const t = setTimeout(() => {
      activeStage.value = i
    }, i * STAGE_DELAY)
    stageTimers.push(t)
  }
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

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reducedMotion.value) {
    startCycle()
  } else {
    activeStage.value = 3
  }
})

onUnmounted(() => {
  if (cycleTimer) clearInterval(cycleTimer)
  clearStageTimers()
})
</script>

<template>
  <section class="home-section">
    <h2 class="home-section-title">{{ isPtBR ? 'Como Funciona' : 'How It Works' }}</h2>
    <p class="home-section-subtitle">{{ isPtBR ? 'Descreva sua intenção. O agente certo cuida do resto.' : 'Describe your intent. The right agent handles the rest.' }}</p>

    <div class="flow-tabs">
      <button
        v-for="(scenario, i) in scenarios"
        :key="scenario.label"
        class="flow-tab"
        :class="{ active: activeScenario === i }"
        @click="selectScenario(i)"
      >
        {{ scenario.label }}
      </button>
    </div>

    <div
      class="flow-pipeline"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <template v-for="(stage, i) in currentScenario.stages" :key="`${activeScenario}-stage-${i}`">
        <div
          class="flow-stage"
          :class="{
            'flow-stage--active': activeStage >= i,
            'flow-stage--current': activeStage === i,
          }"
        >
          <div class="flow-stage-header">
            <span class="flow-stage-icon">{{ stage.icon }}</span>
            <span class="flow-stage-title">{{ stage.title }}</span>
          </div>
          <div class="flow-stage-content">
            <span class="flow-stage-text">{{ stage.content }}</span>
          </div>
        </div>

        <div
          v-if="i < 3"
          class="flow-connector"
          :class="{ active: activeStage > i }"
        >
          <div class="flow-dot" />
        </div>
      </template>
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
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.flow-tab {
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
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
}

.flow-tab.active {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft, rgba(43, 94, 167, 0.08));
}

/* === Pipeline === */
.flow-pipeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  max-width: 960px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .flow-pipeline {
    flex-direction: row;
    align-items: stretch;
  }
}

/* === Stage Cards === */
.flow-stage {
  flex: 1;
  padding: 20px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-align: center;
  opacity: 0.35;
  transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease, border-color 0.3s ease;
  min-width: 0;
}

@media (min-width: 768px) {
  .flow-stage {
    min-height: 130px;
  }
}

@media (max-width: 767px) {
  .flow-stage {
    width: 100%;
    max-width: 320px;
  }
}

.flow-stage--active {
  opacity: 1;
  transform: translateY(0);
}

.flow-stage--current {
  border-color: var(--vp-c-brand-1);
}

.flow-stage-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.flow-stage-icon {
  font-size: 20px;
  line-height: 1;
}

.flow-stage-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.flow-stage-content {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flow-stage-text {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-size: 12px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--vp-c-brand-1);
  line-height: 1.5;
  word-break: break-word;
}

/* === Connectors === */
.flow-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .flow-connector {
    width: 32px;
    height: auto;
  }
}

.flow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  opacity: 0;
  position: absolute;
}

@media (min-width: 768px) {
  .flow-dot {
    top: 50%;
    left: 0;
    margin-top: -3px;
  }
  .flow-connector.active .flow-dot {
    animation: dot-travel-h 0.8s ease forwards;
  }
}

@media (max-width: 767px) {
  .flow-dot {
    left: 50%;
    top: 0;
    margin-left: -3px;
  }
  .flow-connector.active .flow-dot {
    animation: dot-travel-v 0.8s ease forwards;
  }
}

@keyframes dot-travel-h {
  0% { transform: translateX(0); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateX(32px); opacity: 0; }
}

@keyframes dot-travel-v {
  0% { transform: translateY(0); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateY(28px); opacity: 0; }
}

/* === Progress Bar === */
.flow-progress {
  max-width: 960px;
  margin: 20px auto 0;
  height: 2px;
  border-radius: 1px;
  background: var(--vp-c-divider);
  overflow: hidden;
}

.flow-progress-bar {
  height: 100%;
  border-radius: 1px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--as-bronze, #CD7F32));
  animation: flow-progress 8s linear forwards;
}

@keyframes flow-progress {
  from { width: 0; }
  to { width: 100%; }
}

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {
  .flow-stage {
    opacity: 1;
    transform: none;
    transition: border-color 0.3s ease;
  }
  .flow-dot {
    display: none;
  }
  .flow-progress-bar {
    animation: none;
    width: 100%;
  }
}
</style>
