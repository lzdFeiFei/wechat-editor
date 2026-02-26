import type { StyleConfig } from "@/types/style";
import type { RefineElementType } from "@/types/template";

export interface ElementStylePreset {
  id: string;
  name: string;
  elementType: RefineElementType;
  configPatch: Partial<StyleConfig>;
  sourceTitle: string;
  createdAt: string;
  updatedAt: string;
}

export interface StyleLibraryState {
  presets: ElementStylePreset[];
}
