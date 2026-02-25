"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FormatInspector } from "@/components/analysis/FormatInspector";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { StylePanel } from "@/components/style/StylePanel";
import { renderMarkdown, type RenderMode } from "@/lib/markdown/pipeline";
import { defaultStyleConfig, sampleMarkdown, validateStyleConfig } from "@/lib/style/styleConfig";
import { createTemplate, duplicateTemplate, exportTemplateJson, parseTemplateImport, persistTemplates, readTemplatesFromStorage } from "@/lib/template/templateStore";
import type { StyleTemplate } from "@/types/template";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<StyleTemplate[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const loaded = readTemplatesFromStorage();
    if (loaded.length > 0) {
      return loaded;
    }
    return [
      createTemplate({
        name: "默认模板",
        sourceType: "manual",
        globalStyleConfig: defaultStyleConfig,
        description: "项目初始化模板",
      }),
    ];
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<RenderMode>("standard");
  const [status, setStatus] = useState("");
  const [syncScroll, setSyncScroll] = useState(true);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [draftMarkdown, setDraftMarkdown] = useState(sampleMarkdown);
  const [importJson, setImportJson] = useState("");

  useEffect(() => {
    if (templates.length > 0) {
      persistTemplates(templates);
    }
  }, [templates]);

  const effectiveSelectedId = selectedId ?? templates[0]?.id ?? null;
  const selectedTemplate = useMemo(
    () => templates.find((item) => item.id === effectiveSelectedId) ?? null,
    [effectiveSelectedId, templates],
  );

  const styleConfig = selectedTemplate?.globalStyleConfig ?? defaultStyleConfig;
  const html = useMemo(() => renderMarkdown(draftMarkdown, styleConfig, mode), [draftMarkdown, mode, styleConfig]);

  function updateTemplates(next: StyleTemplate[], message: string): void {
    const sorted = [...next].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setTemplates(sorted);
    persistTemplates(sorted);
    setStatus(message);
  }

  function updateSelectedTemplate(patch: Partial<StyleTemplate>): void {
    if (!selectedTemplate) {
      return;
    }
    const nextTemplate: StyleTemplate = {
      ...selectedTemplate,
      ...patch,
      updatedAt: new Date().toISOString(),
      globalStyleConfig: validateStyleConfig(patch.globalStyleConfig ?? selectedTemplate.globalStyleConfig),
    };
    updateTemplates(templates.map((item) => (item.id === nextTemplate.id ? nextTemplate : item)), "模板已保存");
  }

  function createManualTemplate(): void {
    const created = createTemplate({
      name: `新模板 ${templates.length + 1}`,
      sourceType: "manual",
      globalStyleConfig: styleConfig,
    });
    updateTemplates([created, ...templates], "模板已创建");
    setSelectedId(created.id);
  }

  function duplicateSelectedTemplate(): void {
    if (!selectedTemplate) {
      return;
    }
    const duplicated = duplicateTemplate(selectedTemplate);
    updateTemplates([duplicated, ...templates], "模板已复制");
    setSelectedId(duplicated.id);
  }

  function deleteSelectedTemplate(): void {
    if (!selectedTemplate) {
      return;
    }
    const confirmed = window.confirm(`确认删除模板“${selectedTemplate.name}”？此操作不可恢复。`);
    if (!confirmed) {
      return;
    }
    const next = templates.filter((item) => item.id !== selectedTemplate.id);
    updateTemplates(next, "模板已删除");
    setSelectedId(next[0]?.id ?? null);
  }

  function exportSelectedTemplate(): void {
    if (!selectedTemplate) {
      return;
    }
    const blob = new Blob([exportTemplateJson(selectedTemplate)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${selectedTemplate.name}.template.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("模板 JSON 已导出");
  }

  function importTemplateFromJson(): void {
    const result = parseTemplateImport(importJson);
    if (!result.ok) {
      setStatus(result.message);
      return;
    }
    updateTemplates([result.template, ...templates], "模板导入成功");
    setSelectedId(result.template.id);
    setImportJson("");
  }

  const previewCardWidth = 375;
  const previewCardPadding = 16;
  const contentWidth = previewCardWidth - previewCardPadding * 2;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8fbff,_#f8fafc_40%,_#ffffff_80%)] px-4 py-5 text-zinc-900 md:px-6">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-4">
        <header className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Template Management</p>
              <h1 className="text-lg font-semibold text-zinc-900">模板管理</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-lg border border-zinc-300 p-1 text-sm">
                <button
                  className={`rounded-md px-3 py-1 ${mode === "standard" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
                  onClick={() => setMode("standard")}
                >
                  Standard
                </button>
                <button
                  className={`rounded-md px-3 py-1 ${mode === "safe" ? "bg-zinc-900 text-white" : "text-zinc-700"}`}
                  onClick={() => setMode("safe")}
                >
                  Safe
                </button>
              </div>
              <button
                onClick={() => setSyncScroll((prev) => !prev)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  syncScroll ? "bg-indigo-700 text-white hover:bg-indigo-600" : "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                {syncScroll ? "Scroll Sync On" : "Scroll Sync Off"}
              </button>
              <Link href="/" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100">
                返回首页
              </Link>
              <Link href="/compose" className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600">
                去文章排版
              </Link>
            </div>
          </div>
          <p className="mt-2 h-5 text-xs text-emerald-600">{status}</p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
            <div className="flex gap-2">
              <button onClick={createManualTemplate} className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800">
                新建模板
              </button>
              <button
                onClick={duplicateSelectedTemplate}
                disabled={!selectedTemplate}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
              >
                复制模板
              </button>
              <button
                onClick={deleteSelectedTemplate}
                disabled={!selectedTemplate}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                删除模板
              </button>
            </div>

            <div className="max-h-[280px] space-y-2 overflow-auto">
              {templates.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                    item.id === effectiveSelectedId ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100"
                  }`}
                >
                  <p className="font-medium">{item.name}</p>
                  <p className={`text-xs ${item.id === effectiveSelectedId ? "text-zinc-200" : "text-zinc-500"}`}>更新于 {new Date(item.updatedAt).toLocaleString()}</p>
                </button>
              ))}
            </div>

            {selectedTemplate ? (
              <div className="space-y-2 rounded-lg border border-zinc-200 p-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-zinc-700">模板名称</span>
                  <input
                    value={selectedTemplate.name}
                    onChange={(event) => updateSelectedTemplate({ name: event.target.value })}
                    className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-zinc-700">描述</span>
                  <textarea
                    value={selectedTemplate.description ?? ""}
                    onChange={(event) => updateSelectedTemplate({ description: event.target.value })}
                    className="h-20 w-full resize-none rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={exportSelectedTemplate}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    导出 JSON
                  </button>
                </div>
              </div>
            ) : null}

            <div className="space-y-2 rounded-lg border border-zinc-200 p-3">
              <p className="text-xs font-semibold text-zinc-700">导入模板 JSON</p>
              <textarea
                value={importJson}
                onChange={(event) => setImportJson(event.target.value)}
                placeholder='{"name":"模板名","globalStyleConfig":{...}}'
                className="h-24 w-full resize-none rounded-md border border-zinc-300 px-2 py-1.5 font-mono text-xs outline-none focus:border-zinc-500"
              />
              <button
                onClick={importTemplateFromJson}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
              >
                导入模板
              </button>
            </div>
          </aside>

          <div className="flex flex-col gap-4">
            <FormatInspector
              baseStyleConfig={styleConfig}
              onImport={({ markdown, inferredConfig }) => {
                if (!selectedTemplate) {
                  const created = createTemplate({
                    name: `HTML 导入模板 ${templates.length + 1}`,
                    sourceType: "html_import",
                    globalStyleConfig: inferredConfig,
                  });
                  updateTemplates([created, ...templates], "已从 HTML 分析创建模板");
                  setSelectedId(created.id);
                } else {
                  updateSelectedTemplate({
                    sourceType: "html_import",
                    globalStyleConfig: { ...styleConfig, ...inferredConfig },
                  });
                  setStatus("已将 HTML 分析结果写入当前模板");
                }
                setDraftMarkdown(markdown);
              }}
            />

            <section className="grid min-h-[calc(100vh-340px)] grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.85fr_1fr]">
              <MarkdownEditor
                value={draftMarkdown}
                onChange={setDraftMarkdown}
                contentWidth={contentWidth}
                fontSize={styleConfig.bodyFontSize}
                lineHeight={styleConfig.lineHeight}
                fontFamily={styleConfig.bodyFontFamily}
                syncEnabled={syncScroll}
                scrollRatio={scrollRatio}
                onScrollRatioChange={(ratio) => {
                  if (syncScroll) {
                    setScrollRatio(ratio);
                  }
                }}
              />

              <StylePanel
                title="模板样式配置"
                value={styleConfig}
                onChange={(nextConfig) => updateSelectedTemplate({ globalStyleConfig: nextConfig })}
              />

              <PreviewPanel
                html={html}
                cardWidth={previewCardWidth}
                syncEnabled={syncScroll}
                scrollRatio={scrollRatio}
                onScrollRatioChange={(ratio) => {
                  if (syncScroll) {
                    setScrollRatio(ratio);
                  }
                }}
              />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
