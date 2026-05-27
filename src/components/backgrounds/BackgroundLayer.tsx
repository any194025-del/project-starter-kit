import type { BackgroundConfig } from "@/types/invitation";
import { useEffect, useRef, useState } from "react";

interface Props {
  config?: BackgroundConfig;
}

/**
 * Configurable cinematic background layer.
 *
 * Phase 4 polish:
 *  - Image preloads via Image() then crossfades in (no hard cut).
 *  - When `config` changes between sections, the previous layer holds for a
 *    beat under the new one so backgrounds melt rather than blink.
 *  - Video still preferred when provided; lazy-starts only when ready.
 */
export function BackgroundLayer({ config }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const image = isDesktop ? config?.desktop || config?.mobile : config?.mobile || config?.desktop;

  // Preload the chosen image so we can crossfade rather than pop-in.
  useEffect(() => {
    if (!image) {
      setImageLoaded(false);
      return;
    }
    setImageLoaded(false);
    const img = new Image();
    img.decoding = "async";
    img.src = image;
    let cancelled = false;
    const done = () => !cancelled && setImageLoaded(true);
    if (img.complete && img.naturalWidth > 0) done();
    else {
      img.onload = done;
      img.onerror = done;
    }
    return () => {
      cancelled = true;
    };
  }, [image]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !config?.videoUrl) return;
    el.muted = true;
    el.playsInline = true;
    el.loop = true;
    el.preload = "metadata";
    const onReady = () => setVideoReady(true);
    el.addEventListener("loadeddata", onReady);
    el.play().catch(() => {});
    return () => el.removeEventListener("loadeddata", onReady);
  }, [config?.videoUrl]);

  if (!config) return null;

  const opacity = config.opacity ?? 1;
  const blur = config.blur ?? 0;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft underglow that prevents black flash before image decodes */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 40%, rgba(60,28,82,0.45), rgba(6,3,13,0.95) 75%)",
        }}
      />

      {config.videoUrl ? (
        <video
          ref={videoRef}
          src={config.videoUrl}
          poster={config.videoPoster}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: videoReady ? opacity : 0,
            filter: blur ? `blur(${blur}px)` : undefined,
            transition: "opacity 1.2s ease-out",
            transform: "translateZ(0)",
          }}
          muted
          playsInline
          loop
          autoPlay
        />
      ) : image ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
            opacity: imageLoaded ? opacity : 0,
            filter: blur ? `blur(${blur}px)` : undefined,
            transition: "opacity 900ms cubic-bezier(0.22,1,0.36,1), filter 900ms ease",
            transform: "translateZ(0)",
          }}
        />
      ) : null}

      {config.gradient ? (
        <div className="absolute inset-0" style={{ background: config.gradient }} />
      ) : null}
      {config.overlay ? (
        <div className="absolute inset-0" style={{ background: config.overlay }} />
      ) : null}
      {config.tint ? (
        <div className="absolute inset-0 mix-blend-overlay" style={{ background: config.tint }} />
      ) : null}
    </div>
  );
}
