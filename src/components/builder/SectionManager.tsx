// Section manager: list, reorder, toggle, duplicate, remove, add.
// Storage of section configuration lives in the draft document (not in the
// runtime invitation store), so the renderer is fed it as a prop and treats
// it as read-only.
import { useMemo } from "react";
import { useBuilderStore } from "@/context/builderStore";
import { ADDABLE_SECTION_TYPES, getSectionSchema } from "@/builder/schemas";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SectionManager() {
  const document = useBuilderStore((s) => s.document);
  const selected = useBuilderStore((s) => s.selectedSectionKey);
  const select = useBuilderStore((s) => s.selectSection);
  const toggle = useBuilderStore((s) => s.toggleSection);
  const reorder = useBuilderStore((s) => s.reorderSections);
  const dup = useBuilderStore((s) => s.duplicateSection);
  const remove = useBuilderStore((s) => s.removeSection);
  const add = useBuilderStore((s) => s.addSection);

  const ordered = useMemo(() => {
    if (!document) return [];
    return Object.entries(document.pages)
      .map(([key, page]) => ({ key, ...page }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [document]);

  const move = (idx: number, dir: -1 | 1) => {
    const next = ordered.slice();
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    reorder(next.map((s) => s.key));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wide">Sections</h3>
          <p className="text-xs text-muted-foreground">Reorder, hide or duplicate.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-64 overflow-auto">
            {ADDABLE_SECTION_TYPES.map((t) => (
              <DropdownMenuItem key={t.type} onClick={() => add(t.type)}>
                {t.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1">
        {ordered.map((s, idx) => {
          const schema = getSectionSchema(s.type);
          const hidden = (s.order ?? 0) < 0;
          const active = selected === s.key;
          return (
            <div
              key={s.key}
              className={`group flex items-center gap-1 rounded-md border px-2 py-1.5 text-sm transition ${
                active
                  ? "border-primary/60 bg-primary/10"
                  : "border-border/40 bg-card/40 hover:border-border"
              } ${hidden ? "opacity-50" : ""}`}
            >
              <button
                type="button"
                className="flex-1 truncate text-left"
                onClick={() => select(s.key)}
              >
                <span className="font-medium">{schema.label}</span>
                <span className="ml-2 text-xs text-muted-foreground">{s.type}</span>
              </button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(idx, -1)}>
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(idx, 1)}>
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => toggle(s.key, hidden)}
              >
                {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => dup(s.key)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
              {schema.removable !== false && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-red-400"
                  onClick={() => remove(s.key)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          );
        })}
        {ordered.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No sections yet.</p>
        )}
      </div>
    </div>
  );
}
