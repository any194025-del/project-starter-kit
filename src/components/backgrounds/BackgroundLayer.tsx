import type { BackgroundConfig } from "@/types/invitation";
import { useEffect, useRef, useState } from "react";

interface Props {
  config?: BackgroundConfig;
}

/**
 * Configurable cinematic background layer.
 * Supports: mobile/desktop image switching, optional looping video,
 * gradient + overlay + tint stack, blur, and opacity. Sits behind content
 * with pointer-events: none.
 */
export function BackgroundLayer({ config }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  const image = isDesktop ? config.desktop || config.mobile : config.mobile || config.desktop;
  const opacity = config.opacity ?? 1;
  const blur = config.blur ?? 0;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Optional video (above image base) */}
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
            opacity,
            filter: blur ? `blur(${blur}px)` : undefined,
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
