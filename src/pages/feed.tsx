import { format, subDays } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'

type DailyNote = {
  date: Date
  content: string
}

export function FeedPage() {
  const [notes, setNotes] = useState<DailyNote[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const [initialLoad, setInitialLoad] = useState(true)

  const generateMockContent = (date: Date) => {
    return `This is a mock entry for ${format(date, 'MMMM d, yyyy')}. Add your content here.`
  }

  const initializeNotes = useCallback(() => {
    const today = new Date()
    const initialNotes = Array.from({ length: 20 }, (_, i) => ({
      date: subDays(today, i),
      content: generateMockContent(subDays(today, i)),
    }))
    setNotes(initialNotes)
  }, [])

  useEffect(() => {
    initializeNotes()
  }, [initializeNotes])

  useEffect(() => {
    if (initialLoad && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
      setInitialLoad(false)
    }
  }, [notes, initialLoad])

  const loadMorePastNotes = useCallback(() => {
    if (isLoading) return
    setIsLoading(true)

    const oldestDate = notes[0].date
    const newNotes = Array.from({ length: 10 }, (_, i) => ({
      date: subDays(oldestDate, i + 1),
      content: generateMockContent(subDays(oldestDate, i + 1)),
    }))

    setTimeout(() => {
      setNotes(prevNotes => {
        const updatedNotes = [...newNotes.reverse(), ...prevNotes]
        
        requestAnimationFrame(() => {
          if (containerRef.current && topSentinelRef.current) {
            const sentinelPosition = topSentinelRef.current.getBoundingClientRect().top
            containerRef.current.scrollTop += sentinelPosition
          }
        })

        return updatedNotes
      })
      setIsLoading(false)
    }, 500)
  }, [isLoading, notes])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMorePastNotes()
        }
      },
      { threshold: 0.1 }
    )

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current)
    }

    return () => observer.disconnect()
  }, [isLoading, loadMorePastNotes])

  return (
    <div ref={containerRef} className="h-full overflow-y-auto p-4">
      {isLoading && (
        <div className="py-4 text-center">Loading past notes...</div>
      )}
      <div ref={topSentinelRef} className="h-4" />
      {notes.map((note) => (
        <Card key={note.date.toISOString()} className="mb-4">
          <CardContent className="p-4">
            <h2 className="mb-2 text-xl font-semibold">
              {format(note.date, 'MMMM d, yyyy')}
            </h2>
            <p>{note.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
