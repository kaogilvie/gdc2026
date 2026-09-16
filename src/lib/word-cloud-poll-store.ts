import { Redis } from "@upstash/redis";
import { getWordCloudPollConfig, wordCloudPollConfigs } from "./config";

const POLL_KEY_PREFIX = "gdc2026:word-cloud-poll";

type VoteCounts = Record<string, number>;

function emptyCounts(pollId: string): VoteCounts {
  const config = getWordCloudPollConfig(pollId);
  if (!config) {
    throw new Error("Invalid poll id");
  }

  return Object.fromEntries(
    config.options.map((option) => [option.id, 0]),
  );
}

function defaultState(pollId: string): PollState {
  return {
    generation: 1,
    counts: emptyCounts(pollId),
  };
}

export type PollState = {
  counts: VoteCounts;
  generation: number;
};

const memoryStores = new Map<string, PollState>();

function pollKey(pollId: string): string {
  return `${POLL_KEY_PREFIX}:${pollId}`;
}

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

async function readState(pollId: string): Promise<PollState> {
  if (!getWordCloudPollConfig(pollId)) {
    throw new Error("Invalid poll id");
  }

  if (!hasRedisEnv()) {
    const stored = memoryStores.get(pollId);
    return cloneState(stored ?? defaultState(pollId));
  }

  const state = await getRedis().get<PollState>(pollKey(pollId));
  return state ? cloneState(state) : defaultState(pollId);
}

async function writeState(pollId: string, state: PollState): Promise<PollState> {
  const next = cloneState(state);

  if (!hasRedisEnv()) {
    memoryStores.set(pollId, next);
    return cloneState(next);
  }

  await getRedis().set(pollKey(pollId), next);
  return cloneState(next);
}

export async function getWordCloudPollState(pollId: string): Promise<PollState> {
  return readState(pollId);
}

export async function castWordCloudVote(
  pollId: string,
  optionId: string,
): Promise<PollState> {
  const config = getWordCloudPollConfig(pollId);
  if (!config) {
    throw new Error("Invalid poll id");
  }

  const validOption = config.options.some((option) => option.id === optionId);
  if (!validOption) {
    throw new Error("Invalid poll option");
  }

  const state = await readState(pollId);
  state.counts[optionId] = (state.counts[optionId] ?? 0) + 1;
  return writeState(pollId, state);
}

export async function resetWordCloudPoll(pollId: string): Promise<PollState> {
  const state = await readState(pollId);
  return writeState(pollId, {
    generation: state.generation + 1,
    counts: emptyCounts(pollId),
  });
}

export async function resetAllWordCloudPolls(): Promise<Record<string, PollState>> {
  const results: Record<string, PollState> = {};

  for (const pollId of Object.keys(wordCloudPollConfigs)) {
    results[pollId] = await resetWordCloudPoll(pollId);
  }

  return results;
}
