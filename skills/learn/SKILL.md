---
name: learn
description: "Use when implementing a feature and want to understand the code as it's built - during onboarding, teaching, or learning a new pattern."
user-invocable: true
argument-hint: "[feature to implement and learn]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /learn - Learning Mode Implementation

Implement features while explaining concepts, patterns, and decisions along the way.

**Target:** $ARGUMENTS

## What Makes This Different

```
Normal Implementation:
  "Here's the code" → Done

Learning Mode:
  "Here's WHY we do this" → "Here's HOW it works" → "Here's the code" → Done
```

## Workflow

### Step 1: Context Setting

Before writing any code, explain:

```markdown
## What We're Building

[Feature name] is a [type of thing] that [what it does].

**Why it matters:**
[Business/technical reason]

**Where it fits:**
[Location in architecture]

**Concepts you'll learn:**
- Concept 1
- Concept 2
- Concept 3
```

### Step 2: Architecture Explanation

```markdown
## Architecture Deep Dive

In this codebase, we follow [pattern name].

```
┌─────────────┐
│  Component  │  ← UI layer, handles display
└─────┬───────┘
      │ uses
┌─────▼───────┐
│    Hook     │  ← Logic layer, manages state
└─────┬───────┘
      │ calls
┌─────▼───────┐
│   Service   │  ← Data layer, API calls
└─────────────┘
```

**Why this pattern?**
[Explanation of benefits]
```

### Step 3: Incremental Implementation with Teaching

For each piece of code:

```markdown
## Step N: [What we're doing]

**The concept:**
[Explain the pattern/concept being used]

**Why this approach:**
[Explain the decision]

**The code:**
```typescript
// This creates a [thing] that [does what]
// We use [pattern] because [reason]
export const myFunction = () => {
  // First, we [action] to [achieve goal]
  const result = doSomething();

  // Then we [action] because [reason]
  return transform(result);
};
```

**What just happened:**
1. We created [thing]
2. It does [action]
3. This enables [capability]

**Try it yourself:**
- What would happen if we [changed X]?
- How would you add [feature Y]?
```

### Step 4: Common Patterns

When using a pattern, explain it:

```markdown
## Pattern: [Pattern Name]

**What it is:**
[One sentence explanation]

**When to use it:**
- Situation 1
- Situation 2

**Example in our code:**
```typescript
// Here's how we apply [pattern]
const example = ...;
```

**Alternatives considered:**
- [Alternative] - didn't use because [reason]
```

### Step 5: Gotchas and Best Practices

```markdown
## Watch Out For

**Common mistake #1:**
```typescript
// ❌ Don't do this
const bad = wrongApproach();

// ✓ Do this instead
const good = correctApproach();
```
Why: [Explanation]

**Common mistake #2:**
[...]
```

### Step 6: Summary and Next Steps

```markdown
## What You Learned

1. **[Concept 1]:** [Brief explanation]
2. **[Concept 2]:** [Brief explanation]
3. **[Concept 3]:** [Brief explanation]

## Practice Exercises

1. Try adding [feature] using the same pattern
2. What would you change if [scenario]?
3. How does this connect to [related concept]?

## Further Reading

- [Link or reference 1]
- [Link or reference 2]
```

## Teaching Style Guidelines

### Do:
- Explain WHY before HOW
- Use analogies for complex concepts
- Show wrong approaches and why they're wrong
- Build complexity incrementally
- Ask thought-provoking questions
- Connect to broader patterns

### Don't:
- Dump code without explanation
- Assume prior knowledge
- Skip over "obvious" concepts
- Use jargon without defining it
- Rush through complex topics

## Output Format

```
──── /learn ────
Topic: [feature name]

## Concepts Covered
1. [Concept]
2. [Concept]
3. [Concept]

## Implementation
[Code with inline teaching]

## Key Takeaways
- [Takeaway 1]
- [Takeaway 2]

## Practice
- [Exercise 1]
- [Exercise 2]
```

## Example Session

```markdown
──── /learn ────
Topic: Creating a User Service

## What We're Building

A UserService that fetches user data from an API and handles
loading states, errors, and caching.

**Concepts you'll learn:**
- Service layer pattern
- TypeScript generics
- Error handling strategies

## Let's Start

### Step 1: The Types

Before any logic, we define our types. This is called
"types-first development" - we describe the shape of our
data before we write code that uses it.

```typescript
// Why interface over type?
// Interfaces are better for object shapes because they:
// 1. Have better error messages
// 2. Can be extended
// 3. Are more familiar to OOP developers

interface User {
  id: string;
  name: string;
  email: string;
}
```

[... continues with teaching ...]
```

## Rules

1. **Never skip the "why"** - Every piece needs justification
2. **Build incrementally** - Complex → Simple steps
3. **Use visuals** - Diagrams help understanding
4. **Ask questions** - Engage the learner
5. **Connect concepts** - Show the bigger picture
