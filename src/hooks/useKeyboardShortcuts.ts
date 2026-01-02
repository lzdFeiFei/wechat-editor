/**
 * useKeyboardShortcuts Hook - Tiptap Version
 *
 * Handles keyboard shortcuts for the Tiptap editor
 */

import { useEffect } from 'react'
import type { Editor } from '@tiptap/react'

export function useKeyboardShortcuts(editor: Editor | null, onSave?: () => void) {
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd key
      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      if (!isCtrlOrCmd) return

      switch (e.key.toLowerCase()) {
        case 'b':
          // Ctrl+B: Bold (Tiptap handles this natively, but we prevent double handling)
          // Let Tiptap's built-in handler take care of it
          break

        case 'i':
          // Ctrl+I: Italic
          // Let Tiptap's built-in handler take care of it
          break

        case 'u':
          // Ctrl+U: Underline
          // Let Tiptap's built-in handler take care of it
          break

        case 'z':
          // Ctrl+Z: Undo / Ctrl+Shift+Z: Redo
          // Let Tiptap's built-in handler take care of it
          break

        case 'y':
          // Ctrl+Y: Redo
          // Let Tiptap's built-in handler take care of it
          break

        case 's':
          // Ctrl+S: Save
          e.preventDefault()
          if (onSave) {
            onSave()
          }
          break

        case 'k':
          // Ctrl+K: Insert Link
          e.preventDefault()
          const url = prompt('请输入链接地址:')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
          break

        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, onSave])
}
