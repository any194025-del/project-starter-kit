// Personalization context.
// Personalization is passed down through React context rather than through
// the global zustand store. This guarantees the splash and every section
// see the resolved guest on first paint, with zero hydration race between
// the renderer (which receives `guest` as a prop) and deep consumers.
import { createContext, useContext, useMemo, type ReactNode } from "react";
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

function buildPersonalization(guest: Guest | null): Personalization {
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
}

const PersonalizationContext = createContext<Personalization>(
  buildPersonalization(null),
);

export function PersonalizationProvider({
  guest,
  children,
}: {
  guest: Guest | null;
  children: ReactNode;
}) {
  const value = useMemo(() => buildPersonalization(guest), [guest]);
  return (
    <PersonalizationContext.Provider value={value}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization(): Personalization {
  return useContext(PersonalizationContext);
}
