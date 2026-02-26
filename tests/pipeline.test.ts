import { describe, expect, it } from "vitest";

import { renderMarkdown } from "@/lib/markdown/pipeline";
import { defaultStyleConfig } from "@/lib/style/styleConfig";

describe("renderMarkdown", () => {
  it("injects inline style and strips class attributes", () => {
    const markdown = "# H1\n\n## Title\n\nParagraph with [link](https://example.com).";
    const html = renderMarkdown(markdown, defaultStyleConfig, "standard");

    expect(html).toContain("<h1 style=");
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

  it("applies emphasis color to strong text", () => {
    const markdown = "这是 **注意力才是最稀缺的资源**。";
    const html = renderMarkdown(markdown, defaultStyleConfig, "standard");
    expect(html).toContain(`<strong style="color:${defaultStyleConfig.primaryColor}; font-weight:600;">`);
  });

  it("applies refine patches by element type", () => {
    const markdown = "## Title\n\nParagraph";
    const html = renderMarkdown(markdown, defaultStyleConfig, "standard", {
      refineByType: {
        h2: { h2Color: "#ff0000", h2Size: 32 },
        p: { pTextColor: "#008800", bodyFontSize: 18 },
      },
    });

    expect(html).toContain("font-size:32px");
    expect(html).toContain("color:#ff0000");
    expect(html).toContain("font-size:18px");
    expect(html).toContain("color:#008800");
  });
});
