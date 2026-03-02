#!/usr/bin/env node

/**
 * Auto-generate social preview SVGs from project stats.
 *
 * Counts agents, skills, and framework packs from the filesystem
 * and writes platform-optimized social images to docs/public/:
 *
 *   social-preview.svg         - OG/Facebook/LinkedIn (1200x630)
 *   social-preview-twitter.svg - Twitter card (1200x600)
 *   social-preview-square.svg  - WhatsApp/Telegram (1200x1200)
 *   social-preview-banner.svg  - README banner (960x200)
 *
 * Usage:
 *   node scripts/generate-social-preview.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'public');

// ── Count helpers ──

function countMdFiles(dir, excludeLite = false) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && (!excludeLite || !f.includes('-lite')))
    .length;
}

function countSkillDirs(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(dir, d.name, 'SKILL.md')))
    .length;
}

// ── Collect stats ──

const genericAgents = countMdFiles(path.join(ROOT, 'agents'), true);
const genericSkills = countSkillDirs(path.join(ROOT, 'skills'));

const packsDir = path.join(ROOT, 'packs');
const packNames = fs.existsSync(packsDir)
  ? fs.readdirSync(packsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && fs.existsSync(path.join(packsDir, d.name, 'CLAUDE.md')))
      .map(d => d.name)
  : [];

const totalPacks = packNames.length;

// Framework metadata - color + display name
const frameworkMeta = {
  vue:     { name: 'Vue 3',     color: '#42b883' },
  react:   { name: 'React',     color: '#61DAFB' },
  nextjs:  { name: 'Next.js',   color: '#CCCCCC', bgOpacity: 0.15 },
  svelte:  { name: 'SvelteKit', color: '#FF3E00' },
  angular: { name: 'Angular',   color: '#DD0031' },
  astro:   { name: 'Astro',     color: '#FF5D01' },
  nuxt:    { name: 'Nuxt',      color: '#00DC82' },
};

const frameworks = packNames
  .filter(p => frameworkMeta[p])
  .map(p => frameworkMeta[p]);

// Platform badges
const platforms = [
  { name: 'Claude Code', color: '#D97706' },
  { name: 'Cursor',      color: '#00B4D8' },
  { name: 'VS Code',     color: '#007ACC' },
  { name: 'Windsurf',    color: '#06D6A0' },
  { name: 'Codex',       color: '#EF476F' },
  { name: 'OpenCode',    color: '#FFD166' },
];

// Stats
const stats = [
  { label: `${genericAgents}+ Agents`, width: 120 },
  { label: `${genericSkills} Skills`,  width: 110 },
  { label: 'Lite Mode',               width: 110 },
  { label: `${totalPacks} Packs`,     width: 100 },
];

console.log(`Agents: ${genericAgents} | Skills: ${genericSkills} | Packs: ${totalPacks}`);
console.log(`Frameworks: ${frameworks.map(f => f.name).join(', ')}`);

// ── Shared SVG helpers ──

function defs(idSuffix = '') {
  const s = idSuffix;
  return `
  <defs>
    <linearGradient id="bg${s}" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#0B1929"/>
      <stop offset="50%" stop-color="#0F2340"/>
      <stop offset="100%" stop-color="#162D50"/>
    </linearGradient>
    <linearGradient id="g1${s}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#1E3A5F"/>
    </linearGradient>
    <linearGradient id="g2${s}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E3A5F"/>
      <stop offset="100%" stop-color="#2B5EA7"/>
    </linearGradient>
    <linearGradient id="g3${s}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4A7FCF"/>
      <stop offset="100%" stop-color="#CD7F32"/>
    </linearGradient>
    <linearGradient id="shine${s}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow${s}" cx="50%" cy="35%" r="40%">
      <stop offset="0%" stop-color="#2B5EA7" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#0A1628" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow${s}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>`;
}

function logo(translateX, translateY, scale) {
  return `
  <g transform="translate(${translateX}, ${translateY}) scale(${scale})" filter="url(#shadow)">
    <path d="M16 26 L2 19 L16 12 L30 19 Z" fill="url(#g1)" opacity="0.9"/>
    <path d="M16 21 L2 14 L16 7 L30 14 Z" fill="url(#g2)" opacity="0.9"/>
    <path d="M16 16 L2 9 L16 2 L30 9 Z" fill="url(#g3)" opacity="0.95"/>
    <path d="M16 2 L2 9 L16 16 Z" fill="#fff" opacity="0.15"/>
  </g>`;
}

function decorativeNodes(W, H) {
  // Subtle floating dots/nodes for tech feel
  const nodes = [];
  const positions = [
    [0.08, 0.15], [0.92, 0.12], [0.05, 0.85], [0.95, 0.8],
    [0.15, 0.45], [0.88, 0.55], [0.03, 0.55], [0.97, 0.35],
    [0.12, 0.75], [0.85, 0.25],
  ];
  for (const [px, py] of positions) {
    const x = Math.round(px * W);
    const y = Math.round(py * H);
    const r = 1.5 + Math.random() * 1.5;
    nodes.push(`<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#4A7FCF" opacity="0.15"/>`);
  }
  // Connecting lines (very subtle)
  const lines = [
    [positions[0], positions[4]], [positions[1], positions[5]],
    [positions[2], positions[8]], [positions[3], positions[9]],
  ];
  for (const [a, b] of lines) {
    nodes.push(`<line x1="${Math.round(a[0]*W)}" y1="${Math.round(a[1]*H)}" x2="${Math.round(b[0]*W)}" y2="${Math.round(b[1]*H)}" stroke="#4A7FCF" stroke-width="0.5" opacity="0.06"/>`);
  }
  return `\n  <g>${nodes.join('\n    ')}\n  </g>`;
}

function renderStatsRow(centerX, y, scale = 1) {
  const gap = 12 * scale;
  const items = stats.map(s => ({ ...s, width: s.width * scale }));
  const totalWidth = items.reduce((a, b) => a + b.width + gap, -gap);
  const startX = centerX - totalWidth / 2;
  let x = startX;

  return items.map(s => {
    const h = 32 * scale;
    const r = h / 2;
    const svg = `
    <rect x="${x}" y="${y - h/2}" width="${s.width}" height="${h}" rx="${r}" fill="#1E3A5F" stroke="#2B5EA7" stroke-width="1" opacity="0.6"/>
    <text x="${x + s.width / 2}" y="${y + 5 * scale}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${14 * scale}" font-weight="500" fill="#A8C8E8">${s.label}</text>`;
    x += s.width + gap;
    return svg;
  }).join('');
}

function renderFrameworksRow(centerX, y, scale = 1) {
  const gap = 10 * scale;
  const badgeW = 90 * scale;
  const totalWidth = frameworks.length * badgeW + (frameworks.length - 1) * gap;
  const startX = centerX - totalWidth / 2;

  return frameworks.map((fw, i) => {
    const x = startX + i * (badgeW + gap);
    const h = 30 * scale;
    const r = h / 2;
    const bgOp = fw.bgOpacity || 0.2;
    return `
    <rect x="${x}" y="${y - h/2}" width="${badgeW}" height="${h}" rx="${r}" fill="${fw.color}" opacity="${bgOp}" stroke="${fw.color}" stroke-width="0.5" stroke-opacity="0.3"/>
    <text x="${x + badgeW / 2}" y="${y + 5 * scale}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${13 * scale}" font-weight="500" fill="${fw.color}">${fw.name}</text>`;
  }).join('');
}

function renderPlatformsRow(centerX, y, scale = 1) {
  const gap = 10 * scale;
  const items = platforms.map(p => ({ ...p, width: Math.max(80, p.name.length * 9 + 20) * scale }));
  const totalWidth = items.reduce((a, b) => a + b.width + gap, -gap);
  const startX = centerX - totalWidth / 2;
  let x = startX;

  return items.map(p => {
    const h = 28 * scale;
    const r = h / 2;
    const svg = `
    <rect x="${x}" y="${y - h/2}" width="${p.width}" height="${h}" rx="${r}" fill="${p.color}" opacity="0.12" stroke="${p.color}" stroke-width="0.5" stroke-opacity="0.25"/>
    <text x="${x + p.width / 2}" y="${y + 4.5 * scale}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${12 * scale}" font-weight="500" fill="${p.color}" opacity="0.9">${p.name}</text>`;
    x += p.width + gap;
    return svg;
  }).join('');
}

// ── SVG generators ──

function generateOG() {
  // Facebook/LinkedIn: 1200 x 630
  const W = 1200, H = 630;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs()}

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Top shine -->
  <rect width="${W}" height="1" fill="url(#shine)" y="0"/>

  ${decorativeNodes(W, H)}

  ${logo(505, 100, 5)}

  <!-- Title -->
  <text x="${W/2}" y="375" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="60" font-weight="700" fill="#FFFFFF" letter-spacing="-1">Specialist Agent</text>

  <!-- Subtitle -->
  <text x="${W/2}" y="420" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#7BA3CC">Your AI development team - any framework, any stack</text>

  <!-- Stats row -->
  <g>${renderStatsRow(W/2, 470)}
  </g>

  <!-- Frameworks row -->
  <g>${renderFrameworksRow(W/2, 520)}
  </g>

  <!-- URL -->
  <text x="${W/2}" y="${H - 25}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#4A6A8A" letter-spacing="2">specialistagent.com.br</text>

  <!-- Bottom accent line -->
  <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#g3)" opacity="0.6"/>
</svg>
`;
}

function generateTwitter() {
  // Twitter: 1200 x 600
  const W = 1200, H = 600;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs('t')}

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgt)"/>
  <rect width="${W}" height="${H}" fill="url(#glowt)"/>

  ${decorativeNodes(W, H)}

  ${logo(505, 80, 4.5).replace(/url\(#(g\d|shadow)\)/g, 'url(#$1t)')}

  <!-- Title -->
  <text x="${W/2}" y="335" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="700" fill="#FFFFFF" letter-spacing="-1">Specialist Agent</text>

  <!-- Subtitle -->
  <text x="${W/2}" y="378" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="21" fill="#7BA3CC">Your AI development team - any framework, any stack</text>

  <!-- Stats row -->
  <g>${renderStatsRow(W/2, 425)}
  </g>

  <!-- Frameworks row -->
  <g>${renderFrameworksRow(W/2, 475)}
  </g>

  <!-- Platforms row -->
  <g>${renderPlatformsRow(W/2, 525)}
  </g>

  <!-- Bottom accent line -->
  <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#g3t)" opacity="0.6"/>
</svg>
`;
}

function generateSquare() {
  // WhatsApp/Telegram: 1200 x 1200 - clean: logo + name + tagline
  const W = 1200, H = 1200;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs('s')}

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgs)"/>
  <rect width="${W}" height="${H}" fill="url(#glows)"/>

  ${decorativeNodes(W, H)}

  <!-- Logo (large, centered) -->
  ${logo(380, 250, 12).replace(/url\(#(g\d|shadow)\)/g, 'url(#$1s)')}

  <!-- Title -->
  <text x="${W/2}" y="700" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="84" font-weight="700" fill="#FFFFFF" letter-spacing="-1">Specialist Agent</text>

  <!-- Tagline -->
  <text x="${W/2}" y="770" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="32" fill="#7BA3CC">Your AI development team</text>

  <!-- URL -->
  <text x="${W/2}" y="${H - 80}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#4A6A8A" letter-spacing="3">specialistagent.com.br</text>

  <!-- Bottom accent line -->
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="url(#g3s)" opacity="0.6"/>
</svg>
`;
}

function generateBanner() {
  // README banner: 960 x 200 - clean: logo + name + tagline
  const W = 960, H = 200;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs('b')}

  <!-- Background -->
  <rect width="${W}" height="${H}" rx="12" fill="url(#bgb)"/>
  <rect width="${W}" height="${H}" rx="12" fill="url(#glowb)"/>

  <!-- Logo -->
  ${logo(60, 48, 2.6).replace(/url\(#(g\d|shadow)\)/g, 'url(#$1b)')}

  <!-- Title -->
  <text x="180" y="82" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="700" fill="#FFFFFF" letter-spacing="-0.5">Specialist Agent</text>

  <!-- Tagline -->
  <text x="180" y="120" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#7BA3CC">Your AI development team - any framework, any stack</text>

  <!-- URL -->
  <text x="180" y="160" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#4A6A8A" letter-spacing="2">specialistagent.com.br</text>

  <!-- Right side accent -->
  <rect x="${W - 3}" y="0" width="3" height="${H}" rx="0" fill="url(#g3b)" opacity="0.4"/>
</svg>
`;
}

// ── Write files ──

fs.writeFileSync(path.join(OUT_DIR, 'social-preview.svg'), generateOG().trimStart());
fs.writeFileSync(path.join(OUT_DIR, 'social-preview-twitter.svg'), generateTwitter().trimStart());
fs.writeFileSync(path.join(OUT_DIR, 'social-preview-square.svg'), generateSquare().trimStart());
fs.writeFileSync(path.join(OUT_DIR, 'social-preview-banner.svg'), generateBanner().trimStart());

console.log(`\nGenerated:`);
console.log(`  docs/public/social-preview.svg         (OG/Facebook/LinkedIn 1200x630)`);
console.log(`  docs/public/social-preview-twitter.svg  (Twitter card 1200x600)`);
console.log(`  docs/public/social-preview-square.svg   (WhatsApp/Telegram 1200x1200)`);
console.log(`  docs/public/social-preview-banner.svg   (README banner 960x200)`);
