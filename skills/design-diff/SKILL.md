---
name: design-diff
description: Use when comparing a design screen against its production equivalent to find visual and structural differences — outputs a categorised diff so the engineer knows exactly what to change
---

# Design Diff

Structurally compare a design screen (this repo) against its production equivalent (react-app-2) and output every difference. The diff works through the same 10 categories as `/design-summary` so nothing is missed. The output tells the engineer exactly what to add, remove, or change to bring production in line with the design.

## Input

Two file paths — the design screen and the production screen(s):

```
/design-diff src/screens/HomeScreen.tsx ~/swdev/kindling/react-app-2/src/pages/Home.tsx
```

The first path is the design source of truth. The second is the production file (or files) to compare against. The production path can be absolute or relative. Multiple production files can be provided if the feature spans several components.

## Resolving design system paths

The tokens and components live in `@kindling/ds`. Where those files are on disk depends on which repo you're in:

| Repo | Tokens | Theme mapping | Components |
|------|--------|---------------|------------|
| `design` | `src/tokens/tokens.css` (symlinked from DS) | `src/index.css` | `node_modules/@kindling/ds/components/ui/` |
| Any consuming repo (`react-app-2`, etc.) | `node_modules/@kindling/ds/tokens/tokens.css` | `node_modules/@kindling/ds/index.css` | `node_modules/@kindling/ds/components/ui/` |

To detect which case you're in: check whether `src/tokens/tokens.css` exists. If it does, you're in the design repo. If not, read from `node_modules/@kindling/ds/`.

## Process

1. Read the design screen file in full.
2. Read the production screen file(s) in full.
3. Resolve the design system paths (see above), then read tokens and component files as needed to resolve token values and understand component base styles.
4. For each of the 10 categories, compare the design against production and identify every difference.
5. Output the full report in the format below.

## Categories

Work through the same 10 categories as `/design-summary`, in order. For each category, compare design vs production.

### 1. Layout

Compare hierarchical structure, flex/grid usage, column counts, gaps, widths, alignment, and overflow behaviour.

### 2. Spacing

Compare every gap, padding, and margin. Flag differences in token usage even if the resolved pixel value is the same (e.g. production uses `gap-6` where design uses `gap-xl` — same 24px, but production should use the token).

### 3. Typography

Compare every text element's token, weight, color, and tracking. Flag any text that exists in one but not the other.

### 4. Components

Compare which library components are used, their variants, sizes, props, and overrides. Flag components in production that aren't in the design (remove candidates) and components in the design that aren't in production (add candidates).

### 5. Color

Compare background, border, text, shadow, and opacity values. Flag any raw values in production that the design expresses as tokens.

### 6. Icons

Compare icon usage: which icons, sizes, colors. Flag missing, extra, or wrong icons.

### 7. States

Compare every interactive and conditional state. Flag states that exist in the design but not production (missing), states in production but not the design (extra — remove candidates), and states where the visual changes differ.

### 8. Interactions

Compare what the user can do on the page. Flag interactions that exist in the design but not production, interactions in production that aren't in the design, and interactions where the result or navigation differs.

### 9. Motion

Compare entrance animations, hover effects, transitions, and state change animations. Flag missing animations, extra animations, and differences in duration, easing, or delay values.

### 10. Data Shape

Compare the structure and content rendered. Flag extra fields, missing fields, different counts, different ordering, and any content in production that doesn't exist in the design.

## Diff Classification

Every finding is one of:

- **Add** — exists in design, missing in production. Engineer needs to add it.
- **Remove** — exists in production, not in design. Engineer needs to remove it.
- **Change** — exists in both but differs. Engineer needs to update it.

## Output Format

Output in this exact order:

### 1. Parity Score

Start with a parity rating out of 100, displayed prominently:

```
## Parity: XX / 100
```

Below the score, 2-3 sentences explaining the rating — what's driving the score up (structural matches, feature parity) and what's dragging it down (token gaps, component library bypasses, visual differences).

### 2. Executive Summary

A concise high-level summary (3-5 bullet points) of the most significant differences across all categories. This is the "what matters most" overview — the things the engineer should understand before reading the detailed tables. Each bullet should name the category it relates to.

### 3. Unspecified UI

A dedicated section listing every element, component, interaction, or state that exists in production but has no counterpart in the design. These may be additions from the engineer's AI tooling, scope creep, leftover elements from previous iterations, or legitimate production necessities.

Output as a table:

| # | Element | Category | What it does |
|---|---------|----------|-------------|

- **#**: sequential number
- **Element**: descriptive name
- **Category**: which of the 10 categories it falls under
- **What it does**: brief description of what this element does in production

If there are no unspecified UI elements, output "None."

### 4. Category Diffs

For each of the 10 categories, output:

1. **The category heading** (e.g. `### 1. Layout`)
2. **A narrative paragraph** (2-4 sentences) summarising the differences in that category at a human-readable level. What's the story? What pattern of drift is happening? This gives context before the engineer reads the table.
3. **The diff table:**

| # | Type | Element | Design | Production | Notes |
|---|------|---------|--------|------------|-------|

- **#**: sequential number across the whole diff
- **Type**: Add, Remove, or Change
- **Element**: descriptive name of what's affected
- **Design**: what the design specifies (empty for Remove)
- **Production**: what production currently has (empty for Add)
- **Notes**: context, impact, or relationship to other findings

Skip categories with no differences (output the heading followed by "No differences.").

### 5. Summary Line

After all categories, output:

```
Summary: {total} differences — {adds} to add, {removes} to remove, {changes} to change
```

## Output Rules

- Treat the design screen as the source of truth. Every difference is framed as what production needs to do to match the design.
- Compare structurally, not textually. Understand that `gap-6` and `gap-xl` may resolve to the same value — flag the token mismatch, not a visual difference.
- Do not flag implementation differences that produce the same visual result (e.g. different state management approaches, different component composition if the rendered output matches).
- Do not offer suggestions or improvements. The diff documents what's different.
- If production uses a custom component that visually matches a design system component, flag it as a Change with a note to use the library component.
- Flag extra elements in production explicitly — buttons, tooltips, dividers, text that isn't in the design are Remove candidates.
