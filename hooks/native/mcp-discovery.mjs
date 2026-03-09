#!/usr/bin/env node

/**
 * MCP Discovery - SessionStart Hook
 *
 * Detects configured MCP servers and injects availability context
 * so agents know which external tools they can leverage.
 * All operations are read-only. Errors are silently ignored.
 *
 * Claude Code event: SessionStart
 * Output: { "additionalContext": "MCP availability summary..." }
 */

import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { outputJson, readJsonFile } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);

// ── MCP Registry ────────────────────────────────────────────
// Maps MCP server names to the agents/skills that benefit from them.

const MCP_AGENT_MAP = {
  context7: {
    description: 'Library documentation lookups',
    agents: ['@builder', '@doctor', '@migrator', '@deps'],
    skills: ['/tdd', '/debug'],
    hint: 'Agents can fetch up-to-date API docs instead of relying on training data.',
  },
  azion: {
    description: 'Edge deployment & configuration',
    agents: ['@starter', '@cloud'],
    skills: [],
    hint: 'Enables edge deploy, Rules Engine config generation, and Terraform resources.',
  },
  playwright: {
    description: 'Browser automation & testing',
    agents: ['@tester', '@doctor', '@debugger', '@perf'],
    skills: ['/verify', '/debug'],
    hint: 'Agents can interact with the browser — take screenshots, run e2e tests, inspect DOM.',
  },
  github: {
    description: 'GitHub issues, PRs & CI',
    agents: ['@sentry-triage', '@reviewer', '@ripple', '@deps', '@devops'],
    skills: ['/autofix', '/finish', '/codereview'],
    hint: 'Agents can create issues/PRs, read CI status, and manage releases.',
  },
  sentry: {
    description: 'Error tracking & triage',
    agents: ['@sentry-triage', '@doctor', '@debugger'],
    skills: ['/autofix', '/debug'],
    hint: 'Agents can fetch Sentry errors directly instead of requiring CLI or curl.',
  },
  linear: {
    description: 'Issue tracking & project management',
    agents: ['@planner', '@analyst', '@product', '@orchestrator'],
    skills: ['/plan'],
    hint: 'Agents can read/create Linear issues and link tasks to code changes.',
  },
  jira: {
    description: 'Issue tracking & project management',
    agents: ['@planner', '@analyst', '@product', '@orchestrator'],
    skills: ['/plan'],
    hint: 'Agents can read/create Jira issues and link tasks to code changes.',
  },
  supabase: {
    description: 'Database & auth management',
    agents: ['@data', '@builder', '@security'],
    skills: [],
    hint: 'Agents can read schemas, manage migrations, and configure auth rules.',
  },
  postgres: {
    description: 'PostgreSQL database access',
    agents: ['@data', '@builder'],
    skills: [],
    hint: 'Agents can read live schemas and validate queries.',
  },
  slack: {
    description: 'Team notifications',
    agents: ['@orchestrator', '@support'],
    skills: ['/finish'],
    hint: 'Agents can send notifications on review completion, deploys, and errors.',
  },
  filesystem: {
    description: 'Extended file system access',
    agents: ['@explorer', '@scout'],
    skills: ['/onboard'],
    hint: 'Extended file system capabilities for deep codebase exploration.',
  },
};

// ── Discovery Logic (exported for testing) ──────────────────

/**
 * Discover configured MCP servers and map them to agent capabilities.
 * @param {string} cwd - Project root directory
 * @returns {{ configured: string[], agentCapabilities: Record<string, string[]>, suggestions: string[] }}
 */
export function discoverMCPs(cwd) {
  const mcpConfig = readJsonFile(join(cwd, '.mcp.json'));
  const configured = mcpConfig?.mcpServers ? Object.keys(mcpConfig.mcpServers) : [];

  // Map configured MCPs to agent capabilities
  const agentCapabilities = {};
  for (const mcpName of configured) {
    const mapping = MCP_AGENT_MAP[mcpName];
    if (!mapping) continue;

    for (const agent of mapping.agents) {
      if (!agentCapabilities[agent]) agentCapabilities[agent] = [];
      agentCapabilities[agent].push(mcpName);
    }
  }

  // Suggest MCPs that would benefit current agents but aren't configured
  const suggestions = [];
  for (const [mcpName, mapping] of Object.entries(MCP_AGENT_MAP)) {
    if (configured.includes(mcpName)) continue;
    // Only suggest if user has relevant agents installed
    suggestions.push(`${mcpName}: ${mapping.description} → benefits ${mapping.agents.join(', ')}`);
  }

  return { configured, agentCapabilities, suggestions };
}

/**
 * Build MCP context string for session injection.
 * @param {string} cwd - Project root directory
 * @returns {string} MCP context or empty string
 */
export function buildMCPContext(cwd) {
  const { configured, agentCapabilities } = discoverMCPs(cwd);

  if (configured.length === 0) return '';

  const parts = [`MCPs available: ${configured.join(', ')}`];

  // Add agent-specific hints
  const enhancedAgents = Object.entries(agentCapabilities)
    .map(([agent, mcps]) => `${agent}(+${mcps.join(',')})`)
    .join(' ');

  if (enhancedAgents) {
    parts.push(`Enhanced agents: ${enhancedAgents}`);
  }

  return parts.join(' | ');
}

// ── Main Execution ──────────────────────────────────────────

async function main() {
  const cwd = process.cwd();
  const context = buildMCPContext(cwd);

  if (context) {
    outputJson({ additionalContext: `[MCP Discovery] ${context}` });
  }

  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  main().catch(() => {
    // Advisory hook - never block on error
    process.exit(0);
  });
}
