'use client'

import React, { useEffect } from 'react'
import { EditorHeader } from '@/components/editor/EditorHeader'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { useEditorStore } from '@/store/editor-store'

export default function EditorPage() {
  const { loadDocument } = useEditorStore()

  useEffect(() => {
    // Load document on mount
    loadDocument()
  }, [loadDocument])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EditorHeader />
      
      <main className="max-w-4xl mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <RichTextEditor />
        </div>
      </main>

      <div className="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white text-sm rounded-lg px-3 py-2 shadow-lg">
        <div className="font-medium mb-1">Keyboard Shortcuts</div>
        <div className="space-y-1 text-xs">
          <div><kbd className="bg-gray-600 px-1 rounded">⌘B</kbd> Bold</div>
          <div><kbd className="bg-gray-600 px-1 rounded">⌘I</kbd> Italic</div>
          <div><kbd className="bg-gray-600 px-1 rounded">⌘U</kbd> Underline</div>
          <div><kbd className="bg-gray-600 px-1 rounded">/</kbd> Commands</div>
        </div>
      </div>
    </div>
  )
}