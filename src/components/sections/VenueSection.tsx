import { motion } from "framer-motion";
import { MapPin, Phone, Navigation } from "lucide-react";
import type { SectionComponentProps } from "@/types/invitation";
import {
  DisplayTitle,
  Eyebrow,
  Body,
  Divider,
  SectionStack,
  Meta,
  Label,
} from "@/components/ui/typography";

interface VenueData {
  eyebrow?: string;
  title?: string;
  name?: string;
  address?: string;
  date?: string;
  time?: string;
  notes?: string;
  image?: string;
  mapUrl?: string;
  phone?: string;
}

export function VenueSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as VenueData;

  return (
    <SectionStack className="py-10">
      <Eyebrow>{data.eyebrow || "Venue"}</Eyebrow>
      <DisplayTitle>{data.title || data.name || "The Celebration"}</DisplayTitle>
      <Divider glyph="◆" />

      <div
        className="w-full overflow-hidden rounded-3xl border border-amber-100/15
                   bg-gradient-to-b from-white/[0.06] to-white/[0.02]
                   backdrop-blur-md shadow-[0_18px_50px_-28px_rgba(0,0,0,0.8)]"
      >
        {data.image ? (
          <div className="relative h-48 w-full overflow-hidden sm:h-56">
            <img
              src={data.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
        ) : null}
        <div className="flex flex-col gap-3 p-5 text-left">
          {data.name ? (
            <h3
              className="text-2xl font-light text-amber-50"
              style={{ fontFamily: "'Cormorant Garamond',serif" }}
            >
              {data.name}
            </h3>
          ) : null}
          {data.address ? (
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-1 shrink-0 text-amber-200/80" />
              <Body className="text-left">{data.address}</Body>
            </div>
          ) : null}
          {(data.date || data.time) ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {data.date ? <Meta>{data.date}</Meta> : null}
              {data.time ? <Meta className="text-amber-100/55">· {data.time}</Meta> : null}
            </div>
          ) : null}
          {data.notes ? <Label className="normal-case tracking-[0.05em] text-white/65">{data.notes}</Label> : null}
        </div>
      </div>

      <div className="mt-2 flex w-full gap-3">
        {data.mapUrl ? (
          <motion.a
            href={data.mapUrl}
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.97 }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full
                       border border-amber-100/30 bg-gradient-to-b from-white/15 to-white/[0.04]
                       px-5 py-3 text-[12px] uppercase tracking-[0.25em] text-amber-50
                       shadow-[0_0_24px_rgba(255,210,140,0.18),inset_0_1px_0_rgba(255,255,255,0.2)]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <Navigation size={14} /> Directions
          </motion.a>
        ) : null}
        {data.phone ? (
          <motion.a
            href={`tel:${data.phone}`}
            whileTap={{ scale: 0.97 }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full
                       border border-white/15 bg-white/[0.04]
                       px-5 py-3 text-[12px] uppercase tracking-[0.25em] text-white/85"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <Phone size={14} /> Call
          </motion.a>
        ) : null}
      </div>
    </SectionStack>
  );
}
