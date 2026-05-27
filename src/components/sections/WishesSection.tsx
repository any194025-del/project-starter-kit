import { motion } from "framer-motion";
import type { SectionComponentProps } from "@/types/invitation";
import {
  DisplayTitle,
  Eyebrow,
  Divider,
  SectionStack,
  WishText,
  Meta,
} from "@/components/ui/typography";
import {
  staggerCardsVariants,
  staggerItemVariants,
} from "@/animations/presets";

interface Wish {
  from?: string;
  relation?: string;
  category?: string;
  message?: string;
}
interface WishesData {
  eyebrow?: string;
  title?: string;
  messages?: Wish[];
}

const CATEGORY_TINT: Record<string, string> = {
  blessing: "from-amber-300/15 to-amber-200/[0.03]",
  family: "from-rose-300/15 to-rose-200/[0.03]",
  friend: "from-sky-300/15 to-sky-200/[0.03]",
  default: "from-white/[0.08] to-white/[0.02]",
};

export function WishesSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as WishesData;
  const wishes = data.messages ?? [];

  return (
    <SectionStack className="py-10">
      <Eyebrow>{data.eyebrow || "From Loved Ones"}</Eyebrow>
      <DisplayTitle>{data.title || "Wishes & Blessings"}</DisplayTitle>
      <Divider glyph="❀" />

      {wishes.length > 0 ? (
        <motion.div
          variants={staggerCardsVariants}
          initial="initial"
          animate="animate"
          className="mt-2 flex w-full flex-col gap-3"
        >
          {wishes.map((w, i) => {
            const tint =
              CATEGORY_TINT[w.category?.toLowerCase() ?? ""] ?? CATEGORY_TINT.default;
            return (
              <motion.figure
                key={i}
                variants={staggerItemVariants}
                className={
                  "relative overflow-hidden rounded-2xl border border-amber-100/15 " +
                  "bg-gradient-to-b backdrop-blur-md text-left p-5 " +
                  "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)] " +
                  tint
                }
              >
                <span
                  aria-hidden
                  className="absolute -top-3 left-4 text-5xl text-amber-200/30 select-none"
                  style={{ fontFamily: "'Cormorant Garamond',serif" }}
                >
                  “
                </span>
                {w.message ? <WishText>{w.message}</WishText> : null}
                {w.from || w.relation ? (
                  <figcaption className="mt-3 flex items-baseline gap-2">
                    <span
                      className="text-amber-100/90 text-sm tracking-[0.05em]"
                      style={{ fontFamily: "'Cormorant Garamond',serif" }}
                    >
                      — {w.from}
                    </span>
                    {w.relation ? (
                      <Meta className="text-amber-100/55">{w.relation}</Meta>
                    ) : null}
                  </figcaption>
                ) : null}
              </motion.figure>
            );
          })}
        </motion.div>
      ) : null}
    </SectionStack>
  );
}
