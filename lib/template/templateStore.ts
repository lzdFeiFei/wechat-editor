import { defaultStyleConfig, validateStyleConfig } from "@/lib/style/styleConfig";
import type { StyleTemplate } from "@/types/template";

const STORAGE_KEY = "wechat-style-templates:v1";

export function generateTemplateId(): string {
  return `tpl_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function normalizeTemplate(template: StyleTemplate): StyleTemplate {
  return {
    ...template,
    globalStyleConfig: validateStyleConfig(template.globalStyleConfig),
    description: template.description?.trim() || "",
    tags: Array.isArray(template.tags) ? template.tags.map((item) => item.trim()).filter(Boolean) : [],
    sourceType: template.sourceType === "html_import" ? "html_import" : "manual",
    version: Number.isFinite(template.version) ? template.version : 1,
  };
}

export function createTemplate(input: {
  name: string;
  sourceType: "manual" | "html_import";
  globalStyleConfig?: Partial<StyleTemplate["globalStyleConfig"]>;
  description?: string;
  tags?: string[];
}): StyleTemplate {
  const now = new Date().toISOString();
  return normalizeTemplate({
    id: generateTemplateId(),
    name: input.name.trim() || "未命名模板",
    description: input.description?.trim() || "",
    tags: input.tags ?? [],
    sourceType: input.sourceType,
    globalStyleConfig: validateStyleConfig({ ...defaultStyleConfig, ...input.globalStyleConfig }),
    createdAt: now,
    updatedAt: now,
    version: 1,
  });
}

export function readTemplatesFromStorage(): StyleTemplate[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item): item is StyleTemplate => Boolean(item && typeof item === "object"))
      .map(normalizeTemplate)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

export function persistTemplates(templates: StyleTemplate[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates.map(normalizeTemplate)));
}

export function duplicateTemplate(template: StyleTemplate): StyleTemplate {
  return createTemplate({
    name: `${template.name} - 副本`,
    sourceType: template.sourceType,
    description: template.description,
    tags: template.tags,
    globalStyleConfig: template.globalStyleConfig,
  });
}

export function parseTemplateImport(jsonText: string): { ok: true; template: StyleTemplate } | { ok: false; message: string } {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== "object") {
      return { ok: false, message: "JSON 格式无效：缺少模板对象。" };
    }
    if (typeof parsed.name !== "string") {
      return { ok: false, message: "模板导入失败：name 必须是字符串。" };
    }
    if (!parsed.globalStyleConfig || typeof parsed.globalStyleConfig !== "object") {
      return { ok: false, message: "模板导入失败：缺少 globalStyleConfig。" };
    }
    const template = createTemplate({
      name: parsed.name,
      description: typeof parsed.description === "string" ? parsed.description : "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      sourceType: parsed.sourceType === "html_import" ? "html_import" : "manual",
      globalStyleConfig: parsed.globalStyleConfig,
    });
    return { ok: true, template };
  } catch {
    return { ok: false, message: "模板导入失败：JSON 解析错误。" };
  }
}

export function exportTemplateJson(template: StyleTemplate): string {
  return JSON.stringify(normalizeTemplate(template), null, 2);
}
