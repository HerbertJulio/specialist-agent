#!/usr/bin/env node

/**
 * Auto-Dispatch - UserPromptSubmit Hook
 *
 * Detects user intent from prompt text and SUGGESTS (never forces)
 * the best specialist agent. Respects explicit @agent mentions.
 *
 * Claude Code event: UserPromptSubmit
 * Stdin: { prompt: "..." }
 * Output: { "additionalContext": "Consider using @agent..." } or {}
 */

import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// ── Intent Map ──────────────────────────────────────────────
// Each agent maps to keyword groups. Multi-word phrases score higher.
// weight: multiplier for match score (more specific = higher)

const INTENT_MAP = {
  // Core agents
  starter:    { phrases: ['new project', 'from scratch', 'scaffold', 'bootstrap', 'starter'], keywords: ['create app', 'init project'], weight: 1.5 },
  builder:    { phrases: ['create module', 'build component', 'implement feature', 'add crud'], keywords: ['create', 'build', 'implement', 'add', 'module', 'component', 'service', 'scaffold'], weight: 1 },
  reviewer:   { phrases: ['code review', 'review code', 'check quality', 'architecture review'], keywords: ['review', 'audit code', 'quality'], weight: 1.2 },
  doctor:     { phrases: ['not working', 'investigate bug', 'trace error', '500 error', '404 error'], keywords: ['bug', 'error', 'broken', 'crash', 'investigate', 'diagnose', 'failing'], weight: 1.2 },
  migrator:   { phrases: ['modernize code', 'migrate legacy', 'upgrade framework'], keywords: ['migrate', 'modernize', 'legacy', 'upgrade'], weight: 1.5 },

  // Workflow agents
  planner:    { phrases: ['plan feature', 'design architecture', 'plan implementation'], keywords: ['plan', 'design', 'architect', 'strategy', 'roadmap'], weight: 1 },
  executor:   { phrases: ['execute plan', 'run tasks', 'execute all'], keywords: ['execute', 'run plan', 'checkpoint'], weight: 1.5 },
  tdd:        { phrases: ['test first', 'test driven', 'red green refactor', 'tdd'], keywords: ['tdd', 'failing test', 'test-driven'], weight: 2 },
  debugger:   { phrases: ['debug issue', 'root cause', 'stack trace', 'step through'], keywords: ['debug', 'trace', 'breakpoint', 'root cause'], weight: 1.2 },
  pair:       { phrases: ['pair programming', 'pair with me', 'code together'], keywords: ['pair', 'collaborate', 'together'], weight: 1.5 },
  analyst:    { phrases: ['requirements spec', 'technical spec', 'user story'], keywords: ['requirements', 'spec', 'user story', 'acceptance criteria'], weight: 1.5 },
  orchestrator: { phrases: ['coordinate agents', 'multi-agent', 'orchestrate'], keywords: ['orchestrate', 'coordinate', 'multi-agent'], weight: 2 },

  // Specialist agents
  api:        { phrases: ['api design', 'rest api', 'graphql', 'openapi', 'api endpoint'], keywords: ['api', 'endpoint', 'rest', 'graphql', 'swagger'], weight: 1.2 },
  perf:       { phrases: ['optimize performance', 'slow page', 'performance audit', 'speed up'], keywords: ['performance', 'optimize', 'slow', 'speed', 'bottleneck', 'lighthouse'], weight: 1.2 },
  security:   { phrases: ['security audit', 'owasp', 'vulnerability scan', 'auth security'], keywords: ['security', 'vulnerability', 'owasp', 'xss', 'injection', 'auth'], weight: 1.2 },
  finance:    { phrases: ['payment integration', 'stripe integration', 'billing system', 'subscription'], keywords: ['payment', 'stripe', 'billing', 'subscription', 'invoice'], weight: 1.5 },
  cloud:      { phrases: ['deploy to aws', 'terraform', 'serverless', 'cloud architecture'], keywords: ['aws', 'gcp', 'azure', 'terraform', 'serverless', 'lambda', 'cloud'], weight: 1.2 },
  data:       { phrases: ['database design', 'schema design', 'prisma migration', 'data model'], keywords: ['database', 'schema', 'prisma', 'migration', 'sql', 'query', 'orm'], weight: 1.2 },
  devops:     { phrases: ['docker setup', 'ci/cd pipeline', 'kubernetes', 'deploy pipeline'], keywords: ['docker', 'kubernetes', 'k8s', 'ci/cd', 'pipeline', 'deploy', 'container'], weight: 1.2 },
  i18n:       { phrases: ['internationalization', 'add translations', 'multi-language'], keywords: ['i18n', 'translate', 'internationalization', 'locale', 'language'], weight: 1.5 },
  docs:       { phrases: ['generate documentation', 'write docs', 'api docs', 'jsdoc'], keywords: ['documentation', 'docs', 'jsdoc', 'readme'], weight: 1 },
  refactor:   { phrases: ['refactor code', 'clean up code', 'extract function', 'reduce complexity'], keywords: ['refactor', 'clean up', 'extract', 'simplify', 'complexity'], weight: 1 },
  deps:       { phrases: ['update dependencies', 'dependency audit', 'outdated packages'], keywords: ['dependency', 'dependencies', 'outdated', 'update packages', 'npm audit'], weight: 1.5 },
  legal:      { phrases: ['gdpr compliance', 'lgpd', 'ccpa', 'privacy policy', 'data protection'], keywords: ['gdpr', 'lgpd', 'ccpa', 'compliance', 'privacy', 'data protection'], weight: 1.5 },
  designer:   { phrases: ['design system', 'component library', 'accessibility audit'], keywords: ['design system', 'accessibility', 'a11y', 'ui library', 'theme'], weight: 1.5 },
  tester:     { phrases: ['test strategy', 'test coverage', 'e2e tests', 'testing plan'], keywords: ['test strategy', 'coverage', 'e2e', 'testing'], weight: 1 },

  // Support agents
  scout:      { phrases: ['analyze project', 'project analysis', 'quick scan'], keywords: ['analyze', 'scan', 'overview', 'analysis'], weight: 1 },
  explorer:   { phrases: ['explore codebase', 'understand code', 'how does this work'], keywords: ['explore', 'understand', 'codebase', 'how does'], weight: 1 },
  memory:     { phrases: ['remember this', 'save decision', 'recall decision', 'session memory'], keywords: ['remember', 'recall', 'memory', 'decision log'], weight: 1.5 },
  architect:  { phrases: ['architecture migration', 'monolith to microservices', 'system redesign', 'clean architecture', 'hexagonal architecture', 'migrate architecture', 'detect architecture', 'change architecture', 'improve architecture', 'modular monolith', 'domain driven design', 'feature sliced design', 'ports and adapters'], keywords: ['architecture', 'hexagonal', 'ddd', 'cqrs', 'modular monolith', 'bounded context', 'strangler fig', 'modular', 'fsd', 'clean arch', 'ports adapters'], weight: 1.5 },
  ripple:     { phrases: ['impact analysis', 'cascading effects', 'what will break', 'change impact'], keywords: ['impact', 'ripple', 'cascade', 'breaking change', 'downstream'], weight: 1.5 },
};

// Descriptions for suggestions
const AGENT_DESCRIPTIONS = {
  starter: 'creates projects from scratch with best practices',
  builder: 'builds modules, components, and services with tests',
  reviewer: 'provides unified 3-in-1 review (spec, quality, architecture)',
  doctor: 'investigates bugs with systematic 4-phase diagnosis',
  migrator: 'modernizes legacy code to current standards',
  planner: 'creates adaptive implementation plans by complexity',
  executor: 'executes plans with checkpoints and cost tracking',
  tdd: 'implements test-driven development (RED → GREEN → REFACTOR)',
  debugger: 'performs 4-phase systematic debugging with evidence',
  pair: 'provides real-time pair programming assistance',
  analyst: 'converts requirements into technical specifications',
  orchestrator: 'coordinates multiple agents for complex tasks',
  api: 'designs REST/GraphQL APIs with OpenAPI specs',
  perf: 'optimizes performance with measurable improvements',
  security: 'audits for OWASP vulnerabilities and auth issues',
  finance: 'integrates payments, billing, and subscriptions',
  cloud: 'architects cloud infrastructure with IaC',
  data: 'designs database schemas, migrations, and caching',
  devops: 'sets up Docker, K8s, and CI/CD pipelines',
  i18n: 'implements internationalization and translations',
  docs: 'generates documentation from code',
  refactor: 'refactors code for clarity and maintainability',
  deps: 'manages dependencies and security updates',
  legal: 'ensures GDPR, LGPD, CCPA compliance',
  designer: 'creates design systems with accessibility',
  tester: 'designs test strategies and improves coverage',
  scout: 'provides quick project analysis (~500 tokens)',
  explorer: 'performs deep codebase exploration',
  memory: 'saves and recalls decisions across sessions',
  architect: 'designs and migrates full system architecture (hexagonal, DDD, CQRS, microservices)',
  ripple: 'analyzes cascading impact of changes across the codebase',
};

// ── Intent Matching Engine (exported for testing) ───────────

/**
 * Match user prompt against intent map and return best agent suggestion.
 * @param {string} prompt - The user's prompt text
 * @returns {{ agent: string, score: number, description: string } | null}
 */
export function matchIntent(prompt) {
  if (!prompt || typeof prompt !== 'string') return null;

  const lower = prompt.toLowerCase().trim();

  // Skip if user already mentions an @agent explicitly
  if (/@\w+/.test(lower)) return null;

  // Skip if prompt is too short (likely greeting or simple question)
  if (lower.split(/\s+/).length < 3) return null;

  const scores = {};

  for (const [agent, config] of Object.entries(INTENT_MAP)) {
    let score = 0;

    // Check phrases first (higher specificity)
    for (const phrase of config.phrases || []) {
      if (lower.includes(phrase.toLowerCase())) {
        score += 2 * config.weight;
      }
    }

    // Check individual keywords
    for (const keyword of config.keywords || []) {
      if (lower.includes(keyword.toLowerCase())) {
        score += 1 * config.weight;
      }
    }

    if (score > 0) {
      scores[agent] = score;
    }
  }

  // Find best match
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) return null;

  const [bestAgent, bestScore] = entries[0];

  // Minimum threshold: score must be >= 2 to suggest
  if (bestScore < 2) return null;

  return {
    agent: bestAgent,
    score: bestScore,
    description: AGENT_DESCRIPTIONS[bestAgent] || '',
  };
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
    // Can't parse input - silently allow (this hook is advisory, not blocking)
    process.exit(0);
  }

  const prompt = input?.prompt || '';

  if (!prompt) {
    process.exit(0);
  }

  const match = matchIntent(prompt);

  if (match) {
    const output = {
      additionalContext: `Specialist Agent suggests: @${match.agent} — ${match.description}. Mention @${match.agent} in your prompt to activate it. Agents provide domain expertise, structured workflows, and verification — always prefer them over generic prompts.`,
    };
    process.stdout.write(JSON.stringify(output));
  } else {
    // Reinforce agent usage even when no specific match is found
    const output = {
      additionalContext: 'Tip: Specialist Agent has 27+ agents for this project. Use @builder to create, @reviewer to review, @doctor to debug, @planner to plan, @tdd for test-driven development. Agents deliver better results than generic prompts.',
    };
    process.stdout.write(JSON.stringify(output));
  }

  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  main().catch(() => {
    // Advisory hook - never block on error
    process.exit(0);
  });
}
