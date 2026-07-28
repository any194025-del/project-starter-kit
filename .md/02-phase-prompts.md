# Phase Prompts (build in order)

Each phase starts with: *"Phases 1..N-1 already exist and must remain intact."*

---

## Phase 1 — Foundation & Types

**Goal:** Establish the JSON-driven contract before any UI.

Deliverables: `src/types/invitation.ts`, `types/template.ts`, `types/guest.ts`,
`types/editor.ts`; `src/data/invitation.json` sample document; design tokens in
`src/styles.css` (semantic HSL variables, no raw colors in components);
`src/animations/presets.ts` motion presets.

Constraints: no components yet that assume a specific section type.

---

## Phase 2 — Sections & Renderer

**Goal:** Dynamic section rendering from JSON.

Deliverables: `sectionRegistry.ts`, `InvitationRenderer.tsx`, `SectionContainer`,
`PageTransition`, `Preloader`, all ten section components, `UnknownSection`
fallback, `invitationStore` (currentIndex, opened, audioPlaying, scrolling),
`SectionNavButtons`.

Constraints: renderer must contain zero `switch (type)` logic; unknown types
degrade gracefully.

---

## Phase 3 — Theme & Template Engine

**Goal:** Templates as configs, never duplicated apps.

Deliverables: `templates/_defaults.ts`, `templates/cinematic|royal|floral`,
`templates/registry.ts` (with a `default` back-compat alias),
`theme/resolveTheme.ts`, `theme/ThemeProvider.tsx`, `BackgroundLayer`,
`sectionOverrides.ts` for optional per-template section swaps.

Constraints: switching `templateId` must preserve all content and personalization.

---

## Phase 4 — Mobile Polish & Gestures

**Goal:** Premium, production-grade mobile feel.

Deliverables: `useSwipeNavigation` (velocity + direction lock, no jitter),
`useScrollIdle`, section snapping, adaptive nav that fades while scrolling,
`ProgressiveImage` (IntersectionObserver lazy mount, shimmer placeholder,
reserved aspect ratio, fade on decode), adjacent-section image preloading,
crossfading backgrounds, polished audio button, `prefers-reduced-motion`
handling, tap-highlight reset.

Constraints: no repaint storms, no permanent animation loops, no CLS.

---

## Phase 5 — Personalization & Services

**Goal:** Turn the frontend into a SaaS foundation.

Deliverables: `services/invitationService|guestService|rsvpService|
analyticsService` (async, backend-shaped), `data/mock/*`, `renderer/personalize.ts`
token engine, `usePersonalization` context provider, `RsvpButton`,
routes `/invite/$slug`, `/invite/$slug/`, `/invite/$slug/$guestId`, analytics
event tracking hook.

Constraints: `?g=` search param must be **optional** in the route validator;
invalid guest ids fall back to a generic render, never an error page.

---

## Phase 6 — Guest Intro Gating

**Goal:** The personalized welcome is the emotional centrepiece — it must be
deterministic.

Deliverables: per-(document, guest) hydration gate that resets `currentIndex`,
`opened`, `audioPlaying`, `scrolling`; navigation locked until the user taps
"Open Invitation"; guest delivered via React context so sections see it on first
paint; `/invite/$slug` reduced to a pure layout so the `$guestId` child actually
renders.

Constraints: no store singleton leakage across route swaps; no SSR/hydration
flicker of the guest name.

---

## Phase 7 — Invitation Studio (No-Code Builder)

**Goal:** Editing without touching the runtime renderer.

Deliverables: `builder/schemas.ts`, `builder/validation.ts`, `builder/presets.ts`,
`builderStore` (draft + dirty state + undo-friendly shallow updates),
`BuilderStudio`, `EditorPanel`, `PreviewPanel` (same renderer), `SectionManager`,
`SectionSettingsForm`, `FieldRenderer`, `ThemePanel`, `TemplateSwitcher`,
`PresetGallery`, `MetaEditor`, `SaveBar`, `builderService` persistence,
routes `/builder/` and `/builder/$invitationId`.

Constraints: presets patch the draft (shallow merge on meta + theme) — they never
replace section data. No deep cloning on every keystroke.

---

## Phase 8 — Backend Persistence

**Goal:** Real data behind the same service interfaces.

Deliverables: tables for invitations, guests, rsvps, analytics_events, drafts,
media; RLS enabled with explicit GRANTs per table; service bodies swapped to
database calls; publishing workflow (`status`, `published_at`); media storage
bucket; idempotent seeding bridge for legacy slugs; realtime-ready schema.

Constraints: UI components never import the database client; every schema change
ships as a migration; RLS policies and grants are written in the same migration
as the table.
