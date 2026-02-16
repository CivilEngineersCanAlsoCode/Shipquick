# Design Handoff Workflow

## Purpose

Ensure UX Designer's work is transferred to the Dev Squad with zero ambiguity. This defines the "Definition of Ready" for UI specifications.

## Pre-Conditions

- Design has passed usability validation.
- Design system / tokens are established.
- Dev Squad has capacity in the upcoming iteration.

## Workflow Steps

### Step 1: Prepare Visual Specs (30 min)

For each screen/component, document:

#### Layout Specifications

- [ ] Screen dimensions and breakpoints (mobile, tablet, desktop).
- [ ] Grid system (columns, gutters, margins).
- [ ] Component positioning (absolute values or relative constraints).
- [ ] Spacing values (padding, margin) using design tokens.

#### Typography

- [ ] Font family, weight, and size for each text element.
- [ ] Line height and letter spacing.
- [ ] Text alignment and overflow behavior (truncate vs. wrap).

#### Colors

- [ ] All color values using design token names (not hex codes).
- [ ] Color states: default, hover, active, disabled, error.
- [ ] Dark mode variants (if applicable).

#### Assets

- [ ] Icons exported as SVG (with consistent viewBox).
- [ ] Images optimized and exported at 1x, 2x, 3x.
- [ ] Illustrations in vector format where possible.

### Step 2: Document Interaction Specs (20 min)

#### State Documentation

For each interactive component, specify ALL states:

| State          | Visual       | Behavior                         |
| -------------- | ------------ | -------------------------------- |
| Default        | [screenshot] | Resting state                    |
| Hover          | [screenshot] | Cursor pointer, subtle highlight |
| Active/Pressed | [screenshot] | Scale down slightly              |
| Focused        | [screenshot] | Focus ring visible               |
| Disabled       | [screenshot] | 50% opacity, no pointer events   |
| Loading        | [screenshot] | Skeleton or spinner              |
| Error          | [screenshot] | Red border, error message below  |
| Empty          | [screenshot] | Empty state illustration + CTA   |

#### Animations & Transitions

- [ ] Transition properties (duration, easing, delay).
- [ ] Entry/Exit animations for modals, toasts, etc.
- [ ] Micro-interactions (button press, toggle, etc.).

### Step 3: Write Acceptance Criteria (15 min)

Convert design specs into testable acceptance criteria:

```markdown
**Given** a user is on the [screen name]
**When** they [interaction]
**Then** [expected visual/functional result]

Example:
**Given** a user is on the Login screen
**When** they submit empty fields
**Then** both fields show red borders with "Required" error text
**And** the Submit button remains disabled
```

### Step 4: Create Component Inventory (10 min)

| Component     | Status | Design Token    | Notes                  |
| ------------- | ------ | --------------- | ---------------------- |
| PrimaryButton | Ready  | `btn-primary`   | Includes loading state |
| InputField    | Ready  | `input-default` | With validation states |
| Modal         | Ready  | `modal-overlay` | Focus trap required    |
| Toast         | New    | `toast-success` | Auto-dismiss 5s        |

### Step 5: Conduct Handoff Meeting (30 min)

1. Walk Dev Squad through each screen.
2. Highlight complex interactions and edge cases.
3. Answer questions and document decisions.
4. Agree on which components are "reusable" vs "one-off".
5. Dev creates technical subtasks from the specs.

### Step 6: Support During Development

- [ ] Available for quick clarifications (same-day response).
- [ ] Review implemented components against specs.
- [ ] Approve visual fidelity before story is marked "Done".

## Quality Gate

A design handoff is **"Ready for Dev"** when:

- [ ] All screens have visual specs (dimensions, colors, typography).
- [ ] All interactive states are documented.
- [ ] Acceptance criteria are written in Given/When/Then format.
- [ ] Assets are exported and accessible.
- [ ] Dev Squad has reviewed and has no blocking questions.

## Output

- Design spec document (Markdown/Figma link).
- Exported assets (SVG, PNG).
- Component inventory table.
- Stories with design-linked acceptance criteria.
