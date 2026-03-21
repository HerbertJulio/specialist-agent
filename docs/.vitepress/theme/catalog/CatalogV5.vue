<script setup lang="ts">
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
</script>

<template>
  <div class="catalog-v5">
    <!-- Version Navigation -->
        <nav class="version-nav">
      <a href="/catalog/v1" class="version-link">V1</a>
      <a href="/catalog/v2" class="version-link">V2</a>
      <a href="/catalog/v3" class="version-link">V3</a>
      <a href="/catalog/v4" class="version-link">V4</a>
      <a href="/catalog/v5" class="version-link active">V5</a>
      <a href="/catalog/v6" class="version-link">V6</a>
      <a href="/catalog/v7" class="version-link">V7</a>
      <a href="/catalog/v8" class="version-link">V8</a>
      <a href="/catalog/v9" class="version-link">V9</a>
      <a href="/catalog/v10" class="version-link">V10</a>
      <a href="/catalog" class="version-link">Current</a>
    </nav>

    <Transition :name="transitionName" mode="out-in">
      <!-- ==================== LIST VIEW ==================== -->
      <div v-if="view === 'list'" key="list" class="list-view">
        <header class="list-header">
          <p class="list-subtitle">{{ t.subtitle }}</p>
          <p class="list-counts">
            {{ agentCount }} {{ t.agents }} · {{ skillCount }} {{ t.skills }}
          </p>
        </header>

        <!-- Search & Filters -->
        <div class="filters">
          <div class="search-wrap">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="search" :placeholder="t.search" class="search-input" type="text" />
          </div>
          <div class="filter-row">
            <div class="filter-group">
              <button :class="['filter-btn', { active: typeFilter === 'all' }]" @click="typeFilter = 'all'">{{ t.all }}</button>
              <button :class="['filter-btn', { active: typeFilter === 'agent' }]" @click="typeFilter = 'agent'">{{ t.agents }}</button>
              <button :class="['filter-btn', { active: typeFilter === 'skill' }]" @click="typeFilter = 'skill'">{{ t.skills }}</button>
            </div>
            <div class="filter-group">
              <button :class="['filter-btn', { active: catFilter === 'all' }]" @click="catFilter = 'all'">{{ t.all }}</button>
              <button
                v-for="cat in categories" :key="cat"
                :class="['filter-btn', { active: catFilter === cat }]"
                @click="catFilter = cat"
              >
                <svg v-if="catIcons[cat]" class="cat-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="catIcons[cat]" />
                {{ catLabel(cat) }}
              </button>
            </div>
          </div>
          <p class="result-count">{{ t.showing }} {{ filtered.length }} {{ t.of }} {{ agentCount + skillCount }} {{ t.items }}</p>
        </div>

        <!-- Card Grid -->
        <div v-if="filtered.length" class="card-grid">
          <article
            v-for="item in filtered" :key="`${item.type}-${item.name}`"
            class="card"
            @click="openDetail(item)"
          >
            <div class="card-top">
              <span :class="['type-badge', item.type]">{{ item.type === 'agent' ? t.agent : t.skill }}</span>
              <span class="card-cat">{{ catLabel(item.category) }}</span>
            </div>
            <h3 class="card-name">{{ item.name }}</h3>
            <span :class="['card-cmd', item.type]">{{ item.displayName }}</span>
            <p class="card-desc">{{ item.description }}</p>
            <div class="card-bottom">
              <div class="card-tags">
                <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <span class="card-author">{{ item.author }}</span>
            </div>
          </article>
        </div>

        <!-- No Results -->
        <div v-else class="no-results">
          <p class="no-results-title">{{ t.noResults }}</p>
          <p class="no-results-hint">{{ t.tryOther }}</p>
          <button class="clear-btn" @click="search = ''; typeFilter = 'all'; catFilter = 'all'">{{ t.clear }}</button>
        </div>
      </div>

      <!-- ==================== DETAIL VIEW ==================== -->
      <div v-else-if="selected" key="detail" class="detail-view">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a class="breadcrumb-link" @click.prevent="goBack">Catalog</a>
          <span class="breadcrumb-sep">&gt;</span>
          <span class="breadcrumb-text">{{ selected.type === 'agent' ? t.agents : t.skills }}</span>
          <span class="breadcrumb-sep">&gt;</span>
          <span class="breadcrumb-current">{{ selected.displayName }}</span>
        </nav>

        <div class="detail-layout">
          <!-- Main Content -->
          <main class="detail-main">
            <h1 class="detail-title">{{ selected.name }}</h1>
            <p class="detail-desc">{{ selected.description }}</p>

            <!-- Command Callout (tip container) -->
            <div class="vp-tip-container">
              <p class="tip-title">{{ t.command }}</p>
              <div class="tip-body">
                <code class="vp-code">{{ selected.copyCommand }}</code>
                <button class="copy-btn" @click="copyCmd">
                  <svg v-if="!detailCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ detailCopied ? t.copied : t.copy }}
                </button>
              </div>
            </div>

            <!-- Content Sections -->
            <section v-for="sec in selected.sections" :key="sec.title" class="content-section">
              <h2 class="section-heading">{{ sec.title }}</h2>
              <div class="section-body" v-html="formatContent(sec.content)" />
            </section>

            <!-- Workflow -->
            <section v-if="getWorkflowPhases(selected).length" class="content-section">
              <h2 class="section-heading">{{ t.workflow }}</h2>
              <ol class="workflow-steps">
                <li v-for="(phase, idx) in getWorkflowPhases(selected)" :key="idx" class="workflow-step">
                  <div class="step-header">
                    <span class="step-num">{{ idx + 1 }}</span>
                    <span class="step-name">{{ phase.name }}</span>
                  </div>
                  <ul v-if="phase.steps.length" class="substeps">
                    <li v-for="(s, si) in phase.steps" :key="si">{{ s }}</li>
                  </ul>
                </li>
              </ol>
            </section>

            <!-- Usage Tip Callout -->
            <div v-if="selected.sections.length" class="vp-tip-container green">
              <p class="tip-title">{{ t.tip }}</p>
              <p class="tip-body-text">
                {{ selected.type === 'agent'
                  ? `Type ${selected.copyCommand} followed by your request to invoke this agent.`
                  : `Type ${selected.copyCommand} to activate this skill in your IDE.` }}
              </p>
            </div>
          </main>

          <!-- Sidebar -->
          <aside class="detail-sidebar">
            <div class="sidebar-section">
              <h4 class="sidebar-title">{{ t.type }}</h4>
              <p class="sidebar-value">
                <span :class="['type-badge', selected.type]">{{ selected.type === 'agent' ? t.agent : t.skill }}</span>
              </p>
            </div>
            <div class="sidebar-section">
              <h4 class="sidebar-title">{{ t.category }}</h4>
              <p class="sidebar-value">{{ catLabel(selected.category) }}</p>
            </div>
            <div class="sidebar-section">
              <h4 class="sidebar-title">{{ t.author }}</h4>
              <p class="sidebar-value">
                <a :href="selected.authorUrl" target="_blank" rel="noopener">{{ selected.author }}</a>
              </p>
            </div>
            <div class="sidebar-section">
              <h4 class="sidebar-title">{{ t.source }}</h4>
              <p class="sidebar-value">{{ selected.source === 'official' ? t.official : t.community }}</p>
            </div>
            <div v-if="selected.tools.length" class="sidebar-section">
              <h4 class="sidebar-title">{{ t.tools }}</h4>
              <div class="sidebar-tools">
                <code v-for="tool in selected.tools" :key="tool" class="vp-code tool-code">{{ tool }}</code>
              </div>
            </div>
            <div v-if="selected.tags.length" class="sidebar-section">
              <h4 class="sidebar-title">Tags</h4>
              <div class="sidebar-tags">
                <span v-for="tag in selected.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="sidebar-section">
              <a :href="selected.sourceUrl" target="_blank" rel="noopener" class="source-link">
                {{ t.viewSource }}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
            <button class="back-btn" @click="goBack">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              {{ t.back }}
            </button>
          </aside>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ===== Layout ===== */
.catalog-v5 { max-width: 1152px; margin: 0 auto; padding: 0 24px 48px; }

/* ===== Version Nav ===== */
.version-nav {
  display: flex; gap: 4px; padding: 8px 0 24px;
  border-bottom: 1px solid var(--vp-c-divider); margin-bottom: 24px;
}
.version-link {
  padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;
  color: var(--vp-c-text-2); text-decoration: none; transition: all 0.2s;
}
.version-link:hover { color: var(--vp-c-text-1); background: var(--vp-c-default-soft); }
.version-link.active {
  color: var(--vp-c-brand-1); background: rgba(43,94,167,0.08); font-weight: 600;
}

/* ===== List Header ===== */
.list-header { margin-bottom: 20px; }
.list-subtitle { font-size: 15px; color: var(--vp-c-text-2); line-height: 1.6; margin: 0 0 4px; }
.list-counts { font-size: 13px; color: var(--vp-c-text-3); margin: 0; }

/* ===== Filters ===== */
.filters { margin-bottom: 24px; }
.search-wrap {
  position: relative; margin-bottom: 12px;
}
.search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--vp-c-text-3); pointer-events: none;
}
.search-input {
  width: 100%; padding: 8px 12px 8px 36px; border: 1px solid var(--vp-c-divider);
  border-radius: 8px; font-size: 14px; background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1); outline: none; transition: border-color 0.2s;
}
.search-input:focus { border-color: var(--vp-c-brand-1); }
.search-input::placeholder { color: var(--vp-c-text-3); }
.filter-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.filter-group { display: flex; flex-wrap: wrap; gap: 4px; }
.filter-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; border: 1px solid var(--vp-c-divider); border-radius: 16px;
  font-size: 12px; font-weight: 500; color: var(--vp-c-text-2);
  background: transparent; cursor: pointer; transition: all 0.2s;
}
.filter-btn:hover { color: var(--vp-c-text-1); border-color: var(--vp-c-text-3); }
.filter-btn.active {
  color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1);
  background: rgba(43,94,167,0.06);
}
.cat-icon { flex-shrink: 0; }
.result-count { font-size: 12px; color: var(--vp-c-text-3); margin: 0; }

/* ===== Card Grid ===== */
.card-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
.card {
  position: relative; padding: 20px; background: var(--vp-c-bg-soft);
  border-radius: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid transparent; overflow: hidden;
}
.card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), #CD7F32);
  opacity: 0.4; transition: opacity 0.2s;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.card:hover::before { opacity: 1; }

.card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.type-badge {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  padding: 2px 8px; border-radius: 4px;
}
.type-badge.agent { background: rgba(43,94,167,0.12); color: var(--vp-c-brand-1); }
.type-badge.skill { background: rgba(205,127,50,0.12); color: #CD7F32; }
.card-cat { font-size: 12px; color: var(--vp-c-text-3); }

.card-name { font-size: 16px; font-weight: 700; color: var(--vp-c-text-1); margin: 0 0 2px; }
.card-cmd { font-size: 12px; font-family: var(--vp-font-family-mono); display: block; margin-bottom: 8px; }
.card-cmd.agent { color: var(--vp-c-brand-1); }
.card-cmd.skill { color: #CD7F32; }

.card-desc {
  font-size: 14px; color: var(--vp-c-text-2); line-height: 1.6; margin: 0 0 12px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.card-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; }
.card-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag {
  font-size: 11px; padding: 2px 7px; border-radius: 10px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-2);
}
.card-author { font-size: 11px; color: var(--vp-c-text-3); white-space: nowrap; }

/* ===== No Results ===== */
.no-results { text-align: center; padding: 48px 0; }
.no-results-title { font-size: 16px; font-weight: 600; color: var(--vp-c-text-1); margin: 0 0 4px; }
.no-results-hint { font-size: 14px; color: var(--vp-c-text-3); margin: 0 0 16px; }
.clear-btn {
  padding: 6px 16px; border: 1px solid var(--vp-c-divider); border-radius: 8px;
  font-size: 13px; color: var(--vp-c-text-2); background: transparent; cursor: pointer;
}
.clear-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ===== Detail View ===== */
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--vp-c-text-3); margin-bottom: 20px; }
.breadcrumb-link { color: var(--vp-c-brand-1); cursor: pointer; text-decoration: none; }
.breadcrumb-link:hover { text-decoration: underline; }
.breadcrumb-sep { color: var(--vp-c-text-3); }
.breadcrumb-current { color: var(--vp-c-text-1); font-weight: 500; }

.detail-layout { display: flex; gap: 32px; }
.detail-main { flex: 1; min-width: 0; }
.detail-sidebar { width: 260px; flex-shrink: 0; }

.detail-title {
  font-size: 32px; font-weight: 700; color: var(--vp-c-text-1); margin: 0;
  padding-bottom: 16px; border-bottom: 1px solid var(--vp-c-divider);
}
.detail-desc { font-size: 16px; color: var(--vp-c-text-2); line-height: 1.7; margin: 16px 0 24px; }

/* VitePress Tip Container */
.vp-tip-container {
  border: 1px solid var(--vp-c-divider); border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 8px; padding: 16px; margin-bottom: 24px; background: var(--vp-c-bg-soft);
}
.vp-tip-container.green { border-left-color: #10b981; }
.tip-title {
  font-size: 13px; font-weight: 600; color: var(--vp-c-brand-1);
  text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px;
}
.vp-tip-container.green .tip-title { color: #10b981; }
.tip-body { display: flex; align-items: center; gap: 12px; }
.tip-body-text { font-size: 14px; color: var(--vp-c-text-2); line-height: 1.6; margin: 0; }
.vp-code {
  font-family: var(--vp-font-family-mono); font-size: 13px;
  background: var(--vp-code-bg, var(--vp-c-default-soft)); padding: 2px 6px;
  border-radius: 4px; color: var(--vp-c-text-1);
}
.copy-btn {
  display: inline-flex; align-items: center; gap: 4px; margin-left: auto;
  padding: 4px 10px; border: 1px solid var(--vp-c-divider); border-radius: 6px;
  font-size: 12px; color: var(--vp-c-text-2); background: var(--vp-c-bg-soft);
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.copy-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* Content Sections */
.content-section { margin-bottom: 28px; }
.section-heading {
  font-size: 20px; font-weight: 600; color: var(--vp-c-text-1);
  padding-bottom: 8px; border-bottom: 1px solid var(--vp-c-divider); margin: 0 0 16px;
}
.section-body { font-size: 16px; line-height: 28px; color: var(--vp-c-text-1); }
.section-body :deep(.fc-h3) { font-size: 16px; font-weight: 600; margin: 12px 0 4px; }
.section-body :deep(.fc-li) { padding: 2px 0 2px 16px; position: relative; }
.section-body :deep(.fc-num) { font-weight: 600; color: var(--vp-c-brand-1); position: absolute; left: 0; }
.section-body :deep(.fc-dot)::before { content: '\2022'; position: absolute; left: 2px; color: var(--vp-c-text-3); }
.section-body :deep(strong) { font-weight: 600; color: var(--vp-c-text-1); }

/* Workflow Steps */
.workflow-steps { list-style: none; padding: 0; margin: 0; counter-reset: none; }
.workflow-step { margin-bottom: 16px; }
.step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.step-num {
  width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: var(--vp-c-brand-1); color: #fff; font-size: 13px; font-weight: 700; flex-shrink: 0;
}
.step-name { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); }
.substeps { margin: 0; padding-left: 36px; }
.substeps li { font-size: 14px; color: var(--vp-c-text-2); line-height: 1.7; }

/* Sidebar */
.detail-sidebar {
  position: sticky; top: 80px; align-self: flex-start;
  border-left: 1px solid var(--vp-c-divider); padding-left: 24px;
}
.sidebar-section { margin-bottom: 20px; }
.sidebar-title {
  font-size: 12px; font-weight: 600; color: var(--vp-c-text-3);
  text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px;
}
.sidebar-value { font-size: 13px; color: var(--vp-c-text-1); font-weight: 600; margin: 0; }
.sidebar-value a { color: var(--vp-c-brand-1); text-decoration: none; }
.sidebar-value a:hover { text-decoration: underline; }
.sidebar-tools { display: flex; flex-wrap: wrap; gap: 4px; }
.tool-code { font-size: 11px; }
.sidebar-tags { display: flex; flex-wrap: wrap; gap: 4px; }

.source-link {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 500; color: var(--vp-c-brand-1); text-decoration: none;
}
.source-link:hover { text-decoration: underline; }

.back-btn {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 12px;
  padding: 6px 14px; border: 1px solid var(--vp-c-divider); border-radius: 8px;
  font-size: 13px; font-weight: 500; color: var(--vp-c-text-2);
  background: transparent; cursor: pointer; transition: all 0.2s; width: 100%; justify-content: center;
}
.back-btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ===== Transitions ===== */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.25s ease;
}
.slide-left-enter-from { opacity: 0; transform: translateX(24px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-24px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-24px); }
.slide-right-leave-to { opacity: 0; transform: translateX(24px); }

/* ===== Responsive ===== */
@media (max-width: 960px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
  .detail-layout { flex-direction: column; }
  .detail-sidebar {
    width: 100%; position: static; border-left: none; padding-left: 0;
    border-top: 1px solid var(--vp-c-divider); padding-top: 20px;
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  }
  .sidebar-section:last-child { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .catalog-v5 { padding: 0 16px 32px; }
  .card-grid { grid-template-columns: 1fr; }
  .detail-title { font-size: 24px; }
  .detail-sidebar { grid-template-columns: 1fr; }
  .version-nav { flex-wrap: wrap; }
  .filter-row { flex-direction: column; }
}
</style>
