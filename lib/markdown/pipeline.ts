import type { Element, Root } from "hast";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

import type { StyleConfig } from "@/types/style";
import { sanitizeSchema, degradeForSafeMode } from "@/lib/markdown/sanitize";
import {
  blockquoteStyle,
  codeStyle,
  headingStyle,
  hrStyle,
  imageStyle,
  listStyle,
  paragraphStyle,
} from "@/lib/style/styleCompiler";

export type RenderMode = "standard" | "safe";

function assignStyle(node: Element, style: string): void {
  node.properties = node.properties ?? {};
  const currentStyle = typeof node.properties.style === "string" ? `${node.properties.style}; ` : "";
  node.properties.style = `${currentStyle}${style}`.trim();
  delete node.properties.className;
  delete node.properties.class;
}

function inlineStylePlugin(config: StyleConfig) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      switch (node.tagName) {
        case "p":
          assignStyle(node, paragraphStyle(config));
          break;
        case "h2":
          assignStyle(node, headingStyle(2, config));
          break;
        case "h3":
          assignStyle(node, headingStyle(3, config));
          break;
        case "blockquote":
          assignStyle(node, blockquoteStyle(config));
          break;
        case "ul":
          assignStyle(node, listStyle("ul", config));
          break;
        case "ol":
          assignStyle(node, listStyle("ol", config));
          break;
        case "li":
          assignStyle(
            node,
            `display:list-item; margin:8px 0; line-height:${Math.max(config.lineHeight, 1.8)}; color:${config.textColor}; font-family:${config.bodyFontFamily};`,
          );
          break;
        case "img":
          assignStyle(node, imageStyle(config));
          break;
        case "pre":
          assignStyle(node, codeStyle(config));
          break;
        case "code":
          assignStyle(node, "font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;");
          break;
        case "strong":
          assignStyle(node, `color:${config.primaryColor}; font-weight:600;`);
          break;
        case "a":
          assignStyle(node, `color:${config.primaryColor}; text-decoration:underline; word-break:break-all;`);
          break;
        case "hr":
          assignStyle(node, hrStyle(config));
          break;
        default:
          break;
      }
    });
  };
}

function safeModePlugin() {
  return (tree: Root) => {
    degradeForSafeMode(tree);
  };
}

export function renderMarkdown(md: string, config: StyleConfig, mode: RenderMode = "standard"): string {
  let processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(inlineStylePlugin, config);

  if (mode === "safe") {
    processor = processor.use(safeModePlugin);
  }

  return processor
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .processSync(md)
    .toString();
}
