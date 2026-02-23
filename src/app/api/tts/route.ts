import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@/lib/tts-engine";
import type { CharacterId } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { text, character } = (await request.json()) as {
      text: string;
      character: CharacterId;
    };

    if (!text || !character) {
      return NextResponse.json(
        { error: "Missing text or character" },
        { status: 400 }
      );
    }

    const result = await synthesize(text, character);

    return new NextResponse(result.audio as ArrayBuffer, {
      headers: {
        "Content-Type": result.contentType,
        "X-TTS-Engine": result.engine,
      },
    });
  } catch (error) {
    console.error("[TTS API]", error);
    return NextResponse.json(
      { error: "TTS synthesis failed" },
      { status: 500 }
    );
  }
}
