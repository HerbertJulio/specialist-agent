---
name: copywriting
description: "Use when creating marketing copy for landing pages, email campaigns, product descriptions, or social media - with A/B variants and conversion-focused frameworks."
user-invocable: true
argument-hint: "[product/feature and target audience]"
allowed-tools: Read, Write, Edit, Glob, Grep
---

# /copywriting - Conversion-Focused Marketing Copy

Generate marketing copy using proven copywriting frameworks, with A/B variants and compliance checks - bridging the gap between product features and user motivation.

**Target:** $ARGUMENTS

## When to Use

- Writing landing page copy (hero, features, CTA, testimonials)
- Creating email marketing sequences (welcome, onboarding, re-engagement)
- Writing product descriptions for e-commerce or SaaS
- Generating social media content (posts, threads, ads)
- Crafting ad creative copy (Google Ads, Meta Ads)
- When `@marketing` Copy mode needs a structured output
- NOT for: SEO technical optimization (use `/seo-audit`)
- NOT for: content strategy or keyword research (use `@marketing` SEO mode)
- NOT for: copyediting existing content (use a proofreading tool)

## Workflow

### Step 1: Brief Capture

1. **Identify the product/feature** from $ARGUMENTS
2. **Scan existing copy** in the codebase:

```bash
# Find existing marketing copy, landing pages, meta descriptions
grep -rl "hero\|landing\|cta\|pricing\|testimonial" $TARGET --include="*.tsx" --include="*.vue" --include="*.astro" --include="*.mdx" 2>/dev/null | head -10
```

3. **Define the brief:**

```markdown
## Brief

**Product/Feature:** [what we're writing about]
**Target Audience:** [who reads this copy]
**Channel:** [landing page | email | social | ad | product description]
**Tone of Voice:** [professional | casual | bold | friendly | authoritative]
**Key Differentiators:** [what makes this unique]
**CTA Goal:** [signup | purchase | download | contact | share]
**Constraints:** [character limits, brand guidelines, compliance needs]
```

**BLOCKED** until brief is complete. Ask the user for missing fields.

### Step 2: Framework Selection

Select the copywriting framework based on channel:

| Channel | Primary Framework | Alternative |
|---------|------------------|-------------|
| Landing page (hero) | PAS (Problem-Agitate-Solution) | AIDA (Attention-Interest-Desire-Action) |
| Landing page (features) | FAB (Features-Advantages-Benefits) | Before/After/Bridge |
| Email sequence | BAB (Before-After-Bridge) | 4Ps (Promise-Picture-Proof-Push) |
| Social media | Hook-Story-Offer | PAS (condensed) |
| Ad creative | Headline formulas | AIDA (condensed) |
| Product description | FAB | Problem-Solution |

**Framework Definitions:**

- **PAS:** Identify the Problem → Agitate the pain → Present the Solution
- **AIDA:** Grab Attention → Build Interest → Create Desire → Call to Action
- **BAB:** Paint the Before (current pain) → Show the After (desired state) → Bridge (your product)
- **FAB:** Feature (what it does) → Advantage (why it matters) → Benefit (what user gains)
- **4Ps:** Promise (hook) → Picture (visualize success) → Proof (evidence) → Push (CTA)
- **Hook-Story-Offer:** Hook (stop scrolling) → Story (relatable narrative) → Offer (clear CTA)

### Step 3: Copy Generation

1. **Apply the selected framework** to write primary copy
2. **Include all required elements** for the channel:

**Landing Page Elements:**
- Headline (max 10 words, clear value proposition)
- Subheadline (expand on headline, 15-25 words)
- Hero body (2-3 sentences, pain → solution → benefit)
- Feature blocks (3-5 features with FAB format)
- Social proof placement (testimonials, logos, stats)
- CTA button text (action verb + benefit, max 5 words)
- Objection handlers (FAQ or trust signals)

**Email Elements:**
- Subject line (max 50 chars, curiosity or benefit)
- Preview text (max 90 chars, complement subject)
- Body (framework-structured, single CTA)
- PS line (urgency or bonus)

**Social Media Elements:**
- Hook (first line that stops scrolling)
- Body (value or story, framework-structured)
- CTA (clear next step)
- Hashtags (3-5 relevant)

### Step 4: A/B Variant Generation

For each key element, generate 2-3 variants with rationale:

```markdown
## A/B Variants

### Headlines
| Variant | Copy | Strategy |
|---------|------|----------|
| A (control) | "[headline]" | Benefit-focused, direct |
| B | "[headline]" | Curiosity-driven, question |
| C | "[headline]" | Social proof, authority |

### CTAs
| Variant | Copy | Strategy |
|---------|------|----------|
| A (control) | "[CTA text]" | Action + benefit |
| B | "[CTA text]" | Urgency + action |

### Subject Lines (if email)
| Variant | Copy | Strategy |
|---------|------|----------|
| A | "[subject]" | Benefit-focused |
| B | "[subject]" | Curiosity gap |
| C | "[subject]" | Personalized |
```

### Step 5: Compliance Check

| Check | Description |
|-------|-------------|
| No unsubstantiated claims | Avoid "best", "#1", "guaranteed" without proof |
| CAN-SPAM compliance | Email includes unsubscribe, physical address (note to implement) |
| FTC testimonial guidelines | Testimonials must be genuine, disclose material connections |
| Accessibility | Alt text for images, readable font sizes, color contrast |
| Brand consistency | Tone matches existing copy in codebase |
| Legal disclaimers | Financial, health claims need disclaimers |

### Step 6: Output Document

Write the final copy document:

```markdown
## Copy Deck: [Product/Feature]

### Channel: [landing page | email | social | ad]
### Framework: [PAS | AIDA | BAB | FAB | 4Ps | Hook-Story-Offer]

[Structured copy with all elements]

### A/B Variants
[Variant tables]

### Implementation Notes
- [File paths where copy should be placed]
- [Component names to update]
- [i18n keys if applicable]
```

## Verification Protocol

**Before claiming the copy is complete:**

1. Brief was completed with all required fields
2. Appropriate framework was selected for the channel
3. All required elements for the channel are present
4. At least 2 A/B variants exist for headline and CTA
5. Compliance check was performed
6. Existing copy in codebase was read for tone consistency
7. Copy is implementation-ready with file paths or component references
8. No unsubstantiated superlative claims

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Good copy writes itself" | Good copy follows frameworks refined over decades. Intuition produces mediocre copy. |
| "We don't need A/B variants" | You can't predict what converts. Testing headlines alone can improve conversion 20-50%. |
| "The product sells itself" | No product sells itself. Users need to understand value before they buy. That's copy's job. |
| "Long copy doesn't convert" | Long copy outsells short copy when the reader is problem-aware. Match length to awareness level. |
| "We'll optimize copy later" | Launch copy sets the baseline. Bad copy means bad data. Start with framework-driven copy. |
| "Compliance doesn't apply to us" | FTC and CAN-SPAM apply to everyone. One "guaranteed" claim without proof is a legal risk. |
| "Just use what competitors write" | Competitor copy might not convert either. Use proven frameworks, test your own message. |

## Rules

1. **Framework first** - Never write copy without selecting a framework
2. **Brief before writing** - No copy without a complete brief
3. **Benefits over features** - Users care about outcomes, not specifications
4. **One CTA per context** - Each page section or email has ONE clear call to action
5. **Scan existing copy** - Read the codebase for tone, terminology, and brand voice before writing
6. **Variants are mandatory** - At least 2 headline variants and 2 CTA variants
7. **Implementation-ready** - Include file paths or component references, not just raw text
8. **No fluff** - Every sentence must earn its place. Cut filler words ruthlessly.

## Output

```
──── /copywriting ────
Product: [product/feature]
Channel: [landing page | email | social | ad]
Framework: [PAS | AIDA | BAB | FAB | 4Ps | Hook-Story-Offer]
Audience: [target audience]

Copy Elements:
  Headlines: [N] variants
  CTAs: [N] variants
  Body sections: [N]
  Subject lines: [N] (if email)

Compliance: ✓ checked
Tone match: ✓ consistent with existing copy

──── Copy deck ready for implementation ────
```
