import { createFileRoute } from "@tanstack/react-router";
import { BuilderStudio } from "@/components/builder/BuilderStudio";

export const Route = createFileRoute("/builder/$invitationId")({
  head: ({ params }) => ({
    meta: [
      { title: `Studio · ${params.invitationId}` },
      { name: "description", content: "No-code wedding invitation studio." },
    ],
  }),
  component: StudioRoute,
});

function StudioRoute() {
  const { invitationId } = Route.useParams();
  return <BuilderStudio invitationId={invitationId} />;
}
