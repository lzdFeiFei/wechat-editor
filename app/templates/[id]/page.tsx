"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { FormatInspector } from "@/components/analysis/FormatInspector";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { StylePanel } from "@/components/style/StylePanel";
import { renderMarkdown, type RenderMode } from "@/lib/markdown/pipeline";
import { defaultStyleConfig, validateStyleConfig } from "@/lib/style/styleConfig";
import { persistTemplates, readTemplatesFromStorage } from "@/lib/template/templateStore";
import type { StyleConfig } from "@/types/style";
import type { StyleTemplate } from "@/types/template";

export default function TemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const templateId = params?.id;

  const [templates, setTemplates] = useState<StyleTemplate[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return readTemplatesFromStorage();
  });
  const [mode, setMode] = useState<RenderMode>("standard");
  const [status, setStatus] = useState("");
  const [syncScroll, setSyncScroll] = useState(true);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [referenceOpen, setReferenceOpen] = useState(false);

  useEffect(() => {
    persistTemplates(templates);
  }, [templates]);

  const template = useMemo(
    () => templates.find((item) => item.id === templateId) ?? null,
    [templateId, templates],
  );

  const styleConfig = template?.globalStyleConfig ?? defaultStyleConfig;
  const markdown = template?.previewMarkdown ?? "";
  const html = useMemo(
    () => renderMarkdown(markdown, styleConfig, mode),
    [markdown, mode, styleConfig],
  );

  function updateCurrentTemplate(patch: Partial<StyleTemplate>, message: string): void {
    if (!template) {
      return;
    }
    const updated: StyleTemplate = {
      ...template,
      ...patch,
      globalStyleConfig: validateStyleConfig(
        patch.globalStyleConfig ?? template.globalStyleConfig,
      ),
      previewMarkdown: patch.previewMarkdown ?? template.previewMarkdown,
      updatedAt: new Date().toISOString(),
    };
    const next = templates
      .map((item) => (item.id === updated.id ? updated : item))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setTemplates(next);
    setStatus(message);
  }

  if (!templateId || !template) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-10">
        <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-zinc-900">模板不存在</h1>
          <p className="mt-2 text-sm text-zinc-600">
            未找到该模板，可能已删除或本地数据已变更。
          </p>
          <button
            onClick={() => router.push("/templates")}
            className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            返回模板列表
          </button>
        </div>
      </main>
    );
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
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                Template Detail
              </p>
              <h1 className="text-lg font-semibold text-zinc-900">
                模板配置：{template.name}
              </h1>
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
              <button
                onClick={() => setSyncScroll((prev) => !prev)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  syncScroll
                    ? "bg-indigo-700 text-white hover:bg-indigo-600"
                    : "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                {syncScroll ? "Scroll Sync On" : "Scroll Sync Off"}
              </button>
              <button
                onClick={() => setReferenceOpen(true)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                排版参考
              </button>
              <Link
                href="/templates"
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                返回模板列表
              </Link>
            </div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-700">模板名称</span>
              <input
                value={template.name}
                onChange={(event) =>
                  updateCurrentTemplate({ name: event.target.value }, "模板名称已更新")
                }
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-700">描述</span>
              <input
                value={template.description ?? ""}
                onChange={(event) =>
                  updateCurrentTemplate(
                    { description: event.target.value },
                    "模板描述已更新",
                  )
                }
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
              />
            </label>
          </div>
          <p className="mt-2 h-5 text-xs text-emerald-600">{status}</p>
        </header>

        <section className="grid min-h-[calc(100vh-300px)] grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.85fr_1fr]">
          <MarkdownEditor
            value={markdown}
            onChange={(value) =>
              updateCurrentTemplate({ previewMarkdown: value }, "模板文案已保存")
            }
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
            onChange={(nextConfig: StyleConfig) =>
              updateCurrentTemplate(
                { globalStyleConfig: nextConfig },
                "模板样式已保存",
              )
            }
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

      {referenceOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-5xl rounded-xl border border-zinc-200 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-zinc-900">排版参考</h2>
              <button
                onClick={() => setReferenceOpen(false)}
                className="rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
              >
                关闭
              </button>
            </div>
            <FormatInspector
              baseStyleConfig={styleConfig}
              showAnalyzeButton={false}
              pasteIconOnly
              confirmLabel="Confirm"
              onImport={({ markdown: importedMarkdown, inferredConfig }) => {
                updateCurrentTemplate(
                  {
                    sourceType: "html_import",
                    previewMarkdown: importedMarkdown,
                    globalStyleConfig: { ...styleConfig, ...inferredConfig },
                  },
                  "已将 HTML 分析结果写入当前模板",
                );
              }}
              onImportSuccess={() => setReferenceOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
