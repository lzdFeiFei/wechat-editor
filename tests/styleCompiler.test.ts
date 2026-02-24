import { describe, expect, it } from "vitest";

import { defaultStyleConfig } from "@/lib/style/styleConfig";
import {
  blockquoteStyle,
  codeStyle,
  headingStyle,
  imageStyle,
  listStyle,
  paragraphStyle,
} from "@/lib/style/styleCompiler";

describe("styleCompiler", () => {
  it("generates paragraph inline style", () => {
    const style = paragraphStyle(defaultStyleConfig);
    expect(style).toContain("font-size:16px");
    expect(style).toContain("line-height:1.75");
  });

  it("generates heading style for h2 and h3", () => {
    expect(headingStyle(2, defaultStyleConfig)).toContain("font-size:24px");
    expect(headingStyle(3, defaultStyleConfig)).toContain("font-size:20px");
  });

  it("generates block and list styles", () => {
    expect(blockquoteStyle(defaultStyleConfig)).toContain("border-left:4px");
    expect(listStyle("ul", defaultStyleConfig)).toContain("list-style-type:disc");
    expect(listStyle("ol", defaultStyleConfig)).toContain("list-style-type:decimal");
    expect(listStyle("ul", defaultStyleConfig)).toContain("padding-left:1.35em");
  });

  it("generates image and code styles", () => {
    expect(imageStyle(defaultStyleConfig)).toContain("max-width:100%");
    expect(imageStyle(defaultStyleConfig)).toContain("max-height:600px");
    expect(codeStyle(defaultStyleConfig)).toContain("font-family:ui-monospace");
  });
});
