/**
 * Divider Node Extension for Tiptap
 *
 * Replaces the original quill-divider Blot.
 * Creates a custom horizontal divider/separator element.
 */

import { Node, mergeAttributes } from '@tiptap/core'

export interface DividerOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    divider: {
      /**
       * Insert a divider
       */
      setDivider: () => ReturnType
    }
  }
}

export const DividerNode = Node.create<DividerOptions>({
  name: 'divider',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'hr',
      },
      {
        tag: 'div[data-type="divider"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'divider',
        class: 'divider-node',
      }),
      ['hr', { class: 'divider-line' }],
    ]
  },

  addCommands() {
    return {
      setDivider:
        () =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name })
            .run()
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-Minus': () => this.editor.commands.setDivider(),
      'Mod-Shift-_': () => this.editor.commands.setDivider(),
    }
  },
})
