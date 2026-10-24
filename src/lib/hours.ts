import type { Lang } from "./translations";

/* ------------------------------------------------------------------ */
/*  Opening hours logic — driven by the actual clock in Beirut         */
/*  (Asia/Beirut) via Intl, so the "Open now" badge is truthful no     */
/*  matter where the visitor is.                                       */
/*  Mon–Fri 7:30–18:00 · Sat–Sun 8:00–19:00                            */
/* ------------------------------------------------------------------ */

type DayHours = { open: number; close: number }; // decimal hours

const WEEKDAY: DayHours = { open: 7.5, close: 18 };
const WEEKEND: DayHours = { open: 8, close: 19 };

type BeirutNow = {
  weekdayShort: string; // "Mon" … "Sun"
  decimal: number; // 13.5 = 13:30 Beirut time
};

function beirutNow(): BeirutNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Beirut",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "0";

  // Intl can return "24" for midnight with hour12:false — normalise.
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  return { weekdayShort: get("weekday"), decimal: hour + minute / 60 };
}

function hoursForWeekday(weekdayShort: string): DayHours {
  return weekdayShort === "Sat" || weekdayShort === "Sun"
    ? WEEKEND
    : WEEKDAY;
}

/** Format a decimal hour (e.g. 7.5) as a locale time label. */
function formatHour(decimal: number, lang: Lang): string {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-LB" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export type CafeStatus = { open: boolean; timeLabel: string };

/**
 * Day/night feel for the terrace, by the Beirut clock (not the visitor's).
 * "Day" = 6:00–18:29 (sun-washed), otherwise lantern-lit evening/night.
 */
export type TerracePhase = "day" | "night";

export function getTerracePhase(): TerracePhase {
  const { decimal } = beirutNow();
  return decimal >= 6 && decimal < 18.5 ? "day" : "night";
}

/**
 * Which part of the menu is having its moment right now, by Beirut clock.
 * Breakfast 6:00–10:59 · coffee run 11:00–11:59 · lunch 12:00–15:29 ·
 * sweet hour 15:30–18:59 · null outside opening hours.
 */
export type PopularCategory = "breakfast" | "coffee" | "mains" | "desserts";

export function getPopularCategory(): PopularCategory | null {
  const { decimal } = beirutNow();
  if (decimal < 6 || decimal >= 19) return null;
  if (decimal < 11) return "breakfast";
  if (decimal < 12) return "coffee";
  if (decimal < 15.5) return "mains";
  return "desserts";
}

/**
 * Current open/closed state + the relevant transition time label
 * (closing time when open, next opening time when closed).
 */
export function getCafeStatus(lang: Lang): CafeStatus {
  const now = beirutNow();
  const today = hoursForWeekday(now.weekdayShort);

  if (now.decimal >= today.open && now.decimal < today.close) {
    return { open: true, timeLabel: formatHour(today.close, lang) };
  }

  // Closed → find the next opening time (today if still ahead, else tomorrow).
  const nextIsToday = now.decimal < today.open;
  let nextOpenDecimal = today.open;

  if (!nextIsToday) {
    const weekdayNames = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ] as const;
    const idx = weekdayNames.indexOf(
      now.weekdayShort as (typeof weekdayNames)[number]
    );
    const tomorrow = weekdayNames[(idx + 1) % 7];
    nextOpenDecimal = hoursForWeekday(tomorrow).open;
  }

  return { open: false, timeLabel: formatHour(nextOpenDecimal, lang) };
}
