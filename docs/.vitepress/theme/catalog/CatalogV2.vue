<script setup lang="ts">
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
</script>

<template>
  <div class="catalog-v2">
        <nav class="version-nav">
      <a href="/catalog/v1" class="version-link">V1</a>
      <a href="/catalog/v2" class="version-link active">V2</a>
      <a href="/catalog/v3" class="version-link">V3</a>
      <a href="/catalog/v4" class="version-link">V4</a>
      <a href="/catalog/v5" class="version-link">V5</a>
      <a href="/catalog/v6" class="version-link">V6</a>
      <a href="/catalog/v7" class="version-link">V7</a>
      <a href="/catalog/v8" class="version-link">V8</a>
      <a href="/catalog/v9" class="version-link">V9</a>
      <a href="/catalog/v10" class="version-link">V10</a>
      <a href="/catalog" class="version-link">Current</a>
    </nav>

    <Transition :name="transitionName" mode="out-in">
      <!-- LIST VIEW -->
      <div v-if="view === 'list'" key="list" class="list-view">
        <header class="hero">
          <h1 class="hero-title">Registry</h1>
          <p class="hero-sub">{{ t.subtitle }}</p>
          <div class="hero-stats">
            <span class="stat-pill">{{ agentCount }} {{ t.agents }}</span>
            <span class="stat-pill">{{ skillCount }} {{ t.skills }}</span>
            <span class="stat-pill">{{ categories.length }} {{ t.category }}</span>
          </div>
        </header>

        <div class="toolbar">
          <div class="toolbar-row">
            <div class="search-wrap">
              <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input v-model="search" :placeholder="t.search" class="search-input" />
            </div>
            <div class="type-filters">
              <button
                v-for="tf in ['all', 'agent', 'skill']"
                :key="tf"
                :class="['type-btn', { active: typeFilter === tf }]"
                @click="typeFilter = tf"
              >
                {{ tf === 'all' ? t.all : tf === 'agent' ? t.agents : t.skills }}
              </button>
            </div>
          </div>
          <div class="cat-row">
            <button
              :class="['cat-btn', { active: catFilter === 'all' }]"
              @click="catFilter = 'all'"
            >{{ t.all }}</button>
            <button
              v-for="cat in categories"
              :key="cat"
              :class="['cat-btn', { active: catFilter === cat }]"
              @click="catFilter = cat"
            >
              <svg class="cat-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <g v-html="catIcons[cat] || catIcons.core"></g>
              </svg>
              {{ catLabel(cat) }}
            </button>
          </div>
        </div>

        <p class="result-count">
          {{ t.showing }} <strong>{{ filtered.length }}</strong> {{ t.of }} {{ data.length }} {{ t.items }}
        </p>

        <div v-if="filtered.length" class="grid">
          <article
            v-for="item in filtered"
            :key="`${item.type}-${item.name}`"
            class="card"
            :style="{ '--c': item.color }"
            @click="openDetail(item)"
          >
            <div class="card-header">
              <div class="card-icon-wrap" :style="{ background: `color-mix(in srgb, ${item.color} 14%, var(--vp-c-bg))` }">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :style="{ color: item.color }">
                  <g v-html="catIcons[item.category] || catIcons.core"></g>
                </svg>
              </div>
              <span class="card-name">{{ item.displayName }}</span>
              <span :class="['type-badge', item.type]">{{ item.type }}</span>
            </div>

            <p class="card-desc">{{ item.description }}</p>

            <div class="card-stats">
              <span class="stat">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <g v-html="catIcons[item.category] || catIcons.core"></g>
                </svg>
                {{ catLabel(item.category) }}
              </span>
              <span v-if="item.tools.length" class="stat">{{ item.tools.length }} tools</span>
              <span :class="['stat', 'source-dot', item.source]">{{ item.source === 'official' ? t.official : t.community }}</span>
            </div>

            <div v-if="item.tags.length" class="card-tags">
              <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
              <span v-if="item.tags.length > 3" class="tag tag-more">+{{ item.tags.length - 3 }}</span>
            </div>

            <div class="card-footer">
              <span class="card-author">{{ item.author }}</span>
              <button class="card-copy" @click="copyItemCmd(item, $event)" :title="t.copy">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty">
          <p class="empty-title">{{ t.noResults }}</p>
          <p class="empty-sub">{{ t.tryOther }}</p>
          <button class="clear-btn" @click="search = ''; typeFilter = 'all'; catFilter = 'all'">
            {{ t.clear }}
          </button>
        </div>
      </div>

      <!-- DETAIL VIEW -->
      <div v-else-if="selected" key="detail" class="detail-view">
        <button class="back-btn" @click="goBack">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {{ t.back }}
        </button>

        <div class="detail-layout" :style="{ '--c': selected.color }">
          <!-- Main column -->
          <div class="detail-main">
            <div class="detail-header">
              <div class="detail-icon-wrap" :style="{ background: `color-mix(in srgb, ${selected.color} 14%, var(--vp-c-bg-soft))` }">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :style="{ color: selected.color }">
                  <g v-html="catIcons[selected.category] || catIcons.core"></g>
                </svg>
              </div>
              <div>
                <h1 class="detail-title">{{ selected.displayName }}</h1>
                <p class="detail-desc">{{ selected.description }}</p>
              </div>
            </div>

            <div class="detail-badges">
              <span :class="['d-badge', selected.type]">{{ selected.type === 'agent' ? t.agent : t.skill }}</span>
              <span class="d-badge cat">{{ catLabel(selected.category) }}</span>
              <span :class="['d-badge', 'src', selected.source]">{{ selected.source === 'official' ? t.official : t.community }}</span>
            </div>

            <div class="stats-bar">
              <span>{{ selected.tools.length }} {{ t.tools }}</span>
              <span class="stats-sep">&middot;</span>
              <span>{{ selected.sections.length }} sections</span>
            </div>

            <div class="cmd-box">
              <div class="cmd-row">
                <code class="cmd-text">{{ selected.copyCommand }}</code>
                <button class="cmd-copy" @click="copyCmd">
                  {{ detailCopied ? t.copied : t.copy }}
                </button>
              </div>
            </div>

            <!-- Workflow (vertical timeline) -->
            <div v-if="getWorkflowPhases(selected).length" class="workflow-section">
              <h2 class="section-heading">{{ t.workflow }}</h2>
              <div class="timeline">
                <div
                  v-for="(phase, i) in getWorkflowPhases(selected)"
                  :key="i"
                  class="timeline-item"
                >
                  <div class="timeline-track">
                    <div class="timeline-circle" :style="{ background: selected.color, color: '#fff' }">{{ i + 1 }}</div>
                    <div v-if="i < getWorkflowPhases(selected).length - 1" class="timeline-line"></div>
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-name">{{ phase.name }}</span>
                    <ul v-if="phase.steps.length" class="timeline-steps">
                      <li v-for="(step, si) in phase.steps" :key="si">{{ step }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content sections -->
            <div
              v-for="sec in selected.sections.filter(s => !s.title.toLowerCase().includes('workflow'))"
              :key="sec.title"
              class="content-section"
            >
              <h2 class="section-heading">{{ sec.title }}</h2>
              <div class="section-body" v-html="formatContent(sec.content)"></div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="detail-sidebar">
            <div class="sidebar-block">
              <div class="sb-row">
                <span class="sb-label">{{ t.type }}</span>
                <span class="sb-value">{{ selected.type === 'agent' ? t.agent : t.skill }}</span>
              </div>
              <div class="sb-row">
                <span class="sb-label">{{ t.category }}</span>
                <span class="sb-value">{{ catLabel(selected.category) }}</span>
              </div>
              <div class="sb-row">
                <span class="sb-label">{{ t.author }}</span>
                <span class="sb-value">{{ selected.author }}</span>
              </div>
              <div class="sb-row">
                <span class="sb-label">{{ t.source }}</span>
                <span class="sb-value">{{ selected.source === 'official' ? t.official : t.community }}</span>
              </div>
            </div>

            <div v-if="selected.tools.length" class="sidebar-block">
              <span class="sb-block-title">{{ t.tools }}</span>
              <div class="tools-grid">
                <span v-for="tool in selected.tools" :key="tool" class="tool-pill">{{ tool }}</span>
              </div>
            </div>

            <div v-if="selected.tags.length" class="sidebar-block">
              <span class="sb-block-title">Tags</span>
              <div class="tags-wrap">
                <span v-for="tag in selected.tags" :key="tag" class="sb-tag">{{ tag }}</span>
              </div>
            </div>

            <a :href="selected.sourceUrl" target="_blank" rel="noopener" class="sidebar-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
.catalog-v2 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 64px;
}

/* Version Nav */
.version-nav {
  display: flex;
  gap: 6px;
  padding: 16px 0 8px;
  flex-wrap: wrap;
}
.version-link {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all .2s;
}
.version-link:hover { color: var(--vp-c-text-1); }
.version-link.active {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* Hero */
.hero { padding: 40px 0 24px; }
.hero-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.3px;
}
.hero-sub {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 6px;
}
.hero-stats {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.stat-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

/* Toolbar */
.toolbar {
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
}
.toolbar-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}
.search-wrap {
  position: relative;
  flex: 1;
}
.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
}
.search-input {
  width: 100%;
  padding: 7px 10px 7px 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  outline: none;
  transition: border-color .2s;
}
.search-input:focus { border-color: var(--vp-c-brand-1); }
.type-filters { display: flex; gap: 4px; }
.type-btn {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all .15s;
}
.type-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}
.cat-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.cat-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all .15s;
}
.cat-btn.active {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}
.cat-icon { opacity: 0.6; }

.result-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 12px;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 960px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }

/* Card */
.card {
  padding: 16px 18px;
  background: var(--vp-c-bg-soft);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card:hover {
  border-color: var(--vp-c-divider);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.card-name {
  font-size: 14px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.type-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 7px;
  border-radius: 4px;
  flex-shrink: 0;
}
.type-badge.agent {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
}
.type-badge.skill {
  background: color-mix(in srgb, #CD7F32 12%, transparent);
  color: #CD7F32;
}
.card-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-stats {
  display: flex;
  align-items: center;
  gap: 10px;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  color: var(--vp-c-text-3);
}
.source-dot::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
}
.source-dot.official::before { background: #22c55e; }
.source-dot.community::before { background: #CD7F32; }
.card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
}
.tag-more {
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 4px;
}
.card-author {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.card-copy {
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all .15s;
}
.card-copy:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-text-3); }

/* Empty */
.empty { text-align: center; padding: 48px 0; }
.empty-title { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); }
.empty-sub { font-size: 12px; color: var(--vp-c-text-2); margin-top: 4px; }
.clear-btn {
  margin-top: 12px;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

/* Detail View */
.detail-view { padding-top: 8px; }
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  margin-bottom: 20px;
  transition: color .2s;
}
.back-btn:hover { color: var(--vp-c-text-1); }

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 36px;
}
@media (max-width: 768px) {
  .detail-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

/* Detail Main */
.detail-main { min-width: 0; }
.detail-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}
.detail-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.detail-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}
.detail-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
  line-height: 1.5;
}
.detail-badges {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.d-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.d-badge.agent {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
}
.d-badge.skill {
  background: color-mix(in srgb, #CD7F32 12%, transparent);
  color: #CD7F32;
}
.d-badge.cat {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}
.d-badge.src.official {
  background: color-mix(in srgb, #22c55e 12%, transparent);
  color: #22c55e;
}
.d-badge.src.community {
  background: color-mix(in srgb, #CD7F32 12%, transparent);
  color: #CD7F32;
}
.stats-bar {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
}
.stats-sep { margin: 0 6px; }

.cmd-box {
  background: var(--vp-c-default-soft);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 28px;
}
.cmd-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.cmd-text {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.cmd-copy {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}
.cmd-copy:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-text-3); }

/* Section heading with left accent bar */
.section-heading {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  padding-left: 12px;
  border-left: 3px solid color-mix(in srgb, var(--c) 20%, var(--vp-c-divider));
  margin-top: 28px;
  margin-bottom: 12px;
}

/* Vertical timeline workflow */
.workflow-section { margin-bottom: 24px; }
.timeline { padding-left: 4px; }
.timeline-item {
  display: flex;
  gap: 14px;
}
.timeline-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.timeline-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}
.timeline-line {
  width: 1px;
  flex: 1;
  min-height: 16px;
  background: var(--vp-c-divider);
}
.timeline-content {
  padding-bottom: 16px;
}
.timeline-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.timeline-steps {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
}
.timeline-steps li {
  font-size: 11px;
  color: var(--vp-c-text-3);
  line-height: 1.6;
  padding-left: 10px;
  position: relative;
}
.timeline-steps li::before {
  content: '\2022';
  position: absolute;
  left: 0;
  color: var(--vp-c-text-3);
}

/* Content sections */
.content-section { margin-bottom: 20px; }
.section-body {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
.section-body :deep(.fc-h3) {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 12px 0 4px;
}
.section-body :deep(.fc-li) {
  display: flex;
  gap: 6px;
  padding: 2px 0;
}
.section-body :deep(.fc-num) {
  color: var(--vp-c-text-3);
  font-weight: 600;
  flex-shrink: 0;
}
.section-body :deep(.fc-dot)::before {
  content: '\2022';
  color: var(--vp-c-text-3);
  margin-right: 4px;
}

/* Sidebar */
.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sidebar-block {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 14px 16px;
}
.sb-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 5px 0;
}
.sb-row + .sb-row { border-top: 1px solid var(--vp-c-divider); }
.sb-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
}
.sb-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.sb-block-title {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
  display: block;
  margin-bottom: 8px;
}
.tools-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}
.tool-pill {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.sb-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
}
.sidebar-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: opacity .15s;
}
.sidebar-link:hover { opacity: 0.8; }

/* Transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all .25s ease;
}
.slide-left-enter-from { opacity: 0; transform: translateX(24px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-24px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-24px); }
.slide-right-leave-to { opacity: 0; transform: translateX(24px); }
</style>
