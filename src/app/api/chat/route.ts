import { NextRequest, NextResponse } from "next/server";
import { createChatStream } from "@/lib/openai-chat";
import { loadEpisodes, loadGlossary } from "@/lib/content";
import type { ChatMessage } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { messages, week } = (await request.json()) as {
      messages: ChatMessage[];
      week?: number;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing messages" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Build week context
    let weekContext: string | undefined;
    let glossaryContext: string | undefined;

    if (week) {
      const episodes = loadEpisodes();
      const episode = episodes.find((e) => e.week === week);
      if (episode) {
        weekContext = `第 ${week} 週：${episode.title}\n主題：${episode.ifm_topics.join("、")}\n故事：${episode.story_summary}\n重點：${episode.key_concepts.join("、")}`;
      }

      const terms = loadGlossary(week);
      if (terms.length > 0) {
        glossaryContext = terms
          .map((t) => `- ${t.term_zh}（${t.term_en}）：${t.definition}`)
          .join("\n");
      }
    }

    const stream = await createChatStream(messages, weekContext, glossaryContext);

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Chat API]", error);
    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}
