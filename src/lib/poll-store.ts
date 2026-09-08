import { Redis } from "@upstash/redis";
import { pollConfig } from "./config";

const POLL_KEY = "gdc2026:poll";

type VoteCounts = Record<string, number>;

function emptyCounts(): VoteCounts {
  return Object.fromEntries(pollConfig.options.map((option) => [option.id, 0]));
}

function defaultState(): PollState {
  return {
    generation: 1,
    counts: emptyCounts(),
  };
}

export type PollState = {
  counts: VoteCounts;
  generation: number;
};

let memoryStore = defaultState();

function getRedisConfig(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

function hasRedisEnv(): boolean {
  return getRedisConfig() !== null;
}

function getRedis(): Redis {
  const config = getRedisConfig();
  if (!config) {
    throw new Error("Redis is not configured");
  }

  return new Redis(config);
}

function cloneState(state: PollState): PollState {
  return {
    generation: state.generation,
    counts: { ...state.counts },
  };
}

async function readState(): Promise<PollState> {
  if (!hasRedisEnv()) {
    return cloneState(memoryStore);
  }

  const state = await getRedis().get<PollState>(POLL_KEY);
  return state ? cloneState(state) : defaultState();
}

async function writeState(state: PollState): Promise<PollState> {
  const next = cloneState(state);

  if (!hasRedisEnv()) {
    memoryStore = next;
    return cloneState(next);
  }

  await getRedis().set(POLL_KEY, next);
  return cloneState(next);
}

export async function getPollState(): Promise<PollState> {
  return readState();
}

export async function castVote(optionId: string): Promise<PollState> {
  const validOption = pollConfig.options.some((option) => option.id === optionId);
  if (!validOption) {
    throw new Error("Invalid poll option");
  }

  const state = await readState();
  state.counts[optionId] = (state.counts[optionId] ?? 0) + 1;
  return writeState(state);
}

export async function resetPoll(): Promise<PollState> {
  const state = await readState();
  return writeState({
    generation: state.generation + 1,
    counts: emptyCounts(),
  });
}
