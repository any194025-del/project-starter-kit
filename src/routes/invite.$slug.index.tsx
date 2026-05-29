import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InvitationRenderer } from "@/renderer/InvitationRenderer";
import { Preloader } from "@/components/layout/Preloader";
import { invitationQuery, Route as ParentRoute } from "./invite.$slug";

export const Route = createFileRoute("/invite/$slug/")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(invitationQuery(params.slug, undefined)),
  component: InvitationOnlyRoute,
  pendingComponent: () => <Preloader label="Opening" />,
});

function InvitationOnlyRoute() {
  const { slug } = Route.useParams();
  const { g } = ParentRoute.useSearch();
  const { data } = useSuspenseQuery(invitationQuery(slug, g));
  const router = useRouter();

  return (
    <main className="min-h-[100dvh] w-full bg-black">
      <InvitationRenderer document={data.doc} guest={data.guest} />
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex gap-2 text-[10px] uppercase tracking-[0.3em]">
        <Link
          to="/invite/$slug/$guestId"
          params={{ slug, guestId: "gj28ak" }}
          className="rounded-full border border-amber-100/30 bg-black/40 px-3 py-1 text-amber-100 backdrop-blur"
          onClick={() => router.invalidate()}
        >
          Preview as Guest
        </Link>
      </div>
    </main>
  );
}
