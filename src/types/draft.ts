import { Theme } from './theme'

/**
 * 草稿类型定义
 */
export interface Draft {
  id: string // 唯一标识
  title: string // 草稿标题
  content: string // HTML内容
  theme: Theme // 关联的主题
  wordCount: number // 字数统计
  createdAt: number // 创建时间戳
  updatedAt: number // 更新时间戳
}

/**
 * 草稿创建参数
 */
export interface CreateDraftParams {
  title?: string
  content: string
  theme: Theme
  wordCount: number
}

/**
 * 草稿更新参数
 */
export interface UpdateDraftParams {
  id: string
  title?: string
  content?: string
  theme?: Theme
  wordCount?: number
}

/**
 * 草稿过滤/搜索参数
 */
export interface DraftFilterParams {
  searchText?: string // 按标题或内容搜索
  sortBy?: 'createdAt' | 'updatedAt' | 'title' // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
}
