import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/react'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

export function BubbleMenuBar({ editor }: { editor: Editor }) {
  if (!editor) {
    return null
  }

  const value = () => {
    if (editor.isActive('paragraph')) return 'paragraph'
    if (editor.isActive('heading', { level: 1 })) return 'h1'
    if (editor.isActive('heading', { level: 2 })) return 'h2'
    if (editor.isActive('heading', { level: 3 })) return 'h3'
    if (editor.isActive('heading', { level: 4 })) return 'h4'
    if (editor.isActive('heading', { level: 5 })) return 'h5'
    if (editor.isActive('heading', { level: 6 })) return 'h6'
  }

  const onChange = (value: string) => {
    switch (value) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run()
        break
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run()
        break
      case 'h4':
        editor.chain().focus().toggleHeading({ level: 4 }).run()
        break
      case 'h5':
        editor.chain().focus().toggleHeading({ level: 5 }).run()
        break
    }
  }

  const items = [
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
  ]

  return (
    <BubbleMenu
      className="bubble-menu flex items-center space-x-1 rounded-md border border-input bg-background p-1 shadow-md"
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <Select onValueChange={onChange} defaultValue={value()} value={value()}>
        <SelectTrigger className="invisible h-8 w-[120px] sm:visible">
          <SelectValue placeholder="Select format" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectGroup>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="h1">H1</SelectItem>
            <SelectItem value="h2">H2</SelectItem>
            <SelectItem value="h3">H3</SelectItem>
            <SelectItem value="h4">H4</SelectItem>
            <SelectItem value="h5">H5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
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
