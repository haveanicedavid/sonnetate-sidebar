import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { MarkdownContent } from './markdown-content'

type Summary = {
  id: string
  title: string
  description: string
}

type HorizontalSummaryListProps = {
  summaries: Summary[]
  onSummaryClick: (id: string) => void
}

export function HorizontalSummaryList({
  summaries,
  onSummaryClick,
}: HorizontalSummaryListProps) {
  return (
    <div className="w-full">
      <ScrollArea className="w-full whitespace-normal">
        <div className="flex w-max space-x-4 p-4">
          {summaries.map((item) => (
            <Card
              key={item.id}
              className="w-[300px] cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md"
              onClick={() => onSummaryClick(item.id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-[100px] overflow-hidden">
                  <MarkdownContent
                    content={item.description}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
