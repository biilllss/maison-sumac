"use client";

import { Quote, Star } from "lucide-react";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ------------------------------------------------------------------ */
/*  Reviews — three fictional quotes on cream cards, terracotta stars. */
/* ------------------------------------------------------------------ */

export function Reviews() {
  const { t } = useLanguage();

  return (
    <section
      id="reviews"
      className="scroll-mt-24 bg-cream-deep/60 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading overline={t.reviews.overline} title={t.reviews.title} />

        <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          {t.reviews.items.map((review, i) => (
            <Reveal key={review.name} delay={i * 110} className="h-full">
              <figure
                className={`hover-lift group relative flex h-full flex-col rounded-2xl border border-border p-6 sm:p-7 ${
                  i === 1 ? "bg-cream-deep/40" : "bg-card"
                }`}
              >
                {/* olive top accent — draws in on hover only */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-8 top-0 h-[2px] rounded-full bg-olive/0 transition-colors duration-300 group-hover:bg-olive/30"
                />
                <Quote
                  className="h-7 w-7 text-terracotta/50"
                  aria-hidden="true"
                />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-olive/90">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                  <div>
                    <p className="text-sm font-bold text-olive">
                      {review.name}
                    </p>
                    <p className="text-xs text-olive-mist">{review.place}</p>
                  </div>
                  <div
                    className="flex gap-0.5"
                    role="img"
                    aria-label="5 out of 5 stars"
                  >
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className="h-3.5 w-3.5 fill-terracotta text-terracotta"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
