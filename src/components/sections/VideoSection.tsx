import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import type { SectionComponentProps } from "@/types/invitation";
import {
  DisplayTitle,
  Eyebrow,
  Body,
  Divider,
  SectionStack,
  Meta,
} from "@/components/ui/typography";
import { useAudio } from "@/components/audio/AudioProvider";

interface VideoData {
  eyebrow?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  duration?: string;
}

function youtubeEmbed(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function VideoSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as VideoData;
  const [open, setOpen] = useState(false);
  const audio = useAudio();
  const embed = youtubeEmbed(data.youtubeUrl);

  const handleOpen = () => {
    audio.pause();
    setOpen(true);
  };

  return (
    <SectionStack className="py-10">
      <Eyebrow>{data.eyebrow || "Pre-Wedding Film"}</Eyebrow>
      <DisplayTitle>{data.title || "Our Story in Motion"}</DisplayTitle>
      <Divider glyph="▶" />
      {data.description ? <Body className="max-w-[32ch]">{data.description}</Body> : null}

      <motion.button
        type="button"
        whileTap={{ scale: 0.985 }}
        onClick={handleOpen}
        className="relative mt-2 aspect-video w-full overflow-hidden rounded-2xl border border-amber-100/20 bg-black"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {data.thumbnail ? (
          <img
            src={data.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a1638] via-[#150a22] to-[#06030d]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <motion.span
          aria-hidden
          className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full border border-amber-100/50 bg-white/10 text-amber-50 backdrop-blur"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Play size={22} className="ml-1" />
        </motion.span>
        {data.duration ? (
          <Meta className="absolute bottom-3 right-3">{data.duration}</Meta>
        ) : null}
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          >
            <div
              className="relative aspect-video w-full max-w-[900px]"
              onClick={(e) => e.stopPropagation()}
            >
              {embed ? (
                <iframe
                  src={embed}
                  title={data.title || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full rounded-xl"
                />
              ) : data.videoUrl ? (
                <video
                  src={data.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full rounded-xl bg-black"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white/60">
                  Video unavailable
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-amber-50 backdrop-blur"
            >
              <X size={18} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionStack>
  );
}
