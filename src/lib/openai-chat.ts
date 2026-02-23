import OpenAI from 'openai';
import type { ChatMessage } from '@/types';

const PROFESSOR_CHEN_SYSTEM = `你是陳思遠教授，55歲，曾任花旗銀行台灣區外匯交易室主管，退休後在大學任教國際財務管理。

你的教學風格：
- 愛用生活化的比喻解釋複雜理論（例如「匯率就像海浪，你不能阻止它，但你可以學會衝浪」）
- 使用蘇格拉底式提問法，引導學生自己思考答案
- 不直接給出答案，而是提供線索和反問
- 用珍途（ZhenTu）珍珠奶茶品牌國際化的案例來解釋概念
- 說話沉穩溫和，偶爾帶些幽默
- 鼓勵學生思考，常說「想想看…」、「如果你是林美…」

回答規則：
- 使用繁體中文
- 涉及公式時使用 LaTeX 語法（如 $NPV = \\sum \\frac{CF_t}{(1+r)^t}$）
- 用 Markdown 格式排版
- 回答控制在 300 字以內，除非學生要求詳細解釋
- 如果學生問的問題超出國際財務管理範圍，溫和地引導回來`;

export function buildSystemPrompt(
  weekContext?: string,
  glossaryContext?: string,
  lessonContext?: string,
): string {
  let prompt = PROFESSOR_CHEN_SYSTEM;

  // lessonContext 比 weekContext 更具體，放在前面
  if (lessonContext) {
    prompt += `\n\n${lessonContext}`;
  }

  if (weekContext) {
    prompt += `\n\n本週課程背景：\n${weekContext}`;
  }

  if (glossaryContext) {
    prompt += `\n\n本週重要術語：\n${glossaryContext}`;
  }

  return prompt;
}

export async function createChatStream(
  messages: ChatMessage[],
  weekContext?: string,
  glossaryContext?: string,
  lessonContext?: string,
): Promise<ReadableStream<Uint8Array>> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = buildSystemPrompt(weekContext, glossaryContext, lessonContext);

  const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => {
      const hasImages = m.attachments?.some(a => a.type === 'image');
      const fileTexts = m.attachments
        ?.filter(a => a.type === 'file')
        .map(a => `\n\n[附件：${a.name}]\n${a.data}`)
        .join('') ?? '';

      if (hasImages && m.role === 'user') {
        // Multimodal message: text + image(s)
        const parts: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
          { type: 'text', text: m.content + fileTexts },
          ...m.attachments!
            .filter(a => a.type === 'image')
            .map(a => ({
              type: 'image_url' as const,
              image_url: { url: `data:${a.mimeType};base64,${a.data}` },
            })),
        ];
        return { role: 'user' as const, content: parts };
      }

      return {
        role: m.role as 'user' | 'assistant',
        content: m.content + fileTexts,
      };
    }),
  ];

  const stream = client.chat.completions.stream({
    model: 'gpt-4o',
    messages: openaiMessages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      stream.on('content', (delta) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
      });

      stream.on('end', () => {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      });

      stream.on('error', (err) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
        controller.close();
      });
    },
  });
}
