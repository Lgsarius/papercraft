import { Extension } from '@tiptap/core'

export interface PageSetupOptions {
  margins: {
    top: string
    right: string
    bottom: string
    left: string
  }
  pageSize: {
    width: string
    height: string
  }
  orientation: 'portrait' | 'landscape'
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageSetup: {
      setMargins: (margins: Partial<PageSetupOptions['margins']>) => ReturnType
      setPageSize: (size: 'A4' | 'Letter' | 'Legal') => ReturnType
      setOrientation: (orientation: PageSetupOptions['orientation']) => ReturnType
    }
  }
}

export const PageSetup = Extension.create<PageSetupOptions>({
  name: 'pageSetup',

  addOptions() {
    return {
      margins: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
      pageSize: {
        width: '210mm',
        height: '297mm',
      },
      orientation: 'portrait',
    }
  },

  addCommands() {
    return {
      setMargins:
        (margins) =>
        ({ editor }) => {
          this.options.margins = { ...this.options.margins, ...margins }
          editor.view.updateState(editor.state)
          return true
        },
      setPageSize:
        (size) =>
        ({ editor }) => {
          switch (size) {
            case 'A4':
              this.options.pageSize = { width: '210mm', height: '297mm' }
              break
            case 'Letter':
              this.options.pageSize = { width: '216mm', height: '279mm' }
              break
            case 'Legal':
              this.options.pageSize = { width: '216mm', height: '356mm' }
              break
          }
          editor.view.updateState(editor.state)
          return true
        },
      setOrientation:
        (orientation) =>
        ({ editor }) => {
          this.options.orientation = orientation
          if (orientation === 'landscape') {
            const { width, height } = this.options.pageSize
            this.options.pageSize = { width: height, height: width }
          }
          editor.view.updateState(editor.state)
          return true
        },
    }
  },
}) 