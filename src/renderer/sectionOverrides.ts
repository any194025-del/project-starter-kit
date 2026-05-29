// Template-aware section resolver.
// Overrides are looked up first on the active template, then on the global
// section registry. Sections never import each other — composition lives here.
import type { ComponentType } from "react";
import type { SectionComponentProps } from "@/types/invitation";
import type { TemplateConfig } from "@/types/template";
import { sectionRegistry } from "./sectionRegistry";
import { UnknownSection } from "@/components/sections/UnknownSection";

export type SectionComponent = ComponentType<SectionComponentProps>;

export function resolveSectionFor(
  template: TemplateConfig | null | undefined,
  type: string,
): SectionComponent {
  const override = template?.overrides?.[type];
  if (override) return override;
  return sectionRegistry[type] ?? UnknownSection;
}
