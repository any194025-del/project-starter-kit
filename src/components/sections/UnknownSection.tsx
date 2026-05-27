import type { SectionComponentProps } from "@/types/invitation";
import { PlaceholderBody } from "./placeholders";
export function UnknownSection(p: SectionComponentProps) {
  return <PlaceholderBody label="Unknown section type" section={p.section} />;
}
