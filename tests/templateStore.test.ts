import { describe, expect, it } from "vitest";

import { applyTemplate } from "@/lib/template/applyTemplate";
import { createTemplate, parseTemplateImport } from "@/lib/template/templateStore";
import { defaultStyleConfig } from "@/lib/style/styleConfig";

describe("template store", () => {
  it("creates normalized template", () => {
    const template = createTemplate({
      name: "  Brand A  ",
      sourceType: "manual",
      globalStyleConfig: { h1Size: 44 },
    });

    expect(template.name).toBe("Brand A");
    expect(template.globalStyleConfig.h1Size).toBe(44);
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
    }
  });

  it("returns invalid message for malformed import", () => {
    const result = parseTemplateImport("{ broken");
    expect(result.ok).toBe(false);
  });
});

describe("applyTemplate", () => {
  it("overrides all style fields and preserves undo snapshot", () => {
    const template = createTemplate({
      name: "Apply target",
      sourceType: "manual",
      globalStyleConfig: { textColor: "#ff0000" },
    });
    const current = { ...defaultStyleConfig, textColor: "#111111" };
    const result = applyTemplate(current, template);
    expect(result.nextStyleConfig.textColor).toBe("#ff0000");
    expect(result.undoSnapshot.textColor).toBe("#111111");
  });
});
