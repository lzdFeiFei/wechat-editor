import type { StyleConfig } from "@/types/style";
import type { RefineByTypePatch, RefineElementType } from "@/types/template";

export const editableFieldsByType: Record<RefineElementType, Array<keyof StyleConfig>> = {
  h1: [
    "h1Size",
    "h1Weight",
    "h1LineHeight",
    "h1MarginTop",
    "h1MarginBottom",
    "h1PaddingLeft",
    "h1BorderLeftWidth",
    "h1BorderLeftColor",
    "h1Color",
  ],
  h2: [
    "h2Size",
    "headingWeight",
    "headingLineHeight",
    "headingMarginTop",
    "headingMarginBottom",
    "headingPaddingLeft",
    "headingBorderLeftWidth",
    "headingBorderLeftColor",
    "h2Color",
  ],
  h3: [
    "h3Size",
    "headingWeight",
    "headingLineHeight",
    "h3MarginTop",
    "h3MarginBottom",
    "h3PaddingVertical",
    "h3PaddingHorizontal",
    "h3BorderLeftWidth",
    "h3BorderRadius",
    "h3BackgroundColor",
    "h3Color",
  ],
  p: [
    "bodyFontSize",
    "lineHeight",
    "paragraphMarginTop",
    "paragraphSpacing",
    "pTextColor",
    "bodyTextAlign",
    "bodyWordBreak",
    "bodyFontFamily",
  ],
  li: [
    "bodyFontSize",
    "lineHeight",
    "paragraphSpacing",
    "liTextColor",
    "listMarkerColor",
    "bodyFontFamily",
  ],
  blockquote: [
    "quoteFontSize",
    "quoteLineHeight",
    "quoteBgColor",
    "quoteBorderColor",
    "secondaryColor",
    "blockPadding",
    "blockRadius",
    "bodyFontFamily",
  ],
  img: ["imageMargin", "imageMaxHeight", "imageBorder", "imageBoxShadow"],
  hr: ["hrMargin", "hrHeight", "hrBackground", "hrBorderTop"],
};

export function getRefinedConfigByType(
  globalConfig: StyleConfig,
  refineByType: RefineByTypePatch | undefined,
  type: RefineElementType,
): StyleConfig {
  const patch = refineByType?.[type];
  if (!patch) {
    return globalConfig;
  }
  return { ...globalConfig, ...patch };
}
