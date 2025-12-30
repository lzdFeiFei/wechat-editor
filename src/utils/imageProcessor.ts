/**
 * 图片处理工具
 * 处理图片上传、压缩和转换
 */

export interface ImageProcessResult {
  dataUrl: string // base64格式的图片数据
  width: number
  height: number
  originalSize: number // 原始大小（字节）
  compressedSize: number // 压缩后大小（字节）
}

/**
 * 压缩配置
 */
export interface CompressOptions {
  maxWidth?: number // 最大宽度，默认900px（微信推荐）
  maxHeight?: number // 最大高度，可选
  quality?: number // 压缩质量 0-1，默认0.8
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxWidth: 900,
  maxHeight: Infinity,
  quality: 0.8,
}

/**
 * 压缩图片
 * @param file 图片文件
 * @param options 压缩选项
 * @returns Promise<ImageProcessResult>
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<ImageProcessResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  return new Promise((resolve, reject) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      reject(new Error('不是有效的图片文件'))
      return
    }

    // 检查文件大小（限制10MB）
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('图片文件不能超过10MB'))
      return
    }

    const reader = new FileReader()

    reader.onerror = () => reject(new Error('读取图片失败'))

    reader.onload = (e) => {
      const img = new Image()

      img.onerror = () => reject(new Error('图片加载失败'))

      img.onload = () => {
        try {
          // 计算压缩后的尺寸
          let { width, height } = img
          const aspectRatio = width / height

          // 根据最大宽度调整
          if (width > opts.maxWidth) {
            width = opts.maxWidth
            height = width / aspectRatio
          }

          // 根据最大高度调整
          if (height > opts.maxHeight) {
            height = opts.maxHeight
            width = height * aspectRatio
          }

          // 创建Canvas
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          // 绘制图片
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('无法创建Canvas上下文'))
            return
          }

          // 使用高质量缩放
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          // 转换为base64
          // 根据原始格式决定输出格式
          let mimeType = file.type
          // 如果是PNG且尺寸较大，转为JPEG以减小体积
          if (mimeType === 'image/png' && file.size > 500 * 1024) {
            mimeType = 'image/jpeg'
          }

          const dataUrl = canvas.toDataURL(mimeType, opts.quality)

          // 计算压缩后的大小
          const compressedSize = Math.round((dataUrl.length * 3) / 4)

          resolve({
            dataUrl,
            width: Math.round(width),
            height: Math.round(height),
            originalSize: file.size,
            compressedSize,
          })
        } catch (error) {
          reject(error)
        }
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 验证图片URL是否有效
 */
export function isValidImageUrl(url: string): boolean {
  return url.startsWith('data:image/') || url.startsWith('http')
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 计算压缩率
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): string {
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1)
  return `${ratio}%`
}
