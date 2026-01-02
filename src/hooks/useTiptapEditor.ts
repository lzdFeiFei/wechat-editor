/**
 * useTiptapEditor Hook
 *
 * Core Tiptap editor initialization hook
 * Configures all extensions, events, and returns editor instance
 */

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

// Custom extensions
import { DividerNode } from '@/extensions/DividerNode'
import { BackgroundColor } from '@/extensions/BackgroundColor'
import { ColorTheme } from '@/extensions/ColorTheme'
import { MarkdownPaste } from '@/extensions/MarkdownPaste'

interface UseTiptapEditorOptions {
  content?: string
  onUpdate?: (html: string, text: string) => void
  onContentChange?: (html: string) => void
  placeholder?: string
  editable?: boolean
}

export function useTiptapEditor({
  content = '',
  onUpdate,
  onContentChange,
  placeholder = '在这里开始编辑你的文章...\n\n快捷键提示：\nCtrl+B 加粗 | Ctrl+I 斜体 | Ctrl+U 下划线\n## 空格 二级标题 | - 空格 无序列表',
  editable = true,
}: UseTiptapEditorOptions = {}) {
  const editor = useEditor({
    extensions: [
      // StarterKit includes: Bold, Italic, Strike, Code, History, etc.
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3], // Only H1-H3 (WeChat compatible)
        },
        history: {
          depth: 100, // Undo history depth
        },
        dropcursor: {
          color: '#3b82f6', // Blue cursor when dragging
          width: 2,
        },
        blockquote: {
          HTMLAttributes: {
            class: 'blockquote',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'ordered-list',
          },
        },
      }),

      // Text formatting extensions
      Underline,
      TextStyle,
      Color,
      BackgroundColor,

      // Text alignment
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'justify',
      }),

      // Image support with Base64
      Image.configure({
        inline: false, // Block-level images
        allowBase64: true, // Support Base64 images
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),

      // Link support
      Link.configure({
        openOnClick: false, // Don't open links when editing
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'editor-link',
        },
      }),

      // Highlight (background color)
      Highlight.configure({
        multicolor: true, // Support multiple colors
        HTMLAttributes: {
          class: 'highlight',
        },
      }),

      // Placeholder text
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),

      // Typography (Markdown shortcuts)
      // Enables automatic Markdown conversion like:
      // - "# " -> H1
      // - "## " -> H2
      // - "- " -> Bullet list
      // - "1. " -> Ordered list
      Typography,

      // Custom extensions
      DividerNode,      // Custom divider/separator
      ColorTheme,       // Theme color management
      MarkdownPaste,    // Markdown paste auto-conversion
    ],

    content,

    editable,

    // Editor props
    editorProps: {
      attributes: {
        class: 'ProseMirror',
        spellcheck: 'true',
      },
      // Handle drop (for image upload)
      handleDrop: () => {
        // Will be handled by Editor component for image upload
        return false
      },
    },

    // On content update
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()

      // Call update callbacks
      onUpdate?.(html, text)
      onContentChange?.(html)
    },

    // On editor created
    onCreate: () => {
      console.log('Tiptap editor created successfully')
    },

    // On editor destroyed
    onDestroy: () => {
      console.log('Tiptap editor destroyed')
    },

    // Auto-focus on mount (optional)
    autofocus: false,
  })

  return editor
}
