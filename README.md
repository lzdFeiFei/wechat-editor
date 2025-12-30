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

### 🚧 开发中

#### 样式工具栏
- ⏳ 文字样式（标题1/2/3、字体大小、颜色）
- ⏳ 段落样式（对齐、行距、缩进）
- ⏳ 特殊组件（分割线、引用框、卡片）
- ⏳ 颜色主题系统

#### 模板系统
- ⏳ 5套预设模板
- ⏳ 自定义模板保存

#### 图片处理
- ⏳ 图片上传
- ⏳ 图片压缩
- ⏳ 图片样式

#### 草稿系统
- ⏳ 草稿列表管理
- ⏳ 草稿重命名/删除

#### 一键复制
- ⏳ HTML 生成
- ⏳ 微信格式转换
- ⏳ 复制到剪贴板

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
│   ├── components/        # React 组件
│   │   ├── Header.tsx     # 顶部导航栏
│   │   ├── StylePanel.tsx # 样式工具栏
│   │   ├── Editor.tsx     # 编辑器
│   │   ├── Preview.tsx    # 预览区
│   │   └── Toolbar.tsx    # 底部工具栏
│   ├── contexts/          # React Context
│   │   └── EditorContext.tsx
│   ├── hooks/             # 自定义 Hooks
│   │   ├── useEditor.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useAutoSave.ts
│   ├── utils/             # 工具函数
│   │   └── storage.ts     # 本地存储
│   ├── types/             # TypeScript 类型
│   │   └── index.ts
│   ├── styles/            # 样式文件
│   │   └── quill-custom.css
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── public/                # 静态资源
├── .claude/               # Claude Code 配置
└── dev/                   # 开发文档

```

## 🎯 MVP 开发计划

### 阶段1：项目基础设施 ✅
- [x] 项目初始化
- [x] 基础布局组件

### 阶段2：富文本编辑器集成 ✅
- [x] Quill.js 基础集成
- [x] 编辑器功能增强
- [x] 自动保存机制

### 阶段3：样式工具栏 🚧
- [ ] 文字样式工具
- [ ] 段落样式工具
- [ ] 特殊组件工具
- [ ] 颜色主题系统

### 阶段4：实时预览系统 🚧
- [x] 预览组件开发
- [ ] 样式转换引擎
- [ ] 预览优化

### 阶段5：模板系统 ⏳
### 阶段6：图片处理 ⏳
### 阶段7：草稿系统 ⏳
### 阶段8：一键复制功能 ⏳
### 阶段9：用户体验优化 ⏳
### 阶段10：测试和发布 ⏳

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

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发工具**: 使用 [Claude Code](https://claude.com/claude-code) 辅助开发
