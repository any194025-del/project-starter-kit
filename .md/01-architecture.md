# Architecture Reference

## Directory map

```text
src/
  animations/        motion presets shared by every section and transition
  builder/           schemas.ts (section field schemas), validation.ts, presets.ts
  components/
    audio/           AudioProvider + MusicButton (single global audio source)
    backgrounds/     BackgroundLayer — persistent, crossfading background engine
    builder/         Studio UI: EditorPanel, PreviewPanel, SectionManager,
                     ThemePanel, TemplateSwitcher, PresetGallery, SaveBar,
                     SectionSettingsForm, FieldRenderer, MetaEditor
    invitation/      InvitationFallback (not-found / error states)
    layout/          SectionContainer, PageTransition, Preloader
    navigation/      SectionNavButtons
    rsvp/            RsvpButton
    sections/        one component per section type (splash, countdown, ...)
    ui/              shadcn primitives + ProgressiveImage
  context/           invitationStore (zustand runtime), builderStore (draft)
  data/              invitation.json + data/mock/* seeds
  hooks/             usePersonalization, useSwipeNavigation, useScrollIdle,
                     useAnalytics, use-mobile
  integrations/      generated backend clients (never hand-edited)
  lib/               utils, db-seed, error helpers
  renderer/          InvitationRenderer, sectionRegistry, sectionOverrides,
                     loadInvitation, personalize
  routes/            TanStack file routes
  services/          invitationService, guestService, rsvpService,
                     analyticsService, builderService
  templates/         _defaults.ts + one folder per template + registry.ts
  theme/             ThemeProvider, resolveTheme
  types/             invitation.ts, template.ts, editor.ts, guest.ts
```

## Key contracts

### InvitationDocument (`src/types/invitation.ts`)

```ts
interface InvitationDocument {
  id: string;
  slug: string;
  templateId: string;
  meta: InvitationMeta;              // couple names, date, music, seo
  pages: Record<string, SectionNode>; // keyed sections
  order: string[];                    // render order
  overrides?: RuntimeOverrides;       // per-invitation theme customisation
}

interface SectionNode {
  type: string;                       // registry key
  data: Record<string, unknown>;      // schema-described content
  hidden?: boolean;
  background?: BackgroundConfig;
  transition?: TransitionPreset;
  layout?: LayoutVariant;
}
```

### SectionComponentProps

Every section receives the same props — content data, resolved theme, index,
active state, and navigation callbacks. Sections never read the store directly
for guest data; they read the personalization context.

### TemplateConfig (`src/types/template.ts`)

```ts
{ meta, tokens, typography, motion, layout, backgrounds, overrides? }
```

`meta.supportedSections` declares which section types the template renders.
`RuntimeOverrides` shallow-merges over `tokens / typography / motion / layout`.

### SectionSchema (`src/types/editor.ts`)

```ts
{ type, label, description?, removable?, fields: FieldSchema[] }
```

Field types: `text | textarea | image | url | datetime | select | list`.
`list` fields declare `defaultItem` + `itemFields` for nested editing.

### Routes

| Route | Purpose |
| --- | --- |
| `/` | landing |
| `/invite/$slug` | pure layout (`<Outlet />`), optional `?g=` search param |
| `/invite/$slug/` | generic preview + "Preview as Guest" |
| `/invite/$slug/$guestId` | personalized render, graceful fallback on bad id |
| `/builder/` | invitation list |
| `/builder/$invitationId` | Invitation Studio |

## Data flow

```text
route loader -> invitationService -> InvitationDocument
                guestService      -> Guest | null
        -> getTemplate(templateId) -> TemplateConfig
        -> resolveTheme(config, doc.overrides) -> ResolvedTheme
        -> personalize(section.data, guestTokens)
        -> sectionRegistry[type] rendered inside SectionContainer
```

The builder uses the identical pipeline against the draft document, so preview
and production output can never diverge.
