# 微信公众号排版工具 MVP - 上下文文档

**最后更新：2025-12-30 18:30**

---

## SESSION PROGRESS (2025-12-30 最新)

### ✅ 已完成阶段
- ✅ **阶段1：项目基础设施** (100%)
  - Vite + React 18 + TypeScript 项目初始化
  - Tailwind CSS 4 配置完成
  - ESLint + Prettier 代码规范
  - 路径别名配置（@/）
  - Git提交：`4acdc5b - chore(init): 完成阶段1项目基础设施搭建`

- ✅ **阶段2：富文本编辑器集成** (100%)
  - Quill.js 编辑器集成和配置
  - 三栏响应式布局（Header, StylePanel, Editor, Preview, Toolbar）
  - 快捷键支持（Ctrl+B/I/U/Z/Y/S/K）
  - 自动保存机制（每30秒）
  - 撤销/重做历史记录（最多100步）
  - 粘贴文本自动清除格式
  - 字数统计和阅读时间估算
  - Git提交：
    - `a282aed - feat(editor): 完成基础布局和Quill编辑器集成`
    - `72daf68 - feat(editor): 完成编辑器功能增强`

- ✅ **阶段3：样式工具栏** (100%)
  - 完整的文字样式工具（H1/H2/H3、粗体/斜体/下划线/删除线）
  - 颜色选择器（8种文字色、7种背景色）
  - 段落对齐和列表功能
  - 特殊组件（引用框、自定义分割线Blot）
  - 5套主题配色方案（经典黑白、科技蓝、清新绿、温暖橙、优雅紫）
  - 主题实时预览和本地持久化
  - Git提交：
    - `7e37885 - feat(style): 实现样式工具栏核心功能`
    - `c88bf9b - feat(theme): 完成颜色主题系统`

- ✅ **阶段4：实时预览系统** (100%)
  - 手机视图预览组件（375px宽度）
  - 主题样式动态注入
  - 实时同步编辑内容
  - HTML渲染预览

- ✅ **阶段8：一键复制功能** (100%)
  - HTML生成和清理引擎
  - 样式转内联（符合微信规范）
  - 27个允许的CSS属性白名单过滤
  - 复制到剪贴板（支持HTML格式）
  - 现代Clipboard API + execCommand降级方案
  - 复制状态提示和使用指引
  - 清空内容功能
  - Git提交：`f1b65b0 - feat(copy): 实现一键复制到微信公众号功能`

- ✅ **阶段5：模板系统** (100%) - **本次会话完成**
  - 5套预设模板（简约/商务/文艺/科技/活泼）
  - 模板选择和预览界面（TemplateModal）
  - 一键应用模板（内容+主题）
  - 自定义模板保存系统（SaveTemplateModal，最多10个）
  - 自定义模板管理（删除功能）
  - 模板本地持久化存储（localStorage）
  - Git提交：`2bd6844 - feat(template): 实现模板系统功能`

### 🟡 进行中
- 无（当前所有开发任务已完成）

### ⏳ 待开始
- **阶段6：图片处理**
  - 图片上传（本地文件、拖拽上传）
  - 图片压缩（使用Canvas API，最大宽度900px）
  - 图片样式调整（宽度、边框、说明文字）

- **阶段7：草稿系统**
  - 草稿列表管理界面
  - 草稿重命名/删除功能
  - 多草稿存储（最多10篇）
  - 草稿搜索功能

- **阶段9：用户体验优化**
  - 首次使用引导
  - 帮助提示和文档
  - 错误处理优化
  - 性能优化（代码分割、懒加载）

- **阶段10：测试和发布**
  - 功能测试
  - 浏览器兼容性测试
  - 微信公众号兼容性测试
  - 生产构建配置
  - Vercel/Netlify部署

### ⚠️ 阻塞点和已解决问题
- ✅ **已解决：Tailwind CSS 4 PostCSS配置问题**
  - 问题：Tailwind v4需要使用`@tailwindcss/postcss`插件
  - 解决：安装`@tailwindcss/postcss`并更新`postcss.config.js`

- ✅ **已解决：TypeScript编译错误**
  - 问题1：Editor.tsx中Quill Delta类型推断错误
  - 解决：使用类型断言`as any`和明确的类型转换
  - 问题2：useAutoSave.ts中`NodeJS.Timeout`类型问题
  - 解决：改用浏览器原生`number`类型（`setTimeout`返回值）
  - 问题3：quill-divider.ts Blot注册问题
  - 解决：添加`scope`属性和正确的注册格式

---

## 项目当前状态

### 完成度
**总体进度：60%** (6/10个阶段完成)

### 技术栈（已实现）
- **前端框架**：React 18.3.1 + TypeScript 5.6.2
- **构建工具**：Vite 5.4.21
- **样式方案**：Tailwind CSS 4.1.18 + @tailwindcss/postcss
- **富文本编辑器**：Quill 2.0.3
- **图标库**：Lucide React 0.468.0
- **状态管理**：React Context + Hooks + localStorage
- **代码规范**：ESLint 9.17.0 + Prettier 3.4.2

### 项目实际结构
```
wechat-editor/
├── src/
│   ├── components/             # React组件
│   │   ├── Header.tsx          # 顶部导航栏（带模板按钮）
│   │   ├── StylePanel.tsx      # 样式工具栏（完整样式+主题选择）
│   │   ├── Editor.tsx          # Quill编辑器（快捷键+自动保存）
│   │   ├── Preview.tsx         # 预览区（手机视图+主题应用）
│   │   ├── Toolbar.tsx         # 底部工具栏（复制+清空）
│   │   ├── TemplateModal.tsx   # 模板选择弹窗
│   │   └── SaveTemplateModal.tsx # 保存模板弹窗
│   ├── contexts/
│   │   └── EditorContext.tsx   # 全局状态（content, quill实例, theme）
│   ├── hooks/                  # 自定义Hooks
│   │   ├── useEditor.ts        # 内容管理（字数、阅读时间）
│   │   ├── useKeyboardShortcuts.ts # 快捷键
│   │   ├── useAutoSave.ts      # 自动保存
│   │   ├── useTheme.ts         # 主题管理
│   │   ├── useCopyToClipboard.ts # 复制功能
│   │   ├── useEditorCommands.ts # 编辑器命令
│   │   └── useTemplates.ts     # 模板管理
│   ├── utils/                  # 工具函数
│   │   ├── storage.ts          # localStorage操作
│   │   ├── wechat-html.ts      # 微信HTML转换引擎
│   │   ├── theme-styles.ts     # 主题CSS生成
│   │   └── quill-divider.ts    # 自定义分割线Blot
│   ├── types/                  # TypeScript类型
│   │   ├── index.ts            # 基础类型
│   │   ├── style.ts            # 样式常量
│   │   ├── theme.ts            # 主题类型
│   │   └── template.ts         # 模板类型
│   ├── styles/
│   │   └── quill-custom.css    # Quill自定义样式
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 入口文件
│   └── index.css               # 全局样式（Tailwind导入）
├── public/                     # 静态资源
├── dev/                        # 开发文档
│   └── active/wechat-editor-mvp/
├── .claude/                    # Claude Code配置
├── dist/                       # 构建输出
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── .eslintrc.cjs
```

---

## 核心技术实现细节

### 1. 微信HTML转换引擎 (wechat-html.ts)

**关键功能**：将编辑器HTML转换为微信公众号兼容的格式

**实现原理**：
```typescript
// 1. 允许的CSS属性白名单（27个）
const ALLOWED_CSS_PROPERTIES = [
  'color', 'font-size', 'font-weight', 'font-style',
  'text-decoration', 'text-align', 'line-height',
  'background-color', 'padding', 'margin', 'border',
  'border-radius', 'width', 'height', 'max-width', 'display'
  // ... 等
]

// 2. 递归处理DOM元素
function processElement(element: HTMLElement, theme: Theme) {
  // a. 应用主题样式（h1/h2/h3/p/blockquote/hr）
  applyThemeStyles(element, theme)

  // b. 转换class为内联样式
  convertClassToInlineStyle(element) // 使用getComputedStyle

  // c. 清理不支持的属性（data-*, contenteditable）
  cleanUnsupportedAttributes(element)

  // d. 处理特殊标签（设置固定样式）
  processSpecialTags(element, theme)

  // e. 递归处理子元素
  if (element.children.length > 0) {
    processElement(element, theme)
  }
}

// 3. 清理空标签
function cleanEmptyTags(html: string): string {
  // 移除空的<p>标签和只包含<br>的<p>标签
}
```

**关键决策**：
- 使用`getComputedStyle`获取计算后的样式，确保所有CSS都转为内联
- 移除所有class属性，避免微信过滤
- 为特殊标签（h1/h2/h3/blockquote等）设置固定样式，确保一致性

### 2. 主题系统 (theme.ts + theme-styles.ts)

**5套预设主题**：
```typescript
interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string          // 主色调
    headingColor: string     // 标题颜色
    textColor: string        // 正文颜色
    linkColor: string        // 链接颜色
    quoteBackground: string  // 引用框背景
    quoteBorder: string      // 引用框左边框
    dividerColor: string     // 分割线颜色
  }
}

// 预设主题
1. classic（经典黑白）
2. tech-blue（科技蓝）
3. fresh-green（清新绿）
4. warm-orange（温暖橙）
5. elegant-purple（优雅紫）
```

**动态CSS注入**：
```typescript
// Preview组件中使用
const themeStyles = useMemo(() => generateThemeStyles(currentTheme), [currentTheme])

return (
  <div className="preview-container">
    <style>{themeStyles}</style>
    <div dangerouslySetInnerHTML={{ __html: content.html }} />
  </div>
)
```

### 3. 模板系统 (template.ts + useTemplates.ts)

**模板数据结构**：
```typescript
interface Template {
  id: string
  name: string
  description: string
  category: 'preset' | 'custom'
  theme: Theme              // 关联主题
  content: string           // HTML内容
  preview: string           // 预览标识
  createdAt?: number        // 创建时间（自定义模板）
}
```

**5套预设模板内容特点**：
1. **简约风格**：基础结构，适合日常文章
2. **商务风格**：带目录和分节，适合企业宣传
3. **文艺风格**：带日期和引言，适合散文随笔
4. **科技风格**：带emoji图标和结构化内容，适合技术文章
5. **活泼风格**：轻松语气，带问候语，适合生活分享

**模板管理逻辑**：
```typescript
// localStorage存储
const CUSTOM_TEMPLATES_KEY = 'wechat_editor_custom_templates'
const MAX_CUSTOM_TEMPLATES = 10

// 加载、保存、删除自定义模板
useEffect(() => {
  const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY)
  if (stored) {
    const templates = JSON.parse(stored)
    setCustomTemplates(templates)
    setAllTemplates([...PRESET_TEMPLATES, ...templates])
  }
}, [])
```

### 4. 自定义Quill Blot (quill-divider.ts)

**分割线Blot实现**：
```typescript
const BlockEmbed = Quill.import('blots/block/embed') as any

class DividerBlot extends BlockEmbed {
  static blotName = 'divider'
  static tagName = 'hr'
  static className = 'ql-divider'
  static scope = Quill.import('parchment').Scope.BLOCK_BLOT

  static create() {
    const node = super.create() as HTMLElement
    node.setAttribute('contenteditable', 'false')
    node.style.border = 'none'
    node.style.borderTop = '2px solid #e5e7eb'
    node.style.margin = '20px 0'
    return node
  }
}

// 注册方式
Quill.register({ 'formats/divider': DividerBlot }, true)
```

**关键点**：
- 必须添加`scope`属性才能正确注册
- 使用`as any`绕过TypeScript类型检查
- 注册时使用`{ 'formats/divider': DividerBlot }`格式

### 5. 复制功能 (useCopyToClipboard.ts)

**双层降级方案**：
```typescript
async function copyHTML(html: string) {
  try {
    // 方案1：现代Clipboard API（支持HTML格式）
    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([html], { type: 'text/html' })
      const textBlob = new Blob([html], { type: 'text/plain' })
      const clipboardItem = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      })
      await navigator.clipboard.write([clipboardItem])
    } else {
      // 方案2：document.execCommand降级
      const textarea = document.createElement('textarea')
      textarea.value = html
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  } catch (error) {
    console.error('Copy failed:', error)
  }
}
```

---

## 关键技术挑战和解决方案

### 挑战1：Tailwind CSS 4 升级问题
**问题**：Tailwind v4改变了PostCSS插件架构，直接使用`tailwindcss`会报错

**错误信息**：
```
It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
The PostCSS plugin has moved to a separate package...
```

**解决方案**：
```bash
npm install --save-dev @tailwindcss/postcss
```
```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // 使用新包
    autoprefixer: {},
  },
}
```

### 挑战2：Quill TypeScript类型问题
**问题1**：`Quill.import('delta')`类型推断失败

**解决方案**：
```typescript
// 使用类型断言
const Delta = Quill.import('delta') as any
return new Delta().insert(plaintext)
```

**问题2**：Blot继承类型错误

**解决方案**：
```typescript
// 导入时断言为any
const BlockEmbed = Quill.import('blots/block/embed') as any
class DividerBlot extends BlockEmbed { ... }
```

### 挑战3：浏览器环境setTimeout类型
**问题**：Node.js的`NodeJS.Timeout`在浏览器环境不存在

**错误**：
```
error TS2503: Cannot find namespace 'NodeJS'.
```

**解决方案**：
```typescript
// 使用浏览器原生number类型
const timeoutRef = useRef<number>()  // 不是NodeJS.Timeout
```

### 挑战4：Theme类型不匹配
**问题**：模板中的Theme定义缺少`description`字段，导致类型错误

**解决方案**：
```typescript
// 所有主题对象必须包含完整字段
theme: {
  id: 'classic',
  name: '经典黑白',
  description: '黑色标题，深灰正文，经典耐看',  // 必需
  colors: { ... }
}
```

---

## localStorage数据结构

### 当前草稿
**Key**: `wechat_editor_current_draft`
```typescript
{
  html: string,           // HTML内容
  savedAt: number         // 保存时间戳
}
```

### 当前主题
**Key**: `wechat_editor_current_theme`
```typescript
{
  id: string,             // 主题ID
  name: string,
  description: string,
  colors: { ... }
}
```

### 自定义模板
**Key**: `wechat_editor_custom_templates`
```typescript
[
  {
    id: string,
    name: string,
    description: string,
    category: 'custom',
    theme: Theme,
    content: string,
    preview: 'custom',
    createdAt: number
  },
  // ... 最多10个
]
```

---

## 快速恢复指南（重要！）

### 如果上下文重置后继续开发

#### 1. 立即检查的内容
```bash
# 检查项目状态
npm run dev          # 确认项目能正常运行
npm run build        # 确认构建无错误
git status           # 查看是否有未提交的更改
git log --oneline -10 # 查看最近的提交

# 当前最新提交应该是：
# 2bd6844 feat(template): 实现模板系统功能
```

#### 2. 下一步开发建议

**推荐顺序：阶段6 → 阶段7 → 阶段9 → 阶段10**

**阶段6：图片处理（最复杂，优先完成）**
```typescript
// 需要创建的文件：
src/hooks/useImageUpload.ts      // 图片上传Hook
src/utils/imageProcessor.ts      // 图片压缩工具
src/components/ImageUploadModal.tsx // 上传界面

// 核心实现：
1. FileReader API读取本地文件
2. Canvas API压缩图片（最大宽度900px）
3. 转换为base64或上传到图床
4. 插入到Quill编辑器
```

**阶段7：草稿系统**
```typescript
// 需要创建的文件：
src/hooks/useDrafts.ts           // 草稿管理Hook
src/components/DraftListModal.tsx // 草稿列表界面
src/utils/draftStorage.ts        // 草稿存储工具

// localStorage结构：
{
  drafts: [
    {
      id: string,
      title: string,
      content: string,
      createdAt: number,
      updatedAt: number,
      wordCount: number
    }
  ],
  currentDraftId: string
}
```

#### 3. 常用命令
```bash
# 开发
npm run dev              # 启动开发服务器（http://localhost:5173）

# 构建
npm run build            # TypeScript编译 + Vite构建
npm run preview          # 预览生产构建

# 代码规范
npm run lint             # ESLint检查

# Git操作
git add .
git commit -m "feat(xxx): 功能描述"
git log --oneline -5
```

#### 4. 关键文件路径参考
```
核心Context: src/contexts/EditorContext.tsx
主题系统: src/types/theme.ts
模板系统: src/types/template.ts
HTML转换: src/utils/wechat-html.ts
复制功能: src/hooks/useCopyToClipboard.ts
```

---

## 重要注意事项

### ⚠️ 开发时必须遵守的规则

1. **微信样式兼容性**
   - ❌ 不能使用class，必须用内联样式
   - ❌ 不能使用position: fixed/sticky
   - ❌ 不能使用自定义字体
   - ✅ 只使用ALLOWED_CSS_PROPERTIES中的27个属性

2. **TypeScript严格模式**
   - 所有类型必须明确定义
   - 不能使用`any`（除非Quill类型问题）
   - 必须处理null/undefined情况

3. **性能优化**
   - 使用React.memo避免不必要的重渲染
   - 使用useMemo/useCallback缓存计算和函数
   - 长文章编辑时使用防抖

4. **Git提交规范**
   - 使用Conventional Commits格式
   - 每个阶段完成后立即提交
   - 提交信息必须包含表情符号和详细说明

5. **测试要求**
   - 每个功能完成后必须手动测试
   - 测试Chrome、Edge、Safari三大浏览器
   - 复制到微信公众号后台验证效果

---

## 参考资源

### 官方文档
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/
- Quill.js: https://quilljs.com/

### 关键API文档
- Quill API: https://quilljs.com/docs/api/
- Quill Parchment: https://quilljs.com/guides/cloning-medium-with-parchment/
- Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

### 竞品参考
- 秀米: https://xiumi.us/
- 135编辑器: https://www.135editor.com/
- 新榜编辑器: https://edit.newrank.cn/

---

**文档版本**：v2.0
**创建日期**：2025-12-30
**最后更新**：2025-12-30 18:30
**更新内容**：添加阶段5完成状态、技术挑战解决方案、快速恢复指南
