"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarHeart, Minus, PenLine, Plus } from "lucide-react";
import { useLanguage } from "./language-provider";
import { waReserveUrl, waReserveDetailsUrl } from "@/lib/config";
import { BOOKING_SLOTS, formatSlot, getBookingDays } from "@/lib/booking";
import { BrandMark, WhatsAppIcon } from "./icons";
import { Reveal } from "./reveal";

/* ------------------------------------------------------------------ */
/*  Final CTA — deep-olive band with a compact booking widget:         */
/*  day chips (Beirut clock) + time slots + party-size stepper + a     */
/*  name that SHARES the order-tray signature (ms-order-name), all     */
/*  feeding one structured WhatsApp reservation message.               */
/* ------------------------------------------------------------------ */

const MAX_GUESTS = 8;
const NAME_KEY = "ms-order-name";

export function FinalCta() {
  const { t, lang, isArabic } = useLanguage();

  // Day chips depend on the Beirut clock — computed after mount.
  const [days, setDays] = useState(() => getBookingDays(lang));
  const [dayIdx, setDayIdx] = useState(0);
  const [slot, setSlot] = useState<string>(BOOKING_SLOTS[2]); // 11:00 brunch default
  const [guests, setGuests] = useState(2);
  // The reservation signs itself with the same name the order tray
  // uses — one signature across booking and ordering.
  const [name, setName] = useState("");
  const nameHydrated = useRef(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setDays(getBookingDays(lang)));
    return () => cancelAnimationFrame(raf);
  }, [lang]);

  // Restore the shared signature once on mount (rAF pattern), then
  // follow live renames coming from the order tray via ms-signature.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        setName(window.localStorage.getItem(NAME_KEY) ?? "");
      } catch {
        /* private mode — no memory, that's fine */
      }
      nameHydrated.current = true;
    });
    const onSignature = (e: Event) => {
      const detail = (e as CustomEvent<{ name?: string }>).detail;
      setName(detail?.name ?? "");
    };
    window.addEventListener("ms-signature", onSignature);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("ms-signature", onSignature);
    };
  }, []);

  // Persist after hydration; tell the rest of the page (order tray).
  useEffect(() => {
    if (!nameHydrated.current) return;
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

  const activeDay = days[Math.min(dayIdx, days.length - 1)];
  const bookHref = waReserveDetailsUrl(lang, {
    day: activeDay.label,
    time: formatSlot(slot, lang),
    guests,
    name,
  });

  const chipBase =
    "min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition-colors";

  return (
    <section className="relative overflow-hidden bg-olive py-16 sm:py-20 lg:py-24">
      {/* oversized watermark berries, echoing the brand mark */}
      <BrandMark
        className="pointer-events-none absolute -top-10 -end-10 h-56 w-56 rotate-12 text-cream/5"
      />
      <BrandMark
        className="pointer-events-none absolute -bottom-16 -start-10 h-64 w-64 -rotate-12 text-cream/5"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p
            className={`text-sm font-semibold uppercase text-terracotta-mist ${
              isArabic ? "" : "tracking-[0.22em]"
            }`}
          >
            {t.cta.overline}
          </p>
          <h2 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
            {t.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
            {t.cta.body}
          </p>
        </Reveal>

        {/* booking widget */}
        <Reveal delay={120}>
          <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-cream p-5 text-start shadow-[0_24px_48px_-20px_rgba(0,0,0,0.35)] sm:p-6">
            <p className="flex items-center gap-2 font-display text-lg text-olive">
              <CalendarHeart
                className="h-5 w-5 text-terracotta"
                aria-hidden="true"
              />
              {t.booking.title}
            </p>

            {/* day chips */}
            <fieldset className="mt-4">
              <legend
                className={`text-xs font-semibold uppercase text-olive-mist ${
                  isArabic ? "" : "tracking-[0.16em]"
                }`}
              >
                {t.booking.when}
              </legend>
              <div
                role="radiogroup"
                aria-label={t.booking.when}
                className="mt-2 flex flex-wrap gap-2"
              >
                {days.map((day, i) => (
                  <button
                    key={day.value}
                    type="button"
                    role="radio"
                    aria-checked={dayIdx === i}
                    onClick={() => setDayIdx(i)}
                    className={`${chipBase} ${
                      dayIdx === i
                        ? "bg-olive text-cream"
                        : "border border-olive/25 text-olive hover:border-olive"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* time slots */}
            <fieldset className="mt-4">
              <legend
                className={`text-xs font-semibold uppercase text-olive-mist ${
                  isArabic ? "" : "tracking-[0.16em]"
                }`}
              >
                {t.booking.time}
              </legend>
              <div
                role="radiogroup"
                aria-label={t.booking.time}
                className="mt-2 flex flex-wrap gap-2"
              >
                {BOOKING_SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={slot === s}
                    onClick={() => setSlot(s)}
                    className={`${chipBase} ${
                      slot === s
                        ? "bg-olive text-cream"
                        : "border border-olive/25 text-olive hover:border-olive"
                    }`}
                  >
                    {formatSlot(s, lang)}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* party size stepper */}
            <fieldset className="mt-4">
              <legend
                className={`text-xs font-semibold uppercase text-olive-mist ${
                  isArabic ? "" : "tracking-[0.16em]"
                }`}
              >
                {t.booking.guests}
              </legend>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  disabled={guests <= 1}
                  aria-label="-1"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-olive/25 text-olive transition-colors hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span
                  className="min-w-16 text-center font-display text-xl font-semibold text-olive"
                  aria-live="polite"
                >
                  {guests} {t.booking.guestWord(guests)}
                </span>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                  disabled={guests >= MAX_GUESTS}
                  aria-label="+1"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-olive/25 text-olive transition-colors hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </fieldset>

            {/* signature — the same name that opens your order message */}
            <fieldset className="mt-4">
              <legend
                className={`text-xs font-semibold uppercase text-olive-mist ${
                  isArabic ? "" : "tracking-[0.16em]"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <PenLine className="h-3 w-3 text-terracotta" aria-hidden="true" />
                  {t.booking.nameLabel}
                </span>
              </legend>
              <input
                type="text"
                dir="auto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder={t.booking.namePlaceholder}
                autoComplete="name"
                aria-label={t.booking.nameLabel}
                className="ticket-input mt-1 w-full"
              />
              <p className="mt-1 text-xs italic leading-snug text-olive-mist">
                {t.booking.nameHint}
              </p>
            </fieldset>

            {/* the action */}
            <a
              href={bookHref}
              target="_blank"
              rel="noopener noreferrer"
              className="micro-lift mt-5 flex min-h-[56px] items-center justify-center gap-3 rounded-full bg-primary px-9 py-4 text-lg font-semibold text-primary-foreground shadow-[0_16px_36px_-12px_rgba(196,87,47,0.6)] hover:bg-terracotta-dark"
            >
              <WhatsAppIcon className="h-6 w-6" />
              {t.cta.button}
            </a>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-sm text-cream/60">{t.cta.note}</p>
          {/* honesty line — bookings are requests, confirmed by chat */}
          <p className="mt-1.5 text-xs text-cream/45">{t.cta.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}
