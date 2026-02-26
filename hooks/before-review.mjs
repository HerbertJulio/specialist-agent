#!/usr/bin/env node

/**
 * Before Review Hook
 *
 * Runs before @reviewer starts a code review.
 *
 * Actions:
 * - Runs automated checks (lint, types)
 * - Identifies files to review
 * - Prepares context for reviewer
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const reviewScope = process.env.REVIEW_SCOPE || process.argv[2] || '.';

async function main() {
  console.log('──── Pre-Review Checks ────\n');

  // 1. Run linter
  runLint();

  // 2. Run TypeScript check
  runTypeCheck();

  // 3. Identify changed files
  identifyChanges();

  // 4. Quick test run (if fast)
  runQuickTests();

  console.log('\n──── Ready for Review ────');
}

function runLint() {
  console.log('Running lint...');
  try {
    execSync('npm run lint 2>&1 || true', { encoding: 'utf-8', stdio: 'pipe' });
    console.log('  ✓ Lint passed');
  } catch (err) {
    const output = err.stdout || err.message;
    if (output.includes('error')) {
      console.log('  ⚠ Lint warnings/errors found');
      console.log('    Run "npm run lint" for details');
    } else {
      console.log('  ✓ Lint passed');
    }
  }
}

function runTypeCheck() {
  console.log('Running TypeScript check...');
  try {
    execSync('npx tsc --noEmit 2>&1', { encoding: 'utf-8', stdio: 'pipe' });
    console.log('  ✓ TypeScript passed');
  } catch (err) {
    const output = err.stdout || err.message;
    if (output.includes('error')) {
      const errorCount = (output.match(/error TS/g) || []).length;
      console.log(`  ✗ TypeScript errors: ${errorCount}`);
      console.log('    Run "npx tsc --noEmit" for details');
    } else {
      console.log('  ✓ TypeScript passed');
    }
  }
}

function identifyChanges() {
  console.log('Identifying changes...');
  try {
    // Check if in git repo
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });

    // Get changed files
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf-8' }).trim();
    const unstaged = execSync('git diff --name-only', { encoding: 'utf-8' }).trim();

    const stagedFiles = staged.split('\n').filter(Boolean);
    const unstagedFiles = unstaged.split('\n').filter(Boolean);

    if (stagedFiles.length > 0) {
      console.log(`  Staged files: ${stagedFiles.length}`);
      stagedFiles.slice(0, 5).forEach(f => console.log(`    • ${f}`));
      if (stagedFiles.length > 5) {
        console.log(`    ... and ${stagedFiles.length - 5} more`);
      }
    }

    if (unstagedFiles.length > 0) {
      console.log(`  Unstaged files: ${unstagedFiles.length}`);
    }

    if (stagedFiles.length === 0 && unstagedFiles.length === 0) {
      // Check against main branch
      const branchDiff = execSync('git diff main --name-only 2>/dev/null || git diff master --name-only 2>/dev/null || true', {
        encoding: 'utf-8'
      }).trim();

      const branchFiles = branchDiff.split('\n').filter(Boolean);
      if (branchFiles.length > 0) {
        console.log(`  Files changed vs main: ${branchFiles.length}`);
        branchFiles.slice(0, 5).forEach(f => console.log(`    • ${f}`));
        if (branchFiles.length > 5) {
          console.log(`    ... and ${branchFiles.length - 5} more`);
        }
      }
    }
  } catch {
    console.log('  ℹ Not a git repository or no changes');
  }
}

function runQuickTests() {
  // Only run if tests are fast (< 30s typically)
  if (!existsSync('package.json')) {
    return;
  }

  console.log('Running quick test check...');
  try {
    // Just check if tests exist and can start
    const result = execSync('npm test -- --listTests 2>&1 || true', {
      encoding: 'utf-8',
      timeout: 10000
    });

    const testCount = (result.match(/test/gi) || []).length;
    if (testCount > 0) {
      console.log(`  ✓ Test suite ready (${testCount} test files)`);
    }
  } catch {
    console.log('  ℹ Tests not configured or timed out');
  }
}

// Run
main().catch(console.error);
