import Link from "next/link";
import { resetPoll } from "@/lib/poll-store";
import { resetAllWordCloudPolls } from "@/lib/word-cloud-poll-store";

export const dynamic = "force-dynamic";

export default async function ResetPage() {
  const [{ generation }, wordCloudPolls] = await Promise.all([
    resetPoll(),
    resetAllWordCloudPolls(),
  ]);
  const wordCloudCount = Object.keys(wordCloudPolls).length;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-ko-border bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ko-accent">
          Poll reset
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ko-dark">
          Round {generation} is ready
        </h1>
        <p className="mt-3 text-sm text-ko-muted">
          Topic poll and {wordCloudCount} word cloud
          {wordCloudCount === 1 ? "" : "s"} reset. The audience can vote again.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-ko-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ko-accent-hover"
        >
          Back to poll
        </Link>
      </div>
    </div>
  );
}
