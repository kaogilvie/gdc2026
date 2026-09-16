"use client";

import { useCallback, useEffect, useState } from "react";
import { getWordCloudPollConfig } from "@/lib/config";

type VoteCounts = Record<string, number>;

type WordCloudPollProps = {
  large?: boolean;
  pollId?: string;
};

function votedGenerationKey(pollId: string): string {
  return `gdc2026-word-cloud-poll-generation:${pollId}`;
}

function wordSize(count: number, maxCount: number, totalVotes: number): string {
  if (totalVotes === 0) {
    return "2rem";
  }

  const ratio = count / Math.max(maxCount, 1);
  const sizeRem = 1.5 + ratio * 3.5;
  return `${sizeRem}rem`;
}

export function WordCloudPoll({ pollId }: WordCloudPollProps) {
  const pollConfig = pollId ? getWordCloudPollConfig(pollId) : undefined;
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
      if (!pollId) {
        return;
      }

      setCounts(data.counts);
      setGeneration(data.generation);

      const storageKey = votedGenerationKey(pollId);
      const storedGeneration = window.sessionStorage.getItem(storageKey);
      const storedOption = window.sessionStorage.getItem(`${storageKey}:option`);

      if (
        storedGeneration &&
        Number(storedGeneration) === data.generation &&
        storedOption
      ) {
        setVotedGeneration(data.generation);
        setSelectedOption(storedOption);
      } else if (
        storedGeneration &&
        Number(storedGeneration) !== data.generation
      ) {
        setVotedGeneration(null);
        setSelectedOption(null);
        window.sessionStorage.removeItem(storageKey);
        window.sessionStorage.removeItem(`${storageKey}:option`);
      }
    },
    [pollId],
  );

  const loadResults = useCallback(async () => {
    if (!pollId) {
      return;
    }

    const response = await fetch(
      `/api/poll/word-cloud?pollId=${encodeURIComponent(pollId)}`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error("Could not load poll results");
    }

    const data = (await response.json()) as {
      counts: VoteCounts;
      generation: number;
    };
    applyPollState(data);
  }, [applyPollState, pollId]);

  useEffect(() => {
    if (!pollId) {
      return;
    }

    setCounts({});
    setGeneration(1);
    setVotedGeneration(null);
    setSelectedOption(null);
    setError(null);

    const storageKey = votedGenerationKey(pollId);
    const storedGeneration = window.sessionStorage.getItem(storageKey);
    const storedOption = window.sessionStorage.getItem(`${storageKey}:option`);

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
  }, [loadResults, pollId]);

  async function handleVote(optionId: string) {
    if (!pollId || hasVoted || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/poll/word-cloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, optionId }),
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

      const storageKey = votedGenerationKey(pollId);
      window.sessionStorage.setItem(storageKey, String(data.generation));
      window.sessionStorage.setItem(`${storageKey}:option`, optionId);
    } catch {
      setError("Something went wrong submitting your vote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!pollId || !pollConfig) {
    return (
      <p className="mt-8 text-sm text-red-600">
        This slide is missing a word cloud poll id.
      </p>
    );
  }

  const totalVotes = Object.values(counts).reduce(
    (sum, count) => sum + (count ?? 0),
    0,
  );
  const maxCount = Math.max(
    ...pollConfig.options.map((option) => counts[option.id] ?? 0),
    0,
  );

  return (
    <div className="mt-8 space-y-8">
      <div>
        {pollConfig.promptLines ? (
          <div
            className={`space-y-2 text-ko-dark/80 ${
              pollConfig.largePrompt ? "text-3xl sm:text-4xl" : "text-xl"
            }`}
          >
            {pollConfig.promptLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : pollConfig.prompt ? (
          <p
            className={`text-ko-dark/80 ${
              pollConfig.largePrompt ? "text-3xl sm:text-4xl" : "text-xl"
            }`}
          >
            {pollConfig.prompt}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pollConfig.options.map((option) => {
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={hasVoted || isSubmitting}
              onClick={() => handleVote(option.id)}
              className={`rounded-xl border px-4 py-4 text-center transition-all ${
                isSelected
                  ? "border-ko-accent bg-ko-light-muted text-ko-dark"
                  : "border-ko-border bg-white text-ko-dark hover:border-ko-accent hover:bg-ko-light-muted/50"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              <span className="text-2xl font-bold">{option.label}</span>
            </button>
          );
        })}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="rounded-2xl border border-ko-border bg-ko-light-muted/30 p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ko-accent">
              Results
            </p>
          </div>
        </div>

        <div className="mt-8 flex min-h-40 flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {pollConfig.options.map((option) => {
            const count = counts[option.id] ?? 0;
            const isSelected = selectedOption === option.id;

            return (
              <span
                key={option.id}
                className={`font-bold leading-none transition-all duration-500 ${
                  isSelected ? "text-ko-accent" : "text-ko-dark"
                } ${count === 0 && totalVotes > 0 ? "opacity-30" : ""}`}
                style={{
                  fontSize: wordSize(count, maxCount, totalVotes),
                }}
              >
                {option.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
