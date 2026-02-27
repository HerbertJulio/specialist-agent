#!/usr/bin/env node

/**
 * Auto-generate social preview SVGs from project stats.
 *
 * Counts agents, skills, and framework packs from the filesystem
 * and writes docs/public/social-preview.svg + social-preview-banner.svg
 * with up-to-date numbers.
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

// Framework metadata — color + display name
const frameworkMeta = {
  vue:     { name: 'Vue 3',     color: '#42b883', textOpacity: 1 },
  react:   { name: 'React',     color: '#61DAFB', textOpacity: 1 },
  nextjs:  { name: 'Next.js',   color: '#CCCCCC', textOpacity: 1, bgOpacity: 0.15 },
  svelte:  { name: 'SvelteKit', color: '#FF3E00', textOpacity: 1 },
  angular: { name: 'Angular',   color: '#DD0031', textOpacity: 1 },
  astro:   { name: 'Astro',     color: '#FF5D01', textOpacity: 1 },
  nuxt:    { name: 'Nuxt',      color: '#00DC82', textOpacity: 1 },
};

const frameworks = packNames
  .filter(p => frameworkMeta[p])
  .map(p => frameworkMeta[p]);

// Stats labels
const stats = [
  { label: `${genericAgents}+ Agents`, width: 110 },
  { label: `${genericSkills} Skills`,  width: 100 },
  { label: 'Lite Mode',               width: 100 },
  { label: `${totalPacks} Packs`,     width: 95 },
];

console.log(`Agents: ${genericAgents} | Skills: ${genericSkills} | Packs: ${totalPacks}`);
console.log(`Frameworks: ${frameworks.map(f => f.name).join(', ')}`);

// ── SVG generators ──

function generateSocialPreview() {
  // OG image: 1280 x 640
  const W = 1280, H = 640;

  // Stats row
  const statsRow = stats.map((s, i) => {
    const totalWidth = stats.reduce((a, b) => a + b.width + 15, -15);
    const startX = -totalWidth / 2;
    let x = startX;
    for (let j = 0; j < i; j++) x += stats[j].width + 15;
    return `
    <rect x="${x}" y="-18" width="${s.width}" height="36" rx="18" fill="#2B5EA7" opacity="0.4"/>
    <text x="${x + s.width / 2}" y="6" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" fill="#8BADD4">${s.label}</text>`;
  }).join('');

  // Frameworks row — dynamic layout
  const fwGap = 12;
  const fwBadgeWidth = 95;
  const fwTotalWidth = frameworks.length * fwBadgeWidth + (frameworks.length - 1) * fwGap;
  const fwStartX = -fwTotalWidth / 2;

  const frameworksRow = frameworks.map((fw, i) => {
    const x = fwStartX + i * (fwBadgeWidth + fwGap);
    const bgOp = fw.bgOpacity || 0.3;
    return `
    <rect x="${x}" y="-18" width="${fwBadgeWidth}" height="36" rx="18" fill="${fw.color}" opacity="${bgOp}"/>
    <text x="${x + fwBadgeWidth / 2}" y="6" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="${fw.color}">${fw.name}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#1E3A5F"/>
    </linearGradient>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#1E3A5F"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E3A5F"/>
      <stop offset="100%" stop-color="#2B5EA7"/>
    </linearGradient>
    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4A7FCF"/>
      <stop offset="100%" stop-color="#CD7F32"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Subtle grid pattern -->
  <g opacity="0.05" stroke="#4A7FCF" stroke-width="1">
    <line x1="0" y1="160" x2="${W}" y2="160"/>
    <line x1="0" y1="320" x2="${W}" y2="320"/>
    <line x1="0" y1="480" x2="${W}" y2="480"/>
    <line x1="320" y1="0" x2="320" y2="${H}"/>
    <line x1="640" y1="0" x2="640" y2="${H}"/>
    <line x1="960" y1="0" x2="960" y2="${H}"/>
  </g>

  <!-- Logo (scaled up) -->
  <g transform="translate(540, 140) scale(5)">
    <path d="M16 26 L2 19 L16 12 L30 19 Z" fill="url(#g1)" opacity="0.9"/>
    <path d="M16 21 L2 14 L16 7 L30 14 Z" fill="url(#g2)" opacity="0.9"/>
    <path d="M16 16 L2 9 L16 2 L30 9 Z" fill="url(#g3)" opacity="0.95"/>
    <path d="M16 2 L2 9 L16 16 Z" fill="#fff" opacity="0.12"/>
  </g>

  <!-- Title -->
  <text x="640" y="420" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="700" fill="#FFFFFF">Specialist Agent</text>

  <!-- Subtitle -->
  <text x="640" y="475" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#8BADD4">AI agents for Claude Code — any framework, any stack</text>

  <!-- Stats row -->
  <g transform="translate(640, 510)">${statsRow}
  </g>

  <!-- Frameworks row -->
  <g transform="translate(640, 560)">${frameworksRow}
  </g>
</svg>
`;
}

function generateBanner() {
  // README banner: 960 x 200
  const W = 960, H = 200;

  // Compact tags — stats + frameworks in one row
  const tags = [
    ...stats.map(s => ({ label: s.label, color: '#2B5EA7', textColor: '#8BADD4', bgOpacity: 0.4 })),
    ...frameworks.map(fw => ({ label: fw.name, color: fw.color, textColor: fw.color, bgOpacity: fw.bgOpacity || 0.3 })),
  ];

  const tagGap = 8;
  const tagPadding = 20;
  // Estimate tag widths from label length
  const tagWidths = tags.map(t => Math.max(60, t.label.length * 7.5 + tagPadding));

  let tagsSvg = '';
  let x = 0;
  for (let i = 0; i < tags.length; i++) {
    const w = tagWidths[i];
    tagsSvg += `
    <rect x="${x}" y="-14" width="${w}" height="28" rx="14" fill="${tags[i].color}" opacity="${tags[i].bgOpacity}"/>
    <text x="${x + w / 2}" y="4" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="${tags[i].textColor}">${tags[i].label}</text>`;
    x += w + tagGap;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#1E3A5F"/>
    </linearGradient>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#1E3A5F"/>
    </linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E3A5F"/>
      <stop offset="100%" stop-color="#2B5EA7"/>
    </linearGradient>
    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4A7FCF"/>
      <stop offset="100%" stop-color="#CD7F32"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" rx="12" fill="url(#bg)"/>

  <!-- Subtle grid -->
  <g opacity="0.04" stroke="#4A7FCF" stroke-width="1">
    <line x1="0" y1="100" x2="${W}" y2="100"/>
    <line x1="240" y1="0" x2="240" y2="${H}"/>
    <line x1="480" y1="0" x2="480" y2="${H}"/>
    <line x1="720" y1="0" x2="720" y2="${H}"/>
  </g>

  <!-- Logo (left side) -->
  <g transform="translate(60, 58) scale(2.6)">
    <path d="M16 26 L2 19 L16 12 L30 19 Z" fill="url(#g1)" opacity="0.9"/>
    <path d="M16 21 L2 14 L16 7 L30 14 Z" fill="url(#g2)" opacity="0.9"/>
    <path d="M16 16 L2 9 L16 2 L30 9 Z" fill="url(#g3)" opacity="0.95"/>
    <path d="M16 2 L2 9 L16 16 Z" fill="#fff" opacity="0.12"/>
  </g>

  <!-- Title -->
  <text x="180" y="82" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="700" fill="#FFFFFF">Specialist Agent</text>

  <!-- Subtitle -->
  <text x="180" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="17" fill="#8BADD4">AI agents for Claude Code — any framework, any stack</text>

  <!-- Tags -->
  <g transform="translate(180, 148)">${tagsSvg}
  </g>
</svg>
`;
}

// ── Write files ──

fs.writeFileSync(path.join(OUT_DIR, 'social-preview.svg'), generateSocialPreview().trimStart());
fs.writeFileSync(path.join(OUT_DIR, 'social-preview-banner.svg'), generateBanner().trimStart());

console.log(`\nGenerated:`);
console.log(`  docs/public/social-preview.svg (OG image 1280x640)`);
console.log(`  docs/public/social-preview-banner.svg (README banner 960x200)`);
