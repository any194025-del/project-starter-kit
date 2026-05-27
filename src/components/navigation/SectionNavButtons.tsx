import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInvitationStore } from "@/context/invitationStore";

/**
 * Floating section navigation. Phase 4:
 *  - Thumb-friendly: arrows live in the lower third on mobile.
 *  - Adaptive visibility: fade out while the user is actively scrolling
 *    a section, fade back in once they pause.
 *  - Section dots reflect current position and remain pinned to the bottom.
 *  - Press feedback emulates a haptic tap.
 */
export function SectionNavButtons() {
  const { currentIndex, totalSections, opened, next, prev, scrolling } =
    useInvitationStore();
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < totalSections - 1;

  if (!opened) return null;

  const tap = () => {
    if ("vibrate" in navigator) navigator.vibrate?.(6);
  };

  const base =
    "pointer-events-auto absolute z-30 " +
    "flex h-12 w-12 items-center justify-center rounded-full " +
    "bg-white/10 backdrop-blur-2xl text-amber-50 " +
    "border border-white/15 transition-colors " +
    "hover:bg-white/20 active:bg-white/25 " +
    "shadow-[0_8px_28px_rgba(0,0,0,0.45),0_0_22px_rgba(255,220,180,0.10)] " +
    "disabled:opacity-0 disabled:pointer-events-none";

  // Position arrows in the lower-middle for thumb reach on mobile.
  const arrowPos = "bottom-20 md:top-1/2 md:bottom-auto md:-translate-y-1/2";

  const dim = scrolling ? 0 : 1;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <AnimatePresence>
        {canPrev && (
          <motion.button
            key="prev"
            type="button"
            aria-label="Previous section"
            onClick={() => {
              tap();
              prev();
            }}
            whileTap={{ scale: 0.88 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: dim, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={base + " " + arrowPos + " left-4"}
            style={{ willChange: "transform, opacity" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        )}

        {canNext && (
          <motion.button
            key="next"
            type="button"
            aria-label="Next section"
            onClick={() => {
              tap();
              next();
            }}
            whileTap={{ scale: 0.88 }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: dim, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={base + " " + arrowPos + " right-4"}
            style={{ willChange: "transform, opacity" }}
          >
            <PulseRing />
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Section progress dots */}
      <motion.div
        animate={{ opacity: scrolling ? 0.25 : 1 }}
        transition={{ duration: 0.35 }}
        className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5"
      >
        {Array.from({ length: totalSections }).map((_, i) => (
          <span
            key={i}
            className={
              "h-1 rounded-full transition-all duration-500 " +
              (i === currentIndex
                ? "w-6 bg-amber-100/85"
                : "w-1.5 bg-white/25")
            }
          />
        ))}
      </motion.div>
    </div>
  );
}

function PulseRing() {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 rounded-full border border-amber-100/30"
      animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
    />
  );
}
