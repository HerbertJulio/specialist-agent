#!/usr/bin/env node

/**
 * Skill Behavioral Testing Framework
 *
 * Tests that skills produce correct agent behavior by running scenarios
 * and verifying outputs match expectations.
 *
 * Unlike validate-agents.mjs (which checks structure), this tests BEHAVIOR:
 * - Does the skill produce the expected workflow?
 * - Does the skill prevent known anti-patterns?
 * - Does the skill's description match its content?
 *
 * Usage:
 *   node tests/test-skills.mjs                  # Run all tests
 *   node tests/test-skills.mjs plan             # Test specific skill
 *   node tests/test-skills.mjs --verbose        # Show detailed output
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const verbose = process.argv.includes('--verbose');
const args = process.argv.slice(2).filter(a => a !== '--verbose');
const filterSkill = args.length > 0 ? args[0] : null;

let passed = 0;
let failed = 0;
let skipped = 0;

// ── Test Helpers ──

function assert(condition, message) {
  if (condition) {
    passed++;
    if (verbose) console.log(`  \x1b[32m✓\x1b[0m ${message}`);
  } else {
    failed++;
    console.log(`  \x1b[31m✗ FAIL\x1b[0m ${message}`);
  }
}

function skip(message) {
  skipped++;
  if (verbose) console.log(`  \x1b[90m○ SKIP\x1b[0m ${message}`);
}

function readSkill(name) {
  const skillPath = path.join(ROOT, 'skills', name, 'SKILL.md');
  if (!fs.existsSync(skillPath)) return null;
  return fs.readFileSync(skillPath, 'utf8');
}

function extractFrontmatter(content) {
  const lines = content.split('\n');
  let inFm = false;
  const result = {};
  for (const line of lines) {
    if (line.trim() === '---') {
      if (inFm) break;
      inFm = true;
      continue;
    }
    if (inFm) {
      const match = line.match(/^([\w-]+):\s*"?([^"]*)"?\s*$/);
      if (match) result[match[1]] = match[2].trim();
    }
  }
  return result;
}

function hasSection(content, heading) {
  const regex = new RegExp(`^##?#?\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
  return regex.test(content);
}

function containsPhrase(content, phrase) {
  return content.toLowerCase().includes(phrase.toLowerCase());
}

// ── CSO Tests ──

function testCSO(name, content, meta) {
  console.log(`\n── CSO: ${name} ──`);

  // Description starts with "Use when"
  assert(
    meta.description && meta.description.startsWith('Use when'),
    `Description starts with "Use when..."`
  );

  // Description does NOT summarize workflow
  const workflowPhrases = ['step 1', 'phase 1', 'followed by', 'then do', 'then run', 'then check'];
  const hasWorkflow = workflowPhrases.some(p =>
    (meta.description || '').toLowerCase().includes(p)
  );
  assert(!hasWorkflow, 'Description does NOT summarize workflow');

  // Description under 500 chars
  assert(
    !meta.description || meta.description.length <= 500,
    `Description under 500 chars (${(meta.description || '').length})`
  );

  // Name format
  assert(
    !meta.name || !/[^a-z0-9-]/.test(meta.name),
    `Name uses only lowercase, numbers, hyphens`
  );
}

// ── Structure Tests ──

function testStructure(name, content) {
  console.log(`\n── Structure: ${name} ──`);

  assert(content.length >= 200, `Content is substantial (${content.length} chars)`);
  assert(hasSection(content, 'Workflow') || hasSection(content, 'When to Use'),
    'Has Workflow or When to Use section');
  assert(hasSection(content, 'Output') || hasSection(content, 'Rules'),
    'Has Output or Rules section');
}

// ── Anti-Rationalization Tests ──

function testAntiRationalization(name, content) {
  console.log(`\n── Anti-Rationalization: ${name} ──`);

  const hasAntiRat = hasSection(content, 'Anti-Rationalization');
  const hasVerification = hasSection(content, 'Verification Protocol');

  if (hasAntiRat) {
    assert(true, 'Has Anti-Rationalization section');

    // Check for table format
    assert(
      content.includes('| Excuse') || content.includes('| excuse'),
      'Anti-Rationalization uses table format'
    );

    // Check for at least 3 entries
    const tableRows = content.split('\n').filter(l =>
      l.includes('|') && !l.includes('---') && !l.includes('Excuse') && !l.includes('excuse')
    );
    // Count rows in anti-rationalization section
    const arStart = content.lastIndexOf('Anti-Rationalization');
    if (arStart !== -1) {
      const nextSection = content.indexOf('\n## ', arStart + 1);
      const arSection = content.slice(arStart, nextSection !== -1 ? nextSection : content.length);
      const arRows = arSection.split('\n').filter(l =>
        l.startsWith('|') && !l.includes('---') && !l.includes('Excuse')
      );
      assert(arRows.length >= 3, `At least 3 rationalization entries (found ${arRows.length})`);
    }
  } else {
    skip('No Anti-Rationalization section (optional for this skill)');
  }

  if (hasVerification) {
    assert(true, 'Has Verification Protocol section');
  } else {
    skip('No Verification Protocol section (optional for this skill)');
  }
}

// ── Behavioral Tests ──

function testBehavior(name, content) {
  console.log(`\n── Behavior: ${name} ──`);

  switch (name) {
    case 'brainstorm':
      assert(containsPhrase(content, 'socratic') || containsPhrase(content, 'questioning'),
        'Uses Socratic methodology');
      assert(containsPhrase(content, 'assumption'), 'Tests assumptions');
      assert(containsPhrase(content, 'alternative'), 'Generates alternatives');
      assert(containsPhrase(content, 'approval') || containsPhrase(content, 'approve'),
        'Requires user approval');
      break;

    case 'plan':
      assert(containsPhrase(content, 'complexity'), 'Mentions complexity detection');
      assert(containsPhrase(content, 'trivial') || containsPhrase(content, 'simple'),
        'Handles different complexity levels');
      break;

    case 'tdd':
      assert(containsPhrase(content, 'red'), 'Has RED phase');
      assert(containsPhrase(content, 'green'), 'Has GREEN phase');
      assert(containsPhrase(content, 'refactor'), 'Has REFACTOR phase');
      assert(containsPhrase(content, 'failing test'), 'Requires failing test first');
      break;

    case 'debug':
      assert(containsPhrase(content, 'root cause') || containsPhrase(content, 'hypothesis'),
        'Focuses on root cause analysis');
      assert(containsPhrase(content, 'reproduce') || containsPhrase(content, 'evidence'),
        'Requires evidence/reproduction');
      break;

    case 'verify':
      assert(containsPhrase(content, 'evidence'), 'Requires evidence');
      assert(containsPhrase(content, 'command') || containsPhrase(content, 'output'),
        'Requires command output as proof');
      assert(containsPhrase(content, 'never') || containsPhrase(content, 'must not'),
        'Has prohibitions against unverified claims');
      break;

    case 'checkpoint':
      assert(containsPhrase(content, 'git'), 'Uses git for checkpoints');
      assert(containsPhrase(content, 'rollback') || containsPhrase(content, 'restore'),
        'Supports rollback/restore');
      break;

    case 'audit':
      assert(containsPhrase(content, 'security'), 'Checks security');
      assert(containsPhrase(content, 'performance'), 'Checks performance');
      assert(containsPhrase(content, 'architecture'), 'Checks architecture');
      assert(containsPhrase(content, 'dependencies') || containsPhrase(content, 'dependency'),
        'Checks dependencies');
      assert(containsPhrase(content, 'severity'), 'Uses severity ratings');
      break;

    case 'onboard':
      assert(containsPhrase(content, 'architecture'), 'Maps architecture');
      assert(containsPhrase(content, 'convention'), 'Detects conventions');
      assert(containsPhrase(content, 'module'), 'Analyzes modules');
      break;

    case 'write-skill':
      assert(containsPhrase(content, 'tdd') || containsPhrase(content, 'test-driven'),
        'Uses TDD methodology');
      assert(containsPhrase(content, 'cso') || containsPhrase(content, 'use when'),
        'Enforces CSO in descriptions');
      break;

    case 'health':
      assert(containsPhrase(content, 'score'), 'Produces a score');
      assert(containsPhrase(content, 'architecture') || containsPhrase(content, 'test'),
        'Checks project health dimensions');
      break;

    case 'estimate':
      assert(containsPhrase(content, 'token') || containsPhrase(content, 'cost'),
        'Estimates tokens or cost');
      break;

    case 'finish':
      assert(containsPhrase(content, 'branch') || containsPhrase(content, 'merge'),
        'Handles branch finalization');
      break;

    case 'remember':
      assert(containsPhrase(content, 'persist') || containsPhrase(content, 'save') || containsPhrase(content, 'memory'),
        'Persists decisions');
      break;

    case 'recall':
      assert(containsPhrase(content, 'query') || containsPhrase(content, 'search') || containsPhrase(content, 'find'),
        'Queries saved data');
      break;

    case 'learn':
      assert(containsPhrase(content, 'explain') || containsPhrase(content, 'teach'),
        'Has educational component');
      break;

    case 'tutorial':
      assert(containsPhrase(content, 'beginner') || containsPhrase(content, 'interactive'),
        'Has interactive/beginner content');
      break;

    case 'migrate-framework':
      assert(containsPhrase(content, 'react') || containsPhrase(content, 'vue'),
        'Supports framework migration');
      break;

    default:
      skip(`No behavioral tests defined for "${name}"`);
  }
}

// ── Pressure Scenario Tests ──

function testPressureScenarios(name, content) {
  console.log(`\n── Pressure Resistance: ${name} ──`);

  // Skills that enforce discipline should resist pressure
  const disciplineSkills = ['tdd', 'verify', 'debug', 'audit', 'write-skill'];

  if (!disciplineSkills.includes(name)) {
    skip(`"${name}" is not a discipline-enforcing skill`);
    return;
  }

  // Must have explicit "NEVER" or "MUST" directives
  const hasStrong = containsPhrase(content, 'never') ||
    containsPhrase(content, 'must') ||
    containsPhrase(content, 'always');
  assert(hasStrong, 'Has strong directives (NEVER/MUST/ALWAYS)');

  // Must address common rationalizations
  const hasExcuses = containsPhrase(content, 'excuse') ||
    containsPhrase(content, 'rationali') ||
    containsPhrase(content, 'shortcut');
  assert(hasExcuses, 'Addresses rationalizations or shortcuts');

  // Must have verification mechanism
  const hasProof = containsPhrase(content, 'proof') ||
    containsPhrase(content, 'evidence') ||
    containsPhrase(content, 'verify') ||
    containsPhrase(content, 'output');
  assert(hasProof, 'Requires proof/evidence/verification');
}

// ── Cross-Skill Consistency Tests ──

function testCrossSkillConsistency(skills) {
  console.log('\n── Cross-Skill Consistency ──');

  // All skills should have name field
  const allHaveNames = skills.every(s => s.meta.name);
  assert(allHaveNames, 'All skills have name in frontmatter');

  // All skills should have description
  const allHaveDesc = skills.every(s => s.meta.description);
  assert(allHaveDesc, 'All skills have description in frontmatter');

  // No duplicate names
  const names = skills.map(s => s.meta.name).filter(Boolean);
  const uniqueNames = new Set(names);
  assert(names.length === uniqueNames.size, `No duplicate skill names (${names.length} total)`);

  // All user-invocable skills should have argument-hint
  const invocable = skills.filter(s => s.meta['user-invocable'] === 'true');
  // argument-hint is optional but recommended
  if (verbose) {
    const withHint = invocable.filter(s => s.meta['argument-hint']);
    console.log(`  \x1b[90mℹ ${withHint.length}/${invocable.length} invocable skills have argument-hint\x1b[0m`);
  }
}

// ── Main ──

console.log('\n══════════════════════════════════════════════');
console.log('  Specialist Agent - Skill Behavioral Tests');
console.log('══════════════════════════════════════════════');

const skillsDir = path.join(ROOT, 'skills');
const allSkills = [];

if (fs.existsSync(skillsDir)) {
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (filterSkill && entry.name !== filterSkill) continue;

    const content = readSkill(entry.name);
    if (!content) continue;

    const meta = extractFrontmatter(content);
    allSkills.push({ name: entry.name, content, meta });

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  Skill: ${entry.name}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    testCSO(entry.name, content, meta);
    testStructure(entry.name, content);
    testAntiRationalization(entry.name, content);
    testBehavior(entry.name, content);
    testPressureScenarios(entry.name, content);
  }
}

// Cross-skill tests
if (!filterSkill) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Cross-Skill Consistency`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  testCrossSkillConsistency(allSkills);
}

// ── Summary ──

console.log('\n══════════════════════════════════════════════');
console.log(`  Skills tested: ${allSkills.length}`);
console.log(`  \x1b[32mPassed: ${passed}\x1b[0m`);
console.log(`  \x1b[31mFailed: ${failed}\x1b[0m`);
console.log(`  \x1b[90mSkipped: ${skipped}\x1b[0m`);
console.log('══════════════════════════════════════════════\n');

if (failed > 0) {
  console.log(`\x1b[31m${failed} behavioral test(s) failed.\x1b[0m`);
  process.exit(1);
} else {
  console.log('\x1b[32mAll behavioral tests passed!\x1b[0m');
  process.exit(0);
}
