import { validateStyleConfig } from "@/lib/style/styleConfig";
import type { StyleConfig } from "@/types/style";
import type { ApplyTemplateResult, StyleTemplate } from "@/types/template";

export function applyTemplate(current: StyleConfig, template: StyleTemplate): ApplyTemplateResult {
  return {
    nextStyleConfig: validateStyleConfig(template.globalStyleConfig),
    undoSnapshot: validateStyleConfig(current),
  };
}
