import type { StyleConfig } from "@/types/style";

export type TemplateSourceType = "manual" | "html_import";
export type RefineElementType = "h1" | "h2" | "h3" | "p" | "li" | "blockquote" | "img" | "hr";

export interface StyleTemplate {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  sourceType: TemplateSourceType;
  globalStyleConfig: StyleConfig;
  previewMarkdown: string;
  elementPresetMapping?: Partial<Record<RefineElementType, string>>;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface TemplateImportPayload {
  name: string;
  description?: string;
  html: string;
}

export interface ArticleDraft {
  id: string;
  markdown: string;
  selectedTemplateId: string | null;
  localTweaksByType: Partial<Record<RefineElementType, Partial<StyleConfig>>>;
}

export interface ApplyTemplateResult {
  nextStyleConfig: StyleConfig;
  undoSnapshot: StyleConfig;
}

export type RefineByTypePatch = Partial<Record<RefineElementType, Partial<StyleConfig>>>;
