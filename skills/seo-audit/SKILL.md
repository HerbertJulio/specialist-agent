---
name: seo-audit
description: "Use when auditing a website or web application for SEO issues - covering meta tags, structured data, content structure, Core Web Vitals indicators, and crawlability."
user-invocable: true
argument-hint: "[path or URL]"
allowed-tools: Read, Bash, Glob, Grep
---

# /seo-audit - SEO Technical Audit

Audit web application source code for SEO issues - meta tags, structured data, content structure, Core Web Vitals indicators, and crawlability - producing a scored report with actionable fixes.

**Target:** $ARGUMENTS

## When to Use

- Before launching a new website or landing page
- After major frontend refactors that may have broken SEO
- When organic search traffic has dropped
- During framework migration (SSR/SSG changes)
- When adding i18n and need hreflang setup
- Before a marketing campaign that depends on organic traffic
- NOT for: content strategy or keyword research (use `@marketing` SEO mode)
- NOT for: design or UX issues (use `/design-review`)
- NOT for: pure performance optimization (use `@perf`)

## Workflow

### Step 1: Scope & Rendering Strategy Detection

1. **Identify pages/routes to audit:**

```bash
# Find page/route files
find $TARGET -path "*/pages/*" -o -path "*/app/*" -o -path "*/routes/*" | grep -E "\.(tsx?|vue|svelte|astro)$" | grep -v "_\|layout\|error\|loading" | head -30
```

2. **Detect rendering strategy:**

```bash
# Check for SSR/SSG configuration
grep -rn "getStaticProps\|getServerSideProps\|generateStaticParams\|getStaticPaths" $TARGET --include="*.ts" --include="*.tsx" 2>/dev/null | head -10
grep -rn "defineNuxtConfig\|ssr:\|prerender" $TARGET --include="*.ts" --include="*.config.*" 2>/dev/null | head -5
grep -rn "export const prerender\|export const ssr" $TARGET --include="*.ts" --include="*.svelte" 2>/dev/null | head -5
```

3. **Classify:** SSR (server-rendered), SSG (static), CSR (client-only), ISR (incremental), Hybrid

**Output:**
```markdown
## Scope
- Pages: [N] routes detected
- Framework: [Next.js/Nuxt/SvelteKit/Astro/other]
- Rendering: [SSR/SSG/CSR/ISR/Hybrid]
- i18n: [detected/not detected]
```

### Step 2: Technical SEO Audit

Check meta tags and structured data for each page:

| Check | What to Look For | Impact |
|-------|------------------|--------|
| Title tag | Unique, 50-60 chars, keyword-rich | HIGH |
| Meta description | Unique, 150-160 chars, compelling | HIGH |
| Open Graph tags | og:title, og:description, og:image, og:url | MEDIUM |
| Twitter cards | twitter:card, twitter:title, twitter:image | MEDIUM |
| Canonical URL | Self-referencing canonical on every page | HIGH |
| Robots meta | Proper noindex/nofollow where needed | HIGH |
| Structured data | JSON-LD for relevant schema types | MEDIUM |
| Hreflang | Present if multi-language | HIGH (if i18n) |
| Favicon | Present and proper size | LOW |

```bash
# Check for meta tag implementation
grep -rn "title\|meta.*description\|og:title\|twitter:card" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" --include="*.astro" 2>/dev/null | head -20

# Check for Head/Meta components (framework-specific)
grep -rn "Head>\|useHead\|useSeoMeta\|<svelte:head\|Astro.props" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" --include="*.astro" 2>/dev/null | head -15

# Check for JSON-LD structured data
grep -rn "application/ld+json\|structuredData\|jsonLd" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null | head -10
```

### Step 3: Content Structure Audit

| Check | Criteria | Severity |
|-------|----------|----------|
| H1 tag | Exactly one H1 per page | HIGH |
| Heading hierarchy | Logical H1 → H2 → H3, no skipped levels | MEDIUM |
| Alt text | All images have descriptive alt text | HIGH |
| Internal links | Meaningful anchor text, no "click here" | MEDIUM |
| Content length | Adequate content for the page type | LOW |
| Semantic HTML | Proper use of `<article>`, `<nav>`, `<main>`, `<section>` | MEDIUM |

```bash
# Check heading usage
grep -rn "<h1\|<h2\|<h3\|<H1\|<H2\|<H3" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null | head -20

# Check for missing alt text
grep -rn "<img\|<Image" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null | grep -v "alt=" | head -10

# Check semantic HTML usage
grep -rn "<article\|<section\|<nav\|<main\|<aside\|<header\|<footer" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null | wc -l
```

### Step 4: Performance & Core Web Vitals Indicators

Check code-level indicators that affect CWV:

| Check | CWV Metric | What to Look For |
|-------|-----------|------------------|
| Image optimization | LCP | next/image, lazy loading, srcset, WebP/AVIF |
| Font loading | CLS | display:swap, font preloading, system font fallback |
| JS bundle size | FID/INP | Dynamic imports, code splitting, tree shaking |
| CSS loading | CLS | Critical CSS inline, non-blocking stylesheet loading |
| Layout shifts | CLS | Explicit width/height on images, skeleton screens |
| Third-party scripts | FID/INP | Deferred/async loading, script placement |

```bash
# Image optimization
grep -rn "<img\|<Image" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v "loading=\|lazy\|next/image\|nuxt-img" | head -10

# Font loading strategy
grep -rn "font-display\|@font-face\|display.*swap" $TARGET --include="*.css" --include="*.tsx" 2>/dev/null | head -5

# Dynamic imports (code splitting)
grep -rn "dynamic(\|lazy(\|import(" $TARGET --include="*.tsx" --include="*.vue" --include="*.ts" 2>/dev/null | grep -v "node_modules" | head -10

# Third-party scripts
grep -rn "<script.*src=\|<Script" $TARGET --include="*.tsx" --include="*.vue" --include="*.html" 2>/dev/null | head -10
```

### Step 5: Crawlability Audit

| Check | What to Look For |
|-------|------------------|
| robots.txt | Exists, allows critical paths, blocks /api and admin |
| Sitemap | sitemap.xml exists and includes all public routes |
| 404 page | Custom 404 with navigation, proper status code |
| Redirects | No redirect chains (>2 hops), 301 for permanent |
| URL structure | Clean, descriptive slugs, no query params for content |
| SPA concerns | Prerendering for CSR apps, proper hydration |
| Dynamic routes | Meta tags set per-route, not hardcoded |

```bash
# Check for robots.txt
find . -name "robots.txt" -not -path "*/node_modules/*" 2>/dev/null

# Check for sitemap
find . -name "sitemap*" -not -path "*/node_modules/*" 2>/dev/null
grep -rn "sitemap" $TARGET --include="*.ts" --include="*.config.*" 2>/dev/null | head -5

# Check for 404 page
find $TARGET -name "404*" -o -name "not-found*" -o -name "\[...slug\]*" 2>/dev/null | head -5

# Check for redirect configuration
grep -rn "redirect\|rewrite" $TARGET --include="*.config.*" --include="*.ts" 2>/dev/null | head -10
```

### Step 6: Scoring & Report

Score each category 0-100:

| Score Range | Rating |
|-------------|--------|
| 90-100 | Excellent |
| 70-89 | Good |
| 50-69 | Needs Work |
| 0-49 | Critical |

**Scoring formula per category:**
- Start at 100
- CRITICAL finding: -25 points
- HIGH finding: -15 points
- MEDIUM finding: -10 points
- LOW finding: -5 points
- Minimum: 0

## Verification Protocol

**Before claiming the audit is complete:**

1. All 5 audit dimensions were checked (technical SEO, content, CWV, crawlability, rendering)
2. Every finding has severity level and file:line reference
3. Rendering strategy was correctly identified and audit was adapted to it
4. Framework-specific meta patterns were checked (not just raw HTML)
5. At least 3 pages/routes were individually scanned
6. Scores were calculated with the formula above

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "SEO doesn't matter for our app" | Even SaaS apps need landing pages that rank. SEO drives organic acquisition at zero marginal cost. |
| "We'll add meta tags later" | Missing meta tags from day 1 means lost indexing time. Search engines need weeks to crawl and rank. |
| "It's a SPA, SEO doesn't apply" | SPAs need SSR/SSG for SEO. If Google can't render it, it doesn't exist in search results. |
| "Our content is good enough" | Good content with bad technical SEO is invisible. Fix the plumbing so the content can flow. |
| "The framework handles SEO" | Frameworks provide tools, not configuration. You still need proper meta, structured data, and sitemap. |
| "We don't need structured data" | Rich snippets increase CTR by 20-40%. Structured data is free visibility in search results. |
| "We'll do SEO after launch" | Retrofitting SEO is 3-5x more expensive than building it in. Especially for routing and rendering changes. |

## Rules

1. **Read-only** - Never modify files during an audit
2. **Framework-aware** - Check framework-specific meta patterns, not just raw HTML
3. **Rendering-aware** - Adapt checks to SSR/SSG/CSR strategy
4. **Score every category** - Use the scoring formula consistently
5. **Evidence required** - Every finding needs a file:line reference
6. **Prioritize by impact** - CRITICAL findings first, always
7. **No vanity metrics** - Focus on technical SEO, not keyword density or word count

## Output

```
──── /seo-audit ────
Target: $ARGUMENTS
Framework: [detected]
Rendering: [SSR/SSG/CSR/Hybrid]
Pages scanned: [N]

Technical SEO:  [score]/100 - [N findings]
Content:        [score]/100 - [N findings]
Performance:    [score]/100 - [N findings]
Crawlability:   [score]/100 - [N findings]

Severity:
  CRITICAL: N
  HIGH: N
  MEDIUM: N
  LOW: N

Top Findings:
1. [CRITICAL] [description] - [file:line]
2. [HIGH] [description] - [file:line]
3. [HIGH] [description] - [file:line]

Overall SEO Score: [N]/100
Rating: [Excellent | Good | Needs Work | Critical]
```
