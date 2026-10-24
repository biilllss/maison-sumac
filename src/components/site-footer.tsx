"use client";

import { ArrowUp, Facebook, Instagram, Mail } from "lucide-react";
import { useLanguage } from "./language-provider";
import { SITE_CONFIG } from "@/lib/config";
import { BrandMark } from "./icons";

/* ------------------------------------------------------------------ */
/*  Footer — socials, copyright, studio credit. Pinned to the bottom   */
/*  of the viewport by the page's flex-column layout (mt-auto).        */
/* ------------------------------------------------------------------ */

export function SiteFooter() {
  const { t, isArabic } = useLanguage();
  const year = new Date().getFullYear();

  const socials = [
    { href: SITE_CONFIG.social.instagram, label: "Instagram", Icon: Instagram },
    { href: SITE_CONFIG.social.facebook, label: "Facebook", Icon: Facebook },
    { href: `mailto:${SITE_CONFIG.email}`, label: "Email", Icon: Mail },
  ];

  return (
    <footer className="mt-auto border-t border-olive/15 bg-cream-deep pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-start">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-8 w-8 text-olive" />
            <div>
              <p className="font-display text-lg font-semibold text-olive">
                {t.brand.name}
              </p>
              <p className="text-xs text-olive-mist">{t.footer.tagline}</p>
            </div>
          </div>

          {/* Socials + back to top */}
          <nav aria-label={t.footer.followUs}>
            <ul className="flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.footer.followUs} — ${label}`}
                    className="micro-lift inline-flex h-11 w-11 items-center justify-center rounded-full border border-olive/20 text-olive hover:border-terracotta hover:bg-terracotta hover:text-cream"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li className="ms-1 flex items-center">
                <a
                  href="#top"
                  aria-label={t.footer.backToTop}
                  title={t.footer.backToTop}
                  className="micro-lift inline-flex h-11 w-11 items-center justify-center rounded-full border border-terracotta/40 text-terracotta hover:bg-terracotta hover:text-cream"
                >
                  <ArrowUp className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Wordmark echo — both scripts stacked, barely-there opacity.
            Arabic line never gets letter-spacing (it breaks the joining). */}
        <div
          aria-hidden="true"
          className="mt-8 flex select-none flex-col items-center gap-1.5 text-center opacity-60"
        >
          <p className="font-display text-2xl font-semibold text-olive">
            {t.brand.name}
          </p>
          <p
            dir={isArabic ? "ltr" : "rtl"}
            className={`text-sm text-olive-mist ${
              isArabic ? "uppercase tracking-[0.28em]" : ""
            }`}
          >
            {t.brand.arabicName}
          </p>
        </div>

        <div className="mt-7 flex flex-col items-center gap-1.5 border-t border-olive/10 pt-5 text-center text-xs text-olive-mist md:flex-row md:justify-between">
          <p>
            © {year} {t.footer.copyright}
          </p>
          <p>
            {t.footer.credit}{" "}
            <a
              href="https://mawqe3.example"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-terracotta underline-offset-2 hover:underline"
            >
              {t.footer.creditStudio}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
