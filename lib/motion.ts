/**
 * Motion config — mirrors the CSS tokens in tokens.css
 * Use these values with Framer Motion for orchestrated animations.
 * CSS tokens (duration-fast, ease-default) handle simple component transitions.
 */

export const duration = {
  instant: 0,
  fast: 0.12,
  normal: 0.2,
  slow: 0.35,
  slower: 0.5,
} as const

export const ease = {
  default: [0.25, 0.1, 0.25, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
}

/**
 * Common transition presets
 */
export const transition = {
  fast: { duration: duration.fast, ease: ease.default },
  normal: { duration: duration.normal, ease: ease.out },
  slow: { duration: duration.slow, ease: ease.out },
  enter: { duration: duration.normal, ease: ease.out },
  exit: { duration: duration.fast, ease: ease.in },
} as const

/**
 * Common animation variants for Framer Motion
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
}

export const fadeDown = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export const fadeLeft = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
}

export const fadeRight = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 12 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

/**
 * Stagger children — use on parent container
 * Children use fadeUp/fadeIn variants
 */
export const stagger = (staggerDelay = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
})
