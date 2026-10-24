"use client";

import { Reveal } from "./reveal";
import { useLanguage } from "./language-provider";

/* ------------------------------------------------------------------ */
/*  Shared section heading — terracotta overline + Fraunces title.     */
/*  Keeps every section visually on rhythm. The overline tracking is   */
/*  Latin-only: letter-spacing would break Arabic glyph joining.       */
/* ------------------------------------------------------------------ */

type SectionHeadingProps = {
  overline: string;
  title: string;
  sub?: string;
  align?: "start" | "center";
  dark?: boolean; // use on olive sections
};

export function SectionHeading({
  overline,
  title,
  sub,
  align = "center",
  dark = false,
}: SectionHeadingProps) {
  const { isArabic } = useLanguage();
  const alignCls = align === "center" ? "text-center mx-auto" : "text-start";
  return (
    <Reveal className={`max-w-2xl ${alignCls}`}>
      <p
        className={`text-sm font-semibold uppercase ${
          isArabic ? "" : "tracking-[0.2em]"
        } ${
          dark ? "text-terracotta-mist" : "text-terracotta"
        }`}
      >
        {overline}
      </p>
      <h2
        className={`mt-3 text-balance text-3xl leading-tight sm:text-4xl lg:text-[2.6rem] ${
          dark ? "text-cream" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {sub ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-cream/75" : "text-muted-foreground"
          }`}
        >
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
