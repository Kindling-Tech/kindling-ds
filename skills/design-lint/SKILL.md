---
name: design-lint
description: Use when a screen build is finished and you want to check design system hygiene before handoff — flags raw values, missing tokens, repeated overrides, primitive references, and inconsistent usage
---

# Design Lint

Audit a screen file for design system and component library hygiene. Flags violations so they can be cleaned up before running `/design-summary` and handing off to engineering.

## Input

A screen file path relative to the project root:

```
/design-lint src/screens/HomeScreen.tsx
```

## Process

1. Read the screen file in full.
2. Read the project's design tokens (`src/tokens/tokens.css`) and theme mapping (`src/index.css`) to know what tokens exist.
3. Read any component files used by the screen to understand their base styles, variants, and sizes.
4. Work through each check below in order. Every check is mandatory.
5. Output violations grouped by severity.

## Checks

### 1. Raw Values

Any hardcoded value where a design system token exists.

**Flag when:**
- A pixel value is used for spacing, sizing, or radius where a spacing/radius/component-size token exists (e.g. `h-[60px]`, `w-[280px]`, `gap-4`, `p-2`, `rounded-lg`)
- A hex color or `rgba()` is used where a semantic or primitive token exists
- A Tailwind numeric utility is used where a named token exists (e.g. `text-sm` instead of `text-paragraph-sm`, `h-8` instead of `h-component-md`)
- An inline `style={{ }}` sets a value that could be a token

**Do not flag:**
- Values in SVG elements (viewBox, cx, cy, r, etc.) — these are drawing coordinates, not design tokens
- Framer Motion animation values (y: -2, opacity: 0) — these are motion parameters
- Calculated values that derive from tokens
- One-off values with no matching token, where no token should reasonably exist

### 2. Primitive References

Using a primitive color token directly instead of the semantic token that references it.

**Flag when:**
- `var(--color-wood-500)` is used where `primary` would be correct
- `var(--color-sage-50)` is used where `background` would be correct
- Any `var(--color-{palette}-{step})` appears in a screen file where a semantic mapping exists in `tokens.css`

**Do not flag:**
- Primitives used for concepts that have no semantic token (this becomes a "Missing semantic token" finding instead)
- Primitives used in component library files (those define the system, they don't consume it)

### 3. Repeated Overrides

The same className override appearing on the same component type 2 or more times in the screen.

**Flag when:**
- Same override on same component type appears 2+ times (e.g. `font-normal` on Badge twice)
- Same combination of overrides appears on the same component type (e.g. `!rounded-full text-paragraph-sm` on Badge)

**Report:** the component, the override, the count, and recommendation (new variant, new size, or new prop).

### 4. Missing Semantic Tokens

A color or value is used for a clear design concept but no semantic token exists for it.

**Flag when:**
- A raw Tailwind color is used for a recurring concept (e.g. `text-green-600` for success/positive states)
- The same primitive is used across multiple screens for the same purpose but has no semantic name

**Report:** the raw value, what concept it represents, and a suggested semantic token name.

### 5. Component Override vs Variant

A component's base styles are overridden in a way that suggests the component should support this natively.

**Flag when:**
- A className overrides a base style the component sets (e.g. `font-normal` overriding Badge's `font-medium`)
- An `!important` prefix (`!`) is used to win specificity against the component's own styles
- A size or dimension override bypasses the component's size prop system (e.g. `!size-[44px]` on Avatar instead of using a size prop)

**Do not flag:**
- Layout overrides that position the component in context (e.g. `ml-auto`, `shrink-0`)
- Overrides that are clearly one-off and screen-specific

### 6. Inconsistent Usage

The same visual concept is expressed with different tokens or approaches in different places on the same screen.

**Flag when:**
- Same type of text uses different typography tokens in different locations (e.g. card title is `paragraph` in one place and `paragraph-sm` in another)
- Same type of icon uses different size tokens
- Same type of spacing uses different tokens for the same relationship
- Same interactive pattern (e.g. time display) uses different component structures in different contexts

**Do not flag:**
- Intentional hierarchy differences (e.g. expanded card uses larger typography than list rows — that's by design)

## Output Format

Group findings by severity. Within each severity, group by check type.

### Must Fix
Issues that violate the design system contract. Raw hex colors, hardcoded values where tokens exist, primitive references where semantic tokens exist.

| # | Check | Element | Current | Should Be | Notes |
|---|-------|---------|---------|-----------|-------|

### Should Fix
Issues that indicate the component library should evolve. Repeated overrides, component overrides that should be variants.

| # | Check | Element | Current | Recommendation | Notes |
|---|-------|---------|---------|----------------|-------|

### Consider
Issues that suggest missing tokens or potential inconsistencies. Missing semantic tokens, usage inconsistencies.

| # | Check | Element | Current | Suggestion | Notes |
|---|-------|---------|---------|------------|-------|

If a severity level has no findings, output the heading followed by "None."

## Output Rules

- Reference specific elements by their role in the screen, not by code location.
- Show the current value and what it should be (for Must Fix) or what to consider (for Should Fix / Consider).
- Do not fix anything. This skill only reports.
- Do not flag violations in imported library components — only flag how the screen uses them.
- Be precise about which token or variant would resolve each finding.
