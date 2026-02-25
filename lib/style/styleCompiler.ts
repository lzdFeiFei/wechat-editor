import type { StyleConfig } from "@/types/style";

function compactStyle(lines: string[]): string {
  return lines.join(" ").replace(/\s+/g, " ").trim();
}

export function paragraphStyle(c: StyleConfig): string {
  return compactStyle([
    `font-size:${c.bodyFontSize}px;`,
    `line-height:${c.lineHeight};`,
    `margin:${c.paragraphMarginTop}px 0 ${c.paragraphSpacing}px 0;`,
    `color:${c.textColor};`,
    `font-family:${c.bodyFontFamily};`,
    `text-align:${c.bodyTextAlign};`,
    `word-break:${c.bodyWordBreak};`,
    "font-weight:400;",
  ]);
}

export function headingStyle(level: 1 | 2 | 3, c: StyleConfig): string {
  if (level === 1) {
    return compactStyle([
      `font-size:${c.h1Size}px;`,
      `line-height:${c.h1LineHeight}em;`,
      `font-weight:${c.h1Weight};`,
      `margin-top:${c.h1MarginTop}px;`,
      `margin-bottom:${c.h1MarginBottom}px;`,
      `padding-left:${c.h1PaddingLeft}px;`,
      `border-left:${c.h1BorderLeftWidth}px solid ${c.h1BorderLeftColor};`,
      `color:${c.primaryColor};`,
      `font-family:${c.bodyFontFamily};`,
      `word-break:${c.bodyWordBreak};`,
    ]);
  }

  const size = level === 2 ? c.h2Size : c.h3Size;
  if (level === 3) {
    return compactStyle([
      `font-size:${size}px;`,
      `line-height:${c.headingLineHeight}em;`,
      `font-weight:${c.headingWeight};`,
      `margin-top:${c.h3MarginTop}px;`,
      `margin-bottom:${c.h3MarginBottom}px;`,
      `padding:${c.h3PaddingVertical}px ${c.h3PaddingHorizontal}px;`,
      `background-color:${c.h3BackgroundColor};`,
      `border-radius:${c.h3BorderRadius}px;`,
      `border-left:${c.h3BorderLeftWidth}px solid ${c.headingBorderLeftColor};`,
      `color:${c.primaryColor};`,
      `font-family:${c.bodyFontFamily};`,
      `word-break:${c.bodyWordBreak};`,
    ]);
  }

  return compactStyle([
    `font-size:${size}px;`,
    `line-height:${c.headingLineHeight}em;`,
    `font-weight:${c.headingWeight};`,
    `margin-top:${c.headingMarginTop}px;`,
    `margin-bottom:${c.headingMarginBottom}px;`,
    `padding-left:${c.headingPaddingLeft}px;`,
    `border-left:${c.headingBorderLeftWidth}px solid ${c.headingBorderLeftColor};`,
    `color:${c.primaryColor};`,
    `font-family:${c.bodyFontFamily};`,
    `word-break:${c.bodyWordBreak};`,
  ]);
}

export function hrStyle(c: StyleConfig): string {
  return compactStyle([
    `margin:${c.hrMargin};`,
    `height:${c.hrHeight}px;`,
    "border:none;",
    `border-top:${c.hrBorderTop};`,
    `background:${c.hrBackground};`,
  ]);
}

export function blockquoteStyle(c: StyleConfig): string {
  return compactStyle([
    "margin:4px 0;",
    `padding:${c.blockPadding}px;`,
    `background:${c.quoteBgColor};`,
    `border-left:4px solid ${c.quoteBorderColor};`,
    `border-radius:${c.blockRadius}px;`,
    `font-size:${c.quoteFontSize}px;`,
    `line-height:${c.quoteLineHeight};`,
    `color:${c.secondaryColor};`,
    `font-family:${c.bodyFontFamily};`,
  ]);
}

export function listStyle(tag: "ul" | "ol", c: StyleConfig): string {
  const type = tag === "ul" ? "disc" : "decimal";
  return compactStyle([
    `margin:0 0 ${c.paragraphSpacing}px 0;`,
    `padding-left:1.35em;`,
    `list-style-type:${type};`,
    "list-style-position:outside;",
    `color:${c.listMarkerColor};`,
    `line-height:${Math.max(c.lineHeight, 1.8)};`,
    `font-family:${c.bodyFontFamily};`,
  ]);
}

export function imageStyle(c: StyleConfig): string {
  return compactStyle([
    "max-width:100%;",
    `max-height:${c.imageMaxHeight}px;`,
    "height:auto;",
    "display:block;",
    `margin:${c.imageMargin};`,
    "border-radius:6px;",
    `border:${c.imageBorder};`,
    `box-shadow:${c.imageBoxShadow};`,
  ]);
}

export function codeStyle(c: StyleConfig): string {
  return compactStyle([
    "font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;",
    "font-size:14px;",
    `line-height:${c.lineHeight};`,
    "color:#111827;",
    "background:#f3f4f6;",
    `padding:${Math.max(6, Math.floor(c.blockPadding * 0.65))}px ${Math.max(8, Math.floor(c.blockPadding * 0.9))}px;`,
    `border-radius:${Math.max(4, c.blockRadius - 2)}px;`,
    "overflow-x:auto;",
    "white-space:pre-wrap;",
  ]);
}
