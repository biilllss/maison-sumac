import type { Lang } from "./translations";

/* ------------------------------------------------------------------ */
/*  Booking widget data — day chips + time slots, anchored to the      */
/*  Beirut clock (Asia/Beirut) so "today" is correct for the café.     */
/*                                                                     */
/*  Days: real dates — today plus the next 3 days, localized.          */
/*  Slots follow the real opening hours (Mon–Fri 7:30–18:00,           */
/*  Sat–Sun 8:00–19:00, last seat 1h before close) and past times      */
/*  are disabled when the picked day is today.                         */
/* ------------------------------------------------------------------ */

export type BookingDay = {
  /** Machine value — locale weekday + short date, e.g. "Sat, Nov 22" */
  value: string;
  /** Chip label with the real date: "Today, Nov 21" / «اليوم، ٢١ تشرين الثاني» */
  label: string;
  /** Long, message-ready label for the WhatsApp text:
      "Friday, November 21" / «الجمعة، ٢١ تشرين الثاني» */
  waLabel: string;
};

/** Opening hours (decimal). Mirrors lib/hours.ts — Mon–Fri 7:30–18:00,
    Sat–Sun 8:00–19:00. */
const WEEKDAY_HOURS = { open: 7.5, close: 18 };
const WEEKEND_HOURS = { open: 8, close: 19 };

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

/** Minutes since midnight on the Beirut clock — used to grey out the
    times that have already passed today. */
export function beirutMinutesNow(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Beirut",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return (get("hour") % 24) * 60 + get("minute");
}

/** The four day chips: today plus the next 3 days — real dates. */
export function getBookingDays(lang: Lang): BookingDay[] {
  const chipFmt = new Intl.DateTimeFormat(lang === "ar" ? "ar-LB" : "en-US", {
    month: "short",
    day: "numeric",
  });
  const chipWeekdayFmt = new Intl.DateTimeFormat(
    lang === "ar" ? "ar-LB" : "en-US",
    { weekday: "short" }
  );
  const waFmt = new Intl.DateTimeFormat(lang === "ar" ? "ar-LB" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const valueFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return [0, 1, 2, 3].map((offset) => {
    const d = beirutDate(offset);
    const chipDate = chipFmt.format(d);
    const label =
      offset === 0
        ? lang === "ar"
          ? `اليوم، ${chipDate}`
          : `Today, ${chipDate}`
        : offset === 1
          ? lang === "ar"
            ? `بكرا، ${chipDate}`
            : `Tomorrow, ${chipDate}`
          : lang === "ar"
            ? `${chipWeekdayFmt.format(d)}، ${chipDate}`
            : `${chipWeekdayFmt.format(d)}, ${chipDate}`;
    return {
      value: valueFmt.format(d),
      label,
      waLabel: waFmt.format(d),
    };
  });
}

/** Reservation slots for a given day offset — generated from that
    weekday's real opening hours, every 90 minutes, last seat 1 hour
    before closing (Mon–Fri 7:30…16:30 · Sat–Sun 8:00…17:00). */
export function getBookingSlots(offset: number): string[] {
  const weekday = beirutDate(offset).getDay(); // 0 = Sun
  const weekend = weekday === 0 || weekday === 6;
  const { open, close } = weekend ? WEEKEND_HOURS : WEEKDAY_HOURS;

  const slots: string[] = [];
  for (let t = open; t <= close - 1; t += 1.5) {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    slots.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    );
  }
  return slots;
}

/** A slot ("16:30") as minutes since midnight — for past-time checks. */
export function slotToMinutes(slot: string): number {
  const [h, m] = slot.split(":").map(Number);
  return h * 60 + m;
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
