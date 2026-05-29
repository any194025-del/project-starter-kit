import { useMemo } from "react";
import { useInvitationStore } from "@/context/invitationStore";
import type { Guest } from "@/types/guest";

export interface Personalization {
  guest: Guest | null;
  greeting: string;
  displayName: string;
  family: string;
  parivarLabel: string;
  isPersonal: boolean;
}

const FALLBACK_NAME = "Our Honoured Guest";
const FALLBACK_GREETING = "आदरणीय अतिथि";

/**
 * Centralised personalization selector.
 * Reads guest from the global store, which the renderer hydrates
 * synchronously — so this returns the real guest on first render.
 */
export function usePersonalization(): Personalization {
  const guest = useInvitationStore((s) => s.guest);

  return useMemo<Personalization>(() => {
    if (!guest) {
      return {
        guest: null,
        greeting: FALLBACK_GREETING,
        displayName: FALLBACK_NAME,
        family: "",
        parivarLabel: "",
        isPersonal: false,
      };
    }
    const salutation = guest.salutation ? `${guest.salutation} ` : "";
    const honorific = guest.honorific ? ` ${guest.honorific}` : "";
    return {
      guest,
      greeting: guest.greeting?.trim() || FALLBACK_GREETING,
      displayName: `${salutation}${guest.name}${honorific}`.trim(),
      family: guest.family ?? "",
      parivarLabel: guest.saParivar ? "Sa Parivar" : "",
      isPersonal: true,
    };
  }, [guest]);
}
