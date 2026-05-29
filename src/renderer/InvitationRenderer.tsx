import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { extractSections } from "./loadInvitation";
import { resolveSectionFor } from "./sectionOverrides";
import { buildTokens, personalizeData } from "./personalize";
import type {
  InvitationDocument,
  InvitationSection,
  BackgroundConfig,
} from "@/types/invitation";
import type { Guest } from "@/types/guest";
import { useInvitationStore } from "@/context/invitationStore";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageTransition } from "@/components/layout/PageTransition";
import { SectionNavButtons } from "@/components/navigation/SectionNavButtons";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { MusicButton } from "@/components/audio/MusicButton";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { RsvpButton } from "@/components/rsvp/RsvpButton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { PersonalizationProvider } from "@/hooks/usePersonalization";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";
import { getTemplate } from "@/templates/registry";

interface Props {
  document: InvitationDocument;
  guest?: Guest | null;
}

function collectSectionImages(section: InvitationSection | undefined): string[] {
  if (!section) return [];
  const urls: string[] = [];
  const bg = section.background;
  if (bg?.mobile) urls.push(bg.mobile);
  if (bg?.desktop) urls.push(bg.desktop);
  if (bg?.videoPoster) urls.push(bg.videoPoster);
  const d = section.data as Record<string, unknown> | undefined;
  if (d) {
    if (typeof d.thumbnail === "string") urls.push(d.thumbnail);
    if (Array.isArray(d.images)) {
      for (const im of d.images as Array<{ src?: string }>) {
        if (im && typeof im.src === "string") urls.push(im.src);
      }
    }
  }
  return urls;
}

function preloadImages(urls: string[]) {
  for (const u of urls) {
    if (!u) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = u;
  }
}

function mergeBackground(
  base: BackgroundConfig | undefined,
  per: BackgroundConfig | undefined,
  section: BackgroundConfig | undefined,
): BackgroundConfig | undefined {
  if (!base && !per && !section) return undefined;
  return { ...(base ?? {}), ...(per ?? {}), ...(section ?? {}) };
}

/**
 * Pure renderer. Hydrates the store SYNCHRONOUSLY (during render, guarded by
 * a ref) so deep components like SplashSection's `usePersonalization()` read
 * the resolved guest on first paint — fixes the Phase 5 hydration flicker.
 */
export function InvitationRenderer({ document, guest = null }: Props) {
  // --- Synchronous store hydration (before children render) ---
  const hydratedFor = useRef<string | null>(null);
  const key = `${document.id}:${guest?.id ?? "anon"}`;
  if (hydratedFor.current !== key) {
    hydratedFor.current = key;
    const store = useInvitationStore.getState();
    store.setInvitation(document);
    store.setGuest(guest);
    store.setAccessState("ready");
    store.setActiveTemplateId(document.templateId);
    store.setThemeOverrides(null); // reset per-invitation customisation
    // CRITICAL: zustand store is a global singleton. Across route swaps
    // (e.g. /invite/$slug -> /invite/$slug/$guestId) the renderer remounts
    // but `opened` / `currentIndex` would otherwise persist from the
    // previous visit and cause the cinematic splash to be skipped on first
    // paint. Reset playback state deterministically so the intro always
    // plays first for the (document, guest) pair.
    useInvitationStore.setState({
      currentIndex: 0,
      opened: false,
      audioPlaying: false,
      scrolling: false,
    });
  }

  return (
    <ThemeProvider templateId={document.templateId}>
      <PersonalizationProvider guest={guest}>
        <RendererBody document={document} guest={guest} />
      </PersonalizationProvider>
    </ThemeProvider>
  );
}

function RendererBody({ document, guest }: Props) {
  const setTotal = useInvitationStore((s) => s.setTotal);
  const currentIndex = useInvitationStore((s) => s.currentIndex);
  const opened = useInvitationStore((s) => s.opened);
  const activeTemplateId = useInvitationStore((s) => s.activeTemplateId);

  const rootRef = useRef<HTMLDivElement | null>(null);
  useSwipeNavigation(rootRef);
  const { track } = useAnalytics();

  const theme = useTheme();
  const template = useMemo(
    () => getTemplate(activeTemplateId ?? document.templateId),
    [activeTemplateId, document.templateId],
  );

  const sections: InvitationSection[] = useMemo(
    () => extractSections(document),
    [document],
  );

  const personalisedSections = useMemo<InvitationSection[]>(() => {
    const tokens = buildTokens(document, guest ?? null);
    return sections.map((s) => {
      const motionPerType = theme.motion.perType?.[s.type];
      const bgPerType = theme.backgrounds.perType?.[s.type];
      return {
        ...s,
        data: personalizeData(s.data, tokens),
        transition: s.transition ?? motionPerType ?? theme.motion.defaultTransition,
        background: mergeBackground(theme.backgrounds.base, bgPerType, s.background),
      };
    });
  }, [sections, document, guest, theme]);

  useEffect(() => {
    setTotal(sections.length);
  }, [sections.length, setTotal]);

  useEffect(() => {
    if (!opened) return;
    const s = sections[currentIndex];
    if (s) track("section_viewed", { type: s.type, index: currentIndex });
  }, [opened, currentIndex, sections, track]);

  useEffect(() => {
    if (opened) track("invitation_opened");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  useEffect(() => {
    if (sections.length === 0) return;
    const targets = [
      sections[currentIndex],
      sections[currentIndex + 1],
      sections[currentIndex - 1],
    ];
    preloadImages(targets.flatMap(collectSectionImages));
  }, [sections, currentIndex]);

  const safeIndex = Math.min(currentIndex, personalisedSections.length - 1);
  const active = personalisedSections[safeIndex];
  const SectionComponent = active ? resolveSectionFor(template, active.type) : null;

  return (
    <AudioProvider src={document.meta.audioUrl || undefined}>
      <div
        ref={rootRef}
        className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden select-none"
        style={{
          touchAction: "pan-y",
          background: "var(--inv-bg)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {active && SectionComponent ? (
            <PageTransition
              key={active.key}
              preset={active.transition ?? theme.motion.defaultTransition}
              className="absolute inset-0"
            >
              <SectionContainer background={active.background}>
                <SectionComponent
                  section={active}
                  index={safeIndex}
                  total={personalisedSections.length}
                  isActive
                />
              </SectionContainer>
            </PageTransition>
          ) : null}
        </AnimatePresence>

        <SectionNavButtons />
        <MusicButton />
        <RsvpButton />
      </div>
    </AudioProvider>
  );
}
