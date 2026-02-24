import type { Root, Element, Parent, Text } from "hast";
import type { Schema } from "hast-util-sanitize";
import { defaultSchema } from "rehype-sanitize";
import { visit } from "unist-util-visit";

const allowedTagNames = [
  "p",
  "h2",
  "h3",
  "strong",
  "em",
  "span",
  "ul",
  "ol",
  "li",
  "blockquote",
  "hr",
  "pre",
  "code",
  "img",
  "a",
] as const;

export const sanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: [...allowedTagNames],
  strip: ["script", "style"],
  attributes: {
    ...defaultSchema.attributes,
    "*": ["style"],
    a: ["href", "title", "target", "rel", "style"],
    img: ["src", "alt", "title", "style"],
    code: ["style"],
    pre: ["style"],
    p: ["style"],
    h2: ["style"],
    h3: ["style"],
    ul: ["style"],
    ol: ["style"],
    li: ["style"],
    blockquote: ["style"],
    hr: ["style"],
    span: ["style"],
    strong: ["style"],
    em: ["style"],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ["http", "https", "mailto", "tel"],
    src: ["http", "https", "data"],
  },
};

function textNode(value: string): Text {
  return { type: "text", value };
}

function paragraphNode(value: string): Element {
  return {
    type: "element",
    tagName: "p",
    properties: {},
    children: [textNode(value)],
  };
}

function replaceChild(parent: Parent, index: number, node: Element): void {
  parent.children.splice(index, 1, node);
}

export function degradeForSafeMode(tree: Root): void {
  const dropTags = new Set(["table", "thead", "tbody", "tfoot", "tr", "th", "td", "iframe", "video", "audio"]);

  visit(tree, "element", (node, index, parent) => {
    if (typeof index !== "number" || !parent) {
      return;
    }

    if (node.tagName === "img") {
      const src = String(node.properties?.src ?? "").trim();
      if (!src) {
        replaceChild(parent, index, paragraphNode("[image removed: empty src]"));
      }
      return;
    }

    if (dropTags.has(node.tagName)) {
      const fallbackText = `[removed ${node.tagName} in safe mode]`;
      replaceChild(parent, index, paragraphNode(fallbackText));
    }
  });
}
