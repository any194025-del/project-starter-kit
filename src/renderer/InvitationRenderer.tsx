import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { extractSections } from "./loadInvitation";
import { resolveSectionComponent } from "./sectionRegistry";
import { buildTokens, personalizeData } from "./personalize";
import type { InvitationDocument, InvitationSection } from "@/types/invitation";
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

interface Props {
  /** Already-resolved invitation document (from a route loader / service). */
  document: InvitationDocument;
  /** Optional resolved guest. Personalisation gracefully degrades when absent. */
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

/**
 * Pure renderer — consumes resolved data, does not fetch.
 * Route loaders (or external orchestration) call the service layer and pass
 * results in via props. The store is hydrated from props so deep components
 * can use `usePersonalization()` and `useAnalytics()` without prop drilling.
 */
export function InvitationRenderer({ document, guest = null }: Props) {
  const setTotal = useInvitationStore((s) => s.setTotal);
  const setInvitation = useInvitationStore((s) => s.setInvitation);
  const setGuest = useInvitationStore((s) => s.setGuest);
  const setAccessState = useInvitationStore((s) => s.setAccessState);
  const currentIndex = useInvitationStore((s) => s.currentIndex);
  const opened = useInvitationStore((s) => s.opened);

  const rootRef = useRef<HTMLDivElement | null>(null);
  useSwipeNavigation(rootRef);
  const { track } = useAnalytics();

  // Hydrate global store from props.
  useEffect(() => {
    setInvitation(document);
    setGuest(guest);
    setAccessState("ready");
  }, [document, guest, setInvitation, setGuest, setAccessState]);

  const sections: InvitationSection[] = useMemo(
    () => extractSections(document),
    [document],
  );

  // Renderer-driven personalization: interpolate `{{token}}` placeholders
  // in every section's data, once per (document, guest) pair. Sections
  // remain template-agnostic — they just render their data.
  const personalisedSections = useMemo<InvitationSection[]>(() => {
    const tokens = buildTokens(document, guest);
    return sections.map((s) => ({ ...s, data: personalizeData(s.data, tokens) }));
  }, [sections, document, guest]);

  useEffect(() => {
    setTotal(sections.length);
  }, [sections.length, setTotal]);

  // Section-view analytics
  useEffect(() => {
    if (!opened) return;
    const s = sections[currentIndex];
    if (s) track("section_viewed", { type: s.type, index: currentIndex });
  }, [opened, currentIndex, sections, track]);

  // Fire opened event once
  useEffect(() => {
    if (opened) track("invitation_opened");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  // Progressive preload: current + neighbours
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
  const SectionComponent = active ? resolveSectionComponent(active.type) : null;

  return (
    <AudioProvider src={document.meta.audioUrl || undefined}>
      <div
        ref={rootRef}
        className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden bg-black select-none"
        style={{ touchAction: "pan-y" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {active && SectionComponent ? (
            <PageTransition
              key={active.key}
              preset={active.transition ?? "cinematicFade"}
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
