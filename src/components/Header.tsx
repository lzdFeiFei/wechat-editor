import { FileText, Github, Layout, Folder } from 'lucide-react'
import { useState } from 'react'
import TemplateModal from './TemplateModal'
import SaveTemplateModal from './SaveTemplateModal'
import DraftListModal from './DraftListModal'
import HelpModal from './HelpModal'
import { useTemplates } from '@/hooks/useTemplates'
import { useDrafts } from '@/hooks/useDrafts'
import { useEditorContext } from '@/contexts/EditorContext'
import { Template } from '@/types/template'
import { Draft } from '@/types/draft'

export default function Header() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false)
  const [isDraftListModalOpen, setIsDraftListModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  const { presetTemplates, customTemplates, addCustomTemplate, deleteCustomTemplate } =
    useTemplates()
  const {
    drafts,
    currentDraftId,
    draftsCount,
    createNewDraft,
    removeDraft,
    renameDraftTitle,
    searchDraftsByText,
  } = useDrafts()
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

  // 加载草稿
  const handleLoadDraft = (draft: Draft) => {
    if (!quillInstance) return

    // 应用主题
    applyTheme(draft.theme)

    // 设置内容
    quillInstance.root.innerHTML = draft.content
  }

  // 创建新草稿
  const handleCreateDraft = () => {
    if (!content.html || !content.html.trim()) {
      alert('当前没有内容，无法创建草稿')
      return
    }

    try {
      createNewDraft({
        content: content.html,
        theme: currentTheme,
        wordCount: content.wordCount,
      })
      alert('草稿已创建')
    } catch (error) {
      alert(error instanceof Error ? error.message : '创建草稿失败')
    }
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
            className="template-button flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Layout className="w-4 h-4" />
            模板
          </button>
          <button
            onClick={() => setIsDraftListModalOpen(true)}
            className="draft-button flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors relative"
          >
            <Folder className="w-4 h-4" />
            草稿
            {draftsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {draftsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
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

      {/* Draft List Modal */}
      <DraftListModal
        isOpen={isDraftListModalOpen}
        onClose={() => setIsDraftListModalOpen(false)}
        drafts={drafts}
        currentDraftId={currentDraftId}
        maxDrafts={10}
        onLoadDraft={handleLoadDraft}
        onCreateDraft={handleCreateDraft}
        onDeleteDraft={removeDraft}
        onRenameDraft={renameDraftTitle}
        onSearch={searchDraftsByText}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </header>
  )
}
