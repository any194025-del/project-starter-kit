import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { InvitationRenderer } from "@/renderer/InvitationRenderer";
import { invitationService } from "@/services/invitationService";
import { ServiceError } from "@/services/_mockDelay";
import { InvitationFallback } from "@/components/invitation/InvitationFallback";
import { Preloader } from "@/components/layout/Preloader";

const invitationQuery = (slug: string) =>
  queryOptions({
    queryKey: ["invitation", slug],
    queryFn: () => invitationService.getBySlug(slug),
  });

export const Route = createFileRoute("/invite/$slug")({
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
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(invitationQuery(params.slug)),
  component: InvitationOnlyRoute,
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

function InvitationOnlyRoute() {
  const { slug } = Route.useParams();
  const { data: doc } = useSuspenseQuery(invitationQuery(slug));
  const router = useRouter();

  return (
    <main className="min-h-[100dvh] w-full bg-black">
      <InvitationRenderer document={doc} guest={null} />
      {/* Tiny dev-only helper: open with a sample guest. */}
      {import.meta.env.DEV ? (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 flex gap-2 text-[10px]">
          <Link
            to="/invite/$slug/$guestId"
            params={{ slug, guestId: "gj28ak" }}
            className="rounded-full bg-white/10 px-3 py-1 text-amber-100 backdrop-blur"
            onClick={() => router.invalidate()}
          >
            preview as guest
          </Link>
        </div>
      ) : null}
    </main>
  );
}
