import type { JSONContent } from '@tiptap/core'
import { useState } from 'react'

import { Tiptap } from '@/editor/tiptap'

export function JournalPage() {
  const [text, setText] = useState('# Hello\n\n- list')
  const [json, setJson] = useState<JSONContent | null>(null)

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto p-4">
        <Tiptap
          content={text}
          onChange={({ text, json }) => {
            setText(text)
            setJson(json)
          }}
        />
      </div>
    </div>
  )
}
