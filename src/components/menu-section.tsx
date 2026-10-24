"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Clock,
  Plus,
  Printer,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "./language-provider";
import { useOrder } from "./order-tray";
import { useDishDialog } from "./dish-dialog";
import { TagChips, TAG_ICONS } from "./dietary-chips";
import { waOrderUrl } from "@/lib/config";
import { WhatsAppIcon } from "./icons";
import { MENU, MENU_VERSION, type DietaryTag, type MenuItem } from "@/lib/menu-data";
import { getPopularCategory, type PopularCategory } from "@/lib/hours";
import { SITE_CONFIG } from "@/lib/config";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ------------------------------------------------------------------ */
/*  Menu — tabbed categories, dotted price leaders, favorite badges.   */
/*  Dietary filter chips (remembered) + bilingual search across all    */
/*  categories with highlighted matches. Tapping a dish name opens a   */
/*  detail dialog (photo + story + add-to-tray). The "Popular now"     */
/*  badge follows the Beirut clock (see hours.ts).                     */
/* ------------------------------------------------------------------ */

type Filter = "all" | DietaryTag;

const FILTERS: Filter[] = ["all", "vegetarian", "vegan", "glutenFree"];

const FILTER_KEY = "ms-menu-filter";
const VERSION_KEY = "ms-menu-version";
const PRICES_KEY = "ms-menu-prices";

/** A price that moved between the stored snapshot and the current menu. */
type PriceDiff = { id: string; from: number; to: number };

/** Case/diacritic-insensitive normalizer so "أوبيه" finds "Awbeh". */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "") // Arabic diacritics + tatweel
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

/* ------------------------------------------------------------------ */
/*  Search-match highlighting that survives normalization: we walk     */
/*  the original string once, build the normalized form while keeping  */
/*  an index map back to the original, then find the query inside it.  */
/* ------------------------------------------------------------------ */

function buildNormIndexMap(s: string): { norm: string; map: number[] } {
  const norm: string[] = [];
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (/[\u064B-\u0652\u0640]/.test(ch)) continue; // stripped chars
    const lower = ch.toLowerCase();
    let out = lower;
    if (/[أإآ]/.test(lower)) out = "ا";
    else if (lower === "ى") out = "ي";
    else if (lower === "ة") out = "ه";
    for (const c of out) {
      norm.push(c);
      map.push(i);
    }
  }
  return { norm: norm.join(""), map };
}

function highlightParts(
  text: string,
  q: string
): { text: string; hit: boolean }[] {
  if (!q) return [{ text, hit: false }];
  const { norm, map } = buildNormIndexMap(text);
  const idx = norm.indexOf(q);
  if (idx === -1 || map.length === 0) return [{ text, hit: false }];
  const start = map[idx]!;
  const end = map[Math.min(idx + q.length - 1, map.length - 1)]! + 1;
  return [
    { text: text.slice(0, start), hit: false },
    { text: text.slice(start, end), hit: true },
    { text: text.slice(end), hit: false },
  ];
}

/** Highlights the (already-normalized) query inside `text` — or plain. */
function Highlight({ text, q }: { text: string; q?: string }) {
  if (!q) return <>{text}</>;
  const parts = highlightParts(text, q);
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className="hl-mark">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

const matchesFilter = (tags: DietaryTag[] | undefined, filter: Filter) =>
  filter === "all" || (tags?.includes(filter) ?? false);

/* ------------------------------------------------------------------ */
/*  One dish row — shared between tab browsing and search results.     */
/*  The dish name is a button that opens the detail dialog.            */
/* ------------------------------------------------------------------ */

function MenuRow({
  item,
  popularNow = false,
  siblings,
  q,
}: {
  item: MenuItem;
  popularNow?: boolean;
  siblings?: MenuItem[];
  q?: string;
}) {
  const { t, lang } = useLanguage();
  const { has, add, inc } = useOrder();
  const { openDish } = useDishDialog();
  const inTray = has(item.id);

  return (
    <li className="group rounded-xl border-b border-border/60 px-3 py-4 transition-colors last:border-0 hover:bg-cream-deep/60 sm:py-5">
      {/* name …… price + add row */}
      <div className="flex items-baseline">
        <h3 className="font-display text-lg text-olive sm:text-xl">
          <button
            type="button"
            onClick={() => openDish(item, siblings ? { siblings } : undefined)}
            aria-haspopup="dialog"
            className="dish-link rounded-sm text-start font-display transition-colors hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <Highlight text={item.name[lang]} q={q} />
          </button>
        </h3>
        {popularNow ? (
          <span
            className="ms-2 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-terracotta px-2.5 py-0.5 text-[11px] font-semibold text-cream"
            title={t.menu.popular}
          >
            <span className="popular-dot" aria-hidden="true" />
            {t.menu.popular}
          </span>
        ) : null}
        {item.favorite ? (
          <span className="fav-tag ms-2 inline-flex shrink-0 items-center gap-1 rounded-[4px] border border-terracotta/30 bg-terracotta/12 ps-3 pe-2 py-0.5 text-[11px] font-semibold text-terracotta-dark">
            <Star className="h-3 w-3 fill-terracotta text-terracotta" aria-hidden="true" />
            {t.menu.favorite}
          </span>
        ) : null}
        <span className="dot-leader" aria-hidden="true" />
        <span className="ms-2 shrink-0 font-display text-lg font-semibold tabular-nums text-terracotta sm:text-xl">
          ${item.price.toFixed(2)}
        </span>
        {/* add to tray */}
        <button
          type="button"
          onClick={() => (inTray ? inc(item.id) : add(item.id))}
          aria-label={t.orderTray.addItem(item.name[lang])}
          className={`ms-2 inline-flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border transition-all active:scale-90 print:hidden ${
            inTray
              ? "border-terracotta bg-terracotta text-cream"
              : "border-olive/25 text-olive hover:border-terracotta hover:bg-terracotta hover:text-cream"
          }`}
        >
          {inTray ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-olive/70">
        <Highlight text={item.desc[lang]} q={q} />
      </p>
      {/* dietary tag chips */}
      {item.tags && item.tags.length > 0 ? (
        <div className="mt-2">
          <TagChips tags={item.tags} />
        </div>
      ) : null}
    </li>
  );
}

export function MenuSection() {
  const { t, lang, isArabic } = useLanguage();
  const { openDish, recent, clearRecent } = useDishDialog();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("breakfast"); // controlled — the "Show them" CTA jumps here
  const filterHydrated = useRef(false);
  // The just-viewed chip pulses once when it lands in the row — the eye
  // finds it without hunting (ms-recent-added from the dish dialog).
  const [flashRecentId, setFlashRecentId] = useState<string | null>(null);
  const flashTimer = useRef<number | null>(null);

  useEffect(() => {
    const onAdded = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (!id) return;
      setFlashRecentId(id);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => setFlashRecentId(null), 1500);
    };
    window.addEventListener("ms-recent-added", onAdded);
    return () => {
      window.removeEventListener("ms-recent-added", onAdded);
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
    };
  }, []);

  // Detail dialog is global (gallery opens it too) — no local state needed.

  // "/" anywhere on the page jumps into menu search — a small paper-menu
  // habit: grab a pencil, look up a dish. Skips when typing elsewhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      ) {
        return;
      }
      const input = document.getElementById("menu-search");
      if (input) {
        e.preventDefault();
        input.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // "Popular now" — Beirut-clock based, computed after mount (rAF pattern,
  // never sync setState in an effect). window.__msRecomputePopular is a small
  // QA handle; window.__msPopularOverride forces a category from the console.
  const [popular, setPopular] = useState<PopularCategory | null>(null);
  useEffect(() => {
    const w = window as unknown as {
      __msPopularOverride?: PopularCategory | null;
      __msRecomputePopular?: () => void;
    };
    const recompute = () => {
      setPopular(
        w.__msPopularOverride !== undefined
          ? w.__msPopularOverride
          : getPopularCategory()
      );
    };
    const raf = requestAnimationFrame(() => {
      recompute();
      w.__msRecomputePopular = recompute;
    });
    return () => {
      cancelAnimationFrame(raf);
      delete w.__msRecomputePopular;
    };
  }, []);

  // Restore the last chosen dietary filter once on mount (rAF pattern —
  // never sync setState in an effect), then persist every change.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(FILTER_KEY);
        if (saved && (FILTERS as string[]).includes(saved)) {
          setFilter(saved as Filter);
        }
      } catch {
        /* private mode — no memory, that's fine */
      }
      filterHydrated.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!filterHydrated.current) return;
    try {
      window.localStorage.setItem(FILTER_KEY, filter);
    } catch {
      /* ignore */
    }
  }, [filter]);

  // "The menu changed" nudge — a returning visitor (a stored menu
  // version that differs from the current MENU_VERSION) gets a small
  // olive note above the menu tools, plus the prices that moved since
  // the stored snapshot. First visits store silently; dismissing
  // stores the current version + snapshot until the next change.
  const [menuChanged, setMenuChanged] = useState(false);
  const [priceDiffs, setPriceDiffs] = useState<PriceDiff[]>([]);
  /** Dishes the stored snapshot has never heard of — brand new arrivals. */
  const [newIds, setNewIds] = useState<string[]>([]);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const seen = window.localStorage.getItem(VERSION_KEY);
        const currentPrices: Record<string, number> = {};
        for (const cat of MENU) {
          for (const item of cat.items) currentPrices[item.id] = item.price;
        }
        const saveState = () => {
          window.localStorage.setItem(VERSION_KEY, MENU_VERSION);
          window.localStorage.setItem(PRICES_KEY, JSON.stringify(currentPrices));
        };
        if (seen === null) {
          saveState();
        } else if (seen !== MENU_VERSION) {
          setMenuChanged(true);
          try {
            const old = JSON.parse(
              window.localStorage.getItem(PRICES_KEY) ?? "{}"
            ) as Record<string, unknown>;
            const diffs: PriceDiff[] = [];
            const arrivals: string[] = [];
            for (const cat of MENU) {
              for (const item of cat.items) {
                const prev = old[item.id];
                if (typeof prev === "number" && prev !== item.price) {
                  diffs.push({ id: item.id, from: prev, to: item.price });
                } else if (!(item.id in old)) {
                  arrivals.push(item.id);
                }
              }
            }
            setPriceDiffs(diffs);
            setNewIds(arrivals);
          } catch {
            /* snapshot unreadable — the nudge shows without rows */
          }
        }
      } catch {
        /* private mode — no memory, no nudge */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  const dismissMenuChanged = () => {
    setMenuChanged(false);
    try {
      window.localStorage.setItem(VERSION_KEY, MENU_VERSION);
      window.localStorage.setItem(
        PRICES_KEY,
        JSON.stringify(
          Object.fromEntries(
            MENU.flatMap((c) => c.items.map((i) => [i.id, i.price] as const))
          )
        )
      );
    } catch {
      /* ignore */
    }
  };

  // The category label is spoken language — used inside the WA message.
  const categoryLabel = (id: string) =>
    t.menu.categories[id as keyof typeof t.menu.categories];

  // Live counts across the whole menu, shown inside the chips.
  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: 0,
      vegetarian: 0,
      vegan: 0,
      glutenFree: 0,
    };
    for (const cat of MENU) {
      for (const item of cat.items) {
        c.all += 1;
        if (item.tags) {
          for (const tag of item.tags) c[tag] += 1;
        }
      }
    }
    return c;
  }, []);

  const matches = (tags?: DietaryTag[]) => matchesFilter(tags, filter);

  // Bilingual search — matches names & descriptions in EN and AR no
  // matter which language the site is currently displayed in.
  const q = normalize(query);
  const searching = q.length > 0;

  const searchGroups = useMemo(() => {
    if (!searching) return [];
    return MENU.map((cat) => ({
      cat,
      items: cat.items.filter(
        (item) =>
          matchesFilter(item.tags, filter) &&
          (normalize(item.name.en).includes(q) ||
            normalize(item.name.ar).includes(q) ||
            normalize(item.desc.en).includes(q) ||
            normalize(item.desc.ar).includes(q))
      ),
    })).filter((g) => g.items.length > 0);
  }, [q, filter, searching]);

  const searchCount = searchGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section id="menu" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Print-only takeaway header — the screen has the site chrome */}
        <div className="hidden text-center print:block">
          <p className="font-display text-3xl font-semibold text-olive">
            {t.brand.name} · {t.brand.arabicName}
          </p>
          <p className="mt-1 text-sm text-olive/70">
            {SITE_CONFIG.address[lang]}
          </p>
        </div>

        <SectionHeading
          overline={t.menu.overline}
          title={t.menu.title}
          sub={t.menu.sub}
        />

        <Reveal delay={120} className="mt-10 sm:mt-12">
          {/* "the menu changed" note for returning visitors */}
          {menuChanged ? (
            <div
              role="status"
              className="animate-menu-fade mx-auto mb-5 max-w-md rounded-2xl border border-olive/15 bg-olive/[0.07] px-4 py-3 shadow-[0_10px_24px_-20px_rgba(59,74,50,0.5)] print:hidden"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles
                  className="h-4 w-4 shrink-0 text-terracotta"
                  aria-hidden="true"
                />
                <p className="flex-1 text-sm leading-snug text-olive">
                  {t.menu.changed.body}
                </p>
                <button
                  type="button"
                  onClick={dismissMenuChanged}
                  aria-label={t.menu.changed.dismiss}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-olive/60 transition-colors hover:bg-cream-deep hover:text-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* prices that moved since the stored snapshot */}
              {priceDiffs.length > 0 ? (
                <div className="mt-2 border-t border-olive/10 pt-2">
                  <p
                    className={`text-[11px] font-bold uppercase text-olive-mist ${
                      lang === "ar" ? "" : "tracking-[0.12em]"
                    }`}
                  >
                    {t.menu.changed.prices}
                  </p>
                  <ul>
                    {priceDiffs.slice(0, 3).map((d) => {
                      const item = MENU.flatMap((c) => c.items).find(
                        (i) => i.id === d.id
                      );
                      return (
                        <li
                          key={d.id}
                          className="mt-1 flex items-center justify-between gap-3"
                        >
                          <span className="truncate text-sm text-olive/85">
                            {item?.name[lang] ?? d.id}
                          </span>
                          <span
                            dir="ltr"
                            className="shrink-0 text-xs tabular-nums"
                          >
                            <s className="text-olive-mist">
                              ${d.from.toFixed(2)}
                            </s>
                            <span
                              aria-hidden="true"
                              className="mx-1 text-terracotta"
                            >
                              →
                            </span>
                            <span className="font-semibold text-terracotta-dark">
                              ${d.to.toFixed(2)}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {priceDiffs.length > 3 ? (
                    <p className="mt-1 text-xs text-olive-mist">
                      {t.menu.changed.more(priceDiffs.length - 3)}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* dishes the stored snapshot never heard of — new arrivals,
                  wearing the same terracotta tag as the menu board */}
              {newIds.length > 0 ? (
                <div className="mt-2 border-t border-olive/10 pt-2">
                  <p
                    className={`text-[11px] font-bold uppercase text-olive-mist ${
                      lang === "ar" ? "" : "tracking-[0.12em]"
                    }`}
                  >
                    {t.menu.changed.news}
                  </p>
                  <ul>
                    {newIds.slice(0, 2).map((id) => {
                      const item = MENU.flatMap((c) => c.items).find(
                        (i) => i.id === id
                      );
                      return (
                        <li
                          key={id}
                          className="mt-1 flex items-center justify-between gap-3"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
                            />
                            <span className="truncate text-sm text-olive/85">
                              {item?.name[lang] ?? id}
                            </span>
                          </span>
                          <span className="shrink-0 rounded-full bg-terracotta/12 px-2 py-0.5 text-[10px] font-bold uppercase text-terracotta-dark">
                            {lang === "ar" ? "جديد" : "New"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {newIds.length > 2 ? (
                    <p className="mt-1 text-xs text-olive-mist">
                      {t.menu.changed.more(newIds.length - 2)}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* bilingual search field */}
          <div className="mx-auto max-w-md print:hidden">
            <label htmlFor="menu-search" className="sr-only">
              {t.menu.search.label}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-olive-mist"
                aria-hidden="true"
              />
              <input
                id="menu-search"
                type="search"
                dir="auto"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.menu.search.placeholder}
                autoComplete="off"
                className="h-12 w-full rounded-full border border-border bg-card ps-11 pe-12 text-sm text-olive shadow-[inset_0_1px_0_rgba(59,74,50,0.05)] transition-colors placeholder:text-olive-mist/70 focus:border-terracotta/60 focus:outline-none focus:ring-2 focus:ring-terracotta/25 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t.menu.search.clear}
                  className="absolute end-2.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-olive/60 transition-colors hover:bg-cream-deep hover:text-olive"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                /* shortcut hint — the pencil symbol on the paper menu */
                <kbd
                  aria-hidden="true"
                  className="pointer-events-none absolute end-3.5 top-1/2 hidden -translate-y-1/2 items-center rounded-md border border-border bg-cream-deep px-1.5 py-0.5 font-sans text-[11px] font-semibold text-olive-mist sm:inline-flex"
                >
                  /
                </kbd>
              )}
            </div>
          </div>

          {searching ? (
            <p
              aria-live="polite"
              className="mt-3 text-center font-display text-sm italic text-olive-mist print:hidden"
            >
              {t.menu.search.found(searchCount)}
            </p>
          ) : null}

          {/* dietary filter chips — narrow every category (and search) at once */}
          <div
            role="group"
            aria-label={t.menu.filters.label}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 print:hidden"
          >
            {FILTERS.map((f) => {
              const FIcon = f === "all" ? null : TAG_ICONS[f];
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "border-olive bg-olive text-cream"
                      : "border-olive/20 text-olive/75 hover:border-terracotta hover:text-terracotta"
                  }`}
                >
                  {FIcon ? (
                    <FIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : null}
                  {t.menu.filters[f]}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                      active ? "bg-cream/25" : "bg-olive/10"
                    }`}
                  >
                    {counts[f]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* recently viewed this session — tap to reopen the story */}
          {recent.length > 0 ? (
            <div
              role="group"
              aria-label={t.menu.recent.label}
              className="animate-menu-fade mt-5 flex flex-wrap items-center justify-center gap-2 print:hidden"
            >
              <span
                className={`text-[11px] font-bold uppercase text-olive-mist ${
                  lang === "ar" ? "" : "tracking-[0.14em]"
                }`}
              >
                {t.menu.recent.label}
              </span>
              {recent.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openDish(item, { siblings: recent })}
                  aria-haspopup="dialog"
                  className={`recent-chip inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-olive/15 bg-card px-3 py-1.5 text-xs font-semibold text-olive shadow-[0_6px_14px_-10px_rgba(59,74,50,0.5)] transition-colors hover:border-terracotta hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40 ${
                    flashRecentId === item.id ? "recent-chip-flash" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-terracotta/70"
                  />
                  {item.name[lang]}
                  <span className="text-olive-mist">
                    ${item.price.toFixed(2)}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={clearRecent}
                aria-label={t.menu.recent.clear}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-olive/50 transition-colors hover:bg-cream-deep hover:text-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {searching ? (
            /* ---------------- search results across all categories -------- */
            <div key={`q-${q}-${filter}`} className="animate-menu-fade mt-8 print:hidden">
              {searchGroups.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card px-4 py-12 text-center shadow-[0_16px_36px_-28px_rgba(59,74,50,0.35)]">
                  <p className="mx-auto max-w-sm font-display text-lg italic text-olive-mist">
                    {t.menu.search.empty(query.trim())}
                  </p>
                </div>
              ) : (
                searchGroups.map((g) => (
                  <div key={g.cat.id} className="mt-6 first:mt-0">
                    {/* category overline with terracotta dot */}
                    <p className="mb-2 flex items-center gap-2.5 ps-2 text-xs font-bold uppercase text-olive-mist">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-terracotta"
                      />
                      {categoryLabel(g.cat.id)}
                    </p>
                    <ul className="stitched rounded-2xl border border-border bg-card p-3 shadow-[0_16px_36px_-28px_rgba(59,74,50,0.35)] sm:p-4">
                      {g.items.map((item) => (
                        <MenuRow
                          key={item.id}
                          item={item}
                          popularNow={popular === g.cat.id}
                          siblings={g.items}
                          q={q}
                        />
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* ---------------- tabbed browsing ---------------------------- */
            <Tabs
              value={tab}
              onValueChange={setTab}
              dir={isArabic ? "rtl" : "ltr"}
              className="print:hidden"
            >
              {/* "Right now" strip — follows the Beirut clock, jumps to the tab */}
              {popular ? (
                <div className="animate-menu-fade mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-olive/15 bg-olive/[0.06] px-4 py-3 print:hidden">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta/12 text-terracotta">
                    <Clock className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <p className="min-w-0 flex-1 text-sm leading-snug text-olive/85">
                    <span className="font-semibold text-terracotta-dark">
                      {t.menu.now.label}
                      {" — "}
                    </span>
                    {t.menu.now[popular]}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab(popular)}
                    className="micro-lift ms-auto inline-flex min-h-[40px] shrink-0 items-center rounded-full bg-olive px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-terracotta"
                  >
                    {t.menu.now.seeNow}
                  </button>
                </div>
              ) : null}

              {/* Café menu board: warmer frame, faint inner hairline */}
              <TabsList className="mx-auto mt-8 flex h-auto w-full flex-wrap justify-center gap-1 rounded-[1.25rem] border border-olive/15 bg-card p-1.5 shadow-[inset_0_0_0_1px_rgba(59,74,50,0.06)] print:hidden sm:flex-nowrap">
                {MENU.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="group min-h-[44px] flex-1 rounded-xl px-3 py-2 text-xs font-semibold text-olive/70 transition-all data-[state=active]:bg-olive data-[state=active]:text-cream data-[state=active]:shadow-sm sm:text-sm"
                  >
                    <span className="relative">
                      {categoryLabel(cat.id)}
                      {/* tiny dot indicator under the active tab label */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-1.5 flex justify-center"
                      >
                        <span className="h-1 w-1 rounded-full bg-terracotta opacity-0 transition-opacity duration-200 group-data-[state=active]:opacity-100" />
                      </span>
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {MENU.map((cat) => {
                const visibleItems = cat.items.filter((item) =>
                  matches(item.tags)
                );
                return (
                  <TabsContent
                    key={cat.id}
                    value={cat.id}
                    className="animate-menu-fade mt-8 focus-visible:outline-none"
                  >
                    <ul
                      key={filter}
                      className="stitched rounded-2xl border border-border bg-card p-3 shadow-[0_16px_36px_-28px_rgba(59,74,50,0.35)] sm:p-4"
                    >
                      {visibleItems.length === 0 ? (
                        <li className="px-4 py-12 text-center">
                          <p className="font-display text-lg italic text-olive-mist">
                            {t.menu.filters.empty}
                          </p>
                        </li>
                      ) : (
                        visibleItems.map((item) => (
                          <MenuRow
                            key={item.id}
                            item={item}
                            popularNow={popular === cat.id}
                            siblings={visibleItems}
                          />
                        ))
                      )}
                    </ul>

                    {/* per-category WhatsApp ordering */}
                    <div className="mt-5 flex justify-center print:hidden">
                      <a
                        href={waOrderUrl(lang, categoryLabel(cat.id))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="micro-lift inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border-2 border-terracotta bg-transparent px-6 py-2.5 text-sm font-semibold text-terracotta hover:bg-terracotta hover:text-cream"
                      >
                        <WhatsAppIcon className="h-4.5 w-4.5" />
                        {t.menu.orderCta} · {categoryLabel(cat.id)}
                      </a>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}

          {/* Print-only takeaway sheet — a plain rendering of every category
              so `window.print()` never depends on Radix tab state or CSS
              cascade wars with preflight's [hidden] rule. */}
          <div className="hidden print:block">
            {MENU.map((cat) => (
              <div key={cat.id} className="mt-6 first:mt-0">
                <p className="mb-2 flex items-center gap-2.5 text-xs font-bold uppercase text-olive-mist">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-terracotta"
                  />
                  {categoryLabel(cat.id)}
                </p>
                <ul className="stitched rounded-2xl border border-border bg-card p-3 sm:p-4">
                  {cat.items.map((item) => (
                    <li
                      key={item.id}
                      className="border-b border-border/60 px-3 py-4 last:border-0"
                    >
                      <div className="flex items-baseline">
                        <h3 className="font-display text-lg text-olive">
                          {item.name[lang]}
                        </h3>
                        {item.favorite ? (
                          <span className="ms-2 inline-flex shrink-0 items-center gap-1 rounded-full bg-terracotta/12 px-2.5 py-0.5 text-[11px] font-semibold text-terracotta-dark">
                            <Star
                              className="h-3 w-3 fill-terracotta text-terracotta"
                              aria-hidden="true"
                            />
                            {t.menu.favorite}
                          </span>
                        ) : null}
                        <span className="dot-leader" aria-hidden="true" />
                        <span className="ms-2 shrink-0 font-display text-lg font-semibold text-terracotta">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-olive/70">
                        {item.desc[lang]}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* takeaway-sheet footer — how to find/follow the maison */}
            <div className="mt-8 border-t-2 border-dashed border-olive/25 pt-3 text-center text-xs leading-relaxed text-olive/70">
              <PrintQr />
              <p className="mt-1 font-semibold text-olive">
                {lang === "ar"
                  ? "اطلب أو احجز على واتساب"
                  : "Order & book on WhatsApp"}
              </p>
              <p dir="ltr" className="mt-0.5 font-semibold text-terracotta">
                wa.me/{SITE_CONFIG.whatsappNumber}
              </p>
              <p className="mt-2">{SITE_CONFIG.address[lang]}</p>
              <p className="mt-1">
                Instagram @{SITE_CONFIG.social.instagram.split("/").pop()} ·{" "}
                {SITE_CONFIG.email}
              </p>
            </div>
          </div>

          {/* quiet kitchen-note underline + print shortcut */}
          <p className="mt-6 text-center font-display text-sm italic text-olive-mist">
            {t.menu.note}
          </p>
          <div className="mt-4 flex justify-center print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-olive/20 px-5 py-2 text-sm font-semibold text-olive/80 transition-colors hover:border-olive hover:bg-olive hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              {t.menu.printCta}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PrintQr — the takeaway sheet's "scan me" square. A hand-drawn      */
/*  QR-placeholder: the three finder squares of a real code, a seeded  */
/*  module scatter for the body, and a sumac-berry heart where the     */
/*  eye lands. Decorative by design — the printed wa.me line beside    */
/*  it is what actually gets typed or dialed. Print-only.              */
/* ------------------------------------------------------------------ */

/** The scatter is generated once at module scope — deterministic, so
    every printed sheet carries the same pattern, and the component
    render stays mutation-free. */
const QR_MODULES: { x: number; y: number }[] = (() => {
  const N = 21;
  const out: { x: number; y: number }[] = [];
  let seed = 47;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const inFinder =
        (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
      if (inFinder) continue;
      const dx = x - (N >> 1);
      const dy = y - (N >> 1);
      if (Math.abs(dx) <= 3 && Math.abs(dy) <= 3) continue; // berry heart clearing
      if (rnd() < 0.42) out.push({ x, y });
    }
  }
  return out;
})();

/** One QR finder square — the bold corner marks every scanner hunts for. */
function QrFinder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={7} height={7} fill="currentColor" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#F6EFE3" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="currentColor" />
    </g>
  );
}

function PrintQr() {
  const modules = QR_MODULES;
  return (
    <svg
      viewBox="0 0 21 21"
      role="img"
      aria-hidden="true"
      className="qr-print mx-auto block h-24 w-24 text-olive"
      shapeRendering="crispEdges"
    >
      <QrFinder x={0} y={0} />
      <QrFinder x={14} y={0} />
      <QrFinder x={0} y={14} />
      {modules.map((m) => (
        <rect key={`${m.x}-${m.y}`} x={m.x} y={m.y} width={1} height={1} fill="currentColor" />
      ))}
      {/* the sumac-berry heart — three berries and a stem */}
      <g fill="#C4572F" stroke="none">
        <circle cx={10.5} cy={9.2} r={1.5} />
        <circle cx={8.9} cy={11.4} r={1.5} />
        <circle cx={12.1} cy={11.4} r={1.5} />
        <path
          d="M10.5 12.9c0-1.6.6-2.9 1.8-3.9"
          fill="none"
          stroke="#3B4A32"
          strokeWidth={0.55}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
