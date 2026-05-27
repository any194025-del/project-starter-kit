import { useMemo } from "react";
import { useInvitationStore } from "@/context/invitationStore";
import type { Guest } from "@/types/guest";

export interface Personalization {
  guest: Guest | null;
  /** Greeting line, e.g. "आदरणीय अतिथि" or "Dear guest". */
  greeting: string;
  /** Salutation + name + honorific. */
  displayName: string;
  /** Family / thikana line. Empty string when not available. */
  family: string;
  /** "Sa Parivar" inclusive label, or empty. */
  parivarLabel: string;
  /** Whether a real guest was resolved (vs anonymous preview). */
  isPersonal: boolean;
}

/**
 * Centralised personalization selector.
 * Sections call `usePersonalization()` instead of prop-drilling guest data.
 * Safe when no guest is resolved — returns elegant generic fallbacks.
 */
export function usePersonalization(): Personalization {
  const guest = useInvitationStore((s) => s.guest);

  return useMemo<Personalization>(() => {
    if (!guest) {
      return {
        guest: null,
        greeting: "आदरणीय अतिथि",
        displayName: "Our Honoured Guest",
        family: "",
        parivarLabel: "",
        isPersonal: false,
      };
    }
    const salutation = guest.salutation ? `${guest.salutation} ` : "";
    const honorific = guest.honorific ? ` ${guest.honorific}` : "";
    return {
      guest,
      greeting: guest.greeting?.trim() || "आदरणीय अतिथि",
      displayName: `${salutation}${guest.name}${honorific}`.trim(),
      family: guest.family ?? "",
      parivarLabel: guest.saParivar ? "Sa Parivar" : "",
      isPersonal: true,
    };
  }, [guest]);
}
