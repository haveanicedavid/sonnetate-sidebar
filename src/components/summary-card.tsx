import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Summary } from '@/db/types'

import { RenderMarkdown } from './render-markdown'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface SummaryCardProps {
  summary: Summary
  showDomain?: boolean
}

export function SummaryCard({ summary, showDomain }: SummaryCardProps) {
  const { id, url, title, description, site: sites, pageTitle } = summary
  const site = sites?.[0]

  return (
    <Card key={id} className="flex flex-col justify-between">
      <div>
        <CardHeader className="space-y-2 p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="pr-4 text-sm text-muted-foreground">
              {pageTitle}
            </div>
            {showDomain && site?.domain && (
              <Link to={`/sites/${site.id}`}>
                <Badge variant="secondary">{site.domain}</Badge>
              </Link>
            )}
          </div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <RenderMarkdown content={description + ' [...]'} />
        </CardContent>
      </div>
      <CardContent className="flex justify-between p-4">
        <Button variant="secondary" asChild>
          <Link to={`/summaries/${id}`}>View Summary</Link>
        </Button>
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
