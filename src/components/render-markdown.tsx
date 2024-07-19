import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'

import { useTopicPathMap } from '@/lib/hooks/use-topic-path-map'
import { cn } from '@/lib/utils'
import '@/styles/markdown.css'

export function RenderMarkdown({
  content,
  disableLinks,
  className,
}: {
  content: string
  disableLinks?: boolean
  className?: string
}) {
  const { topicShortIdByName } = useTopicPathMap()

  return (
    <div className={cn(className, { 'disable-links': disableLinks })}>
      <ReactMarkdown
        className="markdown-content"
        remarkPlugins={[
          remarkGfm,
          [
            remarkWikiLink,
            {
              aliasDivider: '|',
              hrefTemplate: (permalink: string) => {
                // TODO: should this live in the hook?
                const path = permalink
                  .replace(/_/g, ' ')
                  .split('/')
                  .map(
                    (name) =>
                      topicShortIdByName.get(name) || 'ERROR_MD_PATH_LINK'
                  )
                  .join('/')
                return `#/topics/${path}`
              },
            },
          ],
        ]}
        components={{
          a(props) {
            const href = props.node?.properties?.href
            const isInternalLink =
              typeof href === 'string' && href.startsWith('#/')
            if (isInternalLink) {
              return <a {...props} />
            }
            return <a target="_blank" rel="noopener noreferrer" {...props} />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
