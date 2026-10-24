"use client";

import { useLanguage } from "./language-provider";
import { BrandMark } from "./icons";
import { Reveal } from "./reveal";

/* ------------------------------------------------------------------ */
/*  Sumac showcase — the "name on the door" interlude.                 */
/*  A deep-olive band celebrating the word سماق: drawn stroke-first    */
/*  in SVG calligraphy, then inked terracotta, followed by three       */
/*  meaning cards (spice / tree / house). The Arabic word, keyword     */
/*  glyphs and numerals render in Cairo and keep RTL joining in both   */
/*  language modes.                                                    */
/* ------------------------------------------------------------------ */

const CARD_NUMERALS = ["٠١", "٠٢", "٠٣"];

export function SumacShowcase() {
  const { t, isArabic } = useLanguage();

  return (
    <section
      aria-labelledby="sumac-heading"
      className="relative overflow-hidden bg-olive py-16 sm:py-20 lg:py-24"
    >
      {/* watermark berries, echoing the brand mark */}
      <BrandMark
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -start-12 h-56 w-56 rotate-12 text-cream/5"
      />
      <BrandMark
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 -end-10 h-64 w-64 -rotate-12 text-cream/5"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <p
            className={`text-sm font-semibold uppercase text-terracotta-mist ${
              isArabic ? "" : "tracking-[0.22em]"
            }`}
          >
            {t.sumac.overline}
          </p>

          {/* the word — stroke-drawn on reveal, then inked */}
          <svg
            viewBox="0 0 640 240"
            role="img"
            aria-label={t.sumac.wordLabel}
            className="mx-auto mt-6 h-auto w-full max-w-2xl"
          >
            <text x="320" y="182" textAnchor="middle" className="sumac-word">
              {t.sumac.word}
            </text>
          </svg>

          <p className="font-display text-base italic text-cream/55 sm:text-lg">
            {t.sumac.translit}
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-cream/70 sm:text-base">
            {t.sumac.sub}
          </p>
        </Reveal>

        <h2 id="sumac-heading" className="sr-only">
          {t.sumac.overline}
        </h2>

        <div className="mt-12 grid gap-4 text-start sm:mt-14 sm:grid-cols-3 sm:gap-5">
          {t.sumac.meanings.map((meaning, i) => (
            <Reveal key={meaning.title} delay={140 + i * 110} className="h-full">
              <article className="h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-6 transition-colors duration-300 hover:bg-cream/[0.08]">
                <div className="flex items-start justify-between gap-3">
                  {/* Arabic keyword — always Cairo, always RTL joining */}
                  <span
                    dir="rtl"
                    lang="ar"
                    className="text-4xl font-bold leading-none text-terracotta-mist sm:text-5xl"
                    style={{ fontFamily: "var(--font-cairo), sans-serif" }}
                  >
                    {meaning.ar}
                  </span>
                  <span
                    aria-hidden="true"
                    className="rounded-full border border-cream/15 px-2.5 py-1 text-xs font-semibold text-cream/50"
                    style={{ fontFamily: "var(--font-cairo), sans-serif" }}
                  >
                    {CARD_NUMERALS[i]}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl text-cream">
                  {meaning.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">
                  {meaning.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
