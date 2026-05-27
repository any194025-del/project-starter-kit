import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SectionComponentProps } from "@/types/invitation";
import { useInvitationStore } from "@/context/invitationStore";
import { useAudio } from "@/components/audio/AudioProvider";
import { OpenInvitationButton } from "./OpenInvitationButton";

interface SplashData {
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  welcomeDescription?: string;
  ganeshImage?: string;
  tapToOpenImage?: string;
  videoUrl?: string;
  imageUrl?: string;
  ctaLabel?: string;
  loadingLabel?: string;
}

export function SplashSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as SplashData;
  const opened = useInvitationStore((s) => s.opened);
  const open = useInvitationStore((s) => s.open);
  const next = useInvitationStore((s) => s.next);
  const { play } = useAudio();

  const [exiting, setExiting] = useState(false);

  const handleOpen = async () => {
    // Audio MUST start only from this user gesture
    await play();
    setExiting(true);
    open();
    // Let the unlock animation breathe before advancing
    await new Promise((r) => setTimeout(r, 900));
    next();
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <CinematicBackground videoUrl={data.videoUrl} imageUrl={data.imageUrl} />
      <Particles />

      <motion.div
        className="relative z-10 flex h-full w-full flex-col items-center justify-between py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top: Ganesh / deity image */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {data.ganeshImage ? (
            <img
              src={data.ganeshImage}
              alt=""
              loading="lazy"
              className="h-24 w-24 object-contain opacity-90 drop-shadow-[0_0_18px_rgba(255,200,120,0.35)]"
            />
          ) : (
            <DeityGlyph />
          )}
          <p className="mt-3 text-[10px] uppercase tracking-[0.45em] text-amber-100/70">
            ॐ · Shubh Vivah
          </p>
        </motion.div>

        {/* Middle: welcome text */}
        <div className="flex flex-col items-center text-center px-4">
          {data.welcomeTitle ? (
            <motion.p
              className="text-[11px] uppercase tracking-[0.5em] text-amber-100/75"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {data.welcomeTitle}
            </motion.p>
          ) : null}

          {data.welcomeSubtitle ? (
            <motion.h1
              className="mt-4 text-4xl font-light tracking-[0.15em] text-amber-50"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                textShadow: "0 0 30px rgba(255,210,140,0.35)",
              }}
              initial={{ opacity: 0, y: 14, letterSpacing: "0.35em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.15em" }}
              transition={{ duration: 1.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {data.welcomeSubtitle}
            </motion.h1>
          ) : null}

          <motion.div
            className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.4 }}
          />

          {data.welcomeDescription ? (
            <motion.p
              className="mt-5 max-w-[28ch] text-[13px] leading-relaxed text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.6 }}
            >
              {data.welcomeDescription}
            </motion.p>
          ) : null}
        </div>

        {/* Bottom: tap-to-open */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.9 }}
        >
          {data.tapToOpenImage ? (
            <motion.img
              src={data.tapToOpenImage}
              alt=""
              loading="lazy"
              className="h-10 w-10 object-contain opacity-80"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}

          <OpenInvitationButton
            label={data.ctaLabel || "Open Invitation"}
            loadingLabel={data.loadingLabel || "Opening"}
            onOpen={handleOpen}
          />

          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
            {opened ? "Welcome" : "Tap to begin"}
          </p>
        </motion.div>
      </motion.div>

      {/* Unlock flash */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? [0, 0.35, 0] : 0 }}
        transition={{ duration: 0.9, times: [0, 0.4, 1], ease: "easeOut" }}
      />
    </div>
  );
}

/* ---------- background ---------- */

function CinematicBackground({
  videoUrl,
  imageUrl,
}: {
  videoUrl?: string;
  imageUrl?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoUrl) return;
    el.muted = true;
    el.playsInline = true;
    el.loop = true;
    el.preload = "metadata";
    const onReady = () => setVideoReady(true);
    el.addEventListener("loadeddata", onReady);
    el.play().catch(() => {/* ignored */});
    return () => el.removeEventListener("loadeddata", onReady);
  }, [videoUrl]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Deep cinematic gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 30%, #2a1638 0%, #150a22 45%, #06030d 100%)",
        }}
      />
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: videoReady ? 0.55 : 0,
            filter: "brightness(0.55) saturate(1.05)",
            transition: "opacity 1.2s ease-out",
          }}
          muted
          playsInline
          loop
          autoPlay
        />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.55, filter: "brightness(0.6)" }}
        />
      ) : null}

      {/* Vignette + warm wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 40%, rgba(255,180,120,0.10) 0%, rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </div>
  );
}

/* ---------- particles ---------- */

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 8,
        size: 1 + Math.random() * 2,
        opacity: 0.25 + Math.random() * 0.45,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-amber-100"
          style={{
            left: `${p.left}%`,
            bottom: -10,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            filter: "blur(0.5px)",
            boxShadow: "0 0 6px rgba(255,220,160,0.6)",
          }}
          animate={{ y: ["0vh", "-110vh"], opacity: [0, p.opacity, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ---------- fallback deity glyph ---------- */

function DeityGlyph() {
  return (
    <div
      className="flex h-20 w-20 items-center justify-center rounded-full
                 border border-amber-200/30
                 bg-gradient-to-b from-amber-200/10 to-transparent
                 shadow-[0_0_30px_rgba(255,200,120,0.25)]"
    >
      <span
        className="text-3xl text-amber-100"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        ॐ
      </span>
    </div>
  );
}
