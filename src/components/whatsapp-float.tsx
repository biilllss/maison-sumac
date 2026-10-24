"use client";

import { useLanguage } from "./language-provider";
import { waReserveUrl } from "@/lib/config";
import { WhatsAppIcon } from "./icons";

/* ------------------------------------------------------------------ */
/*  Floating WhatsApp button — mobile only, bottom inset-inline-end    */
/*  so it sits bottom-right in LTR and bottom-left in RTL.             */
/* ------------------------------------------------------------------ */

export function WhatsAppFloat() {
  const { t, lang } = useLanguage();

  return (
    <a
      href={waReserveUrl(lang)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.hero.reserveCta}
      className="wa-float fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-40 print:hidden inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95 md:hidden"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
