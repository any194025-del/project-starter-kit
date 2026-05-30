// Preset gallery. Presets only patch templateId + themeOverrides; section
// content is never overwritten.
import { useBuilderStore } from "@/context/builderStore";
import { PRESETS } from "@/builder/presets";
import { Button } from "@/components/ui/button";

export function PresetGallery() {
  const setTemplateId = useBuilderStore((s) => s.setTemplateId);
  const setThemeOverrides = useBuilderStore((s) => s.setThemeOverrides);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold tracking-wide">Presets</h3>
        <p className="text-xs text-muted-foreground">One-click style starters.</p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p.id}
            type="button"
            variant="secondary"
            className="h-auto justify-start py-3 text-left"
            onClick={() => {
              setTemplateId(p.templateId);
              setThemeOverrides(p.themeOverrides ?? null);
            }}
          >
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-[11px] font-normal text-muted-foreground">{p.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
