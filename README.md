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

## 当前已实现功能（V1）

### 1. 多页面信息架构

- `/` 首页介绍 + 功能入口
- `/templates` 模板管理页（模板 CRUD + HTML 分析导入 + 三栏调参）
- `/compose` 文章排版页（选模板应用 + 精修 + 导出）

### 2. 三栏编辑工作台

- 左侧：Markdown 编辑器（CodeMirror）
- 中间：样式配置面板（按全局/H1/H2-H3/引用列表/图片分组折叠）
- 右侧：公众号样式预览（移动端宽度模拟）

### 3. 渲染与导出

- Markdown 实时渲染为 inline HTML
- 支持 `standard/safe` 两种渲染模式
- `Export HTML`：复制 HTML 源码
- `Copy Rich Content for WeChat`：复制富文本，便于直接粘贴到公众号后台
- 导出模板 JSON

### 4. 模板能力

- 模板创建、编辑、复制、删除
- 模板本地持久化（localStorage）
- 模板 JSON 导入导出
- 支持从粘贴 HTML 反推样式并写入模板

### 5. 精修模式（按元素类型）

- 支持 `h1/h2/h3/p/li/blockquote/img/hr` 类型级精修
- 模板应用策略为“全量覆盖 + 一次撤销”

### 6. 公众号兼容策略

- 统一通过 inline style 输出
- 白名单 sanitize 过滤
- safe 模式降级高风险/复杂结构（如表格）

### 7. 样式系统（StyleConfig）

当前可配置字段覆盖：

- 正文：字号、行高、段前/段后、字体、对齐、换行策略
- H1：字号、字重、行高、间距、左边框
- 标题：h2/h3 字号、粗细、间距、边框、h3 背景块等
- 引用：背景、边框、圆角、字号、行高
- 图片：边框、阴影、间距、最大高度
- 分隔线：间距、高度、背景、边框
- 列表：marker 颜色（已修复 marker 不显示问题）
- 强调文本：`strong` 使用强调色（primaryColor）

### 8. HTML 导入与样式反推

- 粘贴公众号 HTML 后可分析格式统计
- 自动归一化编辑器包装结构（移除 ProseMirror/leaf 等噪声节点）
- 支持 HTML -> Markdown 转换并回填左侧编辑区
- 支持从导入 HTML 反推出 StyleConfig 并回填中间面板

### 9. 编辑体验增强

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

## 文档

- V1 需求规格：[docs/PRD-v1-template-compose.md](docs/PRD-v1-template-compose.md)

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

### E. 精细化样式编辑（上下文面板 + 节点覆盖）

- 右侧预览支持节点选中（点击/键盘定位到 h2/h3/p/li/img 等）
- 中间面板按“当前选中节点类型”动态过滤配置项  
  例如选中 `h3` 时，仅显示 h3 相关字段，减少大而全面板的认知负担
- 引入“全局样式 + 局部覆盖”双层模型  
  全局继续由 `StyleConfig` 提供，局部通过 `styleOverrides` 覆盖
- 支持同类型节点的个性化样式  
  例如：第 1 个 h3 为红色，第 2 个 h3 为黄色

建议数据结构（草案）：

```ts
type NodeKey = string; // 例如 AST path 或稳定节点 id

interface EditorStyleState {
  global: StyleConfig;
  overrides: Record<NodeKey, Partial<StyleConfig>>;
}
```

建议实现步骤（记录）：

1. 在渲染阶段为可编辑节点注入稳定 `data-node-id`
2. 预览区支持选中节点并高亮，回传 `activeNodeId + activeNodeType`
3. 中间面板按 `activeNodeType` 显示字段分组
4. 面板改动优先写入 `overrides[activeNodeId]`，未覆盖字段回退 `global`
5. 导出时把全局样式与局部覆盖合并为最终 inline style

### F. 样式模板（按序号自动应用）

- 支持将当前样式配置保存为模板（Template）
- 支持“按元素出现顺序”定义覆盖规则  
  例如：`h1[1]=红色`、`h1[2]=黄色`、`h1[3]=绿色`
- 新文章应用模板时，自动把 `h1/h2/h3` 的指定序号规则套到对应节点
- 目标：减少每次在公众号后台重复手工调样式的成本

建议模板结构（草案）：

```ts
interface StyleTemplate {
  name: string;
  global: StyleConfig;
  sequenceRules: Array<{
    selector: "h1" | "h2" | "h3";
    index: number; // 第几个同类节点（从 1 开始）
    patch: Partial<StyleConfig>;
  }>;
}
```

建议实现阶段（记录）：

1. 模板保存/加载（本地存储，后续可扩展云端）
2. 支持 `h1/h2/h3` 序号覆盖的最小可用版本
3. 导入文章后一键应用模板并回显到预览区

## 需求补充记录

### 列表符号颜色单独控制

背景：在公众号后台编辑器中，列表圆点/数字（marker）通常无法单独指定颜色。  
需求：在本项目中支持列表符号颜色单独配置，并与正文文本颜色解耦。

目标行为：

- 项目符号（`ul` 的圆点）使用强调色（例如 `primaryColor`）
- 有序列表（`ol` 的 `1.2.3.4`）使用强调色
- 列表项后面的正文文本保持原始正文色（不跟随 marker 变色）

建议实现方式（记录）：

1. 继续保留 `listMarkerColor` 作为独立字段
2. 渲染阶段使用 `li::marker` 控制 marker 颜色
3. `li` 自身文本颜色继续使用 `textColor`
4. 兼容降级：若目标环境不支持 `::marker`，回退到当前可用策略

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
