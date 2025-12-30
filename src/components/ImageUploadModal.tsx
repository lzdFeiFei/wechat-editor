import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { useEditorContext } from '@/contexts/EditorContext'
import { useImageUpload } from '@/hooks/useImageUpload'
import { formatFileSize, calculateCompressionRatio } from '@/utils/imageProcessor'

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ImageUploadModal({ isOpen, onClose }: ImageUploadModalProps) {
  const { quillInstance } = useEditorContext()
  const { uploadState, uploadImage, resetState } = useImageUpload(quillInstance)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [maxWidth, setMaxWidth] = useState(900)
  const [quality, setQuality] = useState(0.8)

  // 处理文件选择
  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]

      try {
        await uploadImage(file, { maxWidth, quality })
        // 上传成功后延迟关闭，让用户看到成功提示
        setTimeout(() => {
          onClose()
          resetState()
        }, 1500)
      } catch (error) {
        // 错误会在uploadState中显示
        console.error('Upload error:', error)
      }
    },
    [uploadImage, maxWidth, quality, onClose, resetState]
  )

  // 点击上传
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // 关闭时重置状态
  const handleClose = () => {
    onClose()
    resetState()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">上传图片</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Area */}
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-primary bg-blue-50'
                : uploadState.error
                  ? 'border-red-300 bg-red-50'
                  : uploadState.result
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={e => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {uploadState.isUploading ? (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-sm text-gray-600">正在处理图片...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadState.progress}%` }}
                  />
                </div>
              </div>
            ) : uploadState.error ? (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-sm text-red-600">{uploadState.error}</p>
                <button
                  onClick={() => resetState()}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  重新上传
                </button>
              </div>
            ) : uploadState.result ? (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-sm text-green-600 font-medium">上传成功！</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    尺寸: {uploadState.result.width} × {uploadState.result.height}
                  </p>
                  <p>
                    压缩前: {formatFileSize(uploadState.result.originalSize)} → 压缩后:{' '}
                    {formatFileSize(uploadState.result.compressedSize)}
                  </p>
                  <p className="text-green-600 font-medium">
                    压缩率:{' '}
                    {calculateCompressionRatio(
                      uploadState.result.originalSize,
                      uploadState.result.compressedSize
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    点击或拖拽图片到此处上传
                  </p>
                  <p className="text-xs text-gray-500">支持 JPG、PNG、GIF 格式，最大 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">压缩设置</h3>

            {/* Max Width */}
            <div>
              <label className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>最大宽度</span>
                <span className="font-medium text-primary">{maxWidth}px</span>
              </label>
              <input
                type="range"
                min="300"
                max="1200"
                step="50"
                value={maxWidth}
                onChange={e => setMaxWidth(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                disabled={uploadState.isUploading}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>300px</span>
                <span>微信推荐: 900px</span>
                <span>1200px</span>
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>压缩质量</span>
                <span className="font-medium text-primary">{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                disabled={uploadState.isUploading}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>较低 (文件更小)</span>
                <span>较高 (质量更好)</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">温馨提示</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 建议图片宽度不超过 900px，以适配手机屏幕</li>
              <li>• 图片会自动压缩并转为 base64 格式</li>
              <li>• 上传的图片会嵌入到文章中，无需外部图床</li>
              <li>• 过大的图片可能导致微信公众号加载缓慢</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
