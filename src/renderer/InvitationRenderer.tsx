import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { loadInvitation, extractSections } from "./loadInvitation";
import { resolveSectionComponent } from "./sectionRegistry";
import type { InvitationDocument, InvitationSection } from "@/types/invitation";
import { useInvitationStore } from "@/context/invitationStore";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageTransition } from "@/components/layout/PageTransition";
import { SectionNavButtons } from "@/components/navigation/SectionNavButtons";
import { AudioProvider } from "@/components/audio/AudioProvider";
import { MusicButton } from "@/components/audio/MusicButton";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { Preloader } from "@/components/layout/Preloader";

interface Props {
  /** Optional: pass a pre-loaded document (e.g. from a Supabase loader later). */
  document?: InvitationDocument;
}

/** Collect candidate image URLs from a section's background + data shape. */
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

/** Fire-and-forget image preloads. Browser dedupes by URL via cache. */
function preloadImages(urls: string[]) {
  for (const u of urls) {
    if (!u) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = u;
  }
}

export function InvitationRenderer({ document: docProp }: Props) {
  const [doc, setDoc] = useState<InvitationDocument | null>(docProp ?? null);
  const setAssetState = useInvitationStore((s) => s.setAssetState);
  const setTotal = useInvitationStore((s) => s.setTotal);
  const currentIndex = useInvitationStore((s) => s.currentIndex);

  const rootRef = useRef<HTMLDivElement | null>(null);
  useSwipeNavigation(rootRef);

  useEffect(() => {
    if (docProp) return;
    let cancelled = false;
    setAssetState("loading");
    loadInvitation()
      .then((d) => {
        if (cancelled) return;
        setDoc(d);
        setAssetState("ready");
      })
      .catch(() => !cancelled && setAssetState("error"));
    return () => {
      cancelled = true;
    };
  }, [docProp, setAssetState]);

  const sections: InvitationSection[] = useMemo(
    () => (doc ? extractSections(doc) : []),
    [doc],
  );

  useEffect(() => {
    setTotal(sections.length);
  }, [sections.length, setTotal]);

  // Progressive preload: current + next + previous.
  useEffect(() => {
    if (sections.length === 0) return;
    const targets = [
      sections[currentIndex],
      sections[currentIndex + 1],
      sections[currentIndex - 1],
    ];
    const urls = targets.flatMap(collectSectionImages);
    preloadImages(urls);
  }, [sections, currentIndex]);

  if (!doc) {
    return <Preloader label="Preparing" />;
  }

  const safeIndex = Math.min(currentIndex, sections.length - 1);
  const active = sections[safeIndex];
  const SectionComponent = active ? resolveSectionComponent(active.type) : null;

  return (
    <AudioProvider src={doc.meta.audioUrl || undefined}>
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
                  total={sections.length}
                  isActive
                />
              </SectionContainer>
            </PageTransition>
          ) : null}
        </AnimatePresence>

        <SectionNavButtons />
        <MusicButton />
      </div>
    </AudioProvider>
  );
}
