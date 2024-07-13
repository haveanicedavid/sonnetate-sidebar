import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'

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
              hrefTemplate: (permalink: string) =>
                `#/topics/${permalink.replace(/\//g, '__')}`,
            },
          ],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
