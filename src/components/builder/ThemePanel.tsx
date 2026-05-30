// No-code theme controls. Patches `themeOverrides` on the builder store,
// which the studio mirrors into the invitation runtime store so the live
// preview picks up changes instantly via ThemeProvider.
import { useBuilderStore } from "@/context/builderStore";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { RuntimeOverrides } from "@/types/template";

const COLOR_FIELDS: Array<{ key: "accent" | "bg" | "gold"; label: string }> = [
  { key: "accent", label: "Primary accent" },
  { key: "gold", label: "Secondary accent" },
  { key: "bg", label: "Background" },
];

export function ThemePanel() {
  const overrides = useBuilderStore((s) => s.themeOverrides);
  const patch = useBuilderStore((s) => s.patchThemeOverrides);
  const reset = useBuilderStore((s) => s.setThemeOverrides);

  const colors = (overrides?.tokens?.colors ?? {}) as Record<string, string>;
  const motion = overrides?.motion ?? {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wide">Theme</h3>
          <p className="text-xs text-muted-foreground">Tweak colors and motion live.</p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => reset(null)}>
          Reset
        </Button>
      </div>

      <div className="space-y-3">
        {COLOR_FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {f.label}
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors[f.key] ?? "#000000"}
                onChange={(e) =>
                  patch({ tokens: { colors: { [f.key]: e.target.value } } } as RuntimeOverrides)
                }
                className="h-8 w-12 cursor-pointer rounded border border-border/40 bg-transparent"
              />
              <input
                value={colors[f.key] ?? ""}
                onChange={(e) =>
                  patch({ tokens: { colors: { [f.key]: e.target.value } } } as RuntimeOverrides)
                }
                placeholder="#000000"
                className="flex-1 rounded border border-border/40 bg-transparent px-2 py-1 text-xs"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Animation intensity ({(motion.intensity ?? 1).toFixed(2)})
        </Label>
        <Slider
          min={0}
          max={1.5}
          step={0.05}
          value={[motion.intensity ?? 1]}
          onValueChange={([v]) => patch({ motion: { intensity: v } } as RuntimeOverrides)}
        />
      </div>
    </div>
  );
}
