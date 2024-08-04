// copied from: https://github.com/aarkue/tiptap-wikilink-extension/blob/main/packages/tiptap-wikilink-extension/src/index.ts
import { Extension } from '@tiptap/core'

import type { OnWikiLinkClick } from './wikilink-node'
import { WikiLinkNode } from './wikilink-node'
import { WikiLinkSuggestion } from './wikilink-suggestion'
import type { RenderSuggestionFunction } from './wikilink-suggestion'

export interface WikiLinkExtensionOptions {
  onWikiLinkClick?: OnWikiLinkClick
  renderSuggestionFunction: RenderSuggestionFunction
}

export const WikiLinkExtension = Extension.create<WikiLinkExtensionOptions>({
  name: 'wikiLinkExtension',

  addExtensions() {
    const extensions = []
    extensions.push(
      WikiLinkSuggestion.configure({
        renderSuggestionFunction: this.options.renderSuggestionFunction,
      })
    )
    extensions.push(
      WikiLinkNode.configure({ onWikiLinkClick: this.options.onWikiLinkClick })
    )

    return extensions
  },
})

export { WikiLinkSuggestion, WikiLinkNode }
