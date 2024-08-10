// heading-suggestions.tsx
import { useCallback, useState, useEffect } from 'react'

interface HeadingSuggestionsProps {
  items: string[]
  command: (item: string) => void
}

export const HeadingSuggestions = (props: HeadingSuggestionsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = useCallback(
    (index: number) => {
      const item = props.items[index]
      if (item) {
        props.command(item)
      }
    },
    [props.items, props.command]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((selectedIndex + 1) % props.items.length)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        selectItem(selectedIndex)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [props.items, selectItem, selectedIndex])

  return (
    <div className="bg-white shadow-lg rounded-md overflow-hidden">
      {props.items.map((item, index) => (
        <button
          className={`block w-full text-left px-4 py-2 ${
            index === selectedIndex ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
          }`}
          key={index}
          onClick={() => selectItem(index)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
