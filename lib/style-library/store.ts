import type { ExtractedElementPreset } from "@/lib/analysis/formatInspector";
import { editableFieldsByType } from "@/lib/style/refineByType";
import { defaultStyleConfig } from "@/lib/style/styleConfig";
import type { StyleConfig } from "@/types/style";
import type { ElementStylePreset, StyleLibraryState } from "@/types/styleLibrary";
import type { RefineElementType } from "@/types/template";

export type { StyleLibraryState } from "@/types/styleLibrary";

const STORAGE_KEY = "wechat-style-library:v1";

interface ImportedPresetMeta {
  elementType: string;
  finalName: string;
  renamedFrom?: string;
}

interface ImportExtractedPresetsResult {
  nextLibraryState: StyleLibraryState;
  imported: ImportedPresetMeta[];
}

interface CreateManualPresetResult {
  nextLibraryState: StyleLibraryState;
  created: ElementStylePreset;
}

interface DuplicatePresetResult {
  nextLibraryState: StyleLibraryState;
  duplicated: ElementStylePreset | null;
}

function normalizeState(state: StyleLibraryState): StyleLibraryState {
  if (!state || !Array.isArray(state.presets)) {
    return { presets: [] };
  }
  const presets = state.presets
    .filter((preset): preset is ElementStylePreset => Boolean(preset && typeof preset === "object"))
    .map((preset) => ({
      ...preset,
      name: String(preset.name || "未命名样式"),
      sourceTitle: String(preset.sourceTitle || "参考文档"),
      createdAt: String(preset.createdAt || new Date().toISOString()),
      updatedAt: String(preset.updatedAt || new Date().toISOString()),
      configPatch:
        preset.configPatch && typeof preset.configPatch === "object" ? preset.configPatch : {},
    }));
  return { presets };
}

function buildDefaultPatch(type: RefineElementType): Partial<StyleConfig> {
  let patch: Partial<StyleConfig> = {};
  for (const field of editableFieldsByType[type]) {
    patch = {
      ...patch,
      [field]: defaultStyleConfig[field],
    };
  }
  return patch;
}

function buildDefaultPresets(): ElementStylePreset[] {
  const now = new Date().toISOString();
  const types: RefineElementType[] = ["h1", "h2", "h3", "p", "li", "blockquote", "img", "hr"];
  return types.map((type, index) => ({
    id: `sys_default_${type}_${index + 1}`,
    name: `默认-${type}`,
    elementType: type,
    configPatch: buildDefaultPatch(type),
    sourceTitle: "系统默认",
    createdAt: now,
    updatedAt: now,
  }));
}

function generatePresetId(): string {
  return `sp_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function nextUniqueName(baseName: string, existingNames: Set<string>): { finalName: string; renamedFrom?: string } {
  if (!existingNames.has(baseName)) {
    return { finalName: baseName };
  }
  let index = 2;
  while (existingNames.has(`${baseName}-${index}`)) {
    index += 1;
  }
  return {
    finalName: `${baseName}-${index}`,
    renamedFrom: baseName,
  };
}

export function createEmptyStyleLibraryState(): StyleLibraryState {
  return { presets: buildDefaultPresets() };
}

export function readStyleLibraryFromStorage(): StyleLibraryState {
  if (typeof window === "undefined") {
    return createEmptyStyleLibraryState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyStyleLibraryState();
    }
    const parsed = JSON.parse(raw) as StyleLibraryState;
    const normalized = normalizeState(parsed);
    return normalized.presets.length > 0 ? normalized : createEmptyStyleLibraryState();
  } catch {
    return createEmptyStyleLibraryState();
  }
}

export function persistStyleLibrary(state: StyleLibraryState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
}

export function updatePresetInLibrary(
  state: StyleLibraryState,
  presetId: string,
  patch: Partial<Omit<ElementStylePreset, "id" | "createdAt">>,
): StyleLibraryState {
  const normalized = normalizeState(state);
  return {
    presets: normalized.presets.map((preset) =>
      preset.id === presetId
        ? {
            ...preset,
            ...patch,
            configPatch: patch.configPatch ?? preset.configPatch,
            updatedAt: new Date().toISOString(),
          }
        : preset,
    ),
  };
}

export function importExtractedPresets(
  libraryState: StyleLibraryState,
  extractedPresets: ExtractedElementPreset[],
  sourceTitle: string,
): ImportExtractedPresetsResult {
  const normalized = normalizeState(libraryState);
  const existingNames = new Set(normalized.presets.map((preset) => preset.name));
  const imported: ImportedPresetMeta[] = [];
  const now = new Date().toISOString();
  const safeSourceTitle = sourceTitle.trim() || "参考文档";

  const created = extractedPresets.map((preset) => {
    const baseName = `${safeSourceTitle}-${preset.elementType}`;
    const { finalName, renamedFrom } = nextUniqueName(baseName, existingNames);
    existingNames.add(finalName);
    imported.push({
      elementType: preset.elementType,
      finalName,
      renamedFrom,
    });
    return {
      id: generatePresetId(),
      name: finalName,
      elementType: preset.elementType,
      sourceTitle: safeSourceTitle,
      configPatch: preset.configPatch,
      createdAt: now,
      updatedAt: now,
    } satisfies ElementStylePreset;
  });

  return {
    nextLibraryState: {
      presets: [...created, ...normalized.presets],
    },
    imported,
  };
}

export function createManualPreset(
  libraryState: StyleLibraryState,
  elementType: RefineElementType,
  preferredName?: string,
): CreateManualPresetResult {
  const normalized = normalizeState(libraryState);
  const existingNames = new Set(normalized.presets.map((preset) => preset.name));
  const baseName = preferredName?.trim() || `手动-${elementType}`;
  const { finalName } = nextUniqueName(baseName, existingNames);
  const now = new Date().toISOString();

  const created: ElementStylePreset = {
    id: generatePresetId(),
    name: finalName,
    elementType,
    sourceTitle: "手动创建",
    configPatch: buildDefaultPatch(elementType),
    createdAt: now,
    updatedAt: now,
  };

  return {
    nextLibraryState: {
      presets: [created, ...normalized.presets],
    },
    created,
  };
}

export function duplicatePresetInLibrary(
  libraryState: StyleLibraryState,
  presetId: string,
): DuplicatePresetResult {
  const normalized = normalizeState(libraryState);
  const source = normalized.presets.find((preset) => preset.id === presetId);
  if (!source) {
    return {
      nextLibraryState: normalized,
      duplicated: null,
    };
  }

  const existingNames = new Set(normalized.presets.map((preset) => preset.name));
  const { finalName } = nextUniqueName(`${source.name}-副本`, existingNames);
  const now = new Date().toISOString();
  const duplicated: ElementStylePreset = {
    ...source,
    id: generatePresetId(),
    name: finalName,
    sourceTitle: "手动复制",
    configPatch: { ...source.configPatch },
    createdAt: now,
    updatedAt: now,
  };

  return {
    nextLibraryState: {
      presets: [duplicated, ...normalized.presets],
    },
    duplicated,
  };
}

export function deletePresetFromLibrary(
  libraryState: StyleLibraryState,
  presetId: string,
): StyleLibraryState {
  const normalized = normalizeState(libraryState);
  return {
    presets: normalized.presets.filter((preset) => preset.id !== presetId),
  };
}
