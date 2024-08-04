import type { Editor } from '@tiptap/core'
import { EditorContent, type JSONContent, useEditor } from '@tiptap/react'

import { BubbleMenuBar } from './bubble-menu'
import { TiptapExtensions } from './extensions'

interface EditorProps {
  content: string
  placeholder?: string
  onChange: ({ text, json }: { text: string; json: JSONContent }) => void
}

export function Tiptap({ content, placeholder, onChange }: EditorProps) {
  const editor = useEditor({
    content: content,
    autofocus: 'end',
    extensions: TiptapExtensions,
    editorProps: {
      attributes: {
        class: 'm-2 focus:outline-none',
      },
    },
    onUpdate: handleUpdate,
  })

  function handleUpdate({ editor }: { editor: Editor }) {
    const json = editor.getJSON()
    const text = editor.getText()
    onChange({ text, json })
  }

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
