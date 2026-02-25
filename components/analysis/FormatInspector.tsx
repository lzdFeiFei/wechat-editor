"use client";

import { useState } from "react";

import {
  htmlToMarkdown,
  inferStyleConfigFromHtml,
  inspectHtmlFormat,
  normalizeImportedHtml,
  type FormatInspectionReport,
} from "@/lib/analysis/formatInspector";
import type { StyleConfig } from "@/types/style";

interface FormatInspectorProps {
  baseStyleConfig: StyleConfig;
  onImport: (payload: { markdown: string; inferredConfig: Partial<StyleConfig> }) => void;
  showAnalyzeButton?: boolean;
  confirmLabel?: string;
  pasteIconOnly?: boolean;
  onImportSuccess?: () => void;
}

export function FormatInspector({
  baseStyleConfig,
  onImport,
  showAnalyzeButton = true,
  confirmLabel = "Parse and Load to Workspace",
  pasteIconOnly = false,
  onImportSuccess,
}: FormatInspectorProps) {
  const [inputHtml, setInputHtml] = useState("");
  const [report, setReport] = useState<FormatInspectionReport | null>(null);
  const [status, setStatus] = useState("");

  async function pasteFromClipboard(): Promise<void> {
    try {
      let html = "";
      if (navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          if (item.types.includes("text/html")) {
            const blob = await item.getType("text/html");
            html = await blob.text();
            break;
          }
        }
      }
      if (!html) {
        html = await navigator.clipboard.readText();
      }
      setInputHtml(html);
      setStatus("Clipboard content loaded.");
    } catch {
      setStatus("Clipboard access failed. Paste manually.");
    }
  }

  function analyzeOnly(): void {
    if (!inputHtml.trim()) {
      setStatus("Please paste HTML first.");
      setReport(null);
      return;
    }
    try {
      const normalizedHtml = normalizeImportedHtml(inputHtml);
      setReport(inspectHtmlFormat(normalizedHtml));
      setStatus("Format inspection completed (normalized WeChat editor wrappers).");
    } catch {
      setStatus("Failed to parse HTML.");
      setReport(null);
    }
  }

  function importToWorkspace(): void {
    if (!inputHtml.trim()) {
      setStatus("Please paste HTML first.");
      return;
    }
    try {
      const normalizedHtml = normalizeImportedHtml(inputHtml);
      const markdown = htmlToMarkdown(normalizedHtml);
      const inferredConfig = inferStyleConfigFromHtml(normalizedHtml, baseStyleConfig);
      const nextReport = inspectHtmlFormat(normalizedHtml);
      setReport(nextReport);
      onImport({ markdown, inferredConfig });
      setStatus("Imported to workspace with normalized structure and inferred style.");
      onImportSuccess?.();
    } catch {
      setStatus("Import failed. Check HTML input.");
    }
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-800">Format Inspector</h2>
          <p className="text-xs text-zinc-600">Paste WeChat HTML, analyze formats, and import into the 3-panel workspace.</p>
        </div>
        <div className="flex items-center gap-2">
          {pasteIconOnly ? (
            <button
              onClick={pasteFromClipboard}
              aria-label="Paste from Clipboard"
              title="Paste from Clipboard"
              className="rounded-lg border border-zinc-300 bg-white p-1.5 text-zinc-700 hover:bg-zinc-100"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 4H15V6H9V4Z" fill="currentColor" />
                <path
                  d="M7 2C5.9 2 5 2.9 5 4V6H4C2.9 6 2 6.9 2 8V20C2 21.1 2.9 22 4 22H16C17.1 22 18 21.1 18 20V18H20C21.1 18 22 17.1 22 16V8C22 6.9 21.1 6 20 6H19V4C19 2.9 18.1 2 17 2H7ZM7 4H17V6H7V4ZM4 8H16V20H4V8ZM18 8H20V16H18V8Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={pasteFromClipboard}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
            >
              Paste from Clipboard
            </button>
          )}
          {showAnalyzeButton ? (
            <button
              onClick={analyzeOnly}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
            >
              Analyze Only
            </button>
          ) : null}
          <button
            onClick={importToWorkspace}
            className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <textarea
        value={inputHtml}
        onChange={(event) => setInputHtml(event.target.value)}
        placeholder="Paste HTML here..."
        className="mt-3 h-32 w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 font-mono text-xs outline-none focus:border-zinc-500"
      />

      <p className="mt-2 h-4 text-xs text-emerald-600">{status}</p>

      {report ? (
        <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <div className="grid grid-cols-1 gap-2 text-xs text-zinc-700 sm:grid-cols-3">
            <p>Total elements: <strong>{report.totalElements}</strong></p>
            <p>Inline style elements: <strong>{report.inlineStyleElements}</strong></p>
            <p>Class-based elements: <strong>{report.classElements}</strong></p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
