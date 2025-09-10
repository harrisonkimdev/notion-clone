'use client'

import React, { useState } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { Save, FileText, Clock } from 'lucide-react'

export const EditorHeader: React.FC = () => {
  const { 
    title, 
    setTitle, 
    lastSaved, 
    isDirty,
    saveDocument 
  } = useEditorStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [tempTitle, setTempTitle] = useState(title)

  const handleTitleSubmit = () => {
    setTitle(tempTitle)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    }
    if (e.key === 'Escape') {
      setTempTitle(title)
      setIsEditing(false)
    }
  }

  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Never saved'
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Saved just now'
    if (minutes === 1) return 'Saved 1 minute ago'
    if (minutes < 60) return `Saved ${minutes} minutes ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return 'Saved 1 hour ago'
    if (hours < 24) return `Saved ${hours} hours ago`
    
    return date.toLocaleDateString()
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            
            {isEditing ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleKeyDown}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-gray-900 dark:text-gray-100"
                autoFocus
              />
            ) : (
              <h1 
                className="text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-1 transition-colors"
                onClick={() => {
                  setIsEditing(true)
                  setTempTitle(title)
                }}
              >
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatLastSaved(lastSaved)}</span>
              {isDirty && <span className="text-yellow-600 dark:text-yellow-400">•</span>}
            </div>

            <button
              onClick={saveDocument}
              disabled={!isDirty}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}