"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const fabMenuVariants = cva(
  "fixed bottom-6 right-6 z-40 flex flex-col items-end",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const fabItemVariants = cva(
  "flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-out transform",
  {
    variants: {
      size: {
        default: "h-12 w-12",
        main: "h-14 w-14",
      },
      variant: {
        default: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
        secondary: "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600",
        back: "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white",
      },
      state: {
        hidden: "opacity-0 scale-0 translate-y-4",
        visible: "opacity-100 scale-100 translate-y-0",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      state: "visible",
    },
  }
)

interface FABAction {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
  variant?: "default" | "secondary"
}

export interface FABMenuProps extends VariantProps<typeof fabMenuVariants> {
  actions: FABAction[]
  mainIcon?: React.ReactNode
  className?: string
  onToggle?: (expanded: boolean) => void
}

const FABMenu = React.memo(React.forwardRef<HTMLDivElement, FABMenuProps>(
  ({ className, variant, actions, mainIcon, onToggle, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false)

    const handleToggle = React.useCallback(() => {
      setIsExpanded(prev => {
        const newExpanded = !prev
        onToggle?.(newExpanded)
        return newExpanded
      })
    }, [onToggle])

    const handleActionClick = React.useCallback((action: FABAction) => {
      action.onClick()
      setIsExpanded(false)
      onToggle?.(false)
    }, [onToggle])

    const staggeredActions = React.useMemo(() => 
      actions.map((action, index) => ({ ...action, index })), 
      [actions]
    )

    return (
      <div
        ref={ref}
        className={cn(fabMenuVariants({ variant, className }))}
        {...props}
      >
        {/* Action buttons - rendered in reverse order so they appear bottom to top */}
        <div className="flex flex-col items-end space-y-3 mb-3">
          {staggeredActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="icon"
              className={cn(
                fabItemVariants({
                  size: "default",
                  variant: action.variant || "secondary",
                  state: isExpanded ? "visible" : "hidden",
                })
              )}
              style={{
                transitionDelay: isExpanded ? `${action.index * 50}ms` : `${(actions.length - action.index - 1) * 50}ms`,
              }}
              onClick={() => handleActionClick(action)}
              aria-label={action.label}
            >
              {action.icon}
            </Button>
          ))}
        </div>

        {/* Main toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            fabItemVariants({
              size: "main",
              variant: isExpanded ? "back" : "default",
            })
          )}
          onClick={handleToggle}
          aria-label={isExpanded ? "Close menu" : "Open menu"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <X className="h-6 w-6 transition-transform duration-300" />
          ) : (
            mainIcon || <FolderOpen className="h-6 w-6 transition-transform duration-300" />
          )}
        </Button>
      </div>
    )
  }
))
FABMenu.displayName = "FABMenu"

export { FABMenu, fabMenuVariants, type FABAction }