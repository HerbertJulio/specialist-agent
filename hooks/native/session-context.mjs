#!/usr/bin/env node

/**
 * Session Context - SessionStart Hook
 *
 * Injects project state as context when a Claude Code session begins.
 * All operations are read-only. Errors are silently ignored.
 *
 * Claude Code event: SessionStart
 * Output: { "additionalContext": "Project state summary..." }
 */

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { outputJson, readJsonFile } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);

// ── Data Collectors ─────────────────────────────────────────

function getGitInfo() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf-8', timeout: 5000 }).trim();
    const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8', timeout: 5000 });
    const dirtyCount = statusOutput ? statusOutput.trim().split('\n').filter(Boolean).length : 0;
    const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf-8', timeout: 5000 }).trim();
    return { branch, dirtyCount, lastCommit };
  } catch {
    return null;
  }
}

function getAgentCount(cwd) {
  try {
    const agentsDir = join(cwd, '.claude', 'agents');
    if (!existsSync(agentsDir)) return 0;
    return readdirSync(agentsDir).filter(f => f.endsWith('.md')).length;
  } catch {
    return 0;
  }
}

function getSkillCount(cwd) {
  try {
    const skillsDir = join(cwd, '.claude', 'skills');
    if (!existsSync(skillsDir)) return 0;
    return readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory()).length;
  } catch {
    return 0;
  }
}

function getMemoryDecisions(cwd) {
  const memoryPath = join(cwd, '.claude', 'session-memory.json');
  const memory = readJsonFile(memoryPath);
  if (!memory) return 0;
  return Array.isArray(memory.decisions) ? memory.decisions.length : 0;
}

function getActiveProfile(cwd) {
  const configPath = join(cwd, '.claude', 'config.json');
  const config = readJsonFile(configPath);
  return config?.profile || null;
}

function detectFramework(cwd) {
  const pkg = readJsonFile(join(cwd, 'package.json'));
  if (!pkg) return null;
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (deps['nuxt']) return 'Nuxt';
  if (deps['next']) return 'Next.js';
  if (deps['@sveltejs/kit']) return 'SvelteKit';
  if (deps['@angular/core']) return 'Angular';
  if (deps['astro']) return 'Astro';
  if (deps['vue']) return 'Vue';
  if (deps['react']) return 'React';
  return null;
}

function detectProjectFeatures(cwd) {
  const features = [];
  const pkg = readJsonFile(join(cwd, 'package.json'));
  const deps = { ...pkg?.dependencies, ...pkg?.devDependencies };

  if (existsSync(join(cwd, 'tsconfig.json'))) features.push('TypeScript');
  if (deps?.['vitest'] || deps?.['jest'] || deps?.['mocha']) features.push('Tests');
  if (existsSync(join(cwd, 'docs', 'ARCHITECTURE.md')) || existsSync(join(cwd, 'ARCHITECTURE.md'))) features.push('ARCHITECTURE.md');
  if (existsSync(join(cwd, '.mcp.json'))) features.push('MCP configured');

  return features;
}

function getAvailableMCPs(cwd) {
  const mcpConfig = readJsonFile(join(cwd, '.mcp.json'));
  if (!mcpConfig?.mcpServers) return [];
  return Object.keys(mcpConfig.mcpServers);
}

// ── Context Builder (exported for testing) ──────────────────

/**
 * Build project context string from current state.
 * @param {string} cwd - Project root directory
 * @returns {string} Context summary or empty string
 */
export function buildContext(cwd) {
  const parts = [];

  // Git info
  const git = getGitInfo();
  if (git) {
    parts.push(`Branch: ${git.branch}`);
    if (git.dirtyCount > 0) {
      parts.push(`Uncommitted files: ${git.dirtyCount}`);
    }
    parts.push(`Last commit: ${git.lastCommit}`);
  }

  // Framework
  const framework = detectFramework(cwd);
  if (framework) {
    parts.push(`Framework: ${framework}`);
  }

  // Project features
  const features = detectProjectFeatures(cwd);
  if (features.length > 0) {
    parts.push(`Features: ${features.join(', ')}`);
  }

  // Agents & skills
  const agents = getAgentCount(cwd);
  const skills = getSkillCount(cwd);
  if (agents > 0 || skills > 0) {
    parts.push(`Installed: ${agents} agents, ${skills} skills`);
  }

  // MCPs
  const mcps = getAvailableMCPs(cwd);
  if (mcps.length > 0) {
    parts.push(`MCPs: ${mcps.join(', ')}`);
  }

  // Memory
  const decisions = getMemoryDecisions(cwd);
  if (decisions > 0) {
    parts.push(`Session memory: ${decisions} saved decisions (use /recall to query)`);
  }

  // Profile
  const profile = getActiveProfile(cwd);
  if (profile) {
    parts.push(`Active profile: ${profile}`);
  }

  return parts.length > 0 ? `[Specialist Agent] ${parts.join(' | ')}` : '';
}

// ── Main Execution ──────────────────────────────────────────

async function main() {
  const cwd = process.cwd();
  const context = buildContext(cwd);

  if (context) {
    outputJson({ additionalContext: context });
  }

  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  main().catch(() => {
    // Advisory hook - never block on error
    process.exit(0);
  });
}
