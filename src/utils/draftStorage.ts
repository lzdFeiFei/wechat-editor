import { Draft, CreateDraftParams, UpdateDraftParams } from '@/types/draft'

const DRAFTS_KEY = 'wechat_editor_drafts'
const CURRENT_DRAFT_ID_KEY = 'wechat_editor_current_draft_id'
const MAX_DRAFTS = 10

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 生成默认标题
 */
function generateDefaultTitle(index: number): string {
  const now = new Date()
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}`
  return `未命名草稿 ${dateStr} #${index}`
}

/**
 * 获取所有草稿
 */
export function getAllDrafts(): Draft[] {
  try {
    const stored = localStorage.getItem(DRAFTS_KEY)
    if (!stored) return []
    return JSON.parse(stored) as Draft[]
  } catch (error) {
    console.error('Failed to load drafts:', error)
    return []
  }
}

/**
 * 保存所有草稿
 */
function saveDrafts(drafts: Draft[]): void {
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
  } catch (error) {
    console.error('Failed to save drafts:', error)
    throw new Error('保存草稿失败，请检查存储空间')
  }
}

/**
 * 创建新草稿
 */
export function createDraft(params: CreateDraftParams): Draft {
  const drafts = getAllDrafts()

  // 检查数量限制
  if (drafts.length >= MAX_DRAFTS) {
    throw new Error(`最多只能保存${MAX_DRAFTS}个草稿，请先删除一些草稿`)
  }

  const now = Date.now()
  const newDraft: Draft = {
    id: generateId(),
    title: params.title || generateDefaultTitle(drafts.length + 1),
    content: params.content,
    theme: params.theme,
    wordCount: params.wordCount,
    createdAt: now,
    updatedAt: now,
  }

  drafts.unshift(newDraft) // 新草稿放在最前面
  saveDrafts(drafts)

  return newDraft
}

/**
 * 获取单个草稿
 */
export function getDraftById(id: string): Draft | null {
  const drafts = getAllDrafts()
  return drafts.find(draft => draft.id === id) || null
}

/**
 * 更新草稿
 */
export function updateDraft(params: UpdateDraftParams): Draft {
  const drafts = getAllDrafts()
  const index = drafts.findIndex(draft => draft.id === params.id)

  if (index === -1) {
    throw new Error('草稿不存在')
  }

  const updatedDraft: Draft = {
    ...drafts[index],
    ...params,
    updatedAt: Date.now(),
  }

  drafts[index] = updatedDraft
  saveDrafts(drafts)

  return updatedDraft
}

/**
 * 删除草稿
 */
export function deleteDraft(id: string): void {
  const drafts = getAllDrafts()
  const filtered = drafts.filter(draft => draft.id !== id)

  if (filtered.length === drafts.length) {
    throw new Error('草稿不存在')
  }

  saveDrafts(filtered)

  // 如果删除的是当前草稿，清除当前草稿ID
  const currentId = getCurrentDraftId()
  if (currentId === id) {
    clearCurrentDraftId()
  }
}

/**
 * 批量删除草稿
 */
export function deleteDrafts(ids: string[]): void {
  const drafts = getAllDrafts()
  const filtered = drafts.filter(draft => !ids.includes(draft.id))
  saveDrafts(filtered)

  // 如果删除的包含当前草稿，清除当前草稿ID
  const currentId = getCurrentDraftId()
  if (currentId && ids.includes(currentId)) {
    clearCurrentDraftId()
  }
}

/**
 * 重命名草稿
 */
export function renameDraft(id: string, newTitle: string): Draft {
  if (!newTitle.trim()) {
    throw new Error('标题不能为空')
  }

  return updateDraft({
    id,
    title: newTitle.trim(),
  })
}

/**
 * 获取当前草稿ID
 */
export function getCurrentDraftId(): string | null {
  return localStorage.getItem(CURRENT_DRAFT_ID_KEY)
}

/**
 * 设置当前草稿ID
 */
export function setCurrentDraftId(id: string): void {
  localStorage.setItem(CURRENT_DRAFT_ID_KEY, id)
}

/**
 * 清除当前草稿ID
 */
export function clearCurrentDraftId(): void {
  localStorage.removeItem(CURRENT_DRAFT_ID_KEY)
}

/**
 * 搜索草稿
 */
export function searchDrafts(searchText: string): Draft[] {
  const drafts = getAllDrafts()
  if (!searchText.trim()) return drafts

  const query = searchText.toLowerCase()
  return drafts.filter(draft => {
    const titleMatch = draft.title.toLowerCase().includes(query)
    const contentMatch = draft.content.toLowerCase().includes(query)
    return titleMatch || contentMatch
  })
}

/**
 * 获取草稿数量
 */
export function getDraftsCount(): number {
  return getAllDrafts().length
}

/**
 * 检查是否可以创建新草稿
 */
export function canCreateDraft(): boolean {
  return getDraftsCount() < MAX_DRAFTS
}

/**
 * 清空所有草稿
 */
export function clearAllDrafts(): void {
  localStorage.removeItem(DRAFTS_KEY)
  clearCurrentDraftId()
}
