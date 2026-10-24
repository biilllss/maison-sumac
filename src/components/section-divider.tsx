/* ------------------------------------------------------------------ */
/*  SectionDivider — a thin ornamental seam used sparingly between     */
/*  major sections: hairline · three dots (terracotta-olive-terracotta) */
/*  · hairline. Purely decorative, mirrors trivially (symmetric).      */
/* ------------------------------------------------------------------ */

export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex max-w-6xl items-center justify-center gap-2.5 px-4 py-2 sm:px-6 ${className}`}
    >
      <span className="h-px w-10 bg-border" />
      <span className="h-1.5 w-1.5 rounded-full bg-terracotta/80" />
      <span className="h-1.5 w-1.5 rounded-full bg-olive/50" />
      <span className="h-1.5 w-1.5 rounded-full bg-terracotta/80" />
      <span className="h-px w-10 bg-border" />
    </div>
  );
}
