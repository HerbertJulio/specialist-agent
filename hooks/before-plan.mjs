#!/usr/bin/env node

/**
 * Before Plan Hook
 *
 * Runs before @planner creates an implementation plan.
 *
 * Actions:
 * - Validates project structure
 * - Checks for ARCHITECTURE.md
 * - Detects uncommitted changes
 * - Summarizes project state for planner context
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

const feature = process.env.PLAN_FEATURE || process.argv[2] || '';

async function main() {
  console.log('──── Pre-Plan Checks ────\n');

  // 1. Check architecture file
  checkArchitecture();

  // 2. Check git state
  checkGitState();

  // 3. Detect framework
  detectFramework();

  // 4. Scan project size
  scanProjectSize();

  console.log('\n──── Ready for Planning ────');
}

function checkArchitecture() {
  const paths = [
    'docs/ARCHITECTURE.md',
    'ARCHITECTURE.md',
    '.claude/ARCHITECTURE.md'
  ];

  const found = paths.find(p => existsSync(p));

  if (found) {
    console.log(`  ✓ Architecture file: ${found}`);

    try {
      const content = readFileSync(found, 'utf-8');
      const lines = content.split('\n').length;
      console.log(`    ${lines} lines of architecture patterns`);
    } catch {
      // Ignore read errors
    }
  } else {
    console.log('  ⚠ No ARCHITECTURE.md found');
    console.log('    @planner will use generic patterns');
  }
}

function checkGitState() {
  console.log('Checking git state...');
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });

    // Current branch
    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    console.log(`  Branch: ${branch}`);

    // Uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
    const changedFiles = status.split('\n').filter(Boolean);

    if (changedFiles.length > 0) {
      console.log(`  ⚠ Uncommitted changes: ${changedFiles.length} files`);
      console.log('    Consider committing or stashing before planning');
    } else {
      console.log('  ✓ Working tree clean');
    }

    // Recent commits for context
    const recentCommits = execSync('git log --oneline -5', { encoding: 'utf-8' }).trim();
    if (recentCommits) {
      console.log('  Recent commits:');
      recentCommits.split('\n').forEach(c => console.log(`    ${c}`));
    }
  } catch {
    console.log('  ℹ Not a git repository');
  }
}

function detectFramework() {
  console.log('Detecting framework...');

  if (!existsSync('package.json')) {
    console.log('  ℹ No package.json found');
    return;
  }

  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    const frameworks = [];
    if (deps['next']) frameworks.push(`Next.js ${deps['next']}`);
    if (deps['react'] && !deps['next']) frameworks.push(`React ${deps['react']}`);
    if (deps['vue']) frameworks.push(`Vue ${deps['vue']}`);
    if (deps['svelte'] || deps['@sveltejs/kit']) frameworks.push('SvelteKit');

    if (frameworks.length > 0) {
      console.log(`  ✓ Framework: ${frameworks.join(', ')}`);
    } else {
      console.log('  ℹ No recognized framework');
    }

    // Check for TypeScript
    if (deps['typescript'] || existsSync('tsconfig.json')) {
      console.log('  ✓ TypeScript enabled');
    }

    // Check for test framework
    if (deps['vitest']) console.log('  ✓ Test runner: Vitest');
    else if (deps['jest']) console.log('  ✓ Test runner: Jest');
  } catch {
    console.log('  ℹ Could not parse package.json');
  }
}

function scanProjectSize() {
  console.log('Scanning project...');
  try {
    // Count source files (excluding node_modules, dist, .next, etc.)
    const result = execSync(
      'find . -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" \\) ' +
      '-not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/dist/*" -not -path "*/.nuxt/*" 2>/dev/null | wc -l',
      { encoding: 'utf-8' }
    ).trim();

    const fileCount = parseInt(result, 10);
    if (fileCount > 0) {
      console.log(`  Source files: ${fileCount}`);

      if (fileCount < 20) console.log('  Scale: Small project');
      else if (fileCount < 100) console.log('  Scale: Medium project');
      else console.log('  Scale: Large project');
    }
  } catch {
    console.log('  ℹ Could not scan project');
  }
}

// Run
main().catch(console.error);
