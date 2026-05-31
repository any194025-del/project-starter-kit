// One-shot seeding bridge from mock data into Supabase.
// Runs lazily on the first miss for a given slug. Keeps the existing
// /invite/aarav-weds-bhavya URLs working immediately after Phase 8 lands.
import { supabase } from "@/integrations/supabase/client";
import { MOCK_INVITATIONS } from "@/data/mock/invitations";
import { MOCK_GUESTS } from "@/data/mock/guests";

const inflight = new Map<string, Promise<string | null>>();

/**
 * Ensure the invitation for `slug` exists in DB. Returns its uuid, or null if
 * we don't have a seed for it. Idempotent — concurrent callers share one promise.
 */
export function ensureInvitationSeeded(slug: string): Promise<string | null> {
  const existing = inflight.get(slug);
  if (existing) return existing;
  const p = (async () => {
    // 1. Try fetch
    const { data: found } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (found?.id) return found.id as string;

    // 2. Seed from mock if we have one
    const mock = MOCK_INVITATIONS[slug];
    if (!mock) return null;

    const { data: inserted, error } = await supabase
      .from("invitations")
      .insert({
        slug,
        template_id: mock.templateId,
        status: "published",
        document: { ...mock, id: slug },
        published_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error || !inserted) return null;

    const invitationUuid = inserted.id as string;

    // 3. Seed associated guests
    const guests = MOCK_GUESTS.filter((g) => g.invitationId === slug);
    if (guests.length > 0) {
      await supabase.from("guests").insert(
        guests.map((g) => ({
          invitation_id: invitationUuid,
          token: g.id,
          name: g.name,
          salutation: g.salutation,
          family: g.family,
          group_key: g.group,
          sa_parivar: g.saParivar ?? false,
          max_guests: g.maxGuests,
          greeting: g.greeting,
          honorific: g.honorific,
          note: g.note,
        })),
      );
    }

    return invitationUuid;
  })();
  inflight.set(slug, p);
  return p;
}
