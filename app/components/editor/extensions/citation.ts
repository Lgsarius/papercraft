import { mergeAttributes, Node } from '@tiptap/core'

export interface CitationOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    citation: {
      setCitation: (attributes: { id: string, text: string }) => ReturnType
    }
  }
}

export const Citation = Node.create<CitationOptions>({
  name: 'citation',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-citation-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }
          return {
            'data-citation-id': attributes.id
          }
        }
      },
      text: {
        default: null
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-citation]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
      { 'data-citation': '' },
      { 'data-citation-id': HTMLAttributes.id },
      { class: 'citation-text' }
    ), HTMLAttributes.text]
  },

  addCommands() {
    return {
      setCitation:
        attributes =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },
})

export default Citation 