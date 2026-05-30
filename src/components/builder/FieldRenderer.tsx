// Generic field renderer driven by FieldSchema.
// Every editable input the studio exposes goes through here, so adding a new
// field type means adding one switch arm — not editing N forms.
import { useMemo } from "react";
import type { FieldSchema } from "@/types/editor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  field: FieldSchema;
  value: unknown;
  onChange: (next: unknown) => void;
}

function toDateTimeLocal(iso: string | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export function FieldRenderer({ field, value, onChange }: Props) {
  const id = useMemo(() => `f-${field.key}-${Math.random().toString(36).slice(2, 7)}`, [field.key]);

  if (field.type === "list") {
    const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {field.label}
          </Label>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              onChange([...items, structuredClone(field.defaultItem ?? {})])
            }
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-md border border-border/60 bg-card/40 p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>#{idx + 1}</span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => {
                    const next = items.slice();
                    next.splice(idx, 1);
                    onChange(next);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-3">
                {(field.itemFields ?? []).map((sub) => (
                  <FieldRenderer
                    key={sub.key}
                    field={sub}
                    value={item?.[sub.key]}
                    onChange={(v) => {
                      const next = items.slice();
                      next[idx] = { ...next[idx], [sub.key]: v };
                      onChange(next);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No items yet.</p>
          )}
        </div>
      </div>
    );
  }

  const common = {
    id,
    placeholder: field.placeholder,
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {field.label}
        {field.validation?.required && <span className="text-red-400"> *</span>}
      </Label>

      {field.type === "textarea" && (
        <Textarea
          {...common}
          value={(value as string) ?? ""}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {(field.type === "text" || field.type === "richline") && (
        <Input
          {...common}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "url" && (
        <Input {...common} type="url" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}

      {field.type === "image" && (
        <div className="space-y-1.5">
          <Input {...common} type="url" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
          {typeof value === "string" && value && (
            <img
              src={value}
              alt=""
              className="h-16 w-16 rounded object-cover border border-border/40"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
          )}
        </div>
      )}

      {field.type === "number" && (
        <Input
          {...common}
          type="number"
          value={(value as number) ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        />
      )}

      {field.type === "datetime" && (
        <Input
          {...common}
          type="datetime-local"
          value={toDateTimeLocal(value as string | undefined)}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v ? new Date(v).toISOString() : "");
          }}
        />
      )}

      {field.type === "date" && (
        <Input {...common} type="date" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
      )}

      {field.type === "color" && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={(value as string) ?? "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded border border-border/40 bg-transparent"
          />
          <Input value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} className="flex-1" />
        </div>
      )}

      {field.type === "select" && (
        <Select value={(value as string) ?? ""} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder ?? "Select"} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === "boolean" && (
        <div className="flex items-center gap-2">
          <Switch checked={Boolean(value)} onCheckedChange={onChange} />
          <span className="text-xs text-muted-foreground">{value ? "Enabled" : "Disabled"}</span>
        </div>
      )}

      {field.help && <p className="text-[11px] text-muted-foreground">{field.help}</p>}
      {field.supportsTokens && (
        <p className="text-[10px] text-muted-foreground/70 italic">
          Tokens supported: {"{{displayName}}, {{coupleNames}}, {{greeting}}"}
        </p>
      )}
    </div>
  );
}
