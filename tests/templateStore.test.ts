import { describe, expect, it } from "vitest";

import { applyTemplate } from "@/lib/template/applyTemplate";
import { defaultStyleConfig, sampleMarkdown } from "@/lib/style/styleConfig";
import {
  createTemplate,
  parseTemplateImport,
  readTemplatesFromStorage,
} from "@/lib/template/templateStore";

describe("template store", () => {
  it("creates normalized template", () => {
    const template = createTemplate({
      name: "  Brand A  ",
      sourceType: "manual",
      globalStyleConfig: { h1Size: 44 },
      previewMarkdown: "# Preview markdown",
    });

    expect(template.name).toBe("Brand A");
    expect(template.globalStyleConfig.h1Size).toBe(44);
    expect(template.previewMarkdown).toBe("# Preview markdown");
    expect(template.version).toBe(1);
  });

  it("parses imported template json", () => {
    const payload = JSON.stringify({
      name: "Imported",
      sourceType: "html_import",
      globalStyleConfig: { h2Size: 30 },
    });
    const result = parseTemplateImport(payload);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.template.sourceType).toBe("html_import");
      expect(result.template.globalStyleConfig.h2Size).toBe(30);
      expect(result.template.previewMarkdown).toBe(sampleMarkdown);
    }
  });

  it("returns invalid message for malformed import", () => {
    const result = parseTemplateImport("{ broken");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.field).toBe("json");
    }
  });

  it("returns field-level issues for invalid payload shape", () => {
    const payload = JSON.stringify({
      name: "",
      globalStyleConfig: "not-object",
      previewMarkdown: 123,
      tags: [1, 2],
    });
    const result = parseTemplateImport(payload);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const fields = result.issues.map((item) => item.field);
      expect(fields).toContain("name");
      expect(fields).toContain("globalStyleConfig");
      expect(fields).toContain("previewMarkdown");
      expect(fields).toContain("tags");
    }
  });

  it("fills previewMarkdown for legacy templates", () => {
    window.localStorage.setItem(
      "wechat-style-templates:v1",
      JSON.stringify([
        {
          id: "legacy",
          name: "legacy",
          sourceType: "manual",
          globalStyleConfig: defaultStyleConfig,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
          version: 1,
        },
      ]),
    );
    const templates = readTemplatesFromStorage();
    expect(templates[0]?.previewMarkdown).toBe(sampleMarkdown);
    expect(templates[0]?.elementPresetMapping).toEqual({});
  });
});

describe("applyTemplate", () => {
  it("overrides all style fields and preserves undo snapshot", () => {
    const template = createTemplate({
      name: "Apply target",
      sourceType: "manual",
      globalStyleConfig: { pTextColor: "#ff0000" },
    });
    const current = { ...defaultStyleConfig, pTextColor: "#111111" };
    const result = applyTemplate(current, template);
    expect(result.nextStyleConfig.pTextColor).toBe("#ff0000");
    expect(result.undoSnapshot.pTextColor).toBe("#111111");
  });
});
