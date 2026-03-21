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

async function copyItemCmd(item: CatalogItem, event: Event) {
  event.stopPropagation()
  try { await navigator.clipboard.writeText(item.copyCommand) }
  catch { const ta = document.createElement('textarea'); ta.value = item.copyCommand; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
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
  <div class="fg">
    <!-- Version Navigation -->
    <nav class="version-nav">
      <a href="/catalog/v1" class="version-link">V1</a>
      <a href="/catalog/v2" class="version-link">V2</a>
      <a href="/catalog/v3" class="version-link">V3</a>
      <a href="/catalog/v4" class="version-link">V4</a>
      <a href="/catalog/v5" class="version-link">V5</a>
      <a href="/catalog/v6" class="version-link">V6</a>
      <a href="/catalog/v7" class="version-link">V7</a>
      <a href="/catalog/v8" class="version-link active">V8</a>
      <a href="/catalog/v9" class="version-link">V9</a>
      <a href="/catalog/v10" class="version-link">V10</a>
      <a href="/catalog" class="version-link">Current</a>
    </nav>

    <Transition :name="transitionName" mode="out-in">
      <!-- LIST VIEW -->
      <div v-if="view === 'list'" key="list" class="fg-view">
        <!-- Dark terminal header band -->
        <header class="fg-header">
          <div class="fg-header-inner">
            <div class="fg-header-left">
              <div class="fg-logo">
                <span class="fg-prompt">$</span>
                <span class="fg-logo-text">{{ isPtBR ? 'catálogo' : 'catalog' }}</span>
                <span class="fg-cursor">_</span>
              </div>
              <p class="fg-subtitle">{{ t.subtitle }}</p>
            </div>
            <div class="fg-stats">
              <span class="fg-stat">{{ agentCount }} {{ t.agents.toLowerCase() }}</span>
              <span class="fg-stat-sep">|</span>
              <span class="fg-stat">{{ skillCount }} {{ t.skills.toLowerCase() }}</span>
            </div>
          </div>
          <!-- Search inside dark band -->
          <div class="fg-search-box">
            <span class="fg-search-prompt">$</span>
            <input v-model="search" type="text" :placeholder="t.search" />
          </div>
        </header>

        <!-- Filters below the dark band, normal bg -->
        <div class="fg-filters">
          <button class="fg-pill" :class="{ on: typeFilter === 'all' }" @click="typeFilter = 'all'">{{ t.all }}</button>
          <button class="fg-pill" :class="{ on: typeFilter === 'agent' }" @click="typeFilter = 'agent'">{{ t.agents }}</button>
          <button class="fg-pill" :class="{ on: typeFilter === 'skill' }" @click="typeFilter = 'skill'">{{ t.skills }}</button>
          <span class="fg-pill-sep">|</span>
          <button class="fg-pill" :class="{ on: catFilter === 'all' }" @click="catFilter = 'all'">{{ t.all }}</button>
          <button v-for="c in categories" :key="c" class="fg-pill" :class="{ on: catFilter === c }" @click="catFilter = c">
            {{ catLabel(c) }}
          </button>
        </div>

        <div class="fg-count">{{ t.showing }} <strong>{{ filtered.length }}</strong> {{ t.of }} {{ data.length }} {{ t.items }}</div>

        <div v-if="filtered.length" class="fg-grid">
          <article
            v-for="item in filtered"
            :key="`${item.type}-${item.name}`"
            class="fg-card"
            :style="{ '--c': item.color }"
            @click="openDetail(item)"
          >
            <div class="fg-card-head">
              <div class="fg-card-icon" :style="{ background: `color-mix(in srgb, ${item.color} 14%, var(--vp-c-bg))` }">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: item.color }">
                  <g v-html="catIcons[item.category] || catIcons.core"></g>
                </svg>
              </div>
              <div class="fg-card-title-area">
                <span class="fg-card-name">{{ item.displayName }}</span>
                <span :class="['fg-card-badge', item.type]">{{ item.type }}</span>
              </div>
            </div>
            <p class="fg-card-desc">{{ item.description }}</p>
            <div class="fg-card-stats">
              <span class="fg-card-stat">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <g v-html="catIcons[item.category] || catIcons.core"></g>
                </svg>
                {{ catLabel(item.category) }}
              </span>
              <span v-if="item.tools.length" class="fg-card-stat">{{ item.tools.length }} tools</span>
              <span :class="['fg-card-stat', 'fg-source-dot', item.source]">{{ item.source === 'official' ? t.official : t.community }}</span>
            </div>
            <div v-if="item.tags.length" class="fg-card-tags">
              <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="fg-tag">{{ tag }}</span>
              <span v-if="item.tags.length > 3" class="fg-tag fg-tag-more">+{{ item.tags.length - 3 }}</span>
            </div>
            <div class="fg-card-footer">
              <span class="fg-card-author">{{ item.author }}</span>
              <button class="fg-card-copy" @click="copyItemCmd(item, $event)" :title="t.copy">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </article>
        </div>
        <div v-else class="fg-empty">
          <p class="fg-empty-title">{{ t.noResults }}</p>
          <p class="fg-empty-sub">{{ t.tryOther }}</p>
          <button class="fg-pill on" @click="search = ''; typeFilter = 'all'; catFilter = 'all'">{{ t.clear }}</button>
        </div>
      </div>

      <!-- DETAIL VIEW -->
      <div v-else-if="view === 'detail' && selected" key="detail" class="fg-view fg-detail" :style="{ '--c': selected.color }">
        <span class="fg-back" @click="goBack">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {{ t.back }}
        </span>

        <!-- Gradient hero with embedded command -->
        <div class="fg-hero">
          <div class="fg-hero-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <g v-html="catIcons[selected.category] || catIcons.core"></g>
            </svg>
          </div>
          <h1 class="fg-hero-title">{{ selected.displayName }}</h1>
          <div class="fg-hero-badges">
            <span :class="['fg-badge', selected.source]">{{ selected.source === 'official' ? t.official : t.community }}</span>
            <span class="fg-badge cat">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="catIcons[selected.category] || ''"></svg>
              {{ catLabel(selected.category) }}
            </span>
          </div>
          <!-- Terminal command box INSIDE the hero -->
          <div class="fg-hero-cmd">
            <span class="fg-hero-cmd-prompt">$</span>
            <code class="fg-hero-cmd-text">{{ selected.copyCommand }}</code>
            <button class="fg-hero-cmd-copy" :class="{ ok: detailCopied }" @click="copyCmd">
              <svg v-if="!detailCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              {{ detailCopied ? t.copied : t.copy }}
            </button>
          </div>
        </div>

        <!-- Two-column layout -->
        <div class="fg-layout">
          <main class="fg-main">
            <p class="fg-desc">{{ selected.description }}</p>

            <!-- Workflow as stacked cards -->
            <section v-if="getWorkflowPhases(selected).length" class="fg-section">
              <h2 class="fg-section-title"><span class="fg-dot" /> {{ t.workflow }}</h2>
              <div class="fg-wf-cards">
                <div v-for="(phase, idx) in getWorkflowPhases(selected)" :key="idx" class="fg-wf-card">
                  <span class="fg-wf-num">{{ idx + 1 }}</span>
                  <div class="fg-wf-body">
                    <span class="fg-wf-name">{{ phase.name }}</span>
                    <ul v-if="phase.steps.length" class="fg-wf-steps">
                      <li v-for="step in phase.steps" :key="step">{{ step }}</li>
                    </ul>
                  </div>
                  <div v-if="idx < getWorkflowPhases(selected).length - 1" class="fg-wf-connector" />
                </div>
              </div>
            </section>

            <!-- Content sections -->
            <section v-for="sec in selected.sections.filter(s => !s.title.toLowerCase().includes('workflow'))" :key="sec.title" class="fg-section">
              <h2 class="fg-section-title"><span class="fg-dot" /> {{ sec.title }}</h2>
              <div class="fg-prose" v-html="formatContent(sec.content)"></div>
            </section>

            <!-- Usage tip -->
            <section class="fg-section">
              <h2 class="fg-section-title"><span class="fg-dot" /> {{ t.tip }}</h2>
              <div class="fg-tip">
                <code v-if="selected.type === 'agent'">{{ isPtBR ? `Use "${selected.copyCommand}" seguido de uma descrição da tarefa.` : `Use "${selected.copyCommand}" followed by a task description.` }}</code>
                <code v-else>{{ isPtBR ? `Execute "${selected.copyCommand}" na sua IDE para iniciar.` : `Run "${selected.copyCommand}" in your IDE to get started.` }}</code>
              </div>
            </section>
          </main>

          <!-- Sidebar -->
          <aside class="fg-sidebar">
            <!-- Meta card with left accent AND top gradient -->
            <div class="fg-meta-card">
              <div class="fg-meta-top-line" />
              <div v-for="row in metaRows" :key="row.key" class="fg-meta-row">
                <span class="fg-meta-key">{{ row.key }}</span>
                <span class="fg-meta-val">{{ row.val }}</span>
              </div>
            </div>

            <div v-if="selected.tools.length" class="fg-tools-card">
              <h3 class="fg-tools-title">{{ t.tools }}</h3>
              <div class="fg-tools-list">
                <span v-for="tool in selected.tools" :key="tool" class="fg-tool">{{ tool }}</span>
              </div>
            </div>

            <div v-if="selected.tags.length" class="fg-tools-card">
              <h3 class="fg-tools-title">Tags</h3>
              <div class="fg-tools-list">
                <span v-for="tag in selected.tags" :key="tag" class="fg-stag">{{ tag }}</span>
              </div>
            </div>

            <a :href="selected.sourceUrl" target="_blank" rel="noopener" class="fg-github-btn">
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
.fg { max-width: 1152px; margin: 0 auto; padding: 0 24px 64px; min-height: 80vh; overflow: hidden; }

/* ═══ TRANSITIONS ═══ */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease;
}
.slide-left-enter-from { transform: translateX(40px); opacity: 0; }
.slide-left-leave-to { transform: translateX(-40px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-40px); opacity: 0; }
.slide-right-leave-to { transform: translateX(40px); opacity: 0; }
.fg-view { width: 100%; }

/* ═══ DARK HEADER BAND ═══ */
.fg-header {
  background: var(--vp-code-block-bg, #1b1b2f);
  border-radius: 12px; padding: 28px 24px 20px; margin-bottom: 16px;
}
.fg-header-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  margin-bottom: 18px;
}
.fg-header-left { min-width: 0; }
.fg-logo { display: flex; align-items: baseline; gap: 6px; margin-bottom: 6px; }
.fg-prompt {
  font-family: var(--vp-font-family-mono); font-size: 22px; font-weight: 700;
  color: #10b981;
}
.fg-logo-text {
  font-family: var(--vp-font-family-mono); font-size: 26px; font-weight: 800;
  color: #e2e8f0; letter-spacing: -.02em;
}
.fg-cursor {
  font-family: var(--vp-font-family-mono); font-size: 26px; font-weight: 300;
  color: #10b981; animation: blink 1s step-end infinite;
}
.fg-subtitle {
  font-size: 13px; color: #a0aec0; margin: 0; line-height: 1.5;
  font-family: var(--vp-font-family-mono);
}
.fg-stats {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  font-family: var(--vp-font-family-mono); font-size: 13px; font-weight: 600; color: #a0aec0;
}
.fg-stat { color: #e2e8f0; }
.fg-stat-sep { color: #4a5568; }

/* Search inside dark band */
.fg-search-box {
  display: flex; align-items: center; gap: 8px; padding: 8px 14px;
  border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;
  background: rgba(0,0,0,0.25); color: #a0aec0;
}
.fg-search-prompt {
  font-family: var(--vp-font-family-mono); font-weight: 700; color: #10b981; font-size: 14px;
}
.fg-search-box input {
  flex: 1; border: none; background: none; outline: none;
  font-size: 13px; color: #e2e8f0; font-family: var(--vp-font-family-mono);
}
.fg-search-box input::placeholder { color: #4a5568; }
.fg-search-box:focus-within { border-color: #10b981; }

/* ═══ FILTERS — below dark band, normal bg ═══ */
.fg-filters {
  display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; padding: 0 2px;
}
.fg-pill {
  display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px;
  border: 1px solid var(--vp-c-divider); border-radius: 12px;
  background: var(--vp-c-bg); color: var(--vp-c-text-2);
  font-size: 11px; font-weight: 600; font-family: var(--vp-font-family-mono);
  cursor: pointer; white-space: nowrap; transition: all .15s; line-height: 1;
}
.fg-pill:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.fg-pill.on { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); color: #fff; }
.fg-pill-sep {
  color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); align-self: center;
  margin: 0 2px; font-size: 12px;
}

.fg-count {
  font-size: 11px; color: var(--vp-c-text-3); margin-bottom: 14px;
  font-family: var(--vp-font-family-mono);
}

/* ═══ GRID ═══ */
.fg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

/* ═══ CARD — V2 registry + V4 left-accent ═══ */
.fg-card {
  padding: 16px 18px; background: var(--vp-c-bg-soft);
  border: 1px solid transparent; border-left: 3px solid var(--c);
  border-radius: 8px; cursor: pointer;
  display: flex; flex-direction: column; gap: 8px;
  transition: border-color .2s, box-shadow .2s, border-left-width .15s;
}
.fg-card:hover {
  border-color: var(--vp-c-divider);
  border-left-width: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.fg-card-head { display: flex; align-items: center; gap: 8px; }
.fg-card-icon {
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.fg-card-icon svg { width: 28px; height: 28px; }
.fg-card-title-area { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.fg-card-name {
  font-size: 14px; font-weight: 700; font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.fg-card-badge {
  font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
  padding: 2px 7px; border-radius: 4px; flex-shrink: 0;
}
.fg-card-badge.agent {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
}
.fg-card-badge.skill {
  background: color-mix(in srgb, #CD7F32 12%, transparent);
  color: #CD7F32;
}
.fg-card-desc {
  font-size: 12px; color: var(--vp-c-text-2); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.fg-card-stats { display: flex; align-items: center; gap: 10px; }
.fg-card-stat {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 10px; color: var(--vp-c-text-3);
}
.fg-source-dot::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  display: inline-block; margin-right: 2px;
}
.fg-source-dot.official::before { background: #22c55e; }
.fg-source-dot.community::before { background: #CD7F32; }
.fg-card-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.fg-tag {
  font-size: 10px; padding: 2px 6px; border-radius: 4px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-3);
}
.fg-tag-more { font-weight: 600; color: var(--vp-c-text-2); }
.fg-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: auto; padding-top: 4px;
}
.fg-card-author { font-size: 11px; color: var(--vp-c-text-3); }
.fg-card-copy {
  padding: 4px 6px; border-radius: 4px; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg); color: var(--vp-c-text-3); cursor: pointer;
  display: flex; align-items: center; transition: all .15s;
}
.fg-card-copy:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-text-3); }

/* ═══ EMPTY ═══ */
.fg-empty {
  text-align: center; padding: 48px 24px; color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
}
.fg-empty-title { margin: 0 0 6px; }
.fg-empty-sub { font-size: 12px; color: var(--vp-c-text-3); margin: 0 0 16px; }

/* ═══════════════════════════════════════════ */
/* ═══ DETAIL VIEW — Fusion Gamma ═══ */
/* ═══════════════════════════════════════════ */
.fg-back {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
  cursor: pointer; color: var(--vp-c-text-3); margin: 8px 0 20px;
  transition: color .15s; font-size: 13px; font-weight: 500; border-radius: 8px;
  font-family: var(--vp-font-family-mono);
}
.fg-back:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }

/* Gradient hero with embedded command */
.fg-hero {
  position: relative; text-align: center; padding: 40px 24px 32px;
  border-radius: 16px; margin-bottom: 32px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 18%, var(--vp-c-bg-soft)), color-mix(in srgb, var(--c) 6%, var(--vp-c-bg-soft)));
}
.fg-hero-icon {
  width: 64px; height: 64px; border-radius: 18px; background: var(--vp-c-bg);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid var(--vp-c-divider);
}
.fg-hero-title {
  font-size: 32px; font-weight: 800; color: var(--vp-c-text-1); margin: 0 0 12px;
  font-family: var(--vp-font-family-mono);
}
.fg-hero-badges { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; }
.fg-badge {
  display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: .4px;
}
.fg-badge.official { background: rgba(43,94,167,.15); color: var(--vp-c-brand-1); }
.fg-badge.community { background: rgba(205,127,50,.15); color: #CD7F32; }
.fg-badge.cat { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }

/* Terminal command INSIDE hero */
.fg-hero-cmd {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 10px 10px 10px 16px; border-radius: 8px;
  background: var(--vp-code-block-bg, #1b1b2f);
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.fg-hero-cmd-prompt {
  font-family: var(--vp-font-family-mono); font-weight: 700; color: #10b981; font-size: 15px;
}
.fg-hero-cmd-text {
  font-family: var(--vp-font-family-mono); font-size: 15px; color: #10b981; font-weight: 600;
}
.fg-hero-cmd-copy {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 6px; border: none;
  background: rgba(255,255,255,0.08); color: #a0aec0; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all .15s; white-space: nowrap;
}
.fg-hero-cmd-copy:hover { color: #e2e8f0; background: rgba(255,255,255,0.14); }
.fg-hero-cmd-copy.ok { color: #10b981; }

/* Two-column layout */
.fg-layout { display: grid; grid-template-columns: 1fr 260px; gap: 36px; }
.fg-main { min-width: 0; }
.fg-desc { font-size: 16px; line-height: 1.7; color: var(--vp-c-text-2); margin: 0 0 32px; }

/* Sections */
.fg-section { margin-bottom: 32px; }
.fg-section-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 17px; font-weight: 700; color: var(--vp-c-text-1); margin: 0 0 16px;
  padding-bottom: 10px; border-bottom: 1px solid var(--vp-c-divider);
}
.fg-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex-shrink: 0; }

/* Workflow stacked cards */
.fg-wf-cards { display: flex; flex-direction: column; gap: 0; }
.fg-wf-card {
  display: flex; align-items: flex-start; gap: 12px; position: relative;
  padding: 14px 16px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
}
.fg-wf-card + .fg-wf-card { margin-top: 12px; }
.fg-wf-num {
  width: 26px; height: 26px; border-radius: 50%; background: var(--c); color: #fff;
  font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.fg-wf-body { flex: 1; min-width: 0; }
.fg-wf-name { font-size: 14px; font-weight: 700; color: var(--vp-c-text-1); }
.fg-wf-steps { margin: 6px 0 0; padding: 0 0 0 16px; list-style: none; }
.fg-wf-steps li {
  font-size: 12px; color: var(--vp-c-text-2); line-height: 1.6; position: relative; padding-left: 12px;
}
.fg-wf-steps li::before {
  content: ''; position: absolute; left: 0; top: 7px;
  width: 4px; height: 4px; border-radius: 50%;
  background: color-mix(in srgb, var(--c) 50%, var(--vp-c-text-3));
}
.fg-wf-connector {
  position: absolute; left: 29px; bottom: -13px;
  width: 2px; height: 12px; background: var(--c); opacity: .3;
}

/* Prose */
.fg-prose { font-size: 13px; line-height: 1.7; color: var(--vp-c-text-2); }
.fg-prose :deep(.fc-h3) { font-weight: 700; color: var(--vp-c-text-1); margin: 12px 0 4px; font-size: 14px; }
.fg-prose :deep(.fc-li) { display: flex; align-items: baseline; gap: 6px; margin: 2px 0; }
.fg-prose :deep(.fc-num) { font-weight: 600; color: var(--vp-c-text-3); min-width: 18px; }
.fg-prose :deep(.fc-dot) { width: 4px; height: 4px; border-radius: 50%; background: var(--vp-c-text-3); flex-shrink: 0; margin-top: 7px; }
.fg-prose :deep(strong) { color: var(--vp-c-text-1); }

/* Tip */
.fg-tip code {
  display: block; padding: 14px 18px; border-radius: 10px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-2);
  font-size: 14px; font-family: var(--vp-font-family-mono); line-height: 1.5;
}

/* ── Sidebar ── */
.fg-sidebar {
  position: sticky; top: 80px; align-self: start;
  display: flex; flex-direction: column; gap: 14px;
}

/* Meta card with left accent + top gradient line */
.fg-meta-card {
  border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden;
  border-left: 3px solid var(--c); position: relative;
}
.fg-meta-top-line {
  height: 3px;
  background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 30%, transparent));
}
.fg-meta-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-bottom: 1px solid var(--vp-c-divider); font-size: 12px;
}
.fg-meta-row:last-child { border-bottom: none; }
.fg-meta-key { color: var(--vp-c-text-3); font-weight: 500; }
.fg-meta-val { color: var(--vp-c-text-1); font-weight: 600; }

.fg-tools-card { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: 14px; }
.fg-tools-title {
  font-size: 11px; font-weight: 700; color: var(--vp-c-text-3);
  text-transform: uppercase; letter-spacing: .5px; margin: 0 0 8px;
}
.fg-tools-list { display: flex; flex-wrap: wrap; gap: 4px; }
.fg-tool {
  font-size: 11px; padding: 3px 8px; border-radius: 5px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-2);
  font-weight: 500; font-family: var(--vp-font-family-mono);
}
.fg-stag {
  font-size: 11px; padding: 3px 8px; border-radius: 5px;
  background: color-mix(in srgb, var(--c) 8%, var(--vp-c-bg-soft));
  color: var(--vp-c-text-2); font-weight: 500;
}

.fg-github-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px; border-radius: 10px; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: 13px; font-weight: 600;
  text-decoration: none; transition: all .15s;
}
.fg-github-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 960px) {
  .fg-grid { grid-template-columns: repeat(2, 1fr); }
  .fg-layout { grid-template-columns: 1fr; }
  .fg-sidebar { position: static; flex-direction: row; flex-wrap: wrap; gap: 10px; }
  .fg-meta-card, .fg-tools-card { flex: 1; min-width: 200px; }
}
@media (max-width: 640px) {
  .fg-header-inner { flex-direction: column; align-items: flex-start; }
  .fg-grid { grid-template-columns: 1fr; }
  .fg-hero { padding: 28px 16px 24px; }
  .fg-hero-title { font-size: 24px; }
  .fg-hero-cmd { flex-direction: column; gap: 8px; padding: 12px; border-radius: 10px; }
}

@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .slide-left-enter-active, .slide-left-leave-active,
  .slide-right-enter-active, .slide-right-leave-active { transition: none; }
  .fg-cursor { animation: none; }
}
</style>
