<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import type { CatalogItem } from '../../catalog.data'

const props = defineProps<{ item: CatalogItem }>()
const emit = defineEmits<{ (e: 'select', item: CatalogItem): void }>()

const { lang } = useData()
const isPtBR = computed(() => lang.value === 'pt-BR')

const copied = ref(false)

async function copyCmd(e: Event) {
  e.stopPropagation()
  try { await navigator.clipboard.writeText(props.item.copyCommand) }
  catch { const ta = document.createElement('textarea'); ta.value = props.item.copyCommand; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const catLabels: Record<string, string> = {
  core: 'Core', workflow: 'Workflow', specialist: isPtBR.value ? 'Especialista' : 'Specialist',
  business: isPtBR.value ? 'Negócios' : 'Business', automation: isPtBR.value ? 'Automação' : 'Automation',
  support: isPtBR.value ? 'Suporte' : 'Support', planning: isPtBR.value ? 'Planejamento' : 'Planning',
  development: isPtBR.value ? 'Desenvolvimento' : 'Development', quality: isPtBR.value ? 'Qualidade' : 'Quality',
  migration: isPtBR.value ? 'Migração' : 'Migration', knowledge: isPtBR.value ? 'Conhecimento' : 'Knowledge',
}
</script>

<template>
  <article class="card" :style="{ '--c': item.color }" @click="emit('select', item)">
    <div class="card-top">
      <span class="card-icon">
        <svg v-if="item.type === 'agent'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--c)" stroke-width="2.5"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
      </span>
      <code class="card-cmd">{{ item.displayName }}</code>
      <span class="card-cat">{{ catLabels[item.category] || item.category }}</span>
    </div>
    <p class="card-desc">{{ item.description }}</p>
    <div class="card-bottom">
      <span class="card-author">{{ item.author }}</span>
      <button class="card-copy" :class="{ ok: copied }" @click="copyCmd" :title="copied ? '✓' : 'Copy'">
        <svg v-if="!copied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  padding: 16px 18px; border: 1px solid var(--vp-c-divider); border-radius: 10px;
  background: var(--vp-c-bg-soft); cursor: pointer; display: flex; flex-direction: column;
  transition: border-color .2s, transform .2s, box-shadow .2s; position: relative; overflow: hidden;
}
.card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--c); opacity: 0; transition: opacity .2s;
}
.card:hover { border-color: color-mix(in srgb, var(--c) 40%, var(--vp-c-divider)); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.07); }
.card:hover::after { opacity: 1; }
.dark .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.25); }

.card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.card-icon {
  width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--c) 12%, transparent); flex-shrink: 0;
}
.card-cmd { font-size: 14px; font-weight: 700; color: var(--vp-c-text-1); flex: 1; background: none; padding: 0; }
.card-cat { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 5px; background: var(--vp-c-default-soft); color: var(--vp-c-text-3); white-space: nowrap; text-transform: uppercase; letter-spacing: .3px; }

.card-desc { font-size: 13px; line-height: 1.5; color: var(--vp-c-text-2); margin: 0 0 12px; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.card-bottom { display: flex; align-items: center; justify-content: space-between; }
.card-author { font-size: 11px; color: var(--vp-c-text-3); font-weight: 500; }
.card-copy {
  width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg); color: var(--vp-c-text-3); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.card-copy:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.card-copy.ok { border-color: #10b981; color: #10b981; background: rgba(16,185,129,.08); }
</style>
