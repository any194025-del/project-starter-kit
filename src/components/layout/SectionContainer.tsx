import type { ReactNode } from "react";
import type { BackgroundConfig } from "@/types/invitation";
import { BackgroundLayer } from "@/components/backgrounds/BackgroundLayer";

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
 */
export function SectionContainer({ children, background, className }: Props) {
  return (
    <section
      className="relative h-[100dvh] w-full overflow-hidden"
      style={{ contain: "layout paint" }}
    >
      <BackgroundLayer config={background} />
      <div
        className={
          "relative z-10 h-full w-full overflow-y-auto overscroll-contain " +
          "px-5 py-8 flex flex-col " +
          (className ?? "")
        }
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
    </section>
  );
}
