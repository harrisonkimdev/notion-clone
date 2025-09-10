import React, { useState, useEffect, useRef } from 'react'
import { Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { 
  Type, 
  Hash, 
  Quote, 
  Code, 
  List, 
  ListOrdered, 
  Minus,
  Image,
  Link,
  CheckSquare,
  Table
} from 'lucide-react'
import { 
  insertDivider,
  toggleBlock
} from '@/lib/editor-utils'
import { SlashCommand } from '@/lib/editor-types'

interface SlashMenuProps {
  isOpen: boolean
  position: { x: number; y: number } | null
  onClose: () => void
  search: string
}

export const SlashMenu: React.FC<SlashMenuProps> = ({ 
  isOpen, 
  position, 
  onClose, 
  search 
}) => {
  const editor = useSlate()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const commands: SlashCommand[] = [
    {
      id: 'paragraph',
      title: 'Text',
      description: 'Start writing with plain text',
      icon: 'Type',
      keywords: ['text', 'paragraph', 'plain'],
      command: () => {
        Transforms.setNodes(editor, { type: 'paragraph' })
        onClose()
      }
    },
    {
      id: 'heading-1',
      title: 'Heading 1',
      description: 'Big section heading',
      icon: 'Hash',
      keywords: ['heading', 'h1', 'title', 'big'],
      command: () => {
        Transforms.setNodes(editor, { type: 'heading', level: 1 })
        onClose()
      }
    },
    {
      id: 'heading-2',
      title: 'Heading 2',
      description: 'Medium section heading',
      icon: 'Hash',
      keywords: ['heading', 'h2', 'subtitle'],
      command: () => {
        Transforms.setNodes(editor, { type: 'heading', level: 2 })
        onClose()
      }
    },
    {
      id: 'heading-3',
      title: 'Heading 3',
      description: 'Small section heading',
      icon: 'Hash',
      keywords: ['heading', 'h3', 'small'],
      command: () => {
        Transforms.setNodes(editor, { type: 'heading', level: 3 })
        onClose()
      }
    },
    {
      id: 'quote',
      title: 'Quote',
      description: 'Capture a quote',
      icon: 'Quote',
      keywords: ['quote', 'blockquote', 'cite'],
      command: () => {
        Transforms.setNodes(editor, { type: 'quote' })
        onClose()
      }
    },
    {
      id: 'code',
      title: 'Code',
      description: 'Capture a code snippet',
      icon: 'Code',
      keywords: ['code', 'snippet', 'programming'],
      command: () => {
        Transforms.setNodes(editor, { type: 'code' })
        onClose()
      }
    },
    {
      id: 'bulleted-list',
      title: 'Bulleted List',
      description: 'Create a simple bulleted list',
      icon: 'List',
      keywords: ['list', 'bullet', 'unordered'],
      command: () => {
        toggleBlock(editor, 'bulleted-list')
        onClose()
      }
    },
    {
      id: 'numbered-list',
      title: 'Numbered List',
      description: 'Create a list with numbering',
      icon: 'ListOrdered',
      keywords: ['list', 'numbered', 'ordered'],
      command: () => {
        toggleBlock(editor, 'numbered-list')
        onClose()
      }
    },
    {
      id: 'todo-list',
      title: 'To-do List',
      description: 'Track tasks with a to-do list',
      icon: 'CheckSquare',
      keywords: ['todo', 'task', 'checkbox', 'check'],
      command: () => {
        toggleBlock(editor, 'todo-list')
        onClose()
      }
    },
    {
      id: 'divider',
      title: 'Divider',
      description: 'Visually divide blocks',
      icon: 'Minus',
      keywords: ['divider', 'separator', 'line', 'hr'],
      command: () => {
        insertDivider(editor)
        onClose()
      }
    }
  ]

  const filteredCommands = commands.filter(command => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      command.title.toLowerCase().includes(searchLower) ||
      command.description.toLowerCase().includes(searchLower) ||
      command.keywords.some(keyword => keyword.includes(searchLower))
    )
  })

  useEffect(() => {
    setSelectedIndex(0)
  }, [search, filteredCommands])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          )
          break
        case 'Enter':
          event.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].command()
          }
          break
        case 'Escape':
          event.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose])

  if (!isOpen || !position) return null

  const getIcon = (iconName: string) => {
    const icons = {
      Type,
      Hash,
      Quote,
      Code,
      List,
      ListOrdered,
      CheckSquare,
      Minus,
      Image,
      Link,
      Table
    }
    const Icon = icons[iconName as keyof typeof icons] || Type
    return <Icon className="w-4 h-4" />
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-[280px] max-h-[300px] overflow-y-auto"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {filteredCommands.length === 0 ? (
        <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
          No matching commands
        </div>
      ) : (
        filteredCommands.map((command, index) => (
          <button
            key={command.id}
            className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
              index === selectedIndex 
                ? 'bg-gray-100 dark:bg-gray-700' 
                : ''
            }`}
            onClick={() => {
              command.command()
            }}
          >
            <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
              {getIcon(command.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {command.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {command.description}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  )
}