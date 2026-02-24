import TurndownService from "turndown";

import type { StyleConfig } from "@/types/style";

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
  const h3Size = toNumber(pickProperty("h3", "font-size"));
  const headingWeight = toNumber(pickProperty("h2,h3", "font-weight"));
  const textColor = pickProperty("p,li,blockquote", "color");
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
    primaryColor: primaryColor ?? fallback.primaryColor,
    secondaryColor: secondaryColor ?? fallback.secondaryColor,
    textColor: textColor ?? fallback.textColor,
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
