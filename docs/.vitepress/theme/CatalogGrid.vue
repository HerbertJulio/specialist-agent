<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useData } from 'vitepress'
import { data } from '../../catalog.data'
import type { CatalogItem } from '../../catalog.data'
import { formatContent, formatInline } from './catalog/formatContent'

const { lang } = useData()
const isPtBR = computed(() => lang.value === 'pt-BR')

const t = computed(() => isPtBR.value ? {
  subtitle: 'Navegue e descubra agentes e skills. Copie o comando e use na sua IDE.',
  search: 'Buscar agentes e skills...', all: 'Todos', agents: 'Agentes', skills: 'Skills',
  showing: 'Mostrando', of: 'de', items: 'itens',
  noResults: 'Nenhum resultado', tryOther: 'Tente outra busca ou limpe os filtros.',
  clear: 'Limpar', back: 'Voltar', command: 'Comando', copy: 'Copiar', copied: 'Copiado!',
  tip: 'Dica de uso', workflow: 'Fluxo de Trabalho',
  category: 'Categoria', type: 'Tipo', author: 'Autor', source: 'Fonte', tools: 'Ferramentas',
  official: 'Oficial', community: 'Comunidade', agent: 'Agente', skill: 'Skill',
  viewSource: 'Ver código-fonte',
  core: 'Core', wf: 'Workflow', specialist: 'Especialista', business: 'Negócios',
  automation: 'Automação', support: 'Suporte', planning: 'Planejamento',
  development: 'Desenvolvimento', quality: 'Qualidade', migration: 'Migração', knowledge: 'Conhecimento',
  contribute: 'Contribuir', submitAgent: 'Submeter Agente', submitSkill: 'Submeter Skill',
} : {
  subtitle: 'Browse and discover agents and skills. Copy the command and use it in your IDE.',
  search: 'Search agents and skills...', all: 'All', agents: 'Agents', skills: 'Skills',
  showing: 'Showing', of: 'of', items: 'items',
  noResults: 'No results found', tryOther: 'Try a different search or clear filters.',
  clear: 'Clear', back: 'Back', command: 'Command', copy: 'Copy', copied: 'Copied!',
  tip: 'Usage tip', workflow: 'Workflow',
  category: 'Category', type: 'Type', author: 'Author', source: 'Source', tools: 'Tools',
  official: 'Official', community: 'Community', agent: 'Agent', skill: 'Skill',
  viewSource: 'View source code',
  core: 'Core', wf: 'Workflow', specialist: 'Specialist', business: 'Business',
  automation: 'Automation', support: 'Support', planning: 'Planning',
  development: 'Development', quality: 'Quality', migration: 'Migration', knowledge: 'Knowledge',
  contribute: 'Contribute', submitAgent: 'Submit Agent', submitSkill: 'Submit Skill',
})

const catIcons: Record<string, string> = {
  core: '<path d="M12 2L2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  workflow: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  specialist: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  business: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  automation: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>',
  support: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  planning: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  development: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  quality: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  migration: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  knowledge: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
}

const search = ref('')
const typeFilter = ref('all')
const catFilter = ref('all')
const selected = ref<CatalogItem | null>(null)
const view = ref<'list' | 'detail'>('list')
const detailCopied = ref(false)
const slideDir = ref<'forward' | 'back'>('forward')
const transitionName = computed(() => slideDir.value === 'forward' ? 'slide-left' : 'slide-right')

const agentCount = computed(() => data.filter(i => i.type === 'agent').length)
const skillCount = computed(() => data.filter(i => i.type === 'skill').length)
const categories = computed(() => Array.from(new Set(data.map(i => i.category))).sort())
const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return data.filter(i => {
    if (typeFilter.value !== 'all' && i.type !== typeFilter.value) return false
    if (catFilter.value !== 'all' && i.category !== catFilter.value) return false
    if (q) return i.name.includes(q) || i.description.toLowerCase().includes(q) || i.displayName.includes(q) || i.tags.some(t => t.includes(q))
    return true
  })
})

const metaRows = computed(() => {
  if (!selected.value) return []
  const item = selected.value
  return [
    { key: t.value.type, val: item.type === 'agent' ? t.value.agent : t.value.skill },
    { key: t.value.category, val: catLabel(item.category) },
    { key: t.value.author, val: item.author },
    { key: t.value.source, val: item.source === 'official' ? t.value.official : t.value.community },
  ]
})

function catLabel(c: string) {
  const map: Record<string, string> = { workflow: t.value.wf }
  return map[c] || (t.value as any)[c] || c
}

function itemToHash(item: CatalogItem) { return `#${item.type}-${item.name}` }
function findItemByHash(hash: string): CatalogItem | null {
  if (!hash || hash === '#') return null
  const clean = hash.replace('#', '')
  const dashIdx = clean.indexOf('-')
  if (dashIdx === -1) return null
  return data.find(i => i.type === clean.slice(0, dashIdx) && i.name === clean.slice(dashIdx + 1)) || null
}
function syncFromHash() {
  if (typeof window === 'undefined') return
  const item = findItemByHash(window.location.hash)
  if (item) { selected.value = item; view.value = 'detail'; detailCopied.value = false }
  else if (view.value === 'detail') { view.value = 'list'; selected.value = null }
}

function openDetail(item: CatalogItem) {
  slideDir.value = 'forward'; selected.value = item; view.value = 'detail'; detailCopied.value = false
  if (typeof window !== 'undefined') history.pushState(null, '', itemToHash(item))
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
function goBack() {
  slideDir.value = 'back'; view.value = 'list'; selected.value = null
  if (typeof window !== 'undefined') history.pushState(null, '', window.location.pathname)
}
async function copyCmd() {
  if (!selected.value) return
  try { await navigator.clipboard.writeText(selected.value.copyCommand) }
  catch { const ta = document.createElement('textarea'); ta.value = selected.value!.copyCommand; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
  detailCopied.value = true; setTimeout(() => { detailCopied.value = false }, 2000)
}
const copiedCardId = ref('')
async function copyItemCmd(item: CatalogItem, event: Event) {
  event.stopPropagation()
  try { await navigator.clipboard.writeText(item.copyCommand) }
  catch { const ta = document.createElement('textarea'); ta.value = item.copyCommand; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
  copiedCardId.value = `${item.type}-${item.name}`
  setTimeout(() => { copiedCardId.value = '' }, 1500)
}

function getWorkflowPhases(item: CatalogItem): { name: string; steps: string[] }[] {
  const wfSection = item.sections.find(s => s.title.toLowerCase().includes('workflow'))
  if (!wfSection) return []
  const phases: { name: string; steps: string[] }[] = []
  let currentPhase = '', currentSteps: string[] = []
  for (const line of wfSection.content.split('\n')) {
    const pm = line.match(/^###\s+(.+)$/)
    if (pm) { if (currentPhase) phases.push({ name: currentPhase, steps: currentSteps }); currentPhase = pm[1].replace(/^(Phase|Step|Fase|Etapa)\s*\d+[:\s-]*/i, '').trim(); currentSteps = [] }
    else { const sm = line.match(/^\d+\.\s+(.+)$/); if (sm) currentSteps.push(sm[1].trim()) }
  }
  if (currentPhase) phases.push({ name: currentPhase, steps: currentSteps })
  return phases
}

function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && view.value !== 'list') goBack() }
onMounted(() => { syncFromHash(); window.addEventListener('hashchange', syncFromHash); window.addEventListener('popstate', syncFromHash); document.addEventListener('keydown', onKey) })
onUnmounted(() => { window.removeEventListener('hashchange', syncFromHash); window.removeEventListener('popstate', syncFromHash); document.removeEventListener('keydown', onKey) })
</script>

<template>
  <div class="ct">
    <!-- ═══ HEADER: V6 terminal + current animated gradient ═══ -->
    <header class="ct-header">
      <div class="ct-header-inner">
        <div>
          <div class="ct-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span class="ct-logo-prompt">$</span>
            <span class="ct-logo-text">{{ isPtBR ? 'catálogo' : 'catalog' }}</span>
            <span class="ct-logo-cursor">_</span>
          </div>
          <p class="ct-subtitle">{{ t.subtitle }}</p>
        </div>
        <div class="ct-stats">
          <span class="ct-stat-item">{{ agentCount }} {{ t.agents.toLowerCase() }}</span>
          <span class="ct-stat-sep">|</span>
          <span class="ct-stat-item">{{ skillCount }} {{ t.skills.toLowerCase() }}</span>
        </div>
      </div>
    </header>

    <Transition :name="transitionName" mode="out-in">
      <!-- ═══ LIST VIEW ═══ -->
      <div v-if="view === 'list'" key="list" class="ct-view">
        <!-- Toolbar: V6 terminal style -->
        <div class="ct-toolbar">
          <div class="ct-search-box">
            <span class="ct-search-prompt">$</span>
            <input v-model="search" type="text" :placeholder="t.search" />
          </div>
          <div class="ct-pills">
            <button class="pill" :class="{ on: typeFilter === 'all' }" @click="typeFilter = 'all'">{{ t.all }}</button>
            <button class="pill" :class="{ on: typeFilter === 'agent' }" @click="typeFilter = 'agent'">{{ t.agents }}</button>
            <button class="pill" :class="{ on: typeFilter === 'skill' }" @click="typeFilter = 'skill'">{{ t.skills }}</button>
            <span class="pill-sep">|</span>
            <button class="pill" :class="{ on: catFilter === 'all' }" @click="catFilter = 'all'">{{ t.all }}</button>
            <button v-for="c in categories" :key="c" class="pill" :class="{ on: catFilter === c }" @click="catFilter = c">{{ catLabel(c) }}</button>
          </div>
        </div>

        <div class="ct-count">{{ t.showing }} <strong>{{ filtered.length }}</strong> {{ t.of }} {{ data.length }} {{ t.items }}</div>

        <!-- Cards: V2 registry -->
        <div v-if="filtered.length" class="ct-grid">
          <article v-for="item in filtered" :key="`${item.type}-${item.name}`" class="card" :style="{ '--c': item.color }" @click="openDetail(item)">
            <div class="card-header">
              <div class="card-icon-wrap" :style="{ background: `color-mix(in srgb, ${item.color} 14%, var(--vp-c-bg))` }">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: item.color }"><g v-html="catIcons[item.category] || catIcons.core"></g></svg>
              </div>
              <span class="card-name">{{ item.displayName }}</span>
              <span :class="['type-badge', item.type]">{{ item.type }}</span>
              <button class="card-copy" :class="{ ok: copiedCardId === `${item.type}-${item.name}` }" @click="copyItemCmd(item, $event)" :title="t.copy">
                <svg v-if="copiedCardId !== `${item.type}-${item.name}`" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
            <p class="card-desc">{{ item.description }}</p>
            <div class="card-stats">
              <span class="stat"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g v-html="catIcons[item.category] || catIcons.core"></g></svg> {{ catLabel(item.category) }}</span>
              <span v-if="item.tools.length" class="stat">{{ item.tools.length }} tools</span>
              <span :class="['stat', 'source-dot', item.source]">{{ item.source === 'official' ? t.official : t.community }}</span>
            </div>
            <div v-if="item.tags.length" class="card-tags">
              <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
              <span v-if="item.tags.length > 3" class="tag tag-more">+{{ item.tags.length - 3 }}</span>
            </div>
          </article>
        </div>
        <div v-else class="ct-empty">
          <p>{{ t.noResults }}</p>
          <p class="ct-empty-sub">{{ t.tryOther }}</p>
          <button class="pill on" @click="search = ''; typeFilter = 'all'; catFilter = 'all'">{{ t.clear }}</button>
        </div>
      </div>

      <!-- ═══ DETAIL VIEW: V9 left-aligned hero ═══ -->
      <div v-else-if="view === 'detail' && selected" key="detail" class="ct-view" :style="{ '--c': selected.color }">
        <span class="dt-back" @click="goBack">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {{ t.back }}
        </span>

        <!-- Left-aligned gradient hero -->
        <div class="dt-hero">
          <div class="dt-hero-content">
            <div class="dt-hero-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g v-html="catIcons[selected.category] || catIcons.core"></g></svg>
            </div>
            <div class="dt-hero-info">
              <div class="dt-hero-title-row">
                <h1 class="dt-hero-title">{{ selected.displayName }}</h1>
                <button class="dt-title-copy" :class="{ ok: detailCopied }" @click="copyCmd" :title="detailCopied ? t.copied : t.copy">
                  <svg v-if="!detailCopied" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
              <div class="dt-hero-badges">
                <span :class="['dt-badge', selected.type]">{{ selected.type === 'agent' ? t.agent : t.skill }}</span>
                <span :class="['dt-badge', 'src', selected.source]">{{ selected.source === 'official' ? t.official : t.community }}</span>
                <span class="dt-badge cat">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="catIcons[selected.category] || ''"></svg>
                  {{ catLabel(selected.category) }}
                </span>
                <span v-if="selected.tools.length" class="dt-badge tools">{{ selected.tools.length }} {{ t.tools.toLowerCase() }}</span>
              </div>
              <p class="dt-hero-desc">{{ selected.description }}</p>
            </div>
          </div>
        </div>

        <!-- Two-column layout -->
        <div class="dt-layout">
          <main class="dt-main">
            <!-- Workflow: horizontal pipeline -->
            <section v-if="getWorkflowPhases(selected).length" class="dt-section">
              <h2 class="dt-section-title">{{ t.workflow }}</h2>
              <div class="dt-pipeline">
                <template v-for="(phase, idx) in getWorkflowPhases(selected)" :key="idx">
                  <div class="dt-pipe-phase">
                    <div class="dt-pipe-header">
                      <span class="dt-pipe-num">{{ idx + 1 }}</span>
                      <span class="dt-pipe-name" v-html="formatInline(phase.name)"></span>
                    </div>
                    <ul v-if="phase.steps.length" class="dt-pipe-steps">
                      <li v-for="step in phase.steps" :key="step" v-html="formatInline(step)"></li>
                    </ul>
                  </div>
                  <div v-if="idx < getWorkflowPhases(selected).length - 1" class="dt-pipe-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </template>
              </div>
            </section>

            <!-- Content sections -->
            <section v-for="sec in selected.sections.filter(s => !s.title.toLowerCase().includes('workflow'))" :key="sec.title" class="dt-section">
              <h2 class="dt-section-title">{{ sec.title }}</h2>
              <div class="dt-prose" v-html="formatContent(sec.content)"></div>
            </section>

            <!-- Usage tip -->
            <section class="dt-section">
              <h2 class="dt-section-title">{{ t.tip }}</h2>
              <div class="dt-tip">
                <code v-if="selected.type === 'agent'">{{ isPtBR ? `Use "${selected.copyCommand}" seguido de uma descrição da tarefa.` : `Use "${selected.copyCommand}" followed by a task description.` }}</code>
                <code v-else>{{ isPtBR ? `Execute "${selected.copyCommand}" na sua IDE para iniciar.` : `Run "${selected.copyCommand}" in your IDE to get started.` }}</code>
              </div>
            </section>
          </main>

          <!-- Sidebar -->
          <aside class="dt-sidebar">
            <div class="dt-meta-card">
              <div v-for="row in metaRows" :key="row.key" class="dt-meta-row">
                <span class="dt-meta-key">{{ row.key }}</span>
                <span class="dt-meta-val">{{ row.val }}</span>
              </div>
            </div>
            <div v-if="selected.tools.length" class="dt-tools-card">
              <h3 class="dt-tools-title">{{ t.tools }}</h3>
              <div class="dt-tools-list"><span v-for="tool in selected.tools" :key="tool" class="dt-tool">{{ tool }}</span></div>
            </div>
            <div v-if="selected.tags.length" class="dt-tools-card">
              <h3 class="dt-tools-title">Tags</h3>
              <div class="dt-tools-list"><span v-for="tag in selected.tags" :key="tag" class="dt-stag">{{ tag }}</span></div>
            </div>
            <a :href="selected.sourceUrl" target="_blank" rel="noopener" class="dt-github-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              {{ t.viewSource }}
            </a>
          </aside>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ═══ LAYOUT ═══ */
.ct { max-width: 1120px; margin: 0 auto; padding: 0 24px 64px; min-height: 80vh; overflow: hidden; }

/* ═══ HEADER: Terminal prompt + animated gradient title ═══ */
.ct-header { padding: 32px 0 24px; }
.ct-header-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.ct-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.ct-logo-prompt { font-family: var(--vp-font-family-mono); font-size: 22px; font-weight: 700; color: var(--vp-c-brand-1); }
.ct-logo-text {
  font-family: var(--vp-font-family-mono); font-size: 26px; font-weight: 800; letter-spacing: -.02em;
  background: var(--vp-home-hero-name-background, linear-gradient(135deg, #4A7FCF 0%, #CD7F32 40%, #2B5EA7 70%, #CD7F32 100%));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  background-size: 200% 100%; animation: ct-gradient 6s ease infinite;
}
.ct-logo-cursor { font-family: var(--vp-font-family-mono); font-size: 26px; font-weight: 300; color: var(--vp-c-brand-1); animation: blink 1s step-end infinite; }
.ct-subtitle { font-size: 13px; color: var(--vp-c-text-2); margin: 0; line-height: 1.5; font-family: var(--vp-font-family-mono); }
.ct-stats { display: flex; align-items: center; gap: 10px; font-family: var(--vp-font-family-mono); font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); }
.ct-stat-item { color: var(--vp-c-text-1); }
.ct-stat-sep { color: var(--vp-c-text-3); }

/* ═══ TRANSITIONS ═══ */
.slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active { transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease; }
.slide-left-enter-from { transform: translateX(40px); opacity: 0; }
.slide-left-leave-to { transform: translateX(-40px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-40px); opacity: 0; }
.slide-right-leave-to { transform: translateX(40px); opacity: 0; }
.ct-view { width: 100%; }

/* ═══ TOOLBAR: V6 terminal search + monospace pills ═══ */
.ct-toolbar { margin-bottom: 14px; display: flex; flex-direction: column; gap: 10px; }
.ct-search-box {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-3);
}
.ct-search-prompt { font-family: var(--vp-font-family-mono); font-weight: 700; color: var(--vp-c-brand-1); font-size: 14px; }
.ct-search-box input { flex: 1; border: none; background: none; outline: none; font-size: 13px; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); }
.ct-search-box input::placeholder { color: var(--vp-c-text-3); }
.ct-search-box:focus-within { border-color: var(--vp-c-brand-1); }
.ct-pills { display: flex; gap: 4px; flex-wrap: wrap; }
.pill {
  display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
  border: 1px solid var(--vp-c-divider); border-radius: 4px;
  background: var(--vp-c-bg); color: var(--vp-c-text-2); font-size: 11px; font-weight: 600;
  font-family: var(--vp-font-family-mono); cursor: pointer; white-space: nowrap; transition: all .15s; line-height: 1;
}
.pill:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.pill.on { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); color: #fff; }
.pill-sep { color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); align-self: center; margin: 0 2px; font-size: 12px; }
.ct-count { font-size: 11px; color: var(--vp-c-text-3); margin-bottom: 14px; font-family: var(--vp-font-family-mono); }

/* ═══ GRID: V2 registry cards ═══ */
.ct-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.card {
  padding: 16px 18px; background: var(--vp-c-bg-soft); border: 1px solid transparent; border-radius: 8px;
  cursor: pointer; transition: border-color .2s, box-shadow .2s; display: flex; flex-direction: column; gap: 8px;
}
.card:hover { border-color: var(--vp-c-divider); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.card-header { display: flex; align-items: center; gap: 8px; }
.card-icon-wrap { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.card-name { font-size: 14px; font-weight: 700; font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.type-badge { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }
.type-badge.agent { background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent); color: var(--vp-c-brand-1); }
.type-badge.skill { background: color-mix(in srgb, #CD7F32 12%, transparent); color: #CD7F32; }
.card-desc { font-size: 12px; color: var(--vp-c-text-2); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-stats { display: flex; align-items: center; gap: 10px; }
.stat { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; color: var(--vp-c-text-3); }
.source-dot::before { content: ''; width: 5px; height: 5px; border-radius: 50%; display: inline-block; margin-right: 2px; }
.source-dot.official::before { background: #22c55e; }
.source-dot.community::before { background: #CD7F32; }
.card-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: var(--vp-c-default-soft); color: var(--vp-c-text-3); }
.tag-more { font-weight: 600; color: var(--vp-c-text-2); }
.card-copy {
  width: 34px; height: 34px; border-radius: 8px; border: none;
  background: transparent; color: var(--vp-c-text-3); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: color .2s, transform .2s; flex-shrink: 0; margin-left: auto;
}
.card-copy:hover { color: var(--vp-c-brand-1); transform: scale(1.15); }
.card-copy.ok { color: #10b981; animation: copy-pop .4s cubic-bezier(.34,1.56,.64,1); }
@keyframes copy-pop {
  0% { transform: scale(0.6); opacity: 0; }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); opacity: 1; }
}

/* ═══ EMPTY ═══ */
.ct-empty { text-align: center; padding: 48px 24px; color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); }
.ct-empty p { margin: 0 0 6px; }
.ct-empty-sub { font-size: 12px; color: var(--vp-c-text-3); margin-bottom: 16px !important; }

/* ═══════════════════════════════════════════ */
/* ═══ DETAIL VIEW: V9 left-aligned hero ═══ */
/* ═══════════════════════════════════════════ */
.dt-back {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
  cursor: pointer; color: var(--vp-c-text-3); margin: 8px 0 20px;
  transition: color .15s; font-size: 13px; font-weight: 500; border-radius: 8px;
  font-family: var(--vp-font-family-mono);
}
.dt-back:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }

/* Left-aligned hero */
.dt-hero {
  padding: 32px 28px; border-radius: 16px; margin-bottom: 32px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 18%, var(--vp-c-bg-soft)), color-mix(in srgb, var(--c) 6%, var(--vp-c-bg-soft)));
}
.dt-hero-content { display: flex; align-items: flex-start; gap: 20px; }
.dt-hero-icon {
  flex-shrink: 0; width: 64px; height: 64px; border-radius: 16px;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.dt-hero-info { min-width: 0; }
.dt-hero-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.dt-hero-title { font-size: 28px; font-weight: 800; color: var(--vp-c-text-1); margin: 0; font-family: var(--vp-font-family-mono); }
.dt-title-copy {
  width: 38px; height: 38px; border-radius: 10px; border: none;
  background: transparent; color: var(--vp-c-text-3); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: color .2s, transform .2s; flex-shrink: 0; margin-left: auto;
}
.dt-title-copy:hover { color: var(--vp-c-brand-1); transform: scale(1.1); }
.dt-title-copy.ok { color: #10b981; animation: copy-pop .4s cubic-bezier(.34,1.56,.64,1); }
.dt-hero-badges { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
.dt-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: .4px; }
.dt-badge.agent { background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent); color: var(--vp-c-brand-1); }
.dt-badge.skill { background: color-mix(in srgb, #CD7F32 12%, transparent); color: #CD7F32; }
.dt-badge.src.official { background: rgba(34,197,94,.12); color: #22c55e; }
.dt-badge.src.community { background: rgba(205,127,50,.12); color: #CD7F32; }
.dt-badge.cat { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }
.dt-badge.tools { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); }
.dt-hero-desc { font-size: 14px; line-height: 1.6; color: var(--vp-c-text-2); margin: 0 0 14px; }


/* Two-column layout */
.dt-layout { display: grid; grid-template-columns: 1fr 260px; gap: 36px; }
.dt-main { min-width: 0; }

/* Sections */
.dt-section { margin-bottom: 28px; }
.dt-section-title { font-size: 16px; font-weight: 700; color: var(--vp-c-text-1); margin: 0 0 14px; padding-bottom: 8px; border-bottom: 1px solid var(--vp-c-divider); }

/* Horizontal pipeline workflow */
.dt-pipeline { display: flex; align-items: flex-start; gap: 0; overflow-x: auto; padding: 4px 0 8px; }
.dt-pipe-phase { flex: 1; min-width: 140px; max-width: 220px; padding: 12px 14px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.dt-pipe-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.dt-pipe-num { width: 22px; height: 22px; border-radius: 50%; background: var(--c); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dt-pipe-name { font-size: 12px; font-weight: 700; color: var(--vp-c-text-1); }
.dt-pipe-name :deep(.fc-code), .dt-pipe-steps :deep(.fc-code) {
  font-family: var(--vp-font-family-mono); font-size: 11px;
  background: var(--vp-c-default-soft); padding: 1px 4px; border-radius: 3px; color: var(--vp-c-text-1);
}
.dt-pipe-name :deep(strong), .dt-pipe-steps :deep(strong) { color: var(--vp-c-text-1); }
.dt-pipe-steps :deep(.fc-link) { color: var(--vp-c-brand-1); text-decoration: none; }
.dt-pipe-steps :deep(.fc-link:hover) { text-decoration: underline; }
.dt-pipe-steps { margin: 0; padding: 0 0 0 12px; list-style: none; }
.dt-pipe-steps li { font-size: 11px; color: var(--vp-c-text-2); line-height: 1.5; position: relative; padding-left: 10px; }
.dt-pipe-steps li::before { content: ''; position: absolute; left: 0; top: 6px; width: 3px; height: 3px; border-radius: 50%; background: color-mix(in srgb, var(--c) 50%, var(--vp-c-text-3)); }
.dt-pipe-arrow { display: flex; align-items: center; justify-content: center; padding: 0 4px; flex-shrink: 0; align-self: center; opacity: .6; }

/* Prose */
.dt-prose { font-size: 13px; line-height: 1.7; color: var(--vp-c-text-2); }
.dt-prose :deep(.fc-h3) { font-weight: 700; color: var(--vp-c-text-1); margin: 14px 0 6px; font-size: 14px; }
.dt-prose :deep(.fc-li) { display: flex; align-items: baseline; gap: 6px; margin: 3px 0; }
.dt-prose :deep(.fc-num) { font-weight: 600; color: var(--vp-c-text-3); min-width: 18px; }
.dt-prose :deep(.fc-dot) { width: 4px; height: 4px; border-radius: 50%; background: var(--vp-c-text-3); flex-shrink: 0; margin-top: 7px; }
.dt-prose :deep(strong) { color: var(--vp-c-text-1); }
.dt-prose :deep(.fc-code) {
  font-family: var(--vp-font-family-mono); font-size: 12px;
  background: var(--vp-c-default-soft); padding: 2px 6px; border-radius: 4px; color: var(--vp-c-text-1);
}
.dt-prose :deep(.fc-link) { color: var(--vp-c-brand-1); text-decoration: none; font-weight: 500; }
.dt-prose :deep(.fc-link:hover) { text-decoration: underline; }
.dt-prose :deep(.fc-table-row) {
  display: flex; gap: 4px; padding: 4px 0; border-bottom: 1px solid var(--vp-c-divider);
}
.dt-prose :deep(.fc-table-row:last-child) { border-bottom: none; }
.dt-prose :deep(.fc-cell) {
  flex: 1; font-size: 12px; padding: 2px 6px;
}

/* Tip */
.dt-tip code { display: block; padding: 14px 18px; border-radius: 10px; background: var(--vp-c-default-soft); color: var(--vp-c-text-2); font-size: 14px; font-family: var(--vp-font-family-mono); line-height: 1.5; }

/* Sidebar */
.dt-sidebar { position: sticky; top: 80px; align-self: start; display: flex; flex-direction: column; gap: 14px; }
.dt-meta-card { border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden; border-left: 3px solid var(--c); }
.dt-meta-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--vp-c-divider); font-size: 12px; }
.dt-meta-row:last-child { border-bottom: none; }
.dt-meta-key { color: var(--vp-c-text-3); font-weight: 500; }
.dt-meta-val { color: var(--vp-c-text-1); font-weight: 600; }
.dt-tools-card { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: 14px; }
.dt-tools-title { font-size: 11px; font-weight: 700; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: .5px; margin: 0 0 8px; }
.dt-tools-list { display: flex; flex-wrap: wrap; gap: 4px; }
.dt-tool { font-size: 11px; padding: 3px 8px; border-radius: 5px; background: var(--vp-c-default-soft); color: var(--vp-c-text-2); font-weight: 500; font-family: var(--vp-font-family-mono); }
.dt-stag { font-size: 11px; padding: 3px 8px; border-radius: 5px; background: color-mix(in srgb, var(--c) 8%, var(--vp-c-bg-soft)); color: var(--vp-c-text-2); font-weight: 500; }
.dt-github-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px; border-radius: 10px; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: 13px; font-weight: 600;
  text-decoration: none; transition: all .15s;
}
.dt-github-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 960px) {
  .ct-grid { grid-template-columns: repeat(2, 1fr); }
  .dt-layout { grid-template-columns: 1fr; }
  .dt-sidebar { position: static; flex-direction: row; flex-wrap: wrap; gap: 10px; }
  .dt-meta-card, .dt-tools-card { flex: 1; min-width: 200px; }
  .dt-pipeline { flex-wrap: wrap; gap: 8px; }
  .dt-pipe-arrow { transform: rotate(90deg); }
}
@media (max-width: 640px) {
  .ct-header-inner { flex-direction: column; align-items: flex-start; }
  .ct-header { padding: 28px 0 20px; }
  .ct-grid { grid-template-columns: 1fr; }
  .dt-hero-content { flex-direction: column; }
  .dt-hero-title { font-size: 22px; }
  .dt-hero-cmd { flex-direction: column; gap: 8px; padding: 10px; border-radius: 10px; }
  .dt-pipeline { flex-direction: column; }
  .dt-pipe-phase { max-width: none; }
  .dt-pipe-arrow { transform: rotate(90deg); }
}

@keyframes ct-gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active { transition: none; }
  .ct-logo-text { animation: none; }
  .ct-logo-cursor { animation: none; }
}
</style>
