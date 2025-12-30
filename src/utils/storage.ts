// 本地存储工具函数

const STORAGE_KEYS = {
  CURRENT_DRAFT: 'wechat_editor_current_draft',
  DRAFTS: 'wechat_editor_drafts',
  TEMPLATES: 'wechat_editor_templates',
  LAST_SAVED: 'wechat_editor_last_saved',
}

// 保存当前草稿
export function saveCurrentDraft(content: string): void {
  try {
    const draft = {
      content,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draft))
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString())
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

// 加载当前草稿
export function loadCurrentDraft(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT)
    if (!saved) return null

    const draft = JSON.parse(saved)
    return draft.content || null
  } catch (error) {
    console.error('Failed to load draft:', error)
    return null
  }
}

// 获取上次保存时间
export function getLastSavedTime(): Date | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_SAVED)
    return saved ? new Date(saved) : null
  } catch (error) {
    console.error('Failed to get last saved time:', error)
    return null
  }
}

// 清除当前草稿
export function clearCurrentDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT)
    localStorage.removeItem(STORAGE_KEYS.LAST_SAVED)
  } catch (error) {
    console.error('Failed to clear draft:', error)
  }
}

// 格式化时间为相对时间（例如："2分钟前"）
export function formatRelativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  return date.toLocaleDateString('zh-CN')
}
