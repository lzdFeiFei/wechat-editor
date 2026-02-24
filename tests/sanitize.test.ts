import { describe, expect, it } from "vitest";

import { renderMarkdown } from "@/lib/markdown/pipeline";
import { defaultStyleConfig } from "@/lib/style/styleConfig";

describe("sanitize and safe mode", () => {
  it("degrades table in safe mode", () => {
    const markdown = "| a | b |\n| - | - |\n| 1 | 2 |";
    const html = renderMarkdown(markdown, defaultStyleConfig, "safe");

    expect(html).toContain("removed table in safe mode");
    expect(html).not.toContain("<table");
  });

  it("removes javascript protocol links", () => {
    const markdown = "[x](javascript:alert('xss'))";
    const html = renderMarkdown(markdown, defaultStyleConfig, "standard");
    expect(html).not.toContain("javascript:");
  });
});
