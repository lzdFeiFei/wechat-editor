"use client";

import { useMemo, useState } from "react";

import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { StylePanel } from "@/components/style/StylePanel";
import { FormatInspector } from "@/components/analysis/FormatInspector";
import { renderMarkdown, type RenderMode } from "@/lib/markdown/pipeline";
import { defaultStyleConfig, sampleMarkdown, validateStyleConfig } from "@/lib/style/styleConfig";
import type { StyleConfig } from "@/types/style";

export default function Home() {
  const [markdown, setMarkdown] = useState(sampleMarkdown);
  const [mode, setMode] = useState<RenderMode>("standard");
  const [styleConfig, setStyleConfig] = useState(defaultStyleConfig);
  const [copied, setCopied] = useState<string>("");

  const normalizedConfig = useMemo(() => validateStyleConfig(styleConfig), [styleConfig]);

  const html = useMemo(() => {
    try {
      return renderMarkdown(markdown, normalizedConfig, mode);
    } catch {
      return "<p style=\"color:#dc2626;\">Render failed. Please check markdown/style config.</p>";
    }
  }, [markdown, normalizedConfig, mode]);

  function flashMessage(message: string): void {
    setCopied(message);
    setTimeout(() => setCopied(""), 1400);
  }

  async function exportHtml(): Promise<void> {
    await navigator.clipboard.writeText(html);
    flashMessage("HTML source copied");
  }

  async function copyRichContent(): Promise<void> {
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
        flashMessage("Rich content copied for WeChat");
        return;
      }
    } catch {
      // Fallback to DOM-range copy below.
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

    flashMessage(copiedRich ? "Rich content copied for WeChat" : "Rich copy failed in this browser");
  }

  function exportConfig(): void {
    const blob = new Blob([JSON.stringify(normalizedConfig, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "styleConfig.json";
    anchor.click();
    URL.revokeObjectURL(url);
    flashMessage("styleConfig.json downloaded");
  }

  function handleImportFromInspector(payload: {
    markdown: string;
    inferredConfig: Partial<StyleConfig>;
  }): void {
    setMarkdown(payload.markdown);
    setStyleConfig((prev) => validateStyleConfig({ ...prev, ...payload.inferredConfig }));
    flashMessage("Imported parsed article into the existing 3-panel editor.");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#eef2ff,_#f8fafc_40%,_#ffffff_80%)] px-4 py-5 text-zinc-900 md:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <header className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold">WeChat Style Engine</h1>
              <p className="text-sm text-zinc-600">Markdown + StyleConfig {"->"} inline HTML</p>
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
                Copy Rich Content for WeChat
              </button>
              <button
                onClick={exportConfig}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
              >
                Export styleConfig.json
              </button>
            </div>
          </div>
          <p className="mt-2 h-5 text-xs text-emerald-600">{copied}</p>
        </header>

        <FormatInspector baseStyleConfig={normalizedConfig} onImport={handleImportFromInspector} />

        <section className="grid min-h-[calc(100vh-145px)] grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.85fr_1fr]">
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
          <StylePanel value={normalizedConfig} onChange={setStyleConfig} />
          <PreviewPanel html={html} />
        </section>
      </div>
    </main>
  );
}
