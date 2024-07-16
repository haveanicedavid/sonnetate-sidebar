import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'

import { treePathToSlug } from '@/lib/url'
import { cn } from '@/lib/utils'
import '@/styles/markdown.css'

export function MarkdownContent({
  content,
  disableLinks,
  className,
}: {
  content: string
  disableLinks?: boolean
  className?: string
}) {
  console.log("🪚 content: string:", content);
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
                console.log("🪚 permalink:", permalink);
                return `#/trees/${treePathToSlug(permalink)}`
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
