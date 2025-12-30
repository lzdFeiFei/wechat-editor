import { X } from 'lucide-react'
import { useState } from 'react'

interface SaveTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, description: string) => void
}

export default function SaveTemplateModal({ isOpen, onClose, onSave }: SaveTemplateModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    // 验证
    if (!name.trim()) {
      setError('请输入模板名称')
      return
    }

    if (name.trim().length > 20) {
      setError('模板名称不能超过20个字符')
      return
    }

    if (description.trim().length > 50) {
      setError('模板描述不能超过50个字符')
      return
    }

    try {
      onSave(name.trim(), description.trim() || '自定义模板')
      // 重置表单
      setName('')
      setDescription('')
      setError('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">保存为模板</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              模板名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="例如：周报模板"
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">{name.length}/20</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">模板描述</label>
            <input
              type="text"
              value={description}
              onChange={e => {
                setDescription(e.target.value)
                setError('')
              }}
              placeholder="简单描述这个模板的用途"
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/50</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-800">
              💡 提示：模板将保存当前编辑器的内容和主题配色方案
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            保存模板
          </button>
        </div>
      </div>
    </div>
  )
}
