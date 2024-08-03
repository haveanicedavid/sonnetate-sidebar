import { BubbleMenu, Editor } from '@tiptap/react'
import { Bold, Code, Italic, List, ListOrdered, Quote, Strikethrough } from 'lucide-react'

import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

import { SelectFormat } from './toolbar/select-format'

interface BubbleMenuBarProps {
  editor: Editor
}

export function BubbleMenuBar({ editor }: BubbleMenuBarProps) {
  if (!editor) {
    return null
  }

  const items = [
    {
      icon: Bold,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: Italic,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: Strikethrough,
      title: 'Strikethrough',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      icon: List,
      title: 'Bullet list',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      title: 'Ordered list',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    // {
    //   icon: Code,
    //   title: 'Code',
    //   action: () => editor.chain().focus().toggleCode().run(),
    //   isActive: () => editor.isActive('code'),
    // },
    // {
    //   icon: Quote,
    //   title: 'Quote',
    //   action: () => editor.chain().focus().toggleBlockquote().run(),
    //   isActive: () => editor.isActive('blockquote'),
    // },
  ]

  return (
    <BubbleMenu
      className="bubble-menu flex items-center space-x-1 rounded-md border border-input bg-background p-1 shadow-md"
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <SelectFormat editor={editor} />
      <div className="h-4 w-px bg-border" />
      {items.map((item, index) => (
        <Toggle
          key={index}
          size="sm"
          pressed={item.isActive()}
          onPressedChange={item.action}
          className={cn(
            'hover:bg-muted data-[state=on]:bg-muted',
            item.isActive() && 'bg-muted'
          )}
        >
          <item.icon className="h-3 w-3" />
        </Toggle>
      ))}
    </BubbleMenu>
  )
}
