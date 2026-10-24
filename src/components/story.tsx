"use client";

import Image from "next/image";
import { useLanguage } from "./language-provider";
import { IMAGES } from "@/lib/images";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ------------------------------------------------------------------ */
/*  Our story — short copy + counter photo with a torn-postcard feel.  */
/* ------------------------------------------------------------------ */

export function Story() {
  const { t } = useLanguage();

  return (
    <section id="story" className="scroll-mt-24 bg-cream-deep/60 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <Reveal className="order-2 lg:order-1">
            <figure className="relative">
              <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_20px_44px_-24px_rgba(59,74,50,0.4)]">
                <Image
                  src={IMAGES.story}
                  alt={t.story.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm italic text-olive-mist lg:text-start">
                {t.story.caption}
              </figcaption>
              {/* terracotta frame accent, mirrors via inset-inline */}
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -end-3 -z-10 h-full w-full rounded-2xl border-2 border-terracotta/40"
              />
            </figure>
          </Reveal>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              overline={t.story.overline}
              title={t.story.title}
              align="start"
            />
            <Reveal delay={120}>
              <p className="mt-5 text-base leading-relaxed text-olive/85 sm:text-lg">
                {t.story.body}
              </p>
            </Reveal>
            {/* editorial stat row — gives the story a café-credibility anchor */}
            <Reveal delay={170}>
              <dl className="mt-7 grid grid-cols-3 divide-x divide-border rtl:divide-x-reverse">
                {t.story.stats.map((stat) => (
                  <div key={stat.label} className="px-3 first:ps-0 last:pe-0">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-2xl font-semibold text-olive sm:text-3xl">
                        {stat.value}
                      </span>
                      <span className="mt-1 block text-xs leading-snug text-olive-mist sm:text-sm">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-px w-10 bg-terracotta" aria-hidden="true" />
                <span className="font-display text-lg italic text-terracotta">
                  {t.brand.arabicName}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
