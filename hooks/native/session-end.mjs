#!/usr/bin/env node

/**
 * Session End - Stop Hook
 *
 * Fires when Claude Code finishes responding. Can be used to
 * trigger lifecycle hooks (session-end) or log session metrics.
 * All operations are best-effort. Errors are silently ignored.
 *
 * Claude Code event: Stop
 * Output: { "additionalContext": "..." } or empty
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const lifecyclePath = join(process.cwd(), 'hooks', 'lifecycle.json');

function main() {
  try {
    if (!existsSync(lifecyclePath)) {
      process.stdout.write(JSON.stringify({}));
      return;
    }

    const lifecycle = JSON.parse(readFileSync(lifecyclePath, 'utf-8'));
    const sessionEnd = lifecycle?.hooks?.['session-end'];

    if (!sessionEnd?.enabled) {
      process.stdout.write(JSON.stringify({}));
      return;
    }

    // Log session end for metrics/notifications if configured
    // The lifecycle.json may define webhook URLs or log destinations
    process.stdout.write(JSON.stringify({}));
  } catch {
    process.stdout.write(JSON.stringify({}));
  }
}

main();
