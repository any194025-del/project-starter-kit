import { motion } from "framer-motion";
import type { SectionComponentProps } from "@/types/invitation";
import {
  DisplayTitle,
  Eyebrow,
  Body,
  Divider,
  SectionStack,
  FamilyName,
  Meta,
  Label,
} from "@/components/ui/typography";
import {
  staggerCardsVariants,
  staggerItemVariants,
} from "@/animations/presets";

interface EventItem {
  title?: string;
  date?: string;
  time?: string;
  place?: string;
  notes?: string;
  image?: string;
}
interface EventsData {
  eyebrow?: string;
  title?: string;
  description?: string;
  events?: EventItem[];
}

export function EventsSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as EventsData;
  const events = data.events ?? [];

  return (
    <SectionStack className="py-10">
      {/* Sticky-ish heading: stays at top, content scrolls beneath */}
      <div className="sticky top-0 z-10 -mt-8 w-full bg-gradient-to-b from-black/80 via-black/40 to-transparent px-2 pb-3 pt-8 backdrop-blur-sm">
        <Eyebrow>{data.eyebrow || "Celebrations"}</Eyebrow>
        <DisplayTitle className="mt-1">{data.title || "Wedding Events"}</DisplayTitle>
      </div>

      <Divider glyph="✦" />
      {data.description ? <Body className="max-w-[32ch]">{data.description}</Body> : null}

      {events.length > 0 ? (
        <motion.ol
          variants={staggerCardsVariants}
          initial="initial"
          animate="animate"
          className="mt-2 flex w-full flex-col gap-4 text-left"
        >
          {events.map((e, i) => (
            <motion.li
              key={i}
              variants={staggerItemVariants}
              className="relative flex gap-3"
            >
              {/* Timeline rail */}
              <div className="flex flex-col items-center pt-1.5">
                <span className="block h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_12px_rgba(255,210,140,0.6)]" />
                {i < events.length - 1 ? (
                  <span className="mt-1 w-px flex-1 bg-gradient-to-b from-amber-200/40 to-transparent" />
                ) : null}
              </div>

              {/* Card */}
              <div
                className="flex-1 overflow-hidden rounded-2xl border border-amber-100/15
                           bg-gradient-to-b from-white/[0.06] to-white/[0.02]
                           backdrop-blur-md
                           shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)]"
              >
                {e.image ? (
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={e.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  </div>
                ) : null}
                <div className="flex flex-col gap-1.5 p-4">
                  <FamilyName>{e.title || "Event"}</FamilyName>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {e.date ? <Meta>{e.date}</Meta> : null}
                    {e.time ? <Meta className="text-amber-100/55">· {e.time}</Meta> : null}
                  </div>
                  {e.place ? (
                    <Label className="mt-0.5 normal-case tracking-[0.05em] text-white/70">
                      {e.place}
                    </Label>
                  ) : null}
                  {e.notes ? <Body className="mt-1 text-left">{e.notes}</Body> : null}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      ) : (
        <Body className="opacity-60">Events will be announced soon.</Body>
      )}
    </SectionStack>
  );
}
