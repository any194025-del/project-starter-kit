import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { SectionComponentProps } from "@/types/invitation";
import {
  DisplayTitle,
  Eyebrow,
  Body,
  Divider,
  SectionStack,
  Meta,
} from "@/components/ui/typography";
import {
  staggerCardsVariants,
  staggerItemVariants,
} from "@/animations/presets";

interface CountdownData {
  targetDate?: string; // ISO
  weddingDateISO?: string;
  weddingDateText?: string;
  weddingTimeText?: string;
  label?: string;
  title?: string;
  eyebrow?: string;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: number): TimeParts {
  const ms = Math.max(0, target - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function CountdownSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as CountdownData;
  const iso = data.targetDate || data.weddingDateISO;
  const target = iso ? new Date(iso).getTime() : NaN;
  const [parts, setParts] = useState<TimeParts>(() =>
    isNaN(target) ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : diff(target),
  );

  useEffect(() => {
    if (isNaN(target)) return;
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: parts.days },
    { label: "Hours", value: parts.hours },
    { label: "Minutes", value: parts.minutes },
    { label: "Seconds", value: parts.seconds },
  ];

  return (
    <SectionStack className="my-auto py-10">
      <Eyebrow>{data.eyebrow || "Save the date"}</Eyebrow>
      <DisplayTitle>{data.title || data.label || "Counting Down"}</DisplayTitle>
      <Divider glyph="❖" />
      {data.weddingDateText ? <Meta>{data.weddingDateText}</Meta> : null}
      {data.weddingTimeText ? <Meta className="-mt-3">{data.weddingTimeText}</Meta> : null}

      <motion.div
        variants={staggerCardsVariants}
        initial="initial"
        animate="animate"
        className="mt-4 grid w-full grid-cols-4 gap-2 sm:gap-3"
      >
        {units.map((u) => (
          <motion.div
            key={u.label}
            variants={staggerItemVariants}
            className="relative aspect-square overflow-hidden rounded-2xl
                       border border-amber-100/15
                       bg-gradient-to-b from-white/[0.06] to-white/[0.02]
                       backdrop-blur-md
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={u.value}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(1.5rem,7vw,2.25rem)] font-light text-amber-50 tabular-nums"
                style={{ fontFamily: "'Cormorant Garamond',serif" }}
              >
                {String(u.value).padStart(2, "0")}
              </motion.span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-amber-100/60">
                {u.label}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Body className="mt-4 max-w-[30ch]">
        Every moment brings us closer to the day our forever begins.
      </Body>
    </SectionStack>
  );
}
