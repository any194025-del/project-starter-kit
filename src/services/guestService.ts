// Guest service — guest identity resolution.
// Today: MOCK_GUESTS lookup. Tomorrow: Supabase query scoped to invitation_id.
import type { Guest } from "@/types/guest";
import { MOCK_GUESTS } from "@/data/mock/guests";
import { mockDelay, ServiceError } from "./_mockDelay";

export const guestService = {
  async getById(invitationId: string, guestId: string): Promise<Guest> {
    const guest = MOCK_GUESTS.find(
      (g) => g.invitationId === invitationId && g.id === guestId,
    );
    if (!guest) {
      await mockDelay(null, 150);
      throw new ServiceError("not_found", `Guest '${guestId}' not found`);
    }
    return mockDelay(guest, 180);
  },

  async list(invitationId: string): Promise<Guest[]> {
    return mockDelay(
      MOCK_GUESTS.filter((g) => g.invitationId === invitationId),
      200,
    );
  },
};
