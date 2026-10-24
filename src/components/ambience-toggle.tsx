"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "./language-provider";
import { startAmbience, stopAmbience, isAmbienceStarted } from "@/lib/ambience";

/* ------------------------------------------------------------------ */
/*  Ambience sound toggle — one tiny external store so the header      */
/*  button and the mobile-panel row stay in sync. Default OFF.         */
/*  The choice is remembered per browser session (sessionStorage):     */
/*  browsers refuse to start audio before a gesture, so a remembered   */
/*  ON waits for the first tap/keypress anywhere, then starts.         */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "ms-ambience";

let enabled = false;
const listeners = new Set<() => void>();

function setEnabled(next: boolean) {
  enabled = next;
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useAmbienceEnabled(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false // SSR snapshot — never render "on" on the server
  );
}

/* ---- pending gesture resume (for a remembered ON) ---------------- */

let pendingResume: (() => void) | null = null;

function cancelGestureResume() {
  if (pendingResume) {
    window.removeEventListener("pointerdown", pendingResume);
    window.removeEventListener("keydown", pendingResume);
    pendingResume = null;
  }
}

function armGestureResume() {
  if (pendingResume) return;
  const go = () => {
    pendingResume = null;
    void startAmbience();
  };
  pendingResume = go;
  window.addEventListener("pointerdown", go, { once: true });
  window.addEventListener("keydown", go, { once: true });
}

function persist(next: boolean) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    /* private mode — no memory, that's fine */
  }
}

/** One-shot restore of the session preference (idempotent). */
let restored = false;
function restorePreference() {
  if (restored) return;
  restored = true;
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") {
      setEnabled(true);
      armGestureResume();
    }
  } catch {
    /* ignore */
  }
}

export function toggleAmbience() {
  if (enabled && isAmbienceStarted()) {
    stopAmbience();
    cancelGestureResume();
    setEnabled(false);
    persist(false);
  } else {
    // Covers both fresh ON and a remembered-ON whose audio never started.
    cancelGestureResume();
    void startAmbience();
    setEnabled(true);
    persist(true);
  }
}

/** Compact icon toggle for the header row. */
export function AmbienceToggle({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  const on = useAmbienceEnabled();

  useEffect(() => {
    const raf = requestAnimationFrame(restorePreference);
    return () => cancelAnimationFrame(raf);
  }, []);

  const Icon = on ? Volume2 : VolumeX;

  return (
    <button
      type="button"
      onClick={toggleAmbience}
      aria-pressed={on}
      title={on ? t.sound.disable : t.sound.enable}
      aria-label={on ? t.sound.disable : t.sound.enable}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-olive transition-colors hover:bg-secondary aria-pressed:border-terracotta aria-pressed:bg-terracotta/10 aria-pressed:text-terracotta ${className}`}
    >
      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
    </button>
  );
}

/** Labelled row for the mobile navigation panel. */
export function AmbienceRow() {
  const { t } = useLanguage();
  const on = useAmbienceEnabled();

  useEffect(() => {
    const raf = requestAnimationFrame(restorePreference);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <button
      type="button"
      onClick={toggleAmbience}
      aria-pressed={on}
      className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-2 text-base font-medium text-olive transition-colors hover:text-terracotta"
    >
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
          on
            ? "border-terracotta bg-terracotta/10 text-terracotta"
            : "border-border bg-card text-olive"
        }`}
      >
        {on ? (
          <Volume2 className="h-4.5 w-4.5" aria-hidden="true" />
        ) : (
          <VolumeX className="h-4.5 w-4.5" aria-hidden="true" />
        )}
      </span>
      {t.sound.label}
      <span
        className={`ms-auto rounded-full px-2.5 py-1 text-xs font-semibold ${
          on ? "bg-terracotta/12 text-terracotta-dark" : "bg-olive/10 text-olive-mist"
        }`}
      >
        {on ? "ON" : "OFF"}
      </span>
    </button>
  );
}
