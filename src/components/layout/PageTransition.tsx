import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { getVariants } from "@/animations/presets";
import type { TransitionPreset } from "@/types/invitation";

interface Props {
  preset?: TransitionPreset;
  direction?: number;
  children: ReactNode;
  className?: string;
}

export function PageTransition({ preset = "fade", direction = 1, children, className }: Props) {
  return (
    <motion.div
      custom={direction}
      variants={getVariants(preset)}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
