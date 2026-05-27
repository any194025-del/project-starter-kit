import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { InvitationRenderer } from "@/renderer/InvitationRenderer";
import { invitationService } from "@/services/invitationService";
import { guestService } from "@/services/guestService";
import { ServiceError } from "@/services/_mockDelay";
import { InvitationFallback } from "@/components/invitation/InvitationFallback";
import { Preloader } from "@/components/layout/Preloader";

const personalisedQuery = (slug: string, guestId: string) =>
  queryOptions({
    queryKey: ["invitation", slug, "guest", guestId],
    queryFn: async () => {
      const doc = await invitationService.getBySlug(slug);
      const guest = await guestService.getById(doc.id, guestId);
      return { doc, guest };
    },
  });

export const Route = createFileRoute("/invite/$slug/$guestId")({
  head: ({ params }) => ({
    meta: [
      { title: `You're invited · ${params.slug}` },
      {
        name: "description",
        content: "Your personalised wedding invitation awaits.",
      },
      { property: "og:title", content: "You're invited" },
      {
        property: "og:description",
        content: "Open your personalised cinematic wedding invitation.",
      },
    ],
  }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      personalisedQuery(params.slug, params.guestId),
    ),
  component: PersonalisedRoute,
  pendingComponent: () => <Preloader label="Personalising" />,
  errorComponent: ({ error }) => {
    const notFound = error instanceof ServiceError && error.code === "not_found";
    return (
      <InvitationFallback
        title={notFound ? "Guest not found" : "Something went wrong"}
        message={
          notFound
            ? "This personalised invitation link is not valid or has expired."
            : error.message
        }
      />
    );
  },
  notFoundComponent: () => (
    <InvitationFallback
      title="Invitation not found"
      message="This invitation link is not valid."
    />
  ),
});

function PersonalisedRoute() {
  const { slug, guestId } = Route.useParams();
  const { data } = useSuspenseQuery(personalisedQuery(slug, guestId));
  return (
    <main className="min-h-[100dvh] w-full bg-black">
      <InvitationRenderer document={data.doc} guest={data.guest} />
    </main>
  );
}
