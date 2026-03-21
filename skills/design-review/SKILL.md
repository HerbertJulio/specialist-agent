---
name: design-review
description: "Use when reviewing frontend code for design consistency, accessibility compliance, responsive behavior, and UI/UX best practices - before deployment or after design system changes."
user-invocable: true
argument-hint: "[path, component, or page]"
allowed-tools: Read, Bash, Glob, Grep
---

# /design-review - Frontend & Design Audit

Audit frontend code for design consistency, accessibility compliance, responsive behavior, and UX patterns - producing actionable findings with severity levels and file:line references.

**Target:** $ARGUMENTS

## When to Use

- Before deploying UI changes to production
- After design system updates or theme changes
- When accessibility compliance is required (WCAG AA)
- After new contributor frontend PRs
- When UI inconsistencies are reported by users
- When migrating or updating component libraries
- NOT for: backend-only changes (use `/codereview`)
- NOT for: performance-only audits (use `@perf` directly)
- NOT for: creating new designs (use `@designer`)

## Workflow

### Step 1: Scope & Stack Detection

1. **Identify target** - Component, page, module, or full frontend
2. **Detect CSS framework:**

```bash
# Detect styling approach
grep -rl "tailwind\|@apply" . --include="*.css" --include="*.config.*" 2>/dev/null | head -5
grep -rl "styled-components\|@emotion\|css-in-js" . --include="*.ts" --include="*.tsx" 2>/dev/null | head -5
grep -rl "\.module\.css\|\.module\.scss" $TARGET 2>/dev/null | head -5
```

3. **Detect component library:**

```bash
# Check for UI libraries
grep -rn "shadcn\|radix\|headlessui\|chakra\|mantine\|vuetify\|primevue" package.json 2>/dev/null
```

4. **Read design tokens** if they exist (theme files, CSS variables, Tailwind config)

### Step 2: Design Consistency Audit

Check for consistent use of design system:

| Check | What to Look For |
|-------|------------------|
| Color tokens | Hardcoded hex/rgb instead of CSS variables or theme tokens |
| Spacing scale | Arbitrary pixel values instead of spacing scale (4px, 8px, 16px...) |
| Typography | Inline font-size/weight instead of text style tokens |
| Border radius | Inconsistent rounding across components |
| Shadow | Hardcoded box-shadow instead of elevation tokens |
| Z-index | Arbitrary z-index values without a defined scale |
| Breakpoints | Custom media queries instead of defined breakpoints |

```bash
# Find hardcoded colors (potential token violations)
grep -rn "#[0-9a-fA-F]\{3,8\}\|rgb(\|rgba(\|hsl(" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" --include="*.css" 2>/dev/null | grep -v "node_modules\|\.config\." | head -30

# Find hardcoded pixel values (potential spacing violations)
grep -rn "margin:\|padding:\|gap:" $TARGET --include="*.tsx" --include="*.vue" --include="*.css" 2>/dev/null | grep "[0-9]px" | head -20

# Find hardcoded z-index
grep -rn "z-index:" $TARGET --include="*.tsx" --include="*.vue" --include="*.css" 2>/dev/null | head -10
```

### Step 3: Accessibility Audit (WCAG AA)

Check for accessibility compliance:

| Check | Criteria | How to Verify |
|-------|----------|---------------|
| Alt text | All `<img>` have meaningful `alt` | Grep for `<img` without `alt` |
| Labels | All form inputs have associated labels | Grep for `<input` without `aria-label` or `<label>` |
| Headings | Single H1, logical H2-H6 hierarchy | Scan heading structure |
| Contrast | Text meets 4.5:1 ratio (AA) | Check color token combinations |
| Focus | Interactive elements have visible focus styles | Check `:focus-visible` usage |
| Keyboard | All interactions accessible via keyboard | Check for `onClick` without `onKeyDown` |
| ARIA | Correct ARIA roles, states, properties | Check for misused ARIA attributes |
| Motion | Respect `prefers-reduced-motion` | Check animations for motion preference |
| Touch targets | Minimum 44x44px for touch targets | Check button/link sizing |

```bash
# Missing alt text
grep -rn "<img" $TARGET --include="*.tsx" --include="*.vue" --include="*.svelte" 2>/dev/null | grep -v "alt=" | head -10

# Missing form labels
grep -rn "<input\|<select\|<textarea" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v "aria-label\|aria-labelledby\|id=" | head -10

# onClick without keyboard handler
grep -rn "onClick=" $TARGET --include="*.tsx" 2>/dev/null | grep -v "button\|Button\|<a " | head -10

# Check for prefers-reduced-motion
grep -rn "prefers-reduced-motion" $TARGET --include="*.css" --include="*.tsx" --include="*.vue" 2>/dev/null | wc -l
```

### Step 4: Responsive Review

Check responsive behavior:

| Check | What to Look For |
|-------|------------------|
| Breakpoint usage | Consistent use of defined breakpoints, not arbitrary values |
| Mobile-first | Styles default to mobile, scale up with min-width queries |
| Flexible layouts | Flex/Grid instead of fixed widths |
| Viewport meta | Proper `<meta name="viewport">` configuration |
| Text overflow | Long text handled with truncation/wrap |
| Image sizing | Responsive images with `srcset`, `sizes`, or framework equivalents |
| Container queries | Used where component-level responsiveness is needed |

```bash
# Find fixed widths (potential responsive issues)
grep -rn "width: [0-9]\+px" $TARGET --include="*.css" --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v "max-width\|min-width" | head -15

# Check for responsive image usage
grep -rn "<img" $TARGET --include="*.tsx" --include="*.vue" 2>/dev/null | grep -v "srcset\|sizes\|next/image\|nuxt-img" | head -10
```

### Step 5: UX Pattern Review

Check for complete UX states:

| Pattern | Required States |
|---------|----------------|
| Data loading | Loading skeleton/spinner, not blank screen |
| Empty state | Helpful message + action when no data |
| Error state | User-friendly error with retry action |
| Form validation | Inline validation, not just submit-time |
| Success feedback | Confirmation after destructive/important actions |
| Progressive disclosure | Complex UI revealed progressively |
| Navigation | Breadcrumbs, back buttons, clear hierarchy |

For each component/page in scope, verify that all applicable states are handled.

### Step 6: Report & Findings

1. **Classify every finding** with severity (CRITICAL/HIGH/MEDIUM/LOW)
2. **Include file:line references** for every finding
3. **Provide concrete fix** for every finding
4. **Calculate scores** per category (0-100)

## Severity Levels

| Level | Description | Examples |
|-------|-------------|---------|
| CRITICAL | Accessibility barrier or legal risk | Missing alt text on critical images, no keyboard navigation, color contrast failure |
| HIGH | Major UX issue or design system violation | Inconsistent design tokens, missing error states, broken responsive layout |
| MEDIUM | Minor UX issue or inconsistency | Hardcoded colors that match tokens, missing loading states on fast operations |
| LOW | Style improvement or polish | Minor spacing inconsistencies, optional animation improvements |

## Verification Protocol

**Before claiming the review is complete:**

1. All 4 audit dimensions were checked (consistency, accessibility, responsive, UX)
2. Every finding has a severity level and file:line reference
3. Every CRITICAL/HIGH finding has a concrete fix suggestion
4. Automated checks were run (grep for hardcoded values, missing alt text, etc.)
5. Design token/theme files were read before flagging consistency issues
6. At least one component was traced through all UX states (loading, empty, error, success)

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "Design is subjective" | Accessibility is not. Consistency is not. Review objective criteria, not taste. |
| "It looks fine on my screen" | Did you test mobile, tablet, desktop? Dark mode? Screen reader? |
| "We'll fix accessibility later" | WCAG compliance is cheaper to build than retrofit. Lawsuits don't wait. |
| "The design system handles all this" | Design systems provide tools; developers still misuse them. Verify actual usage. |
| "Users don't notice small inconsistencies" | Inconsistency erodes trust subconsciously. Death by a thousand cuts. |
| "It's an internal tool, accessibility doesn't matter" | Internal tools have users with disabilities too. And internal becomes external. |
| "The component library is accessible by default" | Libraries provide accessible primitives. Composition can break accessibility. |

## Rules

1. **Read-only** - Never modify files during a review
2. **Evidence required** - Every finding needs a file:line reference
3. **Token-first** - Check if design tokens exist before flagging hardcoded values
4. **Accessibility is non-negotiable** - WCAG AA violations are always HIGH or CRITICAL
5. **Framework-aware** - Check for framework-specific patterns (next/image, NuxtImg, etc.)
6. **State completeness** - Every interactive component must handle loading, error, and empty states
7. **No false positives** - Verify that a "hardcoded value" isn't actually a CSS variable or token

## Output

```
──── /design-review ────
Target: $ARGUMENTS
Stack: [framework] + [CSS approach] + [component library]

Consistency:   [score]/100 - [N findings]
Accessibility: [score]/100 - [N findings]
Responsive:    [score]/100 - [N findings]
UX Patterns:   [score]/100 - [N findings]

Severity:
  CRITICAL: N
  HIGH: N
  MEDIUM: N
  LOW: N

Top Findings:
1. [CRITICAL] [description] - [file:line]
2. [HIGH] [description] - [file:line]
3. [HIGH] [description] - [file:line]

Overall Score: [N]/100
Verdict: [PASS | PASS WITH NOTES | NEEDS WORK | FAIL]
```
