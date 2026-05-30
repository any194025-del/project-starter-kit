// Configuration presets. Presets only patch the draft — they never replace
// section data; the builder applies them via shallow merges on meta + theme.
import type { RuntimeOverrides } from "@/types/template";

export interface BuilderPreset {
  id: string;
  name: string;
  description: string;
  templateId: string;
  themeOverrides?: RuntimeOverrides;
}

export const PRESETS: BuilderPreset[] = [
  {
    id: "traditional",
    name: "Traditional Wedding",
    description: "Warm gold accents on deep maroon. Classic Indian palette.",
    templateId: "cinematic",
    themeOverrides: {
      tokens: { colors: { accent: "#d4a857", gold: "#f0d78c" } },
    } as RuntimeOverrides,
  },
  {
    id: "royal",
    name: "Royal Wedding",
    description: "Regal jewel tones with ornate typography.",
    templateId: "royal",
    themeOverrides: {
      tokens: { colors: { accent: "#c9a84c", bg: "#0d0820" } },
    } as RuntimeOverrides,
  },
  {
    id: "minimal",
    name: "Minimal Wedding",
    description: "Quiet neutrals with restrained motion.",
    templateId: "cinematic",
    themeOverrides: {
      tokens: { colors: { accent: "#b8a48a" } },
      motion: { intensity: 0.5 },
    } as RuntimeOverrides,
  },
  {
    id: "floral",
    name: "Floral Wedding",
    description: "Soft botanical palette with airy spacing.",
    templateId: "floral",
    themeOverrides: {
      tokens: { colors: { accent: "#e07a8a" } },
    } as RuntimeOverrides,
  },
];
