import {
  Editor,
  Element as SlateElement,
  Transforms,
  Range,
  Point,
  Node,
} from 'slate'
import { CustomEditor, CustomElement, CustomText } from './editor-types'

export const isBlockActive = (editor: CustomEditor, format: string) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

export const isMarkActive = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = ['numbered-list', 'bulleted-list', 'todo-list'].includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['numbered-list', 'bulleted-list', 'todo-list'].includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = { align: isActive ? undefined : format } as Partial<SlateElement>
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as Partial<SlateElement>
  }
  
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] } as CustomElement
    Transforms.wrapNodes(editor, block)
  }
}

export const toggleMark = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export const insertHeading = (editor: CustomEditor, level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const heading: CustomElement = {
    type: 'heading',
    level,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, heading)
}

export const insertQuote = (editor: CustomEditor) => {
  const quote: CustomElement = {
    type: 'quote',
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, quote)
}

export const insertCodeBlock = (editor: CustomEditor) => {
  const code: CustomElement = {
    type: 'code',
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, code)
}

export const insertDivider = (editor: CustomEditor) => {
  const divider: CustomElement = {
    type: 'divider',
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, divider)
}

export const insertImage = (editor: CustomEditor, url: string, alt?: string) => {
  const image: CustomElement = {
    type: 'image',
    url,
    alt,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, image)
}

export const insertLink = (editor: CustomEditor, url: string) => {
  if (editor.selection) {
    const link: CustomElement = {
      type: 'link',
      url,
      children: [{ text: url }],
    }
    
    if (Range.isCollapsed(editor.selection)) {
      Transforms.insertNodes(editor, link)
    } else {
      Transforms.wrapNodes(editor, link, { split: true })
      Transforms.collapse(editor, { edge: 'end' })
    }
  }
}

export const withCustom = (editor: CustomEditor) => {
  const { deleteBackward, insertBreak } = editor

  editor.deleteBackward = (...args: Parameters<typeof deleteBackward>) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = { type: 'paragraph' } as Partial<SlateElement>
          Transforms.setNodes(editor, newProperties)

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                ['numbered-list', 'bulleted-list', 'todo-list'].includes(n.type),
              split: true,
            })
          }

          return
        }
      }

      deleteBackward(...args)
    }
  }

  editor.insertBreak = (...args: Parameters<typeof insertBreak>) => {
    const { selection } = editor

    if (selection) {
      const match = Editor.above(editor, {
        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
      })

      if (match) {
        const [block] = match

        if (!Editor.isEditor(block) && SlateElement.isElement(block)) {
          if (block.type === 'code') {
            Editor.insertText(editor, '\n')
            return
          }
        }
      }
    }

    insertBreak(...args)
  }

  return editor
}

export const serialize = (nodes: Node[]): string => {
  return nodes.map(n => Node.string(n)).join('\n')
}

export const deserialize = (string: string): CustomElement[] => {
  return string.split('\n').map(line => ({
    type: 'paragraph',
    children: [{ text: line }],
  }))
}

export const getPlainText = (nodes: Node[]): string => {
  return nodes.map(n => Node.string(n)).join('\n')
}