# Conventions — Non-Negotiables

## Rendering

- **Do** resolve section components through `sectionRegistry[type]`.
- **Do** render unknown section types with `UnknownSection`, never crash.
- **Don't** branch on section type inside the renderer, containers, or routes.
- **Don't** convert sections into routes or a second rendering pipeline.
- **Don't** give the builder its own preview renderer — reuse `InvitationRenderer`.

## Templates & theming

- `templates/registry.ts` is the **only** module that imports concrete templates.
- A template is config: tokens, typography, motion, layout, backgrounds, optional
  section overrides. Never a duplicated app or a forked section tree.
- Colors, gradients, shadows come from theme tokens / semantic CSS variables.
  Never `text-white`, `bg-black`, or `bg-[#hex]` in components.
- Runtime customization flows through `RuntimeOverrides` -> `resolveTheme`.
- Switching template must preserve content, order, and personalization.

## Personalization

- One engine: `renderer/personalize.ts` interpolating `{{token}}` in section data.
- Tokens: `guestName, displayName, salutation, honorific, family, parivar,
  greeting, coupleNames`.
- Guest reaches components through the personalization **context**, not the store.
- Missing guest or unknown token degrades to a sensible generic string.
- **Never** hardcode a guest or couple name in a component or template.
- **Never** add per-template or per-section personalization code paths.

## State

- `invitationStore` holds runtime playback state only (index, opened, audio,
  scrolling). It is a singleton — always reset it per document+guest on mount.
- `builderStore` holds the draft plus dirty flag; updates are shallow and scoped
  to the touched section.
- No large object deep-clones on every keystroke.

## Data access

- UI components call `src/services/*` only. No database client imports in
  components, sections, or route components.
- Services are async and return plain domain objects, so the storage backend can
  change without touching UI.
- Every public table ships with RLS enabled **and** explicit GRANTs in the same
  migration.

## Builder

- Adding a section type = add a schema entry + a section component. The editor UI
  must not need changes.
- Validation is schema-driven and pure (`builder/validation.ts`), no React, no
  store access.
- Presets patch meta + theme via shallow merge; they never overwrite content.

## Motion & performance

- Motion presets are shared; sections don't define bespoke easing curves.
- Respect `prefers-reduced-motion` everywhere.
- Images use `ProgressiveImage`: lazy mount, shimmer, reserved aspect ratio.
- Preload only current / next / previous sections.
- No infinite animation loops for off-screen sections.

## Routing

- TanStack Router only — never React Router or a manual page switcher.
- Search-param validators must mark optional params optional.
- Parent/layout routes always render `<Outlet />`.
- Each content route defines its own `head()` with unique title and description.
