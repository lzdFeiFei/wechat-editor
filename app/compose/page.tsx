"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { renderMarkdown, type RenderMode } from "@/lib/markdown/pipeline";
import { deriveRefineByTypeFromTemplate } from "@/lib/style-library/mapping";
import { readStyleLibraryFromStorage } from "@/lib/style-library/store";
import { defaultStyleConfig, sampleMarkdown } from "@/lib/style/styleConfig";
import { readTemplatesFromStorage } from "@/lib/template/templateStore";
import type { ElementStylePreset } from "@/types/styleLibrary";
import type { StyleTemplate } from "@/types/template";

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
  const [syncScroll, setSyncScroll] = useState(true);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [status, setStatus] = useState("");
  const [libraryPresets, setLibraryPresets] = useState<ElementStylePreset[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return readStyleLibraryFromStorage().presets;
  });

  useEffect(() => {
    const refresh = () => setLibraryPresets(readStyleLibraryFromStorage().presets);
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const selectedTemplate = useMemo(
    () => templates.find((item) => item.id === selectedTemplateId) ?? null,
    [selectedTemplateId, templates],
  );
  const appliedGlobalStyle = selectedTemplate?.globalStyleConfig ?? defaultStyleConfig;
  const appliedRefineByType = useMemo(
    () =>
      selectedTemplate
        ? deriveRefineByTypeFromTemplate(selectedTemplate, libraryPresets)
        : {},
    [libraryPresets, selectedTemplate],
  );

  const html = useMemo(
    () => renderMarkdown(markdown, appliedGlobalStyle, mode, { refineByType: appliedRefineByType }),
    [appliedGlobalStyle, appliedRefineByType, markdown, mode],
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

  function handleResetTemplate(): void {
    if (!selectedTemplate) {
      setStatus("请先选择模板");
      return;
    }
    setStatus(`已按模板“${selectedTemplate.name}”重置预览样式`);
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
              onChange={(event) => {
                const nextId = event.target.value;
                setSelectedTemplateId(nextId);
                const nextTemplate = templates.find((item) => item.id === nextId);
                if (nextTemplate) {
                  setStatus(`模板“${nextTemplate.name}”已应用`);
                  return;
                }
                setStatus("已取消模板选择");
              }}
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
              onClick={handleResetTemplate}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
            >
              重置为模板
            </button>
          </div>
          <p className="mt-2 h-5 text-xs text-emerald-600">{status}</p>
        </header>

        <section className="grid min-h-[calc(100vh-185px)] grid-cols-1 gap-4 xl:grid-cols-[1.25fr_1fr]">
          <MarkdownEditor
            value={markdown}
            onChange={setMarkdown}
            contentWidth={contentWidth}
            fontSize={appliedGlobalStyle.bodyFontSize}
            lineHeight={appliedGlobalStyle.lineHeight}
            fontFamily={appliedGlobalStyle.bodyFontFamily}
            syncEnabled={syncScroll}
            scrollRatio={scrollRatio}
            onScrollRatioChange={(ratio) => {
              if (syncScroll) {
                setScrollRatio(ratio);
              }
            }}
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
