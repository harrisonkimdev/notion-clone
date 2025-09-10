"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const floatingExplorerVariants = cva(
  "fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6",
  {
    variants: {
      variant: {
        default: "bg-black/40 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const floatingExplorerContentVariants = cva(
  "relative bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ease-out transform",
  {
    variants: {
      size: {
        default: "w-full max-w-4xl h-[67vh] sm:w-2/3",
        mobile: "w-full h-[90vh]",
      },
      state: {
        closed: "translate-y-full opacity-0",
        open: "translate-y-0 opacity-100",
      },
    },
    defaultVariants: {
      size: "default",
      state: "closed",
    },
  }
)

export interface FloatingExplorerProps extends VariantProps<typeof floatingExplorerVariants> {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
  title?: string
  className?: string
}

const FloatingExplorer = React.memo(React.forwardRef<HTMLDivElement, FloatingExplorerProps>(
  ({ className, variant, open, onOpenChange, children, title = "Explorer", ...props }, ref) => {
    const [isMounted, setIsMounted] = React.useState(false)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const startY = React.useRef<number>(0)
    const currentY = React.useRef<number>(0)
    const isDragging = React.useRef<boolean>(false)

    React.useEffect(() => {
      setIsMounted(true)
    }, [])

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
          onOpenChange(false)
        }
      }

      if (open) {
        document.addEventListener("keydown", handleKeyDown)
        document.body.style.overflow = "hidden"
        
        return () => {
          document.removeEventListener("keydown", handleKeyDown)
          document.body.style.overflow = "unset"
        }
      }
    }, [open, onOpenChange])

    const handleBackdropClick = React.useCallback((e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false)
      }
    }, [onOpenChange])

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
      if (!contentRef.current) return
      startY.current = e.touches[0].clientY
      isDragging.current = true
    }, [])

    const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
      if (!isDragging.current || !contentRef.current) return
      
      currentY.current = e.touches[0].clientY
      const deltaY = currentY.current - startY.current
      
      if (deltaY > 0) {
        const translateY = Math.min(deltaY, 200)
        const content = contentRef.current
        content.style.transform = `translateY(${translateY}px)`
        content.style.opacity = `${1 - translateY / 400}`
      }
    }, [])

    const handleTouchEnd = React.useCallback(() => {
      if (!isDragging.current || !contentRef.current) return
      
      const deltaY = currentY.current - startY.current
      const content = contentRef.current
      
      if (deltaY > 100) {
        onOpenChange(false)
      } else {
        content.style.transform = ""
        content.style.opacity = ""
      }
      
      isDragging.current = false
      startY.current = 0
      currentY.current = 0
    }, [onOpenChange])



    if (!isMounted) {
      return null
    }

    return (
      <>
        {open && (
          <div
            ref={ref}
            className={cn(floatingExplorerVariants({ variant, className }))}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="floating-explorer-title"
            {...props}
          >
            <div
              ref={contentRef}
              className={cn(
                floatingExplorerContentVariants({
                  size: (typeof window !== "undefined" && window.innerWidth < 768) ? "mobile" : "default",
                  state: open ? "open" : "closed",
                })
              )}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h2 id="floating-explorer-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close explorer"
                  className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                {children || (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No content to display</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
))
FloatingExplorer.displayName = "FloatingExplorer"

const FloatingExplorerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }
>(({ className, children, asChild = false, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
        className
      )}
      {...props}
    >
      {children || <FolderOpen className="h-6 w-6" />}
    </Button>
  )
})
FloatingExplorerTrigger.displayName = "FloatingExplorerTrigger"

export { FloatingExplorer, FloatingExplorerTrigger, floatingExplorerVariants }