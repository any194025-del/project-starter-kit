import { create } from "zustand";

export type AssetLoadState = "idle" | "loading" | "ready" | "error";

interface InvitationState {
  currentIndex: number;
  totalSections: number;
  opened: boolean;
  audioPlaying: boolean;
  audioReady: boolean;
  assetState: AssetLoadState;
  /** Updated by SectionContainer; consumed by floating chrome for adaptive visibility. */
  scrolling: boolean;

  setTotal: (n: number) => void;
  goTo: (i: number) => void;
  next: () => void;
  prev: () => void;
  open: () => void;
  setAudioPlaying: (v: boolean) => void;
  setAudioReady: (v: boolean) => void;
  setAssetState: (s: AssetLoadState) => void;
  setScrolling: (v: boolean) => void;
}

export const useInvitationStore = create<InvitationState>((set, get) => ({
  currentIndex: 0,
  totalSections: 0,
  opened: false,
  audioPlaying: false,
  audioReady: false,
  assetState: "idle",
  scrolling: false,

  setTotal: (n) => set({ totalSections: n }),
  goTo: (i) => {
    const { totalSections } = get();
    if (totalSections === 0) return;
    const clamped = Math.max(0, Math.min(totalSections - 1, i));
    set({ currentIndex: clamped });
  },
  next: () => get().goTo(get().currentIndex + 1),
  prev: () => get().goTo(get().currentIndex - 1),
  open: () => set({ opened: true }),
  setAudioPlaying: (v) => set({ audioPlaying: v }),
  setAudioReady: (v) => set({ audioReady: v }),
  setAssetState: (s) => set({ assetState: s }),
  setScrolling: (v) => set({ scrolling: v }),
}));
