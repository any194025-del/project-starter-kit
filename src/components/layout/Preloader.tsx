import { motion } from "framer-motion";

interface Props {
  label?: string;
  monogram?: string;
}

/**
 * Lightweight animated preloader shown while assets load.
 * GPU-only animations: opacity + transform.
 */
export function Preloader({ label = "Loading", monogram = "॥" }: Props) {
  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#06030d]">
      {/* Ambient halo */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 50%, rgba(255,200,140,0.10) 0%, rgba(0,0,0,0) 60%)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full
                     border border-amber-200/30
                     bg-gradient-to-b from-amber-200/10 to-transparent
                     shadow-[0_0_30px_rgba(255,200,120,0.25)]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="text-3xl text-amber-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {monogram}
          </motion.span>
        </motion.div>

        <motion.span
          className="mt-6 text-[10px] uppercase tracking-[0.5em] text-amber-100/60"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}
