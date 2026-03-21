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
</script>

<template>
  <div class="catalog-v1">
        <nav class="version-nav">
      <a href="/catalog/v1" class="version-link active">V1</a>
      <a href="/catalog/v2" class="version-link">V2</a>
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
          <h1 class="hero-title">Catalog</h1>
          <p class="hero-sub">{{ t.subtitle }}</p>
          <p class="hero-counts">
            {{ agentCount }} {{ t.agents }} &middot; {{ skillCount }} {{ t.skills }}
          </p>
        </header>

        <div class="toolbar">
          <div class="search-wrap">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="search" :placeholder="t.search" class="search-input" />
          </div>

          <div class="filters">
            <button
              v-for="tf in ['all', 'agent', 'skill']"
              :key="tf"
              :class="['filter-btn', { active: typeFilter === tf }]"
              @click="typeFilter = tf"
            >
              {{ tf === 'all' ? t.all : tf === 'agent' ? t.agents : t.skills }}
            </button>
          </div>

          <div class="cat-filters">
            <button
              :class="['cat-btn', { active: catFilter === 'all' }]"
              @click="catFilter = 'all'"
            >{{ t.all }}</button>
            <button
              v-for="cat in categories"
              :key="cat"
              :class="['cat-btn', { active: catFilter === cat }]"
              @click="catFilter = cat"
            >{{ catLabel(cat) }}</button>
          </div>
        </div>

        <p class="result-count">
          {{ t.showing }} {{ filtered.length }} {{ t.of }} {{ data.length }} {{ t.items }}
        </p>

        <div v-if="filtered.length" class="grid">
          <article
            v-for="item in filtered"
            :key="`${item.type}-${item.name}`"
            class="card"
            :style="{ '--c': item.color }"
            @click="openDetail(item)"
          >
            <div class="card-top">
              <svg class="card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <g v-html="catIcons[item.category] || catIcons.core"></g>
              </svg>
              <span class="card-name">{{ item.displayName }}</span>
            </div>
            <p class="card-desc">{{ item.description }}</p>
            <div class="card-bottom">
              <span class="card-author">{{ item.author }}</span>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {{ t.back }}
        </button>

        <div class="detail-content" :style="{ '--c': selected.color }">
          <div class="detail-header">
            <div class="detail-icon-wrap" :style="{ background: `color-mix(in srgb, ${selected.color} 12%, var(--vp-c-bg-soft))` }">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :style="{ color: selected.color }">
                <g v-html="catIcons[selected.category] || catIcons.core"></g>
              </svg>
            </div>
            <h1 class="detail-title">{{ selected.displayName }}</h1>
            <p class="detail-desc">{{ selected.description }}</p>
          </div>

          <div class="meta-strip">
            <div class="meta-item">
              <span class="meta-label">{{ t.type }}</span>
              <span class="meta-value">{{ selected.type === 'agent' ? t.agent : t.skill }}</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <span class="meta-label">{{ t.category }}</span>
              <span class="meta-value">{{ catLabel(selected.category) }}</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <span class="meta-label">{{ t.author }}</span>
              <span class="meta-value">{{ selected.author }}</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <span class="meta-label">{{ t.source }}</span>
              <span class="meta-value">{{ selected.source === 'official' ? t.official : t.community }}</span>
            </div>
          </div>

          <div class="cmd-box">
            <span class="cmd-label">{{ t.command }}</span>
            <div class="cmd-row">
              <code class="cmd-text">{{ selected.copyCommand }}</code>
              <button class="cmd-copy" @click="copyCmd">
                {{ detailCopied ? t.copied : t.copy }}
              </button>
            </div>
          </div>

          <!-- Workflow -->
          <div v-if="getWorkflowPhases(selected).length" class="workflow-section">
            <h2 class="section-title">{{ t.workflow }}</h2>
            <div class="workflow-track">
              <div
                v-for="(phase, i) in getWorkflowPhases(selected)"
                :key="i"
                class="workflow-phase"
              >
                <div class="workflow-circle" :style="{ background: selected.color, color: '#fff' }">{{ i + 1 }}</div>
                <div v-if="i < getWorkflowPhases(selected).length - 1" class="workflow-line"></div>
                <div class="workflow-info">
                  <span class="workflow-name">{{ phase.name }}</span>
                  <ul v-if="phase.steps.length" class="workflow-steps">
                    <li v-for="(step, si) in phase.steps" :key="si">{{ step }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Sections -->
          <div v-for="sec in selected.sections.filter(s => !s.title.toLowerCase().includes('workflow'))" :key="sec.title" class="prose-section">
            <h2 class="section-title">{{ sec.title }}</h2>
            <div class="prose-body" v-html="formatContent(sec.content)"></div>
          </div>

          <!-- Tools & Tags -->
          <div v-if="selected.tools.length" class="bottom-meta">
            <span class="bottom-label">{{ t.tools }}:</span>
            <span class="bottom-text">{{ selected.tools.join(', ') }}</span>
          </div>
          <div v-if="selected.tags.length" class="bottom-meta">
            <span class="bottom-label">Tags:</span>
            <span class="bottom-text">{{ selected.tags.join(', ') }}</span>
          </div>

          <a :href="selected.sourceUrl" target="_blank" rel="noopener" class="source-link">
            {{ t.viewSource }}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.catalog-v1 {
  max-width: 1152px;
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
.hero { text-align: center; padding: 48px 0 32px; }
.hero-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.5px;
}
.hero-sub {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin-top: 8px;
  max-width: 480px;
  margin-inline: auto;
}
.hero-counts {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 12px;
}

/* Toolbar */
.toolbar { margin-bottom: 16px; }
.search-wrap {
  position: relative;
  margin-bottom: 12px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
}
.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  outline: none;
  transition: border-color .2s;
}
.search-input:focus { border-color: var(--vp-c-brand-1); }
.filters {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}
.filter-btn {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all .2s;
}
.filter-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}
.cat-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.cat-btn {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all .2s;
}
.cat-btn.active {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}

.result-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 960px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }

/* Card */
.card {
  padding: 24px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s, border-top-color .2s;
  border-top: 2px solid transparent;
  display: flex;
  flex-direction: column;
}
.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border-top-color: var(--c);
}
.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.card-icon { color: var(--c); flex-shrink: 0; }
.card-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.card-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}
.card-bottom {
  margin-top: 12px;
  text-align: right;
}
.card-author {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

/* Empty */
.empty { text-align: center; padding: 48px 0; }
.empty-title { font-size: 16px; font-weight: 600; color: var(--vp-c-text-1); }
.empty-sub { font-size: 13px; color: var(--vp-c-text-2); margin-top: 4px; }
.clear-btn {
  margin-top: 16px;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 8px;
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
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  margin-bottom: 24px;
  transition: color .2s;
}
.back-btn:hover { color: var(--vp-c-text-1); }

.detail-content {
  max-width: 720px;
  margin: 0 auto;
}

.detail-header { margin-bottom: 32px; }
.detail-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.detail-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.3px;
}
.detail-desc {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin-top: 8px;
  line-height: 1.6;
}

/* Meta strip */
.meta-strip {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.meta-item { display: flex; flex-direction: column; gap: 4px; }
.meta-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
}
.meta-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.meta-divider {
  width: 1px;
  height: 32px;
  background: var(--vp-c-divider);
  flex-shrink: 0;
}

/* Command box */
.cmd-box {
  background: var(--vp-c-default-soft);
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 32px;
}
.cmd-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vp-c-text-3);
  display: block;
  margin-bottom: 8px;
}
.cmd-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.cmd-text {
  font-family: var(--vp-font-family-mono);
  font-size: 15px;
  color: var(--vp-c-text-1);
}
.cmd-copy {
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all .2s;
  white-space: nowrap;
}
.cmd-copy:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-text-3); }

/* Workflow */
.workflow-section { margin-bottom: 32px; }
.workflow-track {
  display: flex;
  align-items: flex-start;
  gap: 0;
  overflow-x: auto;
  padding: 8px 0;
}
.workflow-phase {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 110px;
  flex: 1;
}
.workflow-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.workflow-line {
  position: absolute;
  top: 12px;
  left: calc(50% + 12px);
  right: calc(-50% + 12px);
  height: 1px;
  background: var(--vp-c-divider);
  width: calc(100% - 24px);
}
.workflow-info {
  text-align: center;
  margin-top: 8px;
}
.workflow-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: block;
}
.workflow-steps {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
}
.workflow-steps li {
  font-size: 10px;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}

/* Sections */
.section-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-top: 32px;
  margin-bottom: 12px;
}
.prose-body {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}
.prose-body :deep(.fc-h3) {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 16px 0 6px;
}
.prose-body :deep(.fc-li) {
  display: flex;
  gap: 6px;
  padding: 2px 0;
}
.prose-body :deep(.fc-num) {
  color: var(--vp-c-text-3);
  font-weight: 600;
  flex-shrink: 0;
}
.prose-body :deep(.fc-dot)::before {
  content: '\2022';
  color: var(--vp-c-text-3);
  margin-right: 6px;
}
.prose-section { margin-bottom: 24px; }

/* Bottom meta */
.bottom-meta {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  line-height: 1.6;
}
.bottom-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-right: 6px;
}
.bottom-text { color: var(--vp-c-text-2); }

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--vp-c-brand-1);
  margin-top: 24px;
  text-decoration: none;
  font-weight: 500;
}
.source-link:hover { text-decoration: underline; }

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
