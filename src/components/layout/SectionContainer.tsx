import { useEffect, useRef, type ReactNode } from "react";
import type { BackgroundConfig } from "@/types/invitation";
import { BackgroundLayer } from "@/components/backgrounds/BackgroundLayer";
import { useInvitationStore } from "@/context/invitationStore";

interface Props {
  children: ReactNode;
  background?: BackgroundConfig;
  className?: string;
}

/**
 * Reusable, mobile-first section wrapper.
 * - Full viewport height (dynamic vh for mobile browsers)
 * - Internal vertical scroll support
 * - Optional background layer
 * - Reports scroll activity to the global store so floating chrome can
 *   fade out while the user is reading.
 */
export function SectionContainer({ children, background, className }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const setScrolling = useInvitationStore((s) => s.setScrolling);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setScrolling(true);
      if (t) clearTimeout(t);
      t = setTimeout(() => setScrolling(false), 900);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (t) clearTimeout(t);
      setScrolling(false);
    };
  }, [setScrolling]);

  return (
    <section
      className="relative h-[100dvh] w-full overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      <BackgroundLayer config={background} />
      <div
        ref={scrollRef}
        className={
          "relative z-10 h-full w-full overflow-y-auto overscroll-contain " +
          "px-5 py-8 pb-24 flex flex-col scroll-smooth " +
          (className ?? "")
        }
        style={{
          WebkitOverflowScrolling: "touch",
          // hint browser to keep this layer composited during inertial scroll
          willChange: "scroll-position",
        }}
      >
        {children}
      </div>
    </section>
  );
}
