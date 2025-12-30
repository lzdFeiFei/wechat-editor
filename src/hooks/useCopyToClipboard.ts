import { useState, useCallback } from 'react'

interface CopyOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useCopyToClipboard() {
  const [isCopying, setIsCopying] = useState(false)

  const copyHTML = useCallback(async (html: string, options?: CopyOptions) => {
    setIsCopying(true)

    try {
      // 尝试使用现代 Clipboard API
      if (navigator.clipboard && window.ClipboardItem) {
        const htmlBlob = new Blob([html], { type: 'text/html' })
        const textBlob = new Blob([html], { type: 'text/plain' })

        const clipboardItem = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        })

        await navigator.clipboard.write([clipboardItem])
        options?.onSuccess?.()
      } else {
        // 降级方案：使用 document.execCommand
        const textarea = document.createElement('textarea')
        textarea.value = html
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()

        const successful = document.execCommand('copy')
        document.body.removeChild(textarea)

        if (successful) {
          options?.onSuccess?.()
        } else {
          throw new Error('Copy command failed')
        }
      }
    } catch (error) {
      console.error('Copy failed:', error)
      options?.onError?.(error as Error)
    } finally {
      setIsCopying(false)
    }
  }, [])

  return {
    copyHTML,
    isCopying,
  }
}
