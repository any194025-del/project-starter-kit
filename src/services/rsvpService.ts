// RSVP service — read & upsert. UI uses this exclusively.
// Today: in-memory mockRsvpDb. Tomorrow: supabase.from('rsvps').upsert(...).
import type { Rsvp, RsvpStatus } from "@/types/guest";
import { mockRsvpDb } from "@/data/mock/rsvps";
import { mockDelay } from "./_mockDelay";

export interface RsvpInput {
  invitationId: string;
  guestId: string;
  status: RsvpStatus;
  guestCount?: number;
  message?: string;
}

export const rsvpService = {
  async get(invitationId: string, guestId: string): Promise<Rsvp | null> {
    return mockDelay(mockRsvpDb.get(invitationId, guestId) ?? null, 120);
  },

  async submit(input: RsvpInput): Promise<Rsvp> {
    const rsvp: Rsvp = {
      invitationId: input.invitationId,
      guestId: input.guestId,
      status: input.status,
      guestCount: Math.max(1, input.guestCount ?? 1),
      message: input.message,
      respondedAt: new Date().toISOString(),
    };
    // Simulate write latency + eventual persistence.
    await mockDelay(null, 380);
    return mockRsvpDb.upsert(rsvp);
  },
};
