/* ------------------------------------------------------------------ */
/*  Gallery ↔ menu mapping — the single source of truth for which      */
/*  gallery tile pictures which menu dish.                             */
/*  The gallery uses it to open the dish dialog instead of the         */
/*  lightbox; the dish dialog uses it to offer a "see it in the        */
/*  gallery" jump. Keep both in sync when gallery photos change.       */
/* ------------------------------------------------------------------ */

import type { MenuItem } from "./menu-data";

/** Gallery index → menu item id (null = lightbox only). */
export const GALLERY_DISHES: readonly (string | null)[] = [
  "labneh-toast", // 0 — toast
  null, // 1 — terrace
  "flat-white", // 2 — flat white
  "akkawi-manakish", // 3 — manakish batch
  null, // 4 — mezze
  "knefe", // 5 — knefe
] as const;

/** menu item id → gallery index (inverse of GALLERY_DISHES). */
export const GALLERY_INDEX_BY_DISH: Record<string, number> = Object.fromEntries(
  GALLERY_DISHES.flatMap((id, i) => (id ? [[id, i] as const] : []))
);

/** True when the dish also appears in the gallery grid. */
export function isInGallery(item: MenuItem): boolean {
  return item.id in GALLERY_INDEX_BY_DISH;
}
