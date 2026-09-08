import { NextResponse } from "next/server";
import { castVote, getPollState } from "@/lib/poll-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPollState());
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { optionId?: string };

    if (!body.optionId) {
      return NextResponse.json(
        { error: "optionId is required" },
        { status: 400 },
      );
    }

    return NextResponse.json(await castVote(body.optionId));
  } catch {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }
}
