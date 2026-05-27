import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useInvitationStore } from "@/context/invitationStore";

interface AudioApi {
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
}

const AudioContext = createContext<AudioApi | null>(null);

interface Props {
  src?: string;
  children: ReactNode;
}

/**
 * Persistent audio instance. NEVER autoplays.
 * Playback only after explicit user interaction (calling .play()/.toggle()).
 */
export function AudioProvider({ src, children }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const setAudioPlaying = useInvitationStore((s) => s.setAudioPlaying);
  const setAudioReady = useInvitationStore((s) => s.setAudioReady);

  if (!audioRef.current && typeof Audio !== "undefined") {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.preload = "none";
  }

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (src && el.src !== src) {
      el.src = src;
      el.load();
    }
    const onPlay = () => setAudioPlaying(true);
    const onPause = () => setAudioPlaying(false);
    const onReady = () => setAudioReady(true);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("canplay", onReady);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("canplay", onReady);
    };
  }, [src, setAudioPlaying, setAudioReady]);

  const api = useMemo<AudioApi>(
    () => ({
      play: async () => {
        const el = audioRef.current;
        if (!el || !el.src) return;
        try {
          await el.play();
        } catch {
          /* user gesture required — ignore */
        }
      },
      pause: () => audioRef.current?.pause(),
      toggle: async () => {
        const el = audioRef.current;
        if (!el || !el.src) return;
        if (el.paused) {
          try {
            await el.play();
          } catch {
            /* ignore */
          }
        } else {
          el.pause();
        }
      },
    }),
    [],
  );

  return <AudioContext.Provider value={api}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
