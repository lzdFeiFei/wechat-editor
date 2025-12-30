import { useState, useCallback, useEffect } from 'react'
import { Draft, CreateDraftParams } from '@/types/draft'
import {
  getAllDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
  renameDraft,
  searchDrafts,
  getCurrentDraftId,
  setCurrentDraftId,
  getDraftsCount,
  canCreateDraft,
} from '@/utils/draftStorage'

export interface UseDraftsReturn {
  drafts: Draft[]
  currentDraftId: string | null
  draftsCount: number
  canCreate: boolean
  isLoading: boolean
  error: string | null

  // 操作方法
  loadDrafts: () => void
  createNewDraft: (params: CreateDraftParams) => Draft
  loadDraft: (id: string) => Draft | null
  saveDraft: (id: string, content: string, wordCount: number) => void
  removeDraft: (id: string) => void
  renameDraftTitle: (id: string, newTitle: string) => void
  searchDraftsByText: (searchText: string) => void
  setCurrentDraft: (id: string) => void
  clearError: () => void
}

/**
 * 草稿管理Hook
 */
export function useDrafts(): UseDraftsReturn {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [currentDraftId, setCurrentDraftIdState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载所有草稿
  const loadDrafts = useCallback(() => {
    try {
      setIsLoading(true)
      setError(null)
      const allDrafts = getAllDrafts()
      setDrafts(allDrafts)
      const currentId = getCurrentDraftId()
      setCurrentDraftIdState(currentId)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载草稿失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 初始加载
  useEffect(() => {
    loadDrafts()
  }, [loadDrafts])

  // 创建新草稿
  const createNewDraft = useCallback(
    (params: CreateDraftParams): Draft => {
      try {
        setError(null)
        const newDraft = createDraft(params)
        loadDrafts() // 重新加载列表
        return newDraft
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '创建草稿失败'
        setError(errorMsg)
        throw err
      }
    },
    [loadDrafts]
  )

  // 加载草稿
  const loadDraft = useCallback((id: string): Draft | null => {
    const draft = drafts.find(d => d.id === id)
    if (draft) {
      setCurrentDraftIdState(id)
      setCurrentDraftId(id)
    }
    return draft || null
  }, [drafts])

  // 保存草稿
  const saveDraft = useCallback(
    (id: string, content: string, wordCount: number) => {
      try {
        setError(null)
        updateDraft({
          id,
          content,
          wordCount,
        })
        loadDrafts() // 重新加载以更新时间戳
      } catch (err) {
        setError(err instanceof Error ? err.message : '保存草稿失败')
      }
    },
    [loadDrafts]
  )

  // 删除草稿
  const removeDraft = useCallback(
    (id: string) => {
      try {
        setError(null)
        deleteDraft(id)
        loadDrafts()
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除草稿失败')
      }
    },
    [loadDrafts]
  )

  // 重命名草稿
  const renameDraftTitle = useCallback(
    (id: string, newTitle: string) => {
      try {
        setError(null)
        renameDraft(id, newTitle)
        loadDrafts()
      } catch (err) {
        setError(err instanceof Error ? err.message : '重命名失败')
        throw err
      }
    },
    [loadDrafts]
  )

  // 搜索草稿
  const searchDraftsByText = useCallback((searchText: string) => {
    try {
      setError(null)
      const results = searchDrafts(searchText)
      setDrafts(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索失败')
    }
  }, [])

  // 设置当前草稿
  const setCurrentDraft = useCallback((id: string) => {
    setCurrentDraftIdState(id)
    setCurrentDraftId(id)
  }, [])

  // 清除错误
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    drafts,
    currentDraftId,
    draftsCount: getDraftsCount(),
    canCreate: canCreateDraft(),
    isLoading,
    error,
    loadDrafts,
    createNewDraft,
    loadDraft,
    saveDraft,
    removeDraft,
    renameDraftTitle,
    searchDraftsByText,
    setCurrentDraft,
    clearError,
  }
}
