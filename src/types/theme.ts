// 主题相关类型定义

export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string // 主色调
    headingColor: string // 标题颜色
    textColor: string // 正文颜色
    linkColor: string // 链接颜色
    quoteBackground: string // 引用框背景
    quoteBorder: string // 引用框左边框
    dividerColor: string // 分割线颜色
  }
}

// 预设主题
export const PRESET_THEMES: Theme[] = [
  {
    id: 'classic',
    name: '经典黑白',
    description: '黑色标题，深灰正文，经典耐看',
    colors: {
      primary: '#000000',
      headingColor: '#1a1a1a',
      textColor: '#333333',
      linkColor: '#3b82f6',
      quoteBackground: '#f5f5f5',
      quoteBorder: '#d1d5db',
      dividerColor: '#e5e7eb',
    },
  },
  {
    id: 'tech-blue',
    name: '科技蓝',
    description: '蓝色主题，现代科技感',
    colors: {
      primary: '#3b82f6',
      headingColor: '#1e40af',
      textColor: '#374151',
      linkColor: '#2563eb',
      quoteBackground: '#eff6ff',
      quoteBorder: '#3b82f6',
      dividerColor: '#93c5fd',
    },
  },
  {
    id: 'fresh-green',
    name: '清新绿',
    description: '绿色主题，自然清新',
    colors: {
      primary: '#10b981',
      headingColor: '#065f46',
      textColor: '#374151',
      linkColor: '#059669',
      quoteBackground: '#ecfdf5',
      quoteBorder: '#10b981',
      dividerColor: '#6ee7b7',
    },
  },
  {
    id: 'warm-orange',
    name: '温暖橙',
    description: '橙色主题，温暖活力',
    colors: {
      primary: '#f59e0b',
      headingColor: '#b45309',
      textColor: '#374151',
      linkColor: '#d97706',
      quoteBackground: '#fffbeb',
      quoteBorder: '#f59e0b',
      dividerColor: '#fcd34d',
    },
  },
  {
    id: 'elegant-purple',
    name: '优雅紫',
    description: '紫色主题，优雅高贵',
    colors: {
      primary: '#8b5cf6',
      headingColor: '#5b21b6',
      textColor: '#374151',
      linkColor: '#7c3aed',
      quoteBackground: '#f5f3ff',
      quoteBorder: '#8b5cf6',
      dividerColor: '#c4b5fd',
    },
  },
]

// 获取主题
export function getThemeById(id: string): Theme | undefined {
  return PRESET_THEMES.find(theme => theme.id === id)
}

// 默认主题
export const DEFAULT_THEME = PRESET_THEMES[0]
