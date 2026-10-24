"use client";

import { Croissant, Sun, Wifi } from "lucide-react";
import { useLanguage } from "./language-provider";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/* ------------------------------------------------------------------ */
/*  Why people love it — three feature blocks with olive icon chips.   */
/* ------------------------------------------------------------------ */

const FEATURE_ICONS = [Croissant, Sun, Wifi] as const;

export function Features() {
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          overline={t.features.overline}
          title={t.features.title}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {t.features.items.map((item, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <Reveal key={item.title} delay={i * 110} className="h-full">
                <article className="hover-lift h-full rounded-2xl border border-border bg-card p-6 sm:p-7">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-olive text-cream"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl text-olive">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-olive/75 sm:text-base">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
