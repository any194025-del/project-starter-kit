// Builder draft store. Intentionally separate from `invitationStore` so the
// guest-facing runtime is never polluted by editor state. The studio writes
// previewable changes into `invitationStore` (template id + theme overrides)
// imperatively; the draft document is passed to the renderer as a prop.
import { create } from "zustand";
import type { InvitationDocument, InvitationSection } from "@/types/invitation";
import type { RuntimeOverrides } from "@/types/template";
import type { ValidationIssue } from "@/types/editor";

export type PreviewViewport = "mobile" | "tablet" | "desktop";

interface BuilderState {
  invitationId: string | null;
  document: InvitationDocument | null;
  baseline: InvitationDocument | null; // last saved snapshot for dirty diffing
  themeOverrides: RuntimeOverrides | null;
  themeBaseline: RuntimeOverrides | null;

  selectedSectionKey: string | null;
  previewViewport: PreviewViewport;
  saving: boolean;
  loading: boolean;
  lastSavedAt: string | null;
  validation: ValidationIssue[];

  // lifecycle
  initFromDraft: (args: {
    id: string;
    document: InvitationDocument;
    themeOverrides: RuntimeOverrides | null;
    lastSavedAt: string | null;
  }) => void;
  markSaved: (savedAt: string) => void;
  setSaving: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setValidation: (issues: ValidationIssue[]) => void;

  // document edits
  patchMeta: (patch: Partial<InvitationDocument["meta"]>) => void;
  patchSectionData: (key: string, patch: Record<string, unknown>) => void;
  setSectionField: (key: string, fieldPath: string, value: unknown) => void;
  toggleSection: (key: string, visible: boolean) => void;
  reorderSections: (orderedKeys: string[]) => void;
  duplicateSection: (key: string) => void;
  removeSection: (key: string) => void;
  addSection: (type: string) => void;

  // template + theme
  setTemplateId: (id: string) => void;
  setThemeOverrides: (o: RuntimeOverrides | null) => void;
  patchThemeOverrides: (o: RuntimeOverrides) => void;

  // selection + viewport
  selectSection: (key: string | null) => void;
  setPreviewViewport: (v: PreviewViewport) => void;
}

function deepSet(obj: Record<string, unknown>, path: string, value: unknown) {
  // supports dot paths and "items[2].caption" style indices
  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  let cursor: Record<string, unknown> | unknown[] = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    const next = segments[i + 1];
    const nextIsIndex = /^\d+$/.test(next);
    const cur = (cursor as Record<string, unknown>)[seg];
    if (cur === undefined || cur === null) {
      (cursor as Record<string, unknown>)[seg] = nextIsIndex ? [] : {};
    }
    cursor = (cursor as Record<string, unknown>)[seg] as Record<string, unknown>;
  }
  (cursor as Record<string, unknown>)[segments[segments.length - 1]] = value;
}

function cloneDoc(doc: InvitationDocument): InvitationDocument {
  return structuredClone(doc);
}

function nextOrder(doc: InvitationDocument): number {
  const orders = Object.values(doc.pages).map((p) => p.order ?? 0);
  return (orders.length ? Math.max(...orders) : 0) + 1;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  invitationId: null,
  document: null,
  baseline: null,
  themeOverrides: null,
  themeBaseline: null,
  selectedSectionKey: null,
  previewViewport: "mobile",
  saving: false,
  loading: false,
  lastSavedAt: null,
  validation: [],

  initFromDraft: ({ id, document, themeOverrides, lastSavedAt }) =>
    set({
      invitationId: id,
      document,
      baseline: cloneDoc(document),
      themeOverrides,
      themeBaseline: themeOverrides,
      lastSavedAt,
      selectedSectionKey: null,
    }),

  markSaved: (savedAt) => {
    const { document, themeOverrides } = get();
    set({
      lastSavedAt: savedAt,
      baseline: document ? cloneDoc(document) : null,
      themeBaseline: themeOverrides,
      saving: false,
    });
  },

  setSaving: (saving) => set({ saving }),
  setLoading: (loading) => set({ loading }),
  setValidation: (validation) => set({ validation }),

  patchMeta: (patch) =>
    set((s) => {
      if (!s.document) return s;
      const next = cloneDoc(s.document);
      next.meta = { ...next.meta, ...patch };
      return { document: next };
    }),

  patchSectionData: (key, patch) =>
    set((s) => {
      if (!s.document?.pages[key]) return s;
      const next = cloneDoc(s.document);
      next.pages[key].data = { ...(next.pages[key].data as object), ...patch };
      return { document: next };
    }),

  setSectionField: (key, fieldPath, value) =>
    set((s) => {
      if (!s.document?.pages[key]) return s;
      const next = cloneDoc(s.document);
      const data = (next.pages[key].data as Record<string, unknown>) ?? {};
      deepSet(data, fieldPath, value);
      next.pages[key].data = data;
      return { document: next };
    }),

  toggleSection: (key, visible) =>
    set((s) => {
      if (!s.document?.pages[key]) return s;
      const next = cloneDoc(s.document);
      // hidden sections are kept in the document but ordered out via negative order
      next.pages[key].order = visible ? Math.abs(next.pages[key].order ?? 1) : -1;
      return { document: next };
    }),

  reorderSections: (orderedKeys) =>
    set((s) => {
      if (!s.document) return s;
      const next = cloneDoc(s.document);
      orderedKeys.forEach((k, i) => {
        if (next.pages[k]) next.pages[k].order = i + 1;
      });
      return { document: next };
    }),

  duplicateSection: (key) =>
    set((s) => {
      if (!s.document?.pages[key]) return s;
      const next = cloneDoc(s.document);
      const src = next.pages[key];
      const newKey = `${key}_copy_${Date.now().toString(36)}`;
      next.pages[newKey] = {
        ...structuredClone(src),
        order: nextOrder(next),
      } as Omit<InvitationSection, "key">;
      return { document: next, selectedSectionKey: newKey };
    }),

  removeSection: (key) =>
    set((s) => {
      if (!s.document?.pages[key]) return s;
      const next = cloneDoc(s.document);
      delete next.pages[key];
      return {
        document: next,
        selectedSectionKey: s.selectedSectionKey === key ? null : s.selectedSectionKey,
      };
    }),

  addSection: (type) =>
    set((s) => {
      if (!s.document) return s;
      const next = cloneDoc(s.document);
      const newKey = `${type}_${Date.now().toString(36)}`;
      next.pages[newKey] = {
        type,
        order: nextOrder(next),
        data: {},
      } as Omit<InvitationSection, "key">;
      return { document: next, selectedSectionKey: newKey };
    }),

  setTemplateId: (id) =>
    set((s) => {
      if (!s.document) return s;
      const next = cloneDoc(s.document);
      next.templateId = id;
      return { document: next };
    }),

  setThemeOverrides: (themeOverrides) => set({ themeOverrides }),
  patchThemeOverrides: (o) =>
    set((s) => ({
      themeOverrides: {
        ...(s.themeOverrides ?? {}),
        ...o,
        tokens: {
          ...(s.themeOverrides?.tokens ?? {}),
          ...(o.tokens ?? {}),
          colors: {
            ...(s.themeOverrides?.tokens?.colors ?? {}),
            ...(o.tokens?.colors ?? {}),
          },
        },
        motion: { ...(s.themeOverrides?.motion ?? {}), ...(o.motion ?? {}) },
        typography: { ...(s.themeOverrides?.typography ?? {}), ...(o.typography ?? {}) },
        layout: { ...(s.themeOverrides?.layout ?? {}), ...(o.layout ?? {}) },
      } as RuntimeOverrides,
    })),

  selectSection: (selectedSectionKey) => set({ selectedSectionKey }),
  setPreviewViewport: (previewViewport) => set({ previewViewport }),
}));

export const selectIsDirty = (s: BuilderState): boolean => {
  if (!s.document || !s.baseline) return false;
  if (JSON.stringify(s.document) !== JSON.stringify(s.baseline)) return true;
  if (JSON.stringify(s.themeOverrides) !== JSON.stringify(s.themeBaseline)) return true;
  return false;
};
