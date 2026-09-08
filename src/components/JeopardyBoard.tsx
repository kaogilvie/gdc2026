import Link from "next/link";
import { presentations } from "@/lib/config";

export function JeopardyBoard() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-ko-accent">
          Choose a Category
        </p>
        <h2 className="mt-2 text-4xl font-bold text-ko-dark">
          Jeopardy Board
        </h2>
        <p className="mt-3 text-ko-muted">
          Pick a tile to open its slide deck.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {presentations.map((presentation, index) => (
          <Link
            key={presentation.slug}
            href={`/presentations/${presentation.slug}`}
            className="group relative overflow-hidden rounded-2xl border-2 border-ko-accent bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:bg-ko-light-muted hover:shadow-md"
          >
            <span className="absolute left-4 top-4 rounded-full bg-ko-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-ko-dark">
              ${(index + 1) * 200}
            </span>
            <span className="block text-2xl font-black uppercase tracking-wide text-ko-accent transition-colors group-hover:text-ko-accent-hover sm:text-3xl">
              {presentation.jeopardyLabel}
            </span>
            <span className="mt-3 block text-sm text-ko-muted">
              {presentation.subtitle}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
