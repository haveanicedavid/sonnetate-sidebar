import { id } from '@instantdb/react'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import { EditorContent, type JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import UniqueId from 'tiptap-unique-id'

import { BubbleMenuBar } from './bubble-menu'

interface EditorProps {
  content: string
  placeholder?: string
  onChange: ({ text, json }: { text: string; json: JSONContent }) => void
}

export const Tiptap = ({ content, placeholder, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenu.configure({
        element: document.querySelector('.bubble-menu') as HTMLElement,
      }),
      Markdown,
      UniqueId.configure({
        attributeName: 'id',
        types: [
          'paragraph',
          'heading',
          'orderedList',
          'bulletList',
          'blockquote'
        ],
        createId: () => id(),
      }),
    ],
    editorProps: {
      attributes: {
        class: 'm-2 focus:outline-none',
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const text = editor.getText()
      onChange({ text, json })
    },
  })

  if (!editor) return null

  return (
    <div className="markdown-content h-full w-full max-w-none border border-input bg-background">
      <BubbleMenuBar editor={editor} />
      <div className="editor">
        <EditorContent
          className="p-4"
          editor={editor}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
