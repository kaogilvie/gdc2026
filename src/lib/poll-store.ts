import { pollConfig } from "./config";

type VoteCounts = Record<string, number>;

function emptyCounts(): VoteCounts {
  return Object.fromEntries(pollConfig.options.map((option) => [option.id, 0]));
}

const store = {
  generation: 1,
  counts: emptyCounts(),
};

export type PollState = {
  counts: VoteCounts;
  generation: number;
};

export function getPollState(): PollState {
  return {
    counts: { ...store.counts },
    generation: store.generation,
  };
}

export function castVote(optionId: string): PollState {
  const validOption = pollConfig.options.some((option) => option.id === optionId);
  if (!validOption) {
    throw new Error("Invalid poll option");
  }

  store.counts[optionId] = (store.counts[optionId] ?? 0) + 1;
  return getPollState();
}

export function resetPoll(): PollState {
  store.counts = emptyCounts();
  store.generation += 1;
  return getPollState();
}
