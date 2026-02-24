# WeChat Style Engine

一个面向微信公众号发布场景的样式编译与调参工具。  
核心目标是把内容与样式分离：`Markdown + StyleConfig -> 公众号可粘贴的 inline HTML`。

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- unified/remark/rehype (Markdown -> HTML 渲染管线)
- CodeMirror 6
- Vitest

## 当前已实现功能

### 1. 三栏编辑工作台

- 左侧：Markdown 编辑器（CodeMirror）
- 中间：StyleConfig 可视化调参面板
- 右侧：公众号样式预览（移动端宽度模拟）

### 2. 渲染与导出

- Markdown 实时渲染为 inline HTML
- 支持 `standard/safe` 两种渲染模式
- `Export HTML`：复制 HTML 源码
- `Copy Rich Content for WeChat`：复制富文本，便于直接粘贴到公众号后台
- 导出 `styleConfig.json`

### 3. 公众号兼容策略

- 统一通过 inline style 输出
- 白名单 sanitize 过滤
- safe 模式降级高风险/复杂结构（如表格）

### 4. 样式系统（StyleConfig）

当前可配置字段覆盖：

- 正文：字号、行高、段前/段后、字体、对齐、换行策略
- 标题：h2/h3 字号、粗细、间距、边框、h3 背景块等
- 引用：背景、边框、圆角、字号、行高
- 图片：边框、阴影、间距、最大高度
- 分隔线：间距、高度、背景、边框
- 列表：marker 颜色（已修复 marker 不显示问题）
- 强调文本：`strong` 使用强调色（primaryColor）

### 5. HTML 导入与样式反推

- 粘贴公众号 HTML 后可分析格式统计
- 自动归一化编辑器包装结构（移除 ProseMirror/leaf 等噪声节点）
- 支持 HTML -> Markdown 转换并回填左侧编辑区
- 支持从导入 HTML 反推出 StyleConfig 并回填中间面板

### 6. 编辑体验增强

- 左右内容宽度对齐（编辑器内容宽度近似右侧展示宽度）
- 左右滚动比例联动（可开关），提升阅读定位一致性

## 项目结构

```text
app/
components/
  analysis/
  editor/
  preview/
  style/
lib/
  analysis/
  markdown/
  style/
tests/
types/
```

## 本地开发

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm lint
pnpm test
pnpm build
```

> 说明：项目 `engines` 约束为 Node 22，若本机是其他版本会出现 warning，但不影响开发调试。

## 后续可能开发功能（Roadmap）

### A. 对齐与可视化增强

- 段落级锚点同步（替代单纯滚动比例同步，提升左右定位精度）
- 导入原文 vs 当前渲染的差异对比视图
- 样式字段级 diff 面板（查看哪些样式被推断、覆盖或保留）

### B. 样式资产能力

- 风格模板库（保存、复用、分享 StyleConfig）
- 主题预设与一键套用
- `StyleConfig` 导入/导出版本管理

### C. 渲染与兼容能力

- 更完整的公众号兼容规则库
- 表格/复杂块智能降级策略增强
- 代码块和多媒体样式增强

### D. 工具链与工程能力

- E2E 回归测试
- 关键渲染路径性能优化
- CI 自动化校验

## 需求记录（待开发）

### 浏览器插件：一键提取公众号文章样式结构

目标：开发一个浏览器插件，在公众号文章页或公众号后台编辑页中，一键提取文章结构与样式，输出标准化 JSON/HTML，直接导入本项目进行还原和调参。

建议插件能力：

- 一键抓取文章 DOM 与 inline style
- 自动去噪（移除编辑器包装节点）
- 提取结构树（标题、段落、列表、引用、图片、分隔线）
- 提取样式摘要（颜色、字号、行高、间距、边框、背景、阴影等）
- 导出 `normalizedHtml + inferredStyleConfig + metadata`
- 一键发送到本地 WeChat Style Engine（或复制到剪贴板）

该需求已纳入后续开发计划。
