"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { translations, type Dictionary, type Lang } from "@/lib/translations";

/* ------------------------------------------------------------------ */
/*  Language context — the engine behind the EN | AR toggle.           */
/*  · Persists the choice in localStorage ("ms-lang")                  */
/*  · Flips <html lang> + <html dir> so the whole document mirrors     */
/*  · Toggles the `lang-ar` class so CSS swaps fonts to Cairo          */
/* ------------------------------------------------------------------ */

type LanguageContextValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  isArabic: boolean;
  t: Dictionary;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "ms-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // English is the default render (and the SSR output) — the stored
  // preference is applied after mount to avoid hydration mismatches.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    // Deferred to a rAF callback so we never setState synchronously
    // inside the effect body (React 19 hooks lint rule).
    const raf = requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "ar" || saved === "en") {
        setLangState(saved);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    root.classList.toggle("lang-ar", lang === "ar");
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — language simply won't persist */
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      isArabic: lang === "ar",
      t: translations[lang],
      setLang,
    }),
    [lang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}
