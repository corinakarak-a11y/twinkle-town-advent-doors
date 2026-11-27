// Doors unlock at 08:00 Vienna time (CET, UTC+1 in December) = 07:00 UTC.
export const ADVENT_YEAR = 2026;
export const PASSWORD = "hello";

export function unlockTime(day: number, year = ADVENT_YEAR): number {
  return Date.UTC(year, 11, day, 7, 0, 0);
}

export function isUnlocked(day: number, now: number, preview = false): boolean {
  return preview || now >= unlockTime(day);
}

export function countdown(day: number, now: number) {
  const ms = Math.max(0, unlockTime(day) - now);
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** Next door still locked, or null when all are open. */
export function nextLockedDay(now: number): number | null {
  for (let d = 1; d <= 25; d++) if (now < unlockTime(d)) return d;
  return null;
}

// Scattered door order, like a real advent calendar.
export const DOOR_ORDER = [
  7, 19, 2, 14, 22,
  11, 4, 25, 9, 16,
  20, 1, 13, 5, 23,
  3, 17, 8, 24, 10,
  15, 21, 6, 12, 18,
];

export const SPECIAL_DAYS = new Set([13, 25]);

export const GATE_KEY = "advent-unlocked";
export const PREVIEW_KEY = "advent-preview";
