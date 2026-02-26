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
import { getRefinedConfigByType } from "@/lib/style/refineByType";
import type { RefineByTypePatch } from "@/types/template";

export type RenderMode = "standard" | "safe";

function assignStyle(node: Element, style: string): void {
  node.properties = node.properties ?? {};
  const currentStyle = typeof node.properties.style === "string" ? `${node.properties.style}; ` : "";
  node.properties.style = `${currentStyle}${style}`.trim();
  delete node.properties.className;
  delete node.properties.class;
}

interface RenderOptions {
  refineByType?: RefineByTypePatch;
}

function inlineStylePlugin(config: StyleConfig, options?: RenderOptions) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      switch (node.tagName) {
        case "h1":
          assignStyle(node, headingStyle(1, getRefinedConfigByType(config, options?.refineByType, "h1")));
          break;
        case "p":
          assignStyle(node, paragraphStyle(getRefinedConfigByType(config, options?.refineByType, "p")));
          break;
        case "h2":
          assignStyle(node, headingStyle(2, getRefinedConfigByType(config, options?.refineByType, "h2")));
          break;
        case "h3":
          assignStyle(node, headingStyle(3, getRefinedConfigByType(config, options?.refineByType, "h3")));
          break;
        case "blockquote":
          assignStyle(node, blockquoteStyle(getRefinedConfigByType(config, options?.refineByType, "blockquote")));
          break;
        case "ul":
          assignStyle(node, listStyle("ul", getRefinedConfigByType(config, options?.refineByType, "li")));
          break;
        case "ol":
          assignStyle(node, listStyle("ol", getRefinedConfigByType(config, options?.refineByType, "li")));
          break;
        case "li":
          {
            const refinedConfig = getRefinedConfigByType(config, options?.refineByType, "li");
          assignStyle(
            node,
            `display:list-item; margin:8px 0; line-height:${Math.max(refinedConfig.lineHeight, 1.8)}; color:${refinedConfig.liTextColor}; font-family:${refinedConfig.bodyFontFamily};`,
          );
          break;
          }
        case "img":
          assignStyle(node, imageStyle(getRefinedConfigByType(config, options?.refineByType, "img")));
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
          assignStyle(node, hrStyle(getRefinedConfigByType(config, options?.refineByType, "hr")));
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

export function renderMarkdown(
  md: string,
  config: StyleConfig,
  mode: RenderMode = "standard",
  options?: RenderOptions,
): string {
  let processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(inlineStylePlugin, config, options);

  if (mode === "safe") {
    processor = processor.use(safeModePlugin);
  }

  return processor
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .processSync(md)
    .toString();
}
