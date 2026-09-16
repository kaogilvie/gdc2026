"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SoftwareDatabaseMcpExplainer } from "@/components/SoftwareDatabaseMcpExplainer";
import { TrainingRagContextActivity } from "@/components/TrainingRagContextActivity";
import { TrainingRagContextExplainer } from "@/components/TrainingRagContextExplainer";
import { WordCloudPoll } from "@/components/WordCloudPoll";
import type {
  NumberedBullet,
  Presentation,
  SlideComponent,
  SlideReference,
} from "@/lib/config";

type SlideComponentProps = {
  large?: boolean;
  pollId?: string;
};

const slideComponents: Record<
  SlideComponent,
  React.ComponentType<SlideComponentProps>
> = {
  "software-database-mcp": SoftwareDatabaseMcpExplainer,
  "training-rag-context": TrainingRagContextExplainer,
  "training-rag-context-activity": TrainingRagContextActivity,
  "word-cloud-poll": WordCloudPoll,
};

type SlideDeckProps = {
  presentation: Presentation;
};

type SlideBulletListProps = {
  bullets?: string[];
  numberedBullets?: NumberedBullet[];
  large: boolean;
  className?: string;
};

function SlideBulletList({
  bullets,
  numberedBullets,
  large,
  className = "",
}: SlideBulletListProps) {
  if (!bullets?.length && !numberedBullets?.length) {
    return null;
  }

  return (
    <ul
      className={`space-y-4 text-ko-dark/80 ${
        large ? "text-2xl sm:text-3xl" : "text-xl"
      } ${className}`}
    >
      {numberedBullets?.map((bullet) => (
        <li key={bullet.text} className="flex gap-3">
          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-ko-accent" />
          <span>
            {bullet.text}
            {bullet.refs?.map((ref) => (
              <sup
                key={ref}
                className="ml-0.5 text-sm font-semibold text-ko-accent"
              >
                {ref}
              </sup>
            ))}
          </span>
        </li>
      ))}
      {bullets?.map((bullet) => (
        <li key={bullet} className="flex gap-3">
          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-ko-accent" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

function SlideReferenceList({ references }: { references?: SlideReference[] }) {
  if (!references?.length) {
    return null;
  }

  return (
    <ol className="space-y-2 border-t border-ko-border pt-6 text-base text-ko-muted">
      {[...references]
        .sort((a, b) => a.id - b.id)
        .map((reference) => (
          <li key={reference.id}>
            <sup className="mr-1 font-semibold text-ko-accent">
              {reference.id}
            </sup>
            <Link
              href={reference.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ko-dark underline decoration-ko-accent/40 underline-offset-4 transition-colors hover:text-ko-accent"
            >
              {reference.text}
            </Link>
          </li>
        ))}
    </ol>
  );
}

export function SlideDeck({ presentation }: SlideDeckProps) {
  const [index, setIndex] = useState(0);
  const slide = presentation.slides[index];
  const SlideContent = slide.component
    ? slideComponents[slide.component]
    : null;
  const large = presentation.largeText ?? false;
  const bodyLarge = slide.largeBody ?? large;
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
            {slide.title ? (
              <h2 className="mt-4 text-4xl font-bold text-ko-dark sm:text-5xl">
                {slide.title}
              </h2>
            ) : null}

            {SlideContent ? (
              <SlideContent large={large} pollId={slide.wordCloudPollId} />
            ) : null}

            {!SlideContent &&
            (slide.body ||
              slide.bullets ||
              slide.numberedBullets ||
              slide.references ||
              slide.image ||
              slide.link) ? (
              <div className="mt-8 space-y-8">
                {slide.image && slide.imageFullWidth ? (
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt ?? ""}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 896px"
                    />
                  </div>
                ) : null}

                {slide.image && !slide.imageFullWidth ? (
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
                    <div className="relative mx-auto aspect-square w-48 shrink-0 sm:mx-0 sm:w-56 lg:w-64">
                      <Image
                        src={slide.image}
                        alt={slide.imageAlt ?? ""}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 192px, 256px"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      {slide.body ? (
                        <p
                          className={`whitespace-pre-line leading-relaxed text-ko-dark/80 ${
                            bodyLarge
                              ? "max-w-5xl text-4xl sm:text-5xl lg:text-6xl"
                              : "max-w-none text-xl"
                          }`}
                        >
                          {slide.body}
                        </p>
                      ) : null}

                      <SlideBulletList
                        bullets={slide.bullets}
                        numberedBullets={slide.numberedBullets}
                        large={large}
                        className={slide.body ? "mt-8" : ""}
                      />
                    </div>
                  </div>
                ) : null}

                {!slide.image || slide.imageFullWidth ? (
                  <>
                    {slide.body ? (
                      <p
                        className={`whitespace-pre-line leading-relaxed text-ko-dark/80 ${
                          bodyLarge
                            ? "max-w-5xl text-4xl sm:text-5xl lg:text-6xl"
                            : "max-w-3xl text-xl"
                        }`}
                      >
                        {slide.body}
                      </p>
                    ) : null}

                    <SlideBulletList
                      bullets={slide.bullets}
                      numberedBullets={slide.numberedBullets}
                      large={large}
                      className={slide.body ? "mt-8" : ""}
                    />
                  </>
                ) : null}

                <SlideReferenceList references={slide.references} />

                {slide.link ? (
                  <p className="text-lg">
                    <Link
                      href={slide.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ko-accent underline decoration-ko-accent/40 underline-offset-4 transition-colors hover:text-ko-accent-hover"
                    >
                      {slide.link.text}
                    </Link>
                  </p>
                ) : null}
              </div>
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
