import type { SectionComponentProps } from "@/types/invitation";

/**
 * Shared placeholder body. Phase 1 = no polished UI.
 * Each section file re-exports a thin wrapper so the registry stays simple.
 */
export function PlaceholderBody({
  label,
  section,
}: { label: string } & Pick<SectionComponentProps, "section">) {
  return (
    <div className="m-auto text-center text-white/90">
      <p className="text-xs uppercase tracking-[0.3em] opacity-60">{label}</p>
      <p className="mt-2 text-sm opacity-50">type: {section.type}</p>
      <p className="text-xs opacity-40">key: {section.key}</p>
    </div>
  );
}
