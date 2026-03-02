#!/usr/bin/env node

/**
 * Native Hooks - Shared Utilities
 * Common functions for all Claude Code native hooks.
 */

import { readFileSync } from 'fs';

/**
 * Read JSON from stdin (Claude Code passes event data this way).
 * Returns parsed object or null on failure.
 */
export async function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    const timeout = setTimeout(() => resolve(null), 5000);

    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => {
      clearTimeout(timeout);
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(null);
      }
    });
    process.stdin.on('error', () => {
      clearTimeout(timeout);
      resolve(null);
    });

    process.stdin.resume();
  });
}

/**
 * Output JSON to stdout for Claude Code to consume.
 */
export function outputJson(obj) {
  process.stdout.write(JSON.stringify(obj));
}

/**
 * Output error to stderr and exit with code 2 (block action).
 */
export function blockWithReason(reason) {
  process.stderr.write(reason);
  process.exit(2);
}

/**
 * Safe JSON file reader. Returns null on any error.
 */
export function readJsonFile(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}
