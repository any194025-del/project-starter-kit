import type { TemplateConfig } from "@/types/template";
import {
  defaultTokens,
  defaultTypography,
  defaultMotion,
  defaultLayout,
  defaultBackgrounds,
} from "../_defaults";

export const cinematicTemplate: TemplateConfig = {
  meta: {
    id: "cinematic",
    slug: "cinematic",
    name: "Cinematic Noir",
    category: "cinematic",
    previewImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=60",
    supportedSections: [
      "splash", "countdown", "gallery", "video", "events", "venue",
      "guests", "wishes", "note", "thanks",
    ],
    mobileFirst: true,
    description: "Warm gold-on-violet, slow fades, particle ambience.",
  },
  tokens: defaultTokens,
  typography: defaultTypography,
  motion: { ...defaultMotion, defaultTransition: "cinematicFade", intensity: 1 },
  layout: { ...defaultLayout, defaultVariant: "centered" },
  backgrounds: defaultBackgrounds,
};
