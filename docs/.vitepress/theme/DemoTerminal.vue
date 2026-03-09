<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isPtBr = computed(() => route.path.startsWith('/pt-BR'))

/* ── Types ── */
interface Line {
  text: string
  type: 'prompt' | 'output' | 'success' | 'dim' | 'agent' | 'highlight' | 'divider'
  delay?: number
}

interface SubScene {
  label: string
  labelPtBr: string
  lines: Line[]
}

/* ── Scene groups (one per card) ── */
const sceneGroups: SubScene[][] = [
  // 0: Setup
  [
    {
      label: 'Init',
      labelPtBr: 'Init',
      lines: [
        { text: '~/my-project ❯ npx specialist-agent init', type: 'prompt', delay: 60 },
        { text: '', type: 'output', delay: 300 },
        { text: '  Detecting project...', type: 'dim', delay: 400 },
        { text: '  ✓ Framework: Next.js 14', type: 'success', delay: 500 },
        { text: '  ✓ Package manager: pnpm', type: 'success', delay: 300 },
        { text: '  ✓ TypeScript: enabled', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Installing specialist-agent...', type: 'dim', delay: 600 },
        { text: '  ✓ 35 agents configured', type: 'success', delay: 400 },
        { text: '  ✓ 24 skills available', type: 'success', delay: 300 },
        { text: '  ✓ Next.js pack applied', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Ready! Try: Use @builder to create a module', type: 'highlight', delay: 0 },
      ],
    },
  ],
  // 1: Agents
  [
    {
      label: '@builder',
      labelPtBr: '@builder',
      lines: [
        { text: '> Use @builder to create the products module with CRUD', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  @builder activated', type: 'agent', delay: 300 },
        { text: '  ── Reading ARCHITECTURE.md...', type: 'dim', delay: 400 },
        { text: '  ── Applying Next.js patterns...', type: 'dim', delay: 400 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Created:', type: 'output', delay: 300 },
        { text: '    src/modules/products/products.service.ts', type: 'success', delay: 200 },
        { text: '    src/modules/products/products.controller.ts', type: 'success', delay: 200 },
        { text: '    src/modules/products/products.repository.ts', type: 'success', delay: 200 },
        { text: '    src/modules/products/dto/create-product.dto.ts', type: 'success', delay: 200 },
        { text: '    src/modules/products/__tests__/products.test.ts', type: 'success', delay: 200 },
        { text: '', type: 'output', delay: 200 },
        { text: '  ── @builder · ARCHITECTURE.md enforced', type: 'divider', delay: 0 },
      ],
    },
    {
      label: '@reviewer',
      labelPtBr: '@reviewer',
      lines: [
        { text: '> Use @reviewer to review src/modules/products/', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  @reviewer activated — 3-in-1 review', type: 'agent', delay: 400 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Quality ──────────────────────────', type: 'dim', delay: 300 },
        { text: '  ✓ SOLID principles: compliant', type: 'success', delay: 250 },
        { text: '  ✓ Error handling: proper', type: 'success', delay: 250 },
        { text: '  ⚠ products.service.ts:42 — extract method', type: 'highlight', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Security ─────────────────────────', type: 'dim', delay: 300 },
        { text: '  ✓ Input validation: DTO enforced', type: 'success', delay: 250 },
        { text: '  ✓ SQL injection: safe (parameterized)', type: 'success', delay: 250 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Architecture ─────────────────────', type: 'dim', delay: 300 },
        { text: '  ✓ Matches ARCHITECTURE.md patterns', type: 'success', delay: 250 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Score: 9.2/10 — 1 suggestion', type: 'highlight', delay: 0 },
      ],
    },
    {
      label: '@doctor',
      labelPtBr: '@doctor',
      lines: [
        { text: '> Use @doctor to investigate the checkout timeout', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  @doctor activated — 4-phase diagnosis', type: 'agent', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Phase 1: Symptoms', type: 'dim', delay: 400 },
        { text: '  ── Timeout at checkout.service.ts:156', type: 'output', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Phase 2: Hypotheses', type: 'dim', delay: 400 },
        { text: '  ── H1: N+1 query on cart items', type: 'output', delay: 250 },
        { text: '  ── H2: Missing DB index on user_id', type: 'output', delay: 250 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Phase 3: Evidence', type: 'dim', delay: 400 },
        { text: '  ✓ H1 confirmed — 47 queries per request', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Phase 4: Fix', type: 'dim', delay: 400 },
        { text: '  ✓ Added eager loading — 47 → 2 queries', type: 'success', delay: 300 },
        { text: '  ✓ Response time: 3.2s → 180ms', type: 'success', delay: 0 },
      ],
    },
  ],
  // 2: Skills
  [
    {
      label: '/tdd',
      labelPtBr: '/tdd',
      lines: [
        { text: '> /tdd create payment processing service', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  /tdd skill activated', type: 'agent', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Step 1: Write failing tests', type: 'dim', delay: 400 },
        { text: '  ✓ payment.service.test.ts — 8 test cases', type: 'success', delay: 300 },
        { text: '  ✗ 8 failing (expected)', type: 'highlight', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Step 2: Implement to pass', type: 'dim', delay: 400 },
        { text: '  ✓ payment.service.ts — complete', type: 'success', delay: 300 },
        { text: '  ✓ 8/8 tests passing', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Step 3: Refactor', type: 'dim', delay: 400 },
        { text: '  ✓ Extracted stripe adapter', type: 'success', delay: 250 },
        { text: '  ✓ 8/8 tests still passing', type: 'success', delay: 250 },
        { text: '', type: 'output', delay: 200 },
        { text: '  ── /tdd complete · Red → Green → Refactor', type: 'divider', delay: 0 },
      ],
    },
    {
      label: '/plan',
      labelPtBr: '/plan',
      lines: [
        { text: '> /plan add real-time notifications with WebSocket', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  /plan skill activated', type: 'agent', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Analyzing codebase...', type: 'dim', delay: 500 },
        { text: '  ✓ Identified 3 integration points', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Plan:', type: 'output', delay: 300 },
        { text: '  1. WebSocket gateway (notifications.gateway.ts)', type: 'output', delay: 200 },
        { text: '  2. Event emitter service (events.service.ts)', type: 'output', delay: 200 },
        { text: '  3. Client hook (useNotifications.ts)', type: 'output', delay: 200 },
        { text: '  4. DB: notifications table + migration', type: 'output', delay: 200 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Estimate: 4 files, ~320 lines', type: 'highlight', delay: 300 },
        { text: '  ── /plan complete · Ready for @builder', type: 'divider', delay: 0 },
      ],
    },
    {
      label: '/codereview',
      labelPtBr: '/codereview',
      lines: [
        { text: '> /codereview src/modules/orders/', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  /codereview — parallel multi-reviewer', type: 'agent', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Reviewer 1 (Quality): scanning...', type: 'dim', delay: 400 },
        { text: '  Reviewer 2 (Security): scanning...', type: 'dim', delay: 200 },
        { text: '  Reviewer 3 (Architecture): scanning...', type: 'dim', delay: 200 },
        { text: '', type: 'output', delay: 500 },
        { text: '  ✓ Quality: 2 issues (naming, complexity)', type: 'success', delay: 250 },
        { text: '  ✓ Security: 0 issues', type: 'success', delay: 250 },
        { text: '  ⚠ Architecture: 1 issue (circular dep)', type: 'highlight', delay: 250 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Overall: 3 findings, 1 blocker', type: 'highlight', delay: 0 },
      ],
    },
  ],
  // 3: Frameworks
  [
    {
      label: 'Migrate',
      labelPtBr: 'Migrar',
      lines: [
        { text: '> /migrate-framework from React to Vue 3', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  Migration plan generated', type: 'agent', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Scanning 47 components...', type: 'dim', delay: 500 },
        { text: '  ✓ useState → ref/reactive', type: 'success', delay: 250 },
        { text: '  ✓ useEffect → watchEffect', type: 'success', delay: 250 },
        { text: '  ✓ JSX → SFC templates', type: 'success', delay: 250 },
        { text: '  ✓ React Router → Vue Router', type: 'success', delay: 250 },
        { text: '  ✓ Context → native state management', type: 'success', delay: 250 },
        { text: '', type: 'output', delay: 200 },
        { text: '  47/47 components migrated', type: 'highlight', delay: 300 },
        { text: '  ✓ All 124 tests passing', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  ── Vue 3 pack applied · Migration complete', type: 'divider', delay: 0 },
      ],
    },
    {
      label: 'Detect',
      labelPtBr: 'Detectar',
      lines: [
        { text: '~/nuxt-app ❯ npx specialist-agent init', type: 'prompt', delay: 60 },
        { text: '', type: 'output', delay: 300 },
        { text: '  Detecting project...', type: 'dim', delay: 400 },
        { text: '  ✓ Framework: Nuxt 3', type: 'success', delay: 400 },
        { text: '  ✓ Pack: nuxt', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Nuxt-specific agents:', type: 'output', delay: 300 },
        { text: '    @builder — Nuxt modules, composables, pages', type: 'success', delay: 200 },
        { text: '    @reviewer — Nuxt conventions enforced', type: 'success', delay: 200 },
        { text: '    @doctor — Nitro, auto-imports, SSR issues', type: 'success', delay: 200 },
        { text: '    @migrator — Nuxt 2 → 3 migration', type: 'success', delay: 200 },
        { text: '', type: 'output', delay: 200 },
        { text: '  ── Nuxt pack ready', type: 'divider', delay: 0 },
      ],
    },
  ],
  // 4: Platforms
  [
    {
      label: 'Select',
      labelPtBr: 'Selecionar',
      lines: [
        { text: '~/my-project ❯ npx specialist-agent init', type: 'prompt', delay: 60 },
        { text: '', type: 'output', delay: 300 },
        { text: '  Select your platform:', type: 'dim', delay: 400 },
        { text: '  ● Claude Code   (recommended)', type: 'highlight', delay: 200 },
        { text: '    Cursor', type: 'output', delay: 150 },
        { text: '    VS Code', type: 'output', delay: 150 },
        { text: '    Windsurf', type: 'output', delay: 150 },
        { text: '    Codex', type: 'output', delay: 150 },
        { text: '    OpenCode', type: 'output', delay: 150 },
        { text: '', type: 'output', delay: 300 },
        { text: '  ✓ Claude Code selected', type: 'success', delay: 400 },
        { text: '  ✓ CLAUDE.md configured', type: 'success', delay: 300 },
        { text: '  ✓ Hooks installed', type: 'success', delay: 300 },
        { text: '  ✓ Native integration enabled', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  ── Ready on Claude Code', type: 'divider', delay: 0 },
      ],
    },
  ],
  // 5: Automation
  [
    {
      label: '@sentry-triage',
      labelPtBr: '@sentry-triage',
      lines: [
        { text: '> Use @sentry-triage to check errors from the last 24h', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  @sentry-triage activated', type: 'agent', delay: 300 },
        { text: '  ── Fetching Sentry issues (last 24h)...', type: 'dim', delay: 600 },
        { text: '  ── Cross-referencing with codebase...', type: 'dim', delay: 500 },
        { text: '', type: 'output', delay: 200 },
        { text: '  P0 — Critical (1)', type: 'highlight', delay: 300 },
        { text: '    TypeError: Cannot read property of undefined', type: 'output', delay: 200 },
        { text: '    → src/modules/auth/auth.service.ts:87', type: 'dim', delay: 200 },
        { text: '    → Fix PR created: #142', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  P1 — High (2)', type: 'highlight', delay: 300 },
        { text: '    RangeError: Maximum call stack exceeded', type: 'output', delay: 200 },
        { text: '    → Already fixed in PR #139', type: 'success', delay: 200 },
        { text: '', type: 'output', delay: 200 },
        { text: '  ── 1 fix PR created, 1 already resolved', type: 'divider', delay: 0 },
      ],
    },
    {
      label: '/autofix',
      labelPtBr: '/autofix',
      lines: [
        { text: '> /autofix from sentry --auto-pr', type: 'prompt', delay: 45 },
        { text: '', type: 'output', delay: 400 },
        { text: '  /autofix skill activated', type: 'agent', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Fetching top error...', type: 'dim', delay: 500 },
        { text: '  ── TypeError at auth.service.ts:87', type: 'output', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Analyzing root cause...', type: 'dim', delay: 500 },
        { text: '  ✓ Null check missing on user.profile', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  Generating fix...', type: 'dim', delay: 400 },
        { text: '  ✓ auth.service.ts — optional chaining added', type: 'success', delay: 250 },
        { text: '  ✓ auth.service.test.ts — edge case test added', type: 'success', delay: 250 },
        { text: '  ✓ All tests passing', type: 'success', delay: 300 },
        { text: '', type: 'output', delay: 200 },
        { text: '  ✓ PR #143 created: fix/null-check-user-profile', type: 'highlight', delay: 300 },
        { text: '  ── /autofix complete · PR ready for review', type: 'divider', delay: 0 },
      ],
    },
  ],
]

/* ── Props & emits ── */
const props = defineProps<{
  groupIndex?: number
}>()

const emit = defineEmits<{
  (e: 'groupChange', index: number): void
}>()

/* ── State ── */
const activeGroup = ref(0)
const activeTab = ref(0)
const renderedLines = ref<Line[]>([])
const typingText = ref('')
const isTyping = ref(false)
const sceneDone = ref(false)
const autoPlaying = ref(false)
const terminalRef = ref<HTMLElement | null>(null)

let timeoutId: ReturnType<typeof setTimeout> | null = null
let cancelled = false

const currentTabs = computed(() => sceneGroups[activeGroup.value] || [])

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    timeoutId = setTimeout(resolve, ms)
  })
}

async function typeText(text: string, speed: number) {
  typingText.value = ''
  isTyping.value = true
  for (let i = 0; i < text.length; i++) {
    if (cancelled) return
    typingText.value += text[i]
    await sleep(speed + Math.random() * 20)
  }
  isTyping.value = false
}

function scrollToBottom() {
  if (terminalRef.value) {
    const body = terminalRef.value.querySelector('.demo-body')
    if (body) body.scrollTop = body.scrollHeight
  }
}

async function renderScene(groupIdx: number, tabIdx: number) {
  if (cancelled) return
  activeGroup.value = groupIdx
  activeTab.value = tabIdx
  renderedLines.value = []
  typingText.value = ''
  sceneDone.value = false

  const group = sceneGroups[groupIdx]
  if (!group || !group[tabIdx]) return
  const scene = group[tabIdx]

  for (let i = 0; i < scene.lines.length; i++) {
    if (cancelled) return
    const line = scene.lines[i]

    if (line.type === 'prompt') {
      await typeText(line.text, line.delay || 50)
      renderedLines.value.push({ ...line, text: typingText.value })
      typingText.value = ''
    } else {
      await sleep(line.delay || 200)
      renderedLines.value.push(line)
    }
    scrollToBottom()
  }

  sceneDone.value = true
}

/* ── Manual navigation (click) ── */
function goToTab(tabIdx: number) {
  cancel()
  cancelled = false
  autoPlaying.value = false
  renderScene(activeGroup.value, tabIdx)
}

function goToGroup(groupIdx: number) {
  cancel()
  cancelled = false
  autoPlaying.value = false
  renderScene(groupIdx, 0)
}

/* ── Auto-play: render scene → wait 3s → next tab → next card ── */
async function autoPlay() {
  cancelled = false
  autoPlaying.value = true

  for (let g = 0; g < sceneGroups.length; g++) {
    if (cancelled) return
    const group = sceneGroups[g]
    emit('groupChange', g)

    for (let t = 0; t < group.length; t++) {
      if (cancelled) return
      await renderScene(g, t)
      if (cancelled) return
      await sleep(3000)
    }
  }

  // loop
  if (!cancelled) {
    await sleep(500)
    autoPlay()
  }
}

function cancel() {
  cancelled = true
  autoPlaying.value = false
  if (timeoutId) clearTimeout(timeoutId)
}

function toggleAutoPlay() {
  if (autoPlaying.value) {
    cancel()
  } else {
    autoPlay()
  }
}

// External group change (card click)
watch(() => props.groupIndex, (newIndex) => {
  if (newIndex != null && newIndex !== activeGroup.value) {
    goToGroup(newIndex)
  }
})

defineExpose({ goToGroup, cancel })

onMounted(() => {
  autoPlay()
})

onUnmounted(() => {
  cancel()
})
</script>

<template>
  <div ref="terminalRef" class="demo-terminal">
    <div class="demo-bar">
      <div class="demo-dots">
        <span class="demo-dot demo-dot-close" />
        <span class="demo-dot demo-dot-min" />
        <span class="demo-dot demo-dot-max" />
      </div>
      <div class="demo-title">specialist-agent</div>
      <button
        class="demo-play-btn"
        :title="autoPlaying ? 'Pause' : (isPtBr ? 'Reproduzir tudo' : 'Play all')"
        @click="toggleAutoPlay"
      >
        <svg v-if="autoPlaying" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </button>
    </div>

    <!-- Tabs -->
    <div v-if="currentTabs.length > 1" class="demo-tabs">
      <button
        v-for="(tab, i) in currentTabs"
        :key="i"
        class="demo-tab-btn"
        :class="{ active: activeTab === i }"
        @click="goToTab(i)"
      >
        {{ isPtBr ? tab.labelPtBr : tab.label }}
      </button>
    </div>

    <div class="demo-body">
      <div
        v-for="(line, i) in renderedLines"
        :key="i"
        class="demo-line"
        :class="'demo-line-' + line.type"
      >
{{ line.text }}
      </div>
      <div v-if="isTyping" class="demo-line demo-line-prompt">
        {{ typingText }}<span class="demo-cursor">▌</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-terminal {
  border-radius: 12px;
  overflow: hidden;
  background: #1a1b26;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    0 2px 8px rgba(0, 0, 0, 0.15);
}

.demo-bar {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #15161e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.demo-dots {
  display: flex;
  gap: 6px;
}

.demo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.demo-dot-close { background: #ff5f57; }
.demo-dot-min { background: #ffbd2e; }
.demo-dot-max { background: #28ca42; }

.demo-title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  font-family: var(--vp-font-family-base);
}

.demo-play-btn {
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

.demo-play-btn:hover {
  color: rgba(255, 255, 255, 0.7);
}

/* ── Tabs ── */
.demo-tabs {
  display: flex;
  gap: 0;
  padding: 0 14px;
  background: #15161e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.demo-tab-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: rgba(255, 255, 255, 0.3);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.demo-tab-btn:hover {
  color: rgba(255, 255, 255, 0.5);
}

.demo-tab-btn.active {
  color: #7aa2f7;
  border-bottom-color: #7aa2f7;
}

/* ── Body ── */
.demo-body {
  padding: 14px 16px 16px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 12.5px;
  line-height: 1.65;
  min-height: 300px;
  max-height: 380px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.demo-body::-webkit-scrollbar {
  width: 4px;
}

.demo-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.demo-line {
  white-space: pre-wrap;
  word-break: break-word;
}

.demo-line-prompt { color: #c0caf5; }
.demo-line-output { color: #a9b1d6; }
.demo-line-success { color: #9ece6a; }
.demo-line-dim { color: #565f89; }
.demo-line-agent { color: #7aa2f7; font-weight: 600; }
.demo-line-highlight { color: #e0af68; }

.demo-line-divider {
  color: #565f89;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 4px;
  padding-top: 4px;
}


.demo-cursor {
  color: #c0caf5;
  animation: demo-blink 1s step-end infinite;
}

@keyframes demo-blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

@media (max-width: 639px) {
  .demo-body {
    font-size: 11px;
    padding: 12px 14px 16px;
    min-height: 260px;
    max-height: 340px;
  }
  .demo-tab-btn {
    font-size: 11px;
    padding: 5px 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .demo-cursor {
    animation: none;
    opacity: 1;
  }
}
</style>
