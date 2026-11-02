import * as React from "react"
import { cn } from "cn"
import { Image, X } from "lucide-react"
import { Button } from "./button"

interface DropzoneProps extends React.ComponentProps<"div"> {
  onFilesSelected?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  preview?: string[]
  onRemovePreview?: (index: number) => void
  icon?: React.ComponentType<{ className?: string }>
  label?: React.ReactNode
  hint?: React.ReactNode
}

function Dropzone({
  className,
  onFilesSelected,
  accept = "image/*",
  multiple = true,
  disabled = false,
  preview = [],
  onRemovePreview,
  icon: Icon = Image,
  label = <>Drop images here or{" "}<span className="text-primary underline underline-offset-2">browse</span></>,
  hint = "PNG, JPG or GIF up to 10MB",
  ...props
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files)
    onFilesSelected?.(files)
  }

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onFilesSelected?.(files)
  }

  return (
    <div className={cn("flex flex-col gap-sm", className)} {...props}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick()
        }}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-sm rounded-md border-2 border-dashed px-xl py-3xl cursor-pointer transition-colors duration-fast ease-default",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center justify-center size-10 rounded-full bg-muted">
          <Icon className="size-icon-default text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center gap-3xs">
          <p className="text-paragraph font-medium">{label}</p>
          {hint && <p className="text-paragraph-sm text-muted-foreground">{hint}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Preview thumbnails */}
      {preview.length > 0 && (
        <div className="flex flex-wrap gap-sm">
          {preview.map((src, i) => (
            <div key={i} className="relative group/preview size-[72px] rounded-md overflow-hidden border border-border">
              <img
                src={src}
                alt=""
                className="size-full object-cover"
              />
              {onRemovePreview && (
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="absolute top-3xs right-3xs opacity-0 group-hover/preview:opacity-100 transition-opacity duration-fast ease-default"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemovePreview(i)
                  }}
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { Dropzone }
export type { DropzoneProps }
