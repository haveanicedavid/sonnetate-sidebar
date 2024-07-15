import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/db'
import { useUser } from '@/db/ui-store'

export function SummariesPage() {
  const [user] = useUser()
  const navigate = useNavigate()
  const { isLoading, error, data } = db.useQuery({
    summaries: {
      $: {
        where: {
          'user.id': user.id,
        },
      },
    },
  })

  const summaries = data?.summaries || []

  const handleCardClick = (id: string) => {
    navigate(`/summaries/${id}`)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaries.map(({ id, pageTitle, url, title, description }) => (
          <Card
            key={id}
            className="flex flex-col h-[300px] transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer"
            onClick={() => handleCardClick(id)}
          >
            <CardHeader className="flex-shrink-0 p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">
                  {title}
                </CardTitle>
                <Badge variant="secondary">{pageTitle}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-4">
              <p className="line-clamp-4">{description}</p>
            </CardContent>
            <div className="flex-shrink-0 p-4 pt-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:text-blue-700"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Page <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
