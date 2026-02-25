"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { renderMarkdown, type RenderMode } from "@/lib/markdown/pipeline";
import { defaultStyleConfig } from "@/lib/style/styleConfig";
import {
  createTemplate,
  duplicateTemplate,
  exportTemplateJson,
  parseTemplateImport,
  persistTemplates,
  readTemplatesFromStorage,
} from "@/lib/template/templateStore";
import type { StyleTemplate } from "@/types/template";

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<StyleTemplate[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return readTemplatesFromStorage();
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mode, setMode] = useState<RenderMode>("standard");
  const [status, setStatus] = useState("");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState("");

  useEffect(() => {
    persistTemplates(templates);
  }, [templates]);

  const previewTemplate = useMemo(
    () => templates.find((item) => item.id === hoveredId) ?? null,
    [hoveredId, templates],
  );

  const previewHtml = useMemo(() => {
    if (!previewTemplate) {
      return "";
    }
    return renderMarkdown(
      previewTemplate.previewMarkdown,
      previewTemplate.globalStyleConfig,
      mode,
    );
  }, [mode, previewTemplate]);

  const importValidation = useMemo(() => {
    if (!importJson.trim()) {
      return null;
    }
    return parseTemplateImport(importJson);
  }, [importJson]);

  function updateTemplates(next: StyleTemplate[], message: string): void {
    const sorted = [...next].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setTemplates(sorted);
    setStatus(message);
  }

  function createManualTemplate(): void {
    const created = createTemplate({
      name: `新模板 ${templates.length + 1}`,
      sourceType: "manual",
      globalStyleConfig: defaultStyleConfig,
    });
    updateTemplates([created, ...templates], "模板已创建");
    router.push(`/templates/${created.id}`);
  }

  function duplicateCurrentTemplate(template: StyleTemplate): void {
    const duplicated = duplicateTemplate(template);
    updateTemplates([duplicated, ...templates], "模板已复制");
  }

  function deleteCurrentTemplate(template: StyleTemplate): void {
    const confirmed = window.confirm(`确认删除模板“${template.name}”？此操作不可恢复。`);
    if (!confirmed) {
      return;
    }
    const next = templates.filter((item) => item.id !== template.id);
    updateTemplates(next, "模板已删除");
  }

  function exportCurrentTemplate(template: StyleTemplate): void {
    const blob = new Blob([exportTemplateJson(template)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${template.name}.template.json`;
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
    setImportModalOpen(false);
    setImportJson("");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f8fbff,_#f8fafc_40%,_#ffffff_80%)] px-4 py-5 text-zinc-900 md:px-6">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-4">
        <header className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                Template Management
              </p>
              <h1 className="text-lg font-semibold text-zinc-900">模板管理</h1>
              <p className="text-xs text-zinc-600">
                列表页只负责模板数据管理；点击模板进入独立详情页配置样式。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-lg border border-zinc-300 p-1 text-sm">
                <button
                  className={`rounded-md px-3 py-1 ${
                    mode === "standard" ? "bg-zinc-900 text-white" : "text-zinc-700"
                  }`}
                  onClick={() => setMode("standard")}
                >
                  Standard
                </button>
                <button
                  className={`rounded-md px-3 py-1 ${
                    mode === "safe" ? "bg-zinc-900 text-white" : "text-zinc-700"
                  }`}
                  onClick={() => setMode("safe")}
                >
                  Safe
                </button>
              </div>
              <Link
                href="/"
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                返回首页
              </Link>
              <Link
                href="/compose"
                className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
              >
                去文章排版
              </Link>
            </div>
          </div>
          <p className="mt-2 h-5 text-xs text-emerald-600">{status}</p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_440px]">
          <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {templates.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-600 sm:col-span-2 xl:col-span-3">
                  暂无模板，请先新建模板。
                </div>
              ) : (
                templates.map((item) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => router.push(`/templates/${item.id}`)}
                    className="cursor-pointer rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition hover:bg-zinc-100"
                  >
                    <p className="font-medium text-zinc-900">{item.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      来源 {item.sourceType} · 更新于{" "}
                      {new Date(item.updatedAt).toLocaleString()}
                    </p>
                    {item.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-600">
                        {item.description}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          duplicateCurrentTemplate(item);
                        }}
                        className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                      >
                        复制模板
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteCurrentTemplate(item);
                        }}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        删除模板
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          exportCurrentTemplate(item);
                        }}
                        className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
                      >
                        导出 JSON
                      </button>
                    </div>
                  </div>
                ))
              )}

              <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={createManualTemplate}
                    className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    新建模板
                  </button>
                  <button
                    onClick={() => setImportModalOpen(true)}
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    导入 JSON
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="sticky top-5 h-[calc(100vh-3rem)] rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
            <header className="border-b border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700">
              悬浮预览（公众号样式）
            </header>
            <div className="flex h-[calc(100%-49px)] items-start justify-center overflow-auto p-5">
              {previewTemplate ? (
                <article className="rounded-2xl bg-white p-4 shadow" style={{ width: "375px" }}>
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </article>
              ) : (
                <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-600">
                  把鼠标移动到模板卡片上查看预览
                </div>
              )}
            </div>
          </section>
        </section>
      </div>

      {importModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-zinc-900">导入模板 JSON</h2>
              <button
                onClick={() => setImportModalOpen(false)}
                className="rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
              >
                关闭
              </button>
            </div>
            <textarea
              value={importJson}
              onChange={(event) => setImportJson(event.target.value)}
              placeholder='{"name":"模板名","globalStyleConfig":{...}}'
              className={`mt-3 h-52 w-full resize-none rounded-md px-2 py-1.5 font-mono text-xs outline-none focus:border-zinc-500 ${
                importValidation && !importValidation.ok
                  ? "border border-red-400 bg-red-50"
                  : "border border-zinc-300"
              }`}
            />
            <p
              className={`mt-2 text-xs ${
                importValidation === null
                  ? "text-zinc-500"
                  : importValidation.ok
                    ? "text-emerald-600"
                    : "text-red-600"
              }`}
            >
              {importValidation === null
                ? "请输入模板 JSON"
                : importValidation.ok
                  ? "JSON 格式合法，可导入"
                  : importValidation.message}
            </p>
            {importValidation && !importValidation.ok ? (
              <ul className="mt-2 space-y-1 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                {importValidation.issues.map((issue, index) => (
                  <li key={`${issue.field}-${index}`}>
                    字段 `{issue.field}`: {issue.message}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setImportModalOpen(false)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
              >
                取消
              </button>
              <button
                onClick={importTemplateFromJson}
                disabled={!importValidation || !importValidation.ok}
                className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                确认导入
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
