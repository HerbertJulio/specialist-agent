#!/usr/bin/env node

/**
 * Session Start Hook
 *
 * Runs when a new Claude Code session starts.
 *
 * Actions:
 * - Validates project setup
 * - Initializes metrics tracking
 * - Creates session restore point
 * - Loads session memory (if enabled)
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const METRICS_DIR = '.claude/metrics';
const SESSION_FILE = '.claude/metrics/current-session.json';

async function main() {
  const startTime = new Date().toISOString();
  const sessionId = `session-${Date.now()}`;

  console.log('──── Session Start ────');

  // 1. Validate project setup
  validateSetup();

  // 2. Initialize metrics directory
  initializeMetrics(sessionId, startTime);

  // 3. Create session restore point
  createRestorePoint(sessionId);

  // 4. Load previous session memory (if exists)
  loadSessionMemory();

  // 5. Display session info
  displaySessionInfo(sessionId, startTime);
}

function validateSetup() {
  const checks = [
    { path: '.claude', name: 'Claude directory' },
    { path: 'CLAUDE.md', name: 'CLAUDE.md config' },
  ];

  let allValid = true;

  for (const check of checks) {
    if (existsSync(check.path)) {
      console.log(`✓ ${check.name}`);
    } else {
      console.log(`✗ ${check.name} missing`);
      allValid = false;
    }
  }

  if (!allValid) {
    console.log('\nRun "npx specialist-agent init" to set up.');
  }
}

function initializeMetrics(sessionId, startTime) {
  if (!existsSync(METRICS_DIR)) {
    mkdirSync(METRICS_DIR, { recursive: true });
  }

  const sessionData = {
    sessionId,
    startTime,
    endTime: null,
    duration: null,
    agents: [],
    skills: [],
    tasks: [],
    tokens: {
      estimated: 0,
      input: 0,
      output: 0
    },
    files: {
      created: [],
      modified: [],
      deleted: []
    },
    checkpoints: [],
    errors: []
  };

  writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2));
  console.log(`✓ Metrics initialized`);
}

function createRestorePoint(sessionId) {
  try {
    // Check if in git repo
    execSync('git rev-parse --git-dir', { stdio: 'pipe' });

    // Check for uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });

    if (status.trim()) {
      console.log('⚠ Uncommitted changes detected');
      console.log('  Consider committing before major changes');
    }

    // Create restore point tag
    const tagName = `restore-point/${sessionId}`;
    try {
      execSync(`git tag ${tagName}`, { stdio: 'pipe' });
      console.log(`✓ Restore point: ${tagName}`);
    } catch {
      // Tag might already exist or no commits yet
      console.log('ℹ Restore point not created (no commits or already exists)');
    }
  } catch {
    console.log('ℹ Not a git repository');
  }
}

function loadSessionMemory() {
  const memoryFile = '.claude/session-memory.json';

  if (existsSync(memoryFile)) {
    try {
      const memory = JSON.parse(readFileSync(memoryFile, 'utf-8'));
      const decisions = memory.decisions || [];

      if (decisions.length > 0) {
        console.log(`\n📝 Session Memory (${decisions.length} decisions):`);
        // Show last 3 decisions
        decisions.slice(-3).forEach(d => {
          console.log(`  • ${d.topic}: ${d.decision}`);
        });
      }
    } catch {
      // Invalid memory file, ignore
    }
  }
}

function displaySessionInfo(sessionId, startTime) {
  console.log('\n──── Ready ────');
  console.log(`Session: ${sessionId}`);
  console.log(`Started: ${new Date(startTime).toLocaleString()}`);
  console.log('\nAvailable agents: @planner @builder @reviewer @tdd @debugger');
  console.log('Available skills: /plan /tdd /debug /checkpoint /estimate /finish');
}

// Run
main().catch(console.error);
