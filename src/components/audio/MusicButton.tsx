import { motion, AnimatePresence } from "framer-motion";
import { Disc3, Pause } from "lucide-react";
import { useAudio } from "./AudioProvider";
import { useInvitationStore } from "@/context/invitationStore";

/**
 * Floating, persistent music button.
 *
 * Phase 4:
 *  - Rotating disc icon while playing (CSS keyframe — composited).
 *  - Soft pulse ring in playing state, dimmed glass shell when paused.
 *  - Light dim while the user is actively scrolling.
 *  - Never autoplays; only toggles on explicit tap.
 */
export function MusicButton() {
  const { toggle } = useAudio();
  const playing = useInvitationStore((s) => s.audioPlaying);
  const opened = useInvitationStore((s) => s.opened);
  const scrolling = useInvitationStore((s) => s.scrolling);

  if (!opened) return null;

  return (
    <motion.button
      type="button"
      data-no-swipe
      aria-label={playing ? "Pause music" : "Play music"}
      onClick={() => {
        if ("vibrate" in navigator) navigator.vibrate?.(6);
        void toggle();
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: scrolling ? 0.35 : 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 z-40 h-12 w-12 rounded-full
                 bg-white/10 backdrop-blur-2xl border border-white/15
                 text-amber-50 flex items-center justify-center
                 hover:bg-white/20 transition-colors
                 shadow-[0_8px_28px_rgba(0,0,0,0.45),0_0_22px_rgba(255,220,180,0.12)]"
      style={{ willChange: "transform, opacity" }}
    >
      {playing ? (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-amber-100/40"
          animate={{ scale: [1, 1.3, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={playing ? "playing" : "paused"}
          initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7, rotate: 30 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          {playing ? (
            <Disc3 className="h-5 w-5 lov-spin-slow" />
          ) : (
            <Pause className="h-4 w-4 opacity-80" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
