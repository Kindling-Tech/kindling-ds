# @kindling/ds

The shared design system package for Kindling. One brain, two consumers: the design app (`design`) and the production app (`react-app-2`).

## What's in here

| Directory | Contents |
|-----------|----------|
| `tokens/tokens.css` | Primitive colors (Neutral, Flame, Sage, Wood, Red, Green) and semantic tokens (primary, background, muted, etc.) |
| `index.css` | Tailwind v4 `@theme inline` mapping — connects CSS tokens to Tailwind utilities |
| `components/ui/` | 49 shadcn/ui components (base-nova variant) themed with Kindling tokens, built on Base UI primitives |
| `lib/motion.ts` | Framer Motion presets — durations, easings, transition configs, animation variants (fadeUp, fadeIn, scaleIn, stagger) |
| `lib/utils.ts` | `cn` utility re-export for class merging |
| `hooks/use-mobile.ts` | Mobile breakpoint hook (used by Sidebar component) |

## Design decisions

- **Primary**: Wood Brown 500 (`#381105`)
- **Background**: Sage Green 25 (`#FDFCF9`)
- **Brand**: Flame Orange 500 (`#FF6800`)
- **Border radius**: 4px (`rounded-md`) across all components
- **Font**: Source Sans 3 (body + headings), Geist Mono (code)
- **Component primitives**: Base UI (not Radix)
- **Component size tokens**: `--component-xs` (24px) through `--component-xl` (40px) for interactive element heights

## Installation

Both repos reference this package via GitHub:

```json
{
  "@kindling/ds": "github:Kindling-Tech/kindling-ds#v0.1.0"
}
```

Pin to a tag for stability. To update:

```bash
npm install @kindling/ds@github:Kindling-Tech/kindling-ds#v0.2.0
```

## Usage

```tsx
// Components
import { Button } from '@kindling/ds/components/ui/button'
import { Card } from '@kindling/ds/components/ui/card'

// Motion presets
import { fadeUp, transition, duration, ease } from '@kindling/ds/lib/motion'

// Tokens — import in your CSS
@import "@kindling/ds/tokens/tokens.css";
@import "@kindling/ds/index.css";
```

## Claude skills

Design skills (design-diff, design-lint, design-summary) ship with the package but are **not installed automatically**. To symlink them into your repo's `.claude/skills/`:

```bash
npx kindling-link-skills
```

Run this once after install, or whenever the skills update.

## Prerequisites

Consuming repos must have:

- **Tailwind CSS v4** — the token mapping uses `@theme inline` which is v4 only
- **React 19** — components use React 19 APIs
- **Framer Motion >=11** (or `motion` >=11) — used by image-gallery component
- **Lucide React >=0.400** — icons used across components

## Versioning

Each release is a git tag (`v0.1.0`, `v0.2.0`, etc.). To roll back, change the tag in `package.json` and run `npm install`.

## Update workflow

1. Designer updates tokens/components in this repo and pushes
2. Designer notifies the engineer of what changed
3. Engineer runs `npm install @kindling/ds@github:Kindling-Tech/kindling-ds#vX.Y.Z` in react-app-2
4. Engineer raises a PR with the lockfile update
5. PR merges to staging/prod

## For react-app-2 engineers

This package ships Base UI components. react-app-2 currently uses Radix UI. The migration path:

1. Install `@kindling/ds` — Base UI comes along as a transitive dependency
2. Import shared components from `@kindling/ds` instead of local Radix-based ones
3. Update API usage at each call site (Base UI and Radix have similar structure but different component names and props)
4. Remove Radix packages as they become unused

Both Base UI and Radix can coexist during the transition.

## What lives where

| Concern | Location | Notes |
|---------|----------|-------|
| Tokens, components, motion | This repo (`@kindling/ds`) | Single source of truth |
| Design screens, prototypes | `design` repo | Consumes `@kindling/ds` |
| Production screens | `react-app-2` repo | Consumes `@kindling/ds` |
