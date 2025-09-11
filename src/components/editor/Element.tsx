import { CustomElement } from '@/lib/editor-types'
import React from 'react'
import { RenderElementProps } from 'slate-react'

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = {
    textAlign: (element as { align?: React.CSSProperties['textAlign'] }).align
  }

  switch (element.type) {
    case 'heading':
      const headingElement = element as Extract<CustomElement, { type: 'heading' }>
      const HeadingTag = `h${headingElement.level}` as keyof React.JSX.IntrinsicElements
      const sizeClass = headingElement.level === 1 ? 'text-3xl mb-4' :
        headingElement.level === 2 ? 'text-2xl mb-3' :
          headingElement.level === 3 ? 'text-xl mb-2' :
            headingElement.level === 4 ? 'text-lg mb-2' :
              headingElement.level === 5 ? 'text-base mb-1' :
                'text-sm mb-1'
      return React.createElement(
        HeadingTag,
        {
          ...attributes,
          style,
          className: `font-bold leading-tight ${sizeClass}`
        },
        children
      )
    case 'quote':
      return (
        <blockquote
          {...attributes}
          style={style}
          className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 italic text-gray-700 dark:text-gray-300 my-4"
        >
          {children}
        </blockquote>
      )
    case 'code':
      return (
        <pre
          {...attributes}
          style={style}
          className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 font-mono text-sm overflow-x-auto my-4"
        >
          <code>{children}</code>
        </pre>
      )
    case 'bulleted-list':
      return (
        <ul {...attributes} style={style} className="list-disc list-inside ml-4 my-2">
          {children}
        </ul>
      )
    case 'numbered-list':
      return (
        <ol {...attributes} style={style} className="list-decimal list-inside ml-4 my-2">
          {children}
        </ol>
      )
    case 'list-item':
      return (
        <li {...attributes} style={style} className="mb-1">
          {children}
        </li>
      )
    case 'todo-list':
      return (
        <div {...attributes} style={style} className="my-2">
          {children}
        </div>
      )
    case 'todo-item':
      const todoElement = element as Extract<CustomElement, { type: 'todo-item' }>
      return (
        <div {...attributes} style={style} className="flex items-start gap-2 mb-1">
          <input
            type="checkbox"
            checked={todoElement.checked}
            readOnly
            className="mt-1 rounded"
          />
          <span className={todoElement.checked ? 'line-through text-gray-500 dark:text-gray-400' : ''}>
            {children}
          </span>
        </div>
      )
    case 'divider':
      return (
        <div {...attributes} className="my-8">
          <hr className="border-gray-300 dark:border-gray-600" />
          {children}
        </div>
      )
    case 'image':
      const imageElement = element as Extract<CustomElement, { type: 'image' }>
      return (
        <div {...attributes} className="my-4">
          <img
            src={imageElement.url}
            alt={imageElement.alt || ''}
            className="max-w-full h-auto rounded-md"
          />
          {children}
        </div>
      )
    case 'link':
      const linkElement = element as Extract<CustomElement, { type: 'link' }>
      return (
        <a
          {...attributes}
          href={linkElement.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
        >
          {children}
        </a>
      )
    default:
      return (
        <p {...attributes} style={style} className="mb-2 leading-relaxed">
          {children}
        </p>
      )
  }
}