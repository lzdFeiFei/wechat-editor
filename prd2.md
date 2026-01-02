# 微信公众号排版工具技术方案文档 v2.0

> 基于对 135编辑器、秀米等主流工具的技术调研，结合现代化开发理念

## 一、技术选型对比与决策

### 1.1 编辑器内核选型

| 方案                | 优势                                                    | 劣势                                           | 适用场景               |
| ------------------- | ------------------------------------------------------- | ---------------------------------------------- | ---------------------- |
| **UEditor**         | 稳定成熟，135/秀米同款；公众号兼容性最好；插件丰富      | 技术老旧（jQuery时代）；维护较少；不支持 React | 快速上线，追求稳定     |
| **Quill.js**        | 轻量现代；API 简洁；模块化设计                          | Markdown 支持需定制；样式系统需自建            | 中小型项目，追求轻量   |
| **Tiptap**          | 现代化架构；原生支持 Markdown；React/Vue 友好；扩展性强 | 相对年轻；中文文档少；学习曲线略陡             | 长期项目，追求体验     |
| **ProseMirror**     | 底层强大；完全可控；性能最优                            | 学习曲线陡；开发周期长                         | 大型复杂项目           |
| **Toast UI Editor** | Markdown + WYSIWYG 双模式；功能完整                     | 体积较大；定制相对困难                         | 需要原生 Markdown 支持 |

### 1.2 最终选型：**Tiptap + React**

**决策理由：**

1. **原生 Markdown 支持** - 解决当前最大痛点
2. **现代化架构** - 基于 ProseMirror，性能和扩展性优秀
3. **React 生态友好** - 与技术栈完美整合
4. **长期可维护** - 活跃的社区和持续更新
5. **完全可控** - 可深度定制样式输出

**备选方案：** 如果 3 个月内无法完成核心功能，降级到 UEditor + 自定义插件

---

## 二、整体架构设计

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端应用层                            │
│                     React 18 + TypeScript                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      UI 组件层                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  工具栏  │  │  编辑器  │  │  预览区  │  │  模板库  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    编辑器核心层                              │
│              Tiptap Editor + Extensions                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - 基础扩展：Bold, Italic, Heading, List...          │  │
│  │  - 自定义扩展：WechatSection, ColorTheme, Template   │  │
│  │  - Markdown 扩展：原生支持 Markdown 语法              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    样式转换层                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - HTML to Inline Styles Converter                   │  │
│  │  - Wechat Compatibility Filter                       │  │
│  │  - Theme Color Replacer                              │  │
│  │  - Section Wrapper Generator                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    数据持久化层                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ LocalStorage│  │  IndexedDB  │  │  图床服务   │        │
│  │  (草稿/设置) │  │  (历史版本) │  │  (图片托管) │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心模块划分

```typescript
src/
├── components/              # React 组件
│   ├── Editor/             # 编辑器主组件
│   │   ├── TiptapEditor.tsx
│   │   ├── MenuBar.tsx     # 工具栏
│   │   └── BubbleMenu.tsx  # 浮动菜单
│   ├── Preview/            # 预览组件
│   │   └── MobilePreview.tsx
│   ├── Sidebar/            # 侧边栏
│   │   ├── StylePanel.tsx
│   │   ├── TemplatePanel.tsx
│   │   └── ThemePanel.tsx
│   └── Toolbar/            # 顶部工具栏
│       └── ActionBar.tsx
│
├── extensions/             # Tiptap 自定义扩展
│   ├── WechatSection.ts   # 公众号 Section 容器
│   ├── ColorTheme.ts      # 主题色系统
│   ├── InlineStyle.ts     # 内联样式处理
│   └── MarkdownPaste.ts   # Markdown 粘贴增强
│
├── converters/            # 格式转换器
│   ├── htmlToWechat.ts   # HTML 转公众号格式
│   ├── markdownToHtml.ts # Markdown 转 HTML
│   └── styleInliner.ts   # CSS 内联化
│
├── templates/            # 样式模板库
│   ├── types.ts
│   ├── presets/         # 预设模板
│   │   ├── minimal.ts
│   │   ├── business.ts
│   │   └── artistic.ts
│   └── components/      # 组件模板
│       ├── heading.ts
│       ├── quote.ts
│       └── divider.ts
│
├── hooks/               # React Hooks
│   ├── useEditor.ts
│   ├── useDraft.ts
│   ├── useTemplate.ts
│   └── useClipboard.ts
│
├── utils/               # 工具函数
│   ├── wechatCompat.ts # 公众号兼容性检查
│   ├── imageCompress.ts# 图片压缩
│   └── colorUtils.ts   # 颜色处理
│
└── stores/              # 状态管理
    ├── editorStore.ts
    ├── themeStore.ts
    └── draftStore.ts
```

---

## 三、核心技术实现

### 3.1 Tiptap 编辑器初始化

```typescript
// src/components/Editor/TiptapEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

// 自定义扩展
import { WechatSection } from '@/extensions/WechatSection'
import { ColorTheme } from '@/extensions/ColorTheme'

export function TiptapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 配置基础扩展
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown.configure({
        // 启用 Markdown 支持
        html: true,
        transformPastedText: true,
      }),
      TextStyle,
      Color,
      // 自定义扩展
      WechatSection,
      ColorTheme,
    ],
    content: '<p>开始编辑...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none',
      },
    },
  })

  return (
    <div className="editor-wrapper">
      <EditorContent editor={editor} />
    </div>
  )
}
```

### 3.2 自定义 Section 扩展（核心）

```typescript
// src/extensions/WechatSection.ts
import { Node, mergeAttributes } from '@tiptap/core'

export interface WechatSectionOptions {
  HTMLAttributes: Record<string, any>
}

export const WechatSection = Node.create<WechatSectionOptions>({
  name: 'wechatSection',

  group: 'block',
  content: 'block+',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'section' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-wechat-section': 'true',
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setWechatSection:
        attributes =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },

      toggleWechatSection:
        attributes =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes)
        },
    }
  },
})
```

### 3.3 样式内联化转换器

```typescript
// src/converters/styleInliner.ts
import juice from 'juice'

interface InlineOptions {
  removeStyleTags?: boolean
  preserveMediaQueries?: boolean
  preserveFontFaces?: boolean
}

export class StyleInliner {
  /**
   * 将 CSS 类转换为内联样式
   */
  static toInline(html: string, options: InlineOptions = {}): string {
    const defaultOptions = {
      removeStyleTags: true,
      preserveMediaQueries: false,
      preserveFontFaces: false,
      ...options,
    }

    // 使用 juice 库转换
    const inlinedHtml = juice(html, defaultOptions)

    // 清理微信不支持的样式
    return this.cleanWechatStyles(inlinedHtml)
  }

  /**
   * 清理微信公众号不支持的 CSS 属性
   */
  private static cleanWechatStyles(html: string): string {
    const unsupportedProps = [
      'position',
      'float',
      'z-index',
      'transform',
      'animation',
      'transition',
      '@font-face',
      'flex(?!-direction)', // 保留 flex-direction
    ]

    const pattern = new RegExp(`(${unsupportedProps.join('|')})\\s*:[^;]+;?`, 'gi')

    return html.replace(pattern, '')
  }

  /**
   * 转换颜色值为内联样式
   */
  static replaceColors(html: string, colorMap: Record<string, string>): string {
    let result = html

    for (const [oldColor, newColor] of Object.entries(colorMap)) {
      const regex = new RegExp(oldColor, 'gi')
      result = result.replace(regex, newColor)
    }

    return result
  }
}
```

### 3.4 Markdown 增强处理

````typescript
// src/extensions/MarkdownPaste.ts
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { marked } from 'marked'

export const MarkdownPaste = Extension.create({
  name: 'markdownPaste',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownPaste'),

        props: {
          handlePaste: (view, event, slice) => {
            const text = event.clipboardData?.getData('text/plain')

            if (!text || !this.isMarkdown(text)) {
              return false
            }

            // 转换 Markdown 为 HTML
            const html = marked.parse(text, {
              breaks: true,
              gfm: true,
            })

            // 插入转换后的内容
            const { tr } = view.state
            const parser = view.state.schema
            const doc = parser.nodeFromJSON(html)

            view.dispatch(tr.replaceSelection(doc))

            return true
          },
        },
      }),
    ]
  },

  isMarkdown(text: string): boolean {
    const markdownPatterns = [
      /^#{1,6}\s/m, // 标题
      /\*\*.*?\*\*/, // 粗体
      /\[.*?\]\(.*?\)/, // 链接
      /^[-*+]\s/m, // 列表
      /```[\s\S]*?```/, // 代码块
      /^\d+\.\s/m, // 有序列表
    ]

    return markdownPatterns.some(pattern => pattern.test(text))
  },
})
````

### 3.5 公众号格式转换器

```typescript
// src/converters/htmlToWechat.ts
import { StyleInliner } from './styleInliner'

export class WechatConverter {
  /**
   * 将编辑器 HTML 转换为公众号兼容格式
   */
  static convert(html: string, options: ConvertOptions = {}): string {
    // 1. 包裹 section 标签
    let wechatHtml = this.wrapSections(html)

    // 2. 转换为内联样式
    wechatHtml = StyleInliner.toInline(wechatHtml)

    // 3. 应用公众号标准样式
    wechatHtml = this.applyWechatStyles(wechatHtml, options)

    // 4. 兼容性检查和修复
    wechatHtml = this.compatibilityCheck(wechatHtml)

    return wechatHtml
  }

  /**
   * 用 section 标签包裹内容块
   */
  private static wrapSections(html: string): string {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // 遍历顶层元素，用 section 包裹
    const body = doc.body
    const children = Array.from(body.children)

    children.forEach(child => {
      if (child.tagName !== 'SECTION') {
        const section = doc.createElement('section')
        section.setAttribute('style', 'margin: 10px 0;')

        // 将子元素移到 section 中
        child.parentNode?.insertBefore(section, child)
        section.appendChild(child)
      }
    })

    return body.innerHTML
  }

  /**
   * 应用公众号标准样式
   */
  private static applyWechatStyles(html: string, options: ConvertOptions): string {
    const styles = {
      p: 'font-size: 15px; line-height: 1.75; letter-spacing: 0.5px; color: #333; text-align: justify; margin: 10px 0;',
      h1: 'font-size: 22px; font-weight: bold; line-height: 1.4; color: #333; margin: 20px 0 10px;',
      h2: 'font-size: 20px; font-weight: bold; line-height: 1.4; color: #333; margin: 18px 0 10px; padding-left: 10px; border-left: 4px solid #3B82F6;',
      h3: 'font-size: 18px; font-weight: bold; line-height: 1.4; color: #333; margin: 16px 0 8px;',
      blockquote:
        'padding: 10px 15px; margin: 15px 0; background: #f5f5f5; border-left: 4px solid #ddd; color: #666;',
      code: 'padding: 2px 6px; margin: 0 2px; background: #f5f5f5; border-radius: 3px; font-family: Consolas, Monaco, monospace; font-size: 14px;',
      pre: 'padding: 15px; margin: 15px 0; background: #f5f5f5; border-radius: 4px; overflow-x: auto;',
      img: 'max-width: 100%; height: auto; display: block; margin: 15px auto;',
      ul: 'padding-left: 20px; margin: 10px 0;',
      ol: 'padding-left: 20px; margin: 10px 0;',
      li: 'line-height: 1.8; margin: 5px 0;',
    }

    // 应用样式到对应标签
    let result = html
    for (const [tag, style] of Object.entries(styles)) {
      const regex = new RegExp(`<${tag}([^>]*)>`, 'gi')
      result = result.replace(regex, (match, attrs) => {
        // 合并已有样式和新样式
        const existingStyle = attrs.match(/style="([^"]*)"/)?.[1] || ''
        const mergedStyle = existingStyle ? `${style} ${existingStyle}` : style
        return `<${tag}${attrs.replace(/style="[^"]*"/, '')} style="${mergedStyle}">`
      })
    }

    return result
  }

  /**
   * 兼容性检查
   */
  private static compatibilityCheck(html: string): string {
    // 移除不支持的标签
    const unsupportedTags = ['script', 'style', 'iframe', 'form', 'input']
    let result = html

    unsupportedTags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi')
      result = result.replace(regex, '')
    })

    // 检查图片链接是否有效
    result = result.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/gi, (match, before, src, after) => {
      if (!src.startsWith('http://') && !src.startsWith('https://')) {
        console.warn('图片链接无效:', src)
        return `<!-- 无效图片: ${src} -->`
      }
      return match
    })

    return result
  }
}

interface ConvertOptions {
  themeColor?: string
  fontSize?: number
  lineHeight?: number
}
```

### 3.6 模板系统

```typescript
// src/templates/types.ts
export interface StyleTemplate {
  id: string
  name: string
  category: 'preset' | 'custom'
  thumbnail?: string
  styles: {
    heading1?: StyleConfig
    heading2?: StyleConfig
    heading3?: StyleConfig
    paragraph?: StyleConfig
    quote?: StyleConfig
    code?: StyleConfig
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    textColor: string
    backgroundColor: string
  }
}

export interface StyleConfig {
  fontSize: string
  fontWeight: string
  lineHeight: string
  color: string
  margin: string
  padding: string
  border?: string
  background?: string
  borderRadius?: string
  [key: string]: string | undefined
}

// src/templates/presets/minimal.ts
export const minimalTemplate: StyleTemplate = {
  id: 'minimal',
  name: '极简风格',
  category: 'preset',
  styles: {
    heading1: {
      fontSize: '22px',
      fontWeight: 'bold',
      lineHeight: '1.4',
      color: '#1a1a1a',
      margin: '20px 0 10px',
      padding: '0',
    },
    heading2: {
      fontSize: '20px',
      fontWeight: 'bold',
      lineHeight: '1.4',
      color: '#1a1a1a',
      margin: '18px 0 10px',
      padding: '0 0 0 10px',
      borderLeft: '3px solid #1a1a1a',
    },
    paragraph: {
      fontSize: '15px',
      fontWeight: 'normal',
      lineHeight: '1.75',
      color: '#333',
      margin: '10px 0',
      padding: '0',
    },
    quote: {
      fontSize: '14px',
      fontWeight: 'normal',
      lineHeight: '1.7',
      color: '#666',
      margin: '15px 0',
      padding: '10px 15px',
      background: '#f9f9f9',
      borderLeft: '4px solid #ddd',
    },
  },
  theme: {
    primaryColor: '#1a1a1a',
    secondaryColor: '#666',
    textColor: '#333',
    backgroundColor: '#fff',
  },
}
```

### 3.7 一键复制功能

```typescript
// src/hooks/useClipboard.ts
import { useCallback } from 'react'
import { WechatConverter } from '@/converters/htmlToWechat'

export function useClipboard() {
  const copyToWechat = useCallback(async (editor: Editor) => {
    try {
      // 1. 获取编辑器 HTML
      const html = editor.getHTML()

      // 2. 转换为公众号格式
      const wechatHtml = WechatConverter.convert(html)

      // 3. 创建临时 DOM 元素
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = wechatHtml
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      document.body.appendChild(tempDiv)

      // 4. 选择内容
      const range = document.createRange()
      range.selectNodeContents(tempDiv)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)

      // 5. 复制到剪贴板
      const success = document.execCommand('copy')

      // 6. 清理
      document.body.removeChild(tempDiv)
      selection?.removeAllRanges()

      if (success) {
        return { success: true, message: '已复制，可直接粘贴到公众号后台' }
      } else {
        throw new Error('复制失败')
      }
    } catch (error) {
      console.error('复制失败:', error)
      return { success: false, message: '复制失败，请手动选择内容复制' }
    }
  }, [])

  const copyAsHTML = useCallback(async (html: string) => {
    try {
      await navigator.clipboard.writeText(html)
      return { success: true, message: 'HTML 代码已复制' }
    } catch (error) {
      return { success: false, message: '复制失败' }
    }
  }, [])

  return { copyToWechat, copyAsHTML }
}
```

---

## 四、技术难点与解决方案

### 4.1 Markdown 完全支持

**问题：** Tiptap 的 Markdown 扩展功能有限

**解决方案：**

1. 使用 `tiptap-markdown` 插件提供基础支持
2. 自定义 `MarkdownPaste` 扩展处理粘贴
3. 使用 `marked.js` 进行 Markdown 解析增强
4. 支持快捷键输入 Markdown 语法

```typescript
// 快捷键示例
editor.registerKeyboardShortcut({
  'Mod-b': () => editor.chain().focus().toggleBold().run(),
  'Mod-i': () => editor.chain().focus().toggleItalic().run(),
  '##': () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
})
```

### 4.2 样式一致性保证

**问题：** 复制到公众号后样式可能丢失或变形

**解决方案：**

1. 所有样式 100% 内联化
2. 使用 `section` 标签作为容器（135/秀米同款）
3. 只使用公众号支持的 CSS 属性白名单
4. 提供"兼容性检查"功能，标注可能有问题的样式

```typescript
// CSS 属性白名单
const WECHAT_SUPPORTED_PROPS = [
  'color',
  'font-size',
  'font-weight',
  'font-style',
  'text-align',
  'line-height',
  'letter-spacing',
  'text-decoration',
  'margin',
  'margin-top',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'padding',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'background',
  'background-color',
  'border',
  'border-left',
  'border-right',
  'border-top',
  'border-bottom',
  'border-radius',
  'width',
  'max-width',
  'height',
  'display',
  'text-indent',
]
```

### 4.3 图片处理流程

**问题：** 图片需要上传到微信服务器才能在公众号显示

**解决方案：**

1. **MVP 阶段：** 图片转 Base64（小于 100KB）
2. **长期方案：** 对接图床服务（如阿里云 OSS、七牛云）

```typescript
// src/utils/imageCompress.ts
import imageCompression from 'browser-image-compression'

export async function compressImage(file: File): Promise<string> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  try {
    const compressed = await imageCompression(file, options)

    // 如果小于 100KB，转 Base64
    if (compressed.size < 100 * 1024) {
      return fileToBase64(compressed)
    }

    // 否则上传到图床
    return uploadToImageHost(compressed)
  } catch (error) {
    console.error('图片压缩失败:', error)
    throw error
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function uploadToImageHost(file: File): Promise<string> {
  // TODO: 实现图床上传逻辑
  // 可使用 OSS、七牛云等服务
  throw new Error('图床上传功能待实现')
}
```

### 4.4 秒刷/换色功能

**问题：** 需要快速替换整篇文章的主题色

**解决方案：** 使用 CSS 变量 + 后置替换

```typescript
// src/extensions/ColorTheme.ts
import { Extension } from '@tiptap/core'

export const ColorTheme = Extension.create({
  name: 'colorTheme',

  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          themeColor: {
            default: null,
            parseHTML: element => element.getAttribute('data-theme-color'),
            renderHTML: attributes => {
              if (!attributes.themeColor) return {}

              return {
                'data-theme-color': attributes.themeColor,
                style: `color: var(--theme-primary, ${attributes.themeColor})`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setThemeColor:
        (color: string) =>
        ({ commands, editor }) => {
          // 遍历所有节点，更新主题色
          const { doc } = editor.state
          let tr = editor.state.tr

          doc.descendants((node, pos) => {
            if (node.attrs.themeColor) {
              tr = tr.setNodeMarkup(pos, null, {
                ...node.attrs,
                themeColor: color,
              })
            }
          })

          return commands.setMeta('addToHistory', false)
        },
    }
  },
})

// 使用示例
function changeTheme(editor: Editor, newColor: string) {
  editor.chain().focus().setThemeColor(newColor).run()

  // 同时更新 CSS 变量
  document.documentElement.style.setProperty('--theme-primary', newColor)
}
```

### 4.5 性能优化

**问题：** 大文章（1万字+）编辑卡顿

**解决方案：**

1. 使用虚拟滚动（react-window）
2. 防抖预览更新
3. 按需加载模板
4. 使用 Web Worker 处理格式转换

```typescript
// src/hooks/useEditor.ts
import { useEditor } from '@tiptap/react'
import { debounce } from 'lodash-es'

export function useWechatEditor() {
  const [preview, setPreview] = useState('')

  const editor = useEditor({
    extensions: [
      /* ... */
    ],
    onUpdate: debounce(({ editor }) => {
      // 防抖更新预览
      const html = editor.getHTML()
      const wechatHtml = WechatConverter.convert(html)
      setPreview(wechatHtml)
    }, 300),
  })

  return { editor, preview }
}
```

---

## 五、开发计划与里程碑

### 5.1 技术准备阶段（3天）

**Day 1:**

- 搭建 React + TypeScript + Vite 项目
- 配置 Tailwind CSS
- 集成 Tiptap 基础功能

**Day 2:**

- 研究 Tiptap Extensions API
- 设计自定义扩展结构
- 编写核心类型定义

**Day 3:**

- 配置开发环境（ESLint, Prettier, Husky）
- 搭建组件库骨架
- 编写测试用例框架

### 5.2 MVP 开发阶段（2周）

**Week 1: 核心编辑功能**

- Day 1-2: 实现 Tiptap 编辑器集成
- Day 3-4: 开发 Markdown 支持（粘贴、输入、转换）
- Day 5: 开发基础样式工具栏（加粗、斜体、标题等）
- Day 6-7: 实现预览功能和样式转换

**Week 2: 样式系统与输出**

- Day 1-2: 开发 Section 扩展和内联样式转换
- Day 3: 实现 3 个预设模板
- Day 4: 开发一键复制功能
- Day 5: 实现草稿自动保存
- Day 6-7: 测试和 Bug 修复

### 5.3 优化迭代阶段（1周）

**功能增强:**

- 添加更多样式组件（引用框、分割线、卡片）
- 实现颜色主题系统
- 优化图片处理
- 增加键盘快捷键

**性能优化:**

- 预览更新防抖
- 模板懒加载
- 代码分割

**用户体验:**

- 新手引导
- 错误提示优化
- 加载状态反馈

---

## 六、技术风险管理

### 6.1 高风险项

| 风险              | 概率 | 影响 | 缓解措施                                 |
| ----------------- | ---- | ---- | ---------------------------------------- |
| Tiptap 学习曲线陡 | 中   | 高   | 预留 3 天学习时间；准备 UEditor 备选方案 |
| 公众号兼容性问题  | 高   | 高   | 建立测试用例库；参考 135/秀米实现        |
| 图片处理复杂      | 中   | 中   | MVP 使用 Base64；后期对接图床            |
| 性能问题          | 低   | 中   | 虚拟滚动；防抖优化；性能监控             |

### 6.2 技术债务管理

**允许的技术债务（MVP 阶段）：**

- 图片暂用 Base64，不对接图床
- 草稿只存本地，不做云同步
- 模板数量少（3-5个）
- 部分边缘样式可能不完美

**不允许的技术债务：**

- 核心功能（编辑、复制）必须稳定
- Markdown 支持必须完整
- 公众号兼容性必须保证
- 代码质量必须合格（有类型、有注释）

---

## 七、测试策略

### 7.1 单元测试

```typescript
// src/__tests__/converters/htmlToWechat.test.ts
import { describe, it, expect } from 'vitest'
import { WechatConverter } from '@/converters/htmlToWechat'

describe('WechatConverter', () => {
  it('应该将 class 转换为内联样式', () => {
    const input = '<p class="text-red-500">测试</p>'
    const output = WechatConverter.convert(input)
    expect(output).toContain('style=')
    expect(output).not.toContain('class=')
  })

  it('应该移除不支持的 CSS 属性', () => {
    const input = '<div style="position: fixed; color: red;">测试</div>'
    const output = WechatConverter.convert(input)
    expect(output).not.toContain('position')
    expect(output).toContain('color: red')
  })

  it('应该用 section 包裹内容', () => {
    const input = '<p>段落1</p><p>段落2</p>'
    const output = WechatConverter.convert(input)
    expect(output).toContain('<section')
  })
})
```

### 7.2 集成测试

**测试场景：**

1. Markdown 粘贴 → 转换为富文本 → 复制到公众号
2. 应用模板 → 修改样式 → 换色 → 复制
3. 插入图片 → 压缩 → 预览 → 复制
4. 编辑文章 → 自动保存 → 恢复草稿

### 7.3 兼容性测试

**测试矩阵：**

- 浏览器：Chrome 90+, Edge 90+, Safari 14+
- 微信版本：最近 3 个版本
- 设备：iPhone, Android, iPad, 电脑

**测试内容：**

- 各种样式在公众号中的显示效果
- 图片显示正常性
- 特殊字符处理
- 长文章性能

---

## 八、部署方案

### 8.1 技术栈

**前端：**

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Tiptap + Extensions

**部署：**

- Vercel / Netlify（免费托管）
- 或自建服务器（Nginx + Node.js）

### 8.2 CI/CD 流程

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 九、监控与数据分析

### 9.1 性能监控

```typescript
// src/utils/analytics.ts
import { onCLS, onFID, onLCP } from 'web-vitals'

export function initPerformanceMonitoring() {
  onCLS(console.log)
  onFID(console.log)
  onLCP(console.log)

  // 自定义指标
  performance.mark('editor-init-start')
  // ... 编辑器初始化代码
  performance.mark('editor-init-end')
  performance.measure('editor-init', 'editor-init-start', 'editor-init-end')
}
```

### 9.2 用户行为分析

**关键指标：**

- 编辑器加载时间
- 复制成功率
- 功能使用频率（哪些样式最常用）
- 错误发生率
- 用户留存率

**工具选择：**

- Google Analytics 4（免费，功能强大）
- Umami（开源，注重隐私）
- 或自建简易统计（LocalStorage + 定期上报）

---

## 十、总结与下一步

### 10.1 技术选型总结

**最终方案：Tiptap + React + TypeScript**

**核心优势：**
✅ 原生支持 Markdown
✅ 现代化架构，易于维护
✅ 高度可定制，完全可控
✅ 性能优秀，用户体验好
✅ 社区活跃，持续更新

**关键风险：**
⚠️ Tiptap 学习曲线相对陡峭
⚠️ 需要自己实现样式系统
⚠️ 公众号兼容性需要充分测试

### 10.2 开发优先级

**P0（必须完成）：**

1. Tiptap 编辑器基础功能
2. Markdown 完整支持
3. 内联样式转换器
4. 一键复制功能
5. 3 个预设模板

**P1（应该完成）：**

1. 图片上传和压缩
2. 草稿自动保存
3. 颜色主题系统
4. 基础样式组件（引用、分割线等）

**P2（可以延后）：**

1. 更多模板
2. 自定义模板保存
3. 历史版本对比
4. 协作功能

### 10.3 成功标准

**技术指标：**

- ✅ 页面加载时间 < 2s
- ✅ 编辑响应时间 < 100ms
- ✅ 一键复制成功率 > 95%
- ✅ Markdown 支持覆盖率 > 90%

**用户指标：**

- ✅ 新手 10 分钟内完成排版
- ✅ 严重 Bug < 3 个
- ✅ 用户推荐意愿 > 60%

---

## 附录

### A. 参考资源

**官方文档：**

- Tiptap: https://tiptap.dev/
- ProseMirror: https://prosemirror.net/
- Marked.js: https://marked.js.org/

**开源项目：**

- Notion (参考设计)
- Typora (Markdown 编辑器)
- 语雀 (文档编辑)

**技术文章：**

- 《如何构建一个现代富文本编辑器》
- 《微信公众号样式兼容性完全指南》
- 《ProseMirror 深入理解》

### B. 技术栈版本

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "tiptap-markdown": "^0.8.2",
    "marked": "^11.0.0",
    "juice": "^10.0.0",
    "lodash-es": "^4.17.21",
    "browser-image-compression": "^2.0.2"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

**文档版本：** v2.0  
**最后更新：** 2024-12-31  
**维护者：** 开发团队
