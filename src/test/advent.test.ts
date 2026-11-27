import { describe, it, expect } from "vitest";
import { isUnlocked, unlockTime, nextLockedDay } from "../lib/advent";

describe("advent unlock schedule", () => {
  it("unlocks a door at 8:00 Vienna time on its day", () => {
    expect(isUnlocked(5, Date.parse("2026-12-05T07:59:59+01:00"))).toBe(false);
    expect(isUnlocked(5, Date.parse("2026-12-05T08:00:00+01:00"))).toBe(true);
  });
  it("preview override opens any door", () => {
    expect(isUnlocked(25, Date.parse("2026-11-27T00:00:00Z"), true)).toBe(true);
  });
  it("next locked day advances after unlock", () => {
    expect(nextLockedDay(unlockTime(3))).toBe(4);
    expect(nextLockedDay(unlockTime(25))).toBe(null);
  });
});
