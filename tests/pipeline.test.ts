import { describe, expect, it } from "vitest";

import { renderMarkdown } from "@/lib/markdown/pipeline";
import { defaultStyleConfig } from "@/lib/style/styleConfig";

describe("renderMarkdown", () => {
  it("injects inline style and strips class attributes", () => {
    const markdown = "## Title\n\nParagraph with [link](https://example.com).";
    const html = renderMarkdown(markdown, defaultStyleConfig, "standard");

    expect(html).toContain("<h2 style=");
    expect(html).toContain("<p style=");
    expect(html).toContain("<a href=\"https://example.com\" style=");
    expect(html).not.toContain("class=");
  });

  it("keeps image responsive style", () => {
    const markdown = "![img](https://example.com/a.png)";
    const html = renderMarkdown(markdown, defaultStyleConfig, "standard");
    expect(html).toContain("max-width:100%");
  });
});
