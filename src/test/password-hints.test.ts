import { describe, it, expect } from "vitest";
import { isCorrect, hintFor } from "../lib/password-hints";

describe("gate password", () => {
  it("accepts any case and spacing", () => {
    for (const g of ["ilovemylittlenerd", "ILOVEMYLITTLENERD", "I Love My Little Nerd", "  i love my littlenerd "]) expect(isCorrect(g)).toBe(true);
  });
  it("rejects partial or wrong", () => {
    expect(isCorrect("my little nerd")).toBe(false);
    expect(isCorrect("hello")).toBe(false);
  });
});

describe("keyword hints", () => {
  it("responds to the user's example combos", () => {
    expect(hintFor("nerd", 0)).toMatch(/You got the word/);
    expect(hintFor("my nerd", 0)).toMatch(/possessive part/);
    expect(hintFor("little nerd", 0)).toMatch(/little part/);
    expect(hintFor("My Little Nerd", 0)).toMatch(/very beginning/);
    expect(hintFor("mylittlenerd", 0)).toMatch(/very beginning/);
  });
  it("never tells them to find a word they already have", () => {
    expect(hintFor("love nerd", 0)).toMatch(/possessive/);
    expect(hintFor("i love little nerd", 0)).toMatch(/possessive/);
    expect(hintFor("i love my nerd", 0)).toMatch(/tiny word/);
  });
  it("flags right words in wrong order", () => {
    expect(hintFor("nerd little my love i", 0)).toMatch(/order/);
  });
  it("generic hints escalate only for keyword-free guesses", () => {
    expect(hintFor("banana", 0)).not.toBe(hintFor("banana", 3));
    expect(hintFor("banana", 99)).toMatch(/five little words/);
  });
});
