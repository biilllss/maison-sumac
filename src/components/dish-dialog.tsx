"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Images,
  Minus,
  Plus,
  Share2,
  ShoppingBasket,
  Star,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { useLanguage } from "./language-provider";
import { useOrder } from "./order-tray";
import { TagChips } from "./dietary-chips";
import { FadeImage } from "./fade-image";
import { IMAGES } from "@/lib/images";
import { MENU, type MenuItem } from "@/lib/menu-data";
import { GALLERY_INDEX_BY_DISH } from "@/lib/gallery-dishes";

const ITEM_BY_ID = new Map<string, MenuItem>(
  MENU.flatMap((cat) => cat.items.map((item) => [item.id, item]))
);

const RECENT_KEY = "ms-recent-dishes";
const RECENT_MAX = 6;

/** Clipboard with a safety net: the async API first, then the legacy
    execCommand path — in-app browser webviews (where much of a
    WhatsApp-first audience lives) often lock the async API. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Dish detail dialog — photo, badges, full story and tray controls.  */
/*  Exposed via DishDialogProvider so the menu AND the gallery can     */
/*  open it (gallery tiles that picture a dish jump straight here).    */
/*  With siblings passed, footer gains prev/next navigation (RTL       */
/*  aware, keyboard arrows work) and a position counter.               */
/* ------------------------------------------------------------------ */

type OpenOptions = { siblings?: MenuItem[] };

type DishDialogContextValue = {
  openDish: (item: MenuItem, opts?: OpenOptions) => void;
  /** Dishes opened this browser session (most recent first). */
  recent: MenuItem[];
  clearRecent: () => void;
};

const DishDialogContext = createContext<DishDialogContextValue | null>(null);

export function useDishDialog(): DishDialogContextValue {
  const ctx = useContext(DishDialogContext);
  if (!ctx) {
    throw new Error("useDishDialog must be used inside <DishDialogProvider>");
  }
  return ctx;
}

export function DishDialogProvider({ children }: { children: React.ReactNode }) {
  const { t, lang, isArabic } = useLanguage();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [siblings, setSiblings] = useState<MenuItem[]>([]);
  const [open, setOpen] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const recentHydrated = useRef(false);
  // "Link copied" feedback for the share button (resets per dish/open).
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  // Restore recently-viewed ids once on mount (rAF pattern).
  // localStorage keeps the memory across sessions; a one-time migration
  // lifts ids saved by earlier builds from sessionStorage.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        let saved = window.localStorage.getItem(RECENT_KEY);
        if (!saved) {
          saved = window.sessionStorage.getItem(RECENT_KEY);
          if (saved) {
            window.localStorage.setItem(RECENT_KEY, saved);
            window.sessionStorage.removeItem(RECENT_KEY);
          }
        }
        if (saved) {
          const ids = JSON.parse(saved);
          if (Array.isArray(ids)) {
            setRecentIds(
              ids.filter((id) => typeof id === "string" && ITEM_BY_ID.has(id))
            );
          }
        }
      } catch {
        /* corrupted storage — start empty */
      }
      recentHydrated.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Persist after hydration.
  useEffect(() => {
    if (!recentHydrated.current) return;
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds));
    } catch {
      /* private mode — no memory, that's fine */
    }
  }, [recentIds]);

  const openDish = useCallback((next: MenuItem, opts?: OpenOptions) => {
    setItem(next);
    setSiblings(opts?.siblings ?? []);
    setOpen(true);
    setCopied(false);
    setRecentIds((prev) =>
      [next.id, ...prev.filter((id) => id !== next.id)].slice(0, RECENT_MAX)
    );
    // Tell the "recently viewed" chips row to pulse the arrival.
    window.dispatchEvent(
      new CustomEvent("ms-recent-added", { detail: { id: next.id } })
    );
  }, []);

  const clearRecent = useCallback(() => setRecentIds([]), []);

  /** Share the dish via the OS sheet when available, otherwise copy a
      mention + link to the clipboard. Cancelling the share sheet stays
      quiet; a clipboard success flips the inline "copied" feedback. */
  const shareDish = useCallback(async () => {
    if (!item) return;
    const url = `${window.location.origin}${window.location.pathname}#menu`;
    const text = `${item.name[lang]} — ${t.brand.name}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: t.brand.name, text, url });
        return; // shared — nothing else to do
      } catch (err) {
        // user cancel (AbortError) → respect it; real failure → copy instead
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    const ok = await copyText(`${text}\n${url}`);
    if (ok) {
      setCopied(true);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2200);
    }
  }, [item, lang, t.brand.name]);

  // Clear the feedback timer if the provider unmounts mid-feedback.
  useEffect(() => {
    return () => {
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
    };
  }, []);

  /** Close the dialog, then glide down to the gallery section and
      flash the dish's tile so the eye lands on it. Skips the glide
      for reduced-motion users (the flash still marks the tile). */
  const goToGallery = useCallback(() => {
    const index = item ? GALLERY_INDEX_BY_DISH[item.id] : undefined;
    setOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById("gallery");
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      if (typeof index === "number") {
        // let the scroll settle before the flash starts
        window.setTimeout(
          () =>
            window.dispatchEvent(
              new CustomEvent("ms-gallery-flash", { detail: { index } })
            ),
          reduce ? 150 : 650
        );
      }
    });
  }, [item]);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setItem((current) => {
        if (!current || siblings.length < 2) return current;
        const idx = siblings.findIndex((s) => s.id === current.id);
        if (idx === -1) return current;
        return siblings[(idx + dir + siblings.length) % siblings.length]!;
      });
    },
    [siblings]
  );

  const value = useMemo(
    () => ({
      openDish,
      clearRecent,
      recent: recentIds
        .map((id) => ITEM_BY_ID.get(id))
        .filter((e): e is MenuItem => e !== undefined),
    }),
    [openDish, clearRecent, recentIds]
  );

  const idx = item ? siblings.findIndex((s) => s.id === item.id) : -1;
  const showNav = siblings.length > 1 && idx !== -1;
  // RTL mirrors flex order, so the arrow glyphs swap with the layout.
  const PrevIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextIcon = isArabic ? ChevronLeft : ChevronRight;
  const locale = lang === "ar" ? "ar-LB" : "en-US";
  const onNavKey = (e: React.KeyboardEvent) => {
    if (!showNav) return;
    if (e.key === "ArrowRight") navigate(isArabic ? -1 : 1);
    else if (e.key === "ArrowLeft") navigate(isArabic ? 1 : -1);
  };

  return (
    <DishDialogContext.Provider value={value}>
      {children}

      {item ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            showCloseButton={false}
            onKeyDown={onNavKey}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] gap-0 overflow-y-auto overflow-x-hidden rounded-2xl border-olive/15 bg-card p-0 shadow-[0_32px_80px_-32px_rgba(59,74,50,0.5)] sm:max-w-md"
          >
            {/* RTL-safe close + share over the photo */}
            <DialogClose
              aria-label={t.menu.details.close}
              className="absolute end-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-olive shadow-sm transition-colors hover:bg-cream hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </DialogClose>
            <button
              type="button"
              onClick={shareDish}
              aria-label={copied ? t.menu.details.copied : t.menu.details.share}
              className="absolute end-14 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-olive shadow-sm transition-colors hover:bg-cream hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
            >
              {copied ? (
                <Check className="h-4 w-4 text-terracotta" aria-hidden="true" />
              ) : (
                <Share2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            {/* screen-reader confirmation for the clipboard fallback */}
            <span aria-live="polite" className="sr-only">
              {copied ? t.menu.details.copied : ""}
            </span>

            {/* photo — bottom edge scallops into the card like a ticket stub;
                the berry loader covers the stream-in (FadeImage), a soft
                vignette adds editorial depth at the bottom */}
            <div className="ticket-edge relative aspect-[5/3] w-full bg-cream-deep">
              {IMAGES.menu[item.id] ? (
                <FadeImage
                  key={item.id}
                  src={IMAGES.menu[item.id] ?? ""}
                  alt={`${item.name[lang]} — Maison Sumac`}
                  sizes="(max-width: 640px) 100vw, 448px"
                  vignette
                />
              ) : null}
              {/* favorite pill over the image */}
              {item.favorite ? (
                <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-cream/90 px-2.5 py-1 text-[11px] font-semibold text-terracotta-dark shadow-sm">
                  <Star
                    className="h-3 w-3 fill-terracotta text-terracotta"
                    aria-hidden="true"
                  />
                  {t.menu.favorite}
                </span>
              ) : null}
            </div>

            {/* body */}
            <div className="p-5 pb-0 sm:p-6 sm:pb-0">
              <DialogTitle className="font-display text-2xl leading-snug text-olive">
                {item.name[lang]}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm leading-relaxed text-olive/70">
                {item.desc[lang]}
              </DialogDescription>

              {item.tags && item.tags.length > 0 ? (
                <div className="mt-3">
                  <TagChips tags={item.tags} />
                </div>
              ) : null}

              {/* the story */}
              <div className="mt-4 rounded-xl border border-olive/10 bg-cream-deep/50 p-4">
                <p className="text-[11px] font-bold uppercase text-terracotta-dark">
                  {t.menu.details.storyTitle}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-olive/80">
                  {item.story[lang]}
                </p>
              </div>

              {/* dishes that also live in the gallery get a jump link —
                  closes the story and glides to the photo grid */}
              {item.id in GALLERY_INDEX_BY_DISH ? (
                <button
                  type="button"
                  onClick={goToGallery}
                  className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-full text-sm font-semibold text-terracotta-dark transition-colors hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
                >
                  <Images className="h-4 w-4" aria-hidden="true" />
                  {t.menu.details.inGallery}
                  <span aria-hidden="true" className="text-terracotta">
                    {isArabic ? "←" : "→"}
                  </span>
                </button>
              ) : null}

              {/* price …… tray controls + dish nav — sticky so the CTA
                  never scrolls away, even on very short screens */}
              <div className="sticky bottom-0 -mx-5 mt-5 rounded-b-2xl border-t border-border/70 bg-card px-5 pb-5 pt-3 shadow-[0_-14px_28px_-20px_rgba(59,74,50,0.45)] sm:-mx-6 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="shrink-0 font-display text-2xl font-semibold tabular-nums text-terracotta">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="dot-leader flex-1" aria-hidden="true" />
                  <TrayControls item={item} />
                </div>

                {/* prev / counter / next — only when a sibling list was given */}
                {showNav ? (
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      aria-label={t.menu.dishNav.prev}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-olive/20 text-olive transition-all hover:border-terracotta hover:bg-terracotta hover:text-cream active:scale-90"
                    >
                      <PrevIcon className="h-4.5 w-4.5" aria-hidden="true" />
                    </button>
                    <span
                      aria-live="polite"
                      className="font-display text-sm text-olive-mist"
                      dir="ltr"
                    >
                      {(idx + 1).toLocaleString(locale)} / {siblings.length.toLocaleString(locale)}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(1)}
                      aria-label={t.menu.dishNav.next}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-olive/20 text-olive transition-all hover:border-terracotta hover:bg-terracotta hover:text-cream active:scale-90"
                    >
                      <NextIcon className="h-4.5 w-4.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </DishDialogContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Tray controls inside the dialog — Add, or a − qty + stepper when   */
/*  the dish is already in the order.                                  */
/* ------------------------------------------------------------------ */

function TrayControls({ item }: { item: MenuItem }) {
  const { t, lang } = useLanguage();
  const { has, add, inc, dec, entries } = useOrder();
  const inTray = has(item.id);
  const qty = entries.find((e) => e.item.id === item.id)?.qty ?? 0;
  const locale = lang === "ar" ? "ar-LB" : "en-US";

  if (!inTray) {
    return (
      <button
        type="button"
        onClick={() => add(item.id)}
        aria-label={t.orderTray.addItem(item.name[lang])}
        className="micro-lift inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-terracotta-dark"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {t.orderTray.add}
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="me-1 hidden items-center gap-1.5 text-xs font-medium text-olive-mist sm:inline-flex">
        <ShoppingBasket className="h-3.5 w-3.5" aria-hidden="true" />
        {t.menu.dishNav.inOrder}
      </span>
      <button
        type="button"
        onClick={() => dec(item.id)}
        aria-label={t.orderTray.decItem}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-olive/25 text-olive transition-all hover:border-terracotta hover:text-terracotta active:scale-90"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className="min-w-[1.75rem] text-center font-display text-xl font-semibold text-olive"
      >
        {qty.toLocaleString(locale)}
      </span>
      <button
        type="button"
        onClick={() => inc(item.id)}
        aria-label={t.orderTray.incItem}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-terracotta text-cream transition-all hover:bg-terracotta-dark active:scale-90"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
