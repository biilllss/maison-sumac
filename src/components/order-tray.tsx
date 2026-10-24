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
  ChefHat,
  ChevronUp,
  Minus,
  PenLine,
  Plus,
  ShoppingBasket,
  X,
} from "lucide-react";
import { useLanguage } from "./language-provider";
import { MENU, type MenuItem } from "@/lib/menu-data";
import { waOrderItemsUrl } from "@/lib/config";
import { WhatsAppIcon } from "./icons";

/* ------------------------------------------------------------------ */
/*  Interactive order tray.                                            */
/*  Visitors tap "+" on menu items to build an order; the floating     */
/*  pill (bottom-center, RTL-safe by centering) expands into a panel   */
/*  with quantity steppers and ONE itemised WhatsApp deep link.        */
/* ------------------------------------------------------------------ */

const MAX_QTY = 9;

const ITEM_BY_ID = new Map<string, MenuItem>(
  MENU.flatMap((cat) => cat.items.map((item) => [item.id, item]))
);

type OrderContextValue = {
  /** ids + quantities (+ optional pairing origin), in the order added */
  raw: { id: string; qty: number; combo?: string }[];
  /** resolved entries (skips unknown ids defensively) */
  entries: { item: MenuItem; qty: number; combo?: string }[];
  count: number;
  total: number;
  has: (id: string) => boolean;
  add: (id: string, opts?: { combo?: string }) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

const TRAY_KEY = "ms-tray";
const NAME_KEY = "ms-order-name";
const NOTE_KEY = "ms-order-note";

/** Only keep ids that still exist on the menu (menu may change). */
function sanitize(raw: unknown): { id: string; qty: number; combo?: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (e): e is { id: string; qty: number; combo?: string } =>
        typeof e?.id === "string" &&
        ITEM_BY_ID.has(e.id) &&
        typeof e?.qty === "number" &&
        e.qty > 0
    )
    .map((e) => ({
      id: e.id,
      qty: Math.min(MAX_QTY, Math.floor(e.qty)),
      ...(typeof e.combo === "string" ? { combo: e.combo } : {}),
    }));
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<{ id: string; qty: number; combo?: string }[]>([]);
  // Blocks the persist effect until the restore attempt has happened,
  // otherwise the initial empty state would clobber saved data on mount.
  const hydratedRef = useRef(false);

  // Restore a saved tray once on mount (rAF pattern — never sync setState).
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(TRAY_KEY);
        if (saved) setRaw(sanitize(JSON.parse(saved)));
      } catch {
        /* corrupted storage — start with an empty tray */
      }
      hydratedRef.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Persist on every change AFTER hydration (plain side effect, no setState).
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(TRAY_KEY, JSON.stringify(raw));
    } catch {
      /* private mode — tray simply won't persist */
    }
  }, [raw]);

  /** Add an item; `combo` tags the line as coming from a pairing gesture
      ("Add both" on the kitchen-picks strip) so the tray and the WhatsApp
      message can mention it. Adding an existing line keeps its tag. */
  const add = useCallback((id: string, opts?: { combo?: string }) => {
    setRaw((prev) =>
      prev.some((e) => e.id === id)
        ? prev
        : [...prev, { id, qty: 1, combo: opts?.combo }]
    );
  }, []);

  const inc = useCallback((id: string) => {
    setRaw((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, qty: Math.min(MAX_QTY, e.qty + 1) } : e
      )
    );
  }, []);

  const dec = useCallback((id: string) => {
    setRaw((prev) =>
      prev
        .map((e) => (e.id === id ? { ...e, qty: e.qty - 1 } : e))
        .filter((e) => e.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<OrderContextValue>(() => {
    const entries = raw
      .map(({ id, qty, combo }) => {
        const item = ITEM_BY_ID.get(id);
        return item ? { item, qty, combo } : null;
      })
      .filter((e): e is { item: MenuItem; qty: number; combo?: string } => e !== null);

    return {
      raw,
      entries,
      count: entries.reduce((sum, e) => sum + e.qty, 0),
      total: entries.reduce((sum, e) => sum + e.qty * e.item.price, 0),
      has: (id: string) => raw.some((e) => e.id === id),
      add,
      inc,
      dec,
      clear,
    };
  }, [raw, add, inc, dec, clear]);

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrder must be used inside <OrderProvider>");
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Floating pill + expandable summary panel.                          */
/* ------------------------------------------------------------------ */

export function TrayWidget() {
  const { t, lang } = useLanguage();
  const { entries, count, total, inc, dec, clear } = useOrder();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Optional signature on the ticket: a name for the greeting and a note
  // for the kitchen — both ride along in the WhatsApp message.
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsHydrated = useRef(false);
  // "See you soon" feedback after the send tap.
  const [sent, setSent] = useState(false);
  const sentTimer = useRef<number | null>(null);

  // Restore the saved signature once on mount (rAF pattern).
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        setName(window.localStorage.getItem(NAME_KEY) ?? "");
        setNote(window.localStorage.getItem(NOTE_KEY) ?? "");
      } catch {
        /* private mode — no memory, that's fine */
      }
      detailsHydrated.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Persist after hydration, and broadcast the signature so the booking
  // widget (and any future ticket) signs with the same name live.
  useEffect(() => {
    if (!detailsHydrated.current) return;
    try {
      if (name.trim()) window.localStorage.setItem(NAME_KEY, name);
      else window.localStorage.removeItem(NAME_KEY);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(
      new CustomEvent("ms-signature", { detail: { name } })
    );
  }, [name]);
  // …and follow live renames made in the booking widget (ms-signature).
  useEffect(() => {
    const onSignature = (e: Event) => {
      const detail = (e as CustomEvent<{ name?: string }>).detail;
      setName((prev) => (prev === (detail?.name ?? "") ? prev : (detail?.name ?? "")));
    };
    window.addEventListener("ms-signature", onSignature);
    return () => window.removeEventListener("ms-signature", onSignature);
  }, []);
  useEffect(() => {
    if (!detailsHydrated.current) return;
    try {
      if (note.trim()) window.localStorage.setItem(NOTE_KEY, note);
      else window.localStorage.removeItem(NOTE_KEY);
    } catch {
      /* ignore */
    }
  }, [note]);

  // Clear the feedback timer if the widget unmounts mid-feedback.
  useEffect(() => {
    return () => {
      if (sentTimer.current) window.clearTimeout(sentTimer.current);
    };
  }, []);

  // The header mini-tray chip asks the floating panel to open via a
  // custom window event (state change happens inside the callback).
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("ms-tray-open", onOpen);
    return () => window.removeEventListener("ms-tray-open", onOpen);
  }, []);

  // Close on Escape or outside pointer-down (state updates happen inside
  // event callbacks — never synchronously in the effect body).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (count === 0) return null;

  const lines = entries.map(
    ({ item, qty }) => `• ${qty}× ${item.name[lang]} — $${(item.price * qty).toFixed(2)}`
  );
  // Whole extra lines for the message: the pairing note (r13) and the
  // guest's note for the kitchen (r14).
  const notes = [
    entries.some((e) => e.combo) ? t.orderTray.pairingNote : undefined,
    note.trim() ? (lang === "ar" ? `ملاحظة: ${note.trim()}` : `Note: ${note.trim()}`) : undefined,
  ].filter((n): n is string => typeof n === "string");

  /** Clearing the tray starts a fresh ticket: items AND signature. */
  const clearTicket = () => {
    clear();
    setName("");
    setNote("");
  };

  /** Open WhatsApp, then let the button say thank-you for a moment. */
  const onSend = () => {
    setSent(true);
    if (sentTimer.current) window.clearTimeout(sentTimer.current);
    sentTimer.current = window.setTimeout(() => setSent(false), 3500);
  };

  const hasDetails = name.trim().length > 0 || note.trim().length > 0;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 mx-auto w-fit print:hidden"
    >
      {open ? (
        <div className="receipt-tear mb-3">
        <div
          role="dialog"
          aria-label={t.orderTray.label}
          className="animate-in fade-in slide-in-from-bottom-2 max-h-[56vh] w-[min(92vw,24rem)] overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-[0_24px_48px_-16px_rgba(59,74,50,0.4)] duration-200 sm:p-5"
        >
          {/* header */}
          <div className="flex items-center justify-between gap-3 pb-3">
            <p className="font-display text-lg text-olive">
              {t.orderTray.label}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.orderTray.close}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-olive/70 transition-colors hover:bg-secondary hover:text-olive"
            >
              <X className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </div>

          {/* items */}
          {entries.length === 0 ? (
            <p className="py-6 text-center text-sm text-olive/70">
              {t.orderTray.empty}
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {entries.map(({ item, qty, combo }) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-olive">
                      {item.name[lang]}
                    </p>
                    <p className="text-xs tabular-nums text-olive-mist">
                      ${item.price.toFixed(2)} × {qty}
                    </p>
                    {combo ? (
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-terracotta/10 px-1.5 py-0.5 text-[10px] font-semibold text-terracotta-dark">
                        <ChefHat className="h-2.5 w-2.5" aria-hidden="true" />
                        {t.orderTray.pairingChip}
                      </p>
                    ) : null}
                  </div>
                  {/* steppers */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => dec(item.id)}
                      aria-label={t.orderTray.decItem}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-olive/20 text-olive transition-colors hover:border-terracotta hover:text-terracotta"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span
                      className="w-5 text-center text-sm font-bold text-olive"
                      aria-hidden="true"
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => inc(item.id)}
                      aria-label={t.orderTray.incItem}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-olive/20 text-olive transition-colors hover:border-terracotta hover:text-terracotta"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* signature — an optional pencil line on the ticket */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              aria-expanded={detailsOpen}
              className={`inline-flex min-h-[28px] items-center gap-1.5 text-xs font-semibold transition-colors hover:text-terracotta ${
                hasDetails && !detailsOpen
                  ? "italic text-terracotta-dark"
                  : "text-olive/70"
              }`}
            >
              <PenLine className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="max-w-[15rem] truncate">
                {hasDetails && !detailsOpen
                  ? [name, note].map((s) => s.trim()).filter(Boolean).join(" · ")
                  : t.orderTray.detailsToggle}
              </span>
            </button>
            {detailsOpen ? (
              <div className="ticket-fields mt-2 grid gap-3">
                <label className="block">
                  <span className="mb-0.5 block text-[11px] font-bold uppercase text-olive-mist">
                    {t.orderTray.nameLabel}
                  </span>
                  <input
                    type="text"
                    dir="auto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    placeholder={t.orderTray.namePlaceholder}
                    autoComplete="name"
                    className="ticket-input"
                  />
                </label>
                <label className="block">
                  <span className="mb-0.5 block text-[11px] font-bold uppercase text-olive-mist">
                    {t.orderTray.noteLabel}
                  </span>
                  <input
                    type="text"
                    dir="auto"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={120}
                    placeholder={t.orderTray.notePlaceholder}
                    className="ticket-input"
                  />
                </label>
              </div>
            ) : null}
          </div>

          {/* footer — dashed rule reads as the receipt perforation;
              the corner stamp is the maison's bilingual thank-you */}
          <div className="relative mt-3 border-t border-dashed border-border pt-3">
            <MerciStamp />
            <div className="flex items-baseline">
              <span className="text-sm font-semibold text-olive">
                {t.orderTray.total}
              </span>
              <span className="dot-leader" aria-hidden="true" />
              <span
                key={total.toFixed(2)}
                className="total-pop font-display text-lg font-semibold tabular-nums text-terracotta"
              >
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-xs text-olive-mist">{t.orderTray.note}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={clearTicket}
                className="min-h-[44px] flex-1 rounded-full border-2 border-olive/20 px-4 py-2 text-sm font-semibold text-olive/80 transition-colors hover:border-olive hover:text-olive"
              >
                {t.orderTray.clear}
              </button>
              <a
                href={waOrderItemsUrl(lang, lines, total, { name, notes })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onSend}
                aria-live="polite"
                className={`micro-lift inline-flex min-h-[44px] flex-[1.6] items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors ${
                  sent
                    ? "bg-olive hover:bg-olive-soft"
                    : "bg-primary hover:bg-terracotta-dark"
                }`}
              >
                {sent ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    {t.orderTray.seeYou}
                  </>
                ) : (
                  <>
                    <WhatsAppIcon className="h-4 w-4" />
                    {t.orderTray.send}
                  </>
                )}
              </a>
            </div>
          </div>
        </div>
        </div>
      ) : null}

      {/* pill */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${t.orderTray.label} — ${count}`}
        className="micro-lift inline-flex h-12 items-center gap-2.5 rounded-full bg-olive px-5 text-cream shadow-[0_14px_30px_-12px_rgba(59,74,50,0.6)]"
      >
        <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
        <span className="text-sm font-semibold">{t.orderTray.label}</span>
        <span
          key={count}
          className="count-pop grid h-6 min-w-6 place-items-center rounded-full bg-terracotta px-1.5 text-xs font-bold text-primary-foreground"
        >
          {count}
        </span>
        <span className="hidden text-sm font-semibold tabular-nums text-cream/85 sm:inline">
          ${total.toFixed(2)}
        </span>
        <ChevronUp
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MerciStamp — a rubber-stamp "thank you" slapped across the receipt */
/*  footer: dashed double ring, the maison's name riding a circular    */
/*  arc, and a bilingual شكراً · MERCI core. Purely decorative ink —   */
/*  multiply blend keeps whatever it crosses readable.                 */
/* ------------------------------------------------------------------ */

function MerciStamp() {
  return (
    <span
      aria-hidden="true"
      className="merci-stamp pointer-events-none absolute -top-9 end-2 hidden w-16 -rotate-[14deg] sm:block rtl:rotate-[14deg]"
    >
      <svg viewBox="0 0 80 80" className="h-16 w-16">
        <defs>
          <path
            id="ms-stamp-arc"
            d="M 40,40 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
          />
        </defs>
        <circle
          cx="40"
          cy="40"
          r="37"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="3.5 2.5"
        />
        <circle
          cx="40"
          cy="40"
          r="22.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2.4"
        />
        <text
          fontSize="7.2"
          letterSpacing="1.6"
          fill="currentColor"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 700 }}
        >
          <textPath href="#ms-stamp-arc" startOffset="0">
            MAISON SUMAC · GEMMAYZEH ·
          </textPath>
        </text>
        <text
          x="40"
          y="40"
          textAnchor="middle"
          fontSize="12.5"
          fill="currentColor"
          style={{ fontFamily: "var(--font-cairo), var(--font-fraunces), serif" }}
        >
          شكراً
        </text>
        <text
          x="40"
          y="52"
          textAnchor="middle"
          fontSize="7"
          letterSpacing="2.4"
          fill="currentColor"
          style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600 }}
        >
          MERCI
        </text>
      </svg>
    </span>
  );
}
