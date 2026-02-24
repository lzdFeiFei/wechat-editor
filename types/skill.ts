import type { StyleConfig } from "./style";

export interface SkillInput {
  title: string;
  markdown: string;
  styleConfig: StyleConfig;
}

export interface SkillOutput {
  html: string;
}
