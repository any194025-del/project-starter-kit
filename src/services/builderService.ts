// Builder persistence service.
// Today: localStorage-backed mock. Tomorrow: Supabase `invitation_drafts`.
// The shape is intentionally Supabase-friendly (async, typed errors, single
// row per invitation id) so swapping the backend is a body-only change.
import type { InvitationDocument } from "@/types/invitation";
import type { RuntimeOverrides } from "@/types/template";
import { MOCK_INVITATIONS } from "@/data/mock/invitations";
import { mockDelay, ServiceError } from "./_mockDelay";

export interface DraftRecord {
  id: string;
  document: InvitationDocument;
  themeOverrides: RuntimeOverrides | null;
  updatedAt: string;
  publishedAt?: string;
}

const KEY = (id: string) => `lovable:invitation-draft:${id}`;

function safeStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

function seedFromMock(id: string): DraftRecord | null {
  const doc = MOCK_INVITATIONS[id];
  if (!doc) return null;
  return {
    id,
    document: structuredClone(doc),
    themeOverrides: null,
    updatedAt: new Date().toISOString(),
  };
}

export const builderService = {
  async loadDraft(id: string): Promise<DraftRecord> {
    const s = safeStorage();
    const raw = s?.getItem(KEY(id));
    if (raw) {
      try {
        return await mockDelay(JSON.parse(raw) as DraftRecord, 120);
      } catch {
        // fall through to seed
      }
    }
    const seeded = seedFromMock(id);
    if (!seeded) {
      await mockDelay(null, 120);
      throw new ServiceError("not_found", `Invitation '${id}' not found`);
    }
    return mockDelay(seeded, 180);
  },

  async saveDraft(record: DraftRecord): Promise<DraftRecord> {
    const next: DraftRecord = { ...record, updatedAt: new Date().toISOString() };
    safeStorage()?.setItem(KEY(record.id), JSON.stringify(next));
    return mockDelay(next, 140);
  },

  async publishInvitation(record: DraftRecord): Promise<DraftRecord> {
    const next: DraftRecord = {
      ...record,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    safeStorage()?.setItem(KEY(record.id), JSON.stringify(next));
    return mockDelay(next, 220);
  },

  async resetDraft(id: string): Promise<DraftRecord> {
    safeStorage()?.removeItem(KEY(id));
    return this.loadDraft(id);
  },
};
