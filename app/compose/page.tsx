"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { RefinePanel } from "@/components/style/RefinePanel";
import { StylePanel } from "@/components/style/StylePanel";
import { renderMarkdown, type RenderMode } from "@/lib/markdown/pipeline";
import { defaultStyleConfig, sampleMarkdown, validateStyleConfig } from "@/lib/style/styleConfig";
import { applyTemplate } from "@/lib/template/applyTemplate";
import { readTemplatesFromStorage } from "@/lib/template/templateStore";
import type { StyleConfig } from "@/types/style";
import type { RefineByTypePatch, RefineElementType, StyleTemplate } from "@/types/template";

export default function ComposePage() {
  const [templates] = useState<StyleTemplate[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return readTemplatesFromStorage();
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    if (typeof window === "undefined") {
      return "";
    }
    const loaded = readTemplatesFromStorage();
    return loaded[0]?.id ?? "";
  });
  const [markdown, setMarkdown] = useState(sampleMarkdown);
  const [mode, setMode] = useState<RenderMode>("standard");
  const [globalStyle, setGlobalStyle] = useState<StyleConfig>(() => {
    if (typeof window === "undefined") {
      return defaultStyleConfig;
    }
    const loaded = readTemplatesFromStorage();
    if (loaded.length === 0) {
      return defaultStyleConfig;
    }
    return validateStyleConfig(loaded[0].globalStyleConfig);
  });
  const [undoSnapshot, setUndoSnapshot] = useState<StyleConfig | null>(null);
  const [refineByType, setRefineByType] = useState<RefineByTypePatch>({});
  const [activeRefineType, setActiveRefineType] = useState<RefineElementType>("h2");
  const [syncScroll, setSyncScroll] = useState(true);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [status, setStatus] = useState("");

  const selectedTemplate = useMemo(
    () => templates.find((item) => item.id === selectedTemplateId) ?? null,
    [selectedTemplateId, templates],
  );

  const html = useMemo(
    () => renderMarkdown(markdown, globalStyle, mode, { refineByType }),
    [globalStyle, markdown, mode, refineByType],
  );

  async function exportHtml(): Promise<void> {
    await navigator.clipboard.writeText(html);
    setStatus("HTML source copied");
  }

  async function copyRichContent(): Promise<void> {
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
        setStatus("Rich content copied for WeChat");
        return;
      }
    } catch {
      // Fallback below.
    }

    const container = document.createElement("div");
    container.setAttribute("contenteditable", "true");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.innerHTML = html;
    document.body.appendChild(container);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection?.removeAllRanges();
    selection?.addRange(range);

    const copiedRich = document.execCommand("copy");
    selection?.removeAllRanges();
    container.remove();

    setStatus(copiedRich ? "Rich content copied for WeChat" : "Rich copy failed in this browser");
  }

  function handleApplyTemplate(): void {
    if (!selectedTemplate) {
      setStatus("请先选择模板");
      return;
    }
    const result = applyTemplate(globalStyle, selectedTemplate);
    setGlobalStyle(result.nextStyleConfig);
    setUndoSnapshot(result.undoSnapshot);
    setStatus(`模板“${selectedTemplate.name}”已应用（可撤销）`);
  }

  function handleUndoApply(): void {
    if (!undoSnapshot) {
      return;
    }
    setGlobalStyle(undoSnapshot);
    setUndoSnapshot(null);
    setStatus("已撤销上一次模板应用");
  }

  const previewCardWidth = 375;
  const previewCardPadding = 16;
  const contentWidth = previewCardWidth - previewCardPadding * 2;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#eef2ff,_#f8fafc_40%,_#ffffff_80%)] px-4 py-5 text-zinc-900 md:px-6">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-4">
        <header className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Compose</p>
              <h1 className="text-lg font-semibold text-zinc-900">文章排版</h1>
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
                onClick={exportHtml}
                className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Export HTML
              </button>
              <button
                onClick={copyRichContent}
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Copy Rich Content
              </button>
              <button
                onClick={() => setSyncScroll((prev) => !prev)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  syncScroll ? "bg-indigo-700 text-white hover:bg-indigo-600" : "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                {syncScroll ? "Scroll Sync On" : "Scroll Sync Off"}
              </button>
              <Link href="/templates" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                模板管理
              </Link>
              <Link href="/" className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                首页
              </Link>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={selectedTemplateId}
              onChange={(event) => setSelectedTemplateId(event.target.value)}
              className="min-w-[220px] rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
            >
              <option value="">选择模板...</option>
              {templates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleApplyTemplate}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
            >
              应用模板（全量覆盖）
            </button>
            <button
              onClick={handleUndoApply}
              disabled={!undoSnapshot}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
            >
              撤销应用
            </button>
          </div>
          <p className="mt-2 h-5 text-xs text-emerald-600">{status}</p>
        </header>

        <section className="grid min-h-[calc(100vh-185px)] grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.8fr_0.8fr_1fr]">
          <MarkdownEditor
            value={markdown}
            onChange={setMarkdown}
            contentWidth={contentWidth}
            fontSize={globalStyle.bodyFontSize}
            lineHeight={globalStyle.lineHeight}
            fontFamily={globalStyle.bodyFontFamily}
            syncEnabled={syncScroll}
            scrollRatio={scrollRatio}
            onScrollRatioChange={(ratio) => {
              if (syncScroll) {
                setScrollRatio(ratio);
              }
            }}
          />

          <StylePanel title="全局样式" value={globalStyle} onChange={setGlobalStyle} />

          <RefinePanel
            refineByType={refineByType}
            activeType={activeRefineType}
            onActiveTypeChange={setActiveRefineType}
            onChange={setRefineByType}
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
    </main>
  );
}
