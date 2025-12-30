import { useState, useCallback } from 'react'

export interface EditorContent {
  html: string
  text: string
  wordCount: number
  readTime: number
}

export function useEditor() {
  const [content, setContent] = useState<EditorContent>({
    html: '',
    text: '',
    wordCount: 0,
    readTime: 0,
  })

  const updateContent = useCallback((html: string, text: string) => {
    // 计算字数（去除 HTML 标签和空白字符）
    const plainText = text.replace(/<[^>]*>/g, '').trim()
    const wordCount = plainText.length

    // 计算预计阅读时间（假设每分钟阅读 300 字）
    const readTime = Math.ceil(wordCount / 300)

    setContent({
      html,
      text: plainText,
      wordCount,
      readTime,
    })
  }, [])

  return {
    content,
    updateContent,
  }
}
