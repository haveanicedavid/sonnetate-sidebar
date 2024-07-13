import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

type Summary = {
  id: string
  title: string
  description: string
}

type HorizontalSummaryListProps = {
  summaries: Summary[]
  onViewSummary: (id: string) => void
}

export function HorizontalSummaryList({
  summaries,
  onViewSummary,
}: HorizontalSummaryListProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {summaries.map((item) => (
          <Card
            key={item.id}
            className="w-[250px] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md"
          >
            <CardHeader className="p-4">
              <CardTitle className="truncate text-lg">{item.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onViewSummary(item.id)}
              >
                View Summary <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
