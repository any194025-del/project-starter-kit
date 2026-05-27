// Domain types for guest identity, groups and RSVP.
// These mirror the shape we'd model in Supabase tables.
// The UI consumes ONLY these types — never raw JSON.

export type Salutation = "Mr." | "Mrs." | "Ms." | "Shri" | "Smt." | "Dr." | "";

export interface Guest {
  id: string;
  invitationId: string;
  /** Display name (may include salutation). */
  name: string;
  salutation?: Salutation;
  /** Family / thikana label, e.g. "Sharma Parivaar, Jaipur". */
  family?: string;
  /** Group key (e.g. "brides_family", "vip", "friends"). */
  group?: string;
  /** Sa Parivar — invite the whole family. */
  saParivar?: boolean;
  /** Maximum invitees in this guest's plus-N allowance. */
  maxGuests?: number;
  /** Optional preferred personalised greeting override. */
  greeting?: string;
  /** Optional honorific suffix, e.g. "ji". */
  honorific?: string;
  /** Free-form note shown to the guest. */
  note?: string;
}

export type RsvpStatus = "pending" | "attending" | "maybe" | "declined";

export interface Rsvp {
  invitationId: string;
  guestId: string;
  status: RsvpStatus;
  guestCount: number;
  message?: string;
  respondedAt?: string; // ISO
}

export type AccessState =
  | "idle"
  | "loading"
  | "ready"
  | "not_found"
  | "expired"
  | "error";

export interface InvitationSummary {
  id: string;
  slug: string;
  coupleNames: string;
  weddingDate?: string;
}
