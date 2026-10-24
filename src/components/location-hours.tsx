"use client";

import { Clock, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "./language-provider";
import { OpenStatus } from "./open-status";
import { SITE_CONFIG, waDisplayNumber } from "@/lib/config";
import { WhatsAppIcon } from "./icons";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ------------------------------------------------------------------ */
/*  Location & hours — info cards + a styled placeholder map block.    */
/*  The map is pure CSS (street grid on olive) — swap in a real embed  */
/*  later without touching the layout.                                 */
/* ------------------------------------------------------------------ */

export function LocationHours() {
  const { t, lang, isArabic } = useLanguage();

  // Decorative street labels on the placeholder map — positioned along
  // the CSS grid streets. Letter-spacing is Latin-only (it would break
  // Arabic script joining), so it's applied conditionally.
  const streetPos = [
    "top-[16%] start-[10%]",
    "top-[48%] end-[8%]",
    "bottom-[13%] start-[18%]",
  ];

  return (
    <section id="visit" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          overline={t.visit.overline}
          title={t.visit.title}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Address + hours */}
          <div className="flex flex-col gap-5">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="flex items-center gap-2.5 text-lg text-olive">
                  <MapPin
                    className="h-5 w-5 text-terracotta"
                    aria-hidden="true"
                  />
                  {t.visit.addressLabel}
                </h3>
                <p className="mt-2 leading-relaxed text-olive/80">
                  {SITE_CONFIG.address[lang]}
                </p>
                <a
                  href={SITE_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="micro-lift mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-olive/25 px-4 py-2 text-sm font-semibold text-olive hover:border-olive hover:bg-olive hover:text-cream"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  {t.visit.directionsCta}
                </a>
                {/* WhatsApp contact row — number text derived from the
                    single SITE_CONFIG.whatsappNumber constant */}
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="micro-lift mt-2 inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-olive/25 px-4 py-2 text-sm font-semibold text-olive hover:border-terracotta hover:bg-terracotta hover:text-cream"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                  {t.visit.whatsappLabel}
                  <span dir="ltr" className="font-display tracking-wide">
                    {waDisplayNumber()}
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={110} className="flex-1">
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2.5 text-lg text-olive">
                    <Clock
                      className="h-5 w-5 text-terracotta"
                      aria-hidden="true"
                    />
                    {t.visit.hoursLabel}
                  </h3>
                  {/* live Beirut-clock status */}
                  <OpenStatus className="rounded-full border border-olive/15 bg-cream-deep/60 px-3 py-1 text-xs" />
                </div>
                <dl className="mt-3 divide-y divide-border/70">
                  {t.visit.hours.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <dt className="text-sm font-medium text-olive/85">
                        {row.day}
                      </dt>
                      <dd className="font-display text-sm font-semibold text-olive">
                        {row.time}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>

          {/* Styled placeholder map */}
          <Reveal delay={160}>
            <div
              role="img"
              aria-label={t.visit.mapAlt}
              className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-olive/20 bg-olive"
            >
              {/* visible honesty label — this is a styled placeholder, not
                  a live map ("Map preview" / «معاينة الخريطة») */}
              <span className="absolute top-3 start-3 z-10 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-olive shadow-sm">
                {t.visit.mapPreview}
              </span>
              {/* CSS street grid */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0 46px, #F6EFE3 46px 48px), repeating-linear-gradient(90deg, transparent 0 64px, #F6EFE3 64px 66px)",
                }}
              />
              {/* diagonal avenue */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 46%, #F6EFE3 46% 48.5%, transparent 48.5%)",
                }}
              />
              {/* decorative street labels — tiny cream wayfinding */}
              {t.visit.mapStreets.map((street, i) => (
                <span
                  key={street}
                  aria-hidden="true"
                  className={`absolute text-[10px] font-semibold uppercase text-cream/45 ${
                    isArabic ? "" : "tracking-[0.3em]"
                  } ${streetPos[i]}`}
                >
                  {street}
                </span>
              ))}
              {/* pin */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-cream shadow-[0_0_0_10px_rgba(196,87,47,0.25)]">
                  {/* soft radiating ring (static when reduced motion) */}
                  <span
                    aria-hidden="true"
                    className="map-ping absolute inset-0 rounded-full border-2 border-terracotta opacity-0"
                  />
                  <MapPin className="h-7 w-7" aria-hidden="true" />
                </span>
                <p className="font-display text-xl text-cream">
                  {t.brand.name}
                </p>
                <p className="max-w-xs text-sm leading-relaxed text-cream/70">
                  {t.visit.mapNote}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
