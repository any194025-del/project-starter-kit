// Pure theme resolver: template defaults <- runtime overrides.
// Deterministic, memoisable, SSR-safe.
import type {
  ResolvedTheme,
  RuntimeOverrides,
  TemplateConfig,
} from "@/types/template";

function mergeObj<T extends object>(base: T, patch?: Partial<T>): T {
  if (!patch) return base;
  return { ...base, ...patch } as T;
}

export function resolveTheme(
  template: TemplateConfig,
  overrides?: RuntimeOverrides,
): ResolvedTheme {
  const tokens = {
    ...template.tokens,
    colors: mergeObj(template.tokens.colors, overrides?.tokens?.colors),
    overlays: mergeObj(template.tokens.overlays, overrides?.tokens?.overlays),
    elevation: mergeObj(template.tokens.elevation, overrides?.tokens?.elevation as never),
    radii: mergeObj(template.tokens.radii, overrides?.tokens?.radii as never),
    spacing: mergeObj(template.tokens.spacing, overrides?.tokens?.spacing as never),
    blur: mergeObj(template.tokens.blur, overrides?.tokens?.blur as never),
  };

  const typography = mergeObj(template.typography, overrides?.typography);
  const motion = mergeObj(template.motion, overrides?.motion);
  const layout = mergeObj(template.layout, overrides?.layout);

  return {
    template,
    tokens,
    typography,
    motion,
    layout,
    backgrounds: template.backgrounds,
  };
}

/** Flatten ResolvedTheme into CSS custom properties for runtime injection. */
export function themeToCssVars(theme: ResolvedTheme): Record<string, string> {
  const c = theme.tokens.colors;
  const e = theme.tokens.elevation;
  const r = theme.tokens.radii;
  const s = theme.tokens.spacing;
  const o = theme.tokens.overlays;
  const t = theme.typography;
  return {
    "--inv-bg": c.bg,
    "--inv-surface": c.surface,
    "--inv-surface-alt": c.surfaceAlt,
    "--inv-text": c.text,
    "--inv-text-muted": c.textMuted,
    "--inv-accent": c.accent,
    "--inv-accent-soft": c.accentSoft,
    "--inv-gold": c.gold,
    "--inv-border": c.border,
    "--inv-ring": c.ring,
    "--inv-shadow-sm": e.shadowSm,
    "--inv-shadow-md": e.shadowMd,
    "--inv-shadow-lg": e.shadowLg,
    "--inv-glow": e.glow,
    "--inv-radius-sm": r.sm,
    "--inv-radius-md": r.md,
    "--inv-radius-lg": r.lg,
    "--inv-radius-xl": r.xl,
    "--inv-radius-pill": r.pill,
    "--inv-space-xs": s.xs,
    "--inv-space-sm": s.sm,
    "--inv-space-md": s.md,
    "--inv-space-lg": s.lg,
    "--inv-space-xl": s.xl,
    "--inv-overlay-veil": o.veil,
    "--inv-overlay-vignette": o.vignette,
    "--inv-overlay-bloom": o.bloom,
    "--inv-blur-soft": theme.tokens.blur.soft,
    "--inv-blur-strong": theme.tokens.blur.strong,
    "--inv-font-display": t.display,
    "--inv-font-heading": t.heading,
    "--inv-font-body": t.body,
    "--inv-font-script": t.script,
    "--inv-display-tracking": t.displayTracking,
    "--inv-body-leading": String(t.bodyLeading),
    "--inv-motion-intensity": String(theme.motion.intensity),
  };
}
