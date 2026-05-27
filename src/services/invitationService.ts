// Invitation service.
// Today: reads MOCK_INVITATIONS.
// Tomorrow: `supabase.from('invitations').select(...).eq('slug', slug).single()`
// The UI must NEVER import invitation JSON directly — go through this service.
import type { InvitationDocument } from "@/types/invitation";
import type { InvitationSummary } from "@/types/guest";
import { MOCK_INVITATIONS } from "@/data/mock/invitations";
import { mockDelay, ServiceError } from "./_mockDelay";

export const invitationService = {
  async getBySlug(slug: string): Promise<InvitationDocument> {
    const doc = MOCK_INVITATIONS[slug];
    if (!doc) {
      await mockDelay(null, 180);
      throw new ServiceError("not_found", `Invitation '${slug}' not found`);
    }
    return mockDelay(doc, 220);
  },

  async getSummary(slug: string): Promise<InvitationSummary> {
    const doc = await this.getBySlug(slug);
    return {
      id: doc.id,
      slug,
      coupleNames: doc.meta.coupleNames ?? "",
      weddingDate: doc.meta.weddingDate,
    };
  },
};
