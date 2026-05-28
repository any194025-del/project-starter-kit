import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { InvitationRenderer } from "@/renderer/InvitationRenderer";
import { invitationService } from "@/services/invitationService";
import { guestService } from "@/services/guestService";
import { ServiceError } from "@/services/_mockDelay";
import { InvitationFallback } from "@/components/invitation/InvitationFallback";
import { Preloader } from "@/components/layout/Preloader";

// Allow query-param based guest resolution: /invite/<slug>?g=<guestId>
// Path-based /invite/<slug>/<guestId> is still preferred for shareable links,
// but `?g=` enables embedding without rewriting URLs.
const searchSchema = z.object({
  g: fallback(z.string().min(1).max(64).optional(), undefined),
});

const invitationQuery = (slug: string, guestId?: string) =>
  queryOptions({
    queryKey: ["invitation", slug, "g", guestId ?? null],
    queryFn: async () => {
      const doc = await invitationService.getBySlug(slug);
      if (!guestId) return { doc, guest: null };
      try {
        const guest = await guestService.getById(doc.id, guestId);
        return { doc, guest };
      } catch {
        // Fallback: invitation still renders generically if guest lookup fails.
        return { doc, guest: null };
      }
    },
  });

export const Route = createFileRoute("/invite/$slug")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ g: search.g }),
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
  loader: ({ context, params, deps }) =>
    context.queryClient.ensureQueryData(invitationQuery(params.slug, deps.g)),
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
  const { g } = Route.useSearch();
  const { data } = useSuspenseQuery(invitationQuery(slug, g));
  const router = useRouter();

  return (
    <main className="min-h-[100dvh] w-full bg-black">
      <InvitationRenderer document={data.doc} guest={data.guest} />
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
