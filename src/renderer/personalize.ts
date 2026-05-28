// Renderer-level personalization layer.
// Walks any section data tree and replaces `{{token}}` placeholders with
// resolved guest/invitation values. This keeps personalization:
//   • schema-driven   — sections opt in by writing tokens in their JSON
//   • renderer-driven — no section needs its own personalization code
//   • template-safe   — works for any current/future template
//   • runtime-safe    — pure function, deterministic, SSR-friendly
import type { Guest } from "@/types/guest";
import type { InvitationDocument } from "@/types/invitation";

export interface PersonalizationTokens {
  guestName: string;
  salutation: string;
  honorific: string;
  displayName: string;
  family: string;
  parivar: string;
  greeting: string;
  coupleNames: string;
  [k: string]: string;
}

const FALLBACK_NAME = "Our Honoured Guest";
const FALLBACK_GREETING = "आदरणीय अतिथि";

export function buildTokens(
  doc: InvitationDocument | null | undefined,
  guest: Guest | null | undefined,
): PersonalizationTokens {
  const salutation = guest?.salutation ?? "";
  const honorific = guest?.honorific ?? "";
  const name = guest?.name ?? "";
  const displayName = guest
    ? [salutation, name, honorific].filter(Boolean).join(" ").trim()
    : FALLBACK_NAME;

  return {
    guestName: name || FALLBACK_NAME,
    salutation,
    honorific,
    displayName,
    family: guest?.family ?? "",
    parivar: guest?.saParivar ? "Sa Parivar" : "",
    greeting: guest?.greeting?.trim() || FALLBACK_GREETING,
    coupleNames: (doc?.meta?.coupleNames as string) ?? "",
  };
}

const TOKEN_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

function interpolateString(input: string, tokens: PersonalizationTokens): string {
  if (input.indexOf("{{") === -1) return input;
  return input.replace(TOKEN_RE, (_m, key: string) => {
    const v = tokens[key];
    return typeof v === "string" ? v : "";
  });
}

/**
 * Deep-clone a section.data tree and replace tokens inside every string leaf.
 * Returns the original reference if nothing changed (cheap identity check
 * keeps memoisation stable across transitions).
 */
export function personalizeData<T>(data: T, tokens: PersonalizationTokens): T {
  let mutated = false;

  const walk = (node: unknown): unknown => {
    if (typeof node === "string") {
      const next = interpolateString(node, tokens);
      if (next !== node) mutated = true;
      return next;
    }
    if (Array.isArray(node)) {
      const mapped = node.map(walk);
      return mapped;
    }
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        out[k] = walk(v);
      }
      return out;
    }
    return node;
  };

  const result = walk(data) as T;
  return mutated ? result : data;
}
