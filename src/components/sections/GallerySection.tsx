import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import type { SectionComponentProps } from "@/types/invitation";
import {
  DisplayTitle,
  Eyebrow,
  Body,
  Divider,
  SectionStack,
} from "@/components/ui/typography";
import {
  staggerCardsVariants,
  staggerItemVariants,
} from "@/animations/presets";

interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}
interface GalleryData {
  eyebrow?: string;
  title?: string;
  description?: string;
  coupleNames?: string;
  images?: GalleryImage[];
}

export function GallerySection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as GalleryData;
  const images = data.images ?? [];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SectionStack className="py-10">
      <Eyebrow>{data.eyebrow || "Our Story"}</Eyebrow>
      <DisplayTitle>{data.title || data.coupleNames || "Together"}</DisplayTitle>
      <Divider glyph="∞" />
      {data.description ? <Body className="max-w-[32ch]">{data.description}</Body> : null}

      {images.length > 0 ? (
        <motion.div
          variants={staggerCardsVariants}
          initial="initial"
          animate="animate"
          className="mt-4 grid w-full grid-cols-2 gap-2.5"
        >
          {images.map((img, i) => (
            <motion.button
              key={i}
              type="button"
              variants={staggerItemVariants}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpen(i)}
              className={
                "group relative overflow-hidden rounded-xl border border-amber-100/15 " +
                "bg-white/[0.03] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] " +
                (i % 3 === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square")
              }
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <img
                src={img.src}
                alt={img.alt ?? ""}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-active:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              {img.caption ? (
                <span
                  className="absolute bottom-2 left-2 text-[10px] tracking-[0.2em] uppercase text-amber-50/90"
                  style={{ fontFamily: "'Inter',sans-serif" }}
                >
                  {img.caption}
                </span>
              ) : null}
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <Body className="mt-4 opacity-60">Gallery images will appear here.</Body>
      )}

      <Lightbox
        images={images}
        index={open}
        onClose={() => setOpen(null)}
      />
    </SectionStack>
  );
}

function Lightbox({
  images,
  index,
  onClose,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
}) {
  const img = index !== null ? images[index] : null;
  return (
    <AnimatePresence>
      {img ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.img
            src={img.src}
            alt={img.alt ?? ""}
            className="max-h-full max-w-full rounded-lg object-contain"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-amber-50 backdrop-blur"
          >
            <X size={18} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
