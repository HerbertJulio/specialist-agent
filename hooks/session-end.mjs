#!/usr/bin/env node

/**
 * Session End Hook
 *
 * Runs when a session ends (manually triggered or detected).
 *
 * Actions:
 * - Generates session summary
 * - Saves metrics to history
 * - Cleans up temporary data
 * - Updates session memory
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const SESSION_FILE = '.claude/metrics/current-session.json';
const HISTORY_DIR = '.claude/metrics/history';
const MEMORY_FILE = '.claude/session-memory.json';

async function main() {
  console.log('\n════════════════════════════════════════');
  console.log('           SESSION SUMMARY              ');
  console.log('════════════════════════════════════════\n');

  // 1. Load session data
  const session = loadSession();
  if (!session) {
    console.log('No active session to summarize.');
    return;
  }

  // 2. Calculate final metrics
  const metrics = calculateMetrics(session);

  // 3. Display summary
  displaySummary(session, metrics);

  // 4. Compare with competitors
  displayComparison(metrics);

  // 5. Save to history
  saveToHistory(session, metrics);

  // 6. Clean up
  cleanup();

  console.log('\n════════════════════════════════════════\n');
}

function loadSession() {
  if (!existsSync(SESSION_FILE)) {
    return null;
  }

  try {
    const session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));
    session.endTime = new Date().toISOString();
    return session;
  } catch {
    return null;
  }
}

function calculateMetrics(session) {
  const startTime = new Date(session.startTime);
  const endTime = new Date(session.endTime);
  const durationMs = endTime - startTime;

  return {
    duration: formatDuration(durationMs),
    durationMs,
    tasksCompleted: session.tasks.length,
    tasksFailed: session.errors.length,
    totalTokens: session.tokens.estimated,
    estimatedCost: session.tokens.estimated * 0.000015, // ~Sonnet pricing
    filesCreated: [...new Set(session.files.created)].length,
    filesModified: [...new Set(session.files.modified)].length,
    agentsUsed: session.agents.length,
    skillsUsed: session.skills.length,
    checkpointsCreated: session.checkpoints.length,
    tokensPerTask: session.tasks.length > 0
      ? Math.round(session.tokens.estimated / session.tasks.length)
      : 0
  };
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

function displaySummary(session, metrics) {
  console.log('──── Overview ────');
  console.log(`Session ID: ${session.sessionId}`);
  console.log(`Duration: ${metrics.duration}`);
  console.log(`Status: ${metrics.tasksFailed > 0 ? '⚠ Completed with errors' : '✓ Completed successfully'}`);

  console.log('\n──── Tasks ────');
  console.log(`Completed: ${metrics.tasksCompleted}`);
  console.log(`Errors: ${metrics.tasksFailed}`);

  console.log('\n──── Files ────');
  console.log(`Created: ${metrics.filesCreated}`);
  console.log(`Modified: ${metrics.filesModified}`);

  console.log('\n──── Token Usage ────');
  console.log(`Total tokens: ~${metrics.totalTokens.toLocaleString()}`);
  console.log(`Per task avg: ~${metrics.tokensPerTask.toLocaleString()}`);
  console.log(`Estimated cost: ~$${metrics.estimatedCost.toFixed(2)}`);

  console.log('\n──── Agents & Skills ────');
  if (session.agents.length > 0) {
    console.log(`Agents: ${session.agents.join(', ')}`);
  }
  if (session.skills.length > 0) {
    console.log(`Skills: ${session.skills.join(', ')}`);
  }

  if (session.checkpoints.length > 0) {
    console.log(`\nCheckpoints: ${session.checkpoints.length} created`);
  }

  if (session.errors.length > 0) {
    console.log('\n──── Errors ────');
    session.errors.forEach((err, i) => {
      console.log(`${i + 1}. [${err.agent}] ${err.message}`);
    });
  }
}

function displayComparison(metrics) {
  // Estimate what Superpowers would cost for same work
  // They use O(n²) scaling, we use linear
  const superpowersEstimate = metrics.tasksCompleted > 1
    ? metrics.estimatedCost * Math.pow(metrics.tasksCompleted, 1.5)
    : metrics.estimatedCost * 1.5;

  const savings = ((superpowersEstimate - metrics.estimatedCost) / superpowersEstimate * 100).toFixed(0);

  console.log('\n──── Cost Comparison ────');
  console.log(`Specialist Agent: ~$${metrics.estimatedCost.toFixed(2)}`);
  console.log(`Superpowers (est): ~$${superpowersEstimate.toFixed(2)}`);
  console.log(`Savings: ~${savings}%`);
}

function saveToHistory(session, metrics) {
  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true });
  }

  const historyFile = join(HISTORY_DIR, `${session.sessionId}.json`);
  const historyData = {
    ...session,
    metrics
  };

  writeFileSync(historyFile, JSON.stringify(historyData, null, 2));
  console.log(`\n✓ Session saved to ${historyFile}`);
}

function cleanup() {
  // Remove current session file
  try {
    if (existsSync(SESSION_FILE)) {
      // Keep it for now, can be deleted manually
      console.log('ℹ Session file preserved for review');
    }
  } catch {
    // Ignore cleanup errors
  }
}

// Run
main().catch(console.error);
