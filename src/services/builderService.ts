// Builder persistence service. Backed by Supabase `invitations` + `invitation_drafts`.
// API shape preserved from the localStorage mock: loadDraft / saveDraft / publishInvitation / resetDraft.
// `record.id` is the public slug (also the route param /builder/$invitationId).
import type { InvitationDocument } from "@/types/invitation";
import type { RuntimeOverrides } from "@/types/template";
import { supabase } from "@/integrations/supabase/client";
import { ensureInvitationSeeded } from "@/lib/db-seed";
import { MOCK_INVITATIONS } from "@/data/mock/invitations";
import { ServiceError } from "./_mockDelay";

export interface DraftRecord {
  id: string; // slug
  document: InvitationDocument;
  themeOverrides: RuntimeOverrides | null;
  updatedAt: string;
  publishedAt?: string;
}

type Json = unknown;

async function getInvitationRow(slug: string) {
  const { data } = await supabase
    .from("invitations")
    .select("id, slug, template_id, document, theme_overrides, status, published_at, updated_at")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

async function ensureInvitationRow(slug: string) {
  let row = await getInvitationRow(slug);
  if (row) return row;

  // Seed from mock if we have it
  const seededUuid = await ensureInvitationSeeded(slug);
  if (seededUuid) {
    row = await getInvitationRow(slug);
    if (row) return row;
  }

  // Brand-new slug: create an empty shell from the first mock template
  const template = MOCK_INVITATIONS[Object.keys(MOCK_INVITATIONS)[0]];
  const blankDoc: InvitationDocument = {
    ...template,
    id: slug,
    meta: { ...template.meta, coupleNames: "New Wedding" },
  };
  const { data: inserted, error } = await supabase
    .from("invitations")
    .insert({
      slug,
      template_id: blankDoc.templateId,
      status: "draft",
      document: blankDoc as unknown as Json as never,
    })
    .select("id, slug, template_id, document, theme_overrides, status, published_at, updated_at")
    .single();
  if (error || !inserted) throw new ServiceError("unknown", error?.message ?? "Could not create invitation");
  return inserted;
}

export const builderService = {
  async loadDraft(slug: string): Promise<DraftRecord> {
    const inv = await ensureInvitationRow(slug);

    // Prefer working draft if present, otherwise live document
    const { data: draft } = await supabase
      .from("invitation_drafts")
      .select("document, theme_overrides, updated_at")
      .eq("invitation_id", inv.id)
      .maybeSingle();

    const doc = (draft?.document ?? inv.document) as unknown as InvitationDocument;
    const overrides = (draft?.theme_overrides ?? inv.theme_overrides) as RuntimeOverrides | null;

    return {
      id: slug,
      document: { ...doc, id: slug, templateId: inv.template_id ?? doc.templateId },
      themeOverrides: overrides,
      updatedAt: draft?.updated_at ?? inv.updated_at,
      publishedAt: inv.published_at ?? undefined,
    };
  },

  async saveDraft(record: DraftRecord): Promise<DraftRecord> {
    const inv = await ensureInvitationRow(record.id);
    const { data, error } = await supabase
      .from("invitation_drafts")
      .upsert(
        {
          invitation_id: inv.id,
          document: record.document as unknown as Json as never,
          theme_overrides: (record.themeOverrides ?? null) as unknown as Json as never,
        },
        { onConflict: "invitation_id" },
      )
      .select("updated_at")
      .single();
    if (error || !data) throw new ServiceError("unknown", error?.message ?? "Save failed");
    return { ...record, updatedAt: data.updated_at };
  },

  async publishInvitation(record: DraftRecord): Promise<DraftRecord> {
    const inv = await ensureInvitationRow(record.id);
    const publishedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("invitations")
      .update({
        template_id: record.document.templateId,
        document: record.document as unknown as Json as never,
        theme_overrides: (record.themeOverrides ?? null) as unknown as Json as never,
        status: "published",
        published_at: publishedAt,
      })
      .eq("id", inv.id)
      .select("updated_at")
      .single();
    if (error || !data) throw new ServiceError("unknown", error?.message ?? "Publish failed");

    // Mirror published state into the draft row so the studio reopens cleanly
    await supabase.from("invitation_drafts").upsert(
      {
        invitation_id: inv.id,
        document: record.document as unknown as Json as never,
        theme_overrides: (record.themeOverrides ?? null) as unknown as Json as never,
      },
      { onConflict: "invitation_id" },
    );

    return { ...record, updatedAt: data.updated_at, publishedAt };
  },

  async archiveInvitation(slug: string): Promise<void> {
    const inv = await ensureInvitationRow(slug);
    await supabase.from("invitations").update({ status: "archived" }).eq("id", inv.id);
  },

  async resetDraft(slug: string): Promise<DraftRecord> {
    const inv = await ensureInvitationRow(slug);
    await supabase.from("invitation_drafts").delete().eq("invitation_id", inv.id);
    return this.loadDraft(slug);
  },
};
