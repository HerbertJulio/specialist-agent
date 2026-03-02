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
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

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
  try {
    const memoryPath = join(cwd, '.claude', 'session-memory.json');
    if (!existsSync(memoryPath)) return 0;
    const memory = JSON.parse(readFileSync(memoryPath, 'utf-8'));
    return Array.isArray(memory.decisions) ? memory.decisions.length : 0;
  } catch {
    return 0;
  }
}

function getActiveProfile(cwd) {
  try {
    const configPath = join(cwd, '.claude', 'config.json');
    if (!existsSync(configPath)) return null;
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    return config.profile || null;
  } catch {
    return null;
  }
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

  // Agents & skills
  const agents = getAgentCount(cwd);
  const skills = getSkillCount(cwd);
  if (agents > 0 || skills > 0) {
    parts.push(`Installed: ${agents} agents, ${skills} skills`);
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
    process.stdout.write(JSON.stringify({ additionalContext: context }));
  }

  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  main().catch(() => {
    // Advisory hook - never block on error
    process.exit(0);
  });
}
