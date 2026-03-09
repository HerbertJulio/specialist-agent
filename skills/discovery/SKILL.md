---
name: discovery
description: "Use when starting a new product, feature, or initiative and you need structured discovery before planning - covers market analysis, technical feasibility, architecture, and go-to-market strategy."
user-invocable: true
argument-hint: "[product or feature description]"
allowed-tools: Read, Glob, Grep, Bash, Write
---

# /discovery - Product & Feature Discovery

Structured discovery before planning. Covers feasibility, architecture, risks, and strategy in a single pass.

**Target:** $ARGUMENTS

## When to Use

- Starting a new product or major feature
- Evaluating technical feasibility of an initiative
- Before `/plan` when scope is unclear or ambitious
- When stakeholders need a go/no-go decision
- NOT for: small features, bug fixes, or tasks with clear scope

## Workflow

### Phase 0: Scope Definition

Define what we're discovering:

```markdown
## Discovery Scope
- **What:** [product/feature description]
- **Why:** [business motivation]
- **Who:** [target users]
- **Constraints:** [time, budget, team, tech]
```

### Phase 1: Technical Feasibility

Analyze the current codebase and evaluate feasibility:

1. **Codebase scan** - Identify existing modules, patterns, and dependencies
2. **Integration points** - What existing systems does this touch?
3. **Technology gaps** - What new libraries, services, or infrastructure is needed?
4. **Complexity estimate** - TRIVIAL / SIMPLE / MEDIUM / COMPLEX / EPIC

**Output:**

```markdown
## Technical Feasibility

### Existing Assets
- [Reusable modules, services, components]

### New Requirements
- [New packages, services, infrastructure]

### Integration Points
- [APIs, databases, third-party services]

### Complexity: [TRIVIAL | SIMPLE | MEDIUM | COMPLEX | EPIC]

### Feasibility: [GO | CONDITIONAL | NO-GO]
- [Reasoning with evidence]
```

**BLOCKED** until feasibility assessment is complete with evidence.

### Phase 2: Architecture Assessment

Design the high-level architecture:

1. **Component map** - What modules/services are needed?
2. **Data model** - What entities, relationships, and storage?
3. **API surface** - What endpoints or interfaces?
4. **Non-functional requirements** - Performance, security, scalability targets

**Output:**

```markdown
## Architecture Assessment

### Component Map
- [Module 1]: [responsibility]
- [Module 2]: [responsibility]

### Data Model
- [Entity 1]: [key fields and relationships]
- [Entity 2]: [key fields and relationships]

### API Surface
- [Endpoint/Interface 1]: [purpose]
- [Endpoint/Interface 2]: [purpose]

### Non-Functional Requirements
| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Response time | < 200ms p95 | User experience |
| Availability | 99.9% | Business SLA |
| Data retention | 90 days | Compliance |
```

### Phase 3: Risk Analysis

Identify and classify risks:

1. **Technical risks** - New technology, complex integrations, performance unknowns
2. **Business risks** - Market timing, regulatory, competition
3. **Operational risks** - Team capacity, skill gaps, dependencies on external teams

**Output:**

```markdown
## Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Strategy] |

### Blockers
- [Any hard blockers that prevent proceeding]

### Open Questions
- [Questions that need answers before planning]
```

### Phase 4: Effort & Cost Estimate

Estimate the work required:

1. **Task decomposition** - Break into major work streams
2. **Agent mapping** - Which agents handle which work
3. **Token estimate** - Approximate AI cost
4. **Timeline** - Suggested phases and milestones

**Output:**

```markdown
## Effort Estimate

### Work Streams
| Stream | Agent(s) | Estimated Tokens | Priority |
|--------|----------|------------------|----------|
| [Stream 1] | @builder, @data | ~X tokens | P0 |
| [Stream 2] | @api, @builder | ~X tokens | P1 |
| [Stream 3] | @tester | ~X tokens | P1 |

### Total Estimate
- Tokens: ~X total (~$Y)
- Suggested phases: [count]
- Recommended approach: Sequential / Parallel / Hybrid

### Suggested Timeline
- Phase 1: [scope] - [duration]
- Phase 2: [scope] - [duration]
- Phase 3: [scope] - [duration]
```

### Phase 5: Discovery Verdict

Synthesize all findings into a go/no-go recommendation:

```markdown
## Discovery Verdict

### Recommendation: [GO | CONDITIONAL GO | NO-GO]

### Summary
[2-3 sentence executive summary]

### Key Findings
1. [Most important finding]
2. [Second finding]
3. [Third finding]

### Conditions (if CONDITIONAL GO)
- [Condition that must be met]
- [Another condition]

### Next Steps
- [ ] [Immediate action 1]
- [ ] [Immediate action 2]
- [ ] Run `/plan [refined scope]` to create implementation plan
```

## Output

```
---- /discovery ----
Target: [product/feature]
Feasibility: [GO | CONDITIONAL | NO-GO]
Complexity: [TRIVIAL | SIMPLE | MEDIUM | COMPLEX | EPIC]
Estimated tokens: ~X (~$Y)
Risks: [count] (H:[n] M:[n] L:[n])

Verdict: [GO | CONDITIONAL GO | NO-GO]

[Full discovery document above]

Next: /plan [refined scope] (if GO)
```

## Anti-Rationalization

| Excuse | Reality |
|--------|---------|
| "We already know what to build" | Discovery reveals unknowns you don't know you have. |
| "Discovery is too slow" | Discovering a fatal flaw in 30 min beats building for 2 weeks then pivoting. |
| "The scope is obvious" | Obvious scope still has hidden integration points, data model decisions, and risks. |
| "We can discover as we build" | That's called rework. Discovery-first prevents 3-5x cost overruns. |

## Rules

1. **Evidence-based** - Every finding must reference codebase scans, docs, or research
2. **No assumptions** - Flag unknowns as open questions, don't guess
3. **Concrete estimates** - Token counts, timelines, and costs - not "it depends"
4. **Actionable verdict** - GO/NO-GO with clear reasoning
5. **Flows into /plan** - Discovery output is the input for planning
