import type { StyleConfig } from "@/types/style";

export const defaultStyleConfig: StyleConfig = {
  bodyFontSize: 16,
  lineHeight: 1.75,
  paragraphMarginTop: 5,
  paragraphSpacing: 16,
  bodyFontFamily:
    "PingFang SC, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Arial, sans-serif",
  bodyTextAlign: "start",
  bodyWordBreak: "break-all",
  h2Size: 24,
  h3Size: 20,
  headingWeight: 700,
  headingLineHeight: 1.4,
  headingMarginTop: 36,
  headingMarginBottom: 24,
  headingPaddingLeft: 12,
  headingBorderLeftWidth: 4,
  headingBorderLeftColor: "#002fa7",
  h3MarginTop: 28,
  h3MarginBottom: 20,
  h3PaddingVertical: 6,
  h3PaddingHorizontal: 12,
  h3BorderLeftWidth: 3,
  h3BorderRadius: 6,
  h3BackgroundColor: "rgba(0, 47, 167, 0.1)",
  primaryColor: "#1f2937",
  secondaryColor: "#4b5563",
  textColor: "#111827",
  blockRadius: 8,
  blockPadding: 14,
  quoteFontSize: 15,
  quoteLineHeight: 1.8,
  quoteBgColor: "#f8fafc",
  quoteBorderColor: "#d1d5db",
  imageMargin: "28px auto",
  imageMaxHeight: 600,
  imageBorder: "1px solid rgba(0, 47, 167, 0.1)",
  imageBoxShadow: "0 2px 8px rgba(0, 47, 167, 0.06), 0 8px 24px rgba(0, 47, 167, 0.08)",
  hrMargin: "2.5rem auto",
  hrHeight: 1,
  hrBackground:
    "linear-gradient(to right, transparent, rgba(0, 47, 167, 0.3), rgba(0, 47, 167, 0.3), transparent)",
  hrBorderTop: "none",
};

export const sampleMarkdown = `## WeChat Style Engine

This project compiles Markdown into inline HTML for WeChat publishing.

### Why inline style

- WeChat strips most external styles.
- Inline styles are more reliable for paste workflows.

> Keep content and style fully separated.

![Sample image](https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900)

~~~ts
export const answer = 42;
~~~
`;

const numericRules: Record<keyof Pick<StyleConfig,
  "bodyFontSize" | "lineHeight" | "paragraphMarginTop" | "paragraphSpacing" | "h2Size" | "h3Size" |
  "headingWeight" | "headingLineHeight" | "headingMarginTop" | "headingMarginBottom" | "headingPaddingLeft" |
  "headingBorderLeftWidth" | "h3MarginTop" | "h3MarginBottom" | "h3PaddingVertical" | "h3PaddingHorizontal" |
  "h3BorderLeftWidth" | "h3BorderRadius" | "blockRadius" | "blockPadding" | "quoteFontSize" | "quoteLineHeight" |
  "imageMaxHeight" | "hrHeight">,
  { min: number; max: number }
> = {
  bodyFontSize: { min: 12, max: 24 },
  lineHeight: { min: 1.2, max: 2.2 },
  paragraphMarginTop: { min: 0, max: 30 },
  paragraphSpacing: { min: 4, max: 40 },
  h2Size: { min: 18, max: 40 },
  h3Size: { min: 16, max: 32 },
  headingWeight: { min: 400, max: 900 },
  headingLineHeight: { min: 1.1, max: 2.2 },
  headingMarginTop: { min: 0, max: 80 },
  headingMarginBottom: { min: 0, max: 60 },
  headingPaddingLeft: { min: 0, max: 40 },
  headingBorderLeftWidth: { min: 0, max: 12 },
  h3MarginTop: { min: 0, max: 80 },
  h3MarginBottom: { min: 0, max: 60 },
  h3PaddingVertical: { min: 0, max: 24 },
  h3PaddingHorizontal: { min: 0, max: 40 },
  h3BorderLeftWidth: { min: 0, max: 12 },
  h3BorderRadius: { min: 0, max: 24 },
  blockRadius: { min: 0, max: 24 },
  blockPadding: { min: 4, max: 32 },
  quoteFontSize: { min: 12, max: 24 },
  quoteLineHeight: { min: 1.2, max: 2.4 },
  imageMaxHeight: { min: 100, max: 2000 },
  hrHeight: { min: 1, max: 12 },
};

const colorFields: Array<keyof Pick<StyleConfig,
  "primaryColor" | "secondaryColor" | "textColor" | "quoteBgColor" | "quoteBorderColor" | "headingBorderLeftColor"
>> = ["primaryColor", "secondaryColor", "textColor", "quoteBgColor", "quoteBorderColor", "headingBorderLeftColor"];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeColor(value: string, fallback: string): string {
  const candidate = value.trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(candidate)) {
    return candidate;
  }
  return fallback;
}

export function validateStyleConfig(config: Partial<StyleConfig>): StyleConfig {
  const merged = { ...defaultStyleConfig, ...config } as StyleConfig;

  for (const [key, rule] of Object.entries(numericRules) as Array<[keyof typeof numericRules, { min: number; max: number }]>) {
    merged[key] = clamp(Number(merged[key]) || defaultStyleConfig[key], rule.min, rule.max);
  }

  for (const key of colorFields) {
    merged[key] = normalizeColor(String(merged[key]), defaultStyleConfig[key]);
  }

  const alignValues = new Set<StyleConfig["bodyTextAlign"]>(["left", "center", "right", "justify", "start"]);
  if (!alignValues.has(merged.bodyTextAlign)) {
    merged.bodyTextAlign = defaultStyleConfig.bodyTextAlign;
  }

  const breakValues = new Set<StyleConfig["bodyWordBreak"]>(["normal", "break-all", "break-word"]);
  if (!breakValues.has(merged.bodyWordBreak)) {
    merged.bodyWordBreak = defaultStyleConfig.bodyWordBreak;
  }

  merged.bodyFontFamily = String(merged.bodyFontFamily || defaultStyleConfig.bodyFontFamily).trim();
  if (!merged.bodyFontFamily) {
    merged.bodyFontFamily = defaultStyleConfig.bodyFontFamily;
  }

  merged.imageMargin = String(merged.imageMargin || defaultStyleConfig.imageMargin).trim();
  if (!merged.imageMargin) {
    merged.imageMargin = defaultStyleConfig.imageMargin;
  }

  merged.imageBorder = String(merged.imageBorder || defaultStyleConfig.imageBorder).trim();
  merged.imageBoxShadow = String(merged.imageBoxShadow || defaultStyleConfig.imageBoxShadow).trim();

  return merged;
}
