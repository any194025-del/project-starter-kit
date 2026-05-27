import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_SLUG } from "@/data/mock/invitations";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Landing → default invitation preview (no specific guest)
    throw redirect({
      to: "/invite/$slug",
      params: { slug: DEFAULT_SLUG },
    });
  },
});
