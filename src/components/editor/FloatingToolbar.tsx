import React, { useRef, useEffect } from 'react'
import { useSlate } from 'slate-react'
import { Range, Editor } from 'slate'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code,
  Link as LinkIcon
} from 'lucide-react'
import { toggleMark, isMarkActive, insertLink } from '@/lib/editor-utils'
import { CustomEditor } from '@/lib/editor-types'

interface FloatingToolbarProps {
  isOpen: boolean
  position: { x: number; y: number } | null
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ 
  isOpen, 
  position 
}) => {
  const editor = useSlate() as CustomEditor
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && toolbarRef.current) {
      const toolbar = toolbarRef.current
      const rect = toolbar.getBoundingClientRect()
      
      // Adjust position if toolbar would go off screen
      if (position) {
        let { x, y } = position
        
        if (x + rect.width > window.innerWidth) {
          x = window.innerWidth - rect.width - 10
        }
        if (x < 10) {
          x = 10
        }
        if (y - rect.height < 10) {
          y = y + 40 // Position below selection instead
        }
        
        toolbar.style.left = `${x}px`
        toolbar.style.top = `${y - rect.height - 10}px`
      }
    }
  }, [isOpen, position])

  if (!isOpen || !position || !editor.selection || Range.isCollapsed(editor.selection)) {
    return null
  }

  const handleLinkClick = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      insertLink(editor, url)
    }
  }

  const tools = [
    {
      id: 'bold',
      icon: Bold,
      isActive: isMarkActive(editor, 'bold'),
      onClick: () => toggleMark(editor, 'bold'),
      title: 'Bold (⌘B)'
    },
    {
      id: 'italic',
      icon: Italic,
      isActive: isMarkActive(editor, 'italic'),
      onClick: () => toggleMark(editor, 'italic'),
      title: 'Italic (⌘I)'
    },
    {
      id: 'underline',
      icon: Underline,
      isActive: isMarkActive(editor, 'underline'),
      onClick: () => toggleMark(editor, 'underline'),
      title: 'Underline (⌘U)'
    },
    {
      id: 'strikethrough',
      icon: Strikethrough,
      isActive: isMarkActive(editor, 'strikethrough'),
      onClick: () => toggleMark(editor, 'strikethrough'),
      title: 'Strikethrough (⌘⇧X)'
    },
    {
      id: 'code',
      icon: Code,
      isActive: isMarkActive(editor, 'code'),
      onClick: () => toggleMark(editor, 'code'),
      title: 'Inline Code (⌘E)'
    },
    {
      id: 'link',
      icon: LinkIcon,
      isActive: false,
      onClick: handleLinkClick,
      title: 'Add Link (⌘K)'
    }
  ]

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-1 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-lg px-2 py-1 border border-gray-700"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {tools.map((tool) => {
        const Icon = tool.icon
        return (
          <button
            key={tool.id}
            className={`p-2 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors ${
              tool.isActive ? 'bg-gray-700 dark:bg-gray-600' : ''
            }`}
            onClick={tool.onClick}
            title={tool.title}
          >
            <Icon className="w-4 h-4" />
          </button>
        )
      })}
    </div>
  )
}