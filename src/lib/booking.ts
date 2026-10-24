import type { Lang } from "./translations";

/* ------------------------------------------------------------------ */
/*  Booking widget data — day chips + time slots, anchored to the      */
/*  Beirut clock (Asia/Beirut) so "today" is correct for the café.     */
/* ------------------------------------------------------------------ */

export type BookingDay = {
  /** Machine value — locale weekday + short date, e.g. "Sat, Oct 17" */
  value: string;
  /** Chip label: "Today" / "Tomorrow" / weekday name */
  label: string;
};

/** Fixed brunch-friendly reservation slots (24h). */
export const BOOKING_SLOTS = [
  "08:00",
  "09:30",
  "11:00",
  "12:30",
  "14:00",
  "16:00",
  "17:30",
] as const;

function beirutDate(offsetDays: number): Date {
  // Anchor to Beirut "now" by formatting through Asia/Beirut parts.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Beirut",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const h = get("hour") % 24;
  // Build a Date in local tz representing Beirut wall-clock, then offset.
  const d = new Date(get("year"), get("month") - 1, get("day"), h, get("minute"));
  d.setDate(d.getDate() + offsetDays);
  return d;
}

/** The three day chips: today, tomorrow, day after. */
export function getBookingDays(lang: Lang): BookingDay[] {
  const labelFmt = new Intl.DateTimeFormat(lang === "ar" ? "ar-LB" : "en-US", {
    weekday: "long",
  });
  const valueFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return [0, 1, 2].map((offset) => {
    const d = beirutDate(offset);
    const label =
      offset === 0
        ? lang === "ar"
          ? "اليوم"
          : "Today"
        : offset === 1
          ? lang === "ar"
            ? "بكرا"
            : "Tomorrow"
          : labelFmt.format(d);
    return { value: valueFmt.format(d), label };
  });
}

/** Format a 24h slot string ("09:30") in the visitor's language. */
export function formatSlot(slot: string, lang: Lang): string {
  const [h, m] = slot.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-LB" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}
