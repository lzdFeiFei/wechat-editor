结论
你要做的是一个「公众号样式引擎 + 可视化调参器」，核心资产是 StyleConfig JSON，而不是编辑器本身。前端用 Next.js + Tailwind 完全合适。下面是一份可直接开工的开发文档。

---

# 一、项目定位

项目名称（暂定）：WeChat Style Engine

目标
提供可视化样式调参 → 生成 StyleConfig → 渲染 Markdown → 输出公众号兼容 inline HTML → 可作为 Codex Skill 使用。

核心原则

1. 内容和样式彻底分离
2. 所有导出样式必须 inline
3. 不允许用户直接编辑 HTML
4. 所有样式来源于 StyleConfig

---

# 二、技术栈

前端

Next.js 14（App Router）
TypeScript
TailwindCSS
CodeMirror 6（Markdown 编辑器）
unified（Markdown 渲染流水线）

Markdown 处理库

remark-parse
remark-gfm
remark-rehype
rehype-stringify
rehype-sanitize

---

# 三、系统架构

整体结构

Markdown 输入
→ AST
→ Renderer（读取 StyleConfig）
→ 生成 inline HTML
→ 公众号预览模拟
→ 导出 HTML

三大核心模块

1. StyleConfig Editor
2. Markdown Renderer Engine
3. Preview Simulator

---

# 四、项目目录结构

app/
layout.tsx
page.tsx

components/
editor/MarkdownEditor.tsx
style/StylePanel.tsx
preview/PreviewPanel.tsx

lib/
markdown/pipeline.ts
markdown/sanitize.ts
style/styleConfig.ts
style/styleCompiler.ts

types/
style.ts

---

# 五、StyleConfig 设计

第一版不要开放太多字段。

types/style.ts

export interface StyleConfig {
bodyFontSize: number
lineHeight: number
paragraphSpacing: number

h2Size: number
h3Size: number
headingWeight: number

primaryColor: string
secondaryColor: string
textColor: string

blockRadius: number
blockPadding: number

quoteBgColor: string
quoteBorderColor: string
}

这是你的核心资产。

---

# 六、样式编译器

styleCompiler.ts

职责：把 StyleConfig 转换为 inline style 字符串。

示例

export function paragraphStyle(c: StyleConfig) {
return `     font-size:${c.bodyFontSize}px;
    line-height:${c.lineHeight};
    margin-bottom:${c.paragraphSpacing}px;
    color:${c.textColor};
  `
}

export function headingStyle(level: 2 | 3, c: StyleConfig) {
const size = level === 2 ? c.h2Size : c.h3Size
return `     font-size:${size}px;
    font-weight:${c.headingWeight};
    margin:24px 0 12px;
    color:${c.primaryColor};
  `
}

所有 HTML 输出都必须通过这些函数生成 style。

---

# 七、Markdown 渲染流水线

pipeline.ts

import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import rehypeSanitize from "rehype-sanitize"

export function renderMarkdown(md: string, config: StyleConfig) {
return unified()
.use(remarkParse)
.use(remarkGfm)
.use(remarkRehype)
.use(inlineStylePlugin, config)
.use(rehypeSanitize, sanitizeSchema)
.use(rehypeStringify)
.processSync(md)
.toString()
}

inlineStylePlugin 负责：

遍历 h2、h3、p、blockquote、img、ul、ol
为每个节点注入 style 属性。

---

# 八、公众号兼容规范

允许标签：

p, h2, h3, strong, em, span
ul, ol, li
blockquote
hr
pre, code
img
a

规则：

1. 不使用 class
2. 不使用外部 CSS
3. 所有样式 inline
4. 图片必须 max-width:100%

img 样式模板：

max-width:100%;
height:auto;
display:block;
margin:16px auto;

---

# 九、UI 布局设计

页面结构

左侧：Markdown 编辑器
中间：样式调参面板
右侧：公众号预览模拟

Tailwind 仅用于外层 UI，不用于正文渲染。

预览区域模拟手机宽度：

<div className="w-[375px] bg-white p-4 shadow">

正文 HTML 通过 dangerouslySetInnerHTML 注入。

---

# 十、导出功能

导出逻辑

const html = renderMarkdown(md, styleConfig)
navigator.clipboard.writeText(html)

提供两种模式：

安全模式
标准模式

安全模式移除：

复杂表格
自定义组件
高风险标签

---

# 十一、开发阶段划分

第一阶段（基础引擎）

1. Next.js 初始化
2. Tailwind 配置
3. Markdown 渲染
4. 基础 inline style 注入
5. 手机预览

第二阶段（样式系统）

6. StyleConfig 面板
7. 动态实时渲染
8. 导出功能

第三阶段（优化）

9. sanitize 完善
10. 表格降级
11. 代码块样式

---

# 十二、与 Codex Skill 集成方案

Skill 输入：

{
title: string
markdown: string
styleConfig: StyleConfig
}

Skill 输出：

{
html: string
}

你的前端工具可以：

导出 styleConfig.json
供 Codex Skill 使用

这样就实现：

AI 内容生成

- 自动排版

  ***

# 十三、后续升级方向

1. 模块化 Block System
2. Hero 卡片组件
3. CTA 组件
4. 风格市场
5. 一键爆款风格复刻

---

# 总结

你要做的是：

样式资产化系统
Markdown 编译引擎
公众号兼容 HTML 输出器

不是编辑器。

核心资产是 StyleConfig。

如果你愿意，我可以下一步给你：

完整 inlineStylePlugin 示例代码
以及 sanitizeSchema 配置模板

让你直接开始写核心引擎。
