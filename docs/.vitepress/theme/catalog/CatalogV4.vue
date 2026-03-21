<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog, formatContent, type CatalogItem } from './useCatalog'

const {
  data, isPtBR, t, catIcons,
  search, typeFilter, catFilter,
  selected, view, detailCopied,
  slideDir, transitionName,
  agentCount, skillCount, categories, filtered,
  catLabel, openDetail, goBack, copyCmd,
  getWorkflowPhases,
} = useCatalog()

function buildTerminalMeta(item: CatalogItem): string {
  const parts = [`$ ${item.displayName}`]
  parts.push(`--category ${item.category}`)
  parts.push(`--source ${item.source}`)
  if (item.tools.length) parts.push(`--tools ${item.tools.length}`)
  return parts.join(' ')
}

function buildAsciiTree(phases: { name: string; steps: string[] }[]): string {
  const lines: string[] = []
  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i]
    lines.push(`${i + 1}. ${phase.name}`)
    for (let j = 0; j < phase.steps.length; j++) {
      const isLast = j === phase.steps.length - 1
      const prefix = isLast ? '└── ' : '├── '
      lines.push(`   ${prefix}${phase.steps[j]}`)
    }
    if (i < phases.length - 1) {
      lines.push('       │')
    }
  }
  return lines.join('\n')
}

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
</script>

<template>
  <div class="ct">
    <!-- Version Navigation -->
        <nav class="version-nav">
      <a href="/catalog/v1" class="version-link">V1</a>
      <a href="/catalog/v2" class="version-link">V2</a>
      <a href="/catalog/v3" class="version-link">V3</a>
      <a href="/catalog/v4" class="version-link active">V4</a>
      <a href="/catalog/v5" class="version-link">V5</a>
      <a href="/catalog/v6" class="version-link">V6</a>
      <a href="/catalog/v7" class="version-link">V7</a>
      <a href="/catalog/v8" class="version-link">V8</a>
      <a href="/catalog/v9" class="version-link">V9</a>
      <a href="/catalog/v10" class="version-link">V10</a>
      <a href="/catalog" class="version-link">Current</a>
    </nav>

    <!-- Header -->
    <header class="ct-header">
      <div class="ct-header-inner">
        <div>
          <div class="ct-logo">
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
      <!-- LIST VIEW -->
      <div v-if="view === 'list'" key="list" class="ct-view">
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
            <button v-for="c in categories" :key="c" class="pill" :class="{ on: catFilter === c }" @click="catFilter = c">
              {{ catLabel(c) }}
            </button>
          </div>
        </div>

        <div class="ct-count">{{ t.showing }} <strong>{{ filtered.length }}</strong> {{ t.of }} {{ data.length }} {{ t.items }}</div>

        <div v-if="filtered.length" class="ct-grid">
          <article
            v-for="item in filtered"
            :key="`${item.type}-${item.name}`"
            class="card"
            :style="{ '--c': item.color }"
            @click="openDetail(item)"
          >
            <span class="card-name">{{ item.displayName }}</span>
            <span class="card-desc">{{ item.description }}</span>
            <span class="card-meta">[{{ catLabel(item.category) }}] by {{ item.author }}<template v-if="item.tools.length"> ({{ item.tools.length }} tools)</template></span>
          </article>
        </div>
        <div v-else class="ct-empty">
          <p class="ct-empty-msg">{{ t.noResults }}</p>
          <p class="ct-empty-sub">{{ t.tryOther }}</p>
          <button class="pill on" @click="search = ''; typeFilter = 'all'; catFilter = 'all'">{{ t.clear }}</button>
        </div>
      </div>

      <!-- DETAIL VIEW -->
      <div v-else-if="view === 'detail' && selected" key="detail" class="ct-view ct-detail" :style="{ '--c': selected.color }">
        <span class="dt-back" @click="goBack">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {{ t.back }}
        </span>

        <div class="dt-container">
          <!-- Title -->
          <h1 class="dt-title">{{ selected.displayName }}</h1>

          <!-- Terminal prompt meta -->
          <div class="dt-terminal-meta">
            <code>{{ buildTerminalMeta(selected) }}</code>
          </div>

          <!-- Command box -->
          <div class="dt-cmd-box">
            <span class="dt-cmd-prompt">$</span>
            <code class="dt-cmd-text">{{ selected.copyCommand }}</code>
            <button class="dt-cmd-copy" :class="{ ok: detailCopied }" @click="copyCmd">
              <svg v-if="!detailCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </div>

          <!-- Description -->
          <p class="dt-desc">{{ selected.description }}</p>

          <!-- Metadata table with dot leaders -->
          <div class="dt-meta-table">
            <div v-for="row in metaRows" :key="row.key" class="dt-meta-row">
              <span class="dt-meta-key">{{ row.key }}</span>
              <span class="dt-meta-dots" />
              <span class="dt-meta-val">{{ row.val }}</span>
            </div>
          </div>

          <!-- Tools as bracket notation -->
          <div v-if="selected.tools.length" class="dt-section">
            <h2 class="dt-section-title"><span class="dt-hash">## </span>{{ t.tools }}</h2>
            <div class="dt-tools-row">
              <span v-for="tool in selected.tools" :key="tool" class="dt-tool">[{{ tool }}]</span>
            </div>
          </div>

          <!-- Workflow as ASCII tree -->
          <section v-if="getWorkflowPhases(selected).length" class="dt-section">
            <h2 class="dt-section-title"><span class="dt-hash">## </span>{{ t.workflow }}</h2>
            <pre class="dt-ascii-tree" :style="{ '--c': selected.color }">{{ buildAsciiTree(getWorkflowPhases(selected)) }}</pre>
          </section>

          <!-- Content sections -->
          <section v-for="sec in selected.sections.filter(s => !s.title.toLowerCase().includes('workflow'))" :key="sec.title" class="dt-section">
            <h2 class="dt-section-title"><span class="dt-hash">## </span>{{ sec.title }}</h2>
            <div class="dt-prose" v-html="formatContent(sec.content)"></div>
          </section>

          <!-- Usage tip -->
          <section class="dt-section">
            <h2 class="dt-section-title"><span class="dt-hash">## </span>{{ t.tip }}</h2>
            <div class="dt-tip">
              <code v-if="selected.type === 'agent'">{{ isPtBR ? `Use "${selected.copyCommand}" seguido de uma descrição da tarefa.` : `Use "${selected.copyCommand}" followed by a task description.` }}</code>
              <code v-else>{{ isPtBR ? `Execute "${selected.copyCommand}" na sua IDE para iniciar.` : `Run "${selected.copyCommand}" in your IDE to get started.` }}</code>
            </div>
          </section>

          <!-- Tags -->
          <div v-if="selected.tags.length" class="dt-section">
            <h2 class="dt-section-title"><span class="dt-hash">## </span>Tags</h2>
            <div class="dt-tools-row">
              <span v-for="tag in selected.tags" :key="tag" class="dt-tool">[{{ tag }}]</span>
            </div>
          </div>

          <!-- Source link -->
          <a :href="selected.sourceUrl" target="_blank" rel="noopener" class="dt-source-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            {{ t.viewSource }}
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ═══ VERSION NAV ═══ */
.version-nav {
  display: flex; align-items: center; gap: 4px; padding: 8px 0; margin-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.version-link {
  padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;
  color: var(--vp-c-text-3); text-decoration: none; transition: all .15s;
  font-family: var(--vp-font-family-mono);
}
.version-link:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }
.version-link.active { background: var(--vp-c-brand-1); color: #fff; }

/* ═══ LAYOUT ═══ */
.ct { max-width: 1120px; margin: 0 auto; padding: 0 24px 64px; min-height: 80vh; overflow: hidden; }

/* ═══ HEADER ═══ */
.ct-header { padding: 32px 0 24px; }
.ct-header-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.ct-logo { display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px; }
.ct-logo-prompt { font-family: var(--vp-font-family-mono); font-size: 22px; font-weight: 700; color: var(--vp-c-brand-1); }
.ct-logo-text { font-family: var(--vp-font-family-mono); font-size: 26px; font-weight: 800; color: var(--vp-c-text-1); letter-spacing: -.02em; }
.ct-logo-cursor { font-family: var(--vp-font-family-mono); font-size: 26px; font-weight: 300; color: var(--vp-c-brand-1); animation: blink 1s step-end infinite; }
.ct-subtitle { font-size: 13px; color: var(--vp-c-text-2); margin: 0; line-height: 1.5; font-family: var(--vp-font-family-mono); }
.ct-stats {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--vp-font-family-mono); font-size: 13px; font-weight: 600; color: var(--vp-c-text-2);
}
.ct-stat-item { color: var(--vp-c-text-1); }
.ct-stat-sep { color: var(--vp-c-text-3); }

/* ═══ TRANSITIONS ═══ */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease;
}
.slide-left-enter-from { transform: translateX(40px); opacity: 0; }
.slide-left-leave-to { transform: translateX(-40px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-40px); opacity: 0; }
.slide-right-leave-to { transform: translateX(40px); opacity: 0; }
.ct-view { width: 100%; }

/* ═══ TOOLBAR ═══ */
.ct-toolbar { margin-bottom: 14px; display: flex; flex-direction: column; gap: 10px; }
.ct-search-box {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  border: 1px solid var(--vp-c-divider); border-radius: 6px;
  background: var(--vp-c-bg); color: var(--vp-c-text-3);
}
.ct-search-prompt { font-family: var(--vp-font-family-mono); font-weight: 700; color: var(--vp-c-brand-1); font-size: 14px; }
.ct-search-box input {
  flex: 1; border: none; background: none; outline: none;
  font-size: 13px; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono);
}
.ct-search-box input::placeholder { color: var(--vp-c-text-3); }
.ct-search-box:focus-within { border-color: var(--vp-c-brand-1); }
.ct-pills { display: flex; gap: 4px; flex-wrap: wrap; }
.pill {
  display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
  border: 1px solid var(--vp-c-divider); border-radius: 4px;
  background: var(--vp-c-bg); color: var(--vp-c-text-2);
  font-size: 11px; font-weight: 600; font-family: var(--vp-font-family-mono);
  cursor: pointer; white-space: nowrap; transition: all .15s; line-height: 1;
}
.pill:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.pill.on { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); color: #fff; }
.pill-sep {
  color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); align-self: center;
  margin: 0 2px; font-size: 12px;
}
.ct-count { font-size: 11px; color: var(--vp-c-text-3); margin-bottom: 14px; font-family: var(--vp-font-family-mono); }

/* ═══ GRID ═══ */
.ct-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

/* ═══ CARD — Terminal style ═══ */
.card {
  padding: 14px 16px; border-radius: 6px; overflow: hidden;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--c);
  cursor: pointer; display: flex; flex-direction: column; gap: 4px;
  transition: background .15s ease, border-left-width .15s ease;
}
.card:hover {
  background: var(--vp-c-bg-soft);
  border-left-width: 4px;
}

.card-name {
  font-family: var(--vp-font-family-mono); font-size: 14px; font-weight: 700;
  color: var(--c);
}
.card-desc {
  font-family: var(--vp-font-family-mono); font-size: 12px; color: var(--vp-c-text-2);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.card-meta {
  font-family: var(--vp-font-family-mono); font-size: 10px; color: var(--vp-c-text-3);
}

/* ═══ EMPTY ═══ */
.ct-empty { text-align: center; padding: 48px 24px; color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); }
.ct-empty-msg { margin: 0 0 6px; }
.ct-empty-sub { font-size: 12px; color: var(--vp-c-text-3); margin: 0 0 16px; }

/* ═══════════════════════════════════════════ */
/* ═══ DETAIL VIEW — Terminal ═══ */
/* ═══════════════════════════════════════════ */
.dt-back {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
  cursor: pointer; color: var(--vp-c-text-3); margin: 8px 0 20px;
  transition: color .15s; font-size: 12px; font-weight: 600; border-radius: 4px;
  font-family: var(--vp-font-family-mono);
}
.dt-back:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }

.dt-container { max-width: 800px; }

/* Title */
.dt-title {
  font-family: var(--vp-font-family-mono); font-size: 24px; font-weight: 700;
  color: var(--c); margin: 0 0 12px;
}

/* Terminal meta line */
.dt-terminal-meta {
  padding: 10px 16px; border-radius: 6px; margin-bottom: 16px;
  background: var(--vp-code-block-bg, #1a1a2e); overflow-x: auto;
}
.dt-terminal-meta code {
  font-family: var(--vp-font-family-mono); font-size: 13px; color: #a0aec0;
  white-space: nowrap;
}

/* Command box */
.dt-cmd-box {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;
  background: var(--vp-code-block-bg, #1a1a2e); position: relative;
}
.dt-cmd-prompt { font-family: var(--vp-font-family-mono); font-weight: 700; color: #10b981; font-size: 15px; }
.dt-cmd-text { font-family: var(--vp-font-family-mono); font-size: 15px; color: #e2e8f0; flex: 1; }
.dt-cmd-copy {
  width: 30px; height: 30px; border-radius: 4px; border: none;
  background: transparent; color: #a0aec0; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.dt-cmd-copy:hover { color: #e2e8f0; background: rgba(255,255,255,0.08); }
.dt-cmd-copy.ok { color: #10b981; }

/* Description */
.dt-desc {
  font-size: 14px; line-height: 1.7; color: var(--vp-c-text-2); margin: 0 0 24px;
  font-family: var(--vp-font-family-mono);
}

/* Meta table with dot leaders */
.dt-meta-table {
  padding: 14px 16px; border-radius: 6px; margin-bottom: 24px;
  background: var(--vp-c-default-soft);
}
.dt-meta-row {
  display: flex; align-items: baseline; gap: 0;
  font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 2;
}
.dt-meta-key { color: var(--vp-c-text-3); white-space: nowrap; }
.dt-meta-dots {
  flex: 1; border-bottom: 1px dotted var(--vp-c-divider); margin: 0 8px;
  min-width: 20px; align-self: baseline; position: relative; top: -4px;
}
.dt-meta-val { color: var(--vp-c-text-1); font-weight: 600; white-space: nowrap; }

/* Sections */
.dt-section { margin-bottom: 28px; }
.dt-section-title {
  display: flex; align-items: center; gap: 0;
  font-family: var(--vp-font-family-mono); font-size: 15px; font-weight: 700;
  color: var(--vp-c-text-1); margin: 0 0 12px;
}
.dt-hash { color: var(--vp-c-text-3); font-weight: 400; }

/* Tools bracket notation */
.dt-tools-row {
  display: flex; flex-wrap: wrap; gap: 6px;
  font-family: var(--vp-font-family-mono);
}
.dt-tool {
  font-size: 12px; color: var(--vp-c-text-2); font-weight: 500;
  padding: 3px 0;
}

/* ASCII tree workflow */
.dt-ascii-tree {
  font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.7;
  color: var(--vp-c-text-2); margin: 0; padding: 16px; border-radius: 6px;
  background: var(--vp-c-default-soft); overflow-x: auto; white-space: pre;
}

/* Prose */
.dt-prose { font-size: 13px; line-height: 1.7; color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); }
.dt-prose :deep(.fc-h3) { font-weight: 700; color: var(--vp-c-text-1); margin: 12px 0 4px; font-size: 13px; }
.dt-prose :deep(.fc-li) { display: flex; align-items: baseline; gap: 6px; margin: 2px 0; }
.dt-prose :deep(.fc-num) { font-weight: 600; color: var(--vp-c-text-3); min-width: 18px; }
.dt-prose :deep(.fc-dot) { width: 4px; height: 4px; border-radius: 50%; background: var(--vp-c-text-3); flex-shrink: 0; margin-top: 7px; }
.dt-prose :deep(strong) { color: var(--vp-c-text-1); }

/* Tip */
.dt-tip code {
  display: block; padding: 12px 16px; border-radius: 6px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-2);
  font-size: 13px; font-family: var(--vp-font-family-mono); line-height: 1.5;
}

/* Source link */
.dt-source-link {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
  font-family: var(--vp-font-family-mono); font-size: 13px; font-weight: 600;
  color: var(--vp-c-text-3); text-decoration: none; transition: color .15s;
}
.dt-source-link:hover { color: var(--vp-c-brand-1); }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 960px) {
  .ct-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .ct-header-inner { flex-direction: column; align-items: flex-start; }
  .ct-header { padding: 28px 0 20px; }
  .ct-grid { grid-template-columns: 1fr; }
  .dt-title { font-size: 20px; }
}

@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .slide-left-enter-active, .slide-left-leave-active,
  .slide-right-enter-active, .slide-right-leave-active { transition: none; }
  .ct-logo-cursor { animation: none; }
}
</style>
