import { createFileRoute, Outlet } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { invitationService } from "@/services/invitationService";
import { guestService } from "@/services/guestService";
import { ServiceError } from "@/services/_mockDelay";
import { InvitationFallback } from "@/components/invitation/InvitationFallback";
import { Preloader } from "@/components/layout/Preloader";

// Allow query-param based guest resolution: /invite/<slug>?g=<guestId>
// Path-based /invite/<slug>/<guestId> is still preferred for shareable links,
// but `?g=` enables embedding without rewriting URLs.
const validateInviteSearch = (search: Record<string, unknown>) => {
  const rawGuestId = search.g;
  const g = typeof rawGuestId === "string" ? rawGuestId.trim().slice(0, 64) : undefined;
  return { g: g || undefined };
};

export const invitationQuery = (slug: string, guestId?: string) =>
  queryOptions({
    queryKey: ["invitation", slug, "g", guestId ?? null],
    queryFn: async () => {
      const doc = await invitationService.getBySlug(slug);
      if (!guestId) return { doc, guest: null };
      try {
        const guest = await guestService.getById(doc.id, guestId);
        return { doc, guest };
      } catch {
        return { doc, guest: null };
      }
    },
  });

export const Route = createFileRoute("/invite/$slug")({
  validateSearch: validateInviteSearch,
  head: ({ params }) => ({
    meta: [
      { title: `Wedding Invitation · ${params.slug}` },
      {
        name: "description",
        content: "A cinematic personalised wedding invitation.",
      },
      { property: "og:title", content: `You're invited · ${params.slug}` },
      {
        property: "og:description",
        content: "Open your cinematic wedding invitation.",
      },
    ],
  }),
  component: () => <Outlet />,
  pendingComponent: () => <Preloader label="Opening" />,
  errorComponent: ({ error }) => (
    <InvitationFallback
      title={error instanceof ServiceError && error.code === "not_found"
        ? "Invitation not found"
        : "Something went wrong"}
      message={error.message}
    />
  ),
  notFoundComponent: () => (
    <InvitationFallback
      title="Invitation not found"
      message="This invitation link is not valid."
    />
  ),
});
