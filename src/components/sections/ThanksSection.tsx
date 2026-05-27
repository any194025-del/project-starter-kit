import type { SectionComponentProps } from "@/types/invitation";
import {
  DisplayTitle,
  Eyebrow,
  Body,
  Divider,
  SectionStack,
  Subtitle,
} from "@/components/ui/typography";

interface ThanksData {
  eyebrow?: string;
  title?: string;
  message?: string;
  signature?: string;
  closing?: string;
}

export function ThanksSection({ section }: SectionComponentProps) {
  const data = (section.data ?? {}) as ThanksData;

  return (
    <SectionStack className="my-auto py-12">
      <Eyebrow>{data.eyebrow || "With Gratitude"}</Eyebrow>
      <DisplayTitle>{data.title || "Thank You"}</DisplayTitle>
      <Divider glyph="❦" />
      {data.message ? <Subtitle className="max-w-[30ch]">{data.message}</Subtitle> : null}
      {data.closing ? <Body className="max-w-[30ch]">{data.closing}</Body> : null}
      {data.signature ? (
        <p
          className="mt-3 text-amber-100/90 text-lg italic tracking-[0.06em]"
          style={{ fontFamily: "'Cormorant Garamond',serif" }}
        >
          — {data.signature}
        </p>
      ) : null}
      <span
        aria-hidden
        className="mt-6 text-3xl text-amber-200/70"
        style={{ fontFamily: "'Cormorant Garamond',serif" }}
      >
        ॐ
      </span>
    </SectionStack>
  );
}
