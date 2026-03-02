#!/usr/bin/env node

/**
 * Auto-Format - PostToolUse Hook (Write|Edit)
 *
 * Automatically formats files after Claude writes or edits them.
 * Detects available formatters (prettier, eslint, biome) by config presence.
 * Never fails - if no formatter found, silently exits.
 *
 * Claude Code event: PostToolUse (matcher: "Write|Edit")
 * Stdin: { tool_input: { file_path: "..." } }
 * Output: silent (no additionalContext needed)
 */

import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve, extname, normalize, join, relative, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// ── Supported Extensions ────────────────────────────────────

const FORMATTABLE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.vue', '.svelte',
  '.css', '.scss', '.less',
  '.json',
  '.html', '.htm',
  '.md', '.mdx',
  '.yaml', '.yml',
]);

// ── Formatter Detection ─────────────────────────────────────

const PRETTIER_CONFIGS = [
  '.prettierrc',
  '.prettierrc.json',
  '.prettierrc.js',
  '.prettierrc.cjs',
  '.prettierrc.mjs',
  '.prettierrc.yml',
  '.prettierrc.yaml',
  '.prettierrc.toml',
  'prettier.config.js',
  'prettier.config.cjs',
  'prettier.config.mjs',
];

const BIOME_CONFIGS = [
  'biome.json',
  'biome.jsonc',
];

/**
 * Detect which formatter is available in the project.
 * @param {string} cwd - Project root
 * @returns {'prettier' | 'biome' | null}
 */
export function detectFormatter(cwd) {
  // Check prettier first (most common)
  for (const config of PRETTIER_CONFIGS) {
    if (existsSync(join(cwd, config))) return 'prettier';
  }

  // Check package.json for prettier key
  try {
    const pkg = JSON.parse(require('fs').readFileSync(join(cwd, 'package.json'), 'utf-8'));
    if (pkg.prettier) return 'prettier';
  } catch {
    // ignore
  }

  // Check biome
  for (const config of BIOME_CONFIGS) {
    if (existsSync(join(cwd, config))) return 'biome';
  }

  return null;
}

/**
 * Validate that a file path is within the project directory.
 * Prevents path traversal attacks.
 * @param {string} filePath - File path to validate
 * @param {string} cwd - Project root
 * @returns {boolean}
 */
export function isWithinProject(filePath, cwd) {
  try {
    const resolved = resolve(filePath);
    const normalizedCwd = resolve(cwd);
    // Use path.relative to prevent prefix-matching false positives
    // e.g. "/projectsecrets" would pass startsWith("/project") but not this check
    const rel = relative(normalizedCwd, resolved);
    return !rel.startsWith('..') && !isAbsolute(rel);
  } catch {
    return false;
  }
}

/**
 * Format a file using the detected formatter.
 * @param {string} filePath - File to format
 * @param {string} formatter - 'prettier' or 'biome'
 * @param {string} cwd - Project root
 * @returns {boolean} true if formatted successfully
 */
export function formatFile(filePath, formatter, cwd) {
  try {
    // Use execFileSync with argument array to prevent command injection
    // filePath is never interpolated into a shell string
    if (formatter === 'prettier') {
      execFileSync('npx', ['prettier', '--write', filePath], {
        cwd,
        encoding: 'utf-8',
        timeout: 10000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return true;
    }

    if (formatter === 'biome') {
      execFileSync('npx', ['@biomejs/biome', 'format', '--write', filePath], {
        cwd,
        encoding: 'utf-8',
        timeout: 10000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

// ── Main Execution ──────────────────────────────────────────

async function main() {
  let input = null;

  try {
    const data = await new Promise((resolve) => {
      let buf = '';
      const timeout = setTimeout(() => resolve(buf), 3000);
      process.stdin.setEncoding('utf-8');
      process.stdin.on('data', (chunk) => { buf += chunk; });
      process.stdin.on('end', () => { clearTimeout(timeout); resolve(buf); });
      process.stdin.on('error', () => { clearTimeout(timeout); resolve(''); });
      process.stdin.resume();
    });

    input = data ? JSON.parse(data) : null;
  } catch {
    process.exit(0);
  }

  const filePath = input?.tool_input?.file_path;

  if (!filePath) {
    process.exit(0);
  }

  // Check extension
  const ext = extname(filePath).toLowerCase();
  if (!FORMATTABLE_EXTENSIONS.has(ext)) {
    process.exit(0);
  }

  const cwd = process.cwd();

  // Security: validate path is within project
  if (!isWithinProject(filePath, cwd)) {
    process.exit(0);
  }

  // Detect formatter
  const formatter = detectFormatter(cwd);
  if (!formatter) {
    process.exit(0);
  }

  // Format
  formatFile(filePath, formatter, cwd);

  // Always exit 0 - formatting is best-effort, never blocking
  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  main().catch(() => {
    process.exit(0);
  });
}
