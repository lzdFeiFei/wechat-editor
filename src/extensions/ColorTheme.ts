/**
 * ColorTheme Extension for Tiptap
 *
 * Enables快速主题色替换 (Quick Theme Color Change)
 * Allows batch color replacement across the entire document
 */

import { Extension } from '@tiptap/core'
import type { Theme } from '@/types/theme'

export interface ColorThemeOptions {
  currentTheme: Theme | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    colorTheme: {
      /**
       * Apply theme colors to the entire document
       */
      applyTheme: (theme: Theme) => ReturnType
    }
  }
}

export const ColorTheme = Extension.create<ColorThemeOptions>({
  name: 'colorTheme',

  addOptions() {
    return {
      currentTheme: null,
    }
  },

  addCommands() {
    return {
      /**
       * Apply theme colors by traversing the document tree
       */
      applyTheme:
        (theme: Theme) =>
        ({ editor, tr }) => {
          const { doc } = editor.state
          const { colors } = theme

          try {
            // Traverse all nodes in the document
            doc.descendants((node, pos) => {
              // Update heading colors
              if (node.type.name === 'heading') {
                tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  textColor: colors.headingColor,
                })
              }

              // Update paragraph colors
              if (node.type.name === 'paragraph') {
                // Get text marks
                node.content.forEach((child, offset) => {
                  const childPos = pos + offset + 1

                  // Check if it's a text node
                  if (child.isText) {
                    // Apply text color mark
                    const marks = child.marks.filter(mark => mark.type.name !== 'textStyle')
                    const textStyleMark = editor.schema.marks.textStyle.create({
                      color: colors.textColor,
                    })
                    marks.push(textStyleMark)

                    tr.removeMark(childPos, childPos + child.nodeSize, editor.schema.marks.textStyle)
                    tr.addMark(childPos, childPos + child.nodeSize, textStyleMark)
                  }
                })
              }

              // Update link colors
              if (node.marks.some(mark => mark.type.name === 'link')) {
                const linkMark = node.marks.find(mark => mark.type.name === 'link')
                if (linkMark) {
                  const newLinkMark = editor.schema.marks.link.create({
                    ...linkMark.attrs,
                    color: colors.linkColor,
                  })
                  tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.link)
                  tr.addMark(pos, pos + node.nodeSize, newLinkMark)
                }
              }
            })

            // Save current theme
            this.options.currentTheme = theme

            // Dispatch transaction
            if (tr.docChanged) {
              editor.view.dispatch(tr)
            }

            return true
          } catch (error) {
            console.error('Error applying theme:', error)
            return false
          }
        },
    }
  },

  /**
   * Add storage to persist theme
   */
  addStorage() {
    return {
      currentTheme: null,
    }
  },

  onCreate() {
    // Initialize theme from storage if available
    const savedTheme = localStorage.getItem('editor-theme')
    if (savedTheme) {
      try {
        this.options.currentTheme = JSON.parse(savedTheme)
      } catch (error) {
        console.error('Error loading saved theme:', error)
      }
    }
  },
})
