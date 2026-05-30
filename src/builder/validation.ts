// Schema-driven validation. Pure functions; no React, no store.
import type { FieldSchema, ValidationIssue } from "@/types/editor";
import type { InvitationDocument } from "@/types/invitation";
import { getSectionSchema } from "./schemas";

function getAtPath(obj: unknown, key: string): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  return (obj as Record<string, unknown>)[key];
}

function validateField(
  value: unknown,
  field: FieldSchema,
  sectionKey: string,
  pathPrefix = "",
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fullKey = pathPrefix ? `${pathPrefix}.${field.key}` : field.key;

  if (field.validation?.required) {
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);
    if (empty) {
      issues.push({ sectionKey, fieldKey: fullKey, message: `${field.label} is required` });
    }
  }
  if (field.type === "url" && typeof value === "string" && value && !/^https?:\/\//i.test(value)) {
    issues.push({ sectionKey, fieldKey: fullKey, message: `${field.label} must be a valid URL` });
  }
  if (field.type === "datetime" && typeof value === "string" && value && isNaN(Date.parse(value))) {
    issues.push({ sectionKey, fieldKey: fullKey, message: `${field.label} must be a valid date` });
  }
  if (field.type === "list" && Array.isArray(value) && field.itemFields) {
    value.forEach((item, idx) => {
      for (const sub of field.itemFields!) {
        const v = getAtPath(item, sub.key);
        issues.push(...validateField(v, sub, sectionKey, `${fullKey}[${idx}]`));
      }
    });
  }
  return issues;
}

export function validateInvitation(doc: InvitationDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const [key, section] of Object.entries(doc.pages)) {
    const schema = getSectionSchema(section.type);
    for (const field of schema.fields) {
      const v = getAtPath(section.data, field.key);
      issues.push(...validateField(v, field, key));
    }
  }
  return issues;
}
