/**
 * WechatSection Extension for Tiptap
 *
 * Wraps content blocks in <section> tags for WeChat compatibility
 * WeChat MP requires content to be wrapped in section tags
 */

import { Node, mergeAttributes } from '@tiptap/core'

export interface WechatSectionOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    wechatSection: {
      /**
       * Wrap selection in a section
       */
      setWechatSection: () => ReturnType
      /**
       * Unwrap section
       */
      unsetWechatSection: () => ReturnType
    }
  }
}

export const WechatSection = Node.create<WechatSectionOptions>({
  name: 'wechatSection',

  group: 'block',

  content: 'block+',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        style: 'margin: 10px 0;',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'section',
      },
      {
        tag: 'div[data-type="wechat-section"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'wechat-section',
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setWechatSection:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name)
        },

      unsetWechatSection:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-S': () => this.editor.commands.setWechatSection(),
    }
  },
})
