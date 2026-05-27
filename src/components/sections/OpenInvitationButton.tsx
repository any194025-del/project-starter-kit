import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  label?: string;
  loadingLabel?: string;
  onOpen: () => Promise<void> | void;
}

/**
 * Premium mobile-first CTA.
 * - Soft glow + slow pulse halo
 * - Tactile press feedback
 * - Async loading state with animated dots
 */
export function OpenInvitationButton({
  label = "Open Invitation",
  loadingLabel = "Opening",
  onOpen,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onOpen();
    } finally {
      // leave loading true — the section will unmount on transition
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Slow ambient halo */}
      <motion.span
        aria-hidden
        className="absolute h-44 w-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,210,140,0.35) 0%, rgba(255,210,140,0) 70%)",
          filter: "blur(8px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Pulse ring */}
      <motion.span
        aria-hidden
        className="absolute h-32 w-32 rounded-full border border-amber-200/40"
        animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />

      <motion.button
        type="button"
        onClick={handleClick}
        disabled={loading}
        whileTap={{ scale: 0.96 }}
        className="relative z-10 select-none rounded-full
                   px-8 py-3.5 text-[13px] font-light tracking-[0.35em] uppercase
                   text-amber-50
                   bg-gradient-to-b from-white/15 to-white/5
                   border border-amber-100/40
                   backdrop-blur-md
                   shadow-[0_0_30px_rgba(255,210,140,0.25),inset_0_1px_0_rgba(255,255,255,0.25)]
                   transition-shadow
                   hover:shadow-[0_0_45px_rgba(255,210,140,0.45),inset_0_1px_0_rgba(255,255,255,0.3)]
                   disabled:opacity-90"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span className="inline-flex items-center gap-2">
          {loading ? (
            <>
              <span>{loadingLabel}</span>
              <LoadingDots />
            </>
          ) : (
            <span>{label}</span>
          )}
        </span>
      </motion.button>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1 w-1 rounded-full bg-amber-100"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18,
          }}
        />
      ))}
    </span>
  );
}
