import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Summary } from '@/db/types'

import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { MarkdownContent } from './markdown-content'

interface SummaryCardProps {
  summary: Summary
  showDomain?: boolean
}

export function SummaryCard({ summary, showDomain }: SummaryCardProps) {
  const navigate = useNavigate()
  const { id, url, title, description, site, pageTitle } = summary

  return (
    <Card
      key={id}
      className="flex cursor-pointer flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-lg"
      onClick={() => navigate(`/summaries/${id}`)}
    >
      <div>
        <CardHeader className="space-y-2 p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="text-sm text-muted-foreground pr-4">{pageTitle}</div>
            {showDomain && site?.[0].domain && (
              <Badge variant="secondary">{site?.[0].domain}</Badge>
            )}
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <MarkdownContent content={description}/>
        </CardContent>
      </div>
      <CardContent className="flex justify-end p-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-700"
          onClick={(e) => e.stopPropagation()}
        >
          Visit Page <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </CardContent>
    </Card>
  )
}
