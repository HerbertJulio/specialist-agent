#!/usr/bin/env node

import { createInterface } from 'readline'
import { existsSync, mkdirSync, cpSync, readdirSync, readFileSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

const GREEN = '\x1b[32m'
const BLUE = '\x1b[34m'
const YELLOW = '\x1b[33m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const NC = '\x1b[0m'

const rl = createInterface({ input: process.stdin, output: process.stdout })

function ask(question, options) {
  return new Promise((resolve) => {
    if (options) {
      console.log()
      options.forEach((opt, i) => {
        console.log(`  ${BOLD}${i + 1}${NC}) ${opt.label}${opt.hint ? ` ${DIM}${opt.hint}${NC}` : ''}`)
      })
      console.log()
    }
    rl.question(`${BLUE}${question}${NC} `, (answer) => {
      if (options) {
        const idx = parseInt(answer, 10) - 1
        resolve(idx >= 0 && idx < options.length ? options[idx].value : options[0].value)
      } else {
        resolve(answer.trim())
      }
    })
  })
}

function copyDir(src, dest) {
  if (!existsSync(src)) return 0
  cpSync(src, dest, { recursive: true })
  return countFiles(dest)
}

function countFiles(dir) {
  if (!existsSync(dir)) return 0
  let count = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) count += countFiles(join(dir, entry.name))
    else if (entry.name.endsWith('.md')) count++
  }
  return count
}

function getAgentNames(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const content = readFileSync(join(dir, f), 'utf-8')
      const match = content.match(/^name:\s*(.+)$/m)
      return match ? match[1].trim() : f.replace('.md', '')
    })
}

async function main() {
  console.log()
  console.log(`${BOLD}${BLUE}  ╔══════════════════════════════════════╗${NC}`)
  console.log(`${BOLD}${BLUE}  ║        Specialist Agent — Setup Wizard      ║${NC}`)
  console.log(`${BOLD}${BLUE}  ╚══════════════════════════════════════╝${NC}`)
  console.log()
  console.log(`  ${DIM}AI agents for Claude Code — any framework, any stack${NC}`)
  console.log()

  // Check we're in a project
  const cwd = process.cwd()
  if (!existsSync(join(cwd, 'package.json'))) {
    console.log(`${YELLOW}  ⚠  No package.json found in current directory.${NC}`)
    console.log(`  Run this command from the root of your project.`)
    console.log()
    rl.close()
    process.exit(1)
  }

  // 1. Framework
  const packs = readdirSync(join(ROOT, 'packs'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  const packLabels = { vue: 'Vue 3', react: 'React', nextjs: 'Next.js', svelte: 'SvelteKit' }

  const packOptions = packs.map(p => ({
    label: packLabels[p] || p.charAt(0).toUpperCase() + p.slice(1),
    value: p,
    hint: ''
  }))

  const framework = await ask('Which framework?', packOptions)

  // 2. Mode
  const mode = await ask('Agent mode?', [
    { label: 'Full', value: 'full', hint: '(Sonnet/Opus — detailed output, validation)' },
    { label: 'Lite', value: 'lite', hint: '(Haiku — lower cost, faster)' },
  ])

  // 3. Starter agent
  const installStarter = await ask('Install @starter agent? (creates projects from scratch)', [
    { label: 'Yes', value: true, hint: '(recommended)' },
    { label: 'No', value: false, hint: '' },
  ])

  // 4. Specialist agents
  const installSpecialists = await ask('Install specialist agents? (@finance, @cloud, @security, @designer, @data, @devops, @tester)', [
    { label: 'Yes', value: true, hint: '(recommended)' },
    { label: 'No', value: false, hint: '' },
  ])

  console.log()
  console.log(`${BLUE}  ─────────────────────────────────────${NC}`)
  console.log(`  ${BOLD}Installing Specialist Agent${NC}`)
  console.log(`  ${DIM}Pack: ${framework} | Mode: ${mode} | Starter: ${installStarter ? 'yes' : 'no'} | Specialists: ${installSpecialists ? 'yes' : 'no'}${NC}`)
  console.log(`${BLUE}  ─────────────────────────────────────${NC}`)
  console.log()

  const packDir = join(ROOT, 'packs', framework)
  const agentsSource = mode === 'lite' ? join(packDir, 'agents-lite') : join(packDir, 'agents')
  const skillsSource = join(packDir, 'skills')
  const archSource = join(packDir, 'ARCHITECTURE.md')
  const claudeSource = join(packDir, 'CLAUDE.md')

  // Install agents
  const agentsDest = join(cwd, '.claude', 'agents')
  mkdirSync(agentsDest, { recursive: true })
  const agentCount = copyDir(agentsSource, agentsDest)
  const agentNames = getAgentNames(agentsDest)

  agentNames.forEach(name => {
    console.log(`  ${GREEN}✅${NC} @${name}`)
  })
  console.log(`  ${GREEN}${agentCount} agents installed${NC}`)

  // Install starter agent
  if (installStarter) {
    const starterFile = mode === 'lite' ? 'starter-lite.md' : 'starter.md'
    const starterSource = join(ROOT, 'agents', starterFile)
    const starterDest = join(agentsDest, 'starter.md')

    if (existsSync(starterSource)) {
      cpSync(starterSource, starterDest)
      console.log(`  ${GREEN}✅${NC} @starter`)
    }
  }

  // Install specialist agents
  if (installSpecialists) {
    const specialistNames = ['finance', 'cloud', 'security', 'designer', 'data', 'devops', 'tester']
    for (const name of specialistNames) {
      const suffix = mode === 'lite' ? `-lite.md` : '.md'
      const source = join(ROOT, 'agents', `${name}${suffix}`)
      const dest = join(agentsDest, `${name}.md`)

      if (existsSync(source)) {
        cpSync(source, dest)
        console.log(`  ${GREEN}✅${NC} @${name}`)
      }
    }
  }

  // Install skills
  console.log()
  const skillsDest = join(cwd, '.claude', 'skills')
  mkdirSync(skillsDest, { recursive: true })
  const skillCount = copyDir(skillsSource, skillsDest)
  console.log(`  ${GREEN}${skillCount} skills installed${NC}`)

  // Install ARCHITECTURE.md
  console.log()
  const archDest = join(cwd, 'docs', 'ARCHITECTURE.md')
  if (!existsSync(archDest)) {
    mkdirSync(dirname(archDest), { recursive: true })
    cpSync(archSource, archDest)
    console.log(`  ${GREEN}✅${NC} docs/ARCHITECTURE.md`)
  } else {
    console.log(`  ${YELLOW}⚠${NC}  docs/ARCHITECTURE.md already exists (not overwritten)`)
  }

  // Install CLAUDE.md
  const claudeDest = join(cwd, 'CLAUDE.md')
  if (!existsSync(claudeDest)) {
    cpSync(claudeSource, claudeDest)
    console.log(`  ${GREEN}✅${NC} CLAUDE.md`)
  } else {
    console.log(`  ${YELLOW}⚠${NC}  CLAUDE.md already exists (not overwritten)`)
  }

  // Done
  console.log()
  console.log(`${GREEN}  ══════════════════════════════════════${NC}`)
  console.log(`${GREEN}  🎉  Specialist Agent installed successfully!${NC}`)
  console.log(`${GREEN}  ══════════════════════════════════════${NC}`)
  console.log()

  if (mode === 'lite') {
    console.log(`  ${YELLOW}Lite mode: agents run on Haiku model (lower cost, faster).${NC}`)
    console.log(`  ${YELLOW}To switch to Full agents: npx specialist-agent init${NC}`)
    console.log()
  }

  console.log(`  Open Claude Code and try:`)
  console.log()
  console.log(`    claude`)
  console.log(`    /agents                                 ${DIM}# list agents${NC}`)
  console.log(`    /dev-create-module marketplace           ${DIM}# scaffold a module${NC}`)
  console.log(`    /review-check-architecture               ${DIM}# validate architecture${NC}`)
  console.log()
  console.log(`  Or just ask:`)
  console.log()
  console.log(`    ${DIM}"Use @builder to create the products module with CRUD"${NC}`)
  console.log(`    ${DIM}"Use @reviewer to explore src/modules/auth/"${NC}`)
  console.log(`    ${DIM}"Use @doctor to investigate the dashboard error"${NC}`)
  console.log()

  rl.close()
}

main().catch((err) => {
  console.error(err)
  rl.close()
  process.exit(1)
})
