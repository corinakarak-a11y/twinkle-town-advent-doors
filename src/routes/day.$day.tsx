import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StarField } from "@/components/advent/StarField";
import { GATE_KEY, SPECIAL_DAYS, isUnlocked } from "@/lib/advent";
import { getDayContent } from "@/lib/advent-content";
import { SongsGift } from "@/components/songs/SongsGift";

export const Route = createFileRoute("/day/$day")({
  loader: ({ params }) => {
    const day = Number(params.day);
    if (!Number.isInteger(day) || day < 1 || day > 25) throw notFound();
    return { day };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `December ${loaderData.day} · Advent Calendar` },
          { name: "description", content: `Today's little surprise for December ${loaderData.day}.` },
          { property: "og:title", content: `December ${loaderData.day}` },
          { property: "og:description", content: "A little advent surprise." },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Advent Calendar" }, { name: "robots", content: "noindex" }],
  }),
  errorComponent: () => <div className="p-10 text-center">Something went wrong. <Link to="/calendar" className="underline">Back</Link></div>,
  notFoundComponent: () => <div className="flex min-h-dvh items-center justify-center bg-wine-deep p-10 text-center">That door doesn't exist. <Link to="/calendar" className="ml-2 underline">Back to the house</Link></div>,
  component: DayPage,
});

function DayPage() {
  const { day } = Route.useLoaderData();
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const content = getDayContent(day);
  const special = SPECIAL_DAYS.has(day);

  useEffect(() => {
    if (sessionStorage.getItem(GATE_KEY) !== "1") navigate({ to: "/" });
    else if (!isUnlocked(day, Date.now())) navigate({ to: "/calendar" });
    else setOk(true);
  }, [day, navigate]);

  if (ok && day === 1) return <SongsGift />;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--wine),var(--wine-deep))]">
      <StarField count={special ? 110 : 60} />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        {ok && (
          <div className="animate-rise-in">
            <p className="font-ui text-xs uppercase tracking-[0.4em] text-gold">December</p>
            <h1 className={`font-display text-[9rem] font-bold leading-none sm:text-[12rem] ${special ? "text-gold drop-shadow-[0_0_30px_var(--gold)]" : ""}`}>{day}</h1>
            <div className="mt-2 text-6xl">{content.emoji}</div>
            <h2 className="mt-6 font-display text-4xl font-semibold uppercase tracking-wide">{content.title}</h2>
            <p className="mt-4 font-ui text-lg leading-relaxed text-snow/85">{content.message}</p>
            <Link to="/calendar" className="mt-10 inline-block rounded-full bg-parchment px-7 py-3 font-display text-lg uppercase tracking-widest text-wine-deep transition hover:brightness-105">
              Back to the house
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
