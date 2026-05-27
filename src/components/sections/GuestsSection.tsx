import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";
import type { SectionComponentProps } from "@/types/invitation";
import {
  DisplayTitle,
  Eyebrow,
  Divider,
  SectionStack,
  FamilyName,
  Meta,
} from "@/components/ui/typography";
import {
  staggerCardsVariants,
  staggerItemVariants,
} from "@/animations/presets";

interface Member {
  name?: string;
  relation?: string;
  image?: string;
  phone?: string;
}
interface Group {
  title?: string;
  members?: Member[];
}
interface GuestsData {
  eyebrow?: string;
  title?: string;
  groups?: Group[];
}

export function GuestsSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as GuestsData;
  const groups = data.groups ?? [];
  const [open, setOpen] = useState<number>(0);

  return (
    <SectionStack className="py-10">
      <Eyebrow>{data.eyebrow || "Our Families"}</Eyebrow>
      <DisplayTitle>{data.title || "With Blessings From"}</DisplayTitle>
      <Divider glyph="✿" />

      <motion.div
        variants={staggerCardsVariants}
        initial="initial"
        animate="animate"
        className="mt-2 flex w-full flex-col gap-2.5 text-left"
      >
        {groups.map((g, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              variants={staggerItemVariants}
              className="overflow-hidden rounded-2xl border border-amber-100/15 bg-white/[0.03] backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <FamilyName>{g.title || "Family"}</FamilyName>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-amber-100/70"
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && g.members?.length ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="border-t border-white/5"
                  >
                    <ul className="flex flex-col">
                      {g.members.map((m, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0"
                        >
                          <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-amber-100/20 bg-white/[0.04]">
                            {m.image ? (
                              <img
                                src={m.image}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span
                                className="text-amber-100/70 text-sm"
                                style={{ fontFamily: "'Cormorant Garamond',serif" }}
                              >
                                {(m.name ?? "·").slice(0, 1)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-amber-50 text-[15px] tracking-[0.03em]"
                              style={{ fontFamily: "'Cormorant Garamond',serif" }}
                            >
                              {m.name}
                            </p>
                            {m.relation ? (
                              <Meta className="text-amber-100/55">{m.relation}</Meta>
                            ) : null}
                          </div>
                          {m.phone ? (
                            <a
                              href={`tel:${m.phone}`}
                              aria-label={`Call ${m.name}`}
                              className="grid h-9 w-9 place-items-center rounded-full border border-amber-100/25 bg-white/[0.05] text-amber-100/85"
                              style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                              <Phone size={14} />
                            </a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionStack>
  );
}
