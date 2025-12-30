// 编辑器相关类型
export interface EditorState {
  content: string
  html: string
}

// 样式相关类型
export interface TextStyle {
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
}

// 模板相关类型
export interface Template {
  id: string
  name: string
  description: string
  styles: Record<string, unknown>
}

// 草稿相关类型
export interface Draft {
  id: string
  title: string
  content: string
  updatedAt: number
}
