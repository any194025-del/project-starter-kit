// Section schema registry — single source of truth for what fields each
// section type exposes to the no-code editor. Keep this template-agnostic.
import type { SectionSchema } from "@/types/editor";

const eyebrow = { key: "eyebrow", label: "Eyebrow", type: "text" as const };
const title = { key: "title", label: "Title", type: "text" as const, validation: { required: true } };
const description = { key: "description", label: "Description", type: "textarea" as const, supportsTokens: true };

export const SECTION_SCHEMAS: Record<string, SectionSchema> = {
  splash: {
    type: "splash",
    label: "Splash / Welcome",
    description: "Cinematic opening shown before the invitation unfolds.",
    removable: false,
    fields: [
      { key: "welcomeTitle", label: "Welcome title", type: "text" },
      { key: "welcomeSubtitle", label: "Couple names", type: "text" },
      { key: "welcomeDescription", label: "Welcome message", type: "textarea", supportsTokens: true },
      { key: "ctaLabel", label: "Open button label", type: "text" },
      { key: "loadingLabel", label: "Loading label", type: "text" },
    ],
  },
  countdown: {
    type: "countdown",
    label: "Countdown",
    fields: [
      eyebrow,
      title,
      { key: "targetDate", label: "Wedding date & time", type: "datetime", validation: { required: true } },
      { key: "weddingDateText", label: "Date label", type: "text" },
      { key: "weddingTimeText", label: "Time label", type: "text" },
    ],
  },
  gallery: {
    type: "gallery",
    label: "Gallery",
    fields: [
      eyebrow,
      title,
      description,
      {
        key: "images",
        label: "Images",
        type: "list",
        defaultItem: { src: "", caption: "" },
        itemFields: [
          { key: "src", label: "Image URL", type: "image", validation: { required: true } },
          { key: "caption", label: "Caption", type: "text" },
        ],
      },
    ],
  },
  video: {
    type: "video",
    label: "Video",
    fields: [
      eyebrow,
      title,
      description,
      { key: "thumbnail", label: "Thumbnail URL", type: "image" },
      { key: "youtubeUrl", label: "YouTube URL", type: "url" },
      { key: "duration", label: "Duration label", type: "text" },
    ],
  },
  events: {
    type: "events",
    label: "Events",
    fields: [
      eyebrow,
      title,
      description,
      {
        key: "events",
        label: "Events",
        type: "list",
        defaultItem: { title: "New Event", date: "", time: "", place: "", notes: "" },
        itemFields: [
          { key: "title", label: "Title", type: "text", validation: { required: true } },
          { key: "date", label: "Date", type: "text" },
          { key: "time", label: "Time", type: "text" },
          { key: "place", label: "Place", type: "text" },
          { key: "notes", label: "Notes", type: "textarea" },
          { key: "image", label: "Image URL", type: "image" },
        ],
      },
    ],
  },
  venue: {
    type: "venue",
    label: "Venue",
    fields: [
      eyebrow,
      title,
      { key: "name", label: "Venue name", type: "text" },
      { key: "address", label: "Address", type: "textarea" },
      { key: "date", label: "Date", type: "text" },
      { key: "time", label: "Time", type: "text" },
      { key: "notes", label: "Notes", type: "text" },
      { key: "image", label: "Venue image", type: "image" },
      { key: "mapUrl", label: "Map URL", type: "url" },
      { key: "phone", label: "Contact phone", type: "text" },
    ],
  },
  guests: {
    type: "guests",
    label: "Family",
    fields: [
      eyebrow,
      title,
      {
        key: "groups",
        label: "Family groups",
        type: "list",
        defaultItem: { title: "New Family", members: [] },
        itemFields: [
          { key: "title", label: "Group title", type: "text", validation: { required: true } },
        ],
      },
    ],
  },
  wishes: {
    type: "wishes",
    label: "Wishes",
    fields: [
      eyebrow,
      title,
      {
        key: "messages",
        label: "Wishes",
        type: "list",
        defaultItem: { from: "", relation: "", category: "friend", message: "" },
        itemFields: [
          { key: "from", label: "From", type: "text", validation: { required: true } },
          { key: "relation", label: "Relation", type: "text" },
          {
            key: "category",
            label: "Category",
            type: "select",
            options: [
              { label: "Blessing", value: "blessing" },
              { label: "Family", value: "family" },
              { label: "Friend", value: "friend" },
            ],
          },
          { key: "message", label: "Message", type: "textarea" },
        ],
      },
    ],
  },
  note: {
    type: "note",
    label: "Note",
    fields: [
      eyebrow,
      title,
      {
        key: "paragraphs",
        label: "Paragraphs",
        type: "list",
        defaultItem: { value: "" },
        itemFields: [
          { key: "value", label: "Paragraph", type: "textarea", supportsTokens: true },
        ],
      },
    ],
  },
  thanks: {
    type: "thanks",
    label: "Thank You",
    removable: false,
    fields: [
      eyebrow,
      title,
      { key: "message", label: "Message", type: "textarea", supportsTokens: true },
      { key: "closing", label: "Closing line", type: "text" },
      { key: "signature", label: "Signature", type: "text" },
    ],
  },
};

export function getSectionSchema(type: string): SectionSchema {
  return (
    SECTION_SCHEMAS[type] ?? {
      type,
      label: type,
      fields: [],
    }
  );
}

/** Section types available to add from the section manager. */
export const ADDABLE_SECTION_TYPES = Object.values(SECTION_SCHEMAS).map((s) => ({
  type: s.type,
  label: s.label,
}));
