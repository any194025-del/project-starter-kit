// Royal-template splash override.
// Demonstrates the section-override system: same SectionComponentProps API,
// theme-aware styling via CSS vars, but a distinct visual identity.
import { motion } from "framer-motion";
import { useState } from "react";
import type { SectionComponentProps } from "@/types/invitation";
import { useInvitationStore } from "@/context/invitationStore";
import { useAudio } from "@/components/audio/AudioProvider";
import { usePersonalization } from "@/hooks/usePersonalization";
import { OpenInvitationButton } from "@/components/sections/OpenInvitationButton";

interface SplashData {
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  welcomeDescription?: string;
  ctaLabel?: string;
  loadingLabel?: string;
}

export function RoyalSplashSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as SplashData;
  const open = useInvitationStore((s) => s.open);
  const next = useInvitationStore((s) => s.next);
  const { play } = useAudio();
  const personal = usePersonalization();
  const [exiting, setExiting] = useState(false);

  const handleOpen = async () => {
    await play();
    setExiting(true);
    open();
    await new Promise((r) => setTimeout(r, 900));
    next();
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between py-12 px-6">
      {/* Royal frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-[24px]"
        style={{
          border: "1px solid var(--inv-border)",
          boxShadow: "inset 0 0 60px rgba(241,200,122,0.08), var(--inv-glow)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-7 rounded-[18px]"
        style={{ border: "1px solid color-mix(in oklab, var(--inv-accent) 25%, transparent)" }}
      />

      <motion.div
        className="relative z-10 flex h-full w-full flex-col items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Crest */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15 }}
        >
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              border: "1px solid var(--inv-border)",
              background:
                "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--inv-accent) 18%, transparent), transparent)",
              boxShadow: "var(--inv-glow)",
            }}
          >
            <span
              className="text-3xl"
              style={{ color: "var(--inv-accent)", fontFamily: "var(--inv-font-display)" }}
            >
              ॐ
            </span>
          </div>
          <p
            className="mt-3 text-[10px] uppercase"
            style={{
              letterSpacing: "var(--inv-display-tracking)",
              color: "var(--inv-text-muted)",
            }}
          >
            Royal · Shubh Vivah
          </p>
        </motion.div>

        {/* Center copy */}
        <div className="flex flex-col items-center text-center">
          {data.welcomeTitle ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-[11px] uppercase"
              style={{
                letterSpacing: "var(--inv-display-tracking)",
                color: "var(--inv-text-muted)",
              }}
            >
              {data.welcomeTitle}
            </motion.p>
          ) : null}

          <motion.div
            className="mt-5 flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6 }}
          >
            <p
              className="text-[13px]"
              style={{ fontFamily: "var(--inv-font-script)", color: "var(--inv-text-muted)" }}
            >
              {personal.greeting}
            </p>
            <p
              className="mt-2 text-xl"
              style={{ fontFamily: "var(--inv-font-heading)", color: "var(--inv-text)" }}
            >
              {personal.displayName}
            </p>
            {personal.family ? (
              <p
                className="mt-1 text-[10px] uppercase"
                style={{
                  letterSpacing: "0.32em",
                  color: "var(--inv-text-muted)",
                }}
              >
                {personal.family}
                {personal.parivarLabel ? ` · ${personal.parivarLabel}` : ""}
              </p>
            ) : null}
          </motion.div>

          {data.welcomeSubtitle ? (
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-4xl"
              style={{
                fontFamily: "var(--inv-font-display)",
                letterSpacing: "var(--inv-display-tracking)",
                color: "var(--inv-text)",
                textShadow: "0 0 26px color-mix(in oklab, var(--inv-accent) 35%, transparent)",
              }}
            >
              {data.welcomeSubtitle}
            </motion.h1>
          ) : null}

          <motion.div
            className="mt-5 h-px w-28"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 1.3 }}
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--inv-accent), transparent)",
            }}
          />

          {data.welcomeDescription ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.5 }}
              className="mt-5 max-w-[28ch] text-[13px] leading-relaxed"
              style={{ color: "var(--inv-text-muted)" }}
            >
              {data.welcomeDescription}
            </motion.p>
          ) : null}
        </div>

        {/* Open */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
        >
          <OpenInvitationButton
            label={data.ctaLabel || "Open Invitation"}
            loadingLabel={data.loadingLabel || "Opening"}
            onOpen={handleOpen}
          />
          <p
            className="text-[10px] uppercase"
            style={{ letterSpacing: "0.4em", color: "var(--inv-text-muted)" }}
          >
            Tap to begin
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? [0, 0.3, 0] : 0 }}
        transition={{ duration: 0.9, times: [0, 0.4, 1], ease: "easeOut" }}
      />
    </div>
  );
}
