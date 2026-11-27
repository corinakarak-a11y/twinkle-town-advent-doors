import { PASSWORD } from "./advent";

// Pure password + hint logic for the gate. Edit hint wording freely here.
export type Piece = "i" | "love" | "my" | "little" | "nerd";
const PIECES: Piece[] = ["i", "love", "my", "little", "nerd"];

export function normalize(guess: string): string {
  return guess.toLowerCase().replace(/[^a-z]/g, "");
}

export function isCorrect(guess: string): boolean {
  return normalize(guess) === PASSWORD;
}

// Split one squashed-together token (e.g. "mylittlenerd") into known pieces, or null.
function segment(token: string): Piece[] | null {
  if (token === "") return [];
  for (const p of [...PIECES].sort((a, b) => b.length - a.length)) {
    if (token.startsWith(p)) {
      const rest = segment(token.slice(p.length));
      if (rest) return [p, ...rest];
    }
  }
  return null;
}

const ALIASES: Record<string, Piece> = { luv: "love", loves: "love", lil: "little", nerdy: "nerd", nerds: "nerd", im: "i" };

export function findPieces(guess: string): Piece[] {
  const found: Piece[] = [];
  const tokens = guess.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  for (const t of tokens) {
    const seg = ALIASES[t] ? [ALIASES[t]] : segment(t);
    if (seg) found.push(...seg);
    else for (const p of ["love", "little", "nerd"] as Piece[]) if (t.includes(p)) found.push(p);
  }
  return found;
}

const GENERIC = [
  "Not quite. Think about what she calls you.",
  "Still locked. It's a nickname — a sweet one, said with love.",
  "Hint: you're clever, a bit geeky… what's the word for that?",
  "Big hint: it starts with how she feels, and ends with what you are to her.",
  "Final hint: \"I ___ my ___ ___\" — five little words.",
];

export function hintFor(guess: string, genericAttempt: number): string {
  const found = new Set(findPieces(guess));
  const has = (p: Piece) => found.has(p);
  if (found.size === 0) return GENERIC[Math.min(genericAttempt, GENERIC.length - 1)] ?? GENERIC[0]!;
  if (found.size === 5) return "Every word is there! Now put them in the order she'd say it to you.";

  const key = PIECES.filter(has).join("+");
  const special: Record<string, string> = {
    nerd: "You got the word! Now, what else does she call you with it?",
    "my+nerd": "Ah, you've got the possessive part! But there's another little word tucked in there, too.",
    "little+nerd": "You've got the little part! Now make it a little more possessive.",
    "my+little+nerd": "Almost! What does she feel for you? That feeling belongs at the very beginning.",
    "love+my+little+nerd": "So close! Who's doing the loving? Say it from her side.",
    "i+my+little+nerd": "Nearly there! You've got who, but not how she feels.",
    little: "Little… little what? Think of the nickname she gives you.",
    my: "Mine, yes — but your what? What does she call you?",
    love: "Love is the right feeling! Now, who does she love? Think of her nickname for you.",
    i: "Starting from her side is right. Keep going — what does she feel, and for whom?",
    "i+love": "Lovely start! Now finish the sentence — who does she love? Her pet name for you.",
    "my+little": "My little… what? There's one nerdy word missing.",
    "love+nerd": "Love and the nickname — great! There are a couple of little words in between, one of them possessive.",
  };
  const s = special[key];
  if (s) return s;

  // Fallback: nudge toward the first missing piece, never repeating what they have.
  if (!has("nerd")) return "Good progress! But what does she actually call you? A geeky little word.";
  if (!has("little") && !has("my")) return "You're onto something! Two small words are missing — one is possessive, one is tiny.";
  if (!has("little")) return "Getting close! There's a tiny word missing — how big are you to her?";
  if (!has("my")) return "Nearly! Make it possessive — whose nerd are you?";
  if (!has("love")) return "Almost! You know who, but what does she feel?";
  return "So close! Who's saying it? Start the sentence from her side.";
}
