#!/usr/bin/env node

import * as clack from '@clack/prompts'
import { existsSync, mkdirSync, cpSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

const YELLOW = '\x1b[33m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const NC = '\x1b[0m'

// ── Helpers ──────────────────────────────────────────

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

function handleCancel() {
  clack.cancel('Setup cancelled.')
  process.exit(0)
}

// ── Scenario guidance ────────────────────────────────

const scenarioGuidance = {
  'new-project': {
    title: 'New project from scratch',
    text: `Use @starter to scaffold your entire project step by step:

  $ claude
  > "Use @starter to create my project"

  @starter will guide you through:
  \u2022 Frontend framework & UI library
  \u2022 Backend & API layer
  \u2022 Database & ORM
  \u2022 Authentication
  \u2022 Docker & CI/CD`
  },
  'early-stage': {
    title: 'Early-stage project',
    text: `Your project exists but needs structure. Start with:

  $ claude
  > "Use @reviewer to analyze my project architecture"
  > "Use @builder to create the users module with CRUD"

  Recommended flow:
  1. @reviewer  \u2014 audit current code and suggest architecture
  2. @builder   \u2014 create modules following the architecture
  3. @tester    \u2014 add test coverage for new modules`
  },
  'daily': {
    title: 'Day-to-day development',
    text: `Your agents are ready. Here are some examples:

  $ claude
  > "Use @builder to create a products component"
  > "Use @doctor to investigate the login error"
  > "Use @reviewer to review src/modules/auth/"

  Skills (slash commands):
  > /dev-create-module
  > /review-check-architecture`
  },
  'daily-migrate': {
    title: 'Day-to-day + migration',
    text: `Combine daily development with gradual migration:

  $ claude
  > "Use @builder to create new features"
  > "Use @migrator to migrate src/legacy/users/"

  Suggested approach:
  1. @reviewer   \u2014 map current architecture
  2. @migrator   \u2014 migrate modules one at a time
  3. @builder    \u2014 build new features with target architecture
  4. @tester     \u2014 ensure nothing breaks during migration`
  },
  'migrate': {
    title: 'Migration only',
    text: `Focus on migrating to the target architecture:

  $ claude
  > "Use @reviewer to analyze the current architecture"
  > "Use @migrator to migrate src/modules/users/"

  Migration flow:
  1. @reviewer  \u2014 full audit and migration plan
  2. @migrator  \u2014 migrate module by module
  3. @tester    \u2014 validate each migration step`
  },
  'just-install': {
    title: 'Just install',
    text: `Agents and skills are installed. You're good to go!

  $ claude
  > /agents                  # list installed agents
  > "Use @builder to ..."    # start building`
  }
}

// ── CLI argument handling ────────────────────────────

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

// ── Main ─────────────────────────────────────────────

async function main() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))

  clack.intro(`Specialist Agent ${DIM}v${pkg.version}${NC}`)

  // Check we're in a project
  const cwd = process.cwd()
  if (!existsSync(join(cwd, 'package.json'))) {
    clack.log.warn('No package.json found in current directory.')

    const createPkg = await clack.confirm({
      message: 'Create a package.json to initialize this project?',
      initialValue: true,
    })

    if (clack.isCancel(createPkg)) handleCancel()

    if (!createPkg) {
      clack.cancel('Run this command from the root of your project.')
      process.exit(1)
    }

    const dirName = cwd.split(/[\\/]/).pop() || 'my-project'
    writeFileSync(
      join(cwd, 'package.json'),
      JSON.stringify({ name: dirName, version: '0.1.0', private: true }, null, 2) + '\n'
    )
    clack.log.success('package.json created')
  }

  // 1. Framework
  const packs = readdirSync(join(ROOT, 'packs'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  const packLabels = { vue: 'Vue 3', react: 'React', nextjs: 'Next.js', svelte: 'SvelteKit' }

  const framework = await clack.select({
    message: 'Which framework?',
    options: packs.map(p => ({
      value: p,
      label: packLabels[p] || p.charAt(0).toUpperCase() + p.slice(1),
    })),
  })

  if (clack.isCancel(framework)) handleCancel()

  // 2. Mode
  const mode = await clack.select({
    message: 'Agent mode?',
    options: [
      { value: 'full', label: 'Full', hint: 'Sonnet/Opus' },
      { value: 'lite', label: 'Lite', hint: 'Haiku \u2014 lower cost' },
    ],
  })

  if (clack.isCancel(mode)) handleCancel()

  // 3. Starter agent
  const installStarter = await clack.confirm({
    message: 'Install @starter agent?',
    initialValue: true,
  })

  if (clack.isCancel(installStarter)) handleCancel()

  // 4. Specialist agents
  const installSpecialists = await clack.confirm({
    message: 'Install specialist agents?',
    initialValue: true,
  })

  if (clack.isCancel(installSpecialists)) handleCancel()

  // ── Install files ──────────────────────────────────

  const s = clack.spinner()
  s.start('Installing agents and skills...')

  const packDir = join(ROOT, 'packs', framework)
  const agentsSource = mode === 'lite' ? join(packDir, 'agents-lite') : join(packDir, 'agents')
  const skillsSource = join(packDir, 'skills')
  const archSource = join(packDir, 'ARCHITECTURE.md')
  const claudeSource = join(packDir, 'CLAUDE.md')

  // Install pack agents
  const agentsDest = join(cwd, '.claude', 'agents')
  mkdirSync(agentsDest, { recursive: true })
  const agentCount = copyDir(agentsSource, agentsDest)

  // Install starter agent
  if (installStarter) {
    const starterFile = mode === 'lite' ? 'starter-lite.md' : 'starter.md'
    const starterSource = join(ROOT, 'agents', starterFile)
    const starterDest = join(agentsDest, 'starter.md')
    if (existsSync(starterSource)) {
      cpSync(starterSource, starterDest)
    }
  }

  // Install specialist agents
  if (installSpecialists) {
    const specialistNames = ['explorer', 'finance', 'cloud', 'security', 'designer', 'data', 'devops', 'tester']
    for (const name of specialistNames) {
      const suffix = mode === 'lite' ? '-lite.md' : '.md'
      const source = join(ROOT, 'agents', `${name}${suffix}`)
      const dest = join(agentsDest, `${name}.md`)
      if (existsSync(source)) {
        cpSync(source, dest)
      }
    }
  }

  // Install skills
  const skillsDest = join(cwd, '.claude', 'skills')
  mkdirSync(skillsDest, { recursive: true })
  const skillCount = copyDir(skillsSource, skillsDest)

  // Install ARCHITECTURE.md
  const archDest = join(cwd, 'docs', 'ARCHITECTURE.md')
  let archInstalled = false
  if (!existsSync(archDest) && existsSync(archSource)) {
    mkdirSync(dirname(archDest), { recursive: true })
    cpSync(archSource, archDest)
    archInstalled = true
  }

  // Install CLAUDE.md
  const claudeDest = join(cwd, 'CLAUDE.md')
  let claudeInstalled = false
  if (!existsSync(claudeDest) && existsSync(claudeSource)) {
    cpSync(claudeSource, claudeDest)
    claudeInstalled = true
  }

  s.stop('Installation complete')

  // ── Summary ────────────────────────────────────────

  const agentNames = getAgentNames(agentsDest)
  const packLabel = packLabels[framework] || framework

  const summaryLines = []
  agentNames.forEach(name => summaryLines.push(`\u2713 @${name}`))
  if (skillCount > 0) summaryLines.push(`\u2713 ${skillCount} skills`)
  if (archInstalled) summaryLines.push('\u2713 docs/ARCHITECTURE.md')
  if (claudeInstalled) summaryLines.push('\u2713 CLAUDE.md')

  clack.note(summaryLines.join('\n'), `${packLabel} \u00b7 ${mode === 'full' ? 'Full' : 'Lite'}`)

  // 5. Scenario
  const scenario = await clack.select({
    message: 'What best describes your situation?',
    options: [
      { value: 'new-project', label: 'New project from scratch', hint: "I'm starting from zero" },
      { value: 'early-stage', label: 'Early-stage project', hint: 'needs architecture & structure' },
      { value: 'daily', label: 'Day-to-day development', hint: 'project is running, need help' },
      { value: 'daily-migrate', label: 'Day-to-day + migration', hint: 'help + improve architecture' },
      { value: 'migrate', label: 'Migration only', hint: 'migrate to better architecture' },
      { value: 'just-install', label: 'Just install agents', hint: 'skip guidance' },
    ],
  })

  if (clack.isCancel(scenario)) handleCancel()

  // 6. Guidance
  const guidance = scenarioGuidance[scenario]
  if (guidance && scenario !== 'just-install') {
    clack.note(guidance.text, guidance.title)
  }

  if (mode === 'lite') {
    clack.log.info(`${DIM}Lite mode: agents run on Haiku (lower cost, faster).${NC}`)
    clack.log.info(`${DIM}Switch to Full: npx specialist-agent init${NC}`)
  }

  clack.outro('Setup complete! Run claude to get started.')
}

main().catch((err) => {
  clack.log.error(err.message)
  process.exit(1)
})
