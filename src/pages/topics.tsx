import { Eye } from 'lucide-react'
import { useState } from 'react'

import { LoadingScreen } from '@/components/loading-screen'
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
import { TopicTreeView } from '@/components/topic-tree-view'


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
      trees: {
        $: {
          where: {
            'user.id': user.id,
          },
        },
        children: {
          topic: {},
          children: {
            topic: {},
            children: {
              topic: {},
              children: {
                topic: {},
                children: {
                  topic: {},
                  children: {
                    topic: {},
                    children: {},
                  },
                },
              },
            },
          },
        },
        topic: {},
      },
    },
  })

  if (isLoading) return <LoadingScreen />
  if (error) return <div>Error: {error.message}</div>

  const allTopics = data.topics

  const filteredTopics = allTopics.filter(
    (topic: Topic) =>
      topic.trees &&
      topic.trees.length > 0 &&
      topic.trees[0].children &&
      topic.trees[0].children.length > 0
  )

  const filteredTrees = filteredTopics.map((topic) => topic.trees)

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
        {viewMode === 'tree' ? (
          <div className="space-y-4">
            {filteredTrees.map((_tree) => {
              const [tree] = _tree
              return <TopicTreeView key={tree.id} tree={tree} defaultOpen />
            })}
          </div>
        ) : (
          <TopicsTable topics={filteredTopics} />
        )}
      </div>
    </div>
  )
}

