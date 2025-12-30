import { useEffect, useRef } from 'react'

interface AutoSaveOptions {
  delay?: number // 延迟时间（毫秒）
  enabled?: boolean // 是否启用自动保存
}

export function useAutoSave(
  content: string,
  onSave: () => void,
  options: AutoSaveOptions = {}
) {
  const { delay = 30000, enabled = true } = options
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedContent = useRef<string>(content)

  useEffect(() => {
    if (!enabled) return

    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 如果内容没有变化，不需要保存
    if (content === lastSavedContent.current) {
      return
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      onSave()
      lastSavedContent.current = content
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, onSave, delay, enabled])

  // 手动保存
  const save = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    onSave()
    lastSavedContent.current = content
  }

  return { save }
}
