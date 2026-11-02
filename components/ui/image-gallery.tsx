import * as React from "react"
import { cn } from "cn"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus } from "lucide-react"
import { Dropzone } from "./dropzone"
import { Skeleton } from "./skeleton"
import { Button } from "./button"
import { scaleIn, transition } from "../../lib/motion"

interface GalleryImage {
  id: string
  src: string
  status: "uploading" | "complete"
}

const sizeConfig = {
  sm: {
    grid: "grid-cols-[repeat(auto-fill,minmax(120px,1fr))]",
    gap: "gap-sm",
  },
  default: {
    grid: "grid-cols-[repeat(auto-fill,minmax(180px,1fr))]",
    gap: "gap-md",
  },
  lg: {
    grid: "grid-cols-[repeat(auto-fill,minmax(240px,1fr))]",
    gap: "gap-lg",
  },
} as const

interface ImageGalleryProps extends React.ComponentProps<"div"> {
  size?: "sm" | "default" | "lg"
  onImagesChange?: (images: GalleryImage[]) => void
  uploadDuration?: number
}

function ImageGallery({
  className,
  size = "sm",
  onImagesChange,
  uploadDuration = 1500,
  ...props
}: ImageGalleryProps) {
  const [images, setImages] = React.useState<GalleryImage[]>([])
  const addInputRef = React.useRef<HTMLInputElement>(null)
  const config = sizeConfig[size]

  const handleFiles = React.useCallback(
    (files: File[]) => {
      files.forEach((file, i) => {
        const id = crypto.randomUUID()
        const reader = new FileReader()

        reader.onload = () => {
          const src = reader.result as string

          setImages((prev) => {
            const next = [...prev, { id, src, status: "uploading" as const }]
            onImagesChange?.(next)
            return next
          })

          setTimeout(() => {
            setImages((prev) => {
              const next = prev.map((img) =>
                img.id === id ? { ...img, status: "complete" as const } : img
              )
              onImagesChange?.(next)
              return next
            })
          }, uploadDuration + i * 200)
        }

        reader.readAsDataURL(file)
      })
    },
    [uploadDuration, onImagesChange]
  )

  const handleRemove = React.useCallback(
    (id: string) => {
      setImages((prev) => {
        const next = prev.filter((img) => img.id !== id)
        onImagesChange?.(next)
        return next
      })
    },
    [onImagesChange]
  )

  // Empty state — full dropzone
  if (images.length === 0) {
    return (
      <div data-slot="image-gallery" data-size={size} className={cn(className)} {...props}>
        <Dropzone onFilesSelected={handleFiles} />
      </div>
    )
  }

  // Gallery state — grid of images + compact add button
  return (
    <div
      data-slot="image-gallery"
      data-size={size}
      className={cn("flex flex-col gap-sm", className)}
      {...props}
    >
      <div className={cn("grid", config.grid, config.gap)}>
        <AnimatePresence mode="popLayout">
          {images.map((image) => (
            <motion.div
              key={image.id}
              layout
              {...scaleIn}
              transition={transition.enter}
              className="relative aspect-square rounded-md overflow-hidden border border-border group/gallery-item"
            >
              {image.status === "uploading" ? (
                <Skeleton className="size-full" />
              ) : (
                <>
                  <img
                    src={image.src}
                    alt=""
                    className="size-full object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    className="absolute top-3xs right-3xs opacity-0 group-hover/gallery-item:opacity-100 transition-opacity duration-fast ease-default"
                    onClick={() => handleRemove(image.id)}
                  >
                    <X className="size-3" />
                  </Button>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Compact add-more cell */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => addInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") addInputRef.current?.click()
          }}
          className="flex items-center justify-center aspect-square rounded-md border-2 border-dashed border-border cursor-pointer transition-colors duration-fast ease-default hover:border-muted-foreground/50"
        >
          <Plus className="size-icon-default text-muted-foreground" />
          <input
            ref={addInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              if (files.length) handleFiles(files)
              e.target.value = ""
            }}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}

export { ImageGallery }
export type { ImageGalleryProps, GalleryImage }
