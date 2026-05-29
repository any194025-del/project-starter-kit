// Template engine types. Templates are CONFIGS, never duplicated apps.
// A template is composed of tokens + typography + motion + layout + bg pack
// + optional section overrides. The renderer resolves a TemplateConfig from
// the registry and exposes it to all sections via ThemeProvider.

import type { ComponentType } from "react";
import type { SectionComponentProps, TransitionPreset, BackgroundConfig } from "./invitation";

/* ---------- tokens ---------- */

export interface ColorTokens {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  gold: string;
  border: string;
  ring: string;
}

export interface ElevationTokens {
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  glow: string;
}

export interface RadiiTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  pill: string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface OverlayTokens {
  veil: string;       // section veil overlay
  vignette: string;   // radial vignette
  bloom: string;      // soft warm bloom
}

export interface ThemeTokens {
  colors: ColorTokens;
  elevation: ElevationTokens;
  radii: RadiiTokens;
  spacing: SpacingTokens;
  overlays: OverlayTokens;
  blur: { soft: string; strong: string };
}

/* ---------- typography ---------- */

export interface TypographyPack {
  /** Display heading font stack (cinematic titles). */
  display: string;
  /** Serif/secondary heading stack. */
  heading: string;
  /** Body / paragraph stack. */
  body: string;
  /** Devanagari / script accent stack. */
  script: string;
  /** Optional Google Fonts URL the template wants injected. */
  googleFontsUrl?: string;
  /** Multipliers for the global type scale (mobile-first). */
  scale: { xs: number; sm: number; base: number; lg: number; xl: number; "2xl": number; "3xl": number };
  /** Default letter-spacing for display headings. */
  displayTracking: string;
  /** Default body line-height. */
  bodyLeading: number;
}

/* ---------- motion ---------- */

export interface MotionPack {
  /** Default transition preset between sections. */
  defaultTransition: TransitionPreset;
  /** Per-section-type transition overrides. */
  perType?: Partial<Record<string, TransitionPreset>>;
  /** 0..1 — globally scales animation strength (distance, blur, durations). */
  intensity: number;
  /** Optional global ease applied to derived effects. */
  ease?: [number, number, number, number];
}

/* ---------- layout ---------- */

export type LayoutVariant =
  | "centered"
  | "split"
  | "fullscreen"
  | "card-stack"
  | "minimal";

export interface LayoutConfig {
  defaultVariant: LayoutVariant;
  /** Per-section-type variant override. */
  perType?: Partial<Record<string, LayoutVariant>>;
  /** Container padding scale 0..2. */
  density: number;
  /** Whether to constrain content to a phone-frame on desktop. */
  phoneFrame: boolean;
}

/* ---------- backgrounds ---------- */

export interface BackgroundPack {
  /** Theme-wide background applied behind every section, beneath section.background. */
  base?: BackgroundConfig;
  /** Per-section-type defaults (merged under section.background). */
  perType?: Partial<Record<string, BackgroundConfig>>;
}

/* ---------- section overrides ---------- */

export type SectionComponent = ComponentType<SectionComponentProps>;
export type SectionOverrideMap = Partial<Record<string, SectionComponent>>;

/* ---------- template ---------- */

export type TemplateCategory =
  | "cinematic"
  | "royal"
  | "floral"
  | "minimalist"
  | "luxury"
  | "traditional";

export interface TemplateMeta {
  id: string;
  slug: string;
  name: string;
  category: TemplateCategory;
  previewImage?: string;
  supportedSections: string[];
  mobileFirst: boolean;
  description?: string;
}

export interface TemplateConfig {
  meta: TemplateMeta;
  tokens: ThemeTokens;
  typography: TypographyPack;
  motion: MotionPack;
  layout: LayoutConfig;
  backgrounds: BackgroundPack;
  overrides?: SectionOverrideMap;
}

/* ---------- runtime resolution ---------- */

export interface RuntimeOverrides {
  tokens?: Partial<ThemeTokens> & {
    colors?: Partial<ColorTokens>;
    overlays?: Partial<OverlayTokens>;
  };
  typography?: Partial<TypographyPack>;
  motion?: Partial<MotionPack>;
  layout?: Partial<LayoutConfig>;
}

export interface ResolvedTheme {
  template: TemplateConfig;
  tokens: ThemeTokens;
  typography: TypographyPack;
  motion: MotionPack;
  layout: LayoutConfig;
  backgrounds: BackgroundPack;
}
