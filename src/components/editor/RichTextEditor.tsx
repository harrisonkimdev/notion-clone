'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { 
  createEditor, 
  Descendant, 
  Editor, 
  Range, 
  Transforms
} from 'slate'
import { 
  Slate, 
  Editable, 
  withReact, 
  ReactEditor
} from 'slate-react'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'
import { Element } from './Element'
import { Leaf } from './Leaf'
import { SlashMenu } from './SlashMenu'
import { FloatingToolbar } from './FloatingToolbar'
import { withCustom, toggleMark, toggleBlock } from '@/lib/editor-utils'
import { CustomText } from '@/lib/editor-types'
import { useEditorStore } from '@/store/editor-store'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+shift+x': 'strikethrough',
  'mod+e': 'code',
  'mod+shift+7': 'bulleted-list',
  'mod+shift+8': 'numbered-list',
}

export const RichTextEditor: React.FC = () => {
  const {
    value,
    setValue,
    isSlashMenuOpen,
    slashMenuPosition,
    setSlashMenuOpen,
    isToolbarOpen,
    toolbarPosition,
    setToolbarOpen
  } = useEditorStore()
  
  const [slashSearch, setSlashSearch] = useState('')
  const [target, setTarget] = useState<Range | undefined>()

  const editor = useMemo(
    () => withCustom(withHistory(withReact(createEditor()))),
    []
  )

  const renderElement = useCallback((props: Parameters<typeof Element>[0]) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: Parameters<typeof Leaf>[0]) => <Leaf {...props} />, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Handle hotkeys
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey)(event)) {
        event.preventDefault()
        const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS]
        
        if (['bulleted-list', 'numbered-list'].includes(mark)) {
          toggleBlock(editor, mark)
        } else {
          toggleMark(editor, mark as keyof CustomText)
        }
        return
      }
    }

    // Handle slash command
    if (event.key === '/' && editor.selection && Range.isCollapsed(editor.selection)) {
      const { selection } = editor
      const [start] = Range.edges(selection)
      const wordBefore = Editor.before(editor, start, { unit: 'word' })
      const before = wordBefore && Editor.before(editor, wordBefore)
      const beforeRange = before && Editor.range(editor, before, start)
      const beforeText = beforeRange && Editor.string(editor, beforeRange)
      const beforeMatch = beforeText && beforeText.match(/^(\s|^)$/)
      const after = Editor.after(editor, start)
      const afterRange = Editor.range(editor, start, after)
      const afterText = Editor.string(editor, afterRange)
      const afterMatch = afterText.match(/^(\s|$)/)

      if (beforeMatch && afterMatch) {
        setTarget(selection)
        setSlashSearch('')
        
        // Get cursor position for menu
        const domSelection = window.getSelection()
        if (domSelection && domSelection.rangeCount > 0) {
          const range = domSelection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          setSlashMenuOpen(true, { x: rect.left, y: rect.bottom + 5 })
        }
      }
    }

    // Handle slash search
    if (target && isSlashMenuOpen) {
      if (event.key === 'Escape') {
        setSlashMenuOpen(false)
        setTarget(undefined)
        setSlashSearch('')
        return
      }

      if (event.key === 'Backspace') {
        if (slashSearch.length === 0) {
          setSlashMenuOpen(false)
          setTarget(undefined)
          setSlashSearch('')
        }
        return
      }
    }
  }, [editor, target, isSlashMenuOpen, slashSearch, setSlashMenuOpen])

  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue)

    // Handle slash search input
    if (target && isSlashMenuOpen && editor.selection && Range.isCollapsed(editor.selection)) {
      const [start] = Range.edges(editor.selection)
      const range = Editor.range(editor, target, start)
      const text = Editor.string(editor, range)
      
      if (text.startsWith('/')) {
        setSlashSearch(text.slice(1))
      } else {
        setSlashMenuOpen(false)
        setTarget(undefined)
        setSlashSearch('')
      }
    }

    // Handle selection for floating toolbar
    const { selection } = editor
    if (selection && !Range.isCollapsed(selection)) {
      const domSelection = window.getSelection()
      if (domSelection && domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        
        if (rect.width > 0) {
          setToolbarOpen(true, { 
            x: rect.left + rect.width / 2, 
            y: rect.top 
          })
        }
      }
    } else {
      setToolbarOpen(false)
    }
  }, [editor, target, isSlashMenuOpen, setValue, setSlashMenuOpen, setToolbarOpen])

  const handleSlashMenuClose = useCallback(() => {
    setSlashMenuOpen(false)
    setTarget(undefined)
    setSlashSearch('')
    
    // Remove the slash character if menu was closed without selection
    if (target) {
      Transforms.delete(editor, { at: target })
    }
    
    ReactEditor.focus(editor)
  }, [editor, target, setSlashMenuOpen])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const editorElement = ReactEditor.toDOMNode(editor, editor)
      if (!editorElement.contains(event.target as Node)) {
        setSlashMenuOpen(false)
        setToolbarOpen(false)
        setTarget(undefined)
        setSlashSearch('')
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [editor, setSlashMenuOpen, setToolbarOpen])

  return (
    <div className="relative">
      <Slate editor={editor} initialValue={value} onValueChange={handleChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Type '/' for commands..."
          onKeyDown={handleKeyDown}
          className="min-h-[500px] p-4 focus:outline-none prose prose-lg max-w-none dark:prose-invert"
          style={{
            caretColor: 'currentColor',
          }}
        />
        
        <SlashMenu
          isOpen={isSlashMenuOpen}
          position={slashMenuPosition}
          onClose={handleSlashMenuClose}
          search={slashSearch}
        />
        
        <FloatingToolbar
          isOpen={isToolbarOpen}
          position={toolbarPosition}
        />
      </Slate>
    </div>
  )
}