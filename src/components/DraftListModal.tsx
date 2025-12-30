import {
  X,
  FileText,
  Trash2,
  Edit2,
  Search,
  Calendar,
  Hash,
  Plus,
  AlertCircle,
} from 'lucide-react'
import { Draft } from '@/types/draft'
import { useState } from 'react'
import { formatRelativeTime } from '@/utils/storage'

interface DraftListModalProps {
  isOpen: boolean
  onClose: () => void
  drafts: Draft[]
  currentDraftId: string | null
  maxDrafts?: number
  onLoadDraft: (draft: Draft) => void
  onCreateDraft: () => void
  onDeleteDraft: (id: string) => void
  onRenameDraft: (id: string, newTitle: string) => void
  onSearch: (searchText: string) => void
}

export default function DraftListModal({
  isOpen,
  onClose,
  drafts,
  currentDraftId,
  maxDrafts = 10,
  onLoadDraft,
  onCreateDraft,
  onDeleteDraft,
  onRenameDraft,
  onSearch,
}: DraftListModalProps) {
  const [searchText, setSearchText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  if (!isOpen) return null

  // 开始编辑
  const handleStartEdit = (draft: Draft) => {
    setEditingId(draft.id)
    setEditingTitle(draft.title)
  }

  // 保存编辑
  const handleSaveEdit = (id: string) => {
    if (editingTitle.trim()) {
      onRenameDraft(id, editingTitle.trim())
    }
    setEditingId(null)
    setEditingTitle('')
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  // 删除草稿
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`确定要删除草稿"${title}"吗？`)) {
      onDeleteDraft(id)
    }
  }

  // 搜索
  const handleSearch = (text: string) => {
    setSearchText(text)
    onSearch(text)
  }

  // 加载草稿
  const handleLoadDraft = (draft: Draft) => {
    onLoadDraft(draft)
    onClose()
  }

  // 创建新草稿
  const handleCreateDraft = () => {
    onCreateDraft()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">草稿管理</h2>
            <p className="text-sm text-gray-500 mt-1">
              已保存 {drafts.length}/{maxDrafts} 个草稿
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索草稿标题或内容..."
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Draft List */}
        <div className="flex-1 overflow-y-auto p-4">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <AlertCircle className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">
                {searchText ? '没有找到匹配的草稿' : '还没有保存的草稿'}
              </p>
              <p className="text-sm mt-2">
                {searchText ? '尝试其他关键词' : '点击下方按钮创建第一个草稿'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map(draft => (
                <div
                  key={draft.id}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    currentDraftId === draft.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: draft.theme.colors.primary + '20',
                      }}
                    >
                      <FileText
                        className="w-5 h-5"
                        style={{ color: draft.theme.colors.primary }}
                      />
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      {editingId === draft.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={e => setEditingTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveEdit(draft.id)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          onBlur={() => handleSaveEdit(draft.id)}
                          autoFocus
                          className="w-full px-2 py-1 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <h3
                          className="font-medium text-gray-900 mb-1 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleLoadDraft(draft)}
                        >
                          {draft.title}
                        </h3>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {draft.wordCount} 字
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatRelativeTime(new Date(draft.updatedAt))}
                        </span>
                      </div>

                      {/* Preview */}
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {draft.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleStartEdit(draft)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                        title="重命名"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(draft.id, draft.title)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCreateDraft}
            disabled={drafts.length >= maxDrafts}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span>{drafts.length >= maxDrafts ? `最多${maxDrafts}个草稿` : '创建新草稿'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
