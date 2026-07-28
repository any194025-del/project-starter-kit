# Master Prompt — Cinematic Wedding Invitation Platform (End-to-End)

Paste this into a fresh project to recreate the same structure end to end.

---

## Prompt

Build a **cinematic, mobile-first, JSON-driven wedding invitation platform** on
TanStack Start (React 19 + Vite + Tailwind v4). It must be a **template engine +
no-code builder + personalization layer**, not a collection of static pages.

### Non-negotiable architecture

1. **JSON-driven document.** A single `InvitationDocument` (id, slug, templateId,
   meta, pages, order) describes an entire invitation. Nothing about a specific
   wedding is hardcoded in components.
2. **Section registry.** `src/renderer/sectionRegistry.ts` maps `section.type ->
   React component`. The renderer looks components up dynamically. Never write
   `if (type === "gallery")` in the renderer, never turn sections into routes.
3. **Template registry.** `src/templates/registry.ts` is the only file that knows
   concrete templates. A template is a **config**, never a duplicated app:
   `{ meta, tokens, typography, motion, layout, backgrounds, overrides? }`.
   Optional per-template section overrides plug into the same registry.
4. **Theme engine.** `resolveTheme(template, runtimeOverrides)` merges template
   config with runtime overrides and exposes it through a `ThemeProvider`.
   Components read tokens — never hardcoded hex or `text-white`.
5. **Personalization by token interpolation.** A single `personalize.ts` walks
   section data and replaces `{{displayName}}`, `{{salutation}}`, `{{family}}`,
   `{{coupleNames}}` etc. from the resolved guest. No per-template and no
   per-section personalization code.
6. **Service layer.** All data access goes through `src/services/*` returning
   Promises, so mock data and a real backend are interchangeable.
7. **Schema-driven builder.** `src/builder/schemas.ts` declares what fields each
   section type exposes; the editor renders forms from those schemas and
   validates with `src/builder/validation.ts`. Adding a section type must not
   require editing the editor UI.

### Feature scope

- **Sections:** splash, countdown, gallery, video, events, venue, guests, wishes,
  note, thanks. Each is a self-contained component receiving shared props.
- **Cinematic shell:** full-screen section snapping, swipe + keyboard navigation,
  shared motion presets, persistent background engine with crossfade, shared
  audio provider with a floating music button, preloader.
- **Mobile polish:** progressive image loading (IntersectionObserver + shimmer +
  no CLS), adjacent-section preloading, `prefers-reduced-motion` support,
  gesture stability, no layout thrash.
- **Routes:**
  - `/` landing
  - `/invite/$slug` layout, `/invite/$slug/` generic preview (+ `?g=` optional
    guest query, validated as optional)
  - `/invite/$slug/$guestId` personalized invitation
  - `/builder/` and `/builder/$invitationId` studio
- **Guest intro gating:** the splash is the first, deterministic screen. Reset
  playback state (`currentIndex`, `opened`, `audioPlaying`) per document+guest so
  route swaps never skip the personalized welcome. Guest flows through React
  context so sections see it on first paint — no hydration flicker.
- **Builder studio:** live preview using the *same* renderer, section manager
  (reorder / hide / duplicate / add / remove), theme panel, template switcher,
  preset gallery, validation, dirty-state save bar, draft persistence.
- **Backend (Lovable Cloud):** invitations, guests, RSVPs, analytics events,
  drafts, media. RLS enabled with GRANTs on every public table. Services swap
  their internals only; UI never imports the database client directly.

### Explicit prohibitions

- No hardcoded guest names, couple names, dates or images in components.
- No template-specific personalization or rendering branches.
- No second rendering system for the builder preview.
- No bypassing the service layer from UI components.
- No React Router; TanStack Router only.
