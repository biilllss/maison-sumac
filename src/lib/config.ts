/* ------------------------------------------------------------------ */
/*  Site configuration — the ONLY place you need to edit to rebrand.   */
/* ------------------------------------------------------------------ */

export const SITE_CONFIG = {
  /** Fictional WhatsApp business number (international format, no +). */
  whatsappNumber: "96171234567",

  /** Fictional street address, shown in the Location section + footer. */
  address: {
    en: "14 Rue du Liban, Gemmayzeh, Beirut, Lebanon",
    ar: "شارع دو ليبان ١٤، الجميزة، بيروت، لبنان",
  },

  /** Placeholder "open in maps" target (search rather than a pin). */
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gemmayzeh+Beirut",

  /** Social profiles (fictional). */
  social: {
    instagram: "https://instagram.com/maisonsumac",
    facebook: "https://facebook.com/maisonsumac",
  },

  /** Email for press / catering enquiries. */
  email: "hello@maisonsumac.example",
} as const;

/* ------------------------------------------------------------------ */
/*  WhatsApp deep links                                                */
/*  All reservation / ordering flows funnel through these helpers      */
/*  so the pre-filled copy lives in exactly one place per language.    */
/* ------------------------------------------------------------------ */

const waBase = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=`;

export function waReserveUrl(lang: "en" | "ar"): string {
  const message =
    lang === "ar"
      ? "أهلا ميزون سماق، حابب أحجز طاولة"
      : "Hi Maison Sumac, I'd like to reserve a table";
  return waBase + encodeURIComponent(message);
}

export function waOrderUrl(lang: "en" | "ar", categoryName: string): string {
  const message =
    lang === "ar"
      ? `أهلا ميزون سماق، حابب أطلب من منيو ${categoryName}:`
      : `Hi Maison Sumac! I'd like to order from the ${categoryName} menu:`;
  return waBase + encodeURIComponent(message);
}

/** Full order from the interactive tray — one message, itemised.
    `name` personalises the greeting ("It's Layla — …"); `notes` carries
    contextual flourishes (the kitchen's pairing, a note for the kitchen)
    as whole lines inserted before the total. */
export function waOrderItemsUrl(
  lang: "en" | "ar",
  lines: string[],
  total: number,
  opts?: { name?: string; notes?: string[] }
): string {
  const totalLabel = lang === "ar" ? "المجموع" : "Total";
  const trimmedName = opts?.name?.trim();
  const notes = opts?.notes?.filter((n) => n.trim().length > 0) ?? [];
  const notePart = notes.length > 0 ? `\n${notes.join("\n")}` : "";
  const greeting = trimmedName
    ? lang === "ar"
      ? `أهلا ميزون سماق! أنا ${trimmedName}، حابب أطلب:`
      : `Hi Maison Sumac! It's ${trimmedName} — I'd like to order:`
    : lang === "ar"
      ? "أهلا ميزون سماق، حابب أطلب:"
      : "Hi Maison Sumac! I'd like to order:";
  const message = `${greeting}\n${lines.join("\n")}${notePart}\n${totalLabel}: $${total.toFixed(2)}`;
  return waBase + encodeURIComponent(message);
}

/** Reservation with picked day / time / party size from the booking widget.
    `name` personalises the greeting with the SAME signature the order
    tray uses — one name travels with both booking and ordering. */
export function waReserveDetailsUrl(
  lang: "en" | "ar",
  details: { day: string; time: string; guests: number; name?: string }
): string {
  const trimmedName = details.name?.trim();
  const greeting = trimmedName
    ? lang === "ar"
      ? `أهلا ميزون سماق! أنا ${trimmedName}، حابب أحجز طاولة:`
      : `Hi Maison Sumac! It's ${trimmedName} — I'd like to book a table:`
    : lang === "ar"
      ? "أهلا ميزون سماق، حابب أحجز طاولة:"
      : "Hi Maison Sumac, I'd like to book a table:";
  const message =
    lang === "ar"
      ? `${greeting}\n• اليوم: ${details.day}\n• الساعة: ${details.time}\n• العدد: ${details.guests} ${details.guests === 1 ? "شخص" : "أشخاص"}`
      : `${greeting}\n• Day: ${details.day}\n• Time: ${details.time}\n• Guests: ${details.guests} ${details.guests === 1 ? "guest" : "guests"}`;
  return waBase + encodeURIComponent(message);
}
