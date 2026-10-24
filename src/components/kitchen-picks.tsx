"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChefHat, Plus } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useOrder } from "./order-tray";
import { useDishDialog } from "./dish-dialog";
import { MENU, type MenuItem } from "@/lib/menu-data";
import { getPopularCategory, type PopularCategory } from "@/lib/hours";

/* ------------------------------------------------------------------ */
/*  "The kitchen recommends right now" — a time-of-day pairing driven  */
/*  by the Beirut clock (same source as the menu's Popular badge):     */
/*  one dish + one drink that belong together, addable in a single     */
/*  tap. Names open the shared dish dialog for the full story.         */
/*  Renders nothing outside opening hours.                             */
/* ------------------------------------------------------------------ */

const PAIRING: Record<PopularCategory, { dish: string; drink: string }> = {
  breakfast: { dish: "labneh-toast", drink: "cardamom-latte" },
  coffee: { dish: "date-cookie", drink: "flat-white" },
  mains: { dish: "shawarma", drink: "sumac-lemonade" },
  desserts: { dish: "knefe", drink: "turkish" },
};

const ITEM_BY_ID = new Map<string, MenuItem>(
  MENU.flatMap((cat) => cat.items.map((item) => [item.id, item]))
);

export function KitchenPicks() {
  const { t, lang } = useLanguage();
  const { has, add } = useOrder();
  const { openDish } = useDishDialog();

  // Same override-aware pattern as the menu's "Popular now" badge, so a
  // QA override drives BOTH surfaces at once.
  const [popular, setPopular] = useState<PopularCategory | null>(null);
  useEffect(() => {
    const w = window as unknown as {
      __msPopularOverride?: PopularCategory | null;
      __msRecomputePicks?: () => void;
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
      w.__msRecomputePicks = recompute;
    });
    return () => {
      cancelAnimationFrame(raf);
      delete w.__msRecomputePicks;
    };
  }, []);

  const pair = useMemo(() => {
    if (!popular) return null;
    const p = PAIRING[popular];
    const dish = ITEM_BY_ID.get(p.dish);
    const drink = ITEM_BY_ID.get(p.drink);
    return dish && drink ? { dish, drink } : null;
  }, [popular]);

  if (!pair) return null;

  const bothIn = has(pair.dish.id) && has(pair.drink.id);
  const total = pair.dish.price + pair.drink.price;
  // "Add both" is a pairing gesture: both lines enter the tray tagged
  // with the pairing key, so the tray chips them and the WhatsApp
  // order message carries the kitchen's-pairing note.
  const addBoth = () => {
    add(pair.dish.id, { combo: popular ?? undefined });
    add(pair.drink.id, { combo: popular ?? undefined });
  };

  return (
    <div className="rounded-2xl border border-terracotta/25 bg-terracotta/[0.06] p-4 text-start shadow-[0_12px_28px_-22px_rgba(196,87,47,0.55)]">
      <p
        className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase text-terracotta-dark ${
          lang === "ar" ? "" : "tracking-[0.16em]"
        }`}
      >
        <ChefHat className="h-4 w-4 shrink-0" aria-hidden="true" />
        {t.hero.picks.label}
      </p>

      {/* dish …… with …… drink …… total */}
      <p className="mt-2.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        <button
          type="button"
          onClick={() => openDish(pair.dish)}
          className="rounded-sm font-display text-base font-semibold text-olive transition-colors hover:text-terracotta hover:underline hover:decoration-terracotta/50 hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
        >
          {pair.dish.name[lang]}
        </button>
        <span className="text-sm italic text-olive-mist">
          {t.hero.picks.with}
        </span>
        <button
          type="button"
          onClick={() => openDish(pair.drink)}
          className="rounded-sm font-display text-base font-semibold text-olive transition-colors hover:text-terracotta hover:underline hover:decoration-terracotta/50 hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/40"
        >
          {pair.drink.name[lang]}
        </button>
        <span className="dot-leader hidden self-center sm:block" aria-hidden="true" />
        <span className="font-display text-lg font-semibold text-terracotta">
          ${total.toFixed(2)}
        </span>
      </p>

      {/* per-item adders + one-tap "add both" */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PickAdd item={pair.dish} />
        <PickAdd item={pair.drink} />
        <button
          type="button"
          onClick={addBoth}
          className={`micro-lift inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            bothIn
              ? "bg-olive text-cream hover:bg-olive-soft"
              : "bg-terracotta text-cream hover:bg-terracotta-dark"
          }`}
        >
          {bothIn ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          {bothIn ? t.hero.picks.added : t.hero.picks.addBoth}
        </button>
      </div>
    </div>
  );
}

/* Small circular adder with a checked state, matching the menu rows. */
function PickAdd({ item }: { item: MenuItem }) {
  const { t, lang } = useLanguage();
  const { has, add, inc } = useOrder();
  const inTray = has(item.id);

  return (
    <button
      type="button"
      onClick={() => (inTray ? inc(item.id) : add(item.id))}
      aria-label={t.orderTray.addItem(item.name[lang])}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-90 ${
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
  );
}
