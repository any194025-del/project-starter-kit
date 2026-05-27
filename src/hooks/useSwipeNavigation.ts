import { useEffect, useRef } from "react";
import { useInvitationStore } from "@/context/invitationStore";

/**
 * Production-grade horizontal swipe navigation.
 *
 * Design goals (Phase 4):
 *  - Vertical scrolling ALWAYS wins. We only commit to horizontal once the
 *    user clearly moves sideways, never inside a vertical scroll gesture.
 *  - Multi-touch (pinch/zoom) is ignored.
 *  - A short cooldown prevents accidental double-jumps from a single flick.
 *  - Works for both touch and mouse/trackpad drags.
 *  - Suppressed when the touch starts on an interactive element that handles
 *    its own gestures (`[data-no-swipe]`, video, iframe, inputs).
 */
export function useSwipeNavigation(targetRef: React.RefObject<HTMLElement | null>) {
  const next = useInvitationStore((s) => s.next);
  const prev = useInvitationStore((s) => s.prev);
  const opened = useInvitationStore((s) => s.opened);
  const lastNavAt = useRef(0);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // Tuning
    const MIN_DISTANCE = 80;        // px to commit by distance alone
    const MIN_VELOCITY = 0.55;      // px/ms for a flick
    const DOMINANCE = 1.6;          // |dx| must beat |dy| * this
    const LOCK_THRESHOLD = 10;      // px before we decide axis
    const COOLDOWN_MS = 520;        // prevent double-trigger from one flick

    let startX = 0;
    let startY = 0;
    let startT = 0;
    let tracking = false;
    let axis: "x" | "y" | null = null;
    let suppressed = false;

    const startsInsideNoSwipe = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest(
        '[data-no-swipe], video, iframe, input, textarea, select, [role="slider"]',
      );
    };

    const tryCommit = (dx: number, dy: number, dt: number) => {
      if (!opened) return;
      if (Date.now() - lastNavAt.current < COOLDOWN_MS) return;
      if (Math.abs(dx) < Math.abs(dy) * DOMINANCE) return;
      const vx = Math.abs(dx) / Math.max(1, dt);
      if (Math.abs(dx) < MIN_DISTANCE && vx < MIN_VELOCITY) return;
      lastNavAt.current = Date.now();
      // Light haptic on supported devices
      if ("vibrate" in navigator) navigator.vibrate?.(8);
      if (dx < 0) next();
      else prev();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        tracking = false;
        return;
      }
      suppressed = startsInsideNoSwipe(e.target);
      if (suppressed) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = performance.now();
      tracking = true;
      axis = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking || suppressed || axis === "y") return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (axis === null) {
        if (Math.abs(dx) < LOCK_THRESHOLD && Math.abs(dy) < LOCK_THRESHOLD) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking || suppressed) {
        tracking = false;
        return;
      }
      tracking = false;
      if (axis === "y") return; // vertical scroll — never navigate
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = performance.now() - startT;
      tryCommit(dx, dy, dt);
    };

    // Mouse / trackpad drag (desktop) — only when primary button held
    let mouseDown = false;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (startsInsideNoSwipe(e.target)) return;
      mouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
      startT = performance.now();
      axis = null;
    };
    const onMouseUp = (e: MouseEvent) => {
      if (!mouseDown) return;
      mouseDown = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const dt = performance.now() - startT;
      if (Math.abs(dx) < 40) return; // mouse threshold
      tryCommit(dx, dy, dt);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [targetRef, next, prev, opened]);
}
