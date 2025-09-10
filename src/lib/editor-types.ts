import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ParagraphElement = {
  type: 'paragraph'
  children: CustomText[]
}

export type HeadingElement = {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: CustomText[]
}

export type QuoteElement = {
  type: 'quote'
  children: CustomText[]
}

export type CodeElement = {
  type: 'code'
  children: CustomText[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  children: ListItemElement[]
}

export type NumberedListElement = {
  type: 'numbered-list'
  children: ListItemElement[]
}

export type ListItemElement = {
  type: 'list-item'
  children: CustomText[]
}

export type TodoListElement = {
  type: 'todo-list'
  children: TodoItemElement[]
}

export type TodoItemElement = {
  type: 'todo-item'
  checked: boolean
  children: CustomText[]
}

export type DividerElement = {
  type: 'divider'
  children: CustomText[]
}

export type ImageElement = {
  type: 'image'
  url: string
  alt?: string
  children: CustomText[]
}

export type LinkElement = {
  type: 'link'
  url: string
  children: CustomText[]
}

export type CustomElement = 
  | ParagraphElement
  | HeadingElement
  | QuoteElement
  | CodeElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | TodoListElement
  | TodoItemElement
  | DividerElement
  | ImageElement
  | LinkElement

export type FormattedText = {
  text: string
  bold?: true
  italic?: true
  underline?: true
  strikethrough?: true
  code?: true
}

export type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

export interface SlashCommand {
  id: string
  title: string
  description: string
  icon: string
  keywords: string[]
  command: () => void
}