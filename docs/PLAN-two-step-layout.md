# 两步排版系统改造计划（全局模板 + 节点微调）

## 简要摘要

把当前“单一 `StyleConfig` 全局调参”升级为你定义的两步工作流：

1. **步骤一：全局模板排版**  
统一配置并保存模板，覆盖当前全部样式字段，新增 `h1` 完整支持。
2. **步骤二：节点级个性化微调**  
在预览区选中某个节点，仅对该节点做局部覆盖，不影响全局模板。

已锁定的决策：
- 全局范围：覆盖当前全部字段
- 模板存储：本地存储 + JSON 导入导出
- 局部覆盖：仅单节点覆盖
- `h1`：新增完整支持
- UI：显式两步切换（Tabs）
- 节点标识：按类型+出现序号（如 `h2#1`）
- 模板重应用：保留局部覆盖
- 导出：导出新 `EditorStyleState`，并保留“纯 global 导出”兼容能力

---

## 一、目标与范围

### 目标
- 提供明确的双阶段排版体验：先全局后局部。
- 将“样式资产”沉淀为可复用模板，不再只是当前会话内参数。
- 在不破坏现有 Markdown->inline HTML 主链路的前提下引入节点覆盖能力。

### In Scope
- 状态模型升级：`global + overrides + templates`
- 渲染器支持局部覆盖合并
- 预览节点可选中与高亮
- 面板按模式显示（全局模板模式 / 节点微调模式）
- 模板本地管理（保存、应用、删除、重命名、导入导出）
- `h1` 全链路支持（类型、编译器、渲染、面板、测试）

### Out of Scope（本次不做）
- 云端模板同步/账号系统
- 多节点批量微调、圈选编辑
- 复杂冲突弹窗策略（固定采用“保留局部覆盖”）
- 段落锚点同步与 diff 可视化

---

## 二、公共接口与数据结构变更（决策已定）

### 1) 新增编辑状态结构（导出主结构）
```ts
type NodeKey = string; // e.g. "h2#1", "p#3"

interface EditorStyleState {
  version: 2;
  global: StyleConfig;
  overrides: Record<NodeKey, Partial<StyleConfig>>;
  meta?: {
    updatedAt: string;
    source?: "manual" | "imported";
  };
}
```

### 2) 模板结构（本地模板库）
```ts
interface StyleTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  global: StyleConfig;
}
```

### 3) `StyleConfig` 扩展（新增 h1）
- 新增字段（至少）：
  - `h1Size`
  - `h1Weight`（若不独立则复用 headingWeight，但当前决策为“完整支持”，建议独立）
  - `h1LineHeight`
  - `h1MarginTop`
  - `h1MarginBottom`
  - `h1PaddingLeft`
  - `h1BorderLeftWidth`
  - `h1BorderLeftColor`
- `validateStyleConfig` 增加对应规则与默认值。

### 4) 渲染接口扩展
当前 `renderMarkdown(md, config, mode)` 改为：
- 方案A（推荐）：新增可选参数 `editorState`
```ts
renderMarkdown(md, globalConfig, mode, options?: {
  overrides?: Record<NodeKey, Partial<StyleConfig>>;
  includeNodeMetadata?: boolean; // for preview selection
})
```
- 生成时为可编辑元素注入 `data-node-key`（预览模式下启用）。

### 5) 导出接口
- 新增：
  - `Export EditorState JSON`（导出 `EditorStyleState`）
  - `Export Global styleConfig.json`（兼容旧流程）
- 保留现有 `Export HTML` / `Copy Rich Content`

---

## 三、实现方案（按模块）

### 1) 状态层（`app/page.tsx` + 新增状态工具）
- 把 `styleConfig` 状态升级为：
  - `editorState.global`
  - `editorState.overrides`
  - `activeNodeKey`
  - `panelMode: "global" | "node"`
  - `templates: StyleTemplate[]`
- 规则：
  - 全局模式：修改写入 `editorState.global`
  - 节点模式：修改写入 `editorState.overrides[activeNodeKey]`
  - 若无 `activeNodeKey`，节点模式面板只显示引导文案

### 2) 渲染层（`lib/markdown/pipeline.ts` + `styleCompiler.ts`）
- 在遍历节点时维护每种 tag 计数器，生成稳定 key：`tag#n`
- 对每个节点：
  1. 计算基础样式（global）
  2. 若命中 override，按字段覆盖后再生成样式
  3. 注入 `data-node-key`（仅预览）
- 支持 `h1`：`styleCompiler` 增加 `headingStyle(1|2|3, config)` 或单独函数。

### 3) 预览交互（`components/preview/PreviewPanel.tsx`）
- 支持点击命中可编辑标签：`h1/h2/h3/p/li/blockquote/img/hr/...`
- 从 DOM 读取 `data-node-key`，回传上层 `onSelectNode(nodeKey, tagName)`
- 选中态高亮（outline/badge），并在 rerender 后可恢复定位
- 键盘导航（首版可选轻量）：上下切换同类节点

### 4) 面板重构（`components/style/StylePanel.tsx`）
- 拆为：
  - `GlobalStylePanel`（现有全字段）
  - `NodeStylePanel`（按选中节点类型过滤字段）
- 字段过滤映射（示例）：
  - `h1/h2/h3`：字号、字重、行高、上下边距、边框/背景相关
  - `p/li`：字体、字号、行高、字色、对齐、换行
  - `blockquote`：背景、边框、圆角、字号、行高
  - `img`：边框、阴影、最大高度、外边距
- 节点面板提供：
  - “重置当前节点覆盖”
  - “查看继承来源（global / override）”

### 5) 模板管理
- 本地存储 key：`wechat-style-templates:v1`
- 能力：
  - 以当前 `global` 保存模板
  - 应用模板：覆盖 `global`，**保留 `overrides`**
  - 删除/重命名模板
  - 导入/导出模板 JSON
- 导入校验：模板结构与 `StyleConfig` 均走 `validateStyleConfig`

### 6) 与现有导入功能协同（FormatInspector）
- 现有 HTML 反推结果默认写入 `editorState.global`
- 不自动生成节点覆盖（避免不可解释的局部规则）
- 保留提示：`Imported to global template`

---

## 四、迁移与兼容

### 1) 向后兼容
- 老的 `styleConfig.json` 仍可导入：
  - 自动包装为 `EditorStyleState { version:2, global: imported, overrides:{} }`
- 现有导出按钮语义不变（新增一个“导出 EditorState”按钮）

### 2) 数据版本
- `EditorStyleState.version = 2`
- 后续若有 `sequenceRules` 再升级版本，不污染 v2 主流程

---

## 五、测试计划与验收场景

### 单元测试
1. `validateStyleConfig`  
- 新增 `h1` 字段默认值、边界值、非法值回退
2. 节点 key 生成  
- 同一文档稳定生成 `h2#1/h2#2...`
- 插入新同类节点后序号重排行为符合预期
3. 样式合并  
- `global + override` 合并结果正确
- 未覆盖字段正确继承 global
4. 模板存储  
- 保存/读取/删除/重命名
- 异常 JSON 导入的容错

### 渲染测试（pipeline）
1. `h1/h2/h3` 都有 inline style
2. 含 override 的节点生成差异样式
3. safe/standard 模式行为不回归
4. `data-node-key` 仅在预览所需路径启用（或不影响导出）

### 组件交互测试
1. 点击预览节点后，面板切到节点微调并显示对应字段
2. 修改节点字段只影响该节点
3. 应用模板后，全局变化生效，局部覆盖保留
4. 重置节点覆盖后回退为全局样式

### 手工验收脚本
1. 新建文档 -> 全局调 `h1/h2` -> 保存模板 -> 重新加载页面模板仍可用
2. 选中第2个 `h2` 改字色 -> 仅该节点变化
3. 导出 HTML 粘贴公众号后台，样式与预览一致
4. 导出 `EditorState` 后再导入，结果完全还原

---

## 六、实施顺序（可直接分 PR）

1. **PR1: 数据模型与 h1 支持**
- 扩展 `StyleConfig` + 默认值 + 校验 + 渲染/编译器 + 测试
2. **PR2: 节点 key 与 override 渲染**
- pipeline 注入 `data-node-key` + 覆盖合并逻辑 + 测试
3. **PR3: 预览选中与两步面板**
- Preview 可选中、高亮；Tabs 切换；Node 面板字段过滤
4. **PR4: 模板管理与导出升级**
- 本地模板库、EditorState 导入导出、兼容旧 `styleConfig`
5. **PR5: 回归与体验打磨**
- 文案、空状态、错误提示、端到端手测清单

---

## 七、默认假设（已锁定）
- 以“显式两步模式”作为交互主轴，不做自动切换。
- 局部覆盖只做单节点，不提供批量覆盖。
- 节点标识按“标签+序号”，接受内容结构变化时序号可能变化这一特性。
- 模板只管理全局样式，局部覆盖属于当前文章上下文。
- 模板重应用不清空局部覆盖。
- 导出以 `EditorStyleState` 为新主格式，同时保留旧 global 导出能力。
