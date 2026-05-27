import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Reusable cinematic typography primitives.
 * - Serif display for titles (Cormorant Garamond) with Devanagari fallback.
 * - Sans body (Inter) with Noto Sans Devanagari fallback.
 * - Mobile-first sizing with graceful desktop scale.
 * - All sizes use clamp() for fluid responsiveness.
 */

const SERIF =
  "'Cormorant Garamond','Playfair Display','Noto Serif Devanagari',serif";
const SANS =
  "'Inter','Noto Sans Devanagari',system-ui,-apple-system,sans-serif";

type DivProps = HTMLAttributes<HTMLDivElement> & { children?: ReactNode };
type HProps = HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode };
type PProps = HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode };

export function Eyebrow({ className, children, ...rest }: PProps) {
  return (
    <p
      {...rest}
      style={{ fontFamily: SANS, ...rest.style }}
      className={cn(
        "text-[10px] sm:text-[11px] uppercase tracking-[0.45em] text-amber-100/70",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionTitle({ className, children, ...rest }: HProps) {
  return (
    <h2
      {...rest}
      style={{
        fontFamily: SERIF,
        textShadow: "0 0 24px rgba(255,210,140,0.18)",
        ...rest.style,
      }}
      className={cn(
        "font-light text-amber-50",
        "text-[clamp(1.75rem,7vw,2.75rem)] leading-[1.1] tracking-[0.06em]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function DisplayTitle({ className, children, ...rest }: HProps) {
  return (
    <h1
      {...rest}
      style={{
        fontFamily: SERIF,
        textShadow: "0 0 30px rgba(255,210,140,0.3)",
        ...rest.style,
      }}
      className={cn(
        "font-light text-amber-50",
        "text-[clamp(2.25rem,9vw,3.75rem)] leading-[1.05] tracking-[0.08em]",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function Subtitle({ className, children, ...rest }: PProps) {
  return (
    <p
      {...rest}
      style={{ fontFamily: SERIF, ...rest.style }}
      className={cn(
        "text-amber-100/85 italic font-light",
        "text-[clamp(0.95rem,3.6vw,1.15rem)] leading-snug tracking-[0.04em]",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Body({ className, children, ...rest }: PProps) {
  return (
    <p
      {...rest}
      style={{ fontFamily: SANS, ...rest.style }}
      className={cn(
        "text-white/75",
        "text-[clamp(0.85rem,3.4vw,1rem)] leading-[1.7] tracking-[0.005em]",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Label({ className, children, ...rest }: PProps) {
  return (
    <p
      {...rest}
      style={{ fontFamily: SANS, ...rest.style }}
      className={cn(
        "text-[10px] uppercase tracking-[0.32em] text-white/55",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Meta({ className, children, ...rest }: PProps) {
  return (
    <p
      {...rest}
      style={{ fontFamily: SANS, ...rest.style }}
      className={cn(
        "text-[11px] tracking-[0.08em] text-amber-100/70",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function FamilyName({ className, children, ...rest }: HProps) {
  return (
    <h3
      {...rest}
      style={{ fontFamily: SERIF, ...rest.style }}
      className={cn(
        "font-light text-amber-50",
        "text-[clamp(1.1rem,4.5vw,1.5rem)] tracking-[0.05em]",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function WishText({ className, children, ...rest }: PProps) {
  return (
    <p
      {...rest}
      style={{ fontFamily: SERIF, ...rest.style }}
      className={cn(
        "text-amber-50/90 italic font-light",
        "text-[clamp(0.95rem,3.8vw,1.1rem)] leading-[1.7]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Decorative divider with optional center glyph. */
export function Divider({
  className,
  glyph,
}: {
  className?: string;
  glyph?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-200/50" />
      {glyph ? (
        <span
          className="text-amber-200/70 text-xs"
          style={{ fontFamily: SERIF }}
        >
          {glyph}
        </span>
      ) : (
        <span className="block h-1 w-1 rounded-full bg-amber-200/70" />
      )}
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-200/50" />
    </div>
  );
}

/** Vertical-scroll-safe content wrapper for sections. */
export function SectionStack({ className, children, ...rest }: DivProps) {
  return (
    <div
      {...rest}
      className={cn(
        "mx-auto flex w-full max-w-[440px] flex-col items-center gap-6 text-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
