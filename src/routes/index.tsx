import { createFileRoute } from "@tanstack/react-router";
import { InvitationRenderer } from "@/renderer/InvitationRenderer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-[100dvh] w-full bg-black">
      <InvitationRenderer />
    </main>
  );
}
