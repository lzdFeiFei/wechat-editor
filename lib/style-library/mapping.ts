import type { ElementStylePreset } from "@/types/styleLibrary";
import type { RefineByTypePatch, RefineElementType, StyleTemplate } from "@/types/template";

const elementTypes: RefineElementType[] = ["h1", "h2", "h3", "p", "li", "blockquote", "img", "hr"];

export function deriveRefineByTypeFromTemplate(
  template: Pick<StyleTemplate, "elementPresetMapping">,
  presets: ElementStylePreset[],
): RefineByTypePatch {
  const presetById = new Map(presets.map((preset) => [preset.id, preset]));
  const refineByType: RefineByTypePatch = {};

  for (const type of elementTypes) {
    const mappedPresetId = template.elementPresetMapping?.[type];
    if (!mappedPresetId) {
      continue;
    }
    const preset = presetById.get(mappedPresetId);
    if (!preset || preset.elementType !== type) {
      continue;
    }
    refineByType[type] = { ...preset.configPatch };
  }

  return refineByType;
}
