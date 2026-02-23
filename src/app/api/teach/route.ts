import { NextRequest, NextResponse } from "next/server";
import { createTeachingStream } from "@/lib/teach-engine";
import type { LessonSegment } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { segment, weekNum, weekTitle, segmentIndex, totalSegments } =
      (await request.json()) as {
        segment: LessonSegment;
        weekNum: number;
        weekTitle: string;
        segmentIndex: number;
        totalSegments: number;
      };

    if (!segment || weekNum == null) {
      return NextResponse.json(
        { error: "Missing segment or weekNum" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 },
      );
    }

    const stream = await createTeachingStream(
      segment,
      weekNum,
      weekTitle,
      segmentIndex,
      totalSegments,
    );

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Teach API]", error);
    return NextResponse.json(
      { error: "Teaching generation failed" },
      { status: 500 },
    );
  }
}
