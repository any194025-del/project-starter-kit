import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause } from "lucide-react";
import { useAudio } from "./AudioProvider";
import { useInvitationStore } from "@/context/invitationStore";

export function MusicButton() {
  const { toggle } = useAudio();
  const playing = useInvitationStore((s) => s.audioPlaying);
  const opened = useInvitationStore((s) => s.opened);

  if (!opened) return null;

  return (
    <motion.button
      type="button"
      aria-label={playing ? "Pause music" : "Play music"}
      onClick={() => void toggle()}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 z-40 h-11 w-11 rounded-full
                 bg-white/10 backdrop-blur-xl border border-white/20
                 text-white flex items-center justify-center
                 hover:bg-white/20 transition-colors
                 shadow-[0_4_24px_rgba(0,0,0,0.35),0_0_18px_rgba(255,220,180,0.15)]"
      style={{ willChange: "transform, opacity" }}
    >
      {/* Soft pulsing ring while playing */}
      {playing ? (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-amber-100/40"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={playing ? "pause" : "play"}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Music className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
