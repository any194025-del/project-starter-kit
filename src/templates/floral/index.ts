import type { TemplateConfig } from "@/types/template";
import {
  defaultTokens,
  defaultTypography,
  defaultMotion,
  defaultLayout,
} from "../_defaults";

export const floralTemplate: TemplateConfig = {
  meta: {
    id: "floral",
    slug: "floral",
    name: "Floral Whisper",
    category: "floral",
    previewImage:
      "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=800&q=60",
    supportedSections: [
      "splash", "countdown", "gallery", "events", "venue",
      "guests", "wishes", "note", "thanks",
    ],
    mobileFirst: true,
    description: "Soft blush and sage, light serif, airy spacing.",
  },
  tokens: {
    ...defaultTokens,
    colors: {
      ...defaultTokens.colors,
      bg: "#1a1410",
      text: "#fdf6ee",
      textMuted: "rgba(253,246,238,0.7)",
      accent: "#e8a7a0",
      accentSoft: "rgba(232,167,160,0.18)",
      gold: "#d3a07a",
      border: "rgba(232,167,160,0.28)",
      ring: "rgba(232,167,160,0.55)",
    },
    overlays: {
      ...defaultTokens.overlays,
      veil: "linear-gradient(180deg, rgba(34,22,18,0.45), rgba(20,12,10,0.85))",
      bloom: "radial-gradient(60% 50% at 50% 50%, rgba(232,167,160,0.12), transparent 72%)",
    },
  },
  typography: {
    ...defaultTypography,
    display: "'Cormorant Garamond', serif",
    heading: "'Cormorant Garamond', serif",
    body: "'Nunito Sans', system-ui, sans-serif",
    displayTracking: "0.2em",
  },
  motion: { ...defaultMotion, defaultTransition: "softSlide", intensity: 0.9 },
  layout: { ...defaultLayout, defaultVariant: "centered", density: 1.2 },
  backgrounds: {
    base: {
      gradient:
        "radial-gradient(120% 80% at 50% 25%, #3a2018 0%, #1f120e 60%, #14080a 100%)",
    },
  },
};
