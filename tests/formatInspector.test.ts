import { describe, expect, it } from "vitest";

import {
  extractElementPresetsFromHtml,
  htmlToMarkdown,
  normalizeImportedHtml,
} from "@/lib/analysis/formatInspector";
import { defaultStyleConfig } from "@/lib/style/styleConfig";

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

  it("extracts only appeared element presets from html", () => {
    const html = `
      <h1 style="font-size:34px;color:#112233;font-weight:800;">Main</h1>
      <h2 style="font-size:26px;color:#334455;">Sub</h2>
      <p style="font-size:17px;line-height:1.9;color:#445566;">Body</p>
      <blockquote style="background:#f5f5f5;border-left:4px solid #778899;color:#223344;padding:12px;border-radius:8px;">Quote</blockquote>
    `;

    const result = extractElementPresetsFromHtml(html, defaultStyleConfig);
    const extractedTypes = result.presets.map((preset) => preset.elementType).sort();

    expect(extractedTypes).toEqual(["blockquote", "h1", "h2", "p"]);
    expect(result.presets.find((preset) => preset.elementType === "h1")?.configPatch.h1Size).toBe(34);
    expect(result.presets.find((preset) => preset.elementType === "h2")?.configPatch.h2Size).toBe(26);
    expect(result.presets.find((preset) => preset.elementType === "p")?.configPatch.bodyFontSize).toBe(17);
  });

  it("keeps missing fields out of patch when styles are absent", () => {
    const html = `<h2>Heading without inline style</h2>`;
    const result = extractElementPresetsFromHtml(html, defaultStyleConfig);
    expect(result.presets).toHaveLength(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
