import { Theme } from '@/types/theme'

// 微信公众号支持的CSS属性
const ALLOWED_CSS_PROPERTIES = [
  'color',
  'font-size',
  'font-weight',
  'font-style',
  'text-decoration',
  'text-align',
  'line-height',
  'letter-spacing',
  'background-color',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-radius',
  'width',
  'height',
  'max-width',
  'display',
]

// 转换HTML为微信格式
export function convertToWechatHTML(html: string, theme: Theme): string {
  // 创建临时DOM元素
  const temp = document.createElement('div')
  temp.innerHTML = html

  // 处理所有元素
  processElement(temp, theme)

  // 返回处理后的HTML
  return temp.innerHTML
}

// 递归处理元素
function processElement(element: HTMLElement, theme: Theme) {
  const children = Array.from(element.children) as HTMLElement[]

  children.forEach(child => {
    // 应用主题样式
    applyThemeStyles(child, theme)

    // 转换class为内联样式
    convertClassToInlineStyle(child)

    // 清理不支持的属性
    cleanUnsupportedAttributes(child)

    // 处理特殊标签
    processSpecialTags(child, theme)

    // 递归处理子元素
    if (child.children.length > 0) {
      processElement(child, theme)
    }
  })
}

// 应用主题样式
function applyThemeStyles(element: HTMLElement, theme: Theme) {
  const tagName = element.tagName.toLowerCase()

  switch (tagName) {
    case 'h1':
    case 'h2':
    case 'h3':
      element.style.color = theme.colors.headingColor
      if (tagName === 'h2') {
        element.style.borderLeftColor = theme.colors.primary
      }
      break

    case 'p':
    case 'li':
      element.style.color = theme.colors.textColor
      break

    case 'a':
      element.style.color = theme.colors.linkColor
      break

    case 'blockquote':
      element.style.backgroundColor = theme.colors.quoteBackground
      element.style.borderLeftColor = theme.colors.quoteBorder
      break

    case 'hr':
      element.style.borderTopColor = theme.colors.dividerColor
      break
  }
}

// 转换class为内联样式
function convertClassToInlineStyle(element: HTMLElement) {
  // 获取计算后的样式
  const computedStyle = window.getComputedStyle(element)

  // 复制允许的CSS属性到内联样式
  ALLOWED_CSS_PROPERTIES.forEach(prop => {
    const value = computedStyle.getPropertyValue(prop)
    if (value && value !== 'none' && value !== 'normal') {
      element.style.setProperty(prop, value)
    }
  })

  // 移除class属性
  element.removeAttribute('class')
}

// 清理不支持的属性
function cleanUnsupportedAttributes(element: HTMLElement) {
  // 移除data-*属性
  Array.from(element.attributes).forEach(attr => {
    if (attr.name.startsWith('data-')) {
      element.removeAttribute(attr.name)
    }
  })

  // 移除contenteditable
  element.removeAttribute('contenteditable')

  // 清理style中不支持的属性
  const style = element.style
  Array.from(style).forEach(prop => {
    if (!ALLOWED_CSS_PROPERTIES.includes(prop)) {
      style.removeProperty(prop)
    }
  })
}

// 处理特殊标签
function processSpecialTags(element: HTMLElement, theme: Theme) {
  const tagName = element.tagName.toLowerCase()

  // 处理分割线
  if (tagName === 'hr' || element.classList.contains('ql-divider')) {
    element.style.border = 'none'
    element.style.borderTop = `2px solid ${theme.colors.dividerColor}`
    element.style.margin = '20px 0'
    element.style.padding = '0'
  }

  // 处理引用框
  if (tagName === 'blockquote') {
    element.style.backgroundColor = theme.colors.quoteBackground
    element.style.borderLeft = `4px solid ${theme.colors.quoteBorder}`
    element.style.padding = '10px 16px'
    element.style.margin = '16px 0'
  }

  // 处理标题
  if (tagName === 'h1') {
    element.style.fontSize = '22px'
    element.style.fontWeight = '700'
    element.style.margin = '20px 0 16px'
  }

  if (tagName === 'h2') {
    element.style.fontSize = '20px'
    element.style.fontWeight = '700'
    element.style.margin = '18px 0 14px'
    element.style.paddingLeft = '12px'
    element.style.borderLeft = `4px solid ${theme.colors.primary}`
  }

  if (tagName === 'h3') {
    element.style.fontSize = '18px'
    element.style.fontWeight = '700'
    element.style.margin = '16px 0 12px'
  }

  // 处理段落
  if (tagName === 'p') {
    element.style.fontSize = '15px'
    element.style.lineHeight = '1.75'
    element.style.margin = '12px 0'
  }

  // 处理图片
  if (tagName === 'img') {
    element.style.maxWidth = '100%'
    element.style.height = 'auto'
    element.style.display = 'block'
    element.style.margin = '10px auto'
    // 保留图片的src属性（base64格式）
  }
}

// 清理空标签
export function cleanEmptyTags(html: string): string {
  const temp = document.createElement('div')
  temp.innerHTML = html

  // 移除空的p标签
  const emptyPs = temp.querySelectorAll('p:empty, p br:only-child')
  emptyPs.forEach(p => {
    if (p.textContent?.trim() === '') {
      p.remove()
    }
  })

  return temp.innerHTML
}

// 生成最终的微信HTML
export function generateWechatHTML(content: string, theme: Theme): string {
  let html = content

  // 清理空标签
  html = cleanEmptyTags(html)

  // 转换为微信格式
  html = convertToWechatHTML(html, theme)

  return html
}
