"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, MoonStar, Sun } from "lucide-react";
import { useLanguage } from "./language-provider";
import { waReserveUrl } from "@/lib/config";
import { WhatsAppIcon } from "./icons";
import { OpenStatus } from "./open-status";
import { KitchenPicks } from "./kitchen-picks";
import { getTerracePhase, type TerracePhase } from "@/lib/hours";
import { IMAGES } from "@/lib/images";
import { Reveal } from "./reveal";

/* ------------------------------------------------------------------ */
/*  Hero — headline, one-liner, two CTAs, layered food photography.    */
/*  Mobile-first: stacks image below text; desktop overlaps images.    */
/*  Day/night terrace mode: the photo + phase chip follow the Beirut   */
/*  clock (sun-washed by day, lantern-lit in the evening).             */
/* ------------------------------------------------------------------ */

export function Hero() {
  const { t, lang, isArabic } = useLanguage();
  // "day" until mounted (rAF pattern) so SSR and first client render
  // always agree; the chip hides until we know the real Beirut phase.
  const [phase, setPhase] = useState<TerracePhase | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase(getTerracePhase()));
    return () => cancelAnimationFrame(raf);
  }, []);

  const night = phase === "night";
  const heroSrc = night ? IMAGES.hero.night : IMAGES.hero.main;
  const heroAlt = night ? t.hero.imageAltNight : t.hero.imageAlt;

  return (
    <section id="top" className="relative overflow-hidden">
      {/* faint arc — terracotta by day, deep olive under the lanterns */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-32 -end-32 h-72 w-72 rounded-full border-[22px] transition-colors duration-1000 ${
          night ? "border-olive/15" : "border-terracotta/10"
        }`}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-16">
        {/* Copy */}
        <div className="text-center lg:text-start">
          <Reveal>
            <p
              className={`inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-4 py-1.5 text-xs font-semibold uppercase text-terracotta-dark ${
                isArabic ? "" : "tracking-[0.18em]"
              }`}
            >
              {t.hero.overline}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.08] text-olive sm:text-6xl lg:text-[4.2rem]">
              {t.hero.title}{" "}
              <em className="relative inline-block italic text-terracotta">
                {t.hero.titleAccent}
                {/* hand-drawn brush stroke — a wavy double line that reads
                    the same in LTR and RTL (near-symmetric arc) */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 start-0 h-2.5 w-full"
                >
                  <path
                    d="M3 7.4 C 45 3.2 92 2.4 128 3.8 C 152 4.7 176 5.6 197 4.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                  <path
                    d="M5 7.8 C 48 4.2 96 3.4 132 4.4 C 156 5 178 5.8 196 5.2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </em>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-olive/80 sm:text-lg lg:mx-0">
              {t.hero.sub}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <a
                href={waReserveUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="micro-lift inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-[0_10px_24px_-10px_rgba(196,87,47,0.55)] hover:bg-terracotta-dark"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t.hero.reserveCta}
              </a>
              <a
                href="#menu"
                className="micro-lift inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-olive/25 bg-transparent px-7 py-3 text-base font-semibold text-olive hover:border-olive hover:bg-olive hover:text-cream"
              >
                {t.hero.menuCta}
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-start">
              <OpenStatus />
              <span
                aria-hidden="true"
                className="hidden h-1 w-1 rounded-full bg-terracotta/70 sm:block"
              />
              <p className="inline-flex items-center gap-2 text-sm text-olive-mist">
                <Clock className="h-4 w-4 text-terracotta" aria-hidden="true" />
                {t.hero.openBadge}
              </p>
              {/* Beirut day/night phase chip (renders after mount) */}
              {phase ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-olive/15 bg-cream-deep/60 px-3 py-1 text-xs font-semibold text-olive-mist">
                  {night ? (
                    <MoonStar
                      className="h-3.5 w-3.5 text-terracotta"
                      aria-hidden="true"
                    />
                  ) : (
                    <Sun
                      className="h-3.5 w-3.5 text-terracotta"
                      aria-hidden="true"
                    />
                  )}
                  {t.hero.phase[phase]}
                </span>
              ) : null}
            </div>
          </Reveal>

          {/* Time-of-day pairing from the Beirut kitchen */}
          <Reveal delay={400} className="mt-6">
            <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg">
              <KitchenPicks />
            </div>
          </Reveal>
        </div>

        {/* Photography — large primary + small overlapping card */}
        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_24px_48px_-24px_rgba(59,74,50,0.45)] sm:aspect-[5/4]">
              <Image
                key={heroSrc}
                src={heroSrc}
                alt={heroAlt}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="animate-menu-fade object-cover"
              />
            </div>

            <div className="img-zoom absolute -bottom-6 w-32 overflow-hidden rounded-xl border-4 border-cream shadow-lg sm:w-40 lg:-bottom-8 lg:-start-8">
              <div className="relative aspect-square">
                <Image
                  src={IMAGES.hero.secondary}
                  alt={t.hero.imageAltSecondary}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
