import { describe, expect, it } from "vitest";

import {
  htmlToMarkdown,
  normalizeImportedHtml,
} from "@/lib/analysis/formatInspector";

describe("formatInspector", () => {
  it("normalizes editor wrappers and removes leaf spans", () => {
    const html = `
      <div class="rich_media_content">
        <div class="ProseMirror">
          <section nodeleaf="">
            <h2><span leaf="">Title</span></h2>
            <p style="color:#2c2c2c !important;">Body</p>
            <img class="ProseMirror-separator" />
          </section>
        </div>
      </div>
    `;
    const normalized = normalizeImportedHtml(html);
    expect(normalized).not.toContain("ProseMirror");
    expect(normalized).not.toContain("leaf=");
    expect(normalized).toContain("<h2>");
    expect(normalized).toContain("<p style=\"color:#2c2c2c !important;\">Body</p>");
  });

  it("converts html content to markdown without wrapper tags", () => {
    const html = `<h2><span leaf="">WeChat Style Engine</span></h2><p><span leaf="">Paragraph</span></p>`;
    const markdown = htmlToMarkdown(html);
    expect(markdown).toContain("## WeChat Style Engine");
    expect(markdown).toContain("Paragraph");
    expect(markdown).not.toContain("<span");
  });
});
