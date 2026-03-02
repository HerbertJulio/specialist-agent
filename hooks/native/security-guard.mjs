#!/usr/bin/env node

/**
 * Security Guard - PreToolUse Hook (Bash)
 *
 * Blocks dangerous shell commands BEFORE they execute.
 * Design: fail-closed (if this script crashes, exit 2 = block).
 *
 * Claude Code event: PreToolUse (matcher: "Bash")
 * Stdin: { tool_input: { command: "..." } }
 * Block: exit 2 + stderr reason
 * Allow: exit 0 (silent)
 */

import { readFileSync } from 'fs';
import { join, dirname, resolve, normalize } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Security Rules ──────────────────────────────────────────

const RULES = [
  // CRITICAL - always block, no exceptions
  {
    id: 'catastrophic-rm',
    severity: 'CRITICAL',
    test: (cmd) => {
      const normalized = cmd.replace(/\s+/g, ' ').trim();
      // Match rm with -r and -f flags targeting / or ~ or bare .
      if (!/\brm\b/.test(normalized)) return false;
      if (!/-[a-zA-Z]*r/.test(normalized) && !/-[a-zA-Z]*R/.test(normalized)) return false;
      // Check target paths
      const dangerousTargets = [
        /\s\/\s*$/, /\s\/[^a-zA-Z]/, // rm -rf /
        /\s~\s*$/, /\s~\//, // rm -rf ~ or ~/...
        /\s\.\s*$/, /\s\.\//, // rm -rf . or ./...
        /\s\.\.\s*$/, /\s\.\.\//, // rm -rf .. or ../...
      ];
      for (const pattern of dangerousTargets) {
        if (pattern.test(' ' + normalized)) {
          // Check allowlist - safe directories are OK
          const safeTargets = [
            /node_modules/, /dist[\/\\]?/, /build[\/\\]?/, /\.next[\/\\]?/,
            /\.nuxt[\/\\]?/, /\.svelte-kit[\/\\]?/, /coverage[\/\\]?/,
            /\.turbo[\/\\]?/, /\.cache[\/\\]?/, /__pycache__[\/\\]?/,
          ];
          if (safeTargets.some(safe => safe.test(normalized))) return false;
          return true;
        }
      }
      return false;
    },
    message: 'BLOCKED [CRITICAL]: Recursive delete of system/home/project root detected.\nThis command could destroy your entire filesystem.\nIf you need to clean a specific directory, target it explicitly (e.g., rm -rf dist/).'
  },
  {
    id: 'fork-bomb',
    severity: 'CRITICAL',
    test: (cmd) => /:\(\)\s*\{.*\|.*&\s*\}\s*;?\s*:/.test(cmd) || /\.\/bomb/.test(cmd),
    message: 'BLOCKED [CRITICAL]: Fork bomb detected. This would crash the system by spawning infinite processes.'
  },
  {
    id: 'disk-wipe',
    severity: 'CRITICAL',
    test: (cmd) => {
      return /\bmkfs\b/.test(cmd) ||
        /\bdd\b.*\bif=.*\/dev\//.test(cmd) && /\bof=.*\/dev\//.test(cmd) ||
        />\s*\/dev\/[hs]d[a-z]/.test(cmd);
    },
    message: 'BLOCKED [CRITICAL]: Disk wipe command detected. This would destroy disk data irreversibly.'
  },

  // HIGH - block with descriptive message
  {
    id: 'force-push-protected',
    severity: 'HIGH',
    test: (cmd, config) => {
      if (!/\bgit\s+push\b/.test(cmd)) return false;
      if (!/(-f\b|--force\b)/.test(cmd)) return false;
      // force-with-lease is safer, allow it
      if (/--force-with-lease/.test(cmd)) return false;
      // Check if targeting a protected branch
      const branches = config?.protectedBranches || ['main', 'master', 'production', 'release'];
      return branches.some(branch => new RegExp(`\\b${branch}\\b`).test(cmd));
    },
    message: 'BLOCKED [HIGH]: Force push to protected branch.\nUse a feature branch and create a PR instead.\nIf you need to force push, use --force-with-lease for safety, or target a feature branch.'
  },
  {
    id: 'hard-reset',
    severity: 'HIGH',
    test: (cmd) => {
      if (!/\bgit\s+reset\b/.test(cmd)) return false;
      if (/--hard/.test(cmd)) return true;
      return false;
    },
    message: 'BLOCKED [HIGH]: git reset --hard discards all uncommitted changes permanently.\nConsider using: git stash (to save changes), git reset --soft (to unstage), or git checkout -- <file> (for specific files).'
  },
  {
    id: 'sql-destructive',
    severity: 'HIGH',
    test: (cmd) => {
      const upper = cmd.toUpperCase();
      return /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/.test(upper) ||
        /\bTRUNCATE\s+TABLE\b/.test(upper) ||
        /\bDELETE\s+FROM\s+\w+\s*;?\s*$/.test(upper); // DELETE without WHERE
    },
    message: 'BLOCKED [HIGH]: Destructive SQL command detected.\nDROP/TRUNCATE/DELETE-without-WHERE can cause irreversible data loss.\nUse a transaction, add a WHERE clause, or test on a staging database first.'
  },
  {
    id: 'pipe-to-shell',
    severity: 'HIGH',
    test: (cmd) => {
      return /\bcurl\b.*\|\s*(bash|sh|zsh)\b/.test(cmd) ||
        /\bwget\b.*\|\s*(bash|sh|zsh)\b/.test(cmd) ||
        /\bcurl\b.*-[a-zA-Z]*o\s*-\s*\|/.test(cmd);
    },
    message: 'BLOCKED [HIGH]: Pipe-to-shell pattern detected (curl/wget | bash).\nThis downloads and executes remote code without inspection.\nDownload the script first, review it, then execute: curl -o script.sh <url> && cat script.sh && bash script.sh'
  },
  {
    id: 'chmod-777',
    severity: 'HIGH',
    test: (cmd) => /\bchmod\b.*\b777\b/.test(cmd),
    message: 'BLOCKED [HIGH]: chmod 777 makes files world-readable/writable/executable.\nUse specific permissions instead: chmod 755 (directories), chmod 644 (files), chmod 600 (secrets).'
  },

  // MEDIUM - block access to sensitive files
  {
    id: 'env-file-read',
    severity: 'MEDIUM',
    test: (cmd) => {
      // Block reading .env files (but allow .env.example, .env.sample, .env.template)
      if (/\bcat\b.*\.env\b/.test(cmd) || /\bless\b.*\.env\b/.test(cmd) || /\bmore\b.*\.env\b/.test(cmd)) {
        if (/\.env\.(example|sample|template|test|development)/.test(cmd)) return false;
        if (/\.env\.local/.test(cmd)) return true; // .env.local has secrets
        return true;
      }
      // Block reading private keys
      if (/\bcat\b.*\.(pem|key|p12|pfx)\b/.test(cmd)) return true;
      return false;
    },
    message: 'BLOCKED [MEDIUM]: Reading sensitive file (.env or private key) via shell.\nUse the Read tool instead, which provides better access control.\nAllowed: .env.example, .env.sample, .env.template'
  },
  {
    id: 'env-file-write',
    severity: 'MEDIUM',
    test: (cmd) => {
      // Block writing to .env files
      return />\s*\.env\b/.test(cmd) && !/\.env\.(example|sample|template)/.test(cmd);
    },
    message: 'BLOCKED [MEDIUM]: Writing to .env file via shell.\nManage secrets through environment variables or a secrets manager, not by writing them to files via commands.'
  },
  {
    id: 'inline-secrets',
    severity: 'MEDIUM',
    test: (cmd) => {
      // Block patterns like: export SECRET_KEY=actual_value, TOKEN=xxx command
      const secretPatterns = [
        /\b\w*(API_KEY|SECRET|TOKEN|PASSWORD|CREDENTIALS|PRIVATE_KEY)\w*\s*=\s*['"][^'"]{8,256}['"]/i,
        /\bexport\s+\w*(API_KEY|SECRET|TOKEN|PASSWORD|CREDENTIALS|PRIVATE_KEY)\w*\s*=\s*\S{8,256}/i,
      ];
      return secretPatterns.some(p => p.test(cmd));
    },
    message: 'BLOCKED [MEDIUM]: Inline secret detected in command.\nNever put secrets directly in shell commands. Use environment variables already set in the system:\n  export MY_SECRET=... (in your shell profile)\n  Then reference as $MY_SECRET in commands.'
  },
];

// ── Core Evaluation Function (exported for testing) ─────────

/**
 * Evaluate a command against security rules.
 * @param {string} command - The shell command to evaluate
 * @param {object} config - Security config (from security-config.json)
 * @returns {{ blocked: boolean, rule?: string, severity?: string, message?: string }}
 */
export function evaluateCommand(command, config = {}) {
  if (!command || typeof command !== 'string') {
    return { blocked: false };
  }

  const enabledRules = config?.rules || {};

  for (const rule of RULES) {
    // Check if rule is disabled in config
    if (enabledRules[rule.id]?.enabled === false) continue;

    // Check allowlist — normalize whitespace and compare the full command
    // to prevent bypass via chaining (e.g. "rm -rf dist; malicious")
    const allowlist = config?.allowlist || [];
    const normalizedCmd = command.replace(/\s+/g, ' ').trim();
    const isAllowed = allowlist.some(pattern => {
      const normalizedPattern = pattern.replace(/\s+/g, ' ').trim();
      return normalizedCmd === normalizedPattern;
    });
    if (isAllowed) continue;

    // Test the rule
    if (rule.test(command, config)) {
      return {
        blocked: true,
        rule: rule.id,
        severity: rule.severity,
        message: rule.message,
      };
    }
  }

  return { blocked: false };
}

// ── Main Execution ──────────────────────────────────────────

async function main() {
  let input = null;

  try {
    // Read stdin
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
    // Fail-closed: if we can't parse input, block
    process.stderr.write('Security Guard: Failed to parse input. Blocking as precaution.');
    process.exit(2);
  }

  if (!input?.tool_input?.command) {
    // No command to evaluate - allow
    process.exit(0);
  }

  const command = input.tool_input.command;

  // Load config
  let config = {};
  try {
    const configPath = join(__dirname, 'security-config.json');
    config = JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch {
    // No config = use defaults (all rules enabled)
  }

  if (config.enabled === false) {
    process.exit(0);
  }

  const result = evaluateCommand(command, config);

  if (result.blocked) {
    process.stderr.write(`\n🛡️ Security Guard\n${result.message}\n\nRule: ${result.rule} (${result.severity})\nTo customize: edit hooks/native/security-config.json\n`);
    process.exit(2);
  }

  // Allow - silent exit
  process.exit(0);
}

// Only run main when executed directly
if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  main().catch(() => {
    // Fail-closed: any unhandled error = block
    process.stderr.write('Security Guard: Unexpected error. Blocking as precaution.');
    process.exit(2);
  });
}
