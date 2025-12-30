import { useCallback } from 'react'
import Quill from 'quill'

export function useEditorCommands(quill: Quill | null) {
  // 应用文字颜色
  const applyTextColor = useCallback(
    (color: string) => {
      if (!quill) return
      quill.format('color', color)
      quill.focus()
    },
    [quill]
  )

  // 应用背景色
  const applyBackgroundColor = useCallback(
    (color: string) => {
      if (!quill) return
      const value = color === 'transparent' ? false : color
      quill.format('background', value)
      quill.focus()
    },
    [quill]
  )

  // 应用标题格式
  const applyHeader = useCallback(
    (level: 1 | 2 | 3 | false) => {
      if (!quill) return
      quill.format('header', level)
      quill.focus()
    },
    [quill]
  )

  // 应用加粗
  const toggleBold = useCallback(() => {
    if (!quill) return
    const currentFormat = quill.getFormat()
    quill.format('bold', !currentFormat.bold)
    quill.focus()
  }, [quill])

  // 应用斜体
  const toggleItalic = useCallback(() => {
    if (!quill) return
    const currentFormat = quill.getFormat()
    quill.format('italic', !currentFormat.italic)
    quill.focus()
  }, [quill])

  // 应用下划线
  const toggleUnderline = useCallback(() => {
    if (!quill) return
    const currentFormat = quill.getFormat()
    quill.format('underline', !currentFormat.underline)
    quill.focus()
  }, [quill])

  // 应用删除线
  const toggleStrike = useCallback(() => {
    if (!quill) return
    const currentFormat = quill.getFormat()
    quill.format('strike', !currentFormat.strike)
    quill.focus()
  }, [quill])

  // 应用对齐方式
  const applyAlign = useCallback(
    (align: '' | 'center' | 'right' | 'justify') => {
      if (!quill) return
      quill.format('align', align || false)
      quill.focus()
    },
    [quill]
  )

  // 插入分割线
  const insertDivider = useCallback(() => {
    if (!quill) return
    const range = quill.getSelection()
    if (range) {
      quill.insertText(range.index, '\n')
      quill.insertEmbed(range.index + 1, 'divider', true)
      quill.insertText(range.index + 2, '\n')
      quill.setSelection(range.index + 3, 0)
    }
  }, [quill])

  // 应用引用格式
  const toggleBlockquote = useCallback(() => {
    if (!quill) return
    const currentFormat = quill.getFormat()
    quill.format('blockquote', !currentFormat.blockquote)
    quill.focus()
  }, [quill])

  // 应用代码块格式
  const toggleCodeBlock = useCallback(() => {
    if (!quill) return
    const currentFormat = quill.getFormat()
    quill.format('code-block', !currentFormat['code-block'])
    quill.focus()
  }, [quill])

  // 应用列表
  const applyList = useCallback(
    (type: 'ordered' | 'bullet') => {
      if (!quill) return
      const currentFormat = quill.getFormat()
      if (currentFormat.list === type) {
        quill.format('list', false)
      } else {
        quill.format('list', type)
      }
      quill.focus()
    },
    [quill]
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
