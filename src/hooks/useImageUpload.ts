import { useState, useCallback } from 'react'
import Quill from 'quill'
import {
  compressImage,
  type CompressOptions,
  type ImageProcessResult,
} from '@/utils/imageProcessor'

export interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  result: ImageProcessResult | null
}

/**
 * 图片上传Hook
 */
export function useImageUpload(quillInstance: Quill | null) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
  })

  /**
   * 插入图片到编辑器
   */
  const insertImage = useCallback(
    (dataUrl: string, width?: number) => {
      if (!quillInstance) return

      const range = quillInstance.getSelection()
      const index = range ? range.index : quillInstance.getLength()

      // 插入图片
      quillInstance.insertEmbed(index, 'image', dataUrl)

      // 如果指定了宽度，设置图片样式
      if (width) {
        // 获取刚插入的图片元素
        setTimeout(() => {
          const editorElement = quillInstance.root
          const images = editorElement.querySelectorAll('img')
          const lastImage = images[images.length - 1] as HTMLImageElement
          if (lastImage) {
            lastImage.style.maxWidth = '100%'
            lastImage.style.width = `${width}px`
            lastImage.style.height = 'auto'
            lastImage.style.display = 'block'
            lastImage.style.margin = '10px auto'
          }
        }, 0)
      }

      // 在图片后插入换行
      quillInstance.insertText(index + 1, '\n')
      quillInstance.setSelection(index + 2, 0)
    },
    [quillInstance]
  )

  /**
   * 上传图片
   */
  const uploadImage = useCallback(
    async (file: File, options?: CompressOptions) => {
      if (!quillInstance) {
        setUploadState(prev => ({
          ...prev,
          error: '编辑器未初始化',
        }))
        return
      }

      setUploadState({
        isUploading: true,
        progress: 0,
        error: null,
        result: null,
      })

      try {
        // 模拟进度更新
        setUploadState(prev => ({ ...prev, progress: 30 }))

        // 压缩图片
        const result = await compressImage(file, options)

        setUploadState(prev => ({ ...prev, progress: 70 }))

        // 插入到编辑器
        insertImage(result.dataUrl, result.width)

        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
          result,
        })

        return result
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '图片上传失败'

        setUploadState({
          isUploading: false,
          progress: 0,
          error: errorMessage,
          result: null,
        })

        throw error
      }
    },
    [quillInstance, insertImage]
  )

  /**
   * 批量上传图片
   */
  const uploadImages = useCallback(
    async (files: File[], options?: CompressOptions) => {
      const results: ImageProcessResult[] = []
      const errors: string[] = []

      for (const file of files) {
        try {
          const result = await uploadImage(file, options)
          if (result) {
            results.push(result)
          }
        } catch (error) {
          errors.push(
            `${file.name}: ${error instanceof Error ? error.message : '上传失败'}`
          )
        }
      }

      return { results, errors }
    },
    [uploadImage]
  )

  /**
   * 重置状态
   */
  const resetState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      result: null,
    })
  }, [])

  return {
    uploadState,
    uploadImage,
    uploadImages,
    insertImage,
    resetState,
  }
}
