import { Node, mergeAttributes } from '@tiptap/core'

export interface TableOfContentsOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tableOfContents: {
      insertTableOfContents: () => ReturnType
    }
  }
}

export const TableOfContents = Node.create<TableOfContentsOptions>({
  name: 'tableOfContents',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="table-of-contents"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'table-of-contents' }), 0]
  },

  addCommands() {
    return {
      insertTableOfContents:
        () =>
        ({ commands, editor }) => {
          const headings = []
          editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'heading') {
              headings.push({
                level: node.attrs.level,
                text: node.textContent,
                pos,
              })
            }
          })

          const toc = `
            <div class="table-of-contents">
              <h2 class="table-of-contents-title">Inhaltsverzeichnis</h2>
              ${headings
                .map(
                  (h) =>
                    `<a href="#heading-${h.pos}" class="toc-entry toc-level-${h.level}">${h.text}</a>`
                )
                .join('\n')}
            </div>
          `

          return commands.insertContent(toc)
        },
    }
  },
}) 