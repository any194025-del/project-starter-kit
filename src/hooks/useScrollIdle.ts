import { useEffect, useState } from "react";

/**
 * Watches an element's scroll activity. Returns `true` when the user has been
 * idle (not scrolling) for `idleMs`. Used to fade nav chrome out of the way
 * while actively reading.
 */
export function useScrollIdle(
  ref: React.RefObject<HTMLElement | null>,
  idleMs = 900,
): boolean {
  const [idle, setIdle] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setIdle(false);
      if (t) clearTimeout(t);
      t = setTimeout(() => setIdle(true), idleMs);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (t) clearTimeout(t);
    };
  }, [ref, idleMs]);

  return idle;
}
