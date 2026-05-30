// Invitation Studio shell.
// Loads a draft via `builderService` and renders editor + live preview.
// Desktop: split-screen. Mobile: editor/preview toggle.
import { useEffect, useState } from "react";
import { useBuilderStore } from "@/context/builderStore";
import { builderService } from "@/services/builderService";
import { EditorPanel } from "./EditorPanel";
import { PreviewPanel } from "./PreviewPanel";
import { SaveBar } from "./SaveBar";
import { Preloader } from "@/components/layout/Preloader";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";

export function BuilderStudio({ invitationId }: { invitationId: string }) {
  const initFromDraft = useBuilderStore((s) => s.initFromDraft);
  const loading = useBuilderStore((s) => s.loading);
  const setLoading = useBuilderStore((s) => s.setLoading);
  const ready = useBuilderStore((s) => s.document?.id === invitationId);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    builderService
      .loadDraft(invitationId)
      .then((rec) => {
        if (!alive) return;
        initFromDraft({
          id: rec.id,
          document: rec.document,
          themeOverrides: rec.themeOverrides,
          lastSavedAt: rec.updatedAt ?? null,
        });
      })
      .catch(() => {
        // Renderer-less screen handles the missing-id case
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [invitationId, initFromDraft, setLoading]);

  if (loading || !ready) return <Preloader label="Loading studio" />;

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-2">
        <div>
          <h1 className="text-sm font-semibold tracking-wide">Invitation Studio</h1>
          <p className="text-[11px] text-muted-foreground">{invitationId}</p>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Button
            size="sm"
            variant={mobileView === "edit" ? "default" : "secondary"}
            onClick={() => setMobileView("edit")}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            size="sm"
            variant={mobileView === "preview" ? "default" : "secondary"}
            onClick={() => setMobileView("preview")}
          >
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside
          className={`${
            mobileView === "edit" ? "flex" : "hidden"
          } w-full flex-col border-r border-border/40 bg-background/40 md:flex md:w-[380px] lg:w-[420px]`}
        >
          <EditorPanel />
        </aside>
        <section
          className={`${mobileView === "preview" ? "flex" : "hidden"} flex-1 md:flex`}
        >
          <PreviewPanel />
        </section>
      </div>

      <SaveBar />
    </div>
  );
}
