#!/usr/bin/env node

import { createInterface } from 'readline'
import { existsSync, mkdirSync, cpSync, readdirSync, readFileSync, writeFileSync } from 'fs'
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
rl.on('close', () => {
  console.log()
  process.exit(0)
})

function ask(question, options) {
  return new Promise((resolve) => {
    const prompt = () => {
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
          if (idx >= 0 && idx < options.length) {
            resolve(options[idx].value)
          } else {
            console.log(`  ${YELLOW}Invalid choice. Please enter a number between 1 and ${options.length}.${NC}`)
            prompt()
          }
        } else {
          resolve(answer.trim())
        }
      })
    }
    prompt()
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
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))

  console.log()
  console.log(`${BOLD}${BLUE}  ╔═══════════════════════════════════════════════╗${NC}`)
  console.log(`${BOLD}${BLUE}  ║        Specialist Agent — Setup Wizard        ║${NC}`)
  console.log(`${BOLD}${BLUE}  ╚═══════════════════════════════════════════════╝${NC}`)
  console.log()
  console.log(`  ${DIM}AI agents for Claude Code — any framework, any stack  v${pkg.version}${NC}`)
  console.log()

  // Check we're in a project
  const cwd = process.cwd()
  if (!existsSync(join(cwd, 'package.json'))) {
    console.log(`${YELLOW}  ⚠  No package.json found in current directory.${NC}`)
    console.log()
    const createPkg = await ask('Create a package.json to initialize this project?', [
      { label: 'Yes', value: true, hint: '(recommended)' },
      { label: 'No', value: false, hint: '(exit)' },
    ])
    if (!createPkg) {
      console.log(`  Run this command from the root of your project.`)
      console.log()
      process.exit(1)
    }
    const dirName = cwd.split(/[\\/]/).pop() || 'my-project'
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({ name: dirName, version: '0.1.0', private: true }, null, 2) + '\n')
    console.log(`  ${GREEN}✅${NC} package.json created`)
    console.log()
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
  const installSpecialists = await ask('Install specialist agents? (@explorer, @finance, @cloud, @security, @designer, @data, @devops, @tester)', [
    { label: 'Yes', value: true, hint: '(recommended)' },
    { label: 'No', value: false, hint: '' },
  ])

  console.log()
  console.log(`${BLUE}  ───────────────────────────────────────────────${NC}`)
  console.log(`  ${BOLD}Installing Specialist Agent${NC}`)
  const packLabel = packLabels[framework] || framework
  console.log(`  ${DIM}Pack: ${packLabel} | Mode: ${mode} | Starter: ${installStarter ? 'yes' : 'no'} | Specialists: ${installSpecialists ? 'yes' : 'no'}${NC}`)
  console.log(`${BLUE}  ───────────────────────────────────────────────${NC}`)
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
    const specialistNames = ['explorer', 'finance', 'cloud', 'security', 'designer', 'data', 'devops', 'tester']
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
  if (skillCount > 0) {
    console.log(`  ${GREEN}${skillCount} skills installed${NC}`)
  } else {
    console.log(`  ${DIM}  No skills available for this pack${NC}`)
  }

  // Install ARCHITECTURE.md
  console.log()
  const archDest = join(cwd, 'docs', 'ARCHITECTURE.md')
  if (!existsSync(archDest)) {
    if (existsSync(archSource)) {
      mkdirSync(dirname(archDest), { recursive: true })
      cpSync(archSource, archDest)
      console.log(`  ${GREEN}✅${NC} docs/ARCHITECTURE.md`)
    } else {
      console.log(`  ${YELLOW}⚠${NC}  ARCHITECTURE.md not found in pack (skipped)`)
    }
  } else {
    console.log(`  ${YELLOW}⚠${NC}  docs/ARCHITECTURE.md already exists (not overwritten)`)
  }

  // Install CLAUDE.md
  const claudeDest = join(cwd, 'CLAUDE.md')
  if (!existsSync(claudeDest)) {
    if (existsSync(claudeSource)) {
      cpSync(claudeSource, claudeDest)
      console.log(`  ${GREEN}✅${NC} CLAUDE.md`)
    } else {
      console.log(`  ${YELLOW}⚠${NC}  CLAUDE.md not found in pack (skipped)`)
    }
  } else {
    console.log(`  ${YELLOW}⚠${NC}  CLAUDE.md already exists (not overwritten)`)
  }

  // Done
  console.log()
  console.log(`${GREEN}  ═══════════════════════════════════════════════${NC}`)
  console.log(`${GREEN}  🎉  Specialist Agent installed successfully!${NC}`)
  console.log(`${GREEN}  ═══════════════════════════════════════════════${NC}`)
  console.log()

  if (mode === 'lite') {
    console.log(`  ${YELLOW}Lite mode: agents run on Haiku model (lower cost, faster).${NC}`)
    console.log(`  ${YELLOW}To switch to Full agents: npx specialist-agent init${NC}`)
    console.log()
  }

  // Show installed skills as examples
  const installedSkills = existsSync(skillsDest)
    ? readdirSync(skillsDest, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => '/' + d.name)
    : []

  console.log(`  Open Claude Code and try:`)
  console.log()
  console.log(`    claude`)
  console.log(`    /agents                                 ${DIM}# list agents${NC}`)
  if (installedSkills.length > 0) {
    const examples = installedSkills.slice(0, 2)
    examples.forEach(skill => {
      console.log(`    ${skill}`)
    })
  }
  console.log()
  console.log(`  Or just ask:`)
  console.log()
  console.log(`    ${DIM}"Use @builder to create the products module with CRUD"${NC}`)
  console.log(`    ${DIM}"Use @reviewer to explore src/modules/auth/"${NC}`)
  console.log(`    ${DIM}"Use @doctor to investigate the dashboard error"${NC}`)
  console.log()

  rl.close()
}

const args = process.argv.slice(2)

const validCommands = ['init']
const command = args.find(a => !a.startsWith('-'))
if (command && !validCommands.includes(command)) {
  console.error(`  ${YELLOW}Unknown command: ${command}${NC}`)
  console.error(`  Run ${BOLD}specialist-agent --help${NC} for usage.`)
  process.exit(1)
}

if (args.includes('--help') || args.includes('-h')) {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
  console.log()
  console.log(`  ${BOLD}specialist-agent${NC} v${pkg.version}`)
  console.log()
  console.log('  Usage: specialist-agent [init] [options]')
  console.log()
  console.log('  Options:')
  console.log('    -h, --help      Show this help message')
  console.log('    -v, --version   Show version number')
  console.log()
  console.log('  Run the setup wizard to install AI agents for Claude Code.')
  console.log('  Can be executed from any directory (creates package.json if needed).')
  console.log()
  process.exit(0)
}

if (args.includes('--version') || args.includes('-v')) {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
  console.log(pkg.version)
  process.exit(0)
}

main().catch((err) => {
  console.error(`  ${YELLOW}Error: ${err.message}${NC}`)
  process.exit(1)
})
