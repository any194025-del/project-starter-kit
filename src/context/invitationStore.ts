import { create } from "zustand";
import type { Guest, Rsvp, AccessState } from "@/types/guest";
import type { InvitationDocument } from "@/types/invitation";

interface InvitationState {
  // Section / playback state (Phase 1–4)
  currentIndex: number;
  totalSections: number;
  opened: boolean;
  audioPlaying: boolean;
  audioReady: boolean;
  scrolling: boolean;

  // Phase 5: data + personalization layer
  invitation: InvitationDocument | null;
  guest: Guest | null;
  rsvp: Rsvp | null;
  accessState: AccessState;
  accessError?: string;
  viewedAt?: string;

  // Section / playback actions
  setTotal: (n: number) => void;
  goTo: (i: number) => void;
  next: () => void;
  prev: () => void;
  open: () => void;
  setAudioPlaying: (v: boolean) => void;
  setAudioReady: (v: boolean) => void;
  setScrolling: (v: boolean) => void;

  // Personalization actions
  setInvitation: (doc: InvitationDocument | null) => void;
  setGuest: (g: Guest | null) => void;
  setRsvp: (r: Rsvp | null) => void;
  setAccessState: (s: AccessState, error?: string) => void;
  reset: () => void;
}

const initial = {
  currentIndex: 0,
  totalSections: 0,
  opened: false,
  audioPlaying: false,
  audioReady: false,
  scrolling: false,
  invitation: null,
  guest: null,
  rsvp: null,
  accessState: "idle" as AccessState,
  accessError: undefined,
  viewedAt: undefined,
};

export const useInvitationStore = create<InvitationState>((set, get) => ({
  ...initial,

  setTotal: (n) => set({ totalSections: n }),
  goTo: (i) => {
    const { totalSections } = get();
    if (totalSections === 0) return;
    const clamped = Math.max(0, Math.min(totalSections - 1, i));
    set({ currentIndex: clamped });
  },
  next: () => get().goTo(get().currentIndex + 1),
  prev: () => get().goTo(get().currentIndex - 1),
  open: () => set({ opened: true, viewedAt: new Date().toISOString() }),
  setAudioPlaying: (v) => set({ audioPlaying: v }),
  setAudioReady: (v) => set({ audioReady: v }),
  setScrolling: (v) => set({ scrolling: v }),

  setInvitation: (doc) => set({ invitation: doc }),
  setGuest: (g) => set({ guest: g }),
  setRsvp: (r) => set({ rsvp: r }),
  setAccessState: (s, error) => set({ accessState: s, accessError: error }),
  reset: () => set({ ...initial }),
}));

// Convenience selectors (keeps re-renders narrow).
export const selectGuest = (s: InvitationState) => s.guest;
export const selectInvitation = (s: InvitationState) => s.invitation;
export const selectAccess = (s: InvitationState) => s.accessState;
