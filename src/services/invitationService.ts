// Invitation service.
// Today: reads MOCK_INVITATIONS.
// Tomorrow: `supabase.from('invitations').select(...).eq('slug', slug).single()`
// The UI must NEVER import invitation JSON directly — go through this service.
import type { InvitationDocument } from "@/types/invitation";
import type { InvitationSummary } from "@/types/guest";
import { supabase } from "@/integrations/supabase/client";
import { ensureInvitationSeeded } from "@/lib/db-seed";
import { ServiceError } from "./_mockDelay";

async function fetchBySlug(slug: string) {
  const { data, error } = await supabase
    .from("invitations")
    .select("id, slug, template_id, status, document, theme_overrides, published_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new ServiceError("unknown", error.message);
  return data;
}

export const invitationService = {
  async getBySlug(slug: string): Promise<InvitationDocument> {
    let row = await fetchBySlug(slug);
    if (!row) {
      await ensureInvitationSeeded(slug);
      row = await fetchBySlug(slug);
    }
    if (!row) throw new ServiceError("not_found", `Invitation '${slug}' not found`);
    const doc = row.document as unknown as InvitationDocument;
    return { ...doc, id: slug, templateId: row.template_id ?? doc.templateId };
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
