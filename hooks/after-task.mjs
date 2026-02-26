#!/usr/bin/env node

/**
 * After Task Hook
 *
 * Runs after each task completes (from @executor or manual work).
 *
 * Actions:
 * - Records task completion in metrics
 * - Creates checkpoint if enabled
 * - Updates token tracking
 * - Logs progress
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';

const SESSION_FILE = '.claude/metrics/current-session.json';

// Task data passed via environment or args
const taskData = {
  taskId: process.env.TASK_ID || process.argv[2] || 'unknown',
  description: process.env.TASK_DESC || process.argv[3] || 'Task completed',
  tokens: parseInt(process.env.TASK_TOKENS || process.argv[4] || '0', 10),
  duration: process.env.TASK_DURATION || process.argv[5] || '0s',
  agent: process.env.TASK_AGENT || process.argv[6] || 'manual',
  status: process.env.TASK_STATUS || process.argv[7] || 'completed',
  files: {
    created: (process.env.FILES_CREATED || '').split(',').filter(Boolean),
    modified: (process.env.FILES_MODIFIED || '').split(',').filter(Boolean)
  }
};

async function main() {
  console.log(`\n──── Task Complete: ${taskData.taskId} ────`);

  // 1. Update session metrics
  updateMetrics(taskData);

  // 2. Log task summary
  logTaskSummary(taskData);

  // 3. Show running totals
  showRunningTotals();
}

function updateMetrics(task) {
  if (!existsSync(SESSION_FILE)) {
    console.log('ℹ No active session');
    return;
  }

  try {
    const session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));

    // Add task to list
    session.tasks.push({
      id: task.taskId,
      description: task.description,
      agent: task.agent,
      status: task.status,
      tokens: task.tokens,
      duration: task.duration,
      completedAt: new Date().toISOString()
    });

    // Update token totals
    session.tokens.estimated += task.tokens;

    // Update file tracking
    session.files.created.push(...task.files.created);
    session.files.modified.push(...task.files.modified);

    // Update agent usage
    if (task.agent && !session.agents.includes(task.agent)) {
      session.agents.push(task.agent);
    }

    writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
  } catch (err) {
    console.log('ℹ Could not update metrics:', err.message);
  }
}

function logTaskSummary(task) {
  console.log(`Status: ${task.status === 'completed' ? '✓' : '✗'} ${task.status}`);
  console.log(`Agent: ${task.agent}`);
  console.log(`Tokens: ~${task.tokens.toLocaleString()}`);
  console.log(`Duration: ${task.duration}`);

  if (task.files.created.length > 0) {
    console.log(`Files created: ${task.files.created.length}`);
  }
  if (task.files.modified.length > 0) {
    console.log(`Files modified: ${task.files.modified.length}`);
  }
}

function showRunningTotals() {
  if (!existsSync(SESSION_FILE)) {
    return;
  }

  try {
    const session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));

    console.log('\n──── Session Progress ────');
    console.log(`Tasks completed: ${session.tasks.length}`);
    console.log(`Total tokens: ~${session.tokens.estimated.toLocaleString()}`);
    console.log(`Estimated cost: ~$${(session.tokens.estimated * 0.000015).toFixed(2)}`);
    console.log(`Agents used: ${session.agents.join(', ') || 'none'}`);
  } catch {
    // Ignore errors
  }
}

// Run
main().catch(console.error);
