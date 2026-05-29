// Template registry — the only place that knows about concrete templates.
// Renderer asks the registry for a TemplateConfig by id; nothing else couples.
import type { TemplateConfig } from "@/types/template";
import { cinematicTemplate } from "./cinematic";
import { royalTemplate } from "./royal";
import { floralTemplate } from "./floral";

export const TEMPLATES: Record<string, TemplateConfig> = {
  cinematic: cinematicTemplate,
  royal: royalTemplate,
  floral: floralTemplate,
  // Back-compat alias so legacy docs with templateId="default" still render.
  default: cinematicTemplate,
};

export const FALLBACK_TEMPLATE_ID = "cinematic";

export function getTemplate(id?: string | null): TemplateConfig {
  if (id && TEMPLATES[id]) return TEMPLATES[id];
  return TEMPLATES[FALLBACK_TEMPLATE_ID];
}

export function listTemplates(): TemplateConfig[] {
  // Hide the alias from listings.
  return Object.entries(TEMPLATES)
    .filter(([k]) => k !== "default")
    .map(([, t]) => t);
}
