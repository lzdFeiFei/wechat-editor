# 微信公众号排版工具 - 完整产品与技术文档

> 融合产品需求与技术方案的完整文档

---

## 📋 目录

- [第一部分：产品规划](#第一部分产品规划)
- [第二部分：技术方案](#第二部分技术方案)

---

# 第一部分：产品规划

## 一、产品概述

### 1.1 产品定位
一款简洁、免费、易用的微信公众号文章排版工具，面向个人创作者和小型团队，提供基础而实用的排版功能，无需注册登录即可使用。

### 1.2 目标用户
- 个人公众号运营者
- 自媒体写作者
- 不想为排版工具付费的用户
- 追求简洁高效的创作者

### 1.3 核心价值
- **零成本**：完全免费,无广告干扰
- **零门槛**：打开即用，无需注册
- **高效率**：专注核心功能，操作流畅，原生支持 Markdown
- **可定制**：支持保存个人常用样式

### 1.4 产品目标（MVP阶段）
- 完成核心排版功能开发
- **原生支持 Markdown 输入和粘贴**
- 支持一键复制到微信公众号
- 界面简洁直观，学习成本低于5分钟
- 用户能在10分钟内完成一篇文章的排版

---

## 二、竞品分析

| 功能 | 秀米 | 135编辑器 | 本产品 |
|------|------|-----------|--------|
| 价格 | 部分收费 | 部分收费 | 完全免费 |
| 注册 | 需要 | 需要 | 不需要 |
| Markdown支持 | 弱 | 弱 | **原生支持** |
| 模板数量 | 1000+ | 800+ | 5-10（精选）|
| 操作复杂度 | 中等 | 较复杂 | 简单 |
| 自定义能力 | 强 | 强 | 中等 |
| 学习成本 | 较高 | 高 | 低 |
| 编辑器技术 | UEditor | UEditor | **Tiptap（现代化）** |

**核心差异化优势：**
1. ✅ 完全免费且无广告
2. ✅ 原生 Markdown 支持（解决最大痛点）
3. ✅ 无需注册，打开即用
4. ✅ 现代化编辑体验

---

## 三、用户场景

### 场景1：个人公众号日更
- **用户**：张三每天写一篇公众号文章
- **需求**：快速排版，风格统一
- **使用流程**：打开工具 → 粘贴 Markdown 文本 → 应用常用模板 → 微调 → 复制发布
- **耗时**：5-8分钟（比传统工具快30%）

### 场景2：偶尔发文的普通用户
- **用户**：李四一个月发2-3篇文章
- **需求**：简单美观，不想学习复杂工具
- **使用流程**：打开工具 → 粘贴 Markdown/纯文本 → 选择喜欢的模板 → 复制发布
- **耗时**：10-15分钟

### 场景3：追求个性化的创作者
- **用户**：王五希望每篇文章都有独特风格
- **需求**：自定义样式，保存常用配色
- **使用流程**：打开工具 → 粘贴内容 → 自定义调整 → 保存为模板 → 下次复用
- **耗时**：首次30分钟，之后10分钟

---

## 四、功能架构

```
微信公众号排版工具
├── 编辑区域
│   ├── Tiptap 富文本编辑器（支持 Markdown）
│   ├── 实时预览
│   └── 字数统计
├── 样式工具栏
│   ├── 文字样式
│   ├── 段落样式
│   ├── 特殊组件
│   └── 颜色主题（秒刷/换色）
├── 模板中心
│   ├── 预设模板
│   └── 我的模板
└── 工具栏
    ├── 导入文本/Markdown
    ├── 插入图片
    ├── 保存草稿
    ├── 一键复制
    └── 清空内容
```

---

## 五、界面设计

### 5.1 整体布局

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] 微信公众号排版工具           [草稿] [帮助]      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────┐│
│  │              │  │                  │  │            ││
│  │  样式工具栏  │  │    编辑区域      │  │  实时预览  ││
│  │              │  │                  │  │            ││
│  │  - 文字样式  │  │  [Tiptap编辑器]  │  │  [手机视图]││
│  │  - 段落样式  │  │  支持 Markdown   │  │            ││
│  │  - 特殊组件  │  │                  │  │            ││
│  │  - 颜色主题  │  │                  │  │            ││
│  │  - 模板库    │  │                  │  │            ││
│  │              │  │                  │  │            ││
│  └──────────────┘  └──────────────────┘  └────────────┘│
│                                                           │
│  ┌─────────────────────────────────────────────────────┐│
│  │ [导入MD] [插入图片] [保存草稿]  [一键复制] [清空]  ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 5.2 交互设计

**Markdown 输入流程（新增）**
1. 用户直接在编辑区输入 Markdown 语法（如 `## 标题`）
2. 编辑器自动识别并转换为对应格式
3. 支持快捷键：`Ctrl+B`（加粗）、`Ctrl+I`（斜体）
4. 粘贴 Markdown 文本自动解析

**样式应用流程**
1. 用户在编辑区选中文本
2. 点击样式工具栏中的样式按钮
3. 样式立即应用，预览区实时更新
4. 支持撤销操作（Ctrl+Z）

**模板应用流程**
1. 用户点击"模板库"
2. 弹出模板选择面板（网格展示）
3. 悬停显示模板预览
4. 点击模板，弹窗确认："应用模板将覆盖当前样式，是否继续？"
5. 确认后应用模板样式

**秒刷/换色流程（核心功能）**
1. 用户点击"换色"按钮
2. 选择新的主题色
3. 编辑器自动替换全文的主题相关颜色
4. 预览区实时更新

**一键复制流程**
1. 用户点击"一键复制"按钮
2. 系统生成符合微信格式的 HTML
3. 自动复制到剪贴板
4. 显示成功提示（3秒后自动消失）
5. 首次使用显示操作指引："打开微信公众号后台 → 新建图文 → 在编辑区右键粘贴"

### 5.3 视觉设计

**配色方案**
- 主色：#3B82F6（蓝色，用于按钮、链接）
- 辅助色：#10B981（绿色，用于成功提示）
- 背景色：#F9FAFB（浅灰，整体背景）
- 编辑区背景：#FFFFFF（纯白）
- 文字色：#1F2937（深灰，主要文字）/ #6B7280（中灰，次要文字）

**字体**
- 界面字体：-apple-system, 微软雅黑
- 编辑区字体：与公众号一致

**间距规范**
- 大间距：24px（模块间距）
- 中间距：16px（组件间距）
- 小间距：8px（元素间距）

**圆角**
- 按钮：6px
- 卡片：8px
- 面板：12px

---

## 六、用户体验设计

### 6.1 新手引导

**首次打开**
- 显示欢迎弹窗
- 介绍核心功能（3-4张图）
- **特别强调 Markdown 支持功能**
- 提供示例文章可直接体验
- "跳过引导"按钮

**操作提示**
- 工具栏按钮悬停显示功能说明
- 关键操作显示气泡提示（首次使用）
- Markdown 语法快速参考卡片
- 帮助中心提供视频教程和文档

### 6.2 操作优化

**快捷键支持**
- Ctrl+B：加粗
- Ctrl+I：斜体
- Ctrl+Z：撤销
- Ctrl+Y：重做
- Ctrl+S：保存草稿
- Ctrl+K：插入链接
- `##` + 空格：自动转为二级标题（Markdown）

**拖拽支持**
- 图片拖拽上传
- 段落拖拽排序

**智能识别**
- 粘贴网址自动转换为链接
- 粘贴多行文本自动分段
- **识别 Markdown 格式并自动解析**
- 识别标题格式（# 标记）

### 6.3 错误处理

**常见错误场景**
1. 图片过大：提示"图片超过5MB，请压缩后上传"
2. 复制失败：提示"复制失败，请手动选择内容复制"
3. 浏览器不支持：提示"请使用Chrome、Edge等现代浏览器"
4. 草稿存储已满：提示"草稿数量已达上限，请删除部分草稿"
5. Markdown 解析失败：提示"Markdown 格式有误，请检查语法"

---

## 七、数据统计与运营

### 7.1 核心指标

**使用指标**
- 日活用户数（DAU）
- 月活用户数（MAU）
- 人均使用时长
- 人均编辑文章数

**功能指标**
- 一键复制成功率
- 模板使用率（各模板使用占比）
- **Markdown 功能使用率**
- 草稿保存率
- 图片上传成功率
- 秒刷/换色功能使用率

**留存指标**
- 次日留存率
- 7日留存率
- 30日留存率

### 7.2 数据采集原则

**隐私优先原则**
- 不收集用户文章内容
- 不收集用户个人信息
- 仅收集匿名使用数据
- 用户可选择关闭数据统计

**采集内容**
- 功能使用次数
- 页面访问量
- 错误日志
- 性能指标（加载时间、响应时间）

---

## 八、成功标准

### 8.1 MVP 阶段目标

**功能完成度**
- ✅ 核心排版功能 100% 可用
- ✅ Markdown 支持覆盖率 > 90%
- ✅ 一键复制成功率 > 95%
- ✅ 页面加载时间 < 2秒
- ✅ 编辑响应时间 < 100ms

**用户满意度**
- 新手能在 10 分钟内完成一篇文章排版
- 用户反馈的严重 bug 数量 < 3个
- 用户推荐意愿 > 60%

### 8.2 长期目标

**3个月目标**
- MAU > 1000
- 日均排版文章数 > 500
- 用户留存率（7日）> 30%

**6个月目标**
- MAU > 5000
- 在小红书、知乎等平台有 10+ 推荐文章
- 形成核心用户社群

---

## 九、风险管理

### 9.1 技术风险

| 风险              | 概率 | 影响 | 缓解措施                                 |
| ----------------- | ---- | ---- | ---------------------------------------- |
| Tiptap 学习曲线陡 | 中   | 高   | 预留 3 天学习时间；准备 Quill.js 备选方案 |
| 公众号兼容性问题  | 高   | 高   | 建立测试用例库；参考 135/秀米实现        |
| 图片处理复杂      | 中   | 中   | MVP 使用 Base64；后期对接图床            |
| 性能问题          | 低   | 中   | 虚拟滚动；防抖优化；性能监控             |
| Markdown 解析兼容性 | 中 | 中   | 使用成熟库（marked.js）；充分测试       |

### 9.2 产品风险

**风险：用户学习成本高**
- 应对：提供详细的新手引导
- 应对：设计直观的界面
- 应对：提供示例文章和 Markdown 语法参考

**风险：功能与现有工具差异大，用户不适应**
- 应对：提供从其他工具导入的功能
- 应对：保持常用功能的操作习惯一致
- 应对：Markdown 用户会感到更亲切

### 9.3 运营风险

**风险：用户增长缓慢**
- 应对：在开发者社区推广（Markdown 是卖点）
- 应对：初期通过社交媒体、自媒体社群推广
- 应对：提供优质的使用教程吸引用户
- 应对：通过口碑传播，鼓励用户推荐

---

# 第二部分：技术方案

## 一、技术选型

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

**备选方案：** 如果 3 个月内无法完成核心功能，降级到 Quill.js + Markdown 插件

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
│  │  - Theme Color Replacer（秒刷/换色）                │  │
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
│   ├── ColorTheme.ts      # 主题色系统（秒刷/换色）
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
│   └── colorUtils.ts   # 颜色处理（秒刷/换色）
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
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown.configure({
        // 启用 Markdown 支持
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      TextStyle,
      Color,
      // 自定义扩展
      WechatSection,
      ColorTheme,
    ],
    content: '<p>开始编辑...支持 Markdown 语法</p>',
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

### 3.2 Markdown 增强处理（核心功能）

```typescript
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
      /^#{1,6}\s/m,     // 标题
      /\*\*.*?\*\*/,    // 粗体
      /\[.*?\]\(.*?\)/, // 链接
      /^[-*+]\s/m,      // 列表
      /```[\s\S]*?```/, // 代码块
      /^\d+\.\s/m,      // 有序列表
    ]

    return markdownPatterns.some(pattern => pattern.test(text))
  },
})
```

### 3.3 自定义 Section 扩展

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

### 3.4 秒刷/换色功能（ColorTheme 扩展）

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

### 3.5 样式内联化转换器

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
   * 转换颜色值为内联样式（秒刷/换色功能）
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

### 3.6 公众号格式转换器

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

    const body = doc.body
    const children = Array.from(body.children)

    children.forEach(child => {
      if (child.tagName !== 'SECTION') {
        const section = doc.createElement('section')
        section.setAttribute('style', 'margin: 10px 0;')

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

    let result = html
    for (const [tag, style] of Object.entries(styles)) {
      const regex = new RegExp(`<${tag}([^>]*)>`, 'gi')
      result = result.replace(regex, (match, attrs) => {
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

### 3.7 微信公众号 CSS 属性白名单

```typescript
// src/utils/wechatCompat.ts

// 微信公众号支持的 CSS 属性白名单
export const WECHAT_SUPPORTED_PROPS = [
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

/**
 * 检查样式是否兼容微信公众号
 */
export function checkWechatCompatibility(html: string): {
  compatible: boolean
  warnings: string[]
} {
  const warnings: string[] = []
  const unsupportedProps = ['position', 'float', 'z-index', 'transform', 'animation']

  unsupportedProps.forEach(prop => {
    const regex = new RegExp(`${prop}\\s*:`, 'gi')
    if (regex.test(html)) {
      warnings.push(`检测到不兼容的 CSS 属性: ${prop}`)
    }
  })

  return {
    compatible: warnings.length === 0,
    warnings,
  }
}
```

### 3.8 一键复制功能

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

  return { copyToWechat }
}
```

### 3.9 图片处理流程

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

    // 否则上传到图床（后期实现）
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
  throw new Error('图床上传功能待实现')
}
```

### 3.10 性能优化

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
      // 防抖更新预览（300ms）
      const html = editor.getHTML()
      const wechatHtml = WechatConverter.convert(html)
      setPreview(wechatHtml)
    }, 300),
  })

  return { editor, preview }
}
```

---

## 四、开发计划

### 4.1 技术准备阶段（3天）

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

### 4.2 MVP 开发阶段（2周）

**Week 1: 核心编辑功能**
- Day 1-2: 实现 Tiptap 编辑器集成
- Day 3-4: 开发 Markdown 支持（粘贴、输入、转换）
- Day 5: 开发基础样式工具栏
- Day 6-7: 实现预览功能和样式转换

**Week 2: 样式系统与输出**
- Day 1-2: 开发 Section 扩展和内联样式转换
- Day 3: 实现 3 个预设模板
- Day 4: 开发一键复制功能和秒刷/换色功能
- Day 5: 实现草稿自动保存
- Day 6-7: 测试和 Bug 修复

### 4.3 优化迭代阶段（1周）

**功能增强:**
- 添加更多样式组件（引用框、分割线、卡片）
- 完善颜色主题系统
- 优化图片处理
- 增加键盘快捷键

**性能优化:**
- 预览更新防抖
- 模板懒加载
- 代码分割

**用户体验:**
- 新手引导
- Markdown 语法参考卡片
- 错误提示优化
- 加载状态反馈

---

## 五、测试策略

### 5.1 单元测试

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

### 5.2 Markdown 测试

```typescript
// src/__tests__/extensions/MarkdownPaste.test.ts
describe('Markdown 支持', () => {
  it('应该正确识别 Markdown 格式', () => {
    const markdown = '## 标题\n\n这是**粗体**文字'
    expect(isMarkdown(markdown)).toBe(true)
  })

  it('应该将 Markdown 转换为 HTML', () => {
    const markdown = '## 标题'
    const html = convertMarkdown(markdown)
    expect(html).toContain('<h2>')
  })
})
```

### 5.3 兼容性测试

**测试矩阵：**
- 浏览器：Chrome 90+, Edge 90+, Safari 14+
- 微信版本：最近 3 个版本
- 设备：iPhone, Android, iPad, 电脑

**测试内容：**
- Markdown 语法支持完整性
- 各种样式在公众号中的显示效果
- 秒刷/换色功能正确性
- 图片显示正常性
- 特殊字符处理
- 长文章性能

---

## 六、部署方案

### 6.1 技术栈

**前端：**
- Vite + React 18 + TypeScript
- Tailwind CSS
- Tiptap + Extensions

**部署：**
- Vercel / Netlify（免费托管）

### 6.2 CI/CD 流程

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
```

---

## 七、监控与数据分析

### 7.1 性能监控

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

### 7.2 用户行为分析

**关键指标：**
- 编辑器加载时间
- 复制成功率
- Markdown 功能使用率
- 秒刷/换色功能使用率
- 功能使用频率
- 错误发生率
- 用户留存率

---

## 八、技术债务管理

### 8.1 允许的技术债务（MVP 阶段）

- 图片暂用 Base64，不对接图床
- 草稿只存本地，不做云同步
- 模板数量少（3-5个）
- 部分边缘样式可能不完美

### 8.2 不允许的技术债务

- 核心功能（编辑、复制）必须稳定
- **Markdown 支持必须完整**
- 公众号兼容性必须保证
- 代码质量必须合格（有类型、有注释）

---

## 九、附录

### A. 技术栈版本

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

### B. 参考资源

**官方文档：**
- Tiptap: https://tiptap.dev/
- ProseMirror: https://prosemirror.net/
- Marked.js: https://marked.js.org/

**开源项目：**
- Notion (参考设计)
- Typora (Markdown 编辑器)

---

**文档版本：** v3.0 (融合版)
**最后更新：** 2025-12-31
**维护者：** 开发团队
