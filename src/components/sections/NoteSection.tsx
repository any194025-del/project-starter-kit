import type { SectionComponentProps } from "@/types/invitation";
import {
  SectionTitle,
  Eyebrow,
  Body,
  Divider,
  SectionStack,
} from "@/components/ui/typography";

interface NoteData {
  eyebrow?: string;
  title?: string;
  body?: string;
  message?: string;
  paragraphs?: string[];
}

export function NoteSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as NoteData;
  const paragraphs =
    data.paragraphs && data.paragraphs.length
      ? data.paragraphs
      : data.body || data.message
        ? [data.body || data.message!]
        : [];

  return (
    <SectionStack className="my-auto py-12 max-w-[420px]">
      <Eyebrow>{data.eyebrow || "A Note"}</Eyebrow>
      {data.title ? <SectionTitle>{data.title}</SectionTitle> : null}
      <Divider glyph="·" />
      <div className="flex flex-col gap-4 text-center">
        {paragraphs.map((p, i) => (
          <Body key={i} className="text-amber-50/85 text-left sm:text-center">
            {p}
          </Body>
        ))}
      </div>
    </SectionStack>
  );
}
