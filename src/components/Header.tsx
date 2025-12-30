import { FileText, Github, Layout } from 'lucide-react'
import { useState } from 'react'
import TemplateModal from './TemplateModal'
import SaveTemplateModal from './SaveTemplateModal'
import { useTemplates } from '@/hooks/useTemplates'
import { useEditorContext } from '@/contexts/EditorContext'
import { Template } from '@/types/template'

export default function Header() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false)

  const { presetTemplates, customTemplates, addCustomTemplate, deleteCustomTemplate } =
    useTemplates()
  const { quillInstance, content, currentTheme, applyTheme } = useEditorContext()

  // 应用模板
  const handleApplyTemplate = (template: Template) => {
    if (!quillInstance) return

    // 应用主题
    applyTheme(template.theme)

    // 设置内容
    quillInstance.root.innerHTML = template.content
  }

  // 保存为模板
  const handleSaveAsTemplate = (name: string, description: string) => {
    if (!content.html) {
      throw new Error('当前没有内容可以保存')
    }

    addCustomTemplate(name, description, content.html, currentTheme)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">微信公众号排版工具</h1>
            <p className="text-sm text-gray-500">简洁、免费、易用</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Layout className="w-4 h-4" />
            模板
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            草稿
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            帮助
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        presetTemplates={presetTemplates}
        customTemplates={customTemplates}
        onApplyTemplate={handleApplyTemplate}
        onSaveAsTemplate={() => {
          setIsTemplateModalOpen(false)
          setIsSaveTemplateModalOpen(true)
        }}
        onDeleteTemplate={deleteCustomTemplate}
      />

      {/* Save Template Modal */}
      <SaveTemplateModal
        isOpen={isSaveTemplateModalOpen}
        onClose={() => setIsSaveTemplateModalOpen(false)}
        onSave={handleSaveAsTemplate}
      />
    </header>
  )
}
