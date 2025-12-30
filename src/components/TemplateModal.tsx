import { X, FileText, Trash2, Plus, Check } from 'lucide-react'
import { Template } from '@/types/template'
import { useState } from 'react'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  presetTemplates: Template[]
  customTemplates: Template[]
  onApplyTemplate: (template: Template) => void
  onSaveAsTemplate: () => void
  onDeleteTemplate: (templateId: string) => void
}

export default function TemplateModal({
  isOpen,
  onClose,
  presetTemplates,
  customTemplates,
  onApplyTemplate,
  onSaveAsTemplate,
  onDeleteTemplate,
}: TemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  if (!isOpen) return null

  const handleApply = () => {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate)
      onClose()
    }
  }

  const handleDelete = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation()
    if (window.confirm('确定要删除这个自定义模板吗？')) {
      onDeleteTemplate(templateId)
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">选择模板</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Preset Templates */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">预设模板</h3>
            <div className="grid grid-cols-3 gap-4">
              {presetTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: template.theme.colors.primary + '20' }}
                    >
                      <FileText
                        className="w-6 h-6"
                        style={{ color: template.theme.colors.primary }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600 line-clamp-3 whitespace-pre-wrap">
                    {template.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Templates */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                自定义模板 ({customTemplates.length}/10)
              </h3>
              <button
                onClick={onSaveAsTemplate}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                保存当前内容为模板
              </button>
            </div>

            {customTemplates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">暂无自定义模板</p>
                <p className="text-xs text-gray-400 mt-1">点击右上角按钮保存当前内容为模板</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {customTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selectedTemplate?.id === template.id && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <button
                      onClick={e => handleDelete(e, template.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: template.theme.colors.primary + '20' }}
                      >
                        <FileText
                          className="w-6 h-6"
                          style={{ color: template.theme.colors.primary }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-600 line-clamp-3 whitespace-pre-wrap">
                      {template.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedTemplate}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              selectedTemplate
                ? 'bg-primary text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            应用模板
          </button>
        </div>
      </div>
    </div>
  )
}
