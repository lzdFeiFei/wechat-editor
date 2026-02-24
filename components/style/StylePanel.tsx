"use client";

import type { StyleConfig } from "@/types/style";

interface StylePanelProps {
  value: StyleConfig;
  onChange: (next: StyleConfig) => void;
}

interface NumberField {
  key: keyof StyleConfig;
  label: string;
  min: number;
  max: number;
  step?: number;
}

const numberFields: NumberField[] = [
  { key: "bodyFontSize", label: "Body Font", min: 12, max: 24, step: 1 },
  { key: "lineHeight", label: "Line Height", min: 1.2, max: 2.2, step: 0.05 },
  { key: "paragraphMarginTop", label: "Paragraph Top", min: 0, max: 30, step: 1 },
  { key: "paragraphSpacing", label: "Paragraph Bottom", min: 4, max: 50, step: 1 },
  { key: "h2Size", label: "H2 Size", min: 18, max: 40, step: 1 },
  { key: "h3Size", label: "H3 Size", min: 16, max: 32, step: 1 },
  { key: "headingWeight", label: "Heading Weight", min: 400, max: 900, step: 100 },
  { key: "headingLineHeight", label: "Heading Line Height", min: 1.1, max: 2.2, step: 0.05 },
  { key: "headingMarginTop", label: "Heading Margin Top", min: 0, max: 80, step: 1 },
  { key: "headingMarginBottom", label: "Heading Margin Bottom", min: 0, max: 60, step: 1 },
  { key: "headingPaddingLeft", label: "Heading Padding Left", min: 0, max: 40, step: 1 },
  { key: "headingBorderLeftWidth", label: "Heading Left Border", min: 0, max: 12, step: 1 },
  { key: "h3MarginTop", label: "H3 Margin Top", min: 0, max: 80, step: 1 },
  { key: "h3MarginBottom", label: "H3 Margin Bottom", min: 0, max: 60, step: 1 },
  { key: "h3PaddingVertical", label: "H3 Padding Vertical", min: 0, max: 24, step: 1 },
  { key: "h3PaddingHorizontal", label: "H3 Padding Horizontal", min: 0, max: 40, step: 1 },
  { key: "h3BorderLeftWidth", label: "H3 Left Border", min: 0, max: 12, step: 1 },
  { key: "h3BorderRadius", label: "H3 Radius", min: 0, max: 24, step: 1 },
  { key: "blockRadius", label: "Block Radius", min: 0, max: 24, step: 1 },
  { key: "blockPadding", label: "Block Padding", min: 4, max: 32, step: 1 },
  { key: "quoteFontSize", label: "Quote Font", min: 12, max: 24, step: 1 },
  { key: "quoteLineHeight", label: "Quote Line Height", min: 1.2, max: 2.4, step: 0.05 },
  { key: "imageMaxHeight", label: "Image Max Height", min: 100, max: 2000, step: 10 },
  { key: "hrHeight", label: "HR Height", min: 1, max: 12, step: 1 },
];

const colorFields: Array<{ key: keyof StyleConfig; label: string }> = [
  { key: "primaryColor", label: "Primary Color" },
  { key: "secondaryColor", label: "Secondary Color" },
  { key: "textColor", label: "Text Color" },
  { key: "listMarkerColor", label: "List Marker Color" },
  { key: "quoteBgColor", label: "Quote Background" },
  { key: "quoteBorderColor", label: "Quote Border" },
  { key: "headingBorderLeftColor", label: "Heading Border Color" },
];

const textFields: Array<{ key: keyof StyleConfig; label: string; placeholder?: string }> = [
  { key: "bodyFontFamily", label: "Font Family" },
  { key: "imageMargin", label: "Image Margin", placeholder: "28px auto" },
  { key: "imageBorder", label: "Image Border", placeholder: "1px solid rgba(...)" },
  { key: "imageBoxShadow", label: "Image Shadow", placeholder: "0 2px 8px rgba(...)" },
  { key: "h3BackgroundColor", label: "H3 Background", placeholder: "rgba(0, 47, 167, 0.1)" },
  { key: "hrMargin", label: "HR Margin", placeholder: "2.5rem auto" },
  { key: "hrBackground", label: "HR Background", placeholder: "linear-gradient(...)" },
  { key: "hrBorderTop", label: "HR Border Top", placeholder: "none" },
];

export function StylePanel({ value, onChange }: StylePanelProps) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700">StyleConfig</header>
      <div className="space-y-5 overflow-auto p-4">
        <div className="space-y-3">
          {numberFields.map((field) => (
            <label className="block" key={field.key}>
              <span className="mb-1 block text-xs font-medium text-zinc-700">{field.label}</span>
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                value={value[field.key] as number}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [field.key]: Number(event.target.value),
                  })
                }
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
              />
            </label>
          ))}
        </div>

        <div className="space-y-3">
          {colorFields.map((field) => (
            <label className="block" key={field.key}>
              <span className="mb-1 block text-xs font-medium text-zinc-700">{field.label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value[field.key] as string}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      [field.key]: event.target.value,
                    })
                  }
                  className="h-9 w-12 cursor-pointer rounded border border-zinc-300 bg-white"
                />
                <input
                  type="text"
                  value={value[field.key] as string}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      [field.key]: event.target.value,
                    })
                  }
                  className="flex-1 rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
                />
              </div>
            </label>
          ))}
        </div>

        <div className="space-y-3">
          {textFields.map((field) => (
            <label className="block" key={field.key}>
              <span className="mb-1 block text-xs font-medium text-zinc-700">{field.label}</span>
              <input
                type="text"
                value={value[field.key] as string}
                placeholder={field.placeholder}
                onChange={(event) =>
                  onChange({
                    ...value,
                    [field.key]: event.target.value,
                  })
                }
                className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700">Text Align</span>
            <select
              value={value.bodyTextAlign}
              onChange={(event) => onChange({ ...value, bodyTextAlign: event.target.value as StyleConfig["bodyTextAlign"] })}
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
            >
              <option value="start">start</option>
              <option value="left">left</option>
              <option value="center">center</option>
              <option value="right">right</option>
              <option value="justify">justify</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700">Word Break</span>
            <select
              value={value.bodyWordBreak}
              onChange={(event) => onChange({ ...value, bodyWordBreak: event.target.value as StyleConfig["bodyWordBreak"] })}
              className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-sm outline-none focus:border-zinc-500"
            >
              <option value="break-all">break-all</option>
              <option value="break-word">break-word</option>
              <option value="normal">normal</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
