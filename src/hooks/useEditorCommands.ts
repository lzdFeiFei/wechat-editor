/**
 * useEditorCommands Hook - Tiptap Version
 *
 * Provides formatting commands for the Tiptap editor
 */

import { useCallback } from 'react'
import type { Editor } from '@tiptap/react'

export function useEditorCommands(editor: Editor | null) {
  // 应用文字颜色
  const applyTextColor = useCallback(
    (color: string) => {
      if (!editor) return
      editor.chain().focus().setColor(color).run()
    },
    [editor]
  )

  // 应用背景色
  const applyBackgroundColor = useCallback(
    (color: string) => {
      if (!editor) return
      if (color === 'transparent') {
        editor.chain().focus().unsetBackgroundColor().run()
      } else {
        editor.chain().focus().setBackgroundColor(color).run()
      }
    },
    [editor]
  )

  // 应用标题格式
  const applyHeader = useCallback(
    (level: 1 | 2 | 3 | false) => {
      if (!editor) return
      if (level === false) {
        editor.chain().focus().setParagraph().run()
      } else {
        editor.chain().focus().setHeading({ level }).run()
      }
    },
    [editor]
  )

  // 应用加粗
  const toggleBold = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleBold().run()
  }, [editor])

  // 应用斜体
  const toggleItalic = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleItalic().run()
  }, [editor])

  // 应用下划线
  const toggleUnderline = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleUnderline().run()
  }, [editor])

  // 应用删除线
  const toggleStrike = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleStrike().run()
  }, [editor])

  // 应用对齐方式
  const applyAlign = useCallback(
    (align: '' | 'left' | 'center' | 'right' | 'justify') => {
      if (!editor) return
      const alignment = align || 'left'
      editor.chain().focus().setTextAlign(alignment).run()
    },
    [editor]
  )

  // 插入分割线
  const insertDivider = useCallback(() => {
    if (!editor) return
    editor.chain().focus().setDivider().run()
  }, [editor])

  // 应用引用格式
  const toggleBlockquote = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleBlockquote().run()
  }, [editor])

  // 应用代码块格式
  const toggleCodeBlock = useCallback(() => {
    if (!editor) return
    editor.chain().focus().toggleCodeBlock().run()
  }, [editor])

  // 应用列表
  const applyList = useCallback(
    (type: 'ordered' | 'bullet') => {
      if (!editor) return
      if (type === 'ordered') {
        editor.chain().focus().toggleOrderedList().run()
      } else {
        editor.chain().focus().toggleBulletList().run()
      }
    },
    [editor]
  )

  return {
    applyTextColor,
    applyBackgroundColor,
    applyHeader,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrike,
    applyAlign,
    insertDivider,
    toggleBlockquote,
    toggleCodeBlock,
    applyList,
  }
}
