import { useEffect } from "react";
import { useInvitationStore } from "@/context/invitationStore";

/**
 * Horizontal swipe -> next/prev section.
 * - Requires meaningful horizontal distance OR velocity
 * - Requires horizontal to dominate vertical (so internal scroll wins on vertical drags)
 * - Ignores multi-touch (pinch/zoom) to avoid accidental triggers
 */
export function useSwipeNavigation(targetRef: React.RefObject<HTMLElement | null>) {
  const next = useInvitationStore((s) => s.next);
  const prev = useInvitationStore((s) => s.prev);
  const opened = useInvitationStore((s) => s.opened);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let startT = 0;
    let tracking = false;

    const MIN_DISTANCE = 70; // px
    const MIN_VELOCITY = 0.45; // px/ms
    const DOMINANCE = 1.4; // |dx| must beat |dy| * this

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        tracking = false;
        return;
      }
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = performance.now();
      tracking = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      if (!opened) return; // gate: do not navigate until invitation opened
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Math.max(1, performance.now() - startT);
      const vx = Math.abs(dx) / dt;

      if (Math.abs(dx) < Math.abs(dy) * DOMINANCE) return;
      if (Math.abs(dx) < MIN_DISTANCE && vx < MIN_VELOCITY) return;

      if (dx < 0) next();
      else prev();
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [targetRef, next, prev, opened]);
}
