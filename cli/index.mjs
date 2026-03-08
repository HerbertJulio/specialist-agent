#!/usr/bin/env node

import * as clack from '@clack/prompts'
import { existsSync, mkdirSync, cpSync, rmSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { execFileSync } from 'child_process'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { homedir } from 'os'
import { ARCHITECTURE_PATTERNS, MIGRATION_MAP } from './architectures.mjs'
import { detectProjectArchitecture, generateDetectionReport } from './detect-architecture.mjs'
import { getRecommendations } from './recommend-architecture.mjs'
import { generateArchitectureGuide } from './generate-architecture.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

const YELLOW = '\x1b[33m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const CYAN = '\x1b[36m'
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

// ── Native Hooks Setup ──────────────────────────────────

const HOOK_EVENT_MAP = {
  'security-guard': 'PreToolUse',
  'auto-dispatch': 'UserPromptSubmit',
  'session-context': 'SessionStart',
  'mcp-discovery': 'SessionStart',
  'auto-format': 'PostToolUse',
}

function setupNativeHooks(cwd, selectedHooks) {
  // 1. Copy hook scripts to project
  const nativeSource = join(ROOT, 'hooks', 'native')
  const nativeDest = join(cwd, '.specialist-agent', 'hooks', 'native')
  mkdirSync(nativeDest, { recursive: true })

  const filesToCopy = [
    'utils.mjs',
    'security-guard.mjs',
    'security-config.json',
    'auto-dispatch.mjs',
    'session-context.mjs',
    'mcp-discovery.mjs',
    'auto-format.mjs',
  ]
  for (const file of filesToCopy) {
    const src = join(nativeSource, file)
    if (existsSync(src)) cpSync(src, join(nativeDest, file))
  }

  // 2. Load settings template
  const templatePath = join(nativeSource, 'settings-template.json')
  let template
  try {
    template = JSON.parse(readFileSync(templatePath, 'utf-8'))
  } catch (err) {
    clack.log.error(`Failed to load hook settings template: ${err.message}`)
    return 0
  }

  // 3. Filter template to only selected hooks
  const filteredHooks = {}
  for (const hookName of selectedHooks) {
    const eventName = HOOK_EVENT_MAP[hookName]
    if (eventName && template.hooks[eventName]) {
      filteredHooks[eventName] = template.hooks[eventName]
    }
  }

  // 4. Read existing settings or start fresh
  const settingsDir = join(cwd, '.claude')
  mkdirSync(settingsDir, { recursive: true })
  const settingsPath = join(settingsDir, 'settings.json')

  let existing = {}
  if (existsSync(settingsPath)) {
    try {
      existing = JSON.parse(readFileSync(settingsPath, 'utf-8'))
      // Create backup
      writeFileSync(settingsPath + '.bak', JSON.stringify(existing, null, 2))
    } catch {
      existing = {}
    }
  }

  // 5. Deep-merge hooks (idempotent - skip if command already exists)
  if (!existing.hooks) existing.hooks = {}

  // Reject prototype pollution keys
  const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

  for (const [eventName, entries] of Object.entries(filteredHooks)) {
    if (UNSAFE_KEYS.has(eventName)) continue;
    if (!existing.hooks[eventName]) {
      existing.hooks[eventName] = entries
    } else {
      // Check for duplicates by command
      for (const newEntry of entries) {
        const newCommand = newEntry.hooks?.[0]?.command || ''
        const isDuplicate = existing.hooks[eventName].some(existingEntry =>
          existingEntry.hooks?.some(h => h.command === newCommand)
        )
        if (!isDuplicate) {
          existing.hooks[eventName].push(newEntry)
        }
      }
    }
  }

  // 6. Write merged settings
  writeFileSync(settingsPath, JSON.stringify(existing, null, 2))

  return selectedHooks.length
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
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }

  // Order matters: nuxt includes vue, next includes react - check meta-frameworks first
  if (deps['nuxt'] && availablePacks.includes('nuxt')) return 'nuxt'
  if (deps['next'] && availablePacks.includes('nextjs')) return 'nextjs'
  if ((deps['@sveltejs/kit'] || deps['svelte']) && availablePacks.includes('svelte')) return 'svelte'
  if (deps['@angular/core'] && availablePacks.includes('angular')) return 'angular'
  if (deps['astro'] && availablePacks.includes('astro')) return 'astro'
  if (deps['vue'] && availablePacks.includes('vue')) return 'vue'
  if (deps['react'] && availablePacks.includes('react')) return 'react'

  return null
}

// ── Platform Detection ──────────────────────────────

const PLATFORMS = {
  'claude-code': {
    label: 'Claude Code',
    detect: (cwd) => true, // always install (primary platform)
  },
  'cursor': {
    label: 'Cursor',
    detect: (cwd) => {
      if (existsSync(join(cwd, '.cursor'))) return true
      if (existsSync(join(cwd, '.cursorignore'))) return true
      if (existsSync(join(cwd, '.cursorrules'))) return true
      try { execFileSync('cursor', ['--version'], { stdio: 'pipe', timeout: 3000 }); return true } catch { return false }
    },
  },
  'windsurf': {
    label: 'Windsurf',
    detect: (cwd) => {
      if (existsSync(join(cwd, '.windsurf'))) return true
      if (existsSync(join(cwd, '.windsurfrules'))) return true
      try { execFileSync('windsurf', ['--version'], { stdio: 'pipe', timeout: 3000 }); return true } catch { return false }
    },
  },
  'vscode': {
    label: 'VS Code',
    detect: (cwd) => {
      if (existsSync(join(cwd, '.vscode'))) return true
      try { execFileSync('code', ['--version'], { stdio: 'pipe', timeout: 3000 }); return true } catch { return false }
    },
  },
  'codex': {
    label: 'Codex',
    detect: (cwd) => {
      if (existsSync(join(cwd, '.codex'))) return true
      try { execFileSync('codex', ['--version'], { stdio: 'pipe', timeout: 3000 }); return true } catch { return false }
    },
  },
  'opencode': {
    label: 'OpenCode',
    detect: (cwd) => {
      if (existsSync(join(cwd, '.opencode'))) return true
      if (existsSync(join(cwd, 'opencode.json'))) return true
      try { execFileSync('opencode', ['--version'], { stdio: 'pipe', timeout: 3000 }); return true } catch { return false }
    },
  },
}

function detectPlatforms(cwd) {
  const detected = []
  for (const [id, platform] of Object.entries(PLATFORMS)) {
    if (platform.detect(cwd)) {
      detected.push({ id, label: platform.label })
    }
  }
  return detected
}

function setupPlatformConfigs(cwd, platforms, { framework, version }) {
  const installed = []

  for (const platform of platforms) {
    switch (platform.id) {
      case 'claude-code':
        // Handled by main install flow
        break

      case 'cursor': {
        const cursorDir = join(cwd, '.cursor')
        mkdirSync(cursorDir, { recursive: true })

        // Copy agents to .cursor/agents/ (Cursor reads agents from here)
        const cursorAgentsDir = join(cursorDir, 'agents')
        const claudeAgentsDir = join(cwd, '.claude', 'agents')
        if (existsSync(claudeAgentsDir)) {
          mkdirSync(cursorAgentsDir, { recursive: true })
          copyDir(claudeAgentsDir, cursorAgentsDir)
        }

        installed.push({ platform: 'Cursor', path: '.cursor/agents/' })
        break
      }

      case 'windsurf': {
        const windsurfDir = join(cwd, '.windsurf')
        mkdirSync(windsurfDir, { recursive: true })

        // Copy agents to .windsurf/agents/
        const wsAgentsDir = join(windsurfDir, 'agents')
        const claudeAgentsDir = join(cwd, '.claude', 'agents')
        if (existsSync(claudeAgentsDir)) {
          mkdirSync(wsAgentsDir, { recursive: true })
          copyDir(claudeAgentsDir, wsAgentsDir)
        }

        installed.push({ platform: 'Windsurf', path: '.windsurf/agents/' })
        break
      }

      case 'vscode': {
        // VS Code uses .vscode/ — just ensure the settings reference .claude/
        const vscodeDir = join(cwd, '.vscode')
        mkdirSync(vscodeDir, { recursive: true })

        const settingsPath = join(vscodeDir, 'settings.json')
        let settings = {}
        if (existsSync(settingsPath)) {
          try { settings = JSON.parse(readFileSync(settingsPath, 'utf-8')) } catch {}
        }

        if (!settings['specialist-agent.framework']) {
          settings['specialist-agent.framework'] = framework || 'auto'
          writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
        }

        installed.push({ platform: 'VS Code', path: '.vscode/settings.json' })
        break
      }

      case 'codex': {
        // Codex reads from .claude/agents/ — same as Claude Code, just confirm
        installed.push({ platform: 'Codex', path: '.claude/agents/' })
        break
      }

      case 'opencode': {
        // Copy agents to .opencode/agents/
        const opencodeDir = join(cwd, '.opencode')
        mkdirSync(join(opencodeDir, 'agents'), { recursive: true })

        const claudeAgentsDir = join(cwd, '.claude', 'agents')
        if (existsSync(claudeAgentsDir)) {
          copyDir(claudeAgentsDir, join(opencodeDir, 'agents'))
        }

        // Copy opencode.json if it doesn't exist
        const opencodeConfigSrc = join(ROOT, '.opencode', 'opencode.json')
        const opencodeConfigDest = join(cwd, 'opencode.json')
        if (!existsSync(opencodeConfigDest) && existsSync(opencodeConfigSrc)) {
          cpSync(opencodeConfigSrc, opencodeConfigDest)
        }

        installed.push({ platform: 'OpenCode', path: '.opencode/agents/' })
        break
      }
    }
  }

  return installed
}

// ── Guidance texts ───────────────────────────────────

function buildGettingStarted(agentNames, installedSkills, archInstalled, isEmptyProject) {
  const lines = []

  if (isEmptyProject) {
    lines.push('You\'re starting fresh — here\'s how to get going:')
    lines.push('')
    lines.push('  $ claude')
    lines.push('')
    if (agentNames.includes('starter')) {
      lines.push('  Create a project from scratch:')
      lines.push('  > "Use @starter to create an app with Next.js + PostgreSQL"')
      lines.push('  > "Use @starter to create a Vue 3 SaaS with Stripe"')
      lines.push('')
    }
    if (agentNames.includes('planner')) {
      lines.push('  Plan before building:')
      lines.push('  > /plan add user authentication with JWT')
      lines.push('  > /discovery implement real-time chat with WebSocket')
      lines.push('')
    }
    lines.push('  All 35 agents are installed. When you choose a framework,')
    lines.push('  re-run to swap to framework-specific pack agents:')
    lines.push('  > npx specialist-agent init')
    return lines.join('\n')
  }

  if (archInstalled) {
    lines.push('Agents enforce the architecture defined in docs/ARCHITECTURE.md.')
    lines.push('They ensure consistency across modules — the more you use them,')
    lines.push('the more value they deliver.')
    lines.push('')
    lines.push('To migrate your project to the new architecture:')
    lines.push('  > "Use /migrate-architecture to restructure my project"')
    lines.push('  > "Use @architect to assess my current architecture"')
  } else {
    lines.push('Agents use generic best practices for your framework.')
    lines.push('To customize patterns, run: specialist-agent detect')
  }
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
    const topSkills = ['/plan', '/tdd', '/audit', '/discovery']
    const available = topSkills.filter(s => installedSkills.includes(s))
    if (available.length > 0) {
      available.forEach(skill => lines.push(`  > ${skill}`))
    } else {
      installedSkills.slice(0, 4).forEach(skill => lines.push(`  > ${skill}`))
    }
  }

  if (agentNames.includes('starter')) {
    lines.push('')
    lines.push('Scaffold a new project from scratch:')
    lines.push('  > "Use @starter to create an e-commerce app with Next.js"')
  }

  return lines.join('\n')
}

// ── CLI argument handling ────────────────────────────

const args = process.argv.slice(2)

const validCommands = ['init', 'create-agent', 'list', 'profiles', 'community', 'detect']
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
  console.log('  Usage: specialist-agent <command> [options]')
  console.log()
  console.log('  Commands:')
  console.log(`    init                    ${DIM}Install 35 agents and 24 skills (works on empty projects too)${NC}`)
  console.log(`    detect                  ${DIM}Detect architecture, monorepo, and suggest migrations${NC}`)
  console.log(`    create-agent <name>     ${DIM}Create a custom agent from template${NC}`)
  console.log(`    list                    ${DIM}List installed agents, skills, and memory${NC}`)
  console.log(`    profiles                ${DIM}Manage AI team profiles${NC}`)
  console.log(`    community               ${DIM}Manage community skills (list/install/remove)${NC}`)
  console.log()
  console.log('  Options:')
  console.log(`    -h, --help      ${DIM}Show this help message${NC}`)
  console.log(`    -v, --version   ${DIM}Show version number${NC}`)
  console.log(`    -f, --force     ${DIM}Overwrite existing agents without asking${NC}`)
  console.log()
  console.log('  Examples:')
  console.log(`    ${DIM}$ specialist-agent init              # Install in existing project${NC}`)
  console.log(`    ${DIM}$ specialist-agent init              # Start from empty dir (no framework yet)${NC}`)
  console.log(`    ${DIM}$ specialist-agent detect            # Analyze architecture & get recommendations${NC}`)
  console.log(`    ${DIM}$ specialist-agent create-agent @qa  # Create a custom agent${NC}`)
  console.log(`    ${DIM}$ specialist-agent profiles set startup-fast${NC}`)
  console.log()
  process.exit(0)
}

if (args.includes('--version') || args.includes('-v')) {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
  console.log(pkg.version)
  process.exit(0)
}

const forceMode = args.includes('--force') || args.includes('-f')

// ── Agent Template ───────────────────────────────────

const AGENT_TEMPLATE = `---
name: {{name}}
description: "{{description}}"
model: {{model}}
tools: Read, Write, Edit, Bash, Glob, Grep
---

# @{{name}} - {{title}}

## Mission

{{mission}}

## Workflow

### Step 1: Understand Context
1. Read relevant files
2. Understand existing patterns
3. Plan approach

### Step 2: Execute
1. Implement changes
2. Validate results
3. Report completion

## Output

After completing work, provide:
- What was done
- Files created/modified
- Validation results
- Next steps

## Rules

1. Follow ARCHITECTURE.md patterns
2. Write clean, readable code
3. Add appropriate tests
4. Document changes

## Handoff Protocol

- If code review needed → suggest @reviewer
- If bugs found → suggest @doctor
- If tests needed → suggest @tester
`

// ── Create Agent Command ─────────────────────────────

async function createAgent() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
  clack.intro(`Create Custom Agent ${DIM}v${pkg.version}${NC}`)

  // Get agent name from args or prompt
  let agentName = args.find(a => a.startsWith('@'))?.replace('@', '') || args[args.indexOf('create-agent') + 1]

  if (!agentName || agentName.startsWith('-')) {
    const nameInput = await clack.text({
      message: 'Agent name (without @):',
      placeholder: 'my-agent',
      validate: (value) => {
        if (!value) return 'Name is required'
        if (!/^[a-z][a-z0-9-]*$/.test(value)) return 'Use lowercase letters, numbers, and hyphens'
      }
    })
    if (clack.isCancel(nameInput)) handleCancel()
    agentName = nameInput
  }

  agentName = agentName.replace('@', '')

  const description = await clack.text({
    message: 'What does this agent do?',
    placeholder: 'Handles X when Y happens',
    validate: (value) => !value ? 'Description is required' : undefined
  })
  if (clack.isCancel(description)) handleCancel()

  const title = await clack.text({
    message: 'Agent title (short):',
    placeholder: 'Custom Agent',
    initialValue: agentName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  })
  if (clack.isCancel(title)) handleCancel()

  const mission = await clack.text({
    message: 'Mission statement (one sentence):',
    placeholder: 'Help developers with X by doing Y.'
  })
  if (clack.isCancel(mission)) handleCancel()

  const model = await clack.select({
    message: 'Default model:',
    options: [
      { value: 'sonnet', label: 'Sonnet', hint: 'Balanced (default)' },
      { value: 'haiku', label: 'Haiku', hint: 'Faster, cheaper' },
      { value: 'opus', label: 'Opus', hint: 'Most capable' },
    ]
  })
  if (clack.isCancel(model)) handleCancel()

  const installScope = await clack.select({
    message: 'Where to create?',
    options: [
      { value: 'project', label: 'This project', hint: '.claude/agents/' },
      { value: 'global', label: 'Global', hint: '~/.claude/agents/' },
    ]
  })
  if (clack.isCancel(installScope)) handleCancel()

  // Generate agent content
  const content = AGENT_TEMPLATE
    .replace(/\{\{name\}\}/g, agentName)
    .replace(/\{\{description\}\}/g, description)
    .replace(/\{\{title\}\}/g, title)
    .replace(/\{\{mission\}\}/g, mission || 'Help with specific tasks.')
    .replace(/model: \{\{model\}\}\n/, model === 'sonnet' ? '' : `model: ${model}\n`)

  // Determine destination
  const agentsDest = installScope === 'global'
    ? join(homedir(), '.claude', 'agents')
    : join(process.cwd(), '.claude', 'agents')

  mkdirSync(agentsDest, { recursive: true })

  const filePath = join(agentsDest, `${agentName}.md`)

  if (existsSync(filePath) && !forceMode) {
    const overwrite = await clack.confirm({
      message: `Agent @${agentName} already exists. Overwrite?`,
      initialValue: false
    })
    if (clack.isCancel(overwrite)) handleCancel()
    if (!overwrite) {
      clack.cancel('Agent creation cancelled.')
      process.exit(0)
    }
  }

  writeFileSync(filePath, content)

  clack.note([
    `File: ${filePath}`,
    '',
    'Next steps:',
    `1. Edit the agent file to customize behavior`,
    `2. Use in Claude Code: "Use @${agentName} to..."`,
  ].join('\n'), `@${agentName} created!`)

  clack.outro('Agent ready to use!')
}

// ── List Command ─────────────────────────────────────

async function listAgents() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
  console.log()
  console.log(`  ${BOLD}Specialist Agent${NC} ${DIM}v${pkg.version}${NC}`)
  console.log()

  const cwd = process.cwd()
  const projectAgents = join(cwd, '.claude', 'agents')
  const globalAgents = join(homedir(), '.claude', 'agents')
  const projectSkills = join(cwd, '.claude', 'skills')

  console.log(`  ${BOLD}Agents${NC}`)
  console.log()

  // Project agents
  if (existsSync(projectAgents)) {
    const agents = getAgentNames(projectAgents)
    if (agents.length > 0) {
      console.log(`  ${DIM}Project (.claude/agents/):${NC}`)
      agents.forEach(a => console.log(`    @${a}`))
      console.log()
    }
  }

  // Global agents
  if (existsSync(globalAgents)) {
    const agents = getAgentNames(globalAgents)
    if (agents.length > 0) {
      console.log(`  ${DIM}Global (~/.claude/agents/):${NC}`)
      agents.forEach(a => console.log(`    @${a}`))
      console.log()
    }
  }

  // Skills
  if (existsSync(projectSkills)) {
    const skills = readdirSync(projectSkills, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)

    if (skills.length > 0) {
      console.log(`  ${BOLD}Skills${NC}`)
      console.log()
      console.log(`  ${DIM}Project (.claude/skills/):${NC}`)
      skills.forEach(s => console.log(`    /${s}`))
      console.log()
    }
  }

  // Check for session memory
  const memoryFile = join(cwd, '.claude', 'session-memory.json')
  if (existsSync(memoryFile)) {
    console.log(`  ${BOLD}Session Memory${NC}`)
    console.log(`  ${DIM}Active: .claude/session-memory.json${NC}`)
    console.log()
  }

  // Check for profile
  const configFile = join(cwd, '.claude', 'config.json')
  if (existsSync(configFile)) {
    try {
      const config = JSON.parse(readFileSync(configFile, 'utf-8'))
      if (config.profile) {
        console.log(`  ${BOLD}Profile${NC}`)
        console.log(`  ${DIM}Active: ${config.profile}${NC}`)
        console.log()
      }
    } catch {}
  }
}

// ── Profiles Command ─────────────────────────────────

async function manageProfiles() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
  clack.intro(`AI Team Profiles ${DIM}v${pkg.version}${NC}`)

  const profiles = {
    'startup-fast': {
      description: 'Move fast, ship quickly. Minimal validation, Haiku model.',
      settings: { model: 'haiku', validation: 'minimal', checkpoints: false }
    },
    'enterprise-strict': {
      description: 'Strict quality gates. Full validation, detailed reviews.',
      settings: { model: 'sonnet', validation: 'full', checkpoints: true }
    },
    'learning-mode': {
      description: 'Explain everything. Learning-focused, verbose output.',
      settings: { model: 'sonnet', validation: 'full', explain: true }
    },
    'cost-optimized': {
      description: 'Minimize token usage. Haiku where possible, skip extras.',
      settings: { model: 'haiku', validation: 'minimal', checkpoints: false }
    }
  }

  const subcommand = args[args.indexOf('profiles') + 1]

  if (subcommand === 'list' || !subcommand) {
    console.log()
    console.log(`  ${BOLD}Available Profiles${NC}`)
    console.log()
    Object.entries(profiles).forEach(([name, info]) => {
      console.log(`  ${BOLD}${name}${NC}`)
      console.log(`  ${DIM}${info.description}${NC}`)
      console.log()
    })

    const configFile = join(process.cwd(), '.claude', 'config.json')
    if (existsSync(configFile)) {
      try {
        const config = JSON.parse(readFileSync(configFile, 'utf-8'))
        if (config.profile) {
          console.log(`  ${BOLD}Current:${NC} ${config.profile}`)
        }
      } catch {}
    }
    return
  }

  if (subcommand === 'set') {
    const profileName = args[args.indexOf('set') + 1]

    if (!profileName || !profiles[profileName]) {
      const selected = await clack.select({
        message: 'Select profile:',
        options: Object.entries(profiles).map(([name, info]) => ({
          value: name,
          label: name,
          hint: info.description.substring(0, 50)
        }))
      })
      if (clack.isCancel(selected)) handleCancel()

      const configDir = join(process.cwd(), '.claude')
      mkdirSync(configDir, { recursive: true })

      const configFile = join(configDir, 'config.json')
      let config = {}
      if (existsSync(configFile)) {
        try { config = JSON.parse(readFileSync(configFile, 'utf-8')) } catch {}
      }

      config.profile = selected
      config.profileSettings = profiles[selected].settings

      writeFileSync(configFile, JSON.stringify(config, null, 2))
      clack.outro(`Profile set to: ${selected}`)
    } else {
      const configDir = join(process.cwd(), '.claude')
      mkdirSync(configDir, { recursive: true })

      const configFile = join(configDir, 'config.json')
      let config = {}
      if (existsSync(configFile)) {
        try { config = JSON.parse(readFileSync(configFile, 'utf-8')) } catch {}
      }

      config.profile = profileName
      config.profileSettings = profiles[profileName].settings

      writeFileSync(configFile, JSON.stringify(config, null, 2))
      console.log(`  Profile set to: ${profileName}`)
    }
  }
}

// ── Community Skills ─────────────────────────────────

async function manageCommunity() {
  const subCmd = args[1] || 'list'
  const homeDir = homedir()
  const communityDir = join(homeDir, '.claude', 'community-skills')

  if (subCmd === 'list') {
    console.log()
    console.log(`  ${BOLD}Community Skills${NC}`)
    console.log()

    if (!existsSync(communityDir)) {
      console.log(`  ${DIM}No community skills installed.${NC}`)
      console.log(`  ${DIM}Install with: specialist-agent community install <git-url>${NC}`)
      return
    }

    const entries = readdirSync(communityDir, { withFileTypes: true })
    let count = 0
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const skillFile = join(communityDir, entry.name, 'SKILL.md')
      if (existsSync(skillFile)) {
        const content = readFileSync(skillFile, 'utf-8')
        const nameMatch = content.match(/^name:\s*(.+)$/m)
        const descMatch = content.match(/^description:\s*"?([^"]*)"?$/m)
        const name = nameMatch ? nameMatch[1].trim() : entry.name
        const desc = descMatch ? descMatch[1].trim() : ''
        console.log(`  ${GREEN}/${name}${NC} ${DIM}- ${desc}${NC}`)
        count++
      }
    }

    if (count === 0) {
      console.log(`  ${DIM}No community skills found in ${communityDir}${NC}`)
    } else {
      console.log()
      console.log(`  ${DIM}${count} community skill(s) installed${NC}`)
    }
    console.log()

  } else if (subCmd === 'install') {
    const source = args[2]
    if (!source) {
      console.error(`  ${RED}Usage: specialist-agent community install <git-url|path>${NC}`)
      process.exit(1)
    }

    if (!existsSync(join(homeDir, '.claude'))) {
      mkdirSync(join(homeDir, '.claude'), { recursive: true })
    }
    if (!existsSync(communityDir)) {
      mkdirSync(communityDir, { recursive: true })
    }

    if (source.startsWith('http') || source.startsWith('git@')) {
      // Validate URL format to prevent injection
      if (source.startsWith('http')) {
        try { new URL(source) } catch {
          console.error(`  ${RED}Invalid URL: ${source}${NC}`)
          process.exit(1)
        }
      }

      // Sanitize repo name — allow only safe characters
      const rawName = source.split('/').pop().replace('.git', '')
      const repoName = rawName.replace(/[^a-zA-Z0-9._-]/g, '')
      if (!repoName) {
        console.error(`  ${RED}Invalid repository name${NC}`)
        process.exit(1)
      }
      const targetDir = join(communityDir, repoName)

      if (existsSync(targetDir)) {
        console.error(`  ${YELLOW}Skill "${repoName}" already installed. Use --force to overwrite.${NC}`)
        if (!args.includes('--force')) process.exit(1)
        rmSync(targetDir, { recursive: true })
      }

      console.log(`  Cloning ${source}...`)
      try {
        // Use execFileSync with array args to prevent command injection
        execFileSync('git', ['clone', '--depth', '1', source, targetDir], { stdio: 'pipe' })
        console.log(`  ${GREEN}✓${NC} Installed "${repoName}" to community skills`)
      } catch (err) {
        console.error(`  ${RED}Failed to clone: ${err.message}${NC}`)
        process.exit(1)
      }
    } else {
      // Local path copy
      const skillName = source.split('/').pop().split('\\').pop()
      const targetDir = join(communityDir, skillName)

      if (!existsSync(source)) {
        console.error(`  ${RED}Source not found: ${source}${NC}`)
        process.exit(1)
      }

      if (existsSync(targetDir)) {
        console.error(`  ${YELLOW}Skill "${skillName}" already installed. Use --force to overwrite.${NC}`)
        if (!args.includes('--force')) process.exit(1)
        rmSync(targetDir, { recursive: true })
      }

      cpSync(source, targetDir, { recursive: true })
      console.log(`  ${GREEN}✓${NC} Installed "${skillName}" to community skills`)
    }

  } else if (subCmd === 'remove') {
    const skillName = args[2]
    if (!skillName) {
      console.error(`  ${RED}Usage: specialist-agent community remove <skill-name>${NC}`)
      process.exit(1)
    }

    // Validate skill name — prevent path traversal (e.g. "../../etc")
    if (!/^[a-zA-Z0-9._-]+$/.test(skillName)) {
      console.error(`  ${RED}Invalid skill name. Use only letters, numbers, dots, hyphens, and underscores.${NC}`)
      process.exit(1)
    }

    const targetDir = join(communityDir, skillName)
    if (!existsSync(targetDir)) {
      console.error(`  ${RED}Skill "${skillName}" not found in community skills${NC}`)
      process.exit(1)
    }

    rmSync(targetDir, { recursive: true })
    console.log(`  ${GREEN}✓${NC} Removed "${skillName}" from community skills`)

  } else {
    console.error(`  ${YELLOW}Unknown subcommand: ${subCmd}${NC}`)
    console.log(`  Usage: specialist-agent community [list|install|remove]`)
    process.exit(1)
  }
}

// ── Detect Command ──────────────────────────────────

async function detectArchitecture() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
  clack.intro(`Architecture Detection ${DIM}v${pkg.version}${NC}`)

  const cwd = process.cwd()
  const isJson = args.includes('--json')

  // Detect framework
  const packs = readdirSync(join(ROOT, 'packs'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
  const framework = detectFramework(join(cwd, 'package.json'), packs)

  // Run detection
  const s = clack.spinner()
  s.start('Scanning project structure...')

  const result = detectProjectArchitecture(cwd, { framework })

  s.stop('Detection complete')

  if (isJson) {
    console.log(JSON.stringify(result, null, 2))
    return
  }

  // Display report
  const report = generateDetectionReport(result)
  clack.note(report, 'Architecture Detection')

  // Get recommendations
  const teamSize = await clack.select({
    message: 'Team size (for recommendations)?',
    options: [
      { value: 'small', label: '1-3 developers', hint: 'Solo or small team' },
      { value: 'medium', label: '3-10 developers', hint: 'Medium team' },
      { value: 'large', label: '10-20 developers', hint: 'Large team' },
      { value: 'enterprise', label: '20+ developers', hint: 'Enterprise' },
    ],
  })

  if (clack.isCancel(teamSize)) handleCancel()

  const recs = getRecommendations(result, { teamSize })

  // Display recommendations
  const recLines = []
  recLines.push(recs.reason)
  recLines.push('')

  if (recs.monorepoNote) {
    recLines.push(recs.monorepoNote)
    recLines.push('')
  }

  for (const rec of recs.recommendations) {
    const tagLabel = rec.tag === 'recommended' ? `${GREEN}RECOMMENDED${NC}`
      : rec.tag === 'backend-recommended' ? `${YELLOW}BACKEND${NC}`
      : `${DIM}ALTERNATIVE${NC}`
    const sameNote = rec.isSameArch ? ` ${DIM}(current)${NC}` : ''

    recLines.push(`  ${tagLabel} ${BOLD}${rec.name}${NC}${sameNote}`)
    recLines.push(`  ${DIM}${rec.description}${NC}`)

    if (rec.migration) {
      const effortColor = rec.migration.effort === 'low' ? GREEN : rec.migration.effort === 'medium' ? YELLOW : RED
      recLines.push(`  Migration: ${effortColor}${rec.migration.effort}${NC} - ${rec.migration.description}`)
      recLines.push(`  Agents: ${rec.migration.agents.join(', ')}`)
    }

    recLines.push(`  Variants:`)
    for (const v of rec.variants) {
      recLines.push(`    ${BOLD}${v.name}${NC}: ${v.description.slice(0, 100)}${v.description.length > 100 ? '...' : ''}`)
      if (v.directoryStructure) {
        for (const line of v.directoryStructure.slice(0, 6)) {
          recLines.push(`      ${DIM}${line}${NC}`)
        }
        if (v.directoryStructure.length > 6) {
          recLines.push(`      ${DIM}... (${v.directoryStructure.length - 6} more)${NC}`)
        }
      }
    }
    recLines.push('')
  }

  // Framework notes
  if (recs.frameworkNotes) {
    recLines.push(`${BOLD}Framework Notes:${NC}`)
    for (const note of recs.frameworkNotes.extraNotes) {
      recLines.push(`  - ${note}`)
    }
    if (recs.frameworkNotes.preferredStateManagement) {
      recLines.push(`  State management: ${recs.frameworkNotes.preferredStateManagement}`)
    }
  }

  clack.note(recLines.join('\n'), 'Architecture Recommendations')

  // Offer to generate ARCHITECTURE.md
  const generateArch = await clack.confirm({
    message: 'Generate docs/ARCHITECTURE.md for the recommended architecture?',
    initialValue: false,
  })

  if (clack.isCancel(generateArch)) handleCancel()

  if (generateArch && recs.recommendations.length > 0) {
    const archChoice = recs.recommendations.length > 1
      ? await clack.select({
          message: 'Which architecture?',
          options: recs.recommendations.map(r => ({
            value: r.id,
            label: r.name,
            hint: r.tag === 'recommended' ? 'Recommended' : r.tag,
          })),
        })
      : recs.recommendations[0].id

    if (clack.isCancel(archChoice)) handleCancel()

    const variantChoice = await clack.select({
      message: 'Which variant?',
      options: [
        { value: 'full', label: 'Full', hint: 'All layers and patterns' },
        { value: 'lite', label: 'Simplified', hint: 'Fewer layers, same principles' },
      ],
    })

    if (clack.isCancel(variantChoice)) handleCancel()

    const guide = generateArchitectureGuide({
      architecture: archChoice,
      framework: framework || 'react',
      variant: variantChoice,
      nextjsRouter: result.nextjsRouter,
    })

    const archDest = join(cwd, 'docs', 'ARCHITECTURE.md')
    if (existsSync(archDest)) {
      const overwrite = await clack.confirm({
        message: 'docs/ARCHITECTURE.md already exists. Overwrite?',
        initialValue: false,
      })
      if (clack.isCancel(overwrite)) handleCancel()
      if (!overwrite) {
        clack.log.info('Skipped ARCHITECTURE.md generation.')
        clack.outro('Detection complete!')
        return
      }
    }

    mkdirSync(dirname(archDest), { recursive: true })
    writeFileSync(archDest, guide)
    clack.log.success(`Generated docs/ARCHITECTURE.md (${ARCHITECTURE_PATTERNS[archChoice]?.name || archChoice} - ${variantChoice})`)
  }

  clack.outro('Detection complete! Use /migrate-architecture to apply changes.')
}

// ── Command Router ───────────────────────────────────

if (command === 'detect') {
  detectArchitecture().catch(err => {
    clack.log.error(err.message)
    process.exit(1)
  })
} else if (command === 'create-agent') {
  createAgent().catch(err => {
    clack.log.error(err.message)
    process.exit(1)
  })
} else if (command === 'list') {
  listAgents()
} else if (command === 'profiles') {
  manageProfiles().catch(err => {
    clack.log.error(err.message)
    process.exit(1)
  })
} else if (command === 'community') {
  manageCommunity().catch(err => {
    clack.log.error(err.message)
    process.exit(1)
  })
} else {
  // Default to init

// ── Main ─────────────────────────────────────────────

async function main() {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))

  clack.intro(`Specialist Agent ${DIM}v${pkg.version}${NC}`)

  // Check for updates (non-blocking)
  const latestVersion = await checkForUpdates(pkg.version)
  if (latestVersion) {
    clack.log.warn(`Update available: v${pkg.version} → v${latestVersion}`)
    clack.log.info(`${DIM}Run: npm i -g specialist-agent@latest${NC}`)
  }

  const cwd = process.cwd()

  // ── Auto-detect everything ──────────────────────────

  // Check/create package.json
  if (!existsSync(join(cwd, 'package.json'))) {
    clack.log.warn('No package.json found.')

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

  // Auto-detect framework
  const packs = readdirSync(join(ROOT, 'packs'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  const packLabels = { vue: 'Vue 3', react: 'React', nextjs: 'Next.js', svelte: 'SvelteKit', angular: 'Angular', astro: 'Astro', nuxt: 'Nuxt' }

  const detected = detectFramework(join(cwd, 'package.json'), packs)

  // Auto-detect platforms
  const detectedPlatforms = detectPlatforms(cwd)
  const platformLabels = detectedPlatforms.map(p => p.label).join(', ')

  // Auto-detect architecture
  let framework = detected
  const isEmptyProject = !detected
  const archDetection = detectProjectArchitecture(cwd, { framework: isEmptyProject ? null : framework })
  const detectedArch = archDetection.architecture
  const detectedArchName = ARCHITECTURE_PATTERNS[detectedArch]?.name || detectedArch

  // ── Show detection results ──────────────────────────

  const detectionLines = []
  if (detected) {
    detectionLines.push(`${GREEN}✓${NC} Framework: ${BOLD}${packLabels[detected] || detected}${NC}`)
  } else {
    detectionLines.push(`${DIM}○ Framework: none detected (empty project)${NC}`)
  }
  detectionLines.push(`${GREEN}✓${NC} Platforms: ${BOLD}${platformLabels}${NC}`)
  if (detectedArch && detectedArch !== 'unstructured') {
    detectionLines.push(`${GREEN}✓${NC} Architecture: ${BOLD}${detectedArchName}${NC}`)
  }
  if (archDetection.monorepo) {
    detectionLines.push(`${GREEN}✓${NC} Monorepo: ${BOLD}${archDetection.monorepo.name}${NC} (${archDetection.monorepo.apps.length} apps/packages)`)
  }

  clack.note(detectionLines.join('\n'), 'Auto-detected')

  // ── Step 1: Framework (only ask if not detected) ────

  if (!detected) {
    clack.log.info('No framework detected — installing all agents.')
    clack.log.info(`${DIM}When you choose a framework, re-run: npx specialist-agent init${NC}`)

    const frameworkOptions = [
      { value: 'none', label: 'No framework yet', hint: 'Install all agents — decide later' },
      ...packs.map(p => ({
        value: p,
        label: packLabels[p] || p.charAt(0).toUpperCase() + p.slice(1),
      })),
    ]

    framework = await clack.select({
      message: 'Framework (or skip)?',
      options: frameworkOptions,
    })

    if (clack.isCancel(framework)) handleCancel()
  }

  const isNone = framework === 'none' || !framework

  // ── Step 2: Mode ────────────────────────────────────

  const mode = await clack.select({
    message: 'Agent mode?',
    options: [
      { value: 'full', label: 'Full', hint: 'Sonnet/Opus — best quality' },
      { value: 'lite', label: 'Lite', hint: 'Haiku — lower cost, faster' },
    ],
  })

  if (clack.isCancel(mode)) handleCancel()

  // ── Step 3: Install scope ──────────────────────────

  const installScope = await clack.select({
    message: 'Install scope?',
    options: [
      { value: 'project', label: 'This project', hint: '.claude/agents/' },
      { value: 'global', label: 'Global', hint: '~/.claude/agents/ — all projects' },
    ],
  })

  if (clack.isCancel(installScope)) handleCancel()

  // ── Step 4: Customize (optional) ───────────────────

  const customize = await clack.confirm({
    message: `Customize installation? ${DIM}(hooks, architecture, agent selection)${NC}`,
    initialValue: false,
  })

  if (clack.isCancel(customize)) handleCancel()

  let selectedHooks = ['security-guard', 'auto-dispatch', 'session-context', 'mcp-discovery']
  let installArch = true
  let selectedArchitecture = 'modular'
  let selectedArchVariant = 'full'
  let generateCustomArch = false
  let installStarter = true
  let installWorkflow = true
  let installSpecialists = true
  let installBusiness = true

  if (customize) {
    // Native hooks selection
    const hookChoices = await clack.multiselect({
      message: 'Native Claude Code hooks:',
      options: [
        { value: 'security-guard', label: 'Security Guard', hint: 'Block dangerous commands', selected: true },
        { value: 'auto-dispatch', label: 'Auto-Dispatch', hint: 'Suggest agents based on prompt', selected: true },
        { value: 'session-context', label: 'Session Context', hint: 'Inject project state on start', selected: true },
        { value: 'mcp-discovery', label: 'MCP Discovery', hint: 'Detect MCP servers and enhance agents', selected: true },
        { value: 'auto-format', label: 'Auto-Format', hint: 'Format files after Write/Edit', selected: false },
      ],
      required: false,
    })

    if (!clack.isCancel(hookChoices)) {
      selectedHooks = hookChoices
    }

    // Agent group selection
    const agentGroups = await clack.multiselect({
      message: 'Agent groups to install:',
      options: [
        { value: 'core', label: 'Core', hint: '@builder, @reviewer, @doctor, @migrator, @starter', selected: true },
        { value: 'workflow', label: 'Workflow', hint: '@planner, @executor, @tdd, @debugger, @pair, @analyst, @orchestrator', selected: true },
        { value: 'specialist', label: 'Specialist', hint: '@api, @perf, @security, @finance, @data, @devops, @architect, ...', selected: true },
        { value: 'business', label: 'Business', hint: '@marketing, @product, @support', selected: true },
      ],
      required: true,
    })

    if (!clack.isCancel(agentGroups)) {
      installStarter = agentGroups.includes('core')
      installWorkflow = agentGroups.includes('workflow')
      installSpecialists = agentGroups.includes('specialist')
      installBusiness = agentGroups.includes('business')
    }

    // Architecture selection
    const archAction = await clack.select({
      message: 'Architecture guide?',
      options: [
        { value: 'default', label: 'Modular (default)', hint: 'Feature-based — recommended for most projects' },
        { value: 'choose', label: 'Choose pattern', hint: 'Clean, Hexagonal, DDD, CQRS, ...' },
        { value: 'detect', label: 'Detect & suggest', hint: 'Analyze your project and recommend' },
        { value: 'skip', label: 'Skip', hint: 'No architecture guide' },
      ],
    })

    if (clack.isCancel(archAction)) handleCancel()

    if (archAction === 'skip') {
      installArch = false
    } else if (archAction === 'detect') {
      const teamSize = await clack.select({
        message: 'Team size?',
        options: [
          { value: 'small', label: '1-3 developers' },
          { value: 'medium', label: '3-10 developers' },
          { value: 'large', label: '10-20 developers' },
          { value: 'enterprise', label: '20+ developers' },
        ],
      })

      if (clack.isCancel(teamSize)) handleCancel()

      const recs = getRecommendations(archDetection, { teamSize })

      const recOptions = []
      for (const rec of recs.recommendations) {
        const tagPrefix = rec.tag === 'recommended' ? '[RECOMMENDED] '
          : rec.tag === 'backend-recommended' ? '[BACKEND] '
          : ''
        const effortNote = rec.migration ? ` (effort: ${rec.migration.effort})` : ''
        const sameNote = rec.isSameArch ? ' (current)' : ''

        recOptions.push({
          value: rec.id,
          label: `${tagPrefix}${rec.name}${sameNote}`,
          hint: `${rec.description.slice(0, 60)}${effortNote}`,
        })
      }

      recOptions.push({ value: 'skip', label: 'Skip', hint: 'No architecture guide' })

      if (recs.reason) clack.log.info(recs.reason)

      const archChoice = await clack.select({
        message: 'Which architecture?',
        options: recOptions,
      })

      if (clack.isCancel(archChoice)) handleCancel()

      if (archChoice !== 'skip') {
        selectedArchitecture = archChoice
        generateCustomArch = true

        const chosenRec = recs.recommendations.find(r => r.id === archChoice)
        if (chosenRec?.variants.length > 0) {
          const variantChoice = await clack.select({
            message: 'Variant?',
            options: chosenRec.variants.map(v => ({
              value: v.id,
              label: v.name,
              hint: v.description.slice(0, 70),
            })),
          })

          if (clack.isCancel(variantChoice)) handleCancel()
          selectedArchVariant = variantChoice
        }

        if (chosenRec?.migration && !chosenRec.isSameArch) {
          clack.log.info(`${DIM}After install, use /migrate-architecture to apply.${NC}`)
        }
      } else {
        installArch = false
      }
    } else if (archAction === 'choose') {
      const archChoice = await clack.select({
        message: 'Architecture pattern?',
        options: [
          { value: 'modular', label: 'Modular (Feature-Based)', hint: 'Recommended for most projects' },
          { value: 'clean', label: 'Clean Architecture', hint: 'Domain > Use Cases > Adapters' },
          { value: 'hexagonal', label: 'Hexagonal (Ports & Adapters)', hint: 'Core isolated' },
          { value: 'fsd', label: 'Feature-Sliced Design', hint: 'Strict layered' },
          { value: 'ddd', label: 'Domain-Driven Design', hint: 'Bounded contexts' },
          { value: 'modular-monolith', label: 'Modular Monolith', hint: 'Backend/fullstack' },
          { value: 'atomic', label: 'Atomic Design', hint: 'Component granularity' },
          { value: 'cqrs', label: 'CQRS', hint: 'Command/query separation' },
          { value: 'mvc', label: 'MVC / Layered', hint: 'Classic layers' },
        ],
      })

      if (clack.isCancel(archChoice)) handleCancel()
      selectedArchitecture = archChoice
      generateCustomArch = true

      const variantChoice = await clack.select({
        message: 'Variant?',
        options: [
          { value: 'full', label: 'Full', hint: 'All layers — established teams' },
          { value: 'lite', label: 'Simplified', hint: 'Fewer layers — smaller teams' },
        ],
      })

      if (clack.isCancel(variantChoice)) handleCancel()
      selectedArchVariant = variantChoice
    }
    // archAction === 'default': keep defaults
  }

  // ── Install ─────────────────────────────────────────

  const defaultPack = isNone ? 'react' : framework
  const packDir = join(ROOT, 'packs', defaultPack)
  const agentsSource = mode === 'lite' ? join(packDir, 'agents-lite') : join(packDir, 'agents')
  const skillsSource = join(packDir, 'skills')
  const claudeSource = isNone ? join(ROOT, 'CLAUDE.md') : join(packDir, 'CLAUDE.md')

  const installGlobal = installScope === 'global'
  const agentsDest = installGlobal
    ? join(homedir(), '.claude', 'agents')
    : join(cwd, '.claude', 'agents')
  mkdirSync(agentsDest, { recursive: true })

  // Handle existing agents
  const existingAgents = detectExistingAgents(agentsDest)
  let shouldOverwrite = forceMode

  if (existingAgents.length > 0 && !forceMode) {
    const overwriteChoice = await clack.confirm({
      message: `${existingAgents.length} existing agents found. Overwrite?`,
      initialValue: false,
    })
    if (clack.isCancel(overwriteChoice)) handleCancel()
    shouldOverwrite = overwriteChoice
  }

  const s = clack.spinner()
  s.start('Installing agents, skills, and platform configs...')

  // Install pack agents
  if (existsSync(agentsSource)) {
    if (shouldOverwrite) {
      copyDir(agentsSource, agentsDest)
    } else {
      copyNewOnly(agentsSource, agentsDest)
    }
  }

  // Install all agent groups
  const allAgentNames = []

  if (installStarter) allAgentNames.push('starter')

  if (installWorkflow) {
    allAgentNames.push('planner', 'executor', 'tdd', 'debugger', 'pair', 'analyst', 'orchestrator', 'scout', 'memory')
  }

  if (installSpecialists) {
    allAgentNames.push(
      'api', 'perf', 'i18n', 'docs', 'refactor', 'deps',
      'explorer', 'finance', 'cloud', 'security', 'designer', 'data',
      'devops', 'tester', 'legal', 'architect', 'ripple', 'sentry-triage'
    )
  }

  if (installBusiness) {
    allAgentNames.push('marketing', 'product', 'support')
  }

  for (const name of allAgentNames) {
    const suffix = mode === 'lite' ? '-lite.md' : '.md'
    const source = join(ROOT, 'agents', `${name}${suffix}`)
    const dest = join(agentsDest, `${name}.md`)
    if (existsSync(source) && (shouldOverwrite || !existsSync(dest))) {
      cpSync(source, dest)
    }
  }

  // Install skills
  const skillsDest = join(cwd, '.claude', 'skills')
  mkdirSync(skillsDest, { recursive: true })
  let skillCount = 0
  if (existsSync(skillsSource)) {
    skillCount = shouldOverwrite
      ? copyDir(skillsSource, skillsDest)
      : copyNewOnly(skillsSource, skillsDest)
  }

  const genericSkillsSource = join(ROOT, 'skills')
  if (existsSync(genericSkillsSource)) {
    skillCount += shouldOverwrite
      ? copyDir(genericSkillsSource, skillsDest)
      : copyNewOnly(genericSkillsSource, skillsDest)
  }

  // Install native hooks (defaults: security-guard, auto-dispatch, session-context)
  let nativeHooksInstalled = 0
  if (selectedHooks.length > 0) {
    nativeHooksInstalled = setupNativeHooks(cwd, selectedHooks)
  }

  // Install ARCHITECTURE.md
  const archDest = join(cwd, 'docs', 'ARCHITECTURE.md')
  let archInstalled = false
  if (installArch) {
    if (generateCustomArch) {
      const guide = generateArchitectureGuide({
        architecture: selectedArchitecture,
        framework: defaultPack,
        variant: selectedArchVariant,
        nextjsRouter: archDetection.nextjsRouter,
      })
      mkdirSync(dirname(archDest), { recursive: true })
      writeFileSync(archDest, guide)
      archInstalled = true
    } else if (!existsSync(archDest)) {
      // Default: generate Modular architecture
      const guide = generateArchitectureGuide({
        architecture: 'modular',
        framework: defaultPack,
        variant: 'full',
        nextjsRouter: archDetection.nextjsRouter,
      })
      mkdirSync(dirname(archDest), { recursive: true })
      writeFileSync(archDest, guide)
      archInstalled = true
    }
  }

  // Install CLAUDE.md
  const claudeDest = join(cwd, 'CLAUDE.md')
  let claudeInstalled = false
  if (!existsSync(claudeDest)) {
    if (claudeSource && existsSync(claudeSource)) {
      cpSync(claudeSource, claudeDest)
      claudeInstalled = true
    } else {
      const rootClaude = join(ROOT, 'CLAUDE.md')
      if (existsSync(rootClaude)) {
        cpSync(rootClaude, claudeDest)
        claudeInstalled = true
      }
    }
  }

  // ── Setup platform configs ─────────────────────────

  const extraPlatforms = detectedPlatforms.filter(p => p.id !== 'claude-code')
  const platformResults = extraPlatforms.length > 0
    ? setupPlatformConfigs(cwd, extraPlatforms, { framework: defaultPack, version: pkg.version })
    : []

  s.stop('Installation complete')

  // ── Summary ────────────────────────────────────────

  const installedAgentNames = getAgentNames(agentsDest)
  const packLabel = isNone ? 'Universal' : (packLabels[framework] || framework)

  const summaryLines = []
  summaryLines.push(`${BOLD}${installedAgentNames.length} agents${NC} installed`)
  if (skillCount > 0) summaryLines.push(`${BOLD}${skillCount} skills${NC} installed`)
  if (nativeHooksInstalled > 0) summaryLines.push(`${BOLD}${nativeHooksInstalled} native hooks${NC} configured`)
  if (archInstalled) {
    const archLabel = ARCHITECTURE_PATTERNS[selectedArchitecture]?.name || selectedArchitecture
    const varLabel = selectedArchVariant === 'lite' ? ' (Simplified)' : ''
    summaryLines.push(`${GREEN}✓${NC} docs/ARCHITECTURE.md (${archLabel}${varLabel})`)
  }
  if (claudeInstalled) summaryLines.push(`${GREEN}✓${NC} CLAUDE.md`)

  // Platform results
  summaryLines.push('')
  summaryLines.push(`${BOLD}Platforms:${NC}`)
  summaryLines.push(`  ${GREEN}✓${NC} Claude Code → .claude/agents/`)
  for (const result of platformResults) {
    summaryLines.push(`  ${GREEN}✓${NC} ${result.platform} → ${result.path}`)
  }

  if (existingAgents.length > 0 && !shouldOverwrite) {
    summaryLines.push('')
    summaryLines.push(`${DIM}${existingAgents.length} existing agent(s) preserved. Use --force to overwrite.${NC}`)
  }

  const scopeLabel = installGlobal ? 'Global' : 'Project'
  clack.note(summaryLines.join('\n'), `${packLabel} · ${mode === 'full' ? 'Full' : 'Lite'} · ${scopeLabel}`)

  // Getting started
  const installedSkills = existsSync(skillsDest)
    ? readdirSync(skillsDest, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => '/' + d.name)
    : []

  clack.note(buildGettingStarted(installedAgentNames, installedSkills, archInstalled, isNone), 'Getting started')

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
}
