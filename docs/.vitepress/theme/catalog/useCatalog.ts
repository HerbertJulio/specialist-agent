import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useData } from 'vitepress'
import { data } from '../../../catalog.data'
import type { CatalogItem } from '../../../catalog.data'
import { formatContent } from './formatContent'

export type { CatalogItem }
export { data, formatContent }

export function useCatalog() {
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

  // State
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

  function catLabel(c: string) {
    const map: Record<string, string> = { workflow: t.value.wf }
    return map[c] || (t.value as any)[c] || c
  }

  // Hash routing
  function itemToHash(item: CatalogItem): string {
    return `#${item.type}-${item.name}`
  }

  function findItemByHash(hash: string): CatalogItem | null {
    if (!hash || hash === '#') return null
    const clean = hash.replace('#', '')
    const dashIdx = clean.indexOf('-')
    if (dashIdx === -1) return null
    const type = clean.slice(0, dashIdx) as 'agent' | 'skill'
    const name = clean.slice(dashIdx + 1)
    return data.find(i => i.type === type && i.name === name) || null
  }

  function syncFromHash() {
    if (typeof window === 'undefined') return
    const item = findItemByHash(window.location.hash)
    if (item) {
      selected.value = item
      view.value = 'detail'
      detailCopied.value = false
    } else if (view.value === 'detail') {
      view.value = 'list'
      selected.value = null
    }
  }

  function openDetail(item: CatalogItem) {
    slideDir.value = 'forward'
    selected.value = item
    view.value = 'detail'
    detailCopied.value = false
    if (typeof window !== 'undefined') {
      history.pushState(null, '', itemToHash(item))
    }
    nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  function goBack() {
    slideDir.value = 'back'
    view.value = 'list'
    selected.value = null
    if (typeof window !== 'undefined') {
      history.pushState(null, '', window.location.pathname)
    }
  }

  async function copyCmd() {
    if (!selected.value) return
    try { await navigator.clipboard.writeText(selected.value.copyCommand) }
    catch { const ta = document.createElement('textarea'); ta.value = selected.value!.copyCommand; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta) }
    detailCopied.value = true
    setTimeout(() => { detailCopied.value = false }, 2000)
  }

  function getWorkflowPhases(item: CatalogItem): { name: string; steps: string[] }[] {
    const wfSection = item.sections.find(s => s.title.toLowerCase().includes('workflow'))
    if (!wfSection) return []
    const phases: { name: string; steps: string[] }[] = []
    let currentPhase = ''
    let currentSteps: string[] = []
    for (const line of wfSection.content.split('\n')) {
      const phaseMatch = line.match(/^###\s+(.+)$/)
      if (phaseMatch) {
        if (currentPhase) phases.push({ name: currentPhase, steps: currentSteps })
        currentPhase = phaseMatch[1].replace(/^(Phase|Step|Fase|Etapa)\s*\d+[:\s-]*/i, '').trim()
        currentSteps = []
      } else {
        const stepMatch = line.match(/^\d+\.\s+(.+)$/)
        if (stepMatch) currentSteps.push(stepMatch[1].trim())
      }
    }
    if (currentPhase) phases.push({ name: currentPhase, steps: currentSteps })
    return phases
  }

  // Lifecycle
  function onHashChange() { syncFromHash() }
  function onPopstate() { syncFromHash() }
  function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && view.value !== 'list') goBack() }

  onMounted(() => {
    syncFromHash()
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onPopstate)
    document.addEventListener('keydown', onKey)
  })
  onUnmounted(() => {
    window.removeEventListener('hashchange', onHashChange)
    window.removeEventListener('popstate', onPopstate)
    document.removeEventListener('keydown', onKey)
  })

  return {
    data, isPtBR, t, catIcons,
    search, typeFilter, catFilter,
    selected, view, detailCopied,
    slideDir, transitionName,
    agentCount, skillCount, categories, filtered,
    catLabel, openDetail, goBack, copyCmd,
    getWorkflowPhases, formatContent,
  }
}
