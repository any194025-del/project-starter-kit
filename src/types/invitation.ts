// Domain types for the invitation template engine.
// JSON keys (e.g. "three_splash") are DB identifiers only — never used by UI.
// All rendering decisions are made via `type`.

export type TransitionPreset =
  | "fade"
  | "slide"
  | "scale"
  | "none"
  | "cinematicFade"
  | "softSlide"
  | "revealBlur"
  | "mobileSnap"
  | "fadeUp"
  | "staggerCards"
  | "cinematicSlide"
  | "softScale";

export interface BackgroundConfig {
  /** Mobile image URL */
  mobile?: string;
  /** Desktop image URL */
  desktop?: string;
  /** Optional looping video (muted, low-bitrate recommended) */
  videoUrl?: string;
  /** Optional poster for video */
  videoPoster?: string;
  /** Solid/translucent overlay (any CSS background value) */
  overlay?: string;
  /** Convenience: linear/radial gradient (any CSS background value) */
  gradient?: string;
  /** Blur in px applied to media */
  blur?: number;
  /** Opacity 0..1 applied to media */
  opacity?: number;
  /** Tint hex/rgba mixed at low alpha */
  tint?: string;
}

export interface SectionBase<TType extends string = string, TData = unknown> {
  /** DB identifier — opaque to UI. */
  key: string;
  /** Sort order within the invitation. */
  order: number;
  /** Drives which component renders. */
  type: TType;
  transition?: TransitionPreset;
  background?: BackgroundConfig;
  data: TData;
}

export type InvitationSection = SectionBase;

export interface InvitationMeta {
  coupleNames?: string;
  weddingDate?: string;
  audioUrl?: string;
  [k: string]: unknown;
}

export interface InvitationDocument {
  id: string;
  templateId: string;
  meta: InvitationMeta;
  /** Keyed by opaque DB identifiers. */
  pages: Record<string, Omit<InvitationSection, "key">>;
}

export interface SectionComponentProps<TData = unknown> {
  section: SectionBase<string, TData>;
  isActive: boolean;
  index: number;
  total: number;
}
