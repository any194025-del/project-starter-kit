import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_SLUG } from "@/data/mock/invitations";

export const Route = createFileRoute("/builder/")({
  beforeLoad: () => {
    throw redirect({
      to: "/builder/$invitationId",
      params: { invitationId: DEFAULT_SLUG },
    });
  },
});
