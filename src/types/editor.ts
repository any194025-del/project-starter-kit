// Schema-driven editor types.
// Section/field/template-agnostic: any future section becomes editable simply
// by registering a SectionSchema in `src/builder/schemas.ts`.

export type FieldType =
  | "text"
  | "textarea"
  | "richline"     // single-line, slightly nicer affordance
  | "number"
  | "date"
  | "datetime"
  | "url"
  | "color"
  | "image"
  | "select"
  | "boolean"
  | "list";        // array of object items, edited via nested fields

export interface FieldValidation {
  required?: boolean;
  min?: number;     // for number, or string min length
  max?: number;
  pattern?: string; // RegExp source
}

export interface FieldSchema {
  /** Dot-path inside section.data, e.g. "title" or "events[].place". */
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  options?: Array<{ label: string; value: string }>;
  /** For list fields: schema of each item. */
  itemFields?: FieldSchema[];
  /** Default value for newly added list items. */
  defaultItem?: Record<string, unknown>;
  validation?: FieldValidation;
  /** If true, token tags like {{displayName}} are allowed in this field. */
  supportsTokens?: boolean;
}

export interface SectionSchema {
  type: string;                // section.type
  label: string;               // display name in the section manager
  icon?: string;               // optional lucide icon name
  description?: string;
  fields: FieldSchema[];
  /** Whether this section can be removed from the invitation. */
  removable?: boolean;
  /** Whether the user can add multiple instances of this section. */
  multiInstance?: boolean;
}

export interface ValidationIssue {
  sectionKey?: string;
  fieldKey: string;
  message: string;
}
