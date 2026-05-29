// Safe defaults used as the base for every TemplateConfig.
// Any template can override one or more fields without re-declaring the rest.

import type {
  ThemeTokens,
  TypographyPack,
  MotionPack,
  LayoutConfig,
  BackgroundPack,
} from "@/types/template";

export const defaultTokens: ThemeTokens = {
  colors: {
    bg: "#06030d",
    surface: "rgba(255,255,255,0.04)",
    surfaceAlt: "rgba(255,255,255,0.08)",
    text: "#f8f4ec",
    textMuted: "rgba(248,244,236,0.65)",
    accent: "#e6c277",
    accentSoft: "rgba(230,194,119,0.18)",
    gold: "#d9b14a",
    border: "rgba(230,194,119,0.22)",
    ring: "rgba(230,194,119,0.55)",
  },
  elevation: {
    shadowSm: "0 1px 2px rgba(0,0,0,0.35)",
    shadowMd: "0 8px 24px rgba(0,0,0,0.35)",
    shadowLg: "0 24px 60px rgba(0,0,0,0.5)",
    glow: "0 0 40px rgba(230,194,119,0.25)",
  },
  radii: {
    sm: "6px",
    md: "12px",
    lg: "20px",
    xl: "28px",
    pill: "999px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
  },
  overlays: {
    veil: "linear-gradient(180deg, rgba(6,3,13,0.35), rgba(6,3,13,0.8))",
    vignette: "radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
    bloom: "radial-gradient(60% 50% at 50% 50%, rgba(255,200,140,0.10), transparent 70%)",
  },
  blur: { soft: "8px", strong: "20px" },
};

export const defaultTypography: TypographyPack = {
  display: "'Cormorant Garamond', 'Playfair Display', serif",
  heading: "'Cormorant Garamond', serif",
  body: "'Inter', system-ui, sans-serif",
  script: "'Noto Serif Devanagari', serif",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Noto+Serif+Devanagari:wght@400;500;600&display=swap",
  scale: { xs: 0.75, sm: 0.85, base: 1, lg: 1.15, xl: 1.4, "2xl": 1.75, "3xl": 2.2 },
  displayTracking: "0.15em",
  bodyLeading: 1.55,
};

export const defaultMotion: MotionPack = {
  defaultTransition: "cinematicFade",
  intensity: 1,
  ease: [0.22, 1, 0.36, 1],
};

export const defaultLayout: LayoutConfig = {
  defaultVariant: "centered",
  density: 1,
  phoneFrame: true,
};

export const defaultBackgrounds: BackgroundPack = {
  base: {
    gradient:
      "radial-gradient(120% 80% at 50% 25%, #1d0f2e 0%, #0d061b 55%, #06030d 100%)",
  },
};
