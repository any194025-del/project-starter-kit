// RSVP service. Backed by Supabase `rsvps` keyed by (invitation_id uuid, guest_id uuid).
import type { Rsvp, RsvpStatus } from "@/types/guest";
import { supabase } from "@/integrations/supabase/client";
import { ServiceError } from "./_mockDelay";

export interface RsvpInput {
  invitationId: string; // slug
  guestId: string; // token
  status: RsvpStatus;
  guestCount?: number;
  message?: string;
}

async function resolveIds(invitationSlug: string, guestToken: string) {
  const { data: inv } = await supabase
    .from("invitations").select("id").eq("slug", invitationSlug).maybeSingle();
  if (!inv) throw new ServiceError("not_found", "Invitation not found");
  const { data: guest } = await supabase
    .from("guests").select("id").eq("invitation_id", inv.id).eq("token", guestToken).maybeSingle();
  if (!guest) throw new ServiceError("not_found", "Guest not found");
  return { invitationUuid: inv.id as string, guestUuid: guest.id as string };
}

export const rsvpService = {
  async get(invitationSlug: string, guestToken: string): Promise<Rsvp | null> {
    try {
      const { invitationUuid, guestUuid } = await resolveIds(invitationSlug, guestToken);
      const { data } = await supabase
        .from("rsvps")
        .select("status, guest_count, message, responded_at")
        .eq("invitation_id", invitationUuid)
        .eq("guest_id", guestUuid)
        .maybeSingle();
      if (!data) return null;
      return {
        invitationId: invitationSlug,
        guestId: guestToken,
        status: data.status as RsvpStatus,
        guestCount: data.guest_count,
        message: data.message ?? undefined,
        respondedAt: data.responded_at,
      };
    } catch {
      return null;
    }
  },

  async submit(input: RsvpInput): Promise<Rsvp> {
    const { invitationUuid, guestUuid } = await resolveIds(input.invitationId, input.guestId);
    const respondedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("rsvps")
      .upsert(
        {
          invitation_id: invitationUuid,
          guest_id: guestUuid,
          status: input.status,
          guest_count: Math.max(1, input.guestCount ?? 1),
          message: input.message,
          responded_at: respondedAt,
        },
        { onConflict: "invitation_id,guest_id" },
      )
      .select("status, guest_count, message, responded_at")
      .single();
    if (error || !data) throw new ServiceError("unknown", error?.message ?? "RSVP failed");
    return {
      invitationId: input.invitationId,
      guestId: input.guestId,
      status: data.status as RsvpStatus,
      guestCount: data.guest_count,
      message: data.message ?? undefined,
      respondedAt: data.responded_at,
    };
  },
};
