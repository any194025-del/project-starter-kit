## Goal

Create a `.md/` folder at the project root holding reusable **prompt files** — copy-paste instructions that recreate this cinematic wedding invitation platform's exact structure end to end, phase by phase.

## Files to create

```text
.md/
  00-MASTER-PROMPT.md      full end-to-end build prompt (single shot)
  01-architecture.md       structure reference: folders, layers, contracts
  02-phase-prompts.md      phase 1-8 prompts in order
  03-conventions.md        rules to never break (do / do-not list)
```

### 00-MASTER-PROMPT.md
One self-contained prompt describing the whole product: JSON-driven invitation document, template registry as configs (never duplicated apps), section registry with dynamic rendering, theme engine (tokens/typography/motion/layout/backgrounds), personalization token layer, service layer, no-code builder studio, and cloud backend. Written so it can be pasted into a fresh project.

### 01-architecture.md
Directory map with one-line purpose per folder (`src/templates`, `src/renderer`, `src/builder`, `src/components/sections`, `src/services`, `src/context`, `src/types`, `src/routes`) plus the key contracts: `TemplateConfig`, `InvitationDocument`, `SectionSchema`, section-component props, route shapes (`/invite/$slug`, `/invite/$slug/$guestId`, `/builder/$invitationId`).

### 02-phase-prompts.md
The eight phase prompts in build order: 1 foundation/types, 2 sections+renderer, 3 theme/template engine, 4 mobile polish & gestures, 5 personalization + services, 6 guest intro/splash gating, 7 builder studio, 8 backend persistence. Each phase lists goal, deliverables, and "must remain intact" constraints.

### 03-conventions.md
Non-negotiables distilled from the current codebase: no hardcoded section rendering, no per-template personalization logic, no hardcoded colors in components (semantic tokens only), services stay swappable, registry is the only place that knows concrete templates, `{{token}}` interpolation is the single personalization path.

## Technical notes

- Documentation only — no source files, routes, dependencies, or database changes.
- Content derived from the existing code (registry, schemas, template types, renderer) so the prompts match reality rather than describing an idealized system.
