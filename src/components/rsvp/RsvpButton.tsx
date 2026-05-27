import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Loader2, Check } from "lucide-react";
import { useInvitationStore } from "@/context/invitationStore";
import { rsvpService } from "@/services/rsvpService";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePersonalization } from "@/hooks/usePersonalization";
import type { RsvpStatus } from "@/types/guest";

/**
 * Floating RSVP button + modal. Hidden until invitation is opened, hidden if
 * no real guest is resolved (anonymous preview). Mocks an optimistic update.
 */
export function RsvpButton() {
  const opened = useInvitationStore((s) => s.opened);
  const scrolling = useInvitationStore((s) => s.scrolling);
  const invitation = useInvitationStore((s) => s.invitation);
  const guest = useInvitationStore((s) => s.guest);
  const rsvp = useInvitationStore((s) => s.rsvp);
  const setRsvp = useInvitationStore((s) => s.setRsvp);
  const { isPersonal } = usePersonalization();
  const { track } = useAnalytics();
  const [open, setOpen] = useState(false);

  // Hydrate existing RSVP for this guest (mock fetch).
  useEffect(() => {
    if (!invitation || !guest) return;
    let cancelled = false;
    rsvpService.get(invitation.id, guest.id).then((r) => {
      if (!cancelled) setRsvp(r);
    });
    return () => {
      cancelled = true;
    };
  }, [invitation, guest, setRsvp]);

  if (!opened || !isPersonal) return null;

  const responded = rsvp?.status && rsvp.status !== "pending";

  return (
    <>
      <motion.button
        type="button"
        data-no-swipe
        aria-label="RSVP"
        onClick={() => {
          track("rsvp_opened");
          setOpen(true);
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: scrolling ? 0.35 : 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileTap={{ scale: 0.94 }}
        className="fixed top-4 left-4 z-40 h-12 px-4 rounded-full
                   bg-gradient-to-br from-amber-200/25 to-amber-100/10
                   backdrop-blur-2xl border border-amber-100/30
                   text-amber-50 flex items-center gap-2
                   hover:bg-amber-100/20 transition-colors
                   shadow-[0_8px_28px_rgba(0,0,0,0.45),0_0_22px_rgba(255,220,180,0.18)]"
        style={{ willChange: "transform, opacity" }}
      >
        {responded ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
        <span className="text-[10px] uppercase tracking-[0.32em]">
          {responded ? rsvpLabel(rsvp!.status) : "RSVP"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open ? <RsvpModal onClose={() => setOpen(false)} /> : null}
      </AnimatePresence>
    </>
  );
}

function rsvpLabel(status: RsvpStatus): string {
  switch (status) {
    case "attending":
      return "Joining";
    case "maybe":
      return "Maybe";
    case "declined":
      return "Regrets";
    default:
      return "RSVP";
  }
}

function RsvpModal({ onClose }: { onClose: () => void }) {
  const invitation = useInvitationStore((s) => s.invitation);
  const guest = useInvitationStore((s) => s.guest);
  const rsvp = useInvitationStore((s) => s.rsvp);
  const setRsvp = useInvitationStore((s) => s.setRsvp);
  const personal = usePersonalization();
  const { track } = useAnalytics();

  const [status, setStatus] = useState<RsvpStatus>(rsvp?.status ?? "attending");
  const [count, setCount] = useState<number>(rsvp?.guestCount ?? 1);
  const [message, setMessage] = useState<string>(rsvp?.message ?? "");
  const [submitting, setSubmitting] = useState(false);
  const max = guest?.maxGuests ?? 1;

  const submit = async () => {
    if (!invitation || !guest) return;
    setSubmitting(true);
    // Optimistic update
    const optimistic = {
      invitationId: invitation.id,
      guestId: guest.id,
      status,
      guestCount: count,
      message,
      respondedAt: new Date().toISOString(),
    };
    setRsvp(optimistic);
    try {
      const saved = await rsvpService.submit(optimistic);
      setRsvp(saved);
      track("rsvp_submitted", { status, count });
      onClose();
    } catch {
      // In a real backend we'd rollback. For mock, keep optimistic value.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      data-no-swipe
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl
                   bg-gradient-to-b from-[#1a0d2e] to-[#0a0612]
                   border border-amber-100/15 p-6 text-amber-50"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5"
        >
          <X size={16} />
        </button>

        <p className="text-[10px] uppercase tracking-[0.45em] text-amber-100/70">
          With Joy
        </p>
        <h2
          className="mt-2 text-2xl font-light tracking-wide"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {personal.displayName}
        </h2>
        {personal.family ? (
          <p className="mt-1 text-xs text-amber-100/60">{personal.family}</p>
        ) : null}

        <div className="mt-6 grid grid-cols-3 gap-2">
          {(["attending", "maybe", "declined"] as RsvpStatus[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setStatus(opt)}
              className={
                "h-12 rounded-xl border text-[11px] uppercase tracking-[0.18em] transition-colors " +
                (status === opt
                  ? "border-amber-200/70 bg-amber-200/15 text-amber-50"
                  : "border-white/10 bg-white/[0.04] text-amber-100/60 hover:bg-white/[0.08]")
              }
            >
              {opt === "attending" ? "Joining" : opt === "maybe" ? "Maybe" : "Regrets"}
            </button>
          ))}
        </div>

        {status !== "declined" && max > 1 ? (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-100/60">
              Guests (max {max})
            </p>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                className="h-9 w-9 rounded-full border border-white/15 bg-white/5"
              >
                −
              </button>
              <span className="w-8 text-center text-lg">{count}</span>
              <button
                onClick={() => setCount((c) => Math.min(max, c + 1))}
                className="h-9 w-9 rounded-full border border-white/15 bg-white/5"
              >
                +
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-100/60">
            A note (optional)
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Send your blessings…"
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-amber-50 placeholder:text-white/30 focus:border-amber-200/40 focus:outline-none"
          />
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="mt-6 w-full h-12 rounded-full bg-gradient-to-r from-amber-200 to-amber-100 text-[#1a0d2e] font-medium tracking-wider text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Sending" : "Send RSVP"}
        </button>
      </motion.div>
    </motion.div>
  );
}
