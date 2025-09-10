import { create } from 'zustand'
import { Descendant } from 'slate'
import { CustomElement } from '@/lib/editor-types'

export interface EditorState {
  value: Descendant[]
  title: string
  lastSaved: Date | null
  isDirty: boolean
  isSlashMenuOpen: boolean
  slashMenuPosition: { x: number; y: number } | null
  isToolbarOpen: boolean
  toolbarPosition: { x: number; y: number } | null
}

export interface EditorActions {
  setValue: (value: Descendant[]) => void
  setTitle: (title: string) => void
  setLastSaved: (date: Date) => void
  setIsDirty: (isDirty: boolean) => void
  setSlashMenuOpen: (isOpen: boolean, position?: { x: number; y: number } | null) => void
  setToolbarOpen: (isOpen: boolean, position?: { x: number; y: number } | null) => void
  autoSave: () => void
  loadDocument: (id?: string) => void
  saveDocument: () => Promise<void>
}

export type EditorStore = EditorState & EditorActions

const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing...' }],
  },
]

export const useEditorStore = create<EditorStore>((set, get) => ({
  // State
  value: initialValue,
  title: 'Untitled',
  lastSaved: null,
  isDirty: false,
  isSlashMenuOpen: false,
  slashMenuPosition: null,
  isToolbarOpen: false,
  toolbarPosition: null,

  // Actions
  setValue: (value) => set({ value, isDirty: true }),

  setTitle: (title) => set({ title, isDirty: true }),

  setLastSaved: (date) => set({ lastSaved: date, isDirty: false }),

  setIsDirty: (isDirty) => set({ isDirty }),

  setSlashMenuOpen: (isOpen, position = null) =>
    set({ isSlashMenuOpen: isOpen, slashMenuPosition: position }),

  setToolbarOpen: (isOpen, position = null) =>
    set({ isToolbarOpen: isOpen, toolbarPosition: position }),

  autoSave: () => {
    const { isDirty, saveDocument } = get()
    if (isDirty) {
      saveDocument()
    }
  },

  loadDocument: (id) => {
    // Load from localStorage for now
    const key = id ? `document-${id}` : 'current-document'
    const saved = localStorage.getItem(key)
    
    if (saved) {
      try {
        const { value, title } = JSON.parse(saved)
        set({ 
          value: value || initialValue, 
          title: title || 'Untitled',
          isDirty: false,
          lastSaved: new Date()
        })
      } catch (error) {
        console.error('Failed to load document:', error)
        set({ value: initialValue, title: 'Untitled' })
      }
    } else {
      set({ value: initialValue, title: 'Untitled' })
    }
  },

  saveDocument: async () => {
    const { value, title } = get()
    
    try {
      // Save to localStorage for now
      const documentData = {
        value,
        title,
        updatedAt: new Date().toISOString(),
      }
      
      localStorage.setItem('current-document', JSON.stringify(documentData))
      set({ lastSaved: new Date(), isDirty: false })
    } catch (error) {
      console.error('Failed to save document:', error)
    }
  },
}))

// Auto-save every 30 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    const store = useEditorStore.getState()
    store.autoSave()
  }, 30000)
}