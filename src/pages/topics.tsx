import { Eye } from 'lucide-react'
import { useState } from 'react'

import { LoadingScreen } from '@/components/loading-screen'
import { TopicTreeView } from '@/components/topic-tree-view'
import { TopicsTable } from '@/components/topics-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { db } from '@/db'
import type { Topic } from '@/db/types'
import { useUser } from '@/db/ui-store'
import { Card } from '@/components/ui/card'

export function TopicsPage() {
  const [user] = useUser()
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('tree')

  const { isLoading, error, data } = db.useQuery({
    topics: {
      $: {
        where: {
          'users.id': user.id,
        },
      },
      parents: {},
      children: {
        children: {
          children: {
            children: {
              children: {} // h6
            },
          },
        },
      },
    },
  })

  if (isLoading) return <LoadingScreen />
  if (error) return <div>Error: {error.message}</div>

  const allTopics = data.topics

  const topLevelTopics = allTopics.filter(
    (topic: Topic) => topic.parents?.length === 0
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Topics</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>View Mode</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={viewMode}
                onValueChange={(value: string) => {
                  if (value === 'table' || value === 'tree') {
                    setViewMode(value)
                  }
                }}
              >
                <DropdownMenuRadioItem value="table">
                  Table View
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="tree">
                  Tree View
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="bg-background">
          {viewMode === 'tree' ? (
            <div className="space-y-1 p-4">
              {topLevelTopics.map((topic) => {
                return (
                  <TopicTreeView
                    key={topic.id}
                    topic={topic}
                    path="/topics"
                  />
                )
              })}
            </div>
          ) : (
            <TopicsTable topics={allTopics} />
          )}
        </Card>
      </div>
    </div>
  )
}
