import { NextResponse } from "next/server";
import {
  castWordCloudVote,
  getWordCloudPollState,
} from "@/lib/word-cloud-poll-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pollId = new URL(request.url).searchParams.get("pollId");

  if (!pollId) {
    return NextResponse.json(
      { error: "pollId is required" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await getWordCloudPollState(pollId));
  } catch {
    return NextResponse.json({ error: "Invalid poll" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      pollId?: string;
      optionId?: string;
    };

    if (!body.pollId || !body.optionId) {
      return NextResponse.json(
        { error: "pollId and optionId are required" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      await castWordCloudVote(body.pollId, body.optionId),
    );
  } catch {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }
}
