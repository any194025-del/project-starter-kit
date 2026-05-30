// Template switcher. Only the templateId changes; sections, content and
// personalization are preserved because the renderer treats templates as
// pure presentation config.
import { useBuilderStore } from "@/context/builderStore";
import { listTemplates } from "@/templates/registry";
import { Button } from "@/components/ui/button";

export function TemplateSwitcher() {
  const templateId = useBuilderStore((s) => s.document?.templateId);
  const setTemplateId = useBuilderStore((s) => s.setTemplateId);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold tracking-wide">Template</h3>
        <p className="text-xs text-muted-foreground">
          Switch presentation; content stays intact.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {listTemplates().map((t) => {
          const active = templateId === t.meta.id;
          return (
            <Button
              key={t.meta.id}
              type="button"
              variant={active ? "default" : "secondary"}
              className="h-auto justify-start py-3 text-left"
              onClick={() => setTemplateId(t.meta.id)}
            >
              <div>
                <div className="font-semibold">{t.meta.name}</div>
                {t.meta.description && (
                  <div className="text-[11px] font-normal text-muted-foreground">
                    {t.meta.description}
                  </div>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
