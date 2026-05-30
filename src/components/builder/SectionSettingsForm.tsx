// Schema-driven section settings form for the currently selected section.
import { useBuilderStore } from "@/context/builderStore";
import { getSectionSchema } from "@/builder/schemas";
import { FieldRenderer } from "./FieldRenderer";

function getAtPath(obj: unknown, key: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
}

export function SectionSettingsForm() {
  const selectedKey = useBuilderStore((s) => s.selectedSectionKey);
  const section = useBuilderStore((s) =>
    s.document && selectedKey ? s.document.pages[selectedKey] : null,
  );
  const setField = useBuilderStore((s) => s.setSectionField);

  if (!selectedKey || !section) {
    return (
      <div className="rounded-md border border-dashed border-border/40 p-6 text-center text-xs text-muted-foreground">
        Select a section to edit its content.
      </div>
    );
  }

  const schema = getSectionSchema(section.type);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold tracking-wide">{schema.label}</h3>
        {schema.description && (
          <p className="text-xs text-muted-foreground">{schema.description}</p>
        )}
      </div>
      <div className="space-y-4">
        {schema.fields.map((f) => (
          <FieldRenderer
            key={f.key}
            field={f}
            value={getAtPath(section.data, f.key)}
            onChange={(v) => setField(selectedKey, f.key, v)}
          />
        ))}
        {schema.fields.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No editable fields for this section.</p>
        )}
      </div>
    </div>
  );
}
