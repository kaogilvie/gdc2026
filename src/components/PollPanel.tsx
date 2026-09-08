"use client";

import { useCallback, useEffect, useState } from "react";
import { pollConfig } from "@/lib/config";

type VoteCounts = Record<string, number>;

const VOTED_GENERATION_KEY = "gdc2026-poll-generation";

export function PollPanel() {
  const [counts, setCounts] = useState<VoteCounts>({});
  const [generation, setGeneration] = useState(1);
  const [votedGeneration, setVotedGeneration] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasVoted =
    votedGeneration !== null && votedGeneration === generation;

  const applyPollState = useCallback(
    (data: { counts: VoteCounts; generation: number }) => {
      setCounts(data.counts);
      setGeneration(data.generation);

      const storedGeneration = window.sessionStorage.getItem(VOTED_GENERATION_KEY);
      const storedOption = window.sessionStorage.getItem(
        `${VOTED_GENERATION_KEY}:option`,
      );

      if (
        storedGeneration &&
        Number(storedGeneration) === data.generation &&
        storedOption
      ) {
        setVotedGeneration(data.generation);
        setSelectedOption(storedOption);
      } else if (storedGeneration && Number(storedGeneration) !== data.generation) {
        setVotedGeneration(null);
        setSelectedOption(null);
        window.sessionStorage.removeItem(VOTED_GENERATION_KEY);
        window.sessionStorage.removeItem(`${VOTED_GENERATION_KEY}:option`);
      }
    },
    [],
  );

  const loadResults = useCallback(async () => {
    const response = await fetch("/api/poll", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load poll results");
    }

    const data = (await response.json()) as {
      counts: VoteCounts;
      generation: number;
    };
    applyPollState(data);
  }, [applyPollState]);

  useEffect(() => {
    const storedGeneration = window.sessionStorage.getItem(VOTED_GENERATION_KEY);
    const storedOption = window.sessionStorage.getItem(
      `${VOTED_GENERATION_KEY}:option`,
    );

    if (storedGeneration) {
      setVotedGeneration(Number(storedGeneration));
      setSelectedOption(storedOption);
    }

    loadResults().catch(() => {
      setError("Unable to load live results.");
    });

    const interval = window.setInterval(() => {
      loadResults().catch(() => undefined);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [loadResults]);

  async function handleVote(optionId: string) {
    if (hasVoted || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });

      if (!response.ok) {
        throw new Error("Vote failed");
      }

      const data = (await response.json()) as {
        counts: VoteCounts;
        generation: number;
      };
      applyPollState(data);
      setVotedGeneration(data.generation);
      setSelectedOption(optionId);
      window.sessionStorage.setItem(
        VOTED_GENERATION_KEY,
        String(data.generation),
      );
      window.sessionStorage.setItem(`${VOTED_GENERATION_KEY}:option`, optionId);
    } catch {
      setError("Something went wrong submitting your vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalVotes = Object.values(counts).reduce(
    (sum, count) => sum + (count ?? 0),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <section className="rounded-2xl border border-ko-border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ko-accent">
          Anonymous Poll
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ko-dark">
          {pollConfig.question}
        </h2>
        <p className="mt-3 text-sm text-ko-muted">
          No login required. One vote per round.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {pollConfig.options.map((option) => {
            const isSelected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                type="button"
                disabled={hasVoted || isSubmitting}
                onClick={() => handleVote(option.id)}
                className={`rounded-xl border px-4 py-4 text-left transition-all ${
                  isSelected
                    ? "border-ko-accent bg-ko-light-muted text-ko-dark"
                    : "border-ko-border bg-white text-ko-dark hover:border-ko-accent hover:bg-ko-light-muted/50"
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                <span className="text-lg font-semibold">{option.label}</span>
                {isSelected ? (
                  <span className="mt-1 block text-xs text-ko-accent">
                    Your vote
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {hasVoted ? (
          <p className="mt-4 text-sm text-ko-accent">
            Thanks — your vote was recorded anonymously.
          </p>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </section>

      <section className="rounded-2xl border border-ko-border bg-ko-light-muted/30 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ko-accent">
              Live Results
            </p>
            <p className="mt-1 text-sm text-ko-muted">
              Round {generation} · updates every 3 seconds
            </p>
          </div>
          <p className="text-sm text-ko-muted">{totalVotes} votes</p>
        </div>

        <div className="mt-6 space-y-4">
          {pollConfig.options.map((option) => {
            const count = counts[option.id] ?? 0;
            const percentage =
              totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div key={option.id}>
                <div className="mb-1 flex items-center justify-between text-sm text-ko-dark">
                  <span>{option.label}</span>
                  <span>
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ko-light">
                  <div
                    className="h-full rounded-full bg-ko-accent transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
