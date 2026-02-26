#!/usr/bin/env node

/**
 * After Review Hook
 *
 * Runs after @reviewer completes a code review.
 *
 * Actions:
 * - Records review results in metrics
 * - Logs review summary
 * - Tracks violations and trends
 * - Suggests next actions
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

const SESSION_FILE = '.claude/metrics/current-session.json';
const REVIEWS_DIR = '.claude/metrics/reviews';

// Review data passed via environment or args
const reviewData = {
  scope: process.env.REVIEW_SCOPE || process.argv[2] || 'unknown',
  verdict: process.env.REVIEW_VERDICT || process.argv[3] || 'unknown',
  violations: parseInt(process.env.REVIEW_VIOLATIONS || process.argv[4] || '0', 10),
  warnings: parseInt(process.env.REVIEW_WARNINGS || process.argv[5] || '0', 10),
  highlights: parseInt(process.env.REVIEW_HIGHLIGHTS || process.argv[6] || '0', 10),
  agent: '@reviewer',
  timestamp: new Date().toISOString()
};

async function main() {
  console.log(`\n──── Review Complete: ${reviewData.scope} ────`);

  // 1. Log review summary
  logSummary();

  // 2. Update session metrics
  updateSessionMetrics();

  // 3. Save review record
  saveReviewRecord();

  // 4. Suggest next actions
  suggestNextActions();
}

function logSummary() {
  const verdictIcon = {
    approved: '✓ Approved',
    caveats: '⚠ Approved with Caveats',
    rejected: '✗ Requires Changes',
    unknown: '? Unknown'
  };

  console.log(`Verdict: ${verdictIcon[reviewData.verdict] || verdictIcon.unknown}`);

  if (reviewData.violations > 0) {
    console.log(`Violations: ${reviewData.violations}`);
  }
  if (reviewData.warnings > 0) {
    console.log(`Warnings: ${reviewData.warnings}`);
  }
  if (reviewData.highlights > 0) {
    console.log(`Highlights: ${reviewData.highlights}`);
  }

  // Quality score (simple heuristic)
  const score = Math.max(0, 100 - (reviewData.violations * 15) - (reviewData.warnings * 5));
  console.log(`Quality score: ${score}/100`);
}

function updateSessionMetrics() {
  if (!existsSync(SESSION_FILE)) {
    return;
  }

  try {
    const session = JSON.parse(readFileSync(SESSION_FILE, 'utf-8'));

    if (!session.reviews) {
      session.reviews = [];
    }

    session.reviews.push({
      scope: reviewData.scope,
      verdict: reviewData.verdict,
      violations: reviewData.violations,
      warnings: reviewData.warnings,
      highlights: reviewData.highlights,
      timestamp: reviewData.timestamp
    });

    writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
    console.log('\n✓ Metrics updated');
  } catch (err) {
    console.log(`ℹ Could not update metrics: ${err.message}`);
  }
}

function saveReviewRecord() {
  try {
    mkdirSync(REVIEWS_DIR, { recursive: true });

    const date = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `${REVIEWS_DIR}/review-${date}.json`;

    writeFileSync(filename, JSON.stringify(reviewData, null, 2));
  } catch {
    // Non-critical, ignore
  }
}

function suggestNextActions() {
  console.log('\n──── Suggested Actions ────');

  if (reviewData.verdict === 'rejected' || reviewData.violations > 0) {
    console.log('  1. Fix violations listed in the review');
    console.log('  2. Run /checkpoint create before-fixes');
    console.log('  3. Re-run @reviewer after fixes');
  } else if (reviewData.verdict === 'caveats') {
    console.log('  1. Address warnings if time permits');
    console.log('  2. Proceed with merge (caveats are non-blocking)');
  } else {
    console.log('  1. Ready to merge');
    console.log('  2. Run /finish to finalize branch');
  }
}

// Run
main().catch(console.error);
