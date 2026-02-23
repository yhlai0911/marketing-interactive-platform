import { NextRequest, NextResponse } from 'next/server';
import { createChatStream } from '@/lib/openai-chat';
import { loadGlossary } from '@/lib/content';
import type { ChatMessage } from '@/types';

const SCOPE_LIMIT_PROMPT = `你現在是「課程頁面 AI 助教」模式，嵌入在互動課程中。

額外規則：
- 只回答本週教學範圍內的問題
- 如果學生問的問題超出本週範圍，回覆：「這個問題超出本週的教學範圍，我們先專注在本週的內容吧！如果你對其他主題有疑問，可以去『AI 家教』頁面找我。」
- 回答控制在 200 字以內，簡潔扼要
- 優先引用當前段落的概念和例子
- 不要重複學生已經知道的內容，直接回答問題核心`;

export async function POST(request: NextRequest) {
  try {
    const { messages, weekNum, lessonContext } = (await request.json()) as {
      messages: ChatMessage[];
      weekNum: number;
      lessonContext: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
    }

    // Build glossary context (server-side, filtered to current week)
    let glossaryContext: string | undefined;
    if (weekNum) {
      const terms = loadGlossary(weekNum);
      if (terms.length > 0) {
        glossaryContext = terms
          .map(t => `- ${t.term_zh}（${t.term_en}）：${t.definition}`)
          .join('\n');
      }
    }

    // Combine scope-limiting prompt with lesson context
    const fullLessonContext = `${SCOPE_LIMIT_PROMPT}\n\n${lessonContext}`;

    const stream = await createChatStream(
      messages,
      undefined,          // weekContext — not needed, lessonContext is more specific
      glossaryContext,
      fullLessonContext,
    );

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Lesson Chat API]', error);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
