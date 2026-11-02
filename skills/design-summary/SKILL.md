---
name: design-summary
description: Use when handing off a finished screen to engineering — generates a granular, structured spec from a design screen file so the engineer's Claude Code can implement it with zero interpretation
---

# Design Summary

Generate a complete visual spec from a screen file. The output is a structured table-based document covering every design decision in the screen — layout, spacing, typography, components, color, icons, states, interactions, motion, and data shape. The spec is a visual contract: it describes what the screen looks like and how it behaves, not how to implement it.

## Input

A screen file path relative to the project root, passed as an argument:

```
/design-summary src/screens/HomeScreen.tsx
```

## Process

1. Read the screen file in full.
2. Identify all imported components, tokens, and assets.
3. Read any imported local components or utilities referenced by the screen (not library components — only project-level abstractions used in the screen).
4. Work through each category below in order. Every category is mandatory — if a category has no entries, output "None" for that category.
5. Output the full spec as structured tables.

## Categories

Work through these in order. Do not skip any.

### 1. Layout

Capture the hierarchical structure of the page. Use indentation to show nesting.

| Level | Element | Type | Direction | Columns | Gap | Width | Alignment | Notes |
|-------|---------|------|-----------|---------|-----|-------|-----------|-------|

- **Level**: nesting depth (0 = page root)
- **Type**: flex, grid, or static
- **Direction**: row, column, or n/a for grid
- **Columns**: column count and span rules for grids
- **Gap**: spacing token between children
- **Width**: full, explicit pixel value, column span, or constraint
- **Alignment**: items alignment (start, center, stretch, between)
- **Notes**: overflow, scroll, max-height, or other layout behaviour

### 2. Spacing

Every gap, padding, and margin in the screen. Group by container.

| Container | Property | Token | Value |
|-----------|----------|-------|-------|

- **Container**: which element the spacing is on
- **Property**: padding, padding-x, padding-y, gap, margin, etc.
- **Token**: the design system token name (e.g. xl, md, sm)
- **Value**: the resolved pixel value

### 3. Typography

Every text element in the screen.

| Element | Token | Weight | Color | Tracking | Notes |
|---------|-------|--------|-------|----------|-------|

- **Element**: descriptive name of the text (e.g. "card title", "filter chip label")
- **Token**: typography token (e.g. heading-1, paragraph-sm, paragraph-mini)
- **Weight**: regular (400), medium (500), or semibold (600)
- **Color**: semantic color token (e.g. foreground, muted-foreground, wood-500)
- **Tracking**: letter-spacing token if applied (e.g. tracking-heading-1)
- **Notes**: truncation, line clamping, min-height, or other text behaviour

### 4. Components

Every component instance from the library used in the screen.

| Element | Component | Variant | Size | Props | Overrides |
|---------|-----------|---------|------|-------|-----------|

- **Element**: what this component represents in the screen (e.g. "cooldown CTA", "filter chip")
- **Component**: library component name (e.g. Button, Badge, Card, Avatar)
- **Variant**: which variant prop (e.g. default, secondary, outline, ghost)
- **Size**: which size prop (e.g. default, sm, md, lg)
- **Props**: notable props beyond variant/size (e.g. disabled, asChild, multiple)
- **Overrides**: any className overrides applied (e.g. `!rounded-full`, `font-normal`)

### 5. Color

Background, border, and decorative colors applied at the screen level (not inherited from components).

| Element | Property | Token | Notes |
|---------|----------|-------|-------|

- **Element**: what the color is applied to
- **Property**: background, border, text, shadow, opacity, etc.
- **Token**: semantic color token or primitive token
- **Notes**: conditional application (e.g. "only when selected", "only on cooldown rows")

### 6. Icons

Every icon used in the screen.

| Element | Icon | Size | Color | Notes |
|---------|------|------|-------|-------|

- **Element**: where the icon appears (e.g. "time label", "cooldown tooltip trigger")
- **Icon**: lucide-react icon name (e.g. Calendar, Clock, CircleHelp)
- **Size**: icon size token (e.g. size-icon-sm, size-icon-md, size-icon-default)
- **Color**: color token applied to the icon
- **Notes**: conditional rendering, click behaviour

### 7. States

Every interactive or conditional state in the screen. Each state describes what changes visually.

| State | Trigger | Elements affected | Changes |
|-------|---------|-------------------|---------|

- **State**: name of the state (e.g. "cooldown active", "row selected", "post focused")
- **Trigger**: what causes the state (e.g. "action has cooldown property", "user clicks row", "textarea receives focus")
- **Elements affected**: which parts of the UI change
- **Changes**: exactly what changes — tokens, visibility, opacity, variant swaps, text changes, elements added/removed

### 8. Interactions

Every user action available on the screen and what it produces.

| Element | Action | Result | Navigation |
|---------|--------|--------|------------|

- **Element**: what the user interacts with (e.g. "NBA row", "filter chip", "CTA button")
- **Action**: what the user does (click, hover, type, scroll, drag)
- **Result**: what happens visually or functionally (e.g. "selects row, expanded card updates", "filters list, resets row animations")
- **Navigation**: where it goes if applicable (e.g. "external link", "opens dialog", "navigates to detail page") — use "-" if no navigation

### 9. Motion

Every animation in the screen — entrances, hovers, transitions, and state changes.


| Element | Event | Property | Duration | Easing | Delay | Notes |
|---------|-------|----------|----------|--------|-------|-------|

- **Element**: what animates
- **Event**: entrance, hover, state change, exit
- **Property**: what property animates (opacity, y, x, scale, background, shadow)
- **Duration**: in seconds (e.g. 0.35s, 0.12s)
- **Easing**: easing function (e.g. ease-out, ease-default)
- **Delay**: delay before animation starts, including stagger formulas (e.g. "0.35 + i * 0.05")
- **Notes**: AnimatePresence mode, whileHover config, CSS vs Framer Motion

### 10. Data Shape

The structure and content rendered on the screen. Not the implementation — just what's visible.

| Collection | Count | Fields | Notes |
|------------|-------|--------|-------|

- **Collection**: what group of items (e.g. "NBA action rows", "filter chips", "stage data")
- **Count**: how many items
- **Fields**: what data each item displays (list the visible fields)
- **Notes**: ordering, filtering, static vs dynamic, any items with special properties (e.g. "2 of 8 actions have cooldown")

## Output Rules

- Every value must reference a design system token where one exists. If a raw value is used (e.g. a hardcoded pixel value or hex color), flag it explicitly.
- Do not describe implementation details: no JSX, no CSS classes, no state management, no event handlers.
- Do not offer suggestions or improvements. The spec documents what exists.
- If a category has no entries for this screen, output the category heading followed by "None."
- Output all 10 categories every time, in order.
