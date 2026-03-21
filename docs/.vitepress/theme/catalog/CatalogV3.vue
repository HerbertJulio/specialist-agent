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
  <div class="ct">
    <!-- Version Navigation -->
        <nav class="version-nav">
      <a href="/catalog/v1" class="version-link">V1</a>
      <a href="/catalog/v2" class="version-link">V2</a>
      <a href="/catalog/v3" class="version-link active">V3</a>
      <a href="/catalog/v4" class="version-link">V4</a>
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span class="ct-logo-text">{{ isPtBR ? 'Catálogo' : 'Catalog' }}</span>
          </div>
          <p class="ct-subtitle">{{ t.subtitle }}</p>
        </div>
        <div class="ct-stats">
          <div class="ct-stat"><span class="ct-stat-n">{{ agentCount }}</span><span class="ct-stat-l">{{ t.agents }}</span></div>
          <span class="ct-stat-sep" />
          <div class="ct-stat"><span class="ct-stat-n">{{ skillCount }}</span><span class="ct-stat-l">{{ t.skills }}</span></div>
        </div>
      </div>
    </header>

    <Transition :name="transitionName" mode="out-in">
      <!-- LIST VIEW -->
      <div v-if="view === 'list'" key="list" class="ct-view">
        <div class="ct-toolbar">
          <div class="ct-search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="search" type="text" :placeholder="t.search" />
          </div>
          <div class="ct-pills">
            <button class="pill" :class="{ on: typeFilter === 'all' }" @click="typeFilter = 'all'">{{ t.all }}</button>
            <button class="pill" :class="{ on: typeFilter === 'agent' }" @click="typeFilter = 'agent'">{{ t.agents }}</button>
            <button class="pill" :class="{ on: typeFilter === 'skill' }" @click="typeFilter = 'skill'">{{ t.skills }}</button>
            <span class="pill-sep" />
            <button class="pill" :class="{ on: catFilter === 'all' }" @click="catFilter = 'all'">{{ t.all }}</button>
            <button v-for="c in categories" :key="c" class="pill" :class="{ on: catFilter === c }" @click="catFilter = c">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="catIcons[c] || ''" />
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
            <!-- Color header band -->
            <div class="card-band">
              <span class="card-icon">
                <svg v-if="item.type === 'agent'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              </span>
            </div>
            <!-- Content -->
            <div class="card-body">
              <div class="card-name-row">
                <span class="card-name">{{ item.displayName }}</span>
                <span class="card-source-dot" :class="item.source" />
                <span class="card-cat-pill">{{ catLabel(item.category) }}</span>
              </div>
              <p class="card-desc">{{ item.description }}</p>
              <div class="card-footer">
                <span class="card-author">{{ item.author }}</span>
                <button class="card-copy" @click.stop="selected = item; copyCmd()" :title="t.copy">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="ct-empty">
          <p>{{ t.noResults }}</p>
          <p class="ct-empty-sub">{{ t.tryOther }}</p>
          <button class="pill on" @click="search = ''; typeFilter = 'all'; catFilter = 'all'">{{ t.clear }}</button>
        </div>
      </div>

      <!-- DETAIL VIEW -->
      <div v-else-if="view === 'detail' && selected" key="detail" class="ct-view ct-detail" :style="{ '--c': selected.color }">
        <span class="dt-back" @click="goBack">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {{ t.back }}
        </span>

        <!-- Gradient hero -->
        <div class="dt-hero">
          <div class="dt-hero-icon">
            <svg v-if="selected.type === 'agent'" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          </div>
          <h1 class="dt-hero-title">{{ selected.displayName }}</h1>
          <div class="dt-hero-badges">
            <span class="dt-badge" :class="selected.source">{{ selected.source === 'official' ? t.official : t.community }}</span>
            <span class="dt-badge cat">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="catIcons[selected.category] || ''" />
              {{ catLabel(selected.category) }}
            </span>
          </div>
          <!-- Command pill -->
          <div class="dt-cmd-pill">
            <code>{{ selected.copyCommand }}</code>
            <button class="dt-cmd-copy" :class="{ ok: detailCopied }" @click="copyCmd">
              <svg v-if="!detailCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              {{ detailCopied ? t.copied : t.copy }}
            </button>
          </div>
        </div>

        <!-- Two-column layout -->
        <div class="dt-layout">
          <main class="dt-main">
            <p class="dt-desc">{{ selected.description }}</p>

            <!-- Workflow as cards -->
            <section v-if="getWorkflowPhases(selected).length" class="dt-section">
              <h2 class="dt-section-title"><span class="dt-dot" /> {{ t.workflow }}</h2>
              <div class="dt-wf-cards">
                <div v-for="(phase, idx) in getWorkflowPhases(selected)" :key="idx" class="dt-wf-card">
                  <span class="dt-wf-num">{{ idx + 1 }}</span>
                  <div class="dt-wf-body">
                    <span class="dt-wf-name">{{ phase.name }}</span>
                    <ul v-if="phase.steps.length" class="dt-wf-steps">
                      <li v-for="step in phase.steps" :key="step">{{ step }}</li>
                    </ul>
                  </div>
                  <div v-if="idx < getWorkflowPhases(selected).length - 1" class="dt-wf-connector" />
                </div>
              </div>
            </section>

            <!-- Content sections -->
            <section v-for="sec in selected.sections.filter(s => !s.title.toLowerCase().includes('workflow'))" :key="sec.title" class="dt-section">
              <h2 class="dt-section-title"><span class="dt-dot" /> {{ sec.title }}</h2>
              <div class="dt-prose" v-html="formatContent(sec.content)"></div>
            </section>

            <!-- Usage tip -->
            <section class="dt-section">
              <h2 class="dt-section-title"><span class="dt-dot" /> {{ t.tip }}</h2>
              <div class="dt-tip">
                <code v-if="selected.type === 'agent'">{{ isPtBR ? `Use "${selected.copyCommand}" seguido de uma descrição da tarefa.` : `Use "${selected.copyCommand}" followed by a task description.` }}</code>
                <code v-else>{{ isPtBR ? `Execute "${selected.copyCommand}" na sua IDE para iniciar.` : `Run "${selected.copyCommand}" in your IDE to get started.` }}</code>
              </div>
            </section>
          </main>

          <!-- Sidebar -->
          <aside class="dt-sidebar">
            <div class="dt-meta-card">
              <div class="dt-meta-row"><span>{{ t.type }}</span><span class="dt-meta-val">{{ selected.type === 'agent' ? t.agent : t.skill }}</span></div>
              <div class="dt-meta-row">
                <span>{{ t.category }}</span>
                <span class="dt-meta-val dt-meta-cat">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2" v-html="catIcons[selected.category] || ''" />
                  {{ catLabel(selected.category) }}
                </span>
              </div>
              <div class="dt-meta-row"><span>{{ t.author }}</span><span class="dt-meta-val">{{ selected.author }}</span></div>
              <div class="dt-meta-row"><span>{{ t.source }}</span><span class="dt-meta-val">{{ selected.source === 'official' ? t.official : t.community }}</span></div>
            </div>

            <div v-if="selected.tools.length" class="dt-tools-card">
              <h3 class="dt-tools-title">{{ t.tools }}</h3>
              <div class="dt-tools-list">
                <span v-for="tool in selected.tools" :key="tool" class="dt-tool">{{ tool }}</span>
              </div>
            </div>

            <div v-if="selected.tags.length" class="dt-tools-card">
              <h3 class="dt-tools-title">Tags</h3>
              <div class="dt-tools-list">
                <span v-for="tag in selected.tags" :key="tag" class="dt-tag">{{ tag }}</span>
              </div>
            </div>

            <a :href="selected.sourceUrl" target="_blank" rel="noopener" class="dt-github-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
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
  padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
  color: var(--vp-c-text-3); text-decoration: none; transition: all .15s;
}
.version-link:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }
.version-link.active { background: var(--vp-c-brand-1); color: #fff; }

/* ═══ LAYOUT ═══ */
.ct { max-width: 1120px; margin: 0 auto; padding: 0 24px 64px; min-height: 80vh; overflow: hidden; }

/* ═══ HEADER ═══ */
.ct-header { padding: 32px 0 24px; }
.ct-header-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.ct-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.ct-logo-text {
  font-size: 26px; font-weight: 800; letter-spacing: -.02em;
  background: linear-gradient(135deg, #4A7FCF 0%, #CD7F32 40%, #2B5EA7 70%, #CD7F32 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  background-size: 200% 100%; animation: ct-gradient 6s ease infinite;
}
.ct-subtitle { font-size: 14px; color: var(--vp-c-text-2); margin: 0; line-height: 1.5; }
.ct-stats {
  display: flex; align-items: center; gap: 18px; padding: 12px 24px;
  background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 10px; flex-shrink: 0;
}
.ct-stat { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.ct-stat-n { font-size: 24px; font-weight: 800; color: var(--vp-c-brand-1); line-height: 1; }
.ct-stat-l { font-size: 10px; font-weight: 700; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: .5px; }
.ct-stat-sep { width: 1px; height: 28px; background: var(--vp-c-divider); }

/* ═══ TRANSITIONS ═══ */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform .35s cubic-bezier(.4,0,.2,1), opacity .35s ease;
}
.slide-left-enter-from { transform: translateX(60px); opacity: 0; }
.slide-left-leave-to { transform: translateX(-60px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-60px); opacity: 0; }
.slide-right-leave-to { transform: translateX(60px); opacity: 0; }
.ct-view { width: 100%; }

/* ═══ TOOLBAR ═══ */
.ct-toolbar { margin-bottom: 14px; display: flex; flex-direction: column; gap: 10px; }
.ct-search-box {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-3);
}
.ct-search-box input { flex: 1; border: none; background: none; outline: none; font-size: 14px; color: var(--vp-c-text-1); }
.ct-search-box input::placeholder { color: var(--vp-c-text-3); }
.ct-search-box:focus-within { border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 2px var(--vp-c-brand-soft); }
.ct-pills { display: flex; gap: 5px; flex-wrap: wrap; }
.pill {
  display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px;
  border: 1px solid var(--vp-c-divider); border-radius: 18px;
  background: var(--vp-c-bg); color: var(--vp-c-text-2); font-size: 12px; font-weight: 500;
  cursor: pointer; white-space: nowrap; transition: all .15s; line-height: 1;
}
.pill:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.pill.on { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); color: #fff; }
.pill.on svg { stroke: #fff; }
.pill-sep { width: 1px; height: 24px; background: var(--vp-c-divider); flex-shrink: 0; align-self: center; margin: 0 2px; }
.ct-count { font-size: 12px; color: var(--vp-c-text-3); margin-bottom: 14px; }

/* ═══ GRID ═══ */
.ct-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

/* ═══ CARD — Showcase style ═══ */
.card {
  min-height: 180px; padding: 0; border-radius: 14px; overflow: hidden;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  cursor: pointer; display: flex; flex-direction: column;
  transition: transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s ease, border-color .25s ease;
  position: relative;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px color-mix(in srgb, var(--c) 12%, rgba(0,0,0,0.08));
  border-color: color-mix(in srgb, var(--c) 30%, var(--vp-c-divider));
}
.card:hover .card-band {
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 25%, var(--vp-c-bg-soft)), color-mix(in srgb, var(--c) 10%, var(--vp-c-bg-soft)));
}

/* Band */
.card-band {
  height: 48px; position: relative;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 15%, var(--vp-c-bg-soft)), color-mix(in srgb, var(--c) 5%, var(--vp-c-bg-soft)));
  transition: background .25s ease;
}
.card-icon {
  width: 40px; height: 40px; border-radius: 12px; background: var(--vp-c-bg);
  display: flex; align-items: center; justify-content: center;
  position: absolute; bottom: -20px; left: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid var(--vp-c-divider);
}

/* Body */
.card-body { padding: 28px 18px 18px; display: flex; flex-direction: column; flex: 1; }
.card-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
.card-name { font-size: 15px; font-weight: 800; color: var(--vp-c-text-1); }
.card-source-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.card-source-dot.official { background: var(--vp-c-brand-1); }
.card-source-dot.community { background: #CD7F32; }
.card-cat-pill {
  font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 5px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-3);
  text-transform: uppercase; letter-spacing: .3px; white-space: nowrap;
}
.card-desc {
  font-size: 13px; line-height: 1.5; color: var(--vp-c-text-2); margin: 0 0 auto;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  padding-bottom: 12px;
}
.card-footer { display: flex; align-items: center; justify-content: space-between; }
.card-author { font-size: 11px; color: var(--vp-c-text-3); font-weight: 500; }
.card-copy {
  width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg); color: var(--vp-c-text-3); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.card-copy:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ═══ EMPTY ═══ */
.ct-empty { text-align: center; padding: 48px 24px; color: var(--vp-c-text-2); }
.ct-empty p { margin: 0 0 6px; }
.ct-empty-sub { font-size: 13px; color: var(--vp-c-text-3); margin-bottom: 16px !important; }

/* ═══════════════════════════════════════════ */
/* ═══ DETAIL VIEW — Showcase ═══ */
/* ═══════════════════════════════════════════ */
.dt-back {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
  cursor: pointer; color: var(--vp-c-text-3); margin: 8px 0 20px;
  transition: color .15s; font-size: 13px; font-weight: 500; border-radius: 8px;
}
.dt-back:hover { color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }

/* Hero */
.dt-hero {
  position: relative; text-align: center; padding: 40px 24px 32px;
  border-radius: 16px; margin-bottom: 32px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--c) 18%, var(--vp-c-bg-soft)), color-mix(in srgb, var(--c) 6%, var(--vp-c-bg-soft)));
}
.dt-hero-icon {
  width: 64px; height: 64px; border-radius: 18px; background: var(--vp-c-bg);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid var(--vp-c-divider);
}
.dt-hero-title { font-size: 32px; font-weight: 800; color: var(--vp-c-text-1); margin: 0 0 12px; font-family: var(--vp-font-family-mono); }
.dt-hero-badges { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; }
.dt-badge {
  display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700;
  padding: 3px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: .4px;
}
.dt-badge.official { background: rgba(43,94,167,.15); color: var(--vp-c-brand-1); }
.dt-badge.community { background: rgba(205,127,50,.15); color: #CD7F32; }
.dt-badge.cat { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }

/* Command pill */
.dt-cmd-pill {
  display: inline-flex; align-items: center; gap: 12px; max-width: 500px;
  margin: 0 auto; padding: 10px 10px 10px 20px;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.dt-cmd-pill code { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); }
.dt-cmd-copy {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 18px; border: none;
  background: var(--vp-c-brand-1); color: #fff; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: opacity .15s; white-space: nowrap;
}
.dt-cmd-copy:hover { opacity: .9; }
.dt-cmd-copy.ok { background: #10b981; }

/* Layout */
.dt-layout { display: grid; grid-template-columns: 1fr 240px; gap: 36px; }
.dt-main { min-width: 0; }
.dt-desc { font-size: 16px; line-height: 1.7; color: var(--vp-c-text-2); margin: 0 0 32px; }

/* Sections */
.dt-section { margin-bottom: 32px; }
.dt-section-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 17px; font-weight: 700; color: var(--vp-c-text-1); margin: 0 0 16px;
  padding-bottom: 10px; border-bottom: 1px solid var(--vp-c-divider);
}
.dt-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex-shrink: 0; }

/* Workflow cards */
.dt-wf-cards { display: flex; flex-direction: column; gap: 0; }
.dt-wf-card {
  display: flex; align-items: flex-start; gap: 12px; position: relative;
  padding: 14px 16px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider);
  border-radius: 10px; margin-bottom: 0;
}
.dt-wf-card + .dt-wf-card { margin-top: 12px; }
.dt-wf-num {
  width: 26px; height: 26px; border-radius: 50%; background: var(--c); color: #fff;
  font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.dt-wf-body { flex: 1; min-width: 0; }
.dt-wf-name { font-size: 14px; font-weight: 700; color: var(--vp-c-text-1); }
.dt-wf-steps { margin: 6px 0 0; padding: 0 0 0 16px; list-style: none; }
.dt-wf-steps li {
  font-size: 12px; color: var(--vp-c-text-2); line-height: 1.6; position: relative; padding-left: 12px;
}
.dt-wf-steps li::before {
  content: ''; position: absolute; left: 0; top: 7px;
  width: 4px; height: 4px; border-radius: 50%;
  background: color-mix(in srgb, var(--c) 50%, var(--vp-c-text-3));
}
.dt-wf-connector {
  position: absolute; left: 29px; bottom: -13px;
  width: 2px; height: 12px; background: var(--c); opacity: .3;
}

/* Prose */
.dt-prose { font-size: 13px; line-height: 1.7; color: var(--vp-c-text-2); }
.dt-prose :deep(.fc-h3) { font-weight: 700; color: var(--vp-c-text-1); margin: 12px 0 4px; font-size: 14px; }
.dt-prose :deep(.fc-li) { display: flex; align-items: baseline; gap: 6px; margin: 2px 0; }
.dt-prose :deep(.fc-num) { font-weight: 600; color: var(--vp-c-text-3); min-width: 18px; }
.dt-prose :deep(.fc-dot) { width: 4px; height: 4px; border-radius: 50%; background: var(--vp-c-text-3); flex-shrink: 0; margin-top: 7px; }
.dt-prose :deep(strong) { color: var(--vp-c-text-1); }

/* Tip */
.dt-tip code {
  display: block; padding: 14px 18px; border-radius: 10px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-2);
  font-size: 14px; font-family: var(--vp-font-family-mono); line-height: 1.5;
}

/* ── Sidebar ── */
.dt-sidebar { position: sticky; top: 80px; align-self: start; display: flex; flex-direction: column; gap: 14px; }
.dt-meta-card {
  border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden;
  border-left: 3px solid var(--c);
}
.dt-meta-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-bottom: 1px solid var(--vp-c-divider); font-size: 12px;
}
.dt-meta-row:last-child { border-bottom: none; }
.dt-meta-row > span:first-child { color: var(--vp-c-text-3); font-weight: 500; }
.dt-meta-val { color: var(--vp-c-text-1); font-weight: 600; }
.dt-meta-cat { display: flex; align-items: center; gap: 4px; }

.dt-tools-card { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: 14px; }
.dt-tools-title { font-size: 11px; font-weight: 700; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: .5px; margin: 0 0 8px; }
.dt-tools-list { display: flex; flex-wrap: wrap; gap: 4px; }
.dt-tool {
  font-size: 11px; padding: 3px 8px; border-radius: 5px;
  background: var(--vp-c-default-soft); color: var(--vp-c-text-2); font-weight: 500; font-family: var(--vp-font-family-mono);
}
.dt-tag {
  font-size: 11px; padding: 3px 8px; border-radius: 5px;
  background: color-mix(in srgb, var(--c) 8%, var(--vp-c-bg-soft)); color: var(--vp-c-text-2); font-weight: 500;
}

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
}
@media (max-width: 640px) {
  .ct-header-inner { flex-direction: column; align-items: flex-start; }
  .ct-header { padding: 28px 0 20px; }
  .ct-stats { align-self: stretch; justify-content: center; }
  .ct-grid { grid-template-columns: 1fr; }
  .dt-hero { padding: 28px 16px 24px; }
  .dt-hero-title { font-size: 24px; }
  .dt-cmd-pill { flex-direction: column; gap: 8px; padding: 12px; border-radius: 14px; }
}

@keyframes ct-gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

@media (prefers-reduced-motion: reduce) {
  .slide-left-enter-active, .slide-left-leave-active,
  .slide-right-enter-active, .slide-right-leave-active { transition: none; }
  .ct-logo-text { animation: none; }
  .card { transition: none; }
}
</style>
