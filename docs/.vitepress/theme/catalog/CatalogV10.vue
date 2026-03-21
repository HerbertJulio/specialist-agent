<script setup lang="ts">
import { ref } from 'vue'
import { useCatalog, formatContent, type CatalogItem } from './useCatalog'

const {
  t, catIcons,
  search, typeFilter, catFilter,
  selected, view, detailCopied,
  transitionName,
  agentCount, skillCount, categories, filtered,
  catLabel, openDetail, goBack, copyCmd,
  getWorkflowPhases,
} = useCatalog()

const cardCopied = ref<string | null>(null)

async function copyCardCmd(item: CatalogItem) {
  try { await navigator.clipboard.writeText(item.copyCommand) }
  catch { const ta = document.createElement('textarea'); ta.value = item.copyCommand; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
  cardCopied.value = item.name
  setTimeout(() => { cardCopied.value = null }, 1500)
}
</script>

<template>
  <div class="catalog-v10">
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
      <a href="/catalog/v9" class="version-link">V9</a>
      <a href="/catalog/v10" class="version-link active">V10</a>
      <a href="/catalog" class="version-link">Current</a>
    </nav>

    <Transition :name="transitionName" mode="out-in">
      <!-- ==================== LIST VIEW ==================== -->
      <div v-if="view === 'list'" key="list" class="list-view">

        <!-- Terminal Header -->
        <header class="term-header">
          <div class="term-title">
            <span class="term-prompt">$</span>
            <span class="term-text">catalog</span><span class="term-cursor">_</span>
            <div class="term-stats">
              <span class="term-badge">{{ agentCount }} {{ t.agents }}</span>
              <span class="term-badge">{{ skillCount }} {{ t.skills }}</span>
            </div>
          </div>
        </header>

        <!-- Search -->
        <div class="search-bar">
          <span class="search-prompt">$</span>
          <input
            v-model="search"
            :placeholder="t.search"
            class="search-input"
            type="text"
          />
        </div>

        <!-- Filters -->
        <div class="filter-bar">
          <div class="type-filters">
            <button :class="['type-pill', { active: typeFilter === 'all' }]" @click="typeFilter = 'all'">
              {{ t.all }}
            </button>
            <button :class="['type-pill', { active: typeFilter === 'agent' }]" @click="typeFilter = 'agent'">
              {{ t.agents }}
            </button>
            <button :class="['type-pill', { active: typeFilter === 'skill' }]" @click="typeFilter = 'skill'">
              {{ t.skills }}
            </button>
          </div>
          <span class="filter-divider">|</span>
          <div class="cat-filters">
            <button :class="['cat-pill', { active: catFilter === 'all' }]" @click="catFilter = 'all'">
              {{ t.all }}
            </button>
            <button
              v-for="cat in categories"
              :key="cat"
              :class="['cat-pill', { active: catFilter === cat }]"
              @click="catFilter = cat"
            >
              <svg v-if="catIcons[cat]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <g v-html="catIcons[cat]" />
              </svg>
              {{ catLabel(cat) }}
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <p class="results-count">
          {{ t.showing }} <strong>{{ filtered.length }}</strong> {{ t.of }} {{ agentCount + skillCount }} {{ t.items }}
        </p>

        <!-- Cards Grid -->
        <div v-if="filtered.length" class="cards-grid">
          <article
            v-for="item in filtered"
            :key="`${item.type}-${item.name}`"
            class="card"
            :style="{ '--c': item.color }"
            @click="openDetail(item)"
          >
            <div class="card-accent" />
            <div class="card-body">
              <div class="card-head">
                <div class="card-icon" :style="{ background: `color-mix(in srgb, ${item.color} 12%, transparent)` }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: item.color }">
                    <g v-if="item.type === 'agent'" v-html="catIcons[item.category] || catIcons.core" />
                    <g v-else>
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </g>
                  </svg>
                </div>
                <span class="card-name">{{ item.displayName }}</span>
                <span :class="['card-type-badge', item.type]">{{ item.type === 'agent' ? t.agent : t.skill }}</span>
              </div>
              <p class="card-desc">{{ item.description }}</p>
              <div class="card-stats">
                <span class="card-category">
                  <svg v-if="catIcons[item.category]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <g v-html="catIcons[item.category]" />
                  </svg>
                  {{ catLabel(item.category) }}
                </span>
                <span v-if="item.tools.length" class="card-tools">{{ item.tools.length }} {{ t.tools }}</span>
                <span :class="['card-source', item.source]">{{ item.source === 'official' ? t.official : t.community }}</span>
              </div>
              <div class="card-tags" v-if="item.tags.length">
                <code v-for="(tag, i) in item.tags.slice(0, 3)" :key="tag" class="card-tag">{{ tag }}</code>
                <code v-if="item.tags.length > 3" class="card-tag overflow">+{{ item.tags.length - 3 }}</code>
              </div>
              <div class="card-footer">
                <span class="card-author">{{ item.author }}</span>
                <button class="card-copy" @click.stop="copyCardCmd(item)" :title="t.copy">
                  <svg v-if="cardCopied !== item.name" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p class="empty-title">{{ t.noResults }}</p>
          <p class="empty-sub">{{ t.tryOther }}</p>
          <button class="empty-clear" @click="search = ''; typeFilter = 'all'; catFilter = 'all'">{{ t.clear }}</button>
        </div>
      </div>

      <!-- ==================== DETAIL VIEW ==================== -->
      <div v-else-if="selected" key="detail" class="detail-view">
        <button class="back-btn" @click="goBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          {{ t.back }}
        </button>

        <!-- Gradient Hero -->
        <div class="detail-hero" :style="{ '--c': selected.color }">
          <div class="hero-inner">
            <div class="hero-icon" :style="{ background: `color-mix(in srgb, ${selected.color} 18%, rgba(255,255,255,0.12))` }">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: selected.color }">
                <g v-if="selected.type === 'agent'" v-html="catIcons[selected.category] || catIcons.core" />
                <g v-else>
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </g>
              </svg>
            </div>
            <h1 class="hero-title">{{ selected.displayName }}</h1>
            <div class="hero-badges">
              <span :class="['hero-badge', selected.type]">{{ selected.type === 'agent' ? t.agent : t.skill }}</span>
              <span class="hero-badge cat">{{ catLabel(selected.category) }}</span>
              <span :class="['hero-badge', selected.source]">{{ selected.source === 'official' ? t.official : t.community }}</span>
            </div>
            <div class="hero-command">
              <code class="hero-cmd-text">{{ selected.copyCommand }}</code>
              <button class="hero-cmd-copy" @click="copyCmd">
                {{ detailCopied ? t.copied : t.copy }}
              </button>
            </div>
          </div>
        </div>

        <!-- Two-Column Layout -->
        <div class="detail-content">
          <main class="detail-main">
            <p class="detail-desc">{{ selected.description }}</p>

            <!-- Content Sections -->
            <div v-for="sec in selected.sections" :key="sec.title" class="detail-section">
              <h2 class="section-title"><span class="section-hash">##</span> {{ sec.title }}</h2>
              <div class="section-body" v-html="formatContent(sec.content)" />
            </div>

            <!-- Workflow -->
            <div v-if="getWorkflowPhases(selected).length" class="workflow-section">
              <h2 class="section-title"><span class="section-hash">##</span> {{ t.workflow }}</h2>
              <div class="workflow-phases">
                <div
                  v-for="(phase, idx) in getWorkflowPhases(selected)"
                  :key="phase.name"
                  class="workflow-card"
                  :style="{ '--c': selected.color }"
                >
                  <div class="wf-header">
                    <span class="wf-index">{{ idx + 1 }}</span>
                    <span class="wf-name">{{ phase.name }}</span>
                  </div>
                  <ul class="wf-steps" v-if="phase.steps.length">
                    <li v-for="step in phase.steps" :key="step">{{ step }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>

          <!-- Sidebar -->
          <aside class="detail-sidebar">
            <div class="sidebar-card meta-card" :style="{ '--c': selected.color }">
              <div class="meta-row">
                <span class="meta-label">{{ t.type }}</span>
                <span class="meta-value">{{ selected.type === 'agent' ? t.agent : t.skill }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">{{ t.category }}</span>
                <span class="meta-value">{{ catLabel(selected.category) }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">{{ t.author }}</span>
                <a :href="selected.authorUrl" class="meta-link" target="_blank">{{ selected.author }}</a>
              </div>
              <div class="meta-row">
                <span class="meta-label">{{ t.source }}</span>
                <span class="meta-value">{{ selected.source === 'official' ? t.official : t.community }}</span>
              </div>
            </div>

            <div class="sidebar-card" v-if="selected.tools.length">
              <h3 class="sidebar-heading">{{ t.tools }}</h3>
              <div class="tools-list">
                <code v-for="tool in selected.tools" :key="tool" class="tool-pill">{{ tool }}</code>
              </div>
            </div>

            <div class="sidebar-card" v-if="selected.tags.length">
              <h3 class="sidebar-heading">Tags</h3>
              <div class="tags-list">
                <span v-for="tag in selected.tags" :key="tag" class="tag-pill" :style="{ '--c': selected.color }">{{ tag }}</span>
              </div>
            </div>

            <a :href="selected.sourceUrl" target="_blank" class="source-link-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              {{ t.viewSource }}
            </a>
          </aside>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ─── Base ─── */
.catalog-v10 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 64px;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-1);
}

/* ─── Version Nav ─── */
.version-nav {
  display: flex;
  gap: 4px;
  justify-content: center;
  padding: 12px 0 20px;
}
.version-link {
  padding: 4px 12px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.2s;
}
.version-link:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-text-3); }
.version-link.active {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
}

/* ─── Terminal Header ─── */
.term-header {
  padding: 20px 0 16px;
}
.term-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.term-prompt {
  font-family: var(--vp-font-family-mono);
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}
.term-text {
  font-family: var(--vp-font-family-mono);
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2, var(--vp-c-brand-1)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.term-cursor {
  font-family: var(--vp-font-family-mono);
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  animation: blink-cursor 1s step-end infinite;
}
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.term-stats {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.term-badge {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}

/* ─── Search Bar ─── */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 16px;
  transition: border-color 0.2s;
}
.search-bar:focus-within {
  border-bottom-color: var(--vp-c-brand-1);
}
.search-prompt {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-3);
}
.search-input {
  flex: 1;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  outline: none;
  padding: 4px 0;
}
.search-input::placeholder { color: var(--vp-c-text-3); }

/* ─── Filter Bar ─── */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.type-filters, .cat-filters {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.filter-divider {
  color: var(--vp-c-divider);
  font-size: 16px;
  user-select: none;
}
.type-pill {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 2px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s;
}
.type-pill:hover { border-color: var(--vp-c-text-3); color: var(--vp-c-text-1); }
.type-pill.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}
.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s;
}
.cat-pill:hover { border-color: var(--vp-c-text-3); color: var(--vp-c-text-1); }
.cat-pill.active {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent);
}

/* ─── Results Count ─── */
.results-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
}
.results-count strong { color: var(--vp-c-text-2); }

/* ─── Cards Grid ─── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 860px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) { .cards-grid { grid-template-columns: 1fr; } }

/* ─── Card ─── */
.card {
  position: relative;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--c) 12%, transparent);
}
.card:hover .card-accent { opacity: 1; }
.card-accent {
  height: 3px;
  background: linear-gradient(to right, var(--c), transparent);
  opacity: 0.5;
  transition: opacity 0.2s;
}
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.card-name {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-type-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}
.card-type-badge.agent {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}
.card-type-badge.skill {
  color: #CD7F32;
  background: color-mix(in srgb, #CD7F32 10%, transparent);
}
.card-desc {
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}
.card-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.card-category {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.card-tools { opacity: 0.8; }
.card-source {
  margin-left: auto;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--vp-c-bg-soft);
}
.card-source.official { color: var(--vp-c-brand-1); }
.card-source.community { color: #CD7F32; }
.card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.card-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
}
.card-tag.overflow {
  color: var(--vp-c-text-3);
  opacity: 0.7;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-divider);
}
.card-author {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.card-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s;
}
.card-copy:hover { color: var(--vp-c-brand-1); background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent); }

/* ─── Empty State ─── */
.empty-state {
  text-align: center;
  padding: 48px 16px;
}
.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 4px;
}
.empty-sub {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0 0 16px;
}
.empty-clear {
  font-size: 13px;
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s;
}
.empty-clear:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ─── Detail: Back Button ─── */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.15s;
}
.back-btn:hover { color: var(--vp-c-brand-1); }

/* ─── Detail: Gradient Hero ─── */
.detail-hero {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--c) 12%, var(--vp-c-bg)),
    var(--vp-c-bg) 70%
  );
  border: 1px solid color-mix(in srgb, var(--c) 16%, var(--vp-c-divider));
}
.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 24px 24px;
  gap: 12px;
}
.hero-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-title {
  font-family: var(--vp-font-family-mono);
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}
.hero-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}
.hero-badge {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}
.hero-badge.agent { color: var(--vp-c-brand-1); border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent); }
.hero-badge.skill { color: #CD7F32; border-color: color-mix(in srgb, #CD7F32 30%, transparent); }
.hero-badge.cat { color: var(--vp-c-text-2); }
.hero-badge.official { color: var(--vp-c-brand-1); }
.hero-badge.community { color: #CD7F32; }
.hero-command {
  display: inline-flex;
  align-items: center;
  gap: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  overflow: hidden;
  margin-top: 4px;
}
.hero-cmd-text {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  padding: 6px 12px 6px 16px;
  color: var(--vp-c-text-1);
}
.hero-cmd-copy {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  border: none;
  border-left: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  cursor: pointer;
  transition: background 0.15s;
}
.hero-cmd-copy:hover { background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent); }

/* ─── Detail: Two-Column Layout ─── */
.detail-content {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 24px;
}
@media (max-width: 720px) {
  .detail-content { grid-template-columns: 1fr; }
  .detail-sidebar { order: -1; }
}

/* ─── Detail: Main ─── */
.detail-main {
  min-width: 0;
}
.detail-desc {
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 24px;
}
.detail-section {
  margin-bottom: 24px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 12px;
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.section-hash {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-text-3);
  font-weight: 400;
}
.section-body {
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
.section-body :deep(.fc-h3) {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 12px 0 4px;
  position: relative;
  padding-left: 12px;
}
.section-body :deep(.fc-h3)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}
.section-body :deep(.fc-li) {
  display: flex;
  gap: 6px;
  margin: 2px 0;
}
.section-body :deep(.fc-num) {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}
.section-body :deep(.fc-dot) {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-top: 7px;
}
.section-body :deep(strong) { color: var(--vp-c-text-1); }

/* ─── Detail: Workflow ─── */
.workflow-section {
  margin-bottom: 24px;
}
.workflow-phases {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.workflow-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  background: var(--vp-c-bg);
  transition: border-color 0.2s;
}
.workflow-card:hover {
  border-color: color-mix(in srgb, var(--c) 40%, var(--vp-c-divider));
}
.wf-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.wf-index {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--c) 12%, transparent);
  color: var(--c);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.wf-name {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.wf-steps {
  list-style: none;
  margin: 0;
  padding: 0 0 0 30px;
}
.wf-steps li {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  position: relative;
}
.wf-steps li::before {
  content: '';
  position: absolute;
  left: -14px;
  top: 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
}

/* ─── Detail: Sidebar ─── */
.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sidebar-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  background: var(--vp-c-bg);
}
.meta-card {
  border-left: 3px solid color-mix(in srgb, var(--c) 60%, transparent);
}
.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}
.meta-row + .meta-row {
  border-top: 1px solid var(--vp-c-divider);
}
.meta-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.meta-value {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
.meta-link {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.meta-link:hover { text-decoration: underline; }
.sidebar-heading {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.tools-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tool-pill {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag-pill {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--c) 8%, transparent);
  color: color-mix(in srgb, var(--c) 80%, var(--vp-c-text-1));
  border: 1px solid color-mix(in srgb, var(--c) 16%, transparent);
}
.source-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s;
}
.source-link-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* ─── Transitions ─── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease;
}
.slide-left-enter-from { opacity: 0; transform: translateX(24px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-24px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-24px); }
.slide-right-leave-to { opacity: 0; transform: translateX(24px); }

/* ─── Responsive: Filter Bar ─── */
@media (max-width: 540px) {
  .filter-divider { display: none; }
  .filter-bar { gap: 8px; }
  .term-stats { margin-left: 0; margin-top: 4px; }
  .term-title { flex-wrap: wrap; }
  .hero-title { font-size: 22px; }
  .detail-content { gap: 16px; }
}
</style>
