import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInvitationStore } from "@/context/invitationStore";

export function SectionNavButtons() {
  const { currentIndex, totalSections, opened, next, prev } = useInvitationStore();
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < totalSections - 1;

  if (!opened) return null;

  const base =
    "pointer-events-auto absolute top-1/2 -translate-y-1/2 z-30 " +
    "flex h-11 w-11 items-center justify-center rounded-full " +
    "bg-white/10 backdrop-blur-xl text-white " +
    "border border-white/20 transition-colors " +
    "hover:bg-white/20 " +
    "shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_18px_rgba(255,220,180,0.12)] " +
    "disabled:opacity-25 disabled:cursor-not-allowed";

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <motion.button
        type="button"
        aria-label="Previous section"
        onClick={prev}
        disabled={!canPrev}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={base + " left-3"}
        style={{ willChange: "transform, opacity" }}
      >
        {canPrev ? <PulseRing /> : null}
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      <motion.button
        type="button"
        aria-label="Next section"
        onClick={next}
        disabled={!canNext}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={base + " right-3"}
        style={{ willChange: "transform, opacity" }}
      >
        {canNext ? <PulseRing /> : null}
        <ChevronRight className="h-5 w-5" />
      </motion.button>

      {/* Section dots */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {Array.from({ length: totalSections }).map((_, i) => (
          <span
            key={i}
            className={
              "h-1 rounded-full transition-all duration-500 " +
              (i === currentIndex
                ? "w-5 bg-amber-100/80"
                : "w-1.5 bg-white/30")
            }
          />
        ))}
      </div>
    </div>
  );
}

function PulseRing() {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 rounded-full border border-white/30"
      animate={{ scale: [1, 1.2, 1], opacity: [0.55, 0, 0.55] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
    />
  );
}
