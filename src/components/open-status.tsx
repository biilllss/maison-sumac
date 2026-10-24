"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./language-provider";
import { getCafeStatus, type CafeStatus } from "@/lib/hours";

/* ------------------------------------------------------------------ */
/*  Live "Open now / Closed — opens …" chip, driven by the Beirut      */
/*  clock. Renders only after mount (avoids SSR time mismatches).      */
/* ------------------------------------------------------------------ */

export function OpenStatus({ className = "" }: { className?: string }) {
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<CafeStatus | null>(null);

  useEffect(() => {
    // rAF pattern keeps the hooks lint rule happy and defers the Intl work.
    const raf = requestAnimationFrame(() => setStatus(getCafeStatus(lang)));
    return () => cancelAnimationFrame(raf);
  }, [lang]);

  return (
    <p
      className={`inline-flex min-h-[24px] items-center gap-2 text-sm text-olive-mist ${className}`}
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={`relative inline-flex h-2.5 w-2.5 rounded-full transition-colors ${
          status?.open ? "bg-olive-soft" : "bg-terracotta"
        }`}
      >
        {status ? (
          <span
            className={`absolute inset-0 rounded-full opacity-40 ${
              status.open ? "bg-olive-soft" : "bg-terracotta"
            }`}
          />
        ) : null}
      </span>
      {status
        ? (status.open ? t.status.openNow : t.status.closedNow).replace(
            "{time}",
            status.timeLabel
          )
        : ""}
    </p>
  );
}
