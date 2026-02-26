import { defaultStyleConfig, sampleMarkdown, validateStyleConfig } from "@/lib/style/styleConfig";
import type { StyleTemplate } from "@/types/template";

const STORAGE_KEY = "wechat-style-templates:v1";

export interface TemplateImportIssue {
  field: string;
  message: string;
}

type TemplateImportFailure = {
  ok: false;
  message: string;
  issues: TemplateImportIssue[];
};

type TemplateImportSuccess = {
  ok: true;
  template: StyleTemplate;
};

export function generateTemplateId(): string {
  return `tpl_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function normalizeTemplate(template: StyleTemplate): StyleTemplate {
  const mapping = template.elementPresetMapping;
  return {
    ...template,
    globalStyleConfig: validateStyleConfig(template.globalStyleConfig),
    description: template.description?.trim() || "",
    tags: Array.isArray(template.tags) ? template.tags.map((item) => item.trim()).filter(Boolean) : [],
    previewMarkdown: String(template.previewMarkdown || sampleMarkdown),
    elementPresetMapping:
      mapping && typeof mapping === "object" ? { ...mapping } : {},
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
  previewMarkdown?: string;
  elementPresetMapping?: StyleTemplate["elementPresetMapping"];
}): StyleTemplate {
  const now = new Date().toISOString();
  return normalizeTemplate({
    id: generateTemplateId(),
    name: input.name.trim() || "未命名模板",
    description: input.description?.trim() || "",
    tags: input.tags ?? [],
    sourceType: input.sourceType,
    globalStyleConfig: validateStyleConfig({ ...defaultStyleConfig, ...input.globalStyleConfig }),
    previewMarkdown: String(input.previewMarkdown || sampleMarkdown),
    elementPresetMapping: input.elementPresetMapping ?? {},
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
    previewMarkdown: template.previewMarkdown,
    elementPresetMapping: template.elementPresetMapping,
  });
}

export function parseTemplateImport(
  jsonText: string,
): TemplateImportSuccess | TemplateImportFailure {
  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return {
        ok: false,
        message: "JSON 格式无效：缺少模板对象。",
        issues: [{ field: "root", message: "导入内容必须是对象类型" }],
      };
    }

    const issues: TemplateImportIssue[] = [];
    if (typeof parsed.name !== "string" || !parsed.name.trim()) {
      issues.push({ field: "name", message: "name 必须是非空字符串" });
    }
    if (!parsed.globalStyleConfig || typeof parsed.globalStyleConfig !== "object") {
      issues.push({
        field: "globalStyleConfig",
        message: "globalStyleConfig 必须是对象",
      });
    }
    if (
      parsed.previewMarkdown !== undefined &&
      typeof parsed.previewMarkdown !== "string"
    ) {
      issues.push({
        field: "previewMarkdown",
        message: "previewMarkdown 必须是字符串",
      });
    }
    if (
      parsed.description !== undefined &&
      typeof parsed.description !== "string"
    ) {
      issues.push({ field: "description", message: "description 必须是字符串" });
    }
    if (
      parsed.tags !== undefined &&
      !Array.isArray(parsed.tags)
    ) {
      issues.push({ field: "tags", message: "tags 必须是字符串数组" });
    }
    if (Array.isArray(parsed.tags) && parsed.tags.some((tag) => typeof tag !== "string")) {
      issues.push({ field: "tags", message: "tags 内每一项都必须是字符串" });
    }

    if (issues.length > 0) {
      return {
        ok: false,
        message: "模板导入失败：JSON 字段不合法。",
        issues,
      };
    }

    const template = createTemplate({
      name: parsed.name as string,
      description: (parsed.description as string | undefined) ?? "",
      tags: (parsed.tags as string[] | undefined) ?? [],
      sourceType: parsed.sourceType === "html_import" ? "html_import" : "manual",
      globalStyleConfig: parsed.globalStyleConfig as Partial<StyleTemplate["globalStyleConfig"]>,
      previewMarkdown: typeof parsed.previewMarkdown === "string" ? parsed.previewMarkdown : sampleMarkdown,
    });
    return { ok: true, template };
  } catch {
    return {
      ok: false,
      message: "模板导入失败：JSON 解析错误。",
      issues: [{ field: "json", message: "请检查逗号、引号和括号是否完整" }],
    };
  }
}

export function exportTemplateJson(template: StyleTemplate): string {
  return JSON.stringify(normalizeTemplate(template), null, 2);
}
