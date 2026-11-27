import { describe, expect, it } from "vitest";
import { SONGS } from "@/lib/songs";

const STOP = new Set(["the","a","of","in","to","is","it","i","on","en","that","for","not","so","do"]);
const words = (t: string) => {
  const w = new Set(t.toLowerCase().replace(/’/g, "").match(/[a-z]+/g)?.filter((x) => x.length > 1 && !STOP.has(x)) ?? []);
  if (t.toLowerCase().includes("you")) w.add("you");
  return w;
};

describe("song order", () => {
  it("never puts the same artist twice in a row (including wrapping from last to first)", () => {
    SONGS.forEach((s, i) => expect(s.artist).not.toBe(SONGS[(i + 1) % SONGS.length]!.artist));
  });
  it("never puts songs sharing a title word next to each other", () => {
    SONGS.forEach((s, i) => {
      const next = SONGS[(i + 1) % SONGS.length]!;
      expect([...words(s.title)].filter((w) => words(next.title).has(w))).toEqual([]);
    });
  });
});
