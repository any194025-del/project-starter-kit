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
        className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden bg-black"
      >
        <AnimatePresence mode="wait" initial={false}>
          {active && SectionComponent ? (
            <PageTransition
              key={active.key}
              preset={active.transition ?? "fade"}
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
