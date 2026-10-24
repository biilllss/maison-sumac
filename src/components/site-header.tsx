"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBasket, X } from "lucide-react";
import { useLanguage } from "./language-provider";
import { useOrder } from "./order-tray";
import { waReserveUrl } from "@/lib/config";
import { BrandMark, WhatsAppIcon } from "./icons";
import { AmbienceRow, AmbienceToggle } from "./ambience-toggle";
import type { Lang } from "@/lib/translations";

/* ------------------------------------------------------------------ */
/*  Sticky header — wordmark, section links, EN|AR toggle, Reserve.    */
/*  Mobile: burger opens a full-width dropdown panel.                  */
/*  All spacing uses logical properties so RTL mirrors automatically.  */
/* ------------------------------------------------------------------ */

const SECTION_IDS = ["story", "menu", "gallery", "reviews", "visit"] as const;

export function SiteHeader() {
  const { t, lang, setLang, isArabic } = useLanguage();
  const { count, total } = useOrder();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 0–1 reading depth — drives the terracotta bookmark line under the header.
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const visibleRef = useRef(new Map<string, boolean>());

  const openTray = () => window.dispatchEvent(new CustomEvent("ms-tray-open"));

  // Solid shadow once the page scrolls — keeps the cream header legible
  // over photography without any blur/glass effect. The first check is
  // deferred to a rAF callback so we never setState synchronously in an effect.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Active-section highlight: a narrow IntersectionObserver band around
  // the upper-middle of the viewport decides which nav link is "here".
  // setState only happens inside the async observer callback (never in
  // the effect body), mirroring the rAF-safe pattern used for scroll.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = SECTION_IDS.map((id) => document.getElementById(id));
    if (sections.some((s) => !s)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current.set(entry.target.id, entry.isIntersecting);
        }
        // Top-most section currently inside the band wins.
        const current =
          SECTION_IDS.find((id) => visibleRef.current.get(id)) ?? null;
        setActiveId(current);
      },
      // A slim horizontal band ~30–42% down the viewport.
      { rootMargin: "-30% 0px -58% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s as Element));
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: "story", label: t.nav.story },
    { id: "menu", label: t.nav.menu },
    { id: "gallery", label: t.nav.gallery },
    { id: "reviews", label: t.nav.reviews },
    { id: "visit", label: t.nav.visit },
  ];

  const linkCls = (id: string) => {
    const base =
      "relative py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:start-0 after:h-0.5 after:rounded-full after:bg-terracotta after:transition-all after:duration-300";
    return activeId === id
      ? `${base} text-terracotta after:w-full`
      : `${base} text-olive/85 after:w-0 hover:text-olive hover:after:w-full`;
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-cream/95 transition-shadow ${
        scrolled ? "shadow-[0_8px_24px_-16px_rgba(59,74,50,0.35)]" : ""
      }`}
    >
      {/* Skip link — first focusable element on the page */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-[60] focus:rounded-md focus:bg-olive focus:px-4 focus:py-2 focus:text-cream"
      >
        {t.nav.skipToContent}
      </a>

      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:h-[4.5rem]">
        {/* Scroll-depth accent — a terracotta bookmark line that fills from
            the reading edge as you make your way down the page. */}
        <span
          aria-hidden="true"
          className={`absolute bottom-0 start-0 h-[2px] bg-terracotta transition-opacity duration-500 ${
            scrolled ? "opacity-60" : "opacity-0"
          }`}
          style={{ width: `${Math.round(progress * 100)}%` }}
        />

        {/* Wordmark */}
        <a
          href="#top"
          className="group flex items-center gap-2"
          aria-label={isArabic ? "ميزون سماق — الرئيسية" : "Maison Sumac — home"}
        >
          <BrandMark className="h-7 w-7 text-olive transition-transform duration-300 group-hover:rotate-6" />
          <span className="leading-none">
            <span className="block font-display text-lg font-semibold text-olive sm:text-xl">
              {t.brand.name}
            </span>
            <span
              className={`block text-[10px] uppercase text-olive-mist ${
                isArabic ? "" : "tracking-[0.28em]"
              }`}
            >
              {isArabic ? "كافي · بيروت" : "Café · Beirut"}
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "true" : undefined}
                  className={linkCls(item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mini-tray — appears once something is in the order; opens the
              floating tray panel via a custom event (see TrayWidget). */}
          {count > 0 ? (
            <button
              type="button"
              onClick={openTray}
              aria-label={`${t.orderTray.label}: ${count}`}
              className="animate-in fade-in zoom-in-95 duration-200 inline-flex h-11 items-center gap-1.5 rounded-full border border-terracotta/40 bg-terracotta/10 px-2.5 text-terracotta-dark transition-colors hover:bg-terracotta/20 sm:px-3.5"
            >
              <ShoppingBasket
                className="h-4.5 w-4.5 text-terracotta"
                aria-hidden="true"
              />
              <span className="min-w-4 text-center text-sm font-bold">
                {count}
              </span>
              <span className="hidden text-xs font-semibold sm:inline">
                ${total.toFixed(2)}
              </span>
            </button>
          ) : null}

          {/* Language toggle — segmented EN | AR */}
          <div
            role="group"
            aria-label={t.langToggle.label}
            className="flex items-center rounded-full border border-border bg-card p-0.5"
          >
            {(["en", "ar"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setOpen(false); // close the mobile panel — layout is about to mirror
                  setLang(code as Lang);
                }}
                aria-pressed={lang === code}
                className={`min-w-[44px] rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition-colors ${
                  lang === code
                    ? "bg-olive text-cream"
                    : "text-olive/70 hover:text-olive"
                }`}
              >
                {t.langToggle[code]}
              </button>
            ))}
          </div>

          {/* Terrace ambience (sm+; wrapped so `hidden` can't be
              overridden by the button's own inline-flex) */}
          <div className="hidden sm:block">
            <AmbienceToggle />
          </div>

          {/* Reserve (desktop) */}
          <a
            href={waReserveUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="micro-lift hidden min-h-[48px] items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-terracotta-dark sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t.nav.reserve}
          </a>

          {/* Burger (mobile) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-olive transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-border bg-cream lg:hidden"
      >
        <nav aria-label="Sections (mobile)" className="px-4 py-3 sm:px-6">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-border/60 py-3.5 text-base font-medium transition-colors last:border-0 ${
                    activeId === item.id
                      ? "text-terracotta"
                      : "text-olive hover:text-terracotta"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="border-t border-border/60 py-3">
            <AmbienceRow />
          </div>
          <a
            href={waReserveUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="micro-lift mt-3 mb-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-terracotta-dark"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t.nav.reserve}
          </a>
        </nav>
      </div>
    </header>
  );
}
