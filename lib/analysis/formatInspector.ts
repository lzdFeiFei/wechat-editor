import TurndownService from "turndown";

import type { StyleConfig } from "@/types/style";
import type { RefineElementType } from "@/types/template";

export interface StyleUsage {
  declaration: string;
  count: number;
}

export interface TagFormatSummary {
  tag: string;
  count: number;
  styleUsage: StyleUsage[];
}

export interface FormatInspectionReport {
  totalElements: number;
  inlineStyleElements: number;
  classElements: number;
  tagSummaries: TagFormatSummary[];
}

export interface ExtractedElementPreset {
  elementType: RefineElementType;
  configPatch: Partial<StyleConfig>;
  sourceStats: {
    matchedNodes: number;
    sampledDecls: number;
  };
}

export interface ExtractElementPresetResult {
  markdown: string;
  normalizedHtml: string;
  presets: ExtractedElementPreset[];
  warnings: string[];
}

function normalizeDeclaration(property: string, value: string): string {
  return `${property.trim().toLowerCase()}: ${value.trim()}`;
}

function parseInlineStyleToEntries(styleText: string): Array<[string, string]> {
  return styleText
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separatorIndex = entry.indexOf(":");
      if (separatorIndex === -1) {
        return null;
      }
      const property = entry.slice(0, separatorIndex).trim().toLowerCase();
      const value = entry.slice(separatorIndex + 1).trim().replace(/\s*!important$/i, "");
      return [property, value] as [string, string];
    })
    .filter((entry): entry is [string, string] => Boolean(entry));
}

function parseInlineStyleToMap(styleText: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const [property, value] of parseInlineStyleToEntries(styleText)) {
    map.set(property, value);
  }
  return map;
}

function parsePaddingVertical(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return toNumber(parts[0]);
  }
  if (parts.length >= 3) {
    return toNumber(parts[0]);
  }
  return undefined;
}

function parsePaddingHorizontal(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return toNumber(parts[0]);
  }
  if (parts.length >= 2) {
    return toNumber(parts[1]);
  }
  return undefined;
}

function assignIfDefined<K extends keyof StyleConfig>(
  target: Partial<StyleConfig>,
  key: K,
  value: StyleConfig[K] | undefined,
): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

function selectMostFrequent(values: string[]): string | undefined {
  if (values.length === 0) {
    return undefined;
  }
  const counter = new Map<string, number>();
  for (const value of values) {
    counter.set(value, (counter.get(value) ?? 0) + 1);
  }
  let bestValue: string | undefined;
  let bestCount = -1;
  for (const [value, count] of counter.entries()) {
    if (count > bestCount) {
      bestCount = count;
      bestValue = value;
    }
  }
  return bestValue;
}

function toNumber(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized.endsWith("em")) {
    const em = Number(normalized.replace("em", "").trim());
    if (Number.isFinite(em)) {
      return em;
    }
  }
  const parsed = Number(normalized.replace("px", "").trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseMarginBottom(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return toNumber(parts[0]);
  }
  if (parts.length >= 3) {
    return toNumber(parts[2]);
  }
  return undefined;
}

function parseMarginTop(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return toNumber(parts[0]);
  }
  return toNumber(parts[0]);
}

function parseBorderLeftColor(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const colorMatch = value.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|[a-zA-Z]+)/g);
  if (!colorMatch || colorMatch.length === 0) {
    return undefined;
  }
  return colorMatch[colorMatch.length - 1];
}

function parseBorderLeftWidth(value?: string): number | undefined {
  if (!value) {
    return undefined;
  }
  const match = value.match(/(\d+(\.\d+)?)px/);
  if (!match) {
    return undefined;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function collectStyleMaps(
  document: Document,
  selector: string,
): { maps: Map<string, string>[]; matchedNodes: number; sampledDecls: number } {
  const nodes = Array.from(document.body.querySelectorAll(selector));
  const maps = nodes
    .map((node) => node.getAttribute("style") ?? "")
    .filter(Boolean)
    .map((styleText) => parseInlineStyleToMap(styleText));

  return {
    maps,
    matchedNodes: nodes.length,
    sampledDecls: maps.reduce((sum, map) => sum + map.size, 0),
  };
}

function pickMostFrequentFromMaps(maps: Map<string, string>[], property: string): string | undefined {
  const values = maps.map((map) => map.get(property)).filter((value): value is string => Boolean(value));
  return selectMostFrequent(values);
}

function createElementPatch(
  elementType: RefineElementType,
  document: Document,
): { configPatch: Partial<StyleConfig>; sourceStats: { matchedNodes: number; sampledDecls: number } } {
  const tagMaps = collectStyleMaps(document, elementType);
  const bySelector = (selector: string, property: string): string | undefined =>
    pickMostFrequentFromMaps(collectStyleMaps(document, selector).maps, property);

  const patch: Partial<StyleConfig> = {};

  if (elementType === "h1") {
    assignIfDefined(patch, "h1Size", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "font-size")));
    assignIfDefined(patch, "h1Weight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "font-weight")));
    assignIfDefined(patch, "h1LineHeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "line-height")));
    assignIfDefined(
      patch,
      "h1MarginTop",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-top")) ??
        parseMarginTop(pickMostFrequentFromMaps(tagMaps.maps, "margin")),
    );
    assignIfDefined(
      patch,
      "h1MarginBottom",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-bottom")) ??
        parseMarginBottom(pickMostFrequentFromMaps(tagMaps.maps, "margin")),
    );
    assignIfDefined(patch, "h1PaddingLeft", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "padding-left")));
    assignIfDefined(
      patch,
      "h1BorderLeftWidth",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "border-left-width")) ??
        parseBorderLeftWidth(pickMostFrequentFromMaps(tagMaps.maps, "border-left")),
    );
    assignIfDefined(
      patch,
      "h1BorderLeftColor",
      pickMostFrequentFromMaps(tagMaps.maps, "border-left-color") ??
        parseBorderLeftColor(pickMostFrequentFromMaps(tagMaps.maps, "border-left")),
    );
    assignIfDefined(patch, "h1Color", pickMostFrequentFromMaps(tagMaps.maps, "color"));
  }

  if (elementType === "h2") {
    assignIfDefined(patch, "h2Size", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "font-size")));
    assignIfDefined(patch, "headingWeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "font-weight")));
    assignIfDefined(patch, "headingLineHeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "line-height")));
    assignIfDefined(
      patch,
      "headingMarginTop",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-top")) ??
        parseMarginTop(pickMostFrequentFromMaps(tagMaps.maps, "margin")),
    );
    assignIfDefined(
      patch,
      "headingMarginBottom",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-bottom")) ??
        parseMarginBottom(pickMostFrequentFromMaps(tagMaps.maps, "margin")),
    );
    assignIfDefined(patch, "headingPaddingLeft", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "padding-left")));
    assignIfDefined(
      patch,
      "headingBorderLeftWidth",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "border-left-width")) ??
        parseBorderLeftWidth(pickMostFrequentFromMaps(tagMaps.maps, "border-left")),
    );
    assignIfDefined(
      patch,
      "headingBorderLeftColor",
      pickMostFrequentFromMaps(tagMaps.maps, "border-left-color") ??
        parseBorderLeftColor(pickMostFrequentFromMaps(tagMaps.maps, "border-left")),
    );
    assignIfDefined(
      patch,
      "h2Color",
      pickMostFrequentFromMaps(tagMaps.maps, "color") ??
        pickMostFrequentFromMaps(tagMaps.maps, "border-left-color") ??
        parseBorderLeftColor(pickMostFrequentFromMaps(tagMaps.maps, "border-left")),
    );
  }

  if (elementType === "h3") {
    assignIfDefined(patch, "h3Size", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "font-size")));
    assignIfDefined(patch, "headingWeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "font-weight")));
    assignIfDefined(patch, "headingLineHeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "line-height")));
    assignIfDefined(
      patch,
      "h3MarginTop",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-top")) ??
        parseMarginTop(pickMostFrequentFromMaps(tagMaps.maps, "margin")),
    );
    assignIfDefined(
      patch,
      "h3MarginBottom",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-bottom")) ??
        parseMarginBottom(pickMostFrequentFromMaps(tagMaps.maps, "margin")),
    );
    assignIfDefined(
      patch,
      "h3PaddingVertical",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "padding-top")) ??
        parsePaddingVertical(pickMostFrequentFromMaps(tagMaps.maps, "padding")),
    );
    assignIfDefined(
      patch,
      "h3PaddingHorizontal",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "padding-left")) ??
        parsePaddingHorizontal(pickMostFrequentFromMaps(tagMaps.maps, "padding")),
    );
    assignIfDefined(
      patch,
      "h3BorderLeftWidth",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "border-left-width")) ??
        parseBorderLeftWidth(pickMostFrequentFromMaps(tagMaps.maps, "border-left")),
    );
    assignIfDefined(patch, "h3BorderRadius", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "border-radius")));
    assignIfDefined(
      patch,
      "h3BackgroundColor",
      pickMostFrequentFromMaps(tagMaps.maps, "background-color") ?? pickMostFrequentFromMaps(tagMaps.maps, "background"),
    );
    assignIfDefined(
      patch,
      "h3Color",
      pickMostFrequentFromMaps(tagMaps.maps, "color") ??
        pickMostFrequentFromMaps(tagMaps.maps, "border-left-color") ??
        parseBorderLeftColor(pickMostFrequentFromMaps(tagMaps.maps, "border-left")),
    );
  }

  if (elementType === "p") {
    const textAlign = pickMostFrequentFromMaps(tagMaps.maps, "text-align");
    const wordBreak = pickMostFrequentFromMaps(tagMaps.maps, "word-break");
    assignIfDefined(patch, "bodyFontSize", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "font-size")));
    assignIfDefined(patch, "lineHeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "line-height")));
    assignIfDefined(patch, "paragraphMarginTop", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-top")));
    assignIfDefined(
      patch,
      "paragraphSpacing",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-bottom")) ??
        parseMarginBottom(pickMostFrequentFromMaps(tagMaps.maps, "margin")),
    );
    assignIfDefined(patch, "bodyFontFamily", pickMostFrequentFromMaps(tagMaps.maps, "font-family"));
    assignIfDefined(
      patch,
      "bodyTextAlign",
      textAlign === "left" ||
        textAlign === "center" ||
        textAlign === "right" ||
        textAlign === "justify" ||
        textAlign === "start"
        ? textAlign
        : undefined,
    );
    assignIfDefined(
      patch,
      "bodyWordBreak",
      wordBreak === "normal" || wordBreak === "break-all" || wordBreak === "break-word" ? wordBreak : undefined,
    );
    assignIfDefined(patch, "pTextColor", pickMostFrequentFromMaps(tagMaps.maps, "color"));
  }

  if (elementType === "li") {
    assignIfDefined(patch, "lineHeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "line-height")));
    assignIfDefined(patch, "bodyFontFamily", pickMostFrequentFromMaps(tagMaps.maps, "font-family"));
    assignIfDefined(patch, "liTextColor", pickMostFrequentFromMaps(tagMaps.maps, "color"));
    assignIfDefined(patch, "listMarkerColor", bySelector("ul,ol", "color"));
    assignIfDefined(
      patch,
      "paragraphSpacing",
      toNumber(pickMostFrequentFromMaps(tagMaps.maps, "margin-bottom")) ??
        parseMarginBottom(pickMostFrequentFromMaps(tagMaps.maps, "margin")),
    );
  }

  if (elementType === "blockquote") {
    assignIfDefined(patch, "quoteFontSize", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "font-size")));
    assignIfDefined(patch, "quoteLineHeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "line-height")));
    assignIfDefined(
      patch,
      "quoteBgColor",
      pickMostFrequentFromMaps(tagMaps.maps, "background-color") ?? pickMostFrequentFromMaps(tagMaps.maps, "background"),
    );
    assignIfDefined(
      patch,
      "quoteBorderColor",
      pickMostFrequentFromMaps(tagMaps.maps, "border-left-color") ??
        parseBorderLeftColor(pickMostFrequentFromMaps(tagMaps.maps, "border-left")),
    );
    assignIfDefined(patch, "secondaryColor", pickMostFrequentFromMaps(tagMaps.maps, "color"));
    assignIfDefined(patch, "blockPadding", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "padding")));
    assignIfDefined(patch, "blockRadius", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "border-radius")));
  }

  if (elementType === "img") {
    assignIfDefined(patch, "imageMargin", pickMostFrequentFromMaps(tagMaps.maps, "margin"));
    assignIfDefined(patch, "imageMaxHeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "max-height")));
    assignIfDefined(patch, "imageBorder", pickMostFrequentFromMaps(tagMaps.maps, "border"));
    assignIfDefined(patch, "imageBoxShadow", pickMostFrequentFromMaps(tagMaps.maps, "box-shadow"));
  }

  if (elementType === "hr") {
    assignIfDefined(patch, "hrMargin", pickMostFrequentFromMaps(tagMaps.maps, "margin"));
    assignIfDefined(patch, "hrHeight", toNumber(pickMostFrequentFromMaps(tagMaps.maps, "height")));
    assignIfDefined(
      patch,
      "hrBackground",
      pickMostFrequentFromMaps(tagMaps.maps, "background") ?? pickMostFrequentFromMaps(tagMaps.maps, "background-color"),
    );
    assignIfDefined(patch, "hrBorderTop", pickMostFrequentFromMaps(tagMaps.maps, "border-top"));
  }

  return {
    configPatch: patch,
    sourceStats: {
      matchedNodes: tagMaps.matchedNodes,
      sampledDecls: tagMaps.sampledDecls,
    },
  };
}

export function inspectHtmlFormat(html: string): FormatInspectionReport {
  const parser = new DOMParser();
  const document = parser.parseFromString(normalizeImportedHtml(html), "text/html");
  const elements = Array.from(document.body.querySelectorAll("*"));

  const tagCounters = new Map<string, number>();
  const styleCountersByTag = new Map<string, Map<string, number>>();

  let inlineStyleElements = 0;
  let classElements = 0;

  for (const element of elements) {
    const tag = element.tagName.toLowerCase();
    tagCounters.set(tag, (tagCounters.get(tag) ?? 0) + 1);

    if (element.getAttribute("class")) {
      classElements += 1;
    }

    const inlineStyle = element.getAttribute("style");
    if (!inlineStyle) {
      continue;
    }

    inlineStyleElements += 1;
    const declarations = parseInlineStyleToEntries(inlineStyle).map(([prop, val]) =>
      normalizeDeclaration(prop, val),
    );

    if (!styleCountersByTag.has(tag)) {
      styleCountersByTag.set(tag, new Map<string, number>());
    }
    const styleCounter = styleCountersByTag.get(tag);
    if (!styleCounter) {
      continue;
    }
    for (const declaration of declarations) {
      styleCounter.set(declaration, (styleCounter.get(declaration) ?? 0) + 1);
    }
  }

  const tagSummaries: TagFormatSummary[] = Array.from(tagCounters.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({
      tag,
      count,
      styleUsage: Array.from((styleCountersByTag.get(tag) ?? new Map<string, number>()).entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([declaration, declarationCount]) => ({ declaration, count: declarationCount })),
    }));

  return {
    totalElements: elements.length,
    inlineStyleElements,
    classElements,
    tagSummaries,
  };
}

export function htmlToMarkdown(html: string): string {
  const normalizedHtml = normalizeImportedHtml(html);
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });
  turndown.addRule("stripSpanAndLeafWrappers", {
    filter: (node) =>
      node.nodeName === "SPAN" ||
      ((node.nodeName === "SECTION" || node.nodeName === "DIV") &&
        typeof (node as Element).getAttribute === "function" &&
        (node as Element).getAttribute("leaf") !== null),
    replacement: (content) => content,
  });
  return turndown.turndown(normalizedHtml).trim();
}

export function normalizeImportedHtml(html: string): string {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  document.body
    .querySelectorAll(
      ".ProseMirror-separator, .ProseMirror-trailingBreak, br.ProseMirror-trailingBreak, img.ProseMirror-separator",
    )
    .forEach((node) => node.remove());

  const unwrapSelectors = ["span[leaf]", "section[nodeleaf]", ".ProseMirror", ".rich_media_content"];
  unwrapSelectors.forEach((selector) => {
    document.body.querySelectorAll(selector).forEach((node) => {
      const parent = node.parentNode;
      if (!parent) {
        return;
      }
      while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
      }
      parent.removeChild(node);
    });
  });

  document.body.querySelectorAll("*").forEach((node) => {
    node.removeAttribute("contenteditable");
    node.removeAttribute("spellcheck");
    node.removeAttribute("translate");
    node.removeAttribute("lang");
    Array.from(node.attributes)
      .filter((attr) => attr.name.startsWith("data-"))
      .forEach((attr) => node.removeAttribute(attr.name));
  });

  return document.body.innerHTML;
}

export function inferStyleConfigFromHtml(
  html: string,
  fallback: StyleConfig,
): Partial<StyleConfig> {
  const parser = new DOMParser();
  const document = parser.parseFromString(normalizeImportedHtml(html), "text/html");

  const pickProperty = (selector: string, property: string): string | undefined => {
    const values = Array.from(document.body.querySelectorAll(selector))
      .map((el) => el.getAttribute("style") ?? "")
      .map((style) => parseInlineStyleToMap(style).get(property))
      .filter((v): v is string => Boolean(v));
    return selectMostFrequent(values);
  };

  const paragraphSize = toNumber(pickProperty("p", "font-size"));
  const lineHeight = Number(pickProperty("p", "line-height") ?? "");
  const paragraphSpacing =
    toNumber(pickProperty("p", "margin-bottom")) ?? parseMarginBottom(pickProperty("p", "margin"));
  const h2Size = toNumber(pickProperty("h2", "font-size"));
  const h1Size = toNumber(pickProperty("h1", "font-size"));
  const h1Weight = toNumber(pickProperty("h1", "font-weight"));
  const h1LineHeight = toNumber(pickProperty("h1", "line-height"));
  const h1MarginTop = toNumber(pickProperty("h1", "margin-top")) ?? parseMarginTop(pickProperty("h1", "margin"));
  const h1MarginBottom =
    toNumber(pickProperty("h1", "margin-bottom")) ?? parseMarginBottom(pickProperty("h1", "margin"));
  const h1PaddingLeft = toNumber(pickProperty("h1", "padding-left"));
  const h1BorderLeftWidth =
    toNumber(pickProperty("h1", "border-left-width")) ?? parseBorderLeftWidth(pickProperty("h1", "border-left"));
  const h1BorderLeftColor = pickProperty("h1", "border-left-color") ?? parseBorderLeftColor(pickProperty("h1", "border-left"));
  const h3Size = toNumber(pickProperty("h3", "font-size"));
  const headingWeight = toNumber(pickProperty("h2,h3", "font-weight"));
  const h1Color = pickProperty("h1", "color");
  const h2Color = pickProperty("h2", "color");
  const h3Color = pickProperty("h3", "color");
  const pTextColor = pickProperty("p", "color");
  const liTextColor = pickProperty("li", "color");
  const primaryColor =
    pickProperty("h2", "color") ??
    pickProperty("h3", "color") ??
    pickProperty("h2", "border-left-color") ??
    parseBorderLeftColor(pickProperty("h2", "border-left")) ??
    pickProperty("h3", "border-left-color") ??
    parseBorderLeftColor(pickProperty("h3", "border-left")) ??
    pickProperty("a", "color");
  const quoteBgColor = pickProperty("blockquote", "background") ?? pickProperty("blockquote", "background-color");
  const quoteBorderColor =
    pickProperty("blockquote", "border-left-color") ??
    parseBorderLeftColor(pickProperty("blockquote", "border-left"));
  const blockPadding = toNumber(pickProperty("blockquote", "padding"));
  const blockRadius = toNumber(pickProperty("blockquote", "border-radius"));
  const secondaryColor = pickProperty("blockquote", "color");
  const bodyFontFamily = pickProperty("p,li", "font-family");
  const bodyTextAlign = pickProperty("p", "text-align");
  const bodyWordBreak = pickProperty("p,h2,h3", "word-break");
  const headingLineHeight = toNumber(pickProperty("h2,h3", "line-height"));
  const headingMarginTop =
    toNumber(pickProperty("h2,h3", "margin-top")) ?? parseMarginTop(pickProperty("h2,h3", "margin"));
  const headingMarginBottom =
    toNumber(pickProperty("h2,h3", "margin-bottom")) ?? parseMarginBottom(pickProperty("h2,h3", "margin"));
  const headingPaddingLeft = toNumber(pickProperty("h2,h3", "padding-left"));
  const headingBorderLeftWidth =
    toNumber(pickProperty("h2,h3", "border-left-width")) ?? parseBorderLeftWidth(pickProperty("h2,h3", "border-left"));
  const headingBorderLeftColor =
    pickProperty("h2,h3", "border-left-color") ?? parseBorderLeftColor(pickProperty("h2,h3", "border-left"));
  const quoteFontSize = toNumber(pickProperty("blockquote", "font-size"));
  const quoteLineHeight = toNumber(pickProperty("blockquote", "line-height"));
  const imageMargin = pickProperty("img", "margin");
  const imageMaxHeight = toNumber(pickProperty("img", "max-height"));
  const imageBorder = pickProperty("img", "border");
  const imageBoxShadow = pickProperty("img", "box-shadow");
  const paragraphMarginTop = toNumber(pickProperty("p", "margin-top"));
  const h3MarginTop =
    toNumber(pickProperty("h3", "margin-top")) ?? parseMarginTop(pickProperty("h3", "margin"));
  const h3MarginBottom =
    toNumber(pickProperty("h3", "margin-bottom")) ?? parseMarginBottom(pickProperty("h3", "margin"));
  const h3PaddingVertical = toNumber(pickProperty("h3", "padding-top")) ?? toNumber(pickProperty("h3", "padding"));
  const h3PaddingHorizontal = toNumber(pickProperty("h3", "padding-left")) ?? toNumber(pickProperty("h3", "padding"));
  const h3BorderLeftWidth =
    toNumber(pickProperty("h3", "border-left-width")) ?? parseBorderLeftWidth(pickProperty("h3", "border-left"));
  const h3BorderRadius = toNumber(pickProperty("h3", "border-radius"));
  const h3BackgroundColor = pickProperty("h3", "background-color") ?? pickProperty("h3", "background");
  const hrMargin = pickProperty("hr", "margin");
  const hrHeight = toNumber(pickProperty("hr", "height"));
  const hrBackground = pickProperty("hr", "background");
  const hrBorderTop = pickProperty("hr", "border-top");
  const listMarkerColor = pickProperty("ul,ol", "color");

  return {
    bodyFontSize: paragraphSize ?? fallback.bodyFontSize,
    lineHeight: Number.isFinite(lineHeight) ? lineHeight : fallback.lineHeight,
    paragraphMarginTop: paragraphMarginTop ?? fallback.paragraphMarginTop,
    paragraphSpacing: paragraphSpacing ?? fallback.paragraphSpacing,
    bodyFontFamily: bodyFontFamily ?? fallback.bodyFontFamily,
    bodyTextAlign:
      bodyTextAlign === "left" || bodyTextAlign === "center" || bodyTextAlign === "right" || bodyTextAlign === "justify" || bodyTextAlign === "start"
        ? bodyTextAlign
        : fallback.bodyTextAlign,
    bodyWordBreak:
      bodyWordBreak === "normal" || bodyWordBreak === "break-all" || bodyWordBreak === "break-word"
        ? bodyWordBreak
        : fallback.bodyWordBreak,
    h1Size: h1Size ?? fallback.h1Size,
    h1Weight: h1Weight ?? fallback.h1Weight,
    h1LineHeight: h1LineHeight ?? fallback.h1LineHeight,
    h1MarginTop: h1MarginTop ?? fallback.h1MarginTop,
    h1MarginBottom: h1MarginBottom ?? fallback.h1MarginBottom,
    h1PaddingLeft: h1PaddingLeft ?? fallback.h1PaddingLeft,
    h1BorderLeftWidth: h1BorderLeftWidth ?? fallback.h1BorderLeftWidth,
    h1BorderLeftColor: h1BorderLeftColor ?? fallback.h1BorderLeftColor,
    h2Size: h2Size ?? fallback.h2Size,
    h3Size: h3Size ?? fallback.h3Size,
    headingWeight: headingWeight ?? fallback.headingWeight,
    headingLineHeight: headingLineHeight ?? fallback.headingLineHeight,
    headingMarginTop: headingMarginTop ?? fallback.headingMarginTop,
    headingMarginBottom: headingMarginBottom ?? fallback.headingMarginBottom,
    headingPaddingLeft: headingPaddingLeft ?? fallback.headingPaddingLeft,
    headingBorderLeftWidth: headingBorderLeftWidth ?? fallback.headingBorderLeftWidth,
    headingBorderLeftColor: headingBorderLeftColor ?? fallback.headingBorderLeftColor,
    h3MarginTop: h3MarginTop ?? fallback.h3MarginTop,
    h3MarginBottom: h3MarginBottom ?? fallback.h3MarginBottom,
    h3PaddingVertical: h3PaddingVertical ?? fallback.h3PaddingVertical,
    h3PaddingHorizontal: h3PaddingHorizontal ?? fallback.h3PaddingHorizontal,
    h3BorderLeftWidth: h3BorderLeftWidth ?? fallback.h3BorderLeftWidth,
    h3BorderRadius: h3BorderRadius ?? fallback.h3BorderRadius,
    h3BackgroundColor: h3BackgroundColor ?? fallback.h3BackgroundColor,
    h1Color: h1Color ?? fallback.h1Color,
    h2Color: h2Color ?? fallback.h2Color,
    h3Color: h3Color ?? fallback.h3Color,
    primaryColor: primaryColor ?? fallback.primaryColor,
    secondaryColor: secondaryColor ?? fallback.secondaryColor,
    pTextColor: pTextColor ?? fallback.pTextColor,
    liTextColor: liTextColor ?? fallback.liTextColor,
    textColor: pTextColor ?? liTextColor ?? fallback.textColor,
    listMarkerColor: listMarkerColor ?? fallback.listMarkerColor,
    blockRadius: blockRadius ?? fallback.blockRadius,
    blockPadding: blockPadding ?? fallback.blockPadding,
    quoteFontSize: quoteFontSize ?? fallback.quoteFontSize,
    quoteLineHeight: quoteLineHeight ?? fallback.quoteLineHeight,
    quoteBgColor: quoteBgColor ?? fallback.quoteBgColor,
    quoteBorderColor: quoteBorderColor ?? fallback.quoteBorderColor,
    imageMargin: imageMargin ?? fallback.imageMargin,
    imageMaxHeight: imageMaxHeight ?? fallback.imageMaxHeight,
    imageBorder: imageBorder ?? fallback.imageBorder,
    imageBoxShadow: imageBoxShadow ?? fallback.imageBoxShadow,
    hrMargin: hrMargin ?? fallback.hrMargin,
    hrHeight: hrHeight ?? fallback.hrHeight,
    hrBackground: hrBackground ?? fallback.hrBackground,
    hrBorderTop: hrBorderTop ?? fallback.hrBorderTop,
  };
}

export function extractElementPresetsFromHtml(
  html: string,
  _fallback: StyleConfig,
): ExtractElementPresetResult {
  void _fallback;
  const normalizedHtml = normalizeImportedHtml(html);
  const parser = new DOMParser();
  const document = parser.parseFromString(normalizedHtml, "text/html");

  const markdown = htmlToMarkdown(normalizedHtml);
  const warnings: string[] = [];
  const elementTypes: RefineElementType[] = ["h1", "h2", "h3", "p", "li", "blockquote", "img", "hr"];
  const presets: ExtractedElementPreset[] = [];

  for (const elementType of elementTypes) {
    const { configPatch, sourceStats } = createElementPatch(elementType, document);
    if (sourceStats.matchedNodes === 0) {
      continue;
    }
    if (Object.keys(configPatch).length === 0) {
      warnings.push(`${elementType}: 检测到元素，但未提取到可用样式字段，已跳过导入。`);
      continue;
    }
    presets.push({
      elementType,
      configPatch,
      sourceStats,
    });
  }

  if (presets.length === 0) {
    warnings.push("未提取到可导入的元素样式，请检查 HTML 是否包含 inline style。");
  }

  return {
    markdown,
    normalizedHtml,
    presets,
    warnings,
  };
}
