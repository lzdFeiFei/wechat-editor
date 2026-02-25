"use client";

import { editableFieldsByType } from "@/lib/style/refineByType";
import { defaultStyleConfig } from "@/lib/style/styleConfig";
import type { StyleConfig } from "@/types/style";
import type { RefineByTypePatch, RefineElementType } from "@/types/template";

interface RefinePanelProps {
  refineByType: RefineByTypePatch;
  activeType: RefineElementType;
  onActiveTypeChange: (next: RefineElementType) => void;
  onChange: (next: RefineByTypePatch) => void;
}

export function RefinePanel({ refineByType, activeType, onActiveTypeChange, onChange }: RefinePanelProps) {
  const currentPatch = refineByType[activeType] ?? {};
  const fields = editableFieldsByType[activeType];

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">精修模式（按元素类型）</header>
      <div className="space-y-3 overflow-auto p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-700">选择元素类型</span>
          <select
            value={activeType}
            onChange={(event) => onActiveTypeChange(event.target.value as RefineElementType)}
            className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
          >
            {Object.keys(editableFieldsByType).map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            const next = { ...refineByType };
            delete next[activeType];
            onChange(next);
          }}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
        >
          重置 {activeType} 覆盖
        </button>

        {fields.map((field) => {
          const value = currentPatch[field];
          const baseValue = defaultStyleConfig[field];
          const effective = value ?? baseValue;
          const isColor = typeof baseValue === "string" && /^#/.test(baseValue);
          const isNumber = typeof baseValue === "number";

          if (field === "bodyTextAlign") {
            return (
              <label className="block" key={field}>
                <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
                <select
                  value={String(effective)}
                  onChange={(event) =>
                    onChange({
                      ...refineByType,
                      [activeType]: { ...currentPatch, [field]: event.target.value as StyleConfig["bodyTextAlign"] },
                    })
                  }
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
              <label className="block" key={field}>
                <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
                <select
                  value={String(effective)}
                  onChange={(event) =>
                    onChange({
                      ...refineByType,
                      [activeType]: { ...currentPatch, [field]: event.target.value as StyleConfig["bodyWordBreak"] },
                    })
                  }
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
              <label className="block" key={field}>
                <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
                <input
                  type="number"
                  value={Number(effective)}
                  onChange={(event) =>
                    onChange({
                      ...refineByType,
                      [activeType]: { ...currentPatch, [field]: Number(event.target.value) },
                    })
                  }
                  className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
                />
              </label>
            );
          }

          if (isColor) {
            return (
              <label className="block" key={field}>
                <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={String(effective)}
                    onChange={(event) =>
                      onChange({
                        ...refineByType,
                        [activeType]: { ...currentPatch, [field]: event.target.value },
                      })
                    }
                    className="h-9 w-12 cursor-pointer rounded border border-zinc-300 bg-white"
                  />
                  <input
                    type="text"
                    value={String(effective)}
                    onChange={(event) =>
                      onChange({
                        ...refineByType,
                        [activeType]: { ...currentPatch, [field]: event.target.value },
                      })
                    }
                    className="flex-1 rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
              </label>
            );
          }

          return (
            <label className="block" key={field}>
              <span className="mb-1 block text-xs font-medium text-zinc-700">{field}</span>
              <input
                type="text"
                value={String(effective)}
                onChange={(event) =>
                  onChange({
                    ...refineByType,
                    [activeType]: { ...currentPatch, [field]: event.target.value },
                  })
                }
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
