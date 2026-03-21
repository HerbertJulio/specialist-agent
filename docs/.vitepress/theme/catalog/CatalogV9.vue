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
  <div class="fd">
    <!-- Version Navigation -->
    <nav class="version-nav">
      <a href="/catalog/v1" class="version-link">V1</a>
      <a href="/catalog/v2" class="version-link">V2</a>
      <a href="/catalog/v3" class="version-link">V3</a>
      <a href="/catalog/v4" class="version-link">V4</a>
      <a href="/catalog/v5" class="version-link">V5</a>
      <a href="/catalog/v6" class="version-link">V6</a>
      <a href="/catalog/v7" class="version-link">V7</a>
      <a href="/catalog/v8" class="version-link">V8</a>
      <a href="/catalog/v9" class="version-link active">V9</a>
      <a href="/catalog/v10" class="version-link">V10</a>
      <a href="/catalog" class="version-link">Current</a>
    </nav>

    <Transition :name="transitionName" mode="out-in">
      <!-- LIST VIEW -->
      <div v-if="view === 'list'" key="list" class="fd-view">
        <!-- Minimal terminal header — single line -->
        <header class="fd-header">
          <div class="fd-header-left">
            <span class="fd-prompt">$</span>
            <span class="fd-logo-text">{{ isPtBR ? 'catálogo' : 'catalog' }}</span>
          </div>
          <span class="fd-header-count">{{ data.length }} {{ t.items }}</span>
        </header>

        <!-- Combined search + filters in one horizontal row -->
        <div class="fd-toolbar">
          <div class="fd-search-box">
            <span class="fd-search-prompt">$</span>
            <input v-model="search" type="text" :placeholder="t.search" />
          </div>
          <div class="fd-pills">
            <button class="fd-pill" :class="{ on: typeFilter === 'all' }" @click="typeFilter = 'all'">{{ t.all }}</button>
            <button class="fd-pill" :class="{ on: typeFilter === 'agent' }" @click="typeFilter = 'agent'">{{ t.agents }}</button>
            <button class="fd-pill" :class="{ on: typeFilter === 'skill' }" @click="typeFilter = 'skill'">{{ t.skills }}</button>
            <span class="fd-pill-sep">|</span>
            <button class="fd-pill" :class="{ on: catFilter === 'all' }" @click="catFilter = 'all'">{{ t.all }}</button>
            <button v-for="c in categories" :key="c" class="fd-pill" :class="{ on: catFilter === c }" @click="catFilter = c">
              {{ catLabel(c) }}
            </button>
          </div>
        </div>

        <div class="fd-count">{{ t.showing }} <strong>{{ filtered.length }}</strong> {{ t.of }} {{ data.length }} {{ t.items }}</div>

        <!-- LIST view — full-width horizontal strips -->
        <div v-if="filtered.length" class="fd-list">
          <article
            v-for="item in filtered"
            :key="`${item.type}-${item.name}`"
            class="fd-row"
            :style="{ '--c': item.color }"
            @click="openDetail(item)"
          >
            <div class="fd-row-left">
              <div class="fd-row-icon" :style="{ background: `color-mix(in srgb, ${item.color} 14%, var(--vp-c-bg))` }">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: item.color }">
                  <g v-html="catIcons[item.category] || catIcons.core"></g>
                </svg>
              </div>
              <span class="fd-row-name">{{ item.displayName }}</span>
              <span :class="['fd-row-badge', item.type]">{{ item.type }}</span>
              <span class="fd-row-desc">{{ item.description }}</span>
            </div>
            <div class="fd-row-right">
              <span class="fd-row-stat">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <g v-html="catIcons[item.category] || catIcons.core"></g>
                </svg>
                {{ catLabel(item.category) }}
              </span>
              <span v-if="item.tools.length" class="fd-row-stat">{{ item.tools.length }} tools</span>
              <span :class="['fd-row-stat', 'fd-source-dot', item.source]">{{ item.source === 'official' ? t.official : t.community }}</span>
              <div v-if="item.tags.length" class="fd-row-tags">
                <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="fd-tag">{{ tag }}</span>
                <span v-if="item.tags.length > 2" class="fd-tag fd-tag-more">+{{ item.tags.length - 2 }}</span>
              </div>
              <button class="fd-row-copy" @click="copyItemCmd(item, $event)" :title="t.copy">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </article>
        </div>
        <div v-else class="fd-empty">
          <p class="fd-empty-title">{{ t.noResults }}</p>
          <p class="fd-empty-sub">{{ t.tryOther }}</p>
          <button class="fd-pill on" @click="search = ''; typeFilter = 'all'; catFilter = 'all'">{{ t.clear }}</button>
        </div>
      </div>

      <!-- DETAIL VIEW -->
      <div v-else-if="view === 'detail' && selected" key="detail" class="fd-view fd-detail" :style="{ '--c': selected.color }">
        <span class="fd-back" @click="goBack">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {{ t.back }}
        </span>

        <!-- Left-aligned hero -->
        <div class="fd-hero">
          <div class="fd-hero-content">
            <div class="fd-hero-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <g v-html="catIcons[selected.category] || catIcons.core"></g>
              </svg>
            </div>
            <div class="fd-hero-info">
              <h1 class="fd-hero-title">{{ selected.displayName }}</h1>
              <div class="fd-hero-badges">
                <span :class="['fd-badge', selected.type]">{{ selected.type === 'agent' ? t.agent : t.skill }}</span>
                <span :class="['fd-badge', 'src', selected.source]">{{ selected.source === 'official' ? t.official : t.community }}</span>
                <span class="fd-badge cat">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="catIcons[selected.category] || ''"></svg>
                  {{ catLabel(selected.category) }}
                </span>
              </div>
              <p class="fd-hero-desc">{{ selected.description }}</p>
              <!-- Left-aligned command pill -->
              <div class="fd-hero-cmd">
                <code>{{ selected.copyCommand }}</code>
                <button class="fd-hero-cmd-copy" :class="{ ok: detailCopied }" @click="copyCmd">
                  <svg v-if="!detailCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ detailCopied ? t.copied : t.copy }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Two-column layout -->
        <div class="fd-layout">
          <main class="fd-main">
            <!-- Workflow as horizontal pipeline -->
            <section v-if="getWorkflowPhases(selected).length" class="fd-section">
              <h2 class="fd-section-title">{{ t.workflow }}</h2>
              <div class="fd-pipeline">
                <template v-for="(phase, idx) in getWorkflowPhases(selected)" :key="idx">
                  <div class="fd-pipe-phase">
                    <div class="fd-pipe-header">
                      <span class="fd-pipe-num">{{ idx + 1 }}</span>
                      <span class="fd-pipe-name">{{ phase.name }}</span>
                    </div>
                    <ul v-if="phase.steps.length" class="fd-pipe-steps">
                      <li v-for="step in phase.steps" :key="step">{{ step }}</li>
                    </ul>
                  </div>
                  <div v-if="idx < getWorkflowPhases(selected).length - 1" class="fd-pipe-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </template>
              </div>
            </section>

            <!-- Content sections -->
            <section v-for="sec in selected.sections.filter(s => !s.title.toLowerCase().includes('workflow'))" :key="sec.title" class="fd-section">
              <h2 class="fd-section-title">{{ sec.title }}</h2>
              <div class="fd-prose" v-html="formatContent(sec.content)"></div>
            </section>

            <!-- Usage tip -->
            <section class="fd-section">
              <h2 class="fd-section-title">{{ t.tip }}</h2>
              <div class="fd-tip">
                <code v-if="selected.type === 'agent'">{{ isPtBR ? `Use "${selected.copyCommand}" seguido de uma descrição da tarefa.` : `Use "${selected.copyCommand}" followed by a task description.` }}</code>
                <code v-else>{{ isPtBR ? `Execute "${selected.copyCommand}" na sua IDE para iniciar.` : `Run "${selected.copyCommand}" in your IDE to get started.` }}</code>
              </div>
            </section>
          </main>

          <!-- Sidebar -->
          <aside class="fd-sidebar">
            <div class="fd-meta-card">
              <div v-for="row in metaRows" :key="row.key" class="fd-meta-row">
                <span class="fd-meta-key">{{ row.key }}</span>
                <span class="fd-meta-val">{{ row.val }}</span>
              </div>
            </div>

            <div v-if="selected.tools.length" class="fd-tools-card">
              <h3 class="fd-tools-title">{{ t.tools }}</h3>
              <div class="fd-tools-list">
                <span v-for="tool in selected.tools" :key="tool" class="fd-tool">{{ tool }}</span>
              </div>
            </div>

            <div v-if="selected.tags.length" class="fd-tools-card">
              <h3 class="fd-tools-title">Tags</h3>
              <div class="fd-tools-list">
                <span v-for="tag in selected.tags" :key="tag" class="fd-stag">{{ tag }}</span>
              </div>
            </div>

            <a :href="selected.sourceUrl" target="_blank" rel="noopener" class="fd-github-btn">
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
.fd { max-width: 1200px; margin: 0 auto; padding: 0 24px 64px; min-height: 80vh; overflow: hidden; }

/* ═══ TRANSITIONS ═══ */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .3s ease;
}
.slide-left-enter-from { transform: translateX(40px); opacity: 0; }
.slide-left-leave-to { transform: translateX(-40px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-40px); opacity: 0; }
.slide-right-leave-to { transform: translateX(40px); opacity: 0; }
.fd-view { width: 100%; }

/* ═══ MINIMAL TERMINAL HEADER ═══ */
.fd-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 0 12px;
}
.fd-header-left { display: flex; align-items: baseline; gap: 6px; }
.fd-prompt {
  font-family: var(--vp-font-family-mono); font-size: 20px; font-weight: 700;
  color: var(--vp-c-brand-1);
}
.fd-logo-text {
  font-family: var(--vp-font-family-mono); font-size: 22px; font-weight: 800;
  color: var(--vp-c-text-1); letter-spacing: -.02em;
}
.fd-header-count {
  font-family: var(--vp-font-family-mono); font-size: 12px; font-weight: 600;
  color: var(--vp-c-text-3);
}

/* ═══ COMBINED TOOLBAR — search 60% + pills 40% ═══ */
.fd-toolbar {
  display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px;
  padding: 10px 14px; background: var(--vp-c-bg-soft); border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}
.fd-search-box {
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border: 1px solid var(--vp-c-divider); border-radius: 6px;
  background: var(--vp-c-bg); color: var(--vp-c-text-3); flex: 3; min-width: 0;
}
.fd-search-prompt {
  font-family: var(--vp-font-family-mono); font-weight: 700; color: var(--vp-c-brand-1); font-size: 13px;
}
.fd-search-box input {
  flex: 1; border: none; background: none; outline: none; min-width: 0;
  font-size: 12px; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono);
}
.fd-search-box input::placeholder { color: var(--vp-c-text-3); }
.fd-search-box:focus-within { border-color: var(--vp-c-brand-1); }
.fd-pills { display: flex; gap: 4px; flex-wrap: wrap; flex: 2; }
.fd-pill {
  display: inline-flex; align-items: center; gap: 4px; padding: 4px 9px;
  border: 1px solid var(--vp-c-divider); border-radius: 4px;
  background: var(--vp-c-bg); color: var(--vp-c-text-2);
  font-size: 10px; font-weight: 600; font-family: var(--vp-font-family-mono);
  cursor: pointer; white-space: nowrap; transition: all .15s; line-height: 1;
}
.fd-pill:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.fd-pill.on { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); color: #fff; }
.fd-pill-sep {
  color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); align-self: center;
  margin: 0 1px; font-size: 11px;
}

.fd-count {
  font-size: 11px; color: var(--vp-c-text-3); margin-bottom: 10px;
  font-family: var(--vp-font-family-mono);
}

/* ═══ LIST (horizontal strips) ═══ */
.fd-list { display: flex; flex-direction: column; gap: 4px; }
.fd-row {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 10px 14px; background: var(--vp-c-bg-soft);
  border: 1px solid transparent; border-radius: 6px;
  cursor: pointer; transition: border-color .15s, background .15s;
}
.fd-row:hover {
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg);
}
.fd-row-left {
  display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;
}
.fd-row-icon {
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.fd-row-name {
  font-size: 13px; font-weight: 700; font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1); white-space: nowrap; flex-shrink: 0;
}
.fd-row-badge {
  font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
  padding: 2px 6px; border-radius: 3px; flex-shrink: 0;
}
.fd-row-badge.agent {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
}
.fd-row-badge.skill {
  background: color-mix(in srgb, #CD7F32 12%, transparent);
  color: #CD7F32;
}
.fd-row-desc {
  font-size: 12px; color: var(--vp-c-text-2); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; min-width: 0;
}
.fd-row-right {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.fd-row-stat {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 10px; color: var(--vp-c-text-3); white-space: nowrap;
}
.fd-source-dot::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  display: inline-block; margin-right: 2px;
}
.fd-source-dot.official::before { background: #22c55e; }
.fd-source-dot.community::before { background: #CD7F32; }
.fd-row-tags { display: flex; gap: 3px; }
.fd-tag {
  font-size: 9px; padding: 1px 5px; border-radius: 3px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-3);
}
.fd-tag-more { font-weight: 600; color: var(--vp-c-text-2); }
.fd-row-copy {
  padding: 4px 6px; border-radius: 4px; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg); color: var(--vp-c-text-3); cursor: pointer;
  display: flex; align-items: center; transition: all .15s;
}
.fd-row-copy:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-text-3); }

/* ═══ EMPTY ═══ */
.fd-empty {
  text-align: center; padding: 48px 24px; color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
}
.fd-empty-title { margin: 0 0 6px; }
.fd-empty-sub { font-size: 12px; color: var(--vp-c-text-3); margin: 0 0 16px; }

/* ═══════════════════════════════════════════ */
/* ═══ DETAIL VIEW — Fusion Delta ═══ */
/* ═══════════════════════════════════════════ */
.fd-back {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
  cursor: pointer; color: var(--vp-c-text-3); margin: 8px 0 20px;
  transition: color .15s; font-size: 13px; font-weight: 500; border-radius: 8px;
  font-family: var(--vp-font-family-mono);
}
.fd-back:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }

/* Left-aligned hero */
.fd-hero {
  padding: 32px 28px; border-radius: 16px; margin-bottom: 32px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 18%, var(--vp-c-bg-soft)), color-mix(in srgb, var(--c) 6%, var(--vp-c-bg-soft)));
}
.fd-hero-content { display: flex; align-items: flex-start; gap: 20px; }
.fd-hero-icon { flex-shrink: 0; }
.fd-hero-info { min-width: 0; }
.fd-hero-title {
  font-size: 28px; font-weight: 800; color: var(--vp-c-text-1); margin: 0 0 8px;
  font-family: var(--vp-font-family-mono);
}
.fd-hero-badges { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
.fd-badge {
  display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: .4px;
}
.fd-badge.agent {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
}
.fd-badge.skill {
  background: color-mix(in srgb, #CD7F32 12%, transparent);
  color: #CD7F32;
}
.fd-badge.src.official { background: rgba(34,197,94,.12); color: #22c55e; }
.fd-badge.src.community { background: rgba(205,127,50,.12); color: #CD7F32; }
.fd-badge.cat { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }
.fd-hero-desc {
  font-size: 14px; line-height: 1.6; color: var(--vp-c-text-2); margin: 0 0 14px;
}

/* Left-aligned command pill */
.fd-hero-cmd {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 8px 8px 8px 16px; border-radius: 20px;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.fd-hero-cmd code {
  font-size: 14px; font-weight: 600; color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}
.fd-hero-cmd-copy {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 14px; border: none;
  background: var(--vp-c-brand-1); color: #fff; font-size: 11px; font-weight: 600;
  cursor: pointer; transition: opacity .15s; white-space: nowrap;
}
.fd-hero-cmd-copy:hover { opacity: .9; }
.fd-hero-cmd-copy.ok { background: #10b981; }

/* Two-column layout */
.fd-layout { display: grid; grid-template-columns: 1fr 260px; gap: 36px; }
.fd-main { min-width: 0; }

/* Sections */
.fd-section { margin-bottom: 28px; }
.fd-section-title {
  font-size: 16px; font-weight: 700; color: var(--vp-c-text-1); margin: 0 0 14px;
  padding-bottom: 8px; border-bottom: 1px solid var(--vp-c-divider);
}

/* ═══ WORKFLOW — Horizontal pipeline ═══ */
.fd-pipeline {
  display: flex; align-items: flex-start; gap: 0;
  overflow-x: auto; padding: 4px 0 8px;
}
.fd-pipe-phase {
  flex: 1; min-width: 140px; max-width: 220px;
  padding: 12px 14px; background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider); border-radius: 8px;
}
.fd-pipe-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.fd-pipe-num {
  width: 22px; height: 22px; border-radius: 50%; background: var(--c); color: #fff;
  font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.fd-pipe-name { font-size: 12px; font-weight: 700; color: var(--vp-c-text-1); }
.fd-pipe-steps { margin: 0; padding: 0 0 0 12px; list-style: none; }
.fd-pipe-steps li {
  font-size: 11px; color: var(--vp-c-text-2); line-height: 1.5; position: relative; padding-left: 10px;
}
.fd-pipe-steps li::before {
  content: ''; position: absolute; left: 0; top: 6px;
  width: 3px; height: 3px; border-radius: 50%;
  background: color-mix(in srgb, var(--c) 50%, var(--vp-c-text-3));
}
.fd-pipe-arrow {
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px; flex-shrink: 0; align-self: center;
  opacity: .6;
}

/* Prose */
.fd-prose { font-size: 13px; line-height: 1.7; color: var(--vp-c-text-2); }
.fd-prose :deep(.fc-h3) { font-weight: 700; color: var(--vp-c-text-1); margin: 12px 0 4px; font-size: 14px; }
.fd-prose :deep(.fc-li) { display: flex; align-items: baseline; gap: 6px; margin: 2px 0; }
.fd-prose :deep(.fc-num) { font-weight: 600; color: var(--vp-c-text-3); min-width: 18px; }
.fd-prose :deep(.fc-dot) { width: 4px; height: 4px; border-radius: 50%; background: var(--vp-c-text-3); flex-shrink: 0; margin-top: 7px; }
.fd-prose :deep(strong) { color: var(--vp-c-text-1); }

/* Tip */
.fd-tip code {
  display: block; padding: 14px 18px; border-radius: 10px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-2);
  font-size: 14px; font-family: var(--vp-font-family-mono); line-height: 1.5;
}

/* ── Sidebar ── */
.fd-sidebar {
  position: sticky; top: 80px; align-self: start;
  display: flex; flex-direction: column; gap: 14px;
}
.fd-meta-card {
  border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden;
}
.fd-meta-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-bottom: 1px solid var(--vp-c-divider); font-size: 12px;
}
.fd-meta-row:last-child { border-bottom: none; }
.fd-meta-key { color: var(--vp-c-text-3); font-weight: 500; }
.fd-meta-val { color: var(--vp-c-text-1); font-weight: 600; }

.fd-tools-card { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: 14px; }
.fd-tools-title {
  font-size: 11px; font-weight: 700; color: var(--vp-c-text-3);
  text-transform: uppercase; letter-spacing: .5px; margin: 0 0 8px;
}
.fd-tools-list { display: flex; flex-wrap: wrap; gap: 4px; }
.fd-tool {
  font-size: 11px; padding: 3px 8px; border-radius: 5px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-2);
  font-weight: 500; font-family: var(--vp-font-family-mono);
}
.fd-stag {
  font-size: 11px; padding: 3px 8px; border-radius: 5px;
  background: color-mix(in srgb, var(--c) 8%, var(--vp-c-bg-soft));
  color: var(--vp-c-text-2); font-weight: 500;
}

.fd-github-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px; border-radius: 10px; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: 13px; font-weight: 600;
  text-decoration: none; transition: all .15s;
}
.fd-github-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ═══ RESPONSIVE ═══ */
@media (max-width: 960px) {
  .fd-toolbar { flex-direction: column; }
  .fd-pills { flex: none; }
  .fd-search-box { flex: none; width: 100%; }
  .fd-row-desc { display: none; }
  .fd-row-tags { display: none; }
  .fd-layout { grid-template-columns: 1fr; }
  .fd-sidebar { position: static; flex-direction: row; flex-wrap: wrap; gap: 10px; }
  .fd-meta-card, .fd-tools-card { flex: 1; min-width: 200px; }
  .fd-pipeline { flex-wrap: wrap; gap: 8px; }
  .fd-pipe-arrow { transform: rotate(90deg); }
}
@media (max-width: 640px) {
  .fd-header { flex-direction: column; align-items: flex-start; gap: 4px; }
  .fd-row { flex-direction: column; align-items: flex-start; gap: 8px; }
  .fd-row-right { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
  .fd-hero-content { flex-direction: column; }
  .fd-hero-title { font-size: 22px; }
  .fd-hero-cmd { flex-direction: column; gap: 8px; padding: 10px; border-radius: 10px; }
  .fd-pipeline { flex-direction: column; }
  .fd-pipe-phase { max-width: none; }
  .fd-pipe-arrow { transform: rotate(90deg); }
}

@media (prefers-reduced-motion: reduce) {
  .slide-left-enter-active, .slide-left-leave-active,
  .slide-right-enter-active, .slide-right-leave-active { transition: none; }
}
</style>
