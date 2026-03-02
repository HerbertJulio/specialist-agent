#!/usr/bin/env node

/**
 * Unit tests for lib/skills-core.mjs
 *
 * Usage:
 *   node tests/validate-skills-core.mjs
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m ${message}`);
    passed++;
  } else {
    console.log(`  \x1b[31m✗\x1b[0m ${message}`);
    failed++;
  }
}

async function main() {
  console.log('\n══════════════════════════════════════════════');
  console.log('  Skills Core - Unit Tests');
  console.log('══════════════════════════════════════════════\n');

  const libPath = new URL(`file:///${path.join(ROOT, 'lib', 'skills-core.mjs').replace(/\\/g, '/')}`).href;
  const {
    extractFrontmatter,
    findSkills,
    findAgents,
    resolveSkill,
    stripFrontmatter,
    validateSkill,
    validateAgent,
    discoverAll
  } = await import(libPath);

  // ── extractFrontmatter ──
  console.log('── extractFrontmatter ──\n');

  const planSkill = path.join(ROOT, 'skills', 'plan', 'SKILL.md');
  if (fs.existsSync(planSkill)) {
    const meta = extractFrontmatter(planSkill);
    assert(meta.name === 'plan', 'Extracts name correctly');
    assert(meta.description.startsWith('Use when'), 'Description starts with "Use when"');
    assert(meta.userInvocable === true, 'Detects user-invocable: true');
  }

  const nonExistent = extractFrontmatter('/nonexistent/file.md');
  assert(nonExistent.name === '', 'Returns empty for non-existent file');

  // ── findSkills ──
  console.log('\n── findSkills ──\n');

  const skills = findSkills(path.join(ROOT, 'skills'), 'project');
  assert(skills.length > 0, `Found ${skills.length} skills`);
  assert(skills.some(s => s.name === 'plan'), 'Found "plan" skill');
  assert(skills.some(s => s.name === 'tdd'), 'Found "tdd" skill');
  assert(skills.some(s => s.name === 'verify'), 'Found "verify" skill');
  assert(skills.every(s => s.sourceType === 'project'), 'All marked as "project" source');

  // ── findAgents ──
  console.log('\n── findAgents ──\n');

  const agents = findAgents(path.join(ROOT, 'agents'), 'project');
  assert(agents.length > 0, `Found ${agents.length} agents`);
  assert(agents.some(a => a.name === 'planner'), 'Found "planner" agent');
  assert(agents.some(a => a.name === 'tdd'), 'Found "tdd" agent');
  assert(agents.some(a => a.isLite), 'Found lite agents');
  assert(agents.some(a => !a.isLite), 'Found full agents');

  // ── resolveSkill ──
  console.log('\n── resolveSkill ──\n');

  const resolved = resolveSkill('plan', { projectDir: path.join(ROOT, 'skills') });
  assert(resolved !== null, 'Resolves "plan" skill');
  assert(resolved.sourceType === 'project', 'Source type is "project"');
  assert(resolved.skillFile.endsWith('SKILL.md'), 'Points to SKILL.md');

  const notFound = resolveSkill('nonexistent-skill', { projectDir: path.join(ROOT, 'skills') });
  assert(notFound === null, 'Returns null for non-existent skill');

  // ── stripFrontmatter ──
  console.log('\n── stripFrontmatter ──\n');

  const testContent = '---\nname: test\ndescription: "test"\n---\n\n# Title\n\nContent here.';
  const stripped = stripFrontmatter(testContent);
  assert(!stripped.includes('---'), 'Removes frontmatter delimiters');
  assert(!stripped.includes('name: test'), 'Removes frontmatter fields');
  assert(stripped.includes('# Title'), 'Preserves content');
  assert(stripped.includes('Content here.'), 'Preserves body');

  // ── validateSkill ──
  console.log('\n── validateSkill ──\n');

  if (fs.existsSync(planSkill)) {
    const result = validateSkill(planSkill);
    assert(result.valid === true, '"plan" skill is valid');
    assert(result.errors.length === 0, 'No errors');
  }

  const invalidResult = validateSkill('/nonexistent');
  assert(invalidResult.valid === false, 'Non-existent file is invalid');

  // ── validateAgent ──
  console.log('\n── validateAgent ──\n');

  const plannerAgent = path.join(ROOT, 'agents', 'planner.md');
  if (fs.existsSync(plannerAgent)) {
    const result = validateAgent(plannerAgent);
    assert(result.valid === true, '"planner" agent is valid');
  }

  // ── discoverAll ──
  console.log('\n── discoverAll ──\n');

  const all = discoverAll(ROOT);
  assert(all.skills.length > 0, `Discovered ${all.skills.length} skills total`);
  assert(all.agents.length > 0, `Discovered ${all.agents.length} agents total`);

  // ── Summary ──
  console.log('\n══════════════════════════════════════════════');
  console.log(`  \x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`  \x1b[31mFailed: ${failed}\x1b[0m`);
  console.log('══════════════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
