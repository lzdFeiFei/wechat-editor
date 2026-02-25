# WeChat Style Engine PRD V1

## 1. 目标与边界

### 目标用户
- 微信公众号内容编辑/运营

### 一期目标
- 样式模板资产化（模板 CRUD + 导入导出）
- 模板应用到文章并完成排版导出

### Out of Scope
- 浏览器插件抓取
- 云端同步/账号系统
- 单节点级精修（第 N 个节点）

## 2. 信息架构与路由

- `/`：介绍页，入口到模板管理和文章排版
- `/templates`：模板管理（列表/创建/编辑/复制/删除/导入）
- `/compose`：文章排版（选模板 -> 编辑 -> 精修 -> 导出）

## 3. 核心实体

```ts
interface StyleTemplate {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  sourceType: "manual" | "html_import";
  globalStyleConfig: StyleConfig;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface ArticleDraft {
  id: string;
  markdown: string;
  selectedTemplateId: string | null;
  localTweaksByType: Partial<Record<"h1" | "h2" | "h3" | "p" | "li" | "blockquote" | "img" | "hr", Partial<StyleConfig>>>;
}
```

## 4. 关键流程（状态）

### 新建模板（手动）
1. 进入模板管理页
2. 点击新建模板
3. 编辑样式配置
4. 自动写入本地存储

### 新建模板（HTML 分析导入）
1. 粘贴公众号 HTML
2. 解析 HTML 为 `markdown + inferredStyleConfig`
3. 创建/更新模板（`sourceType=html_import`）

### 模板应用到文章（全量覆盖 + 可撤销）
1. 在排版页选择模板
2. 点击“应用模板（全量覆盖）”
3. 记录 `undoSnapshot`
4. 可点击“撤销应用”

### 导出到公众号
1. 输出 HTML
2. 支持复制 HTML 源码
3. 支持复制富文本（失败时给兜底提示）

## 5. 业务规则

- 模板重名允许，列表用更新时间区分
- 删除模板必须二次确认，不可恢复
- 复制模板默认命名：`原模板名 - 副本`
- 应用模板全量覆盖当前样式字段，并保留一次撤销快照
- 模板 JSON 导入失败时阻断并返回错误文案

## 6. 精修模式（一期）

- 仅按元素类型精修：`h1/h2/h3/p/li/blockquote/img/hr`
- 交互：选择元素类型 -> 编辑对应字段 -> 实时预览
- 不支持按第 N 个节点精修

## 7. 验收标准（DoD）

- 公众号后台粘贴后，`h1/h2/p/li/blockquote/img` 视觉一致且可接受
- 导出 HTML 可用
- 富文本复制在支持浏览器成功，不支持时提供失败提示
- 主流程可走通：模板创建 -> 模板应用 -> 排版 -> 导出
