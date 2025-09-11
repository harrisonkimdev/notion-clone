import React from 'react'
import { RenderLeafProps } from 'slate-react'

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let className = ''

  if (leaf.bold) {
    className += ' font-bold'
  }

  if (leaf.italic) {
    className += ' italic'
  }

  if (leaf.underline) {
    className += ' underline'
  }

  if (leaf.strikethrough) {
    className += ' line-through'
  }

  if (leaf.code) {
    className += ' bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono'
  }

  return (
    <span {...attributes} className={className.trim()}>
      {children}
    </span>
  )
}