// Mock in-memory RSVP store. Simulates a Supabase `rsvps` table.
// Replaced wholesale by `supabase.from('rsvps')` later — same shape.
import type { Rsvp } from "@/types/guest";

const KEY = (invitationId: string, guestId: string) => `${invitationId}::${guestId}`;

const store = new Map<string, Rsvp>();

export const mockRsvpDb = {
  get(invitationId: string, guestId: string): Rsvp | undefined {
    return store.get(KEY(invitationId, guestId));
  },
  upsert(rsvp: Rsvp): Rsvp {
    store.set(KEY(rsvp.invitationId, rsvp.guestId), rsvp);
    return rsvp;
  },
};
