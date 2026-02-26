#!/usr/bin/env node

/**
 * On Error Hook
 *
 * Runs when an agent encounters an error.
 *
 * Actions:
 * - Logs error to metrics
 * - Suggests recovery options
 * - Optionally notifies external services
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const SESSION_FILE = '.claude/metrics/current-session.json';

// Error data passed via environment or args
const errorData = {
  agent: process.env.ERROR_AGENT || process.argv[2] || 'unknown',
  message: process.env.ERROR_MESSAGE || process.argv[3] || 'Unknown error',
  file: process.env.ERROR_FILE || process.argv[4] || '',
  line: process.env.ERROR_LINE || process.argv[5] || '',
  task: process.env.ERROR_TASK || process.argv[6] || '',
  stack: process.env.ERROR_STACK || ''
};

async function main() {
  console.log('\n──── Error Detected ────');
  console.log(`Agent: ${errorData.agent}`);
  console.log(`Message: ${errorData.message}`);

  if (errorData.file) {
    console.log(`Location: ${errorData.file}${errorData.line ? ':' + errorData.line : ''}`);
  }

  // 1. Log to metrics
  logErrorToMetrics(errorData);

  // 2. Check for checkpoints
  suggestRecovery();

  // 3. Provide guidance
  provideGuidance(errorData);
}

function logErrorToMetrics(error) {
  if (!existsSync(SESSION_FILE)) {
    return;
  }

  try {
    const session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));

    session.errors.push({
      agent: error.agent,
      message: error.message,
      file: error.file,
      line: error.line,
      task: error.task,
      timestamp: new Date().toISOString()
    });

    writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
    console.log('\n✓ Error logged to session metrics');
  } catch {
    // Ignore logging errors
  }
}

function suggestRecovery() {
  try {
    // Check for checkpoints
    const checkpoints = execSync('git tag -l "checkpoint/*" 2>/dev/null || true', {
      encoding: 'utf-8'
    }).trim().split('\n').filter(Boolean);

    if (checkpoints.length > 0) {
      console.log('\n──── Recovery Options ────');
      console.log('Available checkpoints:');
      checkpoints.slice(-3).forEach(cp => {
        console.log(`  • ${cp}`);
      });
      console.log('\nTo rollback:');
      console.log(`  git reset --hard ${checkpoints[checkpoints.length - 1]}`);
    }

    // Check for restore points
    const restorePoints = execSync('git tag -l "restore-point/*" 2>/dev/null || true', {
      encoding: 'utf-8'
    }).trim().split('\n').filter(Boolean);

    if (restorePoints.length > 0) {
      console.log('\nFull session rollback:');
      console.log(`  git reset --hard ${restorePoints[restorePoints.length - 1]}`);
    }
  } catch {
    console.log('\nℹ Git checkpoints not available');
  }
}

function provideGuidance(error) {
  console.log('\n──── Suggestions ────');

  // Error-specific guidance
  if (error.message.includes('TypeScript') || error.message.includes('tsc')) {
    console.log('• Run "npx tsc --noEmit" to see all type errors');
    console.log('• Check imports and type definitions');
  } else if (error.message.includes('test') || error.message.includes('jest')) {
    console.log('• Run "npm test" to see full test output');
    console.log('• Check test assertions and mocks');
  } else if (error.message.includes('syntax') || error.message.includes('parse')) {
    console.log('• Check for missing brackets or semicolons');
    console.log('• Validate JSON/YAML files');
  } else if (error.message.includes('module') || error.message.includes('import')) {
    console.log('• Run "npm install" to ensure dependencies');
    console.log('• Check import paths and exports');
  }

  // General suggestions
  console.log('\nGeneral:');
  console.log('• Use @debugger for systematic investigation');
  console.log('• Use /checkpoint restore [name] to rollback');
  console.log('• Check recent changes: git diff HEAD~1');
}

// Run
main().catch(console.error);
