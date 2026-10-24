/* ------------------------------------------------------------------ */
/*  Small hand-rolled SVG icons.                                       */
/*  Lucide covers almost everything except brand glyphs, so WhatsApp   */
/*  and the Maison Sumac berry-mark live here.                         */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };

/** WhatsApp brand glyph (Simple Icons path, MIT-licensed). */
export function WhatsAppIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/**
 * Maison Sumac berry-mark — three sumac berries on a stem.
 * Tiny custom brand detail so the wordmark doesn't look templated.
 */
export function BrandMark({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M12 21c0-6 0-10 0-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 8C12 8 10.5 5.5 7.5 5.2M12 10c0 0 .5-3 3-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="8.2" cy="12.6" r="2.9" fill="#C4572F" />
      <circle cx="15.2" cy="9.4" r="2.5" fill="#C4572F" opacity="0.85" />
      <circle cx="14.6" cy="16.2" r="2.6" fill="#C4572F" opacity="0.65" />
    </svg>
  );
}

/**
 * SumacLoader — the berry mark drawing itself, used while dish photos
 * stream in (dialog / lightbox). The stem strokes trace via dashoffset,
 * the berries bloom in one after another. `prefers-reduced-motion`
 * freezes it into a quiet static mark (handled in globals.css).
 */
export function SumacLoader({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`sumac-loader ${className}`}
    >
      <path
        className="sumac-loader-stem"
        d="M12 21c0-6 0-10 0-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        className="sumac-loader-branch"
        d="M12 8C12 8 10.5 5.5 7.5 5.2M12 10c0 0 .5-3 3-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle className="sumac-loader-berry b1" cx="8.2" cy="12.6" r="2.9" fill="#C4572F" />
      <circle className="sumac-loader-berry b2" cx="15.2" cy="9.4" r="2.5" fill="#C4572F" opacity="0.85" />
      <circle className="sumac-loader-berry b3" cx="14.6" cy="16.2" r="2.6" fill="#C4572F" opacity="0.65" />
    </svg>
  );
}
