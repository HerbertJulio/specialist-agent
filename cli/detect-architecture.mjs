/**
 * Architecture Detection Engine
 *
 * Scans a project directory to detect:
 * 1. Monorepo pattern (Turborepo, Nx, Lerna, pnpm, npm/yarn workspaces)
 * 2. Framework (Next.js, React, Vue, Nuxt, Svelte, Angular, Astro)
 * 3. Architecture pattern with confidence score
 * 4. Sub-project architectures (for monorepos)
 *
 * Returns structured detection result with migration suggestions.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { join, relative } from 'path'
import { ARCHITECTURE_PATTERNS, MONOREPO_PATTERNS, getSuggestedArchitectures } from './architectures.mjs'

// ── Main Detection Function ───────────────────────────

export function detectProjectArchitecture(cwd, options = {}) {
  const { framework = null, verbose = false } = options

  const result = {
    monorepo: detectMonorepo(cwd),
    framework: framework,
    architecture: null,
    confidence: 0,
    scores: {},
    subProjects: [],
    nextjsRouter: null,
    projectInfo: {
      hasTypeScript: false,
      hasSrc: false,
      totalDirs: 0,
      totalFiles: 0,
      srcRoot: '',
    },
  }

  // Gather project info
  result.projectInfo = gatherProjectInfo(cwd)

  // Detect Next.js router type if applicable
  if (framework === 'nextjs') {
    result.nextjsRouter = detectNextjsRouterType(cwd)
  }

  // Detect architecture
  const srcRoot = result.projectInfo.srcRoot
  const detectionResult = scoreAllPatterns(cwd, srcRoot)
  result.scores = detectionResult.scores
  result.architecture = detectionResult.bestMatch
  result.confidence = detectionResult.bestScore

  // For monorepos, also detect sub-project architectures
  if (result.monorepo) {
    result.subProjects = detectSubProjectArchitectures(cwd, result.monorepo)
  }

  return result
}

// ── Monorepo Detection ────────────────────────────────

export function detectMonorepo(cwd) {
  // Check in priority order
  for (const [id, pattern] of Object.entries(MONOREPO_PATTERNS)) {
    // Check detect files
    if (pattern.detectFiles?.length > 0) {
      const hasFile = pattern.detectFiles.some(f => existsSync(join(cwd, f)))
      if (hasFile) {
        return {
          type: id,
          name: pattern.name,
          workspaceConfig: pattern.workspaceConfig,
          apps: findMonorepoApps(cwd, id),
        }
      }
    }

    // Check detect deps
    if (pattern.detectDeps?.length > 0) {
      const pkgPath = join(cwd, 'package.json')
      if (existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
          const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
          const hasDep = pattern.detectDeps.some(d => deps[d])
          if (hasDep) {
            return {
              type: id,
              name: pattern.name,
              workspaceConfig: pattern.workspaceConfig,
              apps: findMonorepoApps(cwd, id),
            }
          }
        } catch {}
      }
    }

    // Check custom rules
    if (pattern.customRule === 'package-json-workspaces') {
      const pkgPath = join(cwd, 'package.json')
      if (existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
          if (pkg.workspaces) {
            // Make sure it's not already detected as turborepo/nx/lerna
            const alreadyDetected = ['turbo.json', 'nx.json', 'lerna.json', 'pnpm-workspace.yaml']
              .some(f => existsSync(join(cwd, f)))
            if (!alreadyDetected) {
              return {
                type: id,
                name: pattern.name,
                workspaceConfig: 'package.json',
                apps: findMonorepoApps(cwd, id),
              }
            }
          }
        } catch {}
      }
    }
  }

  return null
}

function findMonorepoApps(cwd, type) {
  const apps = []
  const searchDirs = []

  switch (type) {
    case 'turborepo':
    case 'workspaces':
      searchDirs.push('apps', 'packages')
      break
    case 'nx':
      searchDirs.push('apps', 'libs')
      break
    case 'lerna':
      searchDirs.push('packages')
      break
    case 'pnpm':
      // Read pnpm-workspace.yaml for workspace patterns
      try {
        const content = readFileSync(join(cwd, 'pnpm-workspace.yaml'), 'utf-8')
        const match = content.match(/packages:\s*\n((?:\s+-\s+.*\n?)*)/m)
        if (match) {
          const patterns = match[1].match(/'([^']+)'|"([^"]+)"|(\S+)/g)
          if (patterns) {
            for (const p of patterns) {
              const clean = p.replace(/['"]/g, '').replace(/\/\*$/, '').replace(/^\s*-\s*/, '')
              if (clean && !clean.startsWith('#')) searchDirs.push(clean)
            }
          }
        }
      } catch {}
      if (searchDirs.length === 0) searchDirs.push('apps', 'packages')
      break
  }

  for (const dir of searchDirs) {
    const fullPath = join(cwd, dir)
    if (!existsSync(fullPath)) continue

    try {
      const entries = readdirSync(fullPath, { withFileTypes: true })
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        const appPath = join(fullPath, entry.name)
        const appPkgPath = join(appPath, 'package.json')
        if (existsSync(appPkgPath)) {
          try {
            const pkg = JSON.parse(readFileSync(appPkgPath, 'utf-8'))
            apps.push({
              name: pkg.name || entry.name,
              path: relative(cwd, appPath),
              hasPackageJson: true,
            })
          } catch {
            apps.push({ name: entry.name, path: relative(cwd, appPath), hasPackageJson: true })
          }
        }
      }
    } catch {}
  }

  return apps
}

// ── Project Info Gathering ────────────────────────────

function gatherProjectInfo(cwd) {
  const info = {
    hasTypeScript: false,
    hasSrc: false,
    totalDirs: 0,
    totalFiles: 0,
    srcRoot: '',
  }

  // Check for TypeScript
  info.hasTypeScript = existsSync(join(cwd, 'tsconfig.json')) ||
    existsSync(join(cwd, 'tsconfig.app.json'))

  // Check for src directory
  info.hasSrc = existsSync(join(cwd, 'src'))
  info.srcRoot = info.hasSrc ? join(cwd, 'src') : cwd

  // Count dirs/files (shallow, for project size estimation)
  try {
    const entries = readdirSync(info.srcRoot, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      if (entry.isDirectory()) info.totalDirs++
      else info.totalFiles++
    }
  } catch {}

  return info
}

// ── Next.js Router Detection ──────────────────────────

function detectNextjsRouterType(cwd) {
  const appRouterPaths = [
    join(cwd, 'src', 'app', 'layout.tsx'),
    join(cwd, 'src', 'app', 'layout.ts'),
    join(cwd, 'src', 'app', 'layout.jsx'),
    join(cwd, 'app', 'layout.tsx'),
    join(cwd, 'app', 'layout.ts'),
  ]

  const pagesRouterPaths = [
    join(cwd, 'src', 'pages', '_app.tsx'),
    join(cwd, 'src', 'pages', '_app.ts'),
    join(cwd, 'src', 'pages', '_app.jsx'),
    join(cwd, 'pages', '_app.tsx'),
    join(cwd, 'pages', '_app.ts'),
  ]

  const hasAppRouter = appRouterPaths.some(p => existsSync(p))
  const hasPagesRouter = pagesRouterPaths.some(p => existsSync(p))

  if (hasAppRouter && hasPagesRouter) return 'hybrid'
  if (hasAppRouter) return 'app-router'
  if (hasPagesRouter) return 'pages-router'
  return 'unknown'
}

// ── Architecture Scoring Engine ───────────────────────

function scoreAllPatterns(cwd, srcRoot) {
  const scores = {}
  let bestMatch = 'unstructured'
  let bestScore = 0

  // Get directories at srcRoot level
  const srcDirs = listDirs(srcRoot)
  const rootDirs = srcRoot !== cwd ? listDirs(cwd) : srcDirs
  const allDirs = new Set([...srcDirs, ...rootDirs])

  for (const [patternId, pattern] of Object.entries(ARCHITECTURE_PATTERNS)) {
    if (patternId === 'unstructured') continue

    let score = 0
    const details = { matched: [], missed: [] }

    const detection = pattern.detection

    // Score required dirs (+3 each, all must be present for valid match)
    let allRequiredFound = true
    for (const dir of detection.requiredDirs) {
      if (dirExists(srcRoot, dir) || dirExists(cwd, dir)) {
        score += 3
        details.matched.push(`required dir: ${dir}`)
      } else {
        allRequiredFound = false
        details.missed.push(`required dir: ${dir}`)
      }
    }

    // If required dirs not all found and there are required dirs, heavily penalize
    if (detection.requiredDirs.length > 0 && !allRequiredFound) {
      score -= 10
    }

    // Score optional dirs (+1.5 each)
    for (const dir of detection.optionalDirs) {
      if (dirExists(srcRoot, dir) || dirExists(cwd, dir)) {
        score += 1.5
        details.matched.push(`optional dir: ${dir}`)
      }
    }

    // Score module sub-dirs (check inside modules/* or features/*)
    const moduleDirNames = ['modules', 'features', 'domains', 'bounded-contexts']
    let foundModuleDir = null
    for (const mDir of moduleDirNames) {
      if (dirExists(srcRoot, mDir)) { foundModuleDir = join(srcRoot, mDir); break }
      if (dirExists(cwd, mDir)) { foundModuleDir = join(cwd, mDir); break }
    }

    if (foundModuleDir && detection.moduleSubDirs.length > 0) {
      const moduleExamples = listDirs(foundModuleDir).slice(0, 3)
      for (const example of moduleExamples) {
        const examplePath = join(foundModuleDir, example)
        for (const subDir of detection.moduleSubDirs) {
          if (dirExists(examplePath, subDir)) {
            score += 2
            details.matched.push(`module subdir: ${example}/${subDir}`)
          }
        }
        for (const subDir of detection.optionalModuleSubDirs) {
          if (dirExists(examplePath, subDir)) {
            score += 1
            details.matched.push(`optional module subdir: ${example}/${subDir}`)
          }
        }
      }
    }

    // Score file patterns (+1 each)
    for (const filePattern of detection.filePatterns) {
      if (hasFileMatchingPattern(cwd, filePattern)) {
        score += 1
        details.matched.push(`file pattern: ${filePattern}`)
      }
    }

    // Anti-patterns (-2 each)
    for (const antiDir of detection.antiPatterns) {
      if (dirExists(srcRoot, antiDir) || dirExists(cwd, antiDir)) {
        score -= 2
        details.missed.push(`anti-pattern: ${antiDir}`)
      }
    }

    // Custom rules
    if (detection.customRule) {
      const customScore = evaluateCustomRule(detection.customRule, cwd, srcRoot, allDirs)
      score += customScore.score
      details.matched.push(...customScore.matched)
    }

    // Only consider if score meets minimum
    if (score >= detection.minScore) {
      scores[patternId] = { score, details, name: pattern.name }
      if (score > bestScore) {
        bestScore = score
        bestMatch = patternId
      }
    } else {
      scores[patternId] = { score, details, name: pattern.name, belowThreshold: true }
    }
  }

  return { scores, bestMatch, bestScore }
}

function evaluateCustomRule(rule, cwd, srcRoot, allDirs) {
  const result = { score: 0, matched: [] }

  switch (rule) {
    case 'fsd-layers': {
      const fsdLayers = ['app', 'processes', 'pages', 'widgets', 'features', 'entities', 'shared']
      let count = 0
      for (const layer of fsdLayers) {
        if (dirExists(srcRoot, layer) || dirExists(cwd, layer)) count++
      }
      if (count >= 3) {
        result.score = count * 2
        result.matched.push(`FSD: ${count}/7 layers found`)
      } else {
        result.score = -5
      }
      break
    }

    case 'atomic-layers': {
      const atomicLayers = ['atoms', 'molecules', 'organisms', 'templates']
      let count = 0
      for (const layer of atomicLayers) {
        if (findDirRecursive(srcRoot, layer, 2) || findDirRecursive(cwd, layer, 2)) count++
      }
      if (count >= 2) {
        result.score = count * 2
        result.matched.push(`Atomic: ${count}/4 layers found`)
      } else {
        result.score = -5
      }
      break
    }

    case 'flat-components': {
      const componentsDir = join(srcRoot, 'components')
      if (existsSync(componentsDir)) {
        try {
          const files = readdirSync(componentsDir).filter(f => !f.startsWith('.'))
          const componentFiles = files.filter(f =>
            f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.vue') || f.endsWith('.svelte') || f.endsWith('.astro')
          )
          if (componentFiles.length > 5) {
            result.score = 3
            result.matched.push(`Flat: ${componentFiles.length} component files in src/components/`)
          }
        } catch {}
      }
      break
    }

    case 'screaming-domains': {
      // Check if top-level dirs in src are business nouns (not technical names)
      const technicalDirs = new Set([
        'components', 'utils', 'helpers', 'hooks', 'services', 'types', 'config',
        'constants', 'assets', 'styles', 'lib', 'shared', 'common', 'core',
        'app', 'pages', 'routes', 'api', '__tests__', 'test', 'tests',
        'public', 'static', 'vendor', 'plugins', 'middleware', 'store',
        'stores', 'adapters', 'providers', 'layouts', 'modules', 'features',
        'domain', 'infrastructure', 'presentation', 'application',
      ])
      const srcEntries = listDirs(srcRoot)
      let domainCount = 0
      let technicalCount = 0
      for (const dir of srcEntries) {
        if (technicalDirs.has(dir.toLowerCase())) technicalCount++
        else domainCount++
      }
      if (domainCount >= 3 && domainCount > technicalCount) {
        result.score = domainCount * 1.5
        result.matched.push(`Screaming: ${domainCount} domain dirs vs ${technicalCount} technical dirs`)
      } else {
        result.score = -3
      }
      break
    }

    case 'microservices-check': {
      // Multiple package.json files in subdirectories
      let serviceCount = 0
      for (const dir of ['services', 'apps', 'packages']) {
        const fullPath = join(cwd, dir)
        if (existsSync(fullPath)) {
          try {
            const entries = readdirSync(fullPath, { withFileTypes: true })
            for (const entry of entries) {
              if (entry.isDirectory()) {
                if (existsSync(join(fullPath, entry.name, 'package.json'))) {
                  serviceCount++
                }
              }
            }
          } catch {}
        }
      }
      // Also check for multiple Dockerfiles
      let dockerfileCount = 0
      for (const dir of ['services', 'apps', '.']) {
        const fullPath = dir === '.' ? cwd : join(cwd, dir)
        if (existsSync(fullPath)) {
          try {
            const entries = readdirSync(fullPath, { withFileTypes: true })
            for (const entry of entries) {
              if (entry.isDirectory() && existsSync(join(fullPath, entry.name, 'Dockerfile'))) {
                dockerfileCount++
              }
            }
          } catch {}
        }
      }
      if (serviceCount >= 2 || dockerfileCount >= 2) {
        result.score = serviceCount + dockerfileCount
        result.matched.push(`Microservices: ${serviceCount} services, ${dockerfileCount} Dockerfiles`)
      }
      break
    }

    case 'modular-monolith-check': {
      // Single package.json but modules with internal layering
      const singlePkg = existsSync(join(cwd, 'package.json'))
      const moduleDirNames = ['modules', 'bounded-contexts']
      let foundModuleDir = null
      for (const mDir of moduleDirNames) {
        if (dirExists(srcRoot, mDir)) { foundModuleDir = join(srcRoot, mDir); break }
        if (dirExists(cwd, mDir)) { foundModuleDir = join(cwd, mDir); break }
      }
      if (singlePkg && foundModuleDir) {
        const moduleExamples = listDirs(foundModuleDir).slice(0, 3)
        let hasInternalLayers = 0
        for (const example of moduleExamples) {
          const examplePath = join(foundModuleDir, example)
          if (dirExists(examplePath, 'domain') || dirExists(examplePath, 'application') || dirExists(examplePath, 'infrastructure')) {
            hasInternalLayers++
          }
        }
        if (hasInternalLayers >= 1) {
          result.score = 4 + hasInternalLayers
          result.matched.push(`Modular Monolith: ${hasInternalLayers} modules with internal layering`)
        }
      }
      break
    }

    case 'unstructured-fallback': {
      result.score = 1
      result.matched.push('Fallback: no clear pattern detected')
      break
    }
  }

  return result
}

// ── Sub-Project Detection (Monorepos) ─────────────────

function detectSubProjectArchitectures(cwd, monorepo) {
  const subProjects = []

  for (const app of monorepo.apps) {
    const appPath = join(cwd, app.path)
    const appInfo = gatherProjectInfo(appPath)
    const detection = scoreAllPatterns(appPath, appInfo.srcRoot)

    // Detect framework for this sub-project
    let framework = null
    const pkgPath = join(appPath, 'package.json')
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
        if (deps['nuxt']) framework = 'nuxt'
        else if (deps['next']) framework = 'nextjs'
        else if (deps['@sveltejs/kit'] || deps['svelte']) framework = 'svelte'
        else if (deps['@angular/core']) framework = 'angular'
        else if (deps['astro']) framework = 'astro'
        else if (deps['vue']) framework = 'vue'
        else if (deps['react']) framework = 'react'
      } catch {}
    }

    subProjects.push({
      ...app,
      framework,
      architecture: detection.bestMatch,
      confidence: detection.bestScore,
    })
  }

  return subProjects
}

// ── Utility Functions ─────────────────────────────────

function listDirs(dirPath) {
  if (!existsSync(dirPath)) return []
  try {
    return readdirSync(dirPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
      .map(d => d.name)
  } catch {
    return []
  }
}

function dirExists(base, name) {
  return existsSync(join(base, name)) && isDir(join(base, name))
}

function isDir(path) {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

function findDirRecursive(base, name, maxDepth) {
  if (maxDepth <= 0 || !existsSync(base)) return false
  try {
    const entries = readdirSync(base, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      if (entry.isDirectory()) {
        if (entry.name === name) return true
        if (maxDepth > 1 && findDirRecursive(join(base, entry.name), name, maxDepth - 1)) return true
      }
    }
  } catch {}
  return false
}

function hasFileMatchingPattern(cwd, pattern) {
  // Simple glob matching: check if any file matches the pattern
  // Handles: **/dir/file, dir/*/file, specific files
  const parts = pattern.split('/')

  if (pattern.startsWith('**/')) {
    const rest = pattern.slice(3)
    return findFileRecursive(cwd, rest, 3)
  }

  // Check as direct path (with glob expansion for * in directory names)
  if (parts.includes('*')) {
    // e.g., services/*/package.json
    return expandGlobPath(cwd, parts)
  }

  // Direct file check
  return existsSync(join(cwd, pattern))
}

function findFileRecursive(base, pattern, maxDepth) {
  if (maxDepth <= 0 || !existsSync(base)) return false

  const parts = pattern.split('/')
  const fileName = parts[parts.length - 1]
  const dirName = parts.length > 1 ? parts[0] : null

  try {
    const entries = readdirSync(base, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue

      if (entry.isDirectory()) {
        if (dirName && entry.name === dirName) {
          // Found the directory, check deeper
          const restPattern = parts.slice(1).join('/')
          if (findFileRecursive(join(base, entry.name), restPattern, maxDepth - 1)) return true
        }
        // Also check recursively
        if (findFileRecursive(join(base, entry.name), pattern, maxDepth - 1)) return true
      } else if (!dirName) {
        // Check file name matching
        if (matchFileName(entry.name, fileName)) return true
      }
    }
  } catch {}
  return false
}

function expandGlobPath(base, parts) {
  if (parts.length === 0) return true
  if (!existsSync(base)) return false

  const [current, ...rest] = parts

  if (current === '*') {
    try {
      const entries = readdirSync(base, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
        if (entry.isDirectory() && rest.length > 0) {
          if (expandGlobPath(join(base, entry.name), rest)) return true
        } else if (!entry.isDirectory() && rest.length === 0) {
          return true
        }
      }
    } catch {}
    return false
  }

  if (rest.length === 0) {
    // Last part - check if file exists
    return existsSync(join(base, current))
  }

  return expandGlobPath(join(base, current), rest)
}

function matchFileName(actual, pattern) {
  if (!pattern.includes('*')) return actual === pattern
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$')
  return regex.test(actual)
}

// ── Report Generation ─────────────────────────────────

export function generateDetectionReport(result) {
  const lines = []

  lines.push('Architecture Detection Report')
  lines.push('─'.repeat(40))
  lines.push('')

  // Monorepo
  if (result.monorepo) {
    lines.push(`Monorepo: ${result.monorepo.name}`)
    lines.push(`  Config: ${result.monorepo.workspaceConfig}`)
    if (result.monorepo.apps.length > 0) {
      lines.push(`  Apps/Packages: ${result.monorepo.apps.length}`)
      for (const app of result.monorepo.apps) {
        lines.push(`    - ${app.name} (${app.path})`)
      }
    }
    lines.push('')
  }

  // Framework
  if (result.framework) {
    const labels = { vue: 'Vue 3', react: 'React', nextjs: 'Next.js', svelte: 'SvelteKit', angular: 'Angular', astro: 'Astro', nuxt: 'Nuxt' }
    lines.push(`Framework: ${labels[result.framework] || result.framework}`)
    if (result.nextjsRouter) {
      lines.push(`  Router: ${result.nextjsRouter}`)
    }
    lines.push('')
  }

  // Architecture
  const pattern = ARCHITECTURE_PATTERNS[result.architecture]
  if (pattern) {
    const confidenceLabel = result.confidence >= 8 ? 'high' : result.confidence >= 5 ? 'medium' : 'low'
    lines.push(`Architecture: ${pattern.name}`)
    lines.push(`  Confidence: ${confidenceLabel} (score: ${result.confidence.toFixed(1)})`)
    lines.push(`  Category: ${pattern.category}`)
    lines.push(`  ${pattern.description}`)
    lines.push('')
  }

  // Top scored patterns
  const sortedScores = Object.entries(result.scores)
    .filter(([, s]) => !s.belowThreshold)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, 5)

  if (sortedScores.length > 1) {
    lines.push('Pattern Scores:')
    for (const [id, info] of sortedScores) {
      const marker = id === result.architecture ? ' <-- detected' : ''
      lines.push(`  ${info.name}: ${info.score.toFixed(1)}${marker}`)
    }
    lines.push('')
  }

  // Sub-projects
  if (result.subProjects.length > 0) {
    lines.push('Sub-Project Architectures:')
    for (const sub of result.subProjects) {
      const subPattern = ARCHITECTURE_PATTERNS[sub.architecture]
      const labels = { vue: 'Vue', react: 'React', nextjs: 'Next.js', svelte: 'Svelte', angular: 'Angular', astro: 'Astro', nuxt: 'Nuxt' }
      const fw = sub.framework ? ` [${labels[sub.framework] || sub.framework}]` : ''
      lines.push(`  ${sub.name} (${sub.path})${fw}: ${subPattern?.name || 'Unknown'}`)
    }
    lines.push('')
  }

  // Project info
  lines.push('Project Info:')
  lines.push(`  TypeScript: ${result.projectInfo.hasTypeScript ? 'Yes' : 'No'}`)
  lines.push(`  src/ directory: ${result.projectInfo.hasSrc ? 'Yes' : 'No'}`)
  lines.push('')

  return lines.join('\n')
}
