import { useEffect } from 'react'
import Quill from 'quill'

export function useKeyboardShortcuts(quill: Quill | null, onSave?: () => void) {
  useEffect(() => {
    if (!quill) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd 键
      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      if (!isCtrlOrCmd) return

      switch (e.key.toLowerCase()) {
        case 'b':
          // Ctrl+B: 加粗
          e.preventDefault()
          quill.format('bold', !quill.getFormat().bold)
          break

        case 'i':
          // Ctrl+I: 斜体
          e.preventDefault()
          quill.format('italic', !quill.getFormat().italic)
          break

        case 'u':
          // Ctrl+U: 下划线
          e.preventDefault()
          quill.format('underline', !quill.getFormat().underline)
          break

        case 'z':
          // Ctrl+Z: 撤销
          if (e.shiftKey) {
            // Ctrl+Shift+Z: 重做
            e.preventDefault()
            quill.history.redo()
          } else {
            // Ctrl+Z: 撤销
            e.preventDefault()
            quill.history.undo()
          }
          break

        case 'y':
          // Ctrl+Y: 重做
          e.preventDefault()
          quill.history.redo()
          break

        case 's':
          // Ctrl+S: 保存
          e.preventDefault()
          if (onSave) {
            onSave()
          }
          break

        case 'k':
          // Ctrl+K: 插入链接
          e.preventDefault()
          const url = prompt('请输入链接地址:')
          if (url) {
            const selection = quill.getSelection()
            if (selection) {
              quill.format('link', url)
            }
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
  }, [quill, onSave])
}
