import { useCallback } from "react";
import { analyticsService, type AnalyticsEvent } from "@/services/analyticsService";
import { useInvitationStore } from "@/context/invitationStore";

/**
 * Thin React wrapper around analyticsService that auto-attaches the active
 * invitation + guest IDs. Components fire-and-forget.
 */
export function useAnalytics() {
  const invitation = useInvitationStore((s) => s.invitation);
  const guest = useInvitationStore((s) => s.guest);

  const track = useCallback(
    (event: AnalyticsEvent, payload: Record<string, unknown> = {}) => {
      void analyticsService.track(event, {
        invitationId: invitation?.id,
        guestId: guest?.id,
        ...payload,
      });
    },
    [invitation?.id, guest?.id],
  );

  return { track };
}
