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
}

export function FormatInspector({ baseStyleConfig, onImport }: FormatInspectorProps) {
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
          <button
            onClick={pasteFromClipboard}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-100"
          >
            Paste from Clipboard
          </button>
          <button
            onClick={analyzeOnly}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
          >
            Analyze Only
          </button>
          <button
            onClick={importToWorkspace}
            className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
          >
            Parse and Load to Workspace
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
