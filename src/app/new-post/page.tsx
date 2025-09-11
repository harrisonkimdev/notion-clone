"use client"

import React, { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePostForm } from "@/hooks/usePostForm"

const HEADER_STYLES = "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
const CONTAINER_STYLES = "flex items-center justify-between max-w-4xl mx-auto"
const CARD_STYLES = "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
const TITLE_INPUT_STYLES = "w-full text-3xl font-bold border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
const TEXTAREA_STYLES = "min-h-96 border-none shadow-none resize-none text-lg bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"

export default function NewPostPage() {
  const router = useRouter()
  const { state, setTitle, setContent, togglePreview } = usePostForm()

  const handleSave = useCallback(() => {
    // TODO: Implement save functionality
    console.log("Saving post:", { title: state.title, content: state.content })
    // For now, just go back to home
    router.push("/")
  }, [state.title, state.content, router])

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={HEADER_STYLES}>
        <div className={CONTAINER_STYLES}>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              New Post
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePreview}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>{state.isPreview ? "Edit" : "Preview"}</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className={CARD_STYLES}>
          {!state.isPreview ? (
            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={state.title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={TITLE_INPUT_STYLES}
                />
              </div>
              
              {/* Content Input */}
              <div>
                <Textarea
                  placeholder="Start writing your post..."
                  value={state.content}
                  onChange={(e) => setContent(e.target.value)}
                  className={TEXTAREA_STYLES}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview Mode */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {state.title || "Untitled Post"}
                </h1>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {state.content || "Start writing your post..."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}