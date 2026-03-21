---
name: cro
description: "Use when optimizing landing pages, signup flows, checkout processes, or any user-facing page for higher conversion rates - before A/B testing."
user-invocable: true
argument-hint: "[page path or component]"
allowed-tools: Read, Bash, Glob, Grep
---

# /cro - Conversion Rate Optimization

Audit pages and flows for conversion friction - identifying drop-off points, persuasion gaps, and technical blockers - then produce prioritized recommendations with testable A/B hypotheses.

**Target:** $ARGUMENTS

## When to Use

- Before launching a landing page or signup flow
- When conversion rates are below industry benchmarks
- After redesigning a checkout or onboarding flow
- When bounce rate is high on key pages
- Before running paid traffic to a page
- When `@marketing` Growth mode needs structured CRO analysis
- NOT for: SEO issues (use `/seo-audit`)
- NOT for: general design quality (use `/design-review`)
- NOT for: copy creation (use `/copywriting`)

## Workflow

### Step 1: Page & Flow Analysis

1. **Read the target page/component:**

```bash
# Find the page/component code
find $TARGET -type f \( -name "*.tsx" -o -name "*.vue" -o -name "*.svelte" -o -name "*.astro" \) | head -20
```

2. **Identify the conversion goal:**
   - Signup (form submission)
   - Purchase (checkout completion)
   - Download (file/app download)
   - Contact (form/chat initiation)
   - Engagement (feature activation)

3. **Map the user flow:**
```markdown
## User Flow
[Entry point] → [Step 1] → [Step 2] → ... → [Conversion]

Example:
Landing page → Pricing section → Signup form → Email verification → Dashboard
```

4. **Identify drop-off points** - Where in the flow might users leave?

### Step 2: Friction Audit

Check for conversion killers:

| Friction Type | What to Look For | Impact |
|---------------|------------------|--------|
| Form friction | Too many fields, required fields, no autofill | HIGH |
| Cognitive load | Too many choices, unclear hierarchy, wall of text | HIGH |
| Trust deficit | No social proof, no security badges, unclear pricing | HIGH |
| Speed friction | Slow loading, heavy JS, unoptimized images | HIGH |
| Navigation friction | Can't find CTA, buried below fold, confusing layout | MEDIUM |
| Mobile friction | Small touch targets, horizontal scroll, unreadable text | MEDIUM |
| Copy friction | Unclear value prop, jargon, no urgency | MEDIUM |
| Technical friction | Broken forms, validation errors, payment failures | CRITICAL |

```bash
# Count form fields (friction indicator)
grep -rn "<input\|<select\|<textarea" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | wc -l

# Check for form validation UX
grep -rn "onBlur\|onChange.*validation\|zod\|yup\|formik\|react-hook-form\|vee-validate" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | head -10

# Check for loading/performance issues
grep -rn "useEffect\|onMounted\|onMount" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null | head -10

# Check image optimization
grep -rn "<img\|<Image" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v "next/image\|nuxt-img\|loading=" | head -10
```

### Step 3: Persuasion Checklist (Cialdini's Principles)

Evaluate each persuasion principle:

| Principle | Implementation | Status |
|-----------|---------------|--------|
| **Reciprocity** | Free value before asking (free trial, guide, tool) | [Present/Missing] |
| **Scarcity** | Limited time/quantity indicators (genuine, not fake) | [Present/Missing] |
| **Authority** | Expert endorsements, certifications, press logos | [Present/Missing] |
| **Social Proof** | Testimonials, user count, ratings, case studies | [Present/Missing] |
| **Liking** | Relatable brand voice, user stories, team photos | [Present/Missing] |
| **Commitment** | Micro-conversions (email first, then full signup) | [Present/Missing] |
| **Unity** | Shared identity ("Join 10,000 developers like you") | [Present/Missing] |

```bash
# Check for social proof elements
grep -rn "testimonial\|review\|rating\|customer\|users\|trusted" $TARGET --include="*.tsx" --include="*.vue" --include="*.astro" 2>/dev/null | head -10

# Check for trust signals
grep -rn "secure\|ssl\|encrypted\|guarantee\|money-back\|badge" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | head -10
```

### Step 4: Copy & CTA Audit

| Check | Best Practice |
|-------|---------------|
| Headline clarity | Value proposition clear in <3 seconds |
| Above-the-fold | CTA visible without scrolling |
| CTA text | Action verb + benefit (not "Submit" or "Click here") |
| CTA contrast | Visually distinct from surrounding content |
| Value before form | User understands benefit before filling fields |
| Objection handling | FAQ, guarantees, or trust signals near CTA |
| Urgency | Genuine deadline or limited availability (if applicable) |

```bash
# Check CTA button text
grep -rn "type=\"submit\"\|<button\|<Button" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | head -10

# Check for "Submit" or generic CTA text (anti-pattern)
grep -rn ">Submit<\|>Click here<\|>Send<\|>Go<" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | head -5
```

### Step 5: Technical CRO

Performance directly impacts conversion (every 100ms delay = -1% conversion):

| Check | Impact on Conversion |
|-------|---------------------|
| Page load time | +1s load time = -7% conversion (Google) |
| Mobile responsiveness | 53% abandon if >3s load on mobile |
| Form error recovery | Inline validation saves 22% form abandonment |
| Payment options | Each additional payment method = +5-10% checkout conversion |
| Loading states | Skeleton screens reduce perceived wait time by 30% |

```bash
# Check for skeleton/loading states
grep -rn "skeleton\|Skeleton\|loading\|isLoading\|isPending" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | head -10

# Check for error boundary/handling in forms
grep -rn "error\|Error\|catch\|onError\|isError" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | head -10

# Bundle size indicators
find $TARGET -name "*.tsx" -o -name "*.ts" | xargs wc -l 2>/dev/null | sort -rn | head -10
```

### Step 6: Prioritized Recommendations

For each finding, produce:

```markdown
### Recommendation [N]: [Title]

**Finding:** [What's wrong]
**Impact:** HIGH | MEDIUM | LOW
**Effort:** S (< 2h) | M (2-4h) | L (4-8h)
**Priority:** [Impact/Effort ratio]

**A/B Hypothesis:**
> If we [change], then [metric] will [improve] because [reason].

**Implementation:**
- File: [file:line]
- Change: [specific change]
```

**Prioritize by:** HIGH impact + LOW effort first (quick wins).

## Verification Protocol

**Before claiming the CRO audit is complete:**

1. Conversion goal was explicitly identified
2. User flow was mapped from entry to conversion
3. All 7 friction categories were checked
4. All 7 Cialdini principles were evaluated
5. At least 3 recommendations have A/B hypotheses
6. Recommendations are prioritized by impact/effort ratio
7. Technical CRO checks were performed (performance, form UX)
8. Each recommendation has a specific file:line reference

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Our conversion rate is fine" | Fine compared to what? Industry benchmarks? Last month? Without data, you're guessing. |
| "We need more traffic, not better conversion" | Doubling conversion is cheaper than doubling traffic. Optimize what you have first. |
| "Users will figure it out" | Users won't. They'll leave. Average attention span is 8 seconds. Remove friction or lose them. |
| "We can't change the design" | CRO isn't redesign. Changing CTA text from "Submit" to "Start Free Trial" is a 5-minute code change. |
| "A/B testing is too complex" | You don't need a testing platform to start. Ship Variant B, measure, compare. Manual A/B is still A/B. |
| "Our product is too technical for CRO" | Technical products still need clear value propositions. Complexity in product ≠ complexity in messaging. |
| "We already did CRO" | CRO is continuous. User behavior changes, competitors evolve, pages degrade. Audit quarterly. |

## Rules

1. **Read-only** - Never modify files during a CRO audit
2. **Data-informed** - Base recommendations on research and benchmarks, not opinions
3. **Hypothesis-driven** - Every recommendation needs a testable A/B hypothesis
4. **Quick wins first** - Prioritize high-impact, low-effort changes
5. **One CTA per view** - Never recommend multiple competing CTAs
6. **Genuine urgency only** - Never recommend fake scarcity or countdown timers
7. **Code-grounded** - Every finding must reference specific files and components
8. **Conversion goal explicit** - Never audit without defining what "conversion" means

## Output

```
──── /cro ────
Target: $ARGUMENTS
Conversion Goal: [signup | purchase | download | contact]
User Flow: [entry] → ... → [conversion]

Friction Score: [N]/100 (lower = more friction)
Persuasion Score: [N]/7 principles present

Findings:
  CRITICAL: N
  HIGH: N
  MEDIUM: N
  LOW: N

Top Recommendations:
1. [HIGH/S] [recommendation] → Hypothesis: [if/then]
2. [HIGH/M] [recommendation] → Hypothesis: [if/then]
3. [MEDIUM/S] [recommendation] → Hypothesis: [if/then]

Quick Wins: N (HIGH impact, LOW effort)
Total Recommendations: N

──── CRO audit complete ────
```
