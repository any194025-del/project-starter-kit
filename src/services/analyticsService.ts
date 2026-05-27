// Analytics service. Today: buffered console log. Tomorrow: supabase.insert or
// a /api/public/analytics edge endpoint. The UI calls track() and is unaware
// of where events land.

export type AnalyticsEvent =
  | "invitation_opened"
  | "section_viewed"
  | "music_played"
  | "music_paused"
  | "video_opened"
  | "rsvp_opened"
  | "rsvp_submitted"
  | "share_clicked";

interface EventPayload {
  invitationId?: string;
  guestId?: string;
  [key: string]: unknown;
}

interface BufferedEvent {
  event: AnalyticsEvent;
  payload: EventPayload;
  ts: string;
}

const buffer: BufferedEvent[] = [];

export const analyticsService = {
  async track(event: AnalyticsEvent, payload: EventPayload = {}): Promise<void> {
    const entry: BufferedEvent = {
      event,
      payload,
      ts: new Date().toISOString(),
    };
    buffer.push(entry);
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, payload);
    }
    // No await today — future: batched flush.
  },

  /** For debugging / future replay. */
  drain(): BufferedEvent[] {
    return buffer.splice(0, buffer.length);
  },
};
