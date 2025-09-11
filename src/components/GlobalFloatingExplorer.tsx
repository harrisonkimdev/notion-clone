"use client"

import React, { useMemo } from "react"
import { FloatingExplorer } from "./ui/floating-explorer"
import { FABMenu, type FABAction } from "./ui/fab-menu"
import { useFloatingExplorer } from "./providers/floating-explorer-provider"
import { FolderOpen, PenSquare, Share2, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

const CARD_STYLES = "p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-md transition-all duration-200 cursor-pointer"
const NAVIGATION_CARD_STYLES = "p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-md transition-all duration-200 cursor-pointer"
const SHARE_CARD_STYLES = "p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-md transition-all duration-200 cursor-pointer flex items-center space-x-3"

export function GlobalFloatingExplorer() {
  const { isOpen, setIsOpen, shareOpen, setShareOpen } = useFloatingExplorer()
  const router = useRouter()

  const fabActions: FABAction[] = useMemo(() => [
    {
      id: "explorer",
      icon: <FolderOpen className="h-5 w-5" />,
      label: "Browse",
      onClick: () => setIsOpen(true),
      variant: "secondary"
    },
    {
      id: "new-post",
      icon: <PenSquare className="h-5 w-5" />,
      label: "Write",
      onClick: () => router.push("/new-post"),
      variant: "secondary"
    },
    {
      id: "share",
      icon: <Share2 className="h-5 w-5" />,
      label: "Share",
      onClick: () => setShareOpen(true),
      variant: "secondary"
    }
  ], [setIsOpen, router, setShareOpen])

  return (
    <>
      <FABMenu
        actions={fabActions}
        mainIcon={<Menu className="h-6 w-6" />}
        onToggle={() => {
          // Optional: Handle menu toggle events if needed
        }}
      />

      {/* Document Explorer Modal */}
      <FloatingExplorer
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Document Explorer"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={CARD_STYLES}>
                <div className="text-sm font-medium">New Document</div>
              </div>
              <div className={CARD_STYLES}>
                <div className="text-sm font-medium">New Pile</div>
              </div>
              <div className={CARD_STYLES}>
                <div className="text-sm font-medium">Search</div>
              </div>
              <div className={CARD_STYLES}>
                <div className="text-sm font-medium">Recent Files</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Navigation
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className={NAVIGATION_CARD_STYLES}>
                <div className="text-sm font-medium">Dashboard</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Overview of all piles and documents
                </div>
              </div>
              <div className={NAVIGATION_CARD_STYLES}>
                <div className="text-sm font-medium">Settings</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Customize your workspace
                </div>
              </div>
              <div className={NAVIGATION_CARD_STYLES}>
                <div className="text-sm font-medium">Profile</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Manage your account
                </div>
              </div>
            </div>
          </div>
        </div>
      </FloatingExplorer>

      {/* Share Modal */}
      <FloatingExplorer
        open={shareOpen}
        onOpenChange={setShareOpen}
        title="Share"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Share Options
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div 
                className={SHARE_CARD_STYLES}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  // TODO: Add toast notification
                }}
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Copy Link</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Share this page with others
                  </div>
                </div>
              </div>
              
              <div 
                className={SHARE_CARD_STYLES}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Pile Hive',
                      url: window.location.href
                    })
                  }
                }}
              >
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Share2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Native Share</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Use your device&apos;s share menu
                  </div>
                </div>
              </div>

              <div 
                className={SHARE_CARD_STYLES}
                onClick={() => {
                  const emailBody = encodeURIComponent(`Check out this page: ${window.location.href}`)
                  window.open(`mailto:?subject=Pile Hive&body=${emailBody}`)
                }}
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Share2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Share via email
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FloatingExplorer>
    </>
  )
}