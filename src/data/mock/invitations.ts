// Mock invitation registry — simulates a `invitations` table keyed by slug.
// Swap this file with a Supabase fetch later; nothing else needs to change.
import type { InvitationDocument } from "@/types/invitation";
import demoDoc from "@/data/invitation.json";

const demo = demoDoc as InvitationDocument;

export const MOCK_INVITATIONS: Record<string, InvitationDocument> = {
  "aarav-weds-bhavya": { ...demo, id: "aarav-weds-bhavya" },
};

/** Slug used when no slug is present in the URL (e.g. legacy `/`). */
export const DEFAULT_SLUG = "aarav-weds-bhavya";
