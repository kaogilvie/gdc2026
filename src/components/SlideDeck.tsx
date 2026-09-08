"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Presentation } from "@/lib/config";

type SlideDeckProps = {
  presentation: Presentation;
};

export function SlideDeck({ presentation }: SlideDeckProps) {
  const [index, setIndex] = useState(0);
  const slide = presentation.slides[index];
  const isFirst = index === 0;
  const isLast = index === presentation.slides.length - 1;

  const goNext = useCallback(() => {
    setIndex((current) =>
      Math.min(current + 1, presentation.slides.length - 1),
    );
  }, [presentation.slides.length]);

  const goPrevious = useCallback(() => {
    setIndex((current) => Math.max(current - 1, 0));
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrevious]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ko-accent">
            {presentation.title}
          </p>
          <p className="text-sm text-ko-muted">{presentation.subtitle}</p>
        </div>
        <Link
          href="/presentations"
          className="rounded-lg border border-ko-border px-4 py-2 text-sm text-ko-dark transition-colors hover:border-ko-accent hover:text-ko-accent"
        >
          Back to board
        </Link>
      </div>

      <section className="min-h-[28rem] rounded-3xl border-2 border-ko-accent bg-white p-8 shadow-sm sm:min-h-[32rem] sm:p-12">
        <div className="flex h-full flex-col justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ko-muted">
              Slide {index + 1} of {presentation.slides.length}
            </p>
            <h2 className="mt-4 text-4xl font-bold text-ko-dark sm:text-5xl">
              {slide.title}
            </h2>

            {slide.body ? (
              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-ko-dark/80">
                {slide.body}
              </p>
            ) : null}

            {slide.bullets ? (
              <ul className="mt-8 space-y-4 text-xl text-ko-dark/80">
                {slide.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-ko-accent" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrevious}
            disabled={isFirst}
            className="rounded-lg border border-ko-border bg-white px-4 py-2 text-sm font-semibold text-ko-dark transition-colors hover:border-ko-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={isLast}
            className="rounded-lg bg-ko-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ko-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>

        <p className="text-sm text-ko-muted">
          Use arrow keys or spacebar to navigate
        </p>
      </div>
    </div>
  );
}
