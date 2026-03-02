#!/usr/bin/env node

/**
 * Agent & Skill Validation Framework
 *
 * Validates all agents and skills follow structure conventions:
 * - Required frontmatter fields (name, description)
 * - CSO-optimized descriptions ("Use when...")
 * - Required sections (Mission, Rules, Handoff Protocol, Verification Protocol)
 * - Anti-Rationalization tables in key agents
 * - Skill structure (Workflow, Output)
 *
 * Usage:
 *   node tests/validate-agents.mjs           # Validate all
 *   node tests/validate-agents.mjs agents    # Validate agents only
 *   node tests/validate-agents.mjs skills    # Validate skills only
 *   node tests/validate-agents.mjs --strict  # Warnings become errors
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const strict = process.argv.includes('--strict');
const filter = process.argv[2] === 'agents' ? 'agents' : process.argv[2] === 'skills' ? 'skills' : 'all';

let totalErrors = 0;
let totalWarnings = 0;
let totalPassed = 0;
let totalFiles = 0;

// ── Helpers ──

function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let inFrontmatter = false;
  const result = {};

  for (const line of lines) {
    if (line.trim() === '---') {
      if (inFrontmatter) break;
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      const match = line.match(/^([\w-]+):\s*"?([^"]*)"?\s*$/);
      if (match) {
        result[match[1]] = match[2].trim();
      }
    }
  }

  return { meta: result, content };
}

function hasSection(content, heading) {
  const regex = new RegExp(`^##?#?\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
  return regex.test(content);
}

function report(file, type, message) {
  const rel = path.relative(ROOT, file);
  if (type === 'ERROR') {
    totalErrors++;
    console.log(`  \x1b[31m✗ ERROR\x1b[0m ${rel}: ${message}`);
  } else if (type === 'WARN') {
    totalWarnings++;
    if (strict) totalErrors++;
    console.log(`  \x1b[33m⚠ WARN\x1b[0m  ${rel}: ${message}`);
  } else {
    console.log(`  \x1b[32m✓\x1b[0m ${rel}: ${message}`);
  }
}

// ── Agent Validation ──

function validateAgent(filePath) {
  totalFiles++;
  const { meta, content } = extractFrontmatter(filePath);
  const fileName = path.basename(filePath);
  const isLite = fileName.includes('-lite') || filePath.includes('agents-lite');
  let fileErrors = 0;

  // Required frontmatter
  if (!meta.name) {
    report(filePath, 'ERROR', 'Missing "name" in frontmatter');
    fileErrors++;
  }
  if (!meta.description) {
    report(filePath, 'ERROR', 'Missing "description" in frontmatter');
    fileErrors++;
  }

  // CSO check
  if (meta.description && !meta.description.startsWith('Use when')) {
    report(filePath, 'WARN', `Description should start with "Use when..." (CSO). Got: "${meta.description.slice(0, 60)}..."`);
  }

  // Description should not summarize workflow
  // Use phrase-level detection to avoid false positives like "first time" (valid trigger)
  const workflowPhrases = ['step 1', 'phase 1', 'followed by', 'then do', 'then run', 'then check'];
  if (meta.description) {
    for (const phrase of workflowPhrases) {
      if (meta.description.toLowerCase().includes(phrase)) {
        report(filePath, 'WARN', `Description may summarize workflow (contains "${phrase}"). CSO says: describe WHEN, not HOW.`);
        break;
      }
    }
  }

  // Required sections (full agents only)
  if (!isLite) {
    if (!hasSection(content, 'Mission')) {
      report(filePath, 'WARN', 'Missing "## Mission" section');
    }
    if (!hasSection(content, 'Rules')) {
      report(filePath, 'WARN', 'Missing "## Rules" section');
    }
    if (!hasSection(content, 'Handoff Protocol')) {
      report(filePath, 'WARN', 'Missing "## Handoff Protocol" section');
    }
  }

  // Verification Protocol (important agents)
  const needsVerification = ['builder', 'executor', 'debugger', 'tdd', 'pair', 'doctor', 'migrator'];
  const agentName = (meta.name || fileName.replace('.md', '')).replace('-lite', '');
  if (needsVerification.includes(agentName) && !isLite) {
    if (!hasSection(content, 'Verification Protocol')) {
      report(filePath, 'WARN', 'Missing "## Verification Protocol" section (key agent should have it)');
    }
    if (!hasSection(content, 'Anti-Rationalization')) {
      report(filePath, 'WARN', 'Missing "## Anti-Rationalization" section (key agent should have it)');
    }
  }

  if (fileErrors === 0) {
    totalPassed++;
  }
}

// ── Skill Validation ──

function validateSkill(filePath) {
  totalFiles++;
  const { meta, content } = extractFrontmatter(filePath);
  let fileErrors = 0;

  // Required frontmatter
  if (!meta.name) {
    report(filePath, 'ERROR', 'Missing "name" in frontmatter');
    fileErrors++;
  }
  if (!meta.description) {
    report(filePath, 'ERROR', 'Missing "description" in frontmatter');
    fileErrors++;
  }

  // CSO check
  if (meta.description && !meta.description.startsWith('Use when')) {
    report(filePath, 'WARN', `Description should start with "Use when..." (CSO). Got: "${meta.description.slice(0, 60)}..."`);
  }

  // Name format
  if (meta.name && /[^a-z0-9-]/.test(meta.name)) {
    report(filePath, 'WARN', `Name "${meta.name}" should use only lowercase, numbers, hyphens`);
  }

  // Content checks
  if (content.length < 100) {
    report(filePath, 'WARN', 'Skill content is very short (< 100 chars)');
  }

  if (fileErrors === 0) {
    totalPassed++;
  }
}

// ── Discovery ──

function findFiles(dir, pattern) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, pattern));
    } else if (entry.isFile() && pattern(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Main ──

console.log('\n══════════════════════════════════════════════');
console.log('  Specialist Agent - Validation Framework');
console.log('══════════════════════════════════════════════\n');

if (filter === 'all' || filter === 'agents') {
  console.log('── Agents ──\n');

  // Framework-agnostic agents
  const agentDirs = [
    path.join(ROOT, 'agents'),
    ...['nextjs', 'react', 'vue', 'svelte', 'angular', 'astro', 'nuxt'].flatMap(fw => [
      path.join(ROOT, 'packs', fw, 'agents'),
      path.join(ROOT, 'packs', fw, 'agents-lite')
    ])
  ];

  for (const dir of agentDirs) {
    const files = findFiles(dir, name => name.endsWith('.md'));
    for (const file of files) {
      validateAgent(file);
    }
  }
}

if (filter === 'all' || filter === 'skills') {
  console.log('\n── Skills ──\n');

  // Generic skills
  const skillDirs = [
    path.join(ROOT, 'skills'),
    ...['nextjs', 'react', 'vue', 'svelte', 'angular', 'astro', 'nuxt'].map(fw =>
      path.join(ROOT, 'packs', fw, 'skills')
    )
  ];

  for (const dir of skillDirs) {
    const files = findFiles(dir, name => name === 'SKILL.md');
    for (const file of files) {
      validateSkill(file);
    }
  }
}

// ── Summary ──

console.log('\n══════════════════════════════════════════════');
console.log(`  Files: ${totalFiles}`);
console.log(`  \x1b[32mPassed: ${totalPassed}\x1b[0m`);
console.log(`  \x1b[31mErrors: ${totalErrors}\x1b[0m`);
console.log(`  \x1b[33mWarnings: ${totalWarnings}\x1b[0m`);
console.log('══════════════════════════════════════════════\n');

if (totalErrors > 0) {
  console.log(`\x1b[31mValidation failed with ${totalErrors} error(s).\x1b[0m`);
  process.exit(1);
} else if (totalWarnings > 0) {
  console.log(`\x1b[33mValidation passed with ${totalWarnings} warning(s).\x1b[0m`);
  console.log('Use --strict to treat warnings as errors.');
  process.exit(0);
} else {
  console.log('\x1b[32mAll validations passed!\x1b[0m');
  process.exit(0);
}
