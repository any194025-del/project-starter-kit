import type { TemplateConfig } from "@/types/template";
import {
  defaultTokens,
  defaultTypography,
  defaultMotion,
  defaultLayout,
} from "../_defaults";
import { RoyalSplashSection } from "./RoyalSplashSection";

export const royalTemplate: TemplateConfig = {
  meta: {
    id: "royal",
    slug: "royal",
    name: "Royal Heritage",
    category: "royal",
    previewImage:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=60",
    supportedSections: [
      "splash", "countdown", "gallery", "events", "venue",
      "guests", "wishes", "note", "thanks",
    ],
    mobileFirst: true,
    description: "Deep maroon + antique gold, regal serif typography.",
  },
  tokens: {
    ...defaultTokens,
    colors: {
      ...defaultTokens.colors,
      bg: "#1a0408",
      text: "#fff5e1",
      textMuted: "rgba(255,245,225,0.7)",
      accent: "#f1c87a",
      accentSoft: "rgba(241,200,122,0.2)",
      gold: "#f1c87a",
      border: "rgba(241,200,122,0.3)",
      ring: "rgba(241,200,122,0.6)",
    },
    elevation: {
      ...defaultTokens.elevation,
      glow: "0 0 50px rgba(241,200,122,0.3)",
    },
    overlays: {
      ...defaultTokens.overlays,
      veil: "linear-gradient(180deg, rgba(38,8,12,0.55), rgba(20,4,8,0.92))",
      bloom: "radial-gradient(60% 50% at 50% 45%, rgba(241,200,122,0.14), transparent 70%)",
    },
  },
  typography: {
    ...defaultTypography,
    display: "'Cinzel', 'Cormorant Garamond', serif",
    heading: "'Cinzel', serif",
    body: "'Cormorant Garamond', serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:wght@300;400;500&family=Noto+Serif+Devanagari:wght@400;500;600&family=Inter:wght@300;400;500&display=swap",
    displayTracking: "0.28em",
  },
  motion: {
    ...defaultMotion,
    defaultTransition: "revealBlur",
    intensity: 0.85,
    perType: { splash: "cinematicFade", countdown: "fadeUp" },
  },
  layout: { ...defaultLayout, defaultVariant: "centered", density: 1.1 },
  backgrounds: {
    base: {
      gradient:
        "radial-gradient(120% 80% at 50% 20%, #5a0e1e 0%, #2a0610 55%, #14040a 100%)",
      overlay:
        "radial-gradient(70% 50% at 50% 50%, rgba(241,200,122,0.08), transparent 70%)",
    },
  },
  overrides: {
    splash: RoyalSplashSection,
  },
};
