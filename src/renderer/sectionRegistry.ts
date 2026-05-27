import type { ComponentType } from "react";
import type { SectionComponentProps } from "@/types/invitation";
import { SplashSection } from "@/components/sections/SplashSection";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { EventsSection } from "@/components/sections/EventsSection";
import { VenueSection } from "@/components/sections/VenueSection";
import { WishesSection } from "@/components/sections/WishesSection";
import { ThanksSection } from "@/components/sections/ThanksSection";
import { GuestsSection } from "@/components/sections/GuestsSection";
import { NoteSection } from "@/components/sections/NoteSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { UnknownSection } from "@/components/sections/UnknownSection";

export type SectionComponent = ComponentType<SectionComponentProps>;

// Map of `type` -> component. Keys are SECTION TYPES, not JSON object keys.
export const sectionRegistry: Record<string, SectionComponent> = {
  splash: SplashSection,
  countdown: CountdownSection,
  gallery: GallerySection,
  couple: GallerySection, // alias
  events: EventsSection,
  venue: VenueSection,
  wishes: WishesSection,
  thanks: ThanksSection,
  guests: GuestsSection,
  family: GuestsSection, // alias
  note: NoteSection,
  video: VideoSection,
};

export function resolveSectionComponent(type: string): SectionComponent {
  return sectionRegistry[type] ?? UnknownSection;
}
