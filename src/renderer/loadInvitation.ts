import type { InvitationDocument, InvitationSection } from "@/types/invitation";

/**
 * Convert an invitation document's `pages` map into a sorted section array.
 * The UI MUST never depend on JSON object keys — only `type` and `order`.
 */
export function extractSections(doc: InvitationDocument): InvitationSection[] {
  return Object.entries(doc.pages)
    .map(([key, page]) => ({ key, ...page }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Future: swap this for a Supabase fetch. The renderer should not care.
 */
export async function loadInvitation(): Promise<InvitationDocument> {
  const mod = await import("@/data/invitation.json");
  return mod.default as InvitationDocument;
}
