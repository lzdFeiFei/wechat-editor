"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FormatInspector } from "@/components/analysis/FormatInspector";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { renderMarkdown, type RenderMode } from "@/lib/markdown/pipeline";
import { editableFieldsByType } from "@/lib/style/refineByType";
import { defaultStyleConfig, validateStyleConfig } from "@/lib/style/styleConfig";
import {
  createManualPreset,
  deletePresetFromLibrary,
  duplicatePresetInLibrary,
  importExtractedPresets,
  persistStyleLibrary,
  readStyleLibraryFromStorage,
  updatePresetInLibrary,
  type StyleLibraryState,
} from "@/lib/style-library/store";
import type { StyleConfig } from "@/types/style";
import type { ElementStylePreset } from "@/types/styleLibrary";
import type { RefineElementType } from "@/types/template";

const styleBuilderPreviewMarkdown = `# 组件化样式预览

## 二级标题样式

### 三级标题样式

这是一段正文示例，用于观察字号、行高、字色、对齐和段间距。

- 列表示例第一项
- 列表示例第二项

> 引用块示例，观察背景、边框、圆角和字体。

![Image](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900)

---
`;

type ImportFeedback = {
  imported: Array<{ elementType: string; finalName: string; renamedFrom?: string }>;
  warnings: string[];
};

function sortByUpdatedAtDesc<T extends { updatedAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export default function StyleBuilderPage() {
  const [library, setLibrary] = useState<StyleLibraryState>(() => {
    if (typeof window === "undefined") {
      return { presets: [] };
    }
    return readStyleLibraryFromStorage();
  });
  const [selectedType, setSelectedType] = useState<RefineElementType>("h2");
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [mode, setMode] = useState<RenderMode>("standard");
  const [scrollRatio, setScrollRatio] = useState(0);
  const [status, setStatus] = useState("");
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [sourceTitle, setSourceTitle] = useState("参考文档");
  const [feedback, setFeedback] = useState<ImportFeedback | null>(null);

  useEffect(() => {
    persistStyleLibrary(library);
  }, [library]);

  const groupedPresets = useMemo(() => {
    const map: Record<RefineElementType, ElementStylePreset[]> = {
      h1: [],
      h2: [],
      h3: [],
      p: [],
      li: [],
      blockquote: [],
      img: [],
      hr: [],
    };
    for (const preset of library.presets) {
      map[preset.elementType].push(preset);
    }
    for (const type of Object.keys(map) as RefineElementType[]) {
      map[type] = sortByUpdatedAtDesc(map[type]);
    }
    return map;
  }, [library.presets]);

  const selectedTypePresets = groupedPresets[selectedType];

  const selectedPreset =
    selectedTypePresets.find((preset) => preset.id === selectedPresetId) ??
    selectedTypePresets[0] ??
    null;
  const activePresetId = selectedPreset?.id ?? "";
  const editableFields = editableFieldsByType[selectedType];
  const effectiveConfig = validateStyleConfig({
    ...defaultStyleConfig,
    ...(selectedPreset?.configPatch ?? {}),
  });
  const previewHtml = renderMarkdown(styleBuilderPreviewMarkdown, effectiveConfig, mode);

  function updatePreset(presetId: string, patch: Partial<Omit<ElementStylePreset, "id" | "createdAt">>): void {
    setLibrary((prev) => updatePresetInLibrary(prev, presetId, patch));
  }

  function createPresetForCurrentType(): void {
    const result = createManualPreset(library, selectedType);
    setLibrary(result.nextLibraryState);
    setSelectedPresetId(result.created.id);
    setStatus(`已新建样式：${result.created.name}`);
  }

  function duplicateSelectedPreset(): void {
    if (!selectedPreset) {
      setStatus("请先选择一个样式");
      return;
    }
    const result = duplicatePresetInLibrary(library, selectedPreset.id);
    if (!result.duplicated) {
      setStatus("复制失败：未找到样式");
      return;
    }
    setLibrary(result.nextLibraryState);
    setSelectedType(result.duplicated.elementType);
    setSelectedPresetId(result.duplicated.id);
    setStatus(`已复制样式：${result.duplicated.name}`);
  }

  function deleteSelectedPreset(): void {
    if (!selectedPreset) {
      setStatus("请先选择一个样式");
      return;
    }
    const confirmed = window.confirm(`确认删除样式“${selectedPreset.name}”？`);
    if (!confirmed) {
      return;
    }
    const next = deletePresetFromLibrary(library, selectedPreset.id);
    setLibrary(next);
    setSelectedPresetId("");
    setStatus(`已删除样式：${selectedPreset.name}`);
  }

  function renderFieldEditor(field: keyof StyleConfig) {
    if (!selectedPreset) {
      return null;
    }
    const patchValue = selectedPreset.configPatch[field];
    const baseValue = defaultStyleConfig[field];
    const effectiveValue = patchValue ?? baseValue;
    const isNumber = typeof baseValue === "number";
    const isColor = typeof baseValue === "string" && /^#/.test(baseValue);

    const writePatch = (value: StyleConfig[keyof StyleConfig]) => {
      updatePreset(selectedPreset.id, {
        configPatch: {
          ...selectedPreset.configPatch,
          [field]: value,
        },
      });
      setStatus(`已更新 ${selectedPreset.name} 的 ${field}`);
    };

    if (field === "bodyTextAlign") {
      return (
        <label key={field} className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
          <select
            value={String(effectiveValue)}
            onChange={(event) => writePatch(event.target.value as StyleConfig["bodyTextAlign"])}
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
          >
            <option value="start">start</option>
            <option value="left">left</option>
            <option value="center">center</option>
            <option value="right">right</option>
            <option value="justify">justify</option>
          </select>
        </label>
      );
    }

    if (field === "bodyWordBreak") {
      return (
        <label key={field} className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
          <select
            value={String(effectiveValue)}
            onChange={(event) => writePatch(event.target.value as StyleConfig["bodyWordBreak"])}
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
          >
            <option value="normal">normal</option>
            <option value="break-all">break-all</option>
            <option value="break-word">break-word</option>
          </select>
        </label>
      );
    }

    if (isNumber) {
      return (
        <label key={field} className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
          <input
            type="number"
            value={Number(effectiveValue)}
            onChange={(event) => writePatch(Number(event.target.value))}
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
          />
        </label>
      );
    }

    if (isColor) {
      return (
        <label key={field} className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={String(effectiveValue)}
              onChange={(event) => writePatch(event.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-zinc-300 bg-white"
            />
            <input
              type="text"
              value={String(effectiveValue)}
              onChange={(event) => writePatch(event.target.value)}
              className="flex-1 rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
            />
          </div>
        </label>
      );
    }

    return (
      <label key={field} className="block">
        <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
        <input
          type="text"
          value={String(effectiveValue)}
          onChange={(event) => writePatch(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
        />
      </label>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f6fbff,_#f8fafc_40%,_#ffffff_80%)] px-4 py-5 text-zinc-900 md:px-6">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-4">
        <header className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                Style Builder
              </p>
              <h1 className="text-lg font-semibold text-zinc-900">元素样式配置</h1>
              <p className="text-xs text-zinc-600">
                以元素类型管理样式组件，并支持从排版参考文档提取样式入库。
              </p>
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
                onClick={() => setImportModalOpen(true)}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                排版参考导入
              </button>
              <Link
                href="/templates"
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                模板管理
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100"
              >
                首页
              </Link>
            </div>
          </div>
          <p className="mt-2 h-5 text-xs text-emerald-600">{status}</p>
        </header>

        {feedback ? (
          <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">导入结果</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <p className="font-semibold">成功导入</p>
                {feedback.imported.length === 0 ? (
                  <p className="mt-1">无</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {feedback.imported.map((item) => (
                      <li key={`${item.elementType}-${item.finalName}`}>
                        {item.elementType}
                        {" -> "}
                        {item.finalName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <p className="font-semibold">自动重命名</p>
                {feedback.imported.some((item) => item.renamedFrom) ? (
                  <ul className="mt-1 space-y-1">
                    {feedback.imported
                      .filter((item) => item.renamedFrom)
                      .map((item) => (
                        <li key={`${item.elementType}-${item.finalName}-renamed`}>
                          {item.renamedFrom}
                          {" -> "}
                          {item.finalName}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="mt-1">无</p>
                )}
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-700">
                <p className="font-semibold">警告项</p>
                {feedback.warnings.length === 0 ? (
                  <p className="mt-1">无</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {feedback.warnings.map((warning, index) => (
                      <li key={`${warning}-${index}`}>{warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        ) : null}

        <section className="grid min-h-[calc(100vh-270px)] grid-cols-1 gap-4 xl:grid-cols-[0.92fr_0.95fr_1fr]">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">元素样式库</h2>
              <div className="flex items-center gap-2">
                <select
                  value={selectedType}
                  onChange={(event) => {
                    const nextType = event.target.value as RefineElementType;
                    setSelectedType(nextType);
                    setSelectedPresetId(groupedPresets[nextType][0]?.id ?? "");
                  }}
                  className="rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
                >
                  {(Object.keys(editableFieldsByType) as RefineElementType[]).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button
                  onClick={createPresetForCurrentType}
                  className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  新建样式
                </button>
                <button
                  onClick={duplicateSelectedPreset}
                  disabled={!selectedPreset}
                  className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
                >
                  复制
                </button>
                <button
                  onClick={deleteSelectedPreset}
                  disabled={!selectedPreset}
                  className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  删除
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-2 overflow-auto">
              {selectedTypePresets.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-3 text-sm text-zinc-600">
                  当前类型暂无样式。可用“排版参考导入”批量生成。
                </div>
              ) : (
                selectedTypePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      activePresetId === preset.id
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100"
                    }`}
                  >
                    <p className="text-sm font-semibold">{preset.name}</p>
                    <p className={`mt-1 text-xs ${activePresetId === preset.id ? "text-zinc-300" : "text-zinc-500"}`}>
                      来源 {preset.sourceTitle} · {new Date(preset.updatedAt).toLocaleString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">样式字段配置</h2>
            {selectedPreset ? (
              <div className="mt-3 space-y-3 overflow-auto">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-zinc-700">样式名称</span>
                  <input
                    value={selectedPreset.name}
                    onChange={(event) =>
                      updatePreset(selectedPreset.id, {
                        name: event.target.value || selectedPreset.name,
                      })
                    }
                    className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                {editableFields.map((field) => renderFieldEditor(field))}
              </div>
            ) : (
              <div className="mt-3 rounded-lg border border-dashed border-zinc-300 p-3 text-sm text-zinc-600">
                请先选择一个样式。
              </div>
            )}
          </section>

          <PreviewPanel
            html={previewHtml}
            cardWidth={375}
            syncEnabled={false}
            scrollRatio={scrollRatio}
            onScrollRatioChange={setScrollRatio}
          />
        </section>
      </div>

      {importModalOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-5xl rounded-xl border border-zinc-200 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-zinc-900">排版参考导入</h2>
              <button
                onClick={() => setImportModalOpen(false)}
                className="rounded-md border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
              >
                关闭
              </button>
            </div>
            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-medium text-zinc-700">参考文档名</span>
              <input
                value={sourceTitle}
                onChange={(event) => setSourceTitle(event.target.value)}
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
              />
            </label>
            <FormatInspector
              baseStyleConfig={defaultStyleConfig}
              showAnalyzeButton={false}
              pasteIconOnly
              confirmLabel="Confirm"
              onExtractElementPresets={(result) => {
                const importedResult = importExtractedPresets(
                  library,
                  result.presets,
                  sourceTitle,
                );
                if (importedResult.imported.length === 0) {
                  setFeedback({
                    imported: [],
                    warnings: result.warnings,
                  });
                  setStatus("未提取到可导入的元素样式");
                  return;
                }
                setLibrary(importedResult.nextLibraryState);
                setSelectedType(importedResult.imported[0].elementType as RefineElementType);
                setSelectedPresetId("");
                setFeedback({
                  imported: importedResult.imported,
                  warnings: result.warnings,
                });
                setStatus(`已导入 ${importedResult.imported.length} 个元素样式`);
              }}
              onImportSuccess={() => setImportModalOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
