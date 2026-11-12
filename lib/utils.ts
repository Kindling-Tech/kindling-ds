import { createCn } from "cn/config"

/**
 * Custom cn instance that registers our design system's typography utilities
 * with the class merger. Without this, custom text-* classes like
 * text-paragraph-sm get silently dropped during class merging because the
 * default cn engine only recognises standard Tailwind font-size classes.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "heading-1",
            "heading-2",
            "heading-3",
            "heading-4",
            "paragraph-lg",
            "paragraph",
            "paragraph-sm",
            "paragraph-mini",
            "caption",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "foreground",
            "primary-foreground",
            "secondary-foreground",
            "muted-foreground",
            "accent-foreground",
            "card-foreground",
            "popover-foreground",
            "destructive",
          ],
        },
      ],
    },
  },
})
