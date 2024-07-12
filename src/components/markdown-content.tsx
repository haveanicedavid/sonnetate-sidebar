import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'

import '@/styles/markdown.css'

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
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
