import type { Variants, Transition } from "framer-motion";
import type { TransitionPreset } from "@/types/invitation";

// GPU-friendly: opacity + transform + filter only.
const baseTransition: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

const softEase = [0.45, 0.05, 0.25, 1] as const;

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: baseTransition },
  exit: { opacity: 0, transition: { ...baseTransition, duration: 0.3 } },
};

export const slideVariants: Variants = {
  initial: (dir: number = 1) => ({ opacity: 0, x: 40 * dir }),
  animate: { opacity: 1, x: 0, transition: baseTransition },
  exit: (dir: number = 1) => ({
    opacity: 0,
    x: -40 * dir,
    transition: { ...baseTransition, duration: 0.3 },
  }),
};

export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: baseTransition },
  exit: { opacity: 0, scale: 1.02, transition: { ...baseTransition, duration: 0.3 } },
};

export const noneVariants: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};

export const cinematicFadeVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.95, ease: softEase } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.6, ease: softEase } },
};

export const softSlideVariants: Variants = {
  initial: (dir: number = 1) => ({ opacity: 0, x: 24 * dir }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.75, ease: softEase } },
  exit: (dir: number = 1) => ({
    opacity: 0,
    x: -24 * dir,
    transition: { duration: 0.45, ease: softEase },
  }),
};

export const revealBlurVariants: Variants = {
  initial: { opacity: 0, filter: "blur(14px)" },
  animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 1, ease: softEase } },
  exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.5, ease: softEase } },
};

export const mobileSnapVariants: Variants = {
  initial: (dir: number = 1) => ({ opacity: 0, x: 28 * dir }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.42, ease: [0.32, 0.72, 0.24, 1] } },
  exit: (dir: number = 1) => ({
    opacity: 0,
    x: -16 * dir,
    transition: { duration: 0.28, ease: [0.32, 0.72, 0.24, 1] },
  }),
};

/** Soft upward fade — great for hero blocks. */
export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.85, ease: softEase } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.45, ease: softEase } },
};

/** Container that staggers its children — pair with `staggerItemVariants`. */
export const staggerCardsVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
  exit: {},
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: softEase } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.3, ease: softEase } },
};

/** Cinematic horizontal slide, longer and softer than mobileSnap. */
export const cinematicSlideVariants: Variants = {
  initial: (dir: number = 1) => ({ opacity: 0, x: 60 * dir }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.9, ease: softEase } },
  exit: (dir: number = 1) => ({
    opacity: 0,
    x: -40 * dir,
    transition: { duration: 0.55, ease: softEase },
  }),
};

/** Subtle scale-in with gentle fade. */
export const softScaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.985 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: softEase } },
  exit: { opacity: 0, scale: 1.005, transition: { duration: 0.4, ease: softEase } },
};

export function getVariants(preset: TransitionPreset = "fade"): Variants {
  switch (preset) {
    case "slide": return slideVariants;
    case "scale": return scaleVariants;
    case "none": return noneVariants;
    case "cinematicFade": return cinematicFadeVariants;
    case "softSlide": return softSlideVariants;
    case "revealBlur": return revealBlurVariants;
    case "mobileSnap": return mobileSnapVariants;
    case "fadeUp": return fadeUpVariants;
    case "staggerCards": return staggerCardsVariants;
    case "cinematicSlide": return cinematicSlideVariants;
    case "softScale": return softScaleVariants;
    case "fade":
    default: return fadeVariants;
  }
}
