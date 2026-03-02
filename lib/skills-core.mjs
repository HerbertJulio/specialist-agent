#!/usr/bin/env node

/**
 * Skills Core - Runtime library for skill discovery, resolution, and management.
 *
 * Features:
 * - Extract YAML frontmatter from skill files
 * - Discover all skills in a directory tree
 * - Resolve skill names with namespace support (specialist:skill-name)
 * - Personal skills shadow shared skills (override mechanism)
 * - Strip frontmatter for clean content delivery
 * - Validate skill structure
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Extract YAML frontmatter from a skill file.
 *
 * @param {string} filePath - Path to SKILL.md
 * @returns {{ name: string, description: string, userInvocable: boolean, argumentHint: string, allowedTools: string }}
 */
export function extractFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let inFrontmatter = false;
    const result = {
      name: '',
      description: '',
      userInvocable: false,
      argumentHint: '',
      allowedTools: ''
    };

    for (const line of lines) {
      if (line.trim() === '---') {
        if (inFrontmatter) break;
        inFrontmatter = true;
        continue;
      }

      if (inFrontmatter) {
        const match = line.match(/^([\w-]+):\s*"?([^"]*)"?\s*$/);
        if (match) {
          const [, key, value] = match;
          switch (key) {
            case 'name':
              result.name = value.trim();
              break;
            case 'description':
              result.description = value.trim();
              break;
            case 'user-invocable':
              result.userInvocable = value.trim() === 'true';
              break;
            case 'argument-hint':
              result.argumentHint = value.trim();
              break;
            case 'allowed-tools':
              result.allowedTools = value.trim();
              break;
          }
        }
      }
    }

    return result;
  } catch {
    return { name: '', description: '', userInvocable: false, argumentHint: '', allowedTools: '' };
  }
}

/**
 * Find all SKILL.md files recursively in a directory.
 *
 * @param {string} dir - Directory to search
 * @param {string} sourceType - 'project', 'global', or 'pack'
 * @param {number} maxDepth - Max recursion depth (default: 3)
 * @returns {Array<{ path: string, skillFile: string, name: string, description: string, sourceType: string, userInvocable: boolean }>}
 */
export function findSkills(dir, sourceType = 'project', maxDepth = 3) {
  const skills = [];

  if (!fs.existsSync(dir)) return skills;

  function recurse(currentDir, depth) {
    if (depth > maxDepth) return;

    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const fullPath = path.join(currentDir, entry.name);
      const skillFile = path.join(fullPath, 'SKILL.md');

      if (fs.existsSync(skillFile)) {
        const meta = extractFrontmatter(skillFile);
        skills.push({
          path: fullPath,
          skillFile,
          name: meta.name || entry.name,
          description: meta.description,
          sourceType,
          userInvocable: meta.userInvocable,
          argumentHint: meta.argumentHint
        });
      }

      recurse(fullPath, depth + 1);
    }
  }

  recurse(dir, 0);
  return skills;
}

/**
 * Find all agent .md files in a directory.
 *
 * @param {string} dir - Directory to search
 * @param {string} sourceType - 'project', 'global', or 'pack'
 * @returns {Array<{ path: string, name: string, description: string, sourceType: string, isLite: boolean }>}
 */
export function findAgents(dir, sourceType = 'project') {
  const agents = [];

  if (!fs.existsSync(dir)) return agents;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return agents;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const filePath = path.join(dir, entry.name);
    const meta = extractFrontmatter(filePath);
    const isLite = entry.name.includes('-lite');

    agents.push({
      path: filePath,
      name: meta.name || entry.name.replace('.md', ''),
      description: meta.description,
      sourceType,
      isLite
    });
  }

  return agents;
}

/**
 * Resolve a skill name to its file path.
 * Personal skills override shared skills (shadowing).
 *
 * Resolution order:
 * 1. Project skills (.claude/skills/)
 * 2. Pack skills (from framework pack)
 * 3. Community skills (~/.claude/community-skills/)
 * 4. Global skills (~/.claude/skills/)
 *
 * @param {string} skillName - Name like "plan" or "specialist:plan"
 * @param {{ projectDir?: string, packDir?: string, globalDir?: string }} dirs
 * @returns {{ skillFile: string, sourceType: string, name: string } | null}
 */
export function resolveSkill(skillName, dirs = {}) {
  const forceShared = skillName.startsWith('specialist:');
  const actualName = forceShared ? skillName.replace(/^specialist:/, '') : skillName;

  const searchOrder = forceShared
    ? [
        { dir: dirs.packDir, type: 'pack' },
        { dir: dirs.communityDir, type: 'community' },
        { dir: dirs.globalDir, type: 'global' }
      ]
    : [
        { dir: dirs.projectDir, type: 'project' },
        { dir: dirs.packDir, type: 'pack' },
        { dir: dirs.communityDir, type: 'community' },
        { dir: dirs.globalDir, type: 'global' }
      ];

  for (const { dir, type } of searchOrder) {
    if (!dir) continue;

    const skillFile = path.join(dir, actualName, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      return { skillFile, sourceType: type, name: actualName };
    }
  }

  return null;
}

/**
 * Strip YAML frontmatter from content.
 *
 * @param {string} content - Full file content including frontmatter
 * @returns {string} - Content without frontmatter
 */
export function stripFrontmatter(content) {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterEnded = false;
  const result = [];

  for (const line of lines) {
    if (line.trim() === '---') {
      if (inFrontmatter) {
        frontmatterEnded = true;
        continue;
      }
      inFrontmatter = true;
      continue;
    }

    if (frontmatterEnded || !inFrontmatter) {
      result.push(line);
    }
  }

  return result.join('\n').trim();
}

/**
 * Validate a skill file structure.
 *
 * @param {string} filePath - Path to SKILL.md
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateSkill(filePath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: ['File does not exist'], warnings: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const meta = extractFrontmatter(filePath);

  // Required fields
  if (!meta.name) errors.push('Missing "name" in frontmatter');
  if (!meta.description) errors.push('Missing "description" in frontmatter');

  // CSO check
  if (meta.description && !meta.description.startsWith('Use when')) {
    warnings.push('Description should start with "Use when..." (CSO best practice)');
  }

  // Name format
  if (meta.name && /[^a-z0-9-]/.test(meta.name)) {
    warnings.push('Name should use only lowercase letters, numbers, and hyphens');
  }

  // Content checks
  if (content.length < 100) {
    warnings.push('Skill content is very short (< 100 chars)');
  }

  // Check for workflow section
  if (!content.includes('## ') && !content.includes('# ')) {
    warnings.push('No markdown headers found - skill may lack structure');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate an agent file structure.
 *
 * @param {string} filePath - Path to agent .md file
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateAgent(filePath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: ['File does not exist'], warnings: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const meta = extractFrontmatter(filePath);

  // Required fields
  if (!meta.name) errors.push('Missing "name" in frontmatter');
  if (!meta.description) errors.push('Missing "description" in frontmatter');

  // CSO check
  if (meta.description && !meta.description.startsWith('Use when')) {
    warnings.push('Description should start with "Use when..." (CSO best practice)');
  }

  // Structure checks
  if (!content.includes('## Mission')) {
    warnings.push('Missing "## Mission" section');
  }
  if (!content.includes('## Rules')) {
    warnings.push('Missing "## Rules" section');
  }
  if (!content.includes('## Handoff Protocol')) {
    warnings.push('Missing "## Handoff Protocol" section');
  }
  if (!content.includes('## Verification Protocol')) {
    warnings.push('Missing "## Verification Protocol" section');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * List all available skills and agents in a project.
 *
 * @param {string} projectRoot - Project root directory
 * @returns {{ skills: Array, agents: Array }}
 */
export function discoverAll(projectRoot) {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '';

  const skills = [
    ...findSkills(path.join(projectRoot, '.claude', 'skills'), 'project'),
    ...findSkills(path.join(projectRoot, 'skills'), 'project'),
    ...findSkills(path.join(homeDir, '.claude', 'community-skills'), 'community'),
    ...findSkills(path.join(homeDir, '.claude', 'skills'), 'global')
  ];

  const agents = [
    ...findAgents(path.join(projectRoot, '.claude', 'agents'), 'project'),
    ...findAgents(path.join(projectRoot, 'agents'), 'project'),
    ...findAgents(path.join(homeDir, '.claude', 'agents'), 'global')
  ];

  return { skills, agents };
}

/**
 * Check if a git repository has updates available.
 *
 * @param {string} repoDir - Path to git repository
 * @returns {boolean}
 */
export function checkForUpdates(repoDir) {
  try {
    const output = execSync('git fetch origin && git status --porcelain=v1 --branch', {
      cwd: repoDir,
      timeout: 3000,
      encoding: 'utf8',
      stdio: 'pipe'
    });

    return output.includes('[behind ');
  } catch {
    return false;
  }
}
