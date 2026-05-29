// Mock invitation registry — simulates an `invitations` table keyed by slug.
import type { InvitationDocument } from "@/types/invitation";
import demoDoc from "@/data/invitation.json";

const demo = demoDoc as InvitationDocument;

export const MOCK_INVITATIONS: Record<string, InvitationDocument> = {
  "aarav-weds-bhavya": { ...demo, id: "aarav-weds-bhavya", templateId: "cinematic" },
  // Same content, royal template — proves templates are pure config.
  "ishaan-weds-myra": {
    ...demo,
    id: "ishaan-weds-myra",
    templateId: "royal",
    meta: {
      ...demo.meta,
      coupleNames: "Ishaan & Myra",
    },
  },
};

export const DEFAULT_SLUG = "aarav-weds-bhavya";
