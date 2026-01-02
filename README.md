# 微信公众号排版工具

> 简洁、免费、易用的微信公众号文章排版工具

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## ✨ 功能特性

### ✅ 已完成

#### 基础设施
- ✅ Vite + React 18 + TypeScript 项目架构
- ✅ Tailwind CSS 样式框架
- ✅ ESLint + Prettier 代码规范
- ✅ 路径别名配置（@/）

#### 富文本编辑器
- ✅ Quill.js 编辑器集成
- ✅ 基础工具栏（标题、加粗、斜体、列表、对齐等）
- ✅ 自定义编辑器样式
- ✅ 实时字数统计
- ✅ 预计阅读时间估算

#### 编辑器功能增强
- ✅ 快捷键支持
  - Ctrl+B: 加粗
  - Ctrl+I: 斜体
  - Ctrl+U: 下划线
  - Ctrl+Z: 撤销
  - Ctrl+Y / Ctrl+Shift+Z: 重做
  - Ctrl+S: 保存
  - Ctrl+K: 插入链接
- ✅ 自动保存（每30秒）
- ✅ 手动保存功能
- ✅ 保存状态指示器
- ✅ 撤销/重做历史记录（最多100步）
- ✅ 粘贴文本自动清除格式
- ✅ 页面刷新后恢复内容

#### 界面布局
- ✅ 三栏响应式布局
- ✅ 顶部导航栏
- ✅ 左侧样式工具栏
- ✅ 中间编辑区域
- ✅ 右侧实时预览（375px 手机视图）
- ✅ 底部操作工具栏

#### 实时预览
- ✅ 编辑内容实时同步
- ✅ 手机视图模拟
- ✅ HTML 渲染预览

#### 样式工具栏
- ✅ 文字样式
  - 标题格式（H1/H2/H3/正文）
  - 文字格式（加粗、斜体、下划线、删除线）
  - 文字颜色（8种预设色）
  - 背景高亮（7种浅色）
- ✅ 段落样式
  - 对齐方式（左对齐、居中、右对齐、两端对齐）
  - 列表（有序列表、无序列表）
- ✅ 特殊组件
  - 引用框
  - 分割线（自定义 Blot）
- ✅ 颜色主题系统
  - 5套预设配色方案（经典黑白、科技蓝、清新绿、温暖橙、优雅紫）
  - 主题一键切换
  - 主题本地持久化
  - 预览区实时应用主题

#### 一键复制功能
- ✅ HTML生成和清理
- ✅ 样式转内联（微信格式）
- ✅ 主题样式应用
- ✅ 复制到剪贴板（支持HTML格式）
- ✅ 复制成功/失败提示
- ✅ 使用指引提示
- ✅ 清空内容功能
- ✅ 降级方案（兼容老浏览器）

#### 模板系统
- ✅ 5套预设模板
  - 简约风格（日常文章）
  - 商务风格（企业宣传）
  - 文艺风格（散文随笔）
  - 科技风格（技术文章）
  - 活泼风格（生活分享）
- ✅ 模板选择和预览界面
- ✅ 一键应用模板（内容+主题）
- ✅ 自定义模板保存（最多10个）
- ✅ 自定义模板管理（删除）
- ✅ 模板本地持久化

#### 图片处理
- ✅ 图片上传（支持拖拽）
- ✅ Canvas API 图片压缩
- ✅ 压缩质量和尺寸控制
- ✅ 上传进度和状态显示
- ✅ Base64 格式嵌入（微信兼容）

#### 草稿系统
- ✅ 草稿自动保存（最多10个）
- ✅ 草稿列表管理
- ✅ 草稿搜索功能
- ✅ 草稿重命名/删除
- ✅ 草稿加载和恢复
- ✅ 草稿元数据显示（字数、时间）

#### 用户体验优化
- ✅ 新手引导系统（6步教程）
- ✅ 帮助文档弹窗
  - 快捷键说明
  - 常见问题解答
  - 使用技巧
  - 关于信息
- ✅ Toast 通知系统
  - 成功/错误/警告/提示四种类型
  - 自动消失和手动关闭
- ✅ 导入/导出功能
  - JSON 格式导出
  - 文件导入恢复

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS 4
- **富文本编辑器**: Quill.js
- **图标库**: Lucide React
- **剪贴板**: clipboard.js
- **代码规范**: ESLint + Prettier

## 📁 项目结构

```
wechat-editor/
├── src/
│   ├── components/             # React 组件
│   │   ├── Header.tsx          # 顶部导航栏
│   │   ├── StylePanel.tsx      # 样式工具栏
│   │   ├── Editor.tsx          # 编辑器
│   │   ├── Preview.tsx         # 预览区
│   │   ├── Toolbar.tsx         # 底部工具栏
│   │   ├── TemplateModal.tsx   # 模板选择弹窗
│   │   ├── SaveTemplateModal.tsx # 保存模板弹窗
│   │   ├── ImageUploadModal.tsx # 图片上传弹窗
│   │   ├── DraftListModal.tsx  # 草稿列表弹窗
│   │   ├── OnboardingTour.tsx  # 新手引导
│   │   ├── HelpModal.tsx       # 帮助文档弹窗
│   │   ├── Toast.tsx           # Toast 通知
│   │   └── ToastContainer.tsx  # Toast 容器
│   ├── contexts/               # React Context
│   │   └── EditorContext.tsx
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useEditor.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useAutoSave.ts
│   │   ├── useTemplates.ts     # 模板管理
│   │   ├── useImageUpload.ts   # 图片上传
│   │   ├── useDrafts.ts        # 草稿管理
│   │   └── useToast.ts         # Toast 通知
│   ├── utils/                  # 工具函数
│   │   ├── storage.ts          # 本地存储
│   │   ├── wechat-html.ts      # 微信HTML转换
│   │   ├── theme-styles.ts     # 主题样式生成
│   │   ├── quill-divider.ts    # 自定义分割线
│   │   ├── imageProcessor.ts   # 图片处理
│   │   ├── draftStorage.ts     # 草稿存储
│   │   └── tourStorage.ts      # 引导存储
│   ├── types/                  # TypeScript 类型
│   │   ├── index.ts
│   │   ├── style.ts
│   │   ├── theme.ts
│   │   ├── template.ts         # 模板类型
│   │   ├── draft.ts            # 草稿类型
│   │   └── toast.ts            # Toast 类型
│   ├── styles/                 # 样式文件
│   │   └── quill-custom.css
│   ├── App.tsx                 # 主应用组件
│   ├── main.tsx                # 入口文件
│   └── index.css               # 全局样式
├── public/                     # 静态资源
├── .claude/                    # Claude Code 配置
├── dev/                        # 开发文档
├── vercel.json                 # Vercel 部署配置
└── netlify.toml                # Netlify 部署配置

```

## 🎯 MVP 开发计划

### 阶段1：项目基础设施 ✅
- [x] 项目初始化
- [x] 基础布局组件

### 阶段2：富文本编辑器集成 ✅
- [x] Quill.js 基础集成
- [x] 编辑器功能增强
- [x] 自动保存机制

### 阶段3：样式工具栏 ✅
- [x] 文字样式工具
- [x] 段落样式工具
- [x] 特殊组件工具
- [x] 颜色主题系统

### 阶段4：实时预览系统 ✅
- [x] 预览组件开发
- [x] 样式转换引擎
- [x] 主题样式应用

### 阶段5：模板系统 ✅
- [x] 5套预设模板
- [x] 模板选择界面
- [x] 模板应用功能
- [x] 自定义模板保存

### 阶段6：图片处理 ✅
- [x] 图片上传组件
- [x] Canvas 图片压缩
- [x] 拖拽上传支持
- [x] Base64 格式嵌入

### 阶段7：草稿系统 ✅
- [x] 草稿存储系统
- [x] 草稿列表管理
- [x] 搜索和过滤
- [x] 重命名和删除

### 阶段8：一键复制功能 ✅
- [x] HTML 生成和清理
- [x] 复制功能实现
- [x] 兼容性处理

### 阶段9：用户体验优化 ✅
- [x] 新手引导系统
- [x] 帮助文档弹窗
- [x] Toast 通知系统
- [x] 导入/导出功能

### 阶段10：测试和发布 ✅
- [x] 代码质量检查（ESLint）
- [x] 类型检查（TypeScript）
- [x] 生产构建优化
- [x] 部署配置（Vercel/Netlify）

## 📝 开发日志

### 2025-12-30

**阶段1完成**：
- 初始化 Vite + React + TypeScript 项目
- 配置 Tailwind CSS、ESLint、Prettier
- 安装核心依赖

**阶段2完成**：
- 实现三栏响应式布局
- 集成 Quill.js 富文本编辑器
- 实现快捷键支持（Ctrl+B/I/U/Z/Y/S/K）
- 实现自动保存（每30秒）
- 实现撤销/重做功能
- 实现粘贴清除格式
- 实现字数统计和阅读时间估算
- 实现实时预览同步

**阶段3完成**：
- 实现完整的文字样式工具栏
- 实现段落对齐和列表功能
- 实现特殊组件（引用框、分割线）
- 实现5套主题配色方案
- 主题实时预览和持久化

**阶段4完成**：
- 实现预览组件（手机视图）
- 主题样式动态注入
- 实时同步编辑内容

**阶段8完成**：
- 实现HTML生成和清理
- 样式转内联（符合微信规范）
- 过滤不支持的CSS属性
- 实现复制到剪贴板功能
- 复制状态提示和使用指引
- 清空内容功能

**阶段5完成**：
- 实现5套预设模板（简约/商务/文艺/科技/活泼）
- 模板选择和预览界面
- 模板应用功能（自动应用内容和主题）
- 自定义模板保存系统
- 自定义模板管理（删除功能）
- 模板本地持久化存储

**阶段6完成**：
- 实现图片压缩工具（Canvas API）
- 创建图片上传弹窗组件
- 支持拖拽上传图片
- 压缩质量和尺寸控制（最大900px宽度）
- Base64 格式嵌入（微信兼容）
- 上传进度和状态显示

**阶段7完成**：
- 实现草稿存储系统（最多10个）
- 创建草稿管理 Hook
- 实现草稿列表弹窗
- 草稿搜索和过滤功能
- 草稿重命名和删除
- 草稿元数据显示（字数、创建/更新时间）

**阶段9完成**：
- 实现新手引导系统（6步教程）
- 创建帮助文档弹窗（快捷键/FAQ/技巧/关于）
- 实现 Toast 通知系统（4种类型）
- 添加导入/导出功能（JSON 格式）

**阶段10完成**：
- 修复所有 ESLint 错误和警告
- TypeScript 类型检查通过
- 生产构建优化（428.39 KB bundle）
- 创建 Vercel 和 Netlify 部署配置
- 完成项目文档

## 🚀 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. Vercel 会自动检测 `vercel.json` 配置并部署

或使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

### Netlify 部署

1. 推送代码到 GitHub
2. 在 [Netlify](https://netlify.com) 导入项目
3. Netlify 会自动检测 `netlify.toml` 配置并部署

或使用 Netlify CLI：

```bash
npm i -g netlify-cli
netlify deploy --prod
```

### 构建配置

- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **SPA 路由**: 已配置 `/*` 重定向到 `/index.html`
- **缓存策略**:
  - 静态资源 (`/assets/*`): 1年缓存
  - HTML 文件: 无缓存

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发工具**: 使用 [Claude Code](https://claude.com/claude-code) 辅助开发
