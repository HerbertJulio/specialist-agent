#!/usr/bin/env node

import * as clack from '@clack/prompts'
import { existsSync, mkdirSync, cpSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { homedir } from 'os'

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

function copyNewOnly(src, dest) {
  if (!existsSync(src)) return 0
  let count = 0
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)
    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true })
      count += copyNewOnly(srcPath, destPath)
    } else if (entry.name.endsWith('.md') && !existsSync(destPath)) {
      cpSync(srcPath, destPath)
      count++
    }
  }
  return count
}

function detectExistingAgents(agentsDir) {
  if (!existsSync(agentsDir)) return []
  return readdirSync(agentsDir).filter(f => f.endsWith('.md'))
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

async function checkForUpdates(currentVersion) {
  try {
    const res = await fetch('https://registry.npmjs.org/specialist-agent/latest', {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const latest = data.version
    if (latest && latest !== currentVersion) return latest
    return null
  } catch {
    return null
  }
}

function detectFramework(pkgPath, availablePacks) {
  if (!existsSync(pkgPath)) return null
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }

  // Order matters: next includes react, so check next first
  if (deps['next'] && availablePacks.includes('nextjs')) return 'nextjs'
  if ((deps['@sveltejs/kit'] || deps['svelte']) && availablePacks.includes('svelte')) return 'svelte'
  if (deps['vue'] && availablePacks.includes('vue')) return 'vue'
  if (deps['react'] && availablePacks.includes('react')) return 'react'

  return null
}

// ── Guidance texts ───────────────────────────────────

function buildGettingStarted(agentNames, installedSkills) {
  const lines = []

  lines.push('Agents enforce the architecture defined in docs/ARCHITECTURE.md.')
  lines.push('They ensure consistency across modules \u2014 the more you use them,')
  lines.push('the more value they deliver.')
  lines.push('')
  lines.push('Examples:')
  lines.push('')
  lines.push('  $ claude')

  if (agentNames.includes('builder')) {
    lines.push('  > "Use @builder to create the products module with CRUD"')
  }
  if (agentNames.includes('reviewer')) {
    lines.push('  > "Use @reviewer to review src/modules/auth/"')
  }
  if (agentNames.includes('doctor')) {
    lines.push('  > "Use @doctor to investigate the dashboard error"')
  }

  if (installedSkills.length > 0) {
    lines.push('')
    lines.push('Skills (slash commands):')
    installedSkills.slice(0, 3).forEach(skill => {
      lines.push(`  > ${skill}`)
    })
  }

  if (agentNames.includes('starter')) {
    lines.push('')
    lines.push('If you need to scaffold a new project from scratch, @starter')
    lines.push('can help with the initial setup (stack, backend, database).')
    lines.push('  > "Use @starter to create my project"')
  }

  return lines.join('\n')
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
  console.log(`    -f, --force     ${DIM}Overwrite existing agents without asking${NC}`)
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

const forceMode = args.includes('--force') || args.includes('-f')

// ── Main ─────────────────────────────────────────────

async function main() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))

  clack.intro(`Specialist Agent ${DIM}v${pkg.version}${NC}`)

  // Check for updates
  const latestVersion = await checkForUpdates(pkg.version)
  if (latestVersion) {
    clack.log.warn(`Update available: v${pkg.version} → v${latestVersion}`)
    clack.log.info(`${DIM}Run: npm i -g specialist-agent@latest${NC}`)
  }

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

  const detected = detectFramework(join(cwd, 'package.json'), packs)
  let framework

  if (detected) {
    clack.log.success(`Detected ${packLabels[detected] || detected} from package.json`)

    const useDetected = await clack.confirm({
      message: `Use ${packLabels[detected] || detected} pack?`,
      initialValue: true,
    })

    if (clack.isCancel(useDetected)) handleCancel()

    if (useDetected) {
      framework = detected
    } else {
      framework = await clack.select({
        message: 'Which framework?',
        options: packs.map(p => ({
          value: p,
          label: packLabels[p] || p.charAt(0).toUpperCase() + p.slice(1),
        })),
      })

      if (clack.isCancel(framework)) handleCancel()
    }
  } else {
    framework = await clack.select({
      message: 'Which framework?',
      options: packs.map(p => ({
        value: p,
        label: packLabels[p] || p.charAt(0).toUpperCase() + p.slice(1),
      })),
    })

    if (clack.isCancel(framework)) handleCancel()
  }

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
    message: `Install specialist agents? ${DIM}(@finance, @cloud, @security, @designer, @data, @devops, @tester, @explorer)${NC}`,
    initialValue: true,
  })

  if (clack.isCancel(installSpecialists)) handleCancel()

  // 5. Global install
  const installGlobal = await clack.confirm({
    message: `Also install agents globally? ${DIM}(~/.claude/agents — available in all projects)${NC}`,
    initialValue: false,
  })

  if (clack.isCancel(installGlobal)) handleCancel()

  // ── Install files ──────────────────────────────────

  const packDir = join(ROOT, 'packs', framework)
  const agentsSource = mode === 'lite' ? join(packDir, 'agents-lite') : join(packDir, 'agents')
  const skillsSource = join(packDir, 'skills')
  const archSource = join(packDir, 'ARCHITECTURE.md')
  const claudeSource = join(packDir, 'CLAUDE.md')

  const agentsDest = join(cwd, '.claude', 'agents')
  mkdirSync(agentsDest, { recursive: true })

  // Detect existing agents
  const existingAgents = detectExistingAgents(agentsDest)
  let shouldOverwrite = forceMode

  if (existingAgents.length > 0 && !forceMode) {
    clack.log.warn(`Existing agents detected in .claude/agents/ (${existingAgents.length} files)`)
    const overwriteChoice = await clack.confirm({
      message: 'Overwrite existing agent files?',
      initialValue: false,
    })
    if (clack.isCancel(overwriteChoice)) handleCancel()
    shouldOverwrite = overwriteChoice
  }

  const s = clack.spinner()
  if (existingAgents.length > 0 && !shouldOverwrite) {
    s.start('Installing new agents and skills (preserving existing)...')
  } else {
    s.start('Installing agents and skills...')
  }

  // Install pack agents
  const agentCount = shouldOverwrite
    ? copyDir(agentsSource, agentsDest)
    : copyNewOnly(agentsSource, agentsDest)

  // Install starter agent
  if (installStarter) {
    const starterFile = mode === 'lite' ? 'starter-lite.md' : 'starter.md'
    const starterSource = join(ROOT, 'agents', starterFile)
    const starterDest = join(agentsDest, 'starter.md')
    if (existsSync(starterSource) && (shouldOverwrite || !existsSync(starterDest))) {
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
      if (existsSync(source) && (shouldOverwrite || !existsSync(dest))) {
        cpSync(source, dest)
      }
    }
  }

  // Install agents globally
  let globalAgentCount = 0
  if (installGlobal) {
    const globalAgentsDest = join(homedir(), '.claude', 'agents')
    mkdirSync(globalAgentsDest, { recursive: true })

    // Copy pack agents (@builder, @reviewer, @doctor, @migrator)
    globalAgentCount += shouldOverwrite
      ? copyDir(agentsSource, globalAgentsDest)
      : copyNewOnly(agentsSource, globalAgentsDest)

    // Copy @starter
    if (installStarter) {
      const starterFile = mode === 'lite' ? 'starter-lite.md' : 'starter.md'
      const starterSource = join(ROOT, 'agents', starterFile)
      const starterGlobalDest = join(globalAgentsDest, 'starter.md')
      if (existsSync(starterSource) && (shouldOverwrite || !existsSync(starterGlobalDest))) {
        cpSync(starterSource, starterGlobalDest)
        globalAgentCount++
      }
    }

    // Copy specialist agents
    if (installSpecialists) {
      const specialistNames = ['explorer', 'finance', 'cloud', 'security', 'designer', 'data', 'devops', 'tester']
      for (const name of specialistNames) {
        const suffix = mode === 'lite' ? '-lite.md' : '.md'
        const source = join(ROOT, 'agents', `${name}${suffix}`)
        const dest = join(globalAgentsDest, `${name}.md`)
        if (existsSync(source) && (shouldOverwrite || !existsSync(dest))) {
          cpSync(source, dest)
          globalAgentCount++
        }
      }
    }
  }

  // Install skills
  const skillsDest = join(cwd, '.claude', 'skills')
  mkdirSync(skillsDest, { recursive: true })
  const skillCount = shouldOverwrite
    ? copyDir(skillsSource, skillsDest)
    : copyNewOnly(skillsSource, skillsDest)

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

  if (globalAgentCount > 0) summaryLines.push(`\u2713 ${globalAgentCount} global agents (~/.claude/agents)`)

  clack.note(summaryLines.join('\n'), `${packLabel} \u00b7 ${mode === 'full' ? 'Full' : 'Lite'}`)

  if (existingAgents.length > 0 && !shouldOverwrite) {
    clack.log.info(`${DIM}${existingAgents.length} existing agent(s) preserved. Use --force to overwrite.${NC}`)
  }

  // Getting started
  const installedSkills = existsSync(skillsDest)
    ? readdirSync(skillsDest, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => '/' + d.name)
    : []

  clack.note(buildGettingStarted(agentNames, installedSkills), 'Getting started')

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
