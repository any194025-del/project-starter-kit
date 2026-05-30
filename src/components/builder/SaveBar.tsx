// Save bar. Dirty-state tracker + mock persistence; structured for an
// eventual swap to Supabase via `builderService`.
import { useBuilderStore, selectIsDirty } from "@/context/builderStore";
import { builderService } from "@/services/builderService";
import { validateInvitation } from "@/builder/validation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SaveBar() {
  const dirty = useBuilderStore(selectIsDirty);
  const saving = useBuilderStore((s) => s.saving);
  const lastSavedAt = useBuilderStore((s) => s.lastSavedAt);
  const document = useBuilderStore((s) => s.document);
  const themeOverrides = useBuilderStore((s) => s.themeOverrides);
  const invitationId = useBuilderStore((s) => s.invitationId);
  const setSaving = useBuilderStore((s) => s.setSaving);
  const markSaved = useBuilderStore((s) => s.markSaved);
  const setValidation = useBuilderStore((s) => s.setValidation);

  const save = async (publish = false) => {
    if (!invitationId || !document) return;
    const issues = validateInvitation(document);
    setValidation(issues);
    if (issues.length > 0) {
      toast.error(`${issues.length} validation issue${issues.length > 1 ? "s" : ""} to fix.`);
      return;
    }
    setSaving(true);
    try {
      const record = { id: invitationId, document, themeOverrides, updatedAt: "" };
      const next = publish
        ? await builderService.publishInvitation(record)
        : await builderService.saveDraft(record);
      markSaved(next.updatedAt);
      toast.success(publish ? "Invitation published" : "Draft saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 border-t border-border/40 bg-background/80 px-3 py-2 text-xs backdrop-blur">
      <div className="text-muted-foreground">
        {dirty ? (
          <span className="text-amber-400">● Unsaved changes</span>
        ) : lastSavedAt ? (
          <span>Saved {new Date(lastSavedAt).toLocaleTimeString()}</span>
        ) : (
          <span>No changes yet</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" disabled={!dirty || saving} onClick={() => save(false)}>
          {saving ? "Saving…" : "Save Draft"}
        </Button>
        <Button size="sm" disabled={saving} onClick={() => save(true)}>
          Publish
        </Button>
      </div>
    </div>
  );
}
