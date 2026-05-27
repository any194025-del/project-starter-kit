import { Link } from "@tanstack/react-router";

interface Props {
  title: string;
  message?: string;
}

/**
 * Elegant fallback shown when an invitation/guest can't be resolved.
 * Used by route errorComponent + notFoundComponent so the app never
 * exposes a raw stack trace to invitees.
 */
export function InvitationFallback({ title, message }: Props) {
  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#06030d] px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 40%, rgba(60,28,82,0.55), rgba(6,3,13,1) 75%)",
        }}
      />
      <div className="relative z-10 max-w-sm">
        <p className="text-[10px] uppercase tracking-[0.5em] text-amber-100/60">
          Shubh Vivah
        </p>
        <h1
          className="mt-4 text-3xl font-light tracking-wide text-amber-50"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {title}
        </h1>
        <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
        {message ? (
          <p className="mt-5 text-sm leading-relaxed text-white/70">{message}</p>
        ) : null}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-amber-100/30 bg-white/[0.04] px-5 py-2 text-[11px] uppercase tracking-[0.32em] text-amber-50 hover:bg-white/[0.08]"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
