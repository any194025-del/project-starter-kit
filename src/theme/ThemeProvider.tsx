// Runtime theme provider. Wraps the renderer with a resolved template:
//  • exposes ResolvedTheme via useTheme()
//  • injects CSS variables on a wrapper div (all sections inherit them)
//  • lazy-injects the template's Google Fonts link once
//  • re-renders cheaply on template switch / overrides change
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import type { ResolvedTheme } from "@/types/template";
import { getTemplate } from "@/templates/registry";
import { resolveTheme, themeToCssVars } from "./resolveTheme";
import { useInvitationStore } from "@/context/invitationStore";

const ThemeCtx = createContext<ResolvedTheme | null>(null);

const injectedFonts = new Set<string>();
function ensureFonts(url?: string) {
  if (!url || injectedFonts.has(url) || typeof document === "undefined") return;
  injectedFonts.add(url);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

interface Props {
  /** Template id from the invitation document (e.g. doc.templateId). */
  templateId?: string;
  children: ReactNode;
}

export function ThemeProvider({ templateId, children }: Props) {
  const overrides = useInvitationStore((s) => s.themeOverrides);
  const activeTemplate = useInvitationStore((s) => s.activeTemplateId);

  const theme = useMemo(() => {
    const id = activeTemplate ?? templateId;
    return resolveTheme(getTemplate(id), overrides ?? undefined);
  }, [activeTemplate, templateId, overrides]);

  useEffect(() => {
    ensureFonts(theme.typography.googleFontsUrl);
  }, [theme.typography.googleFontsUrl]);

  const cssVars = useMemo(() => themeToCssVars(theme), [theme]);

  return (
    <ThemeCtx.Provider value={theme}>
      <div
        data-template={theme.template.meta.id}
        style={{
          ...cssVars,
          color: "var(--inv-text)",
          fontFamily: "var(--inv-font-body)",
          lineHeight: "var(--inv-body-leading)",
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeCtx.Provider>
  );
}

export function useTheme(): ResolvedTheme {
  const v = useContext(ThemeCtx);
  if (!v) {
    // Safe fallback so unwrapped previews don't crash.
    return resolveTheme(getTemplate());
  }
  return v;
}
