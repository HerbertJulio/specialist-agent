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

const W = 50

const rl = createInterface({ input: process.stdin, output: process.stdout })
rl.on('close', () => {
  console.log()
  process.exit(0)
})

function ask(question, options, stepInfo) {
  return new Promise((resolve) => {
    const prefix = stepInfo ? `${BLUE}[${stepInfo}]${NC} ` : ''
    console.log()
    console.log(`  ${prefix}${question}`)
    if (options) {
      console.log()
      options.forEach((opt, i) => {
        console.log(`       ${BOLD}${i + 1}${NC}) ${opt.label}${opt.hint ? `  ${DIM}${opt.hint}${NC}` : ''}`)
      })
      console.log()
    }
    const doPrompt = () => {
      rl.question(`  ${BLUE}›${NC} `, (answer) => {
        if (options) {
          const idx = parseInt(answer, 10) - 1
          if (idx >= 0 && idx < options.length) {
            resolve(options[idx].value)
          } else {
            console.log(`       ${YELLOW}Enter a number between 1 and ${options.length}${NC}`)
            doPrompt()
          }
        } else {
          resolve(answer.trim())
        }
      })
    }
    doPrompt()
  })
}

function confirm(question, defaultYes, stepInfo) {
  return new Promise((resolve) => {
    const prefix = stepInfo ? `${BLUE}[${stepInfo}]${NC} ` : ''
    const hint = defaultYes ? `${DIM}(Y/n)${NC}` : `${DIM}(y/N)${NC}`
    console.log()
    console.log(`  ${prefix}${question} ${hint}`)
    console.log()
    const doPrompt = () => {
      rl.question(`  ${BLUE}›${NC} `, (answer) => {
        const val = answer.trim().toLowerCase()
        if (val === '' ) {
          resolve(defaultYes)
        } else if (val === 'y' || val === 'yes') {
          resolve(true)
        } else if (val === 'n' || val === 'no') {
          resolve(false)
        } else {
          console.log(`       ${YELLOW}Enter Y or N${NC}`)
          doPrompt()
        }
      })
    }
    doPrompt()
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
  const ver = `v${pkg.version}`

  // Header
  console.log()
  console.log(`  ${BLUE}╭${'─'.repeat(W)}╮${NC}`)
  console.log(`  ${BLUE}│${NC}${' '.repeat(W)}${BLUE}│${NC}`)
  console.log(`  ${BLUE}│${NC}   ${BOLD}Specialist Agent${NC}${' '.repeat(W - 22 - ver.length)}${DIM}${ver}${NC}   ${BLUE}│${NC}`)
  console.log(`  ${BLUE}│${NC}   ${DIM}AI agents for Claude Code${NC}${' '.repeat(W - 28)}${BLUE}│${NC}`)
  console.log(`  ${BLUE}│${NC}${' '.repeat(W)}${BLUE}│${NC}`)
  console.log(`  ${BLUE}╰${'─'.repeat(W)}╯${NC}`)
  console.log()

  // Check we're in a project
  const cwd = process.cwd()
  if (!existsSync(join(cwd, 'package.json'))) {
    console.log(`  ${YELLOW}⚠${NC}  No package.json found in current directory.`)
    const createPkg = await confirm('Create a package.json to initialize this project?', true)
    if (!createPkg) {
      console.log(`  Run this command from the root of your project.`)
      console.log()
      process.exit(1)
    }
    const dirName = cwd.split(/[\\/]/).pop() || 'my-project'
    writeFileSync(join(cwd, 'package.json'), JSON.stringify({ name: dirName, version: '0.1.0', private: true }, null, 2) + '\n')
    console.log(`  ${GREEN}✓${NC} package.json created`)
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

  const framework = await ask('Which framework?', packOptions, '1/4')

  // 2. Mode
  const mode = await ask('Agent mode?', [
    { label: 'Full', value: 'full', hint: '(Sonnet/Opus)' },
    { label: 'Lite', value: 'lite', hint: '(Haiku — lower cost)' },
  ], '2/4')

  // 3. Starter agent
  const installStarter = await confirm('Install @starter agent?', true, '3/4')

  // 4. Specialist agents
  const installSpecialists = await confirm('Install specialist agents?', true, '4/4')

  // Summary
  const packLabel = packLabels[framework] || framework
  console.log()
  console.log(`  ${BLUE}${'─'.repeat(W)}${NC}`)
  console.log()
  console.log(`  ${packLabel} ${DIM}.${NC} ${mode === 'full' ? 'Full' : 'Lite'} ${DIM}.${NC} Starter: ${installStarter ? 'yes' : 'no'} ${DIM}.${NC} Specialists: ${installSpecialists ? 'yes' : 'no'}`)
  console.log()

  const packDir = join(ROOT, 'packs', framework)
  const agentsSource = mode === 'lite' ? join(packDir, 'agents-lite') : join(packDir, 'agents')
  const skillsSource = join(packDir, 'skills')
  const archSource = join(packDir, 'ARCHITECTURE.md')
  const claudeSource = join(packDir, 'CLAUDE.md')

  // Install pack agents
  const agentsDest = join(cwd, '.claude', 'agents')
  mkdirSync(agentsDest, { recursive: true })
  const agentCount = copyDir(agentsSource, agentsDest)
  const agentNames = getAgentNames(agentsDest)

  agentNames.forEach(name => {
    console.log(`  ${GREEN}✓${NC} @${name}`)
  })

  // Install starter agent
  if (installStarter) {
    const starterFile = mode === 'lite' ? 'starter-lite.md' : 'starter.md'
    const starterSource = join(ROOT, 'agents', starterFile)
    const starterDest = join(agentsDest, 'starter.md')

    if (existsSync(starterSource)) {
      cpSync(starterSource, starterDest)
      console.log(`  ${GREEN}✓${NC} @starter`)
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
        console.log(`  ${GREEN}✓${NC} @${name}`)
      }
    }
  }

  console.log(`  ${DIM}${agentCount} pack agents + extras installed${NC}`)

  // Install skills
  console.log()
  const skillsDest = join(cwd, '.claude', 'skills')
  mkdirSync(skillsDest, { recursive: true })
  const skillCount = copyDir(skillsSource, skillsDest)
  if (skillCount > 0) {
    console.log(`  ${GREEN}✓${NC} ${skillCount} skills installed`)
  } else {
    console.log(`  ${DIM}  No skills available for this pack${NC}`)
  }

  // Install ARCHITECTURE.md
  const archDest = join(cwd, 'docs', 'ARCHITECTURE.md')
  if (!existsSync(archDest)) {
    if (existsSync(archSource)) {
      mkdirSync(dirname(archDest), { recursive: true })
      cpSync(archSource, archDest)
      console.log(`  ${GREEN}✓${NC} docs/ARCHITECTURE.md`)
    } else {
      console.log(`  ${YELLOW}⚠${NC}  ARCHITECTURE.md not found in pack ${DIM}(skipped)${NC}`)
    }
  } else {
    console.log(`  ${DIM}  docs/ARCHITECTURE.md already exists${NC}`)
  }

  // Install CLAUDE.md
  const claudeDest = join(cwd, 'CLAUDE.md')
  if (!existsSync(claudeDest)) {
    if (existsSync(claudeSource)) {
      cpSync(claudeSource, claudeDest)
      console.log(`  ${GREEN}✓${NC} CLAUDE.md`)
    } else {
      console.log(`  ${YELLOW}⚠${NC}  CLAUDE.md not found in pack ${DIM}(skipped)${NC}`)
    }
  } else {
    console.log(`  ${DIM}  CLAUDE.md already exists${NC}`)
  }

  // Done
  console.log()
  console.log(`  ${BLUE}${'─'.repeat(W)}${NC}`)
  console.log()
  console.log(`  ${GREEN}${BOLD}Setup complete!${NC}`)
  console.log()

  if (mode === 'lite') {
    console.log(`  ${DIM}Lite mode: agents run on Haiku (lower cost, faster).${NC}`)
    console.log(`  ${DIM}Switch to Full: npx specialist-agent init${NC}`)
    console.log()
  }

  // Show installed skills as examples
  const installedSkills = existsSync(skillsDest)
    ? readdirSync(skillsDest, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => '/' + d.name)
    : []

  console.log(`  Get started:`)
  console.log()
  console.log(`    ${DIM}$${NC} claude`)
  console.log(`    ${DIM}$${NC} /agents                  ${DIM}# list installed agents${NC}`)
  if (installedSkills.length > 0) {
    installedSkills.slice(0, 2).forEach(skill => {
      console.log(`    ${DIM}$${NC} ${skill}`)
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

// CLI argument handling
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
  console.log(`  ${BOLD}specialist-agent${NC} ${DIM}v${pkg.version}${NC}`)
  console.log()
  console.log('  Usage: specialist-agent [init] [options]')
  console.log()
  console.log('  Options:')
  console.log(`    -h, --help      ${DIM}Show this help message${NC}`)
  console.log(`    -v, --version   ${DIM}Show version number${NC}`)
  console.log()
  console.log(`  ${DIM}Run the setup wizard to install AI agents for Claude Code.${NC}`)
  console.log(`  ${DIM}Can be executed from any directory (creates package.json if needed).${NC}`)
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
