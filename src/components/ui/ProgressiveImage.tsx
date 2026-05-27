import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  /** Optional aspect ratio (e.g. "1/1", "16/10") to prevent layout shift. */
  ratio?: string;
  /** Eager-load (skip IntersectionObserver). Default false. */
  eager?: boolean;
  wrapperClassName?: string;
}

/**
 * Progressive image:
 *  - Reserves aspect-ratio to avoid CLS
 *  - Animated blurred placeholder until decoded
 *  - Lazy mounts via IntersectionObserver (when not eager)
 *  - Smooth fade reveal on load
 */
export function ProgressiveImage({
  src,
  alt = "",
  ratio,
  eager = false,
  className,
  wrapperClassName,
  ...rest
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (eager || inView) return;
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, inView]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {/* Shimmer / blur placeholder */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100",
        )}
        style={{
          background:
            "linear-gradient(110deg, rgba(255,255,255,0.04) 8%, rgba(255,255,255,0.10) 18%, rgba(255,255,255,0.04) 33%)",
          backgroundSize: "200% 100%",
          animation: "lov-shimmer 1.6s linear infinite",
          filter: "blur(8px)",
        }}
      />
      {inView ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
            loaded ? "opacity-100" : "opacity-0",
            className,
          )}
          style={{ transform: "translateZ(0)" }}
          {...rest}
        />
      ) : null}
    </div>
  );
}
