// Guest service. Backed by Supabase `guests` (token = public-facing id).
import type { Guest } from "@/types/guest";
import { supabase } from "@/integrations/supabase/client";
import { ensureInvitationSeeded } from "@/lib/db-seed";
import { ServiceError } from "./_mockDelay";

type Row = {
  id: string;
  invitation_id: string;
  token: string;
  name: string;
  salutation: string | null;
  family: string | null;
  group_key: string | null;
  sa_parivar: boolean;
  max_guests: number | null;
  greeting: string | null;
  honorific: string | null;
  note: string | null;
};

function toGuest(row: Row, invitationSlug: string): Guest {
  return {
    id: row.token,
    invitationId: invitationSlug,
    name: row.name,
    salutation: (row.salutation ?? undefined) as Guest["salutation"],
    family: row.family ?? undefined,
    group: row.group_key ?? undefined,
    saParivar: row.sa_parivar,
    maxGuests: row.max_guests ?? undefined,
    greeting: row.greeting ?? undefined,
    honorific: row.honorific ?? undefined,
    note: row.note ?? undefined,
  };
}

async function resolveInvitationUuid(slug: string): Promise<string | null> {
  const { data } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (data?.id) return data.id as string;
  return ensureInvitationSeeded(slug);
}

export const guestService = {
  async getById(invitationSlug: string, guestToken: string): Promise<Guest> {
    const invitationUuid = await resolveInvitationUuid(invitationSlug);
    if (!invitationUuid) throw new ServiceError("not_found", `Invitation '${invitationSlug}' not found`);

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("invitation_id", invitationUuid)
      .eq("token", guestToken)
      .maybeSingle();
    if (error) throw new ServiceError("unknown", error.message);
    if (!data) throw new ServiceError("not_found", `Guest '${guestToken}' not found`);
    return toGuest(data as Row, invitationSlug);
  },

  async list(invitationSlug: string): Promise<Guest[]> {
    const invitationUuid = await resolveInvitationUuid(invitationSlug);
    if (!invitationUuid) return [];
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("invitation_id", invitationUuid)
      .order("created_at", { ascending: true });
    if (error) throw new ServiceError("unknown", error.message);
    return (data ?? []).map((r) => toGuest(r as Row, invitationSlug));
  },

  async create(invitationSlug: string, guest: Omit<Guest, "id" | "invitationId"> & { token?: string }): Promise<Guest> {
    const invitationUuid = await resolveInvitationUuid(invitationSlug);
    if (!invitationUuid) throw new ServiceError("not_found", `Invitation '${invitationSlug}' not found`);
    const token = guest.token ?? Math.random().toString(36).slice(2, 8);
    const { data, error } = await supabase
      .from("guests")
      .insert({
        invitation_id: invitationUuid,
        token,
        name: guest.name,
        salutation: guest.salutation,
        family: guest.family,
        group_key: guest.group,
        sa_parivar: guest.saParivar ?? false,
        max_guests: guest.maxGuests,
        greeting: guest.greeting,
        honorific: guest.honorific,
        note: guest.note,
      })
      .select("*")
      .single();
    if (error || !data) throw new ServiceError("unknown", error?.message ?? "Insert failed");
    return toGuest(data as Row, invitationSlug);
  },

  async update(invitationSlug: string, guestToken: string, patch: Partial<Guest>): Promise<Guest> {
    const invitationUuid = await resolveInvitationUuid(invitationSlug);
    if (!invitationUuid) throw new ServiceError("not_found", `Invitation '${invitationSlug}' not found`);
    const { data, error } = await supabase
      .from("guests")
      .update({
        name: patch.name,
        salutation: patch.salutation,
        family: patch.family,
        group_key: patch.group,
        sa_parivar: patch.saParivar,
        max_guests: patch.maxGuests,
        greeting: patch.greeting,
        honorific: patch.honorific,
        note: patch.note,
      })
      .eq("invitation_id", invitationUuid)
      .eq("token", guestToken)
      .select("*")
      .single();
    if (error || !data) throw new ServiceError("unknown", error?.message ?? "Update failed");
    return toGuest(data as Row, invitationSlug);
  },

  async remove(invitationSlug: string, guestToken: string): Promise<void> {
    const invitationUuid = await resolveInvitationUuid(invitationSlug);
    if (!invitationUuid) return;
    await supabase
      .from("guests")
      .delete()
      .eq("invitation_id", invitationUuid)
      .eq("token", guestToken);
  },
};
