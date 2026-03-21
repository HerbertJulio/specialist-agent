import fs from 'fs'
import path from 'path'

export interface CatalogSection {
  title: string
  content: string
}

export interface CatalogItem {
  type: 'agent' | 'skill'
  name: string
  displayName: string
  description: string
  color: string
  category: string
  author: string
  authorUrl: string
  tags: string[]
  source: 'official' | 'community'
  sourceUrl: string
  copyCommand: string
  tools: string[]
  sections: CatalogSection[]
}

const GITHUB_BASE = 'https://github.com/HerbertJulio/specialist-agent/blob/main'

const AGENT_CATEGORIES: Record<string, string> = {
  starter: 'core', builder: 'core', reviewer: 'core', doctor: 'core', migrator: 'core',
  planner: 'workflow', executor: 'workflow', tdd: 'workflow', debugger: 'workflow',
  pair: 'workflow', analyst: 'workflow', orchestrator: 'workflow',
  api: 'specialist', perf: 'specialist', i18n: 'specialist', docs: 'specialist',
  refactor: 'specialist', deps: 'specialist', finance: 'specialist', cloud: 'specialist',
  security: 'specialist', designer: 'specialist', data: 'specialist', devops: 'specialist',
  tester: 'specialist', legal: 'specialist', architect: 'specialist', ripple: 'specialist',
  marketing: 'business', product: 'business', support: 'business',
  'sentry-triage': 'automation', autopilot: 'automation',
  scout: 'support', explorer: 'support', memory: 'support',
}

const SKILL_CATEGORIES: Record<string, string> = {
  brainstorm: 'planning', plan: 'planning', discovery: 'planning', estimate: 'planning', prd: 'planning',
  tdd: 'development', debug: 'development', autofix: 'development', lint: 'development',
  commit: 'development', autopilot: 'development',
  verify: 'quality', codereview: 'quality', audit: 'quality', health: 'quality',
  grill: 'quality', 'design-review': 'quality', cro: 'quality', 'seo-audit': 'quality',
  'migrate-framework': 'migration', 'migrate-architecture': 'migration', 'improve-architecture': 'migration',
  checkpoint: 'workflow', finish: 'workflow', worktree: 'workflow',
  learn: 'knowledge', remember: 'knowledge', recall: 'knowledge', onboard: 'knowledge',
  tutorial: 'knowledge', 'write-skill': 'knowledge', copywriting: 'business',
}

function extractData(filePath: string): { meta: Record<string, string>; sections: CatalogSection[] } {
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split('\n')
  let inFrontmatter = false
  let endLine = 0
  const meta: Record<string, string> = {}

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (inFrontmatter) { endLine = i + 1; break }
      inFrontmatter = true
      continue
    }
    if (inFrontmatter) {
      const match = lines[i].match(/^([\w-]+):\s*"?([^"]*)"?\s*$/)
      if (match) meta[match[1]] = match[2].trim()
    }
  }

  // Extract top-level ## sections
  const sections: CatalogSection[] = []
  const body = lines.slice(endLine)
  let currentTitle = ''
  let currentLines: string[] = []

  for (const line of body) {
    const headingMatch = line.match(/^##\s+(.+)$/)
    if (headingMatch) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentLines.join('\n').trim() })
      }
      currentTitle = headingMatch[1]
      currentLines = []
    } else if (currentTitle) {
      currentLines.push(line)
    }
  }
  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentLines.join('\n').trim() })
  }

  // Limit to key sections to avoid bloating the bundle
  const keySections = ['Mission', 'Core Principles', 'Workflow', 'Rules', 'Output', 'When to Use']
  const filtered = sections
    .filter(s => keySections.some(k => s.title.includes(k)))
    .slice(0, 4)
    .map(s => ({
      title: s.title,
      content: s.content.length > 600 ? s.content.slice(0, 600) + '...' : s.content,
    }))

  return { meta, sections: filtered }
}

function scanAgents(dir: string, source: 'official' | 'community', relPath: string): CatalogItem[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.includes('-lite'))
    .map(f => {
      const filePath = path.join(dir, f)
      const { meta, sections } = extractData(filePath)
      const name = meta.name || f.replace('.md', '')
      return {
        type: 'agent' as const, name,
        displayName: `@${name}`,
        description: (meta.description || '').replace(/^Use when\s+/i, ''),
        color: meta.color || '#4A7FCF',
        category: AGENT_CATEGORIES[name] || 'specialist',
        author: meta.author || 'Specialist Agent',
        authorUrl: meta['author-url'] || 'https://github.com/HerbertJulio',
        tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
        source, sourceUrl: `${GITHUB_BASE}/${relPath}/${f}`,
        copyCommand: `@${name}`,
        tools: meta.tools ? meta.tools.split(',').map(t => t.trim()) : [],
        sections,
      }
    })
}

function scanSkills(dir: string, source: 'official' | 'community', relPath: string): CatalogItem[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(d => fs.existsSync(path.join(dir, d, 'SKILL.md')))
    .map(d => {
      const filePath = path.join(dir, d, 'SKILL.md')
      const { meta, sections } = extractData(filePath)
      const name = meta.name || d
      return {
        type: 'skill' as const, name,
        displayName: `/${name}`,
        description: (meta.description || '').replace(/^Use when\s+/i, ''),
        color: '#CD7F32',
        category: SKILL_CATEGORIES[name] || 'workflow',
        author: meta.author || 'Specialist Agent',
        authorUrl: meta['author-url'] || 'https://github.com/HerbertJulio',
        tags: meta.tags ? meta.tags.split(',').map(t => t.trim()) : [],
        source, sourceUrl: `${GITHUB_BASE}/${relPath}/${d}/SKILL.md`,
        copyCommand: `/${name}`,
        tools: meta['allowed-tools'] ? meta['allowed-tools'].split(',').map(t => t.trim()) : [],
        sections,
      }
    })
}

export default {
  watch: ['../agents/*.md', '../skills/*/SKILL.md', '../community/agents/*.md', '../community/skills/*/SKILL.md'],
  load(): CatalogItem[] {
    const root = path.resolve(__dirname, '..')
    const items: CatalogItem[] = [
      ...scanAgents(path.join(root, 'agents'), 'official', 'agents'),
      ...scanSkills(path.join(root, 'skills'), 'official', 'skills'),
      ...scanAgents(path.join(root, 'community', 'agents'), 'community', 'community/agents'),
      ...scanSkills(path.join(root, 'community', 'skills'), 'community', 'community/skills'),
    ]
    items.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'agent' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    return items
  },
}
