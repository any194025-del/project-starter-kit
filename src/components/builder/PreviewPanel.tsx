// Live preview wrapper. Uses the SAME `InvitationRenderer` guests see — no
// separate preview tree. Viewport switching just resizes the frame; the
// renderer keeps its phone-frame layout internally.
import { useEffect, useMemo } from "react";
import { useBuilderStore } from "@/context/builderStore";
import { useInvitationStore } from "@/context/invitationStore";
import { InvitationRenderer } from "@/renderer/InvitationRenderer";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { PreviewViewport } from "@/context/builderStore";

const VIEWPORTS: Array<{ id: PreviewViewport; label: string; w: number; h: number; Icon: typeof Smartphone }> = [
  { id: "mobile", label: "Mobile", w: 390, h: 780, Icon: Smartphone },
  { id: "tablet", label: "Tablet", w: 720, h: 900, Icon: Tablet },
  { id: "desktop", label: "Desktop", w: 1080, h: 720, Icon: Monitor },
];

export function PreviewPanel() {
  const document = useBuilderStore((s) => s.document);
  const themeOverrides = useBuilderStore((s) => s.themeOverrides);
  const viewport = useBuilderStore((s) => s.previewViewport);
  const setViewport = useBuilderStore((s) => s.setPreviewViewport);

  // Filter hidden sections (order < 0) before handing the doc to the renderer.
  const previewDoc = useMemo(() => {
    if (!document) return null;
    const pages: typeof document.pages = {};
    for (const [k, v] of Object.entries(document.pages)) {
      if ((v.order ?? 0) >= 0) pages[k] = v;
    }
    return { ...document, pages };
  }, [document]);

  // Mirror template + theme overrides into the runtime store so ThemeProvider
  // picks up live changes (it reads from `invitationStore`).
  useEffect(() => {
    if (!previewDoc) return;
    useInvitationStore.setState({
      activeTemplateId: previewDoc.templateId,
      themeOverrides,
    });
  }, [previewDoc, themeOverrides]);

  const vp = VIEWPORTS.find((v) => v.id === viewport) ?? VIEWPORTS[0];

  if (!previewDoc) return null;

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950">
      <div className="flex items-center justify-center gap-1 border-b border-border/30 bg-background/60 px-2 py-1.5">
        {VIEWPORTS.map(({ id, label, Icon }) => (
          <Button
            key={id}
            size="sm"
            variant={viewport === id ? "default" : "ghost"}
            onClick={() => setViewport(id)}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </Button>
        ))}
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        <div
          className="overflow-hidden rounded-2xl border border-border/30 bg-black shadow-2xl"
          style={{ width: Math.min(vp.w, 1200), height: vp.h, maxWidth: "100%", maxHeight: "100%" }}
        >
          <InvitationRenderer key={previewDoc.id} document={previewDoc} />
        </div>
      </div>
    </div>
  );
}
