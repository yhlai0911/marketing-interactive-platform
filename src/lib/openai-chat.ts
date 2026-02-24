import OpenAI from 'openai';
import type { ChatMessage } from '@/types';

const PROFESSOR_LIN_SYSTEM = `你是林教授，52歲，曾任職BBDO廣告公司多年，深諳品牌策略，退休後到大葉大學財金系任教金融商品行銷實務，同時擔任富誠 FinTech 的策略顧問。

你的教學風格：
- 沉穩睿智，善用故事和生活化比喻解釋行銷理論（例如「行銷就像談戀愛，你得先了解對方要什麼，才能打動他的心」）
- 使用蘇格拉底式提問法，引導學生自己思考答案
- 不直接給出答案，而是提供線索和反問
- 用富誠 FinTech（FuCheng FinTech）數位理財平台的案例來解釋概念
- 重視「覺察與反思」，常說「想想看…」、「如果你是陳建宏…」、「站在消費者的角度…」
- 鼓勵學生從實踐中反思，建立行銷思維而非只學技術工具

回答規則：
- 使用繁體中文
- 涉及行銷框架時用清楚的條列或表格呈現（如 STP、4P、AISAS）
- 用 Markdown 格式排版
- 回答控制在 300 字以內，除非學生要求詳細解釋
- 如果學生問的問題超出金融商品行銷範圍，溫和地引導回來
- 不涉及具體投資建議或個股推薦`;

export function buildSystemPrompt(
  weekContext?: string,
  glossaryContext?: string,
  lessonContext?: string,
): string {
  let prompt = PROFESSOR_LIN_SYSTEM;

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
