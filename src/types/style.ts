// 样式相关类型定义

export interface TextColor {
  name: string
  value: string
}

export interface BackgroundColor {
  name: string
  value: string
}

export interface FontSize {
  name: string
  value: string
}

export interface LineHeight {
  name: string
  value: string
}

export interface Alignment {
  name: string
  value: string
  icon: string
}

// 预设颜色
export const TEXT_COLORS: TextColor[] = [
  { name: '黑色', value: '#000000' },
  { name: '深灰', value: '#333333' },
  { name: '红色', value: '#e74c3c' },
  { name: '橙色', value: '#f39c12' },
  { name: '蓝色', value: '#3498db' },
  { name: '绿色', value: '#27ae60' },
  { name: '紫色', value: '#9b59b6' },
  { name: '粉色', value: '#e91e63' },
]

export const BACKGROUND_COLORS: BackgroundColor[] = [
  { name: '无', value: 'transparent' },
  { name: '浅灰', value: '#f5f5f5' },
  { name: '浅红', value: '#ffebee' },
  { name: '浅橙', value: '#fff3e0' },
  { name: '浅蓝', value: '#e3f2fd' },
  { name: '浅绿', value: '#e8f5e9' },
  { name: '浅紫', value: '#f3e5f5' },
]

// 字体大小
export const FONT_SIZES: FontSize[] = [
  { name: '小字', value: '13px' },
  { name: '正文', value: '15px' },
  { name: '中字', value: '17px' },
  { name: '大字', value: '19px' },
]

// 行距
export const LINE_HEIGHTS: LineHeight[] = [
  { name: '紧凑', value: '1.5' },
  { name: '标准', value: '1.75' },
  { name: '宽松', value: '2.0' },
]
