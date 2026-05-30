// Invitation metadata editor (couple, date, audio).
import { useBuilderStore } from "@/context/builderStore";
import { FieldRenderer } from "./FieldRenderer";
import type { FieldSchema } from "@/types/editor";

const META_FIELDS: FieldSchema[] = [
  { key: "coupleNames", label: "Couple names", type: "text", validation: { required: true } },
  { key: "weddingDate", label: "Wedding date", type: "datetime" },
  { key: "audioUrl", label: "Background music URL", type: "url" },
];

export function MetaEditor() {
  const meta = useBuilderStore((s) => s.document?.meta) ?? {};
  const patchMeta = useBuilderStore((s) => s.patchMeta);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold tracking-wide">Invitation Details</h3>
        <p className="text-xs text-muted-foreground">Core information about the wedding.</p>
      </div>
      {META_FIELDS.map((f) => (
        <FieldRenderer
          key={f.key}
          field={f}
          value={(meta as Record<string, unknown>)[f.key]}
          onChange={(v) => patchMeta({ [f.key]: v })}
        />
      ))}
    </div>
  );
}
