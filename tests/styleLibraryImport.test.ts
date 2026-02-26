import { describe, expect, it } from "vitest";

import {
  createEmptyStyleLibraryState,
  createManualPreset,
  deletePresetFromLibrary,
  duplicatePresetInLibrary,
  importExtractedPresets,
} from "@/lib/style-library/store";

describe("styleLibrary import", () => {
  it("seeds default presets for all refine element types", () => {
    const state = createEmptyStyleLibraryState();
    const types = new Set(state.presets.map((preset) => preset.elementType));
    expect(types).toEqual(new Set(["h1", "h2", "h3", "p", "li", "blockquote", "img", "hr"]));
    expect(state.presets.length).toBeGreaterThanOrEqual(8);
  });

  it("imports extracted presets with source-title-based names", () => {
    const result = importExtractedPresets(
      { presets: [] },
      [
        {
          elementType: "h2",
          configPatch: { h2Size: 24 },
          sourceStats: { matchedNodes: 2, sampledDecls: 8 },
        },
      ],
      "科技周报",
    );

    expect(result.imported).toHaveLength(1);
    expect(result.imported[0].finalName).toBe("科技周报-h2");
    expect(result.nextLibraryState.presets[0].name).toBe("科技周报-h2");
  });

  it("auto-renames when name conflicts", () => {
    const result = importExtractedPresets(
      {
        presets: [
          {
            id: "a",
            name: "科技周报-h2",
            elementType: "h2",
            sourceTitle: "科技周报",
            configPatch: { h2Size: 26 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
      [
        {
          elementType: "h2",
          configPatch: { h2Size: 24 },
          sourceStats: { matchedNodes: 2, sampledDecls: 8 },
        },
      ],
      "科技周报",
    );

    expect(result.imported[0].finalName).toBe("科技周报-h2-2");
    expect(result.imported[0].renamedFrom).toBe("科技周报-h2");
  });

  it("creates manual preset for selected element type", () => {
    const state = createEmptyStyleLibraryState();
    const result = createManualPreset(state, "h2");
    expect(result.created.elementType).toBe("h2");
    expect(result.created.name).toContain("h2");
    expect(result.nextLibraryState.presets.some((preset) => preset.id === result.created.id)).toBe(true);
  });

  it("duplicates and deletes preset", () => {
    const state = createEmptyStyleLibraryState();
    const source = state.presets[0];
    const duplicated = duplicatePresetInLibrary(state, source.id);
    expect(duplicated.duplicated).not.toBeNull();
    expect(duplicated.duplicated?.id).not.toBe(source.id);
    expect(duplicated.duplicated?.name).toContain("副本");

    const deletedState = deletePresetFromLibrary(duplicated.nextLibraryState, source.id);
    expect(deletedState.presets.some((preset) => preset.id === source.id)).toBe(false);
  });
});
